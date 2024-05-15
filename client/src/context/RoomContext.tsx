import {
  createContext,
  useEffect,
  useState,
  useReducer,
  useContext,
  ReactNode,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { ws } from "../ws";
import { peersReducer, PeerState } from "../reducers/peerReducer";
import {
  addPeerStreamAction,
  addPeerNameAction,
  removePeerStreamAction,
  addAllPeersAction,
  toggleHandRaiseAction,
  toggleAddPeerSpeaking,
} from "../reducers/peerActions";
import { UserContext } from "./UserContext";
import { IPeer } from "../types/peer";

interface RoomValue {
  stream?: MediaStream;
  screenStream?: MediaStream;
  peers: PeerState;
  shareScreen: () => void;
  isCameraOn: boolean;
  toggleCamera: () => void;
  isMicOn: boolean;
  toggleMicro: () => void;
  roomId: string;
  setRoomId: (id: string) => void;
  screenSharingId: string;
  CancelCall: () => void;
  checkCamera: () => Promise<boolean>;
  checkMic: () => Promise<boolean>;
  HandRaise: () => void;
  isHandRaised: boolean;
  audioInputDevices?: MediaDeviceInfo[] | null;
  audioOutputDevices?: MediaDeviceInfo[] | null;
  videoInputDevices?: MediaDeviceInfo[] | null;
  changeAudioInputDevice?: (deviceId: string) => void;
  changeAudioOutputDevice?: (deviceId: string) => void;
  changeVideoInputDevice?: (deviceId: string) => void;
  loadSelectedVideoDevice: () => string | null;
  isSoundDetected: boolean;
}

export const RoomContext = createContext<RoomValue>({
  peers: {},
  shareScreen: () => {},
  isCameraOn: true,
  toggleCamera: () => {},
  isMicOn: true,
  toggleMicro: () => {},
  setRoomId: (id) => {},
  screenSharingId: "",
  roomId: "",
  CancelCall: () => {},
  checkCamera: () => Promise.resolve(false),
  checkMic: () => Promise.resolve(false),
  HandRaise: () => {},
  isHandRaised: false,
  loadSelectedVideoDevice: () =>
    localStorage.getItem("selectedVideoDevice") ?? null,
  isSoundDetected: false,
});

if (!!window.Cypress) {
  window.Peer = Peer;
}

export const RoomProvider: React.FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { userName, userId } = useContext(UserContext);
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [screenStream, setScreenStream] = useState<MediaStream>();
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [screenSharingId, setScreenSharingId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isHandRaised, setisHandRaised] = useState(false);
  const [audioInputDevices, setAudioInputDevices] = useState<
    MediaDeviceInfo[] | null
  >(null);
  const [audioOutputDevices, setAudioOutputDevices] = useState<
    MediaDeviceInfo[] | null
  >(null);
  const [videoInputDevices, setVideoInputDevices] = useState<
    MediaDeviceInfo[] | null
  >(null);

  const [isSoundDetected, setIsSoundDetected] = useState(false);
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(true);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const enterRoom = ({ roomId }: { roomId: "string" }) => {
    navigate(`/room/${roomId}`);
  };

  const getUsers = ({
    participants,
  }: {
    participants: Record<string, IPeer>;
  }) => {
    dispatch(addAllPeersAction(participants));
  };

  const removePeer = (peerId: string) => {
    dispatch(removePeerStreamAction(peerId));
  };

  const switchStream = (stream: MediaStream) => {
    setScreenSharingId(me?.id || "");
    Object.values(me?.connections || "").forEach((connection: any) => {
      const videoTrack: any = stream
        ?.getTracks()
        .find((track) => track.kind === "video");
      connection[0].peerConnection
        .getSenders()
        .find((sender: any) => sender.track.kind === "video")
        .replaceTrack(videoTrack)
        .catch((err: any) => console.error(err));
    });
  };

  const shareScreen = () => {
    if (screenSharingId) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(switchStream);
    } else {
      navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
        switchStream(stream);
        setScreenStream(stream);
      });
    }
  };

  const checkCamera = () => {
    return navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  const checkMic = () => {
    return navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  useEffect(() => {
    const handleSuccess = (stream: MediaStream) => {
      mediaStreamRef.current = stream;
      const audioContext = new AudioContext();
      const audioSource = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      audioSource.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const detectSound = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
        setIsSoundDetected(avg > 20); // Adjust threshold as needed
        requestAnimationFrame(detectSound);
        dispatch(toggleAddPeerSpeaking(userId, avg > 20));
      };

      detectSound();
    };

    const handleError = (error: Error) => {
      console.error("Error accessing microphone:", error);
    };

    if (isMicrophoneActive) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(handleSuccess)
        .catch(handleError);
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }
  }, [isMicrophoneActive]);

  const getUserMedia = () => {
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleCamera = () => {
    // setStream((prevStream) => {
    //   // Đảm bảo stream đã được khởi tạo trước khi thực hiện thay đổi
    //   if (!prevStream) return prevStream;

    //   const videoTrack = prevStream.getVideoTracks()[0];
    //   if (videoTrack) {
    //     // Tắt/bật video track
    //     videoTrack.enabled = !videoTrack.enabled;
    //     setIsCameraOn(videoTrack.enabled);
    //   }
    //   return prevStream.clone();
    // });
    const videoTrack = stream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  const toggleMicro = () => {
    const audioTrack = stream?.getAudioTracks()[0];
    setIsMicrophoneActive((prevState) => !prevState);
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
      ws.emit("toggle-mic", {
        roomId,
        peerId: userId,
        isMicOn: audioTrack.enabled,
      });
    }
  };

  const HandRaise = () => {
    setisHandRaised(!isHandRaised);

    ws.emit("toggle-handraised", {
      roomId,
      peerId: userId,
      isHandRaised: !isHandRaised,
    });

    dispatch(toggleHandRaiseAction(userId, !isHandRaised));
  };

  useEffect(() => {
    ws.emit("check_isSpeaking", {
      roomId,
      peerId: userId,
      isSpeaking: isSoundDetected,
    });
  });

  const changeAudioInputDevice = (deviceId: string) => {
    navigator.mediaDevices
      .getUserMedia({ audio: { deviceId } })
      .then((audioStream) => {
        setStream((prevStream) => {
          const videoTrack = prevStream?.getVideoTracks()[0];
          const newStream = new MediaStream([
            ...audioStream.getAudioTracks(),
            ...(videoTrack ? [videoTrack] : []),
          ]);
          return newStream;
        });
      })
      .catch((error) => {
        console.error("Error changing audio input device:", error);
      });
  };

  const saveSelectedAudioDevice = (deviceId: string) => {
    localStorage.setItem("selectedAudioDevice", deviceId);
  };

  const loadSelectedAudioDevice = (): string | null => {
    return localStorage.getItem("selectedAudioDevice");
  };

  let currentAudioStream: MediaStream | null = null;

  const changeAudioOutputDevice = async (deviceId: string) => {
    try {
      // Stop the current audio stream if it exists
      if (currentAudioStream) {
        currentAudioStream.getTracks().forEach((track) => track.stop());
        currentAudioStream = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const audioStream = audioContext.createMediaStreamSource(stream);
      const destination = audioContext.createMediaStreamDestination();
      const audioElement = new Audio();
      audioElement.srcObject = destination.stream;

      // Set the sinkId to the deviceId of the selected audio output device
      if ("sinkId" in audioElement) {
        await (audioElement as any).setSinkId(deviceId);
        console.log(`Audio output device set to ${deviceId}`);
      } else {
        console.warn("setSinkId is not supported");
      }

      audioStream.connect(destination);
      audioElement.play();

      // Store the current audio stream
      currentAudioStream = destination.stream;
    } catch (error) {
      console.error("Error changing audio output device:", error);
    }
  };

  const changeVideoInputDevice = (deviceId: string) => {
    navigator.mediaDevices
      .getUserMedia({ video: { deviceId } })
      .then((stream) => {
        setStream(stream);
      })
      .catch((error) => {
        console.error("Error changing video input device:", error);
      });
  };

  const saveSelectedVideoDevice = (deviceId: string) => {
    localStorage.setItem("selectedVideoDevice", deviceId);
  };

  const loadSelectedVideoDevice = (): string | null => {
    return localStorage.getItem("selectedVideoDevice");
  };

  const CancelCall = () => {
    navigate(`/`);
    ws.emit("leave-room", { roomId, peerId: userId });
  };

  const nameChangedHandler = ({
    peerId,
    userName,
  }: {
    peerId: string;
    userName: string;
  }) => {
    dispatch(addPeerNameAction(peerId, userName));
  };

  useEffect(() => {
    ws.emit("change-name", { peerId: userId, userName, roomId });
  }, [userName, userId, roomId]);

  // Lấy danh sách thiết bị âm thanh và video
  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const audioInput = devices.filter(
          (device) => device.kind === "audioinput"
        );
        const audioOutput = devices.filter(
          (device) => device.kind === "audiooutput"
        );
        const videoInput = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setAudioInputDevices(audioInput);
        setAudioOutputDevices(audioOutput);
        setVideoInputDevices(videoInput);

        const savedVideoDeviceId = loadSelectedVideoDevice();
        if (savedVideoDeviceId) {
          changeVideoInputDevice(savedVideoDeviceId);
        }
        const savedAudioDeviceId = loadSelectedAudioDevice();
        if (savedAudioDeviceId) {
          changeAudioInputDevice(savedAudioDeviceId);
        }
      })
      .catch((error) => {
        console.error("Error enumerating devices:", error);
      });
  }, []);

  useEffect(() => {
    const peer = new Peer(userId, {
      host: "/",
      path: "peer",
      port: 5000,
      secure: true,
    });

    setMe(peer);

    getUserMedia();

    ws.on("room-created", enterRoom);
    ws.on("get-users", getUsers);
    ws.on("user-disconnected", removePeer);
    ws.on("user-started-sharing", (sharingPeerId) => {
      setScreenSharingId(sharingPeerId);
    });
    ws.on("user-stopped-sharing", () => {
      setScreenSharingId("");
    });
    ws.on("name-changed", nameChangedHandler);

    return () => {
      ws.off("room-created");
      ws.off("get-users");
      ws.off("user-disconnected");
      ws.off("user-started-sharing");
      ws.off("user-stopped-sharing");
      ws.off("user-joined");
      ws.off("name-changed");
      me?.disconnect();
    };
  }, [ws]);

  useEffect(() => {
    if (screenSharingId) {
      ws.emit("start-sharing", { peerId: screenSharingId, roomId });
    } else {
      ws.emit("stop-sharing");
    }
  }, [screenSharingId, roomId]);

  useEffect(() => {
    ws.on("mic-toggled", ({ peerId, isMicOn }) => {
      dispatch({ type: "TOGGLE_MIC", payload: { peerId, isMicOn } });
    });

    return () => {
      ws.off("mic-toggled");
    };
  }, []);

  useEffect(() => {
    ws.on("handraised-toggled", ({ peerId, isHandRaised }) => {
      dispatch({ type: "HAND_RAISED", payload: { peerId, isHandRaised } });
    });

    return () => {
      ws.off("handraised-toggled");
    };
  }, []);

  useEffect(() => {
    ws.on("speaking_Checked", ({ peerId, isSpeaking }) => {
      dispatch({ type: "SPEAKING", payload: { peerId, isSpeaking } });
    });

    return () => {
      ws.off("speaking_Checked");
    };
  }, []);

  useEffect(() => {
    if (!me) return;
    if (!stream) return;
    ws.on("user-joined", ({ peerId, userName: name }: any) => {
      const call = me.call(peerId, stream, {
        metadata: {
          userName,
        },
      });
      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(peerId, peerStream));
      });
      dispatch(addPeerNameAction(peerId, name));

      if (screenSharingId) {
        ws.emit("start-sharing", { peerId: screenSharingId, roomId });
      }
    });

    me.on("call", (call) => {
      const { userName } = call.metadata;
      dispatch(addPeerNameAction(call.peer, userName));
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(call.peer, peerStream));
      });
    });

    return () => {
      ws.off("user-joined");
    };
  }, [me, stream, userName]);

  // useEffect(() => {
  //     ws.on("room-deleted", ({ roomId, reason }) => {
  //         console.log(`Room ${roomId} has been deleted. Reason: ${reason}`);
  //         navigate(`/`);
  //     });

  //     return () => {
  //         ws.off("room-deleted");
  //     };
  // }, [navigate]);

  return (
    <RoomContext.Provider
      value={{
        stream,
        screenStream,
        peers,
        shareScreen,
        roomId,
        setRoomId,
        screenSharingId,
        isCameraOn,
        toggleCamera,
        isMicOn,
        toggleMicro,
        CancelCall,
        checkCamera,
        checkMic,
        HandRaise,
        isHandRaised,
        audioInputDevices,
        audioOutputDevices,
        videoInputDevices,
        changeAudioInputDevice,
        changeAudioOutputDevice,
        changeVideoInputDevice,
        loadSelectedVideoDevice,
        isSoundDetected,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
