import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShareScreenButton } from "../components/ShareScreeenButton";
import { ChatButton } from "../components/ChatButton";
import { VideoPlayer } from "../components/VideoPlayer";
import { PeerState } from "../reducers/peerReducer";
import { RoomContext } from "../context/RoomContext";
import { Chat } from "../components/chat/Chat";
import { ws } from "../ws";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CameraButton } from "../components/CameraButton";
import { MicButton } from "../components/MicButton";
import { CancelButton } from "../components/CancelButton";
import { Button } from "../components/common/Button";
import Draggable from "react-draggable";
import "../css/pages/room.css";
import { HandRaiseButton } from "../components/HandRaiseButton";
export const Room = () => {
  const { id } = useParams();
  const {
    stream,
    screenStream,
    peers,
    shareScreen,
    screenSharingId,
    setRoomId,
    isCameraOn,
    toggleCamera,
    isMicOn,
    toggleMicro,
    CancelCall,
    HandRaise,
    isHandRaised,
    audioInputDevices,
    changeAudioInputDevice,
    audioOutputDevices,
    changeAudioOutputDevice,
    videoInputDevices,
    changeVideoInputDevice,
    loadSelectedVideoDevice,
    isSoundDetected,
  } = useContext(RoomContext);
  const { userName, userId } = useContext(UserContext);
  const { toggleChat, chat } = useContext(ChatContext);
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  // const [isMultipleUsers, setIsMultipleUsers] = useState<boolean>(false);
  // const bounds = { left: 0, top: 0, right: 142, bottom: 435 };
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(
    loadSelectedVideoDevice()
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    changeDevice: ((deviceId: string) => void) | undefined
  ) => {
    const deviceId = event.target.value;
    setSelectedDeviceId(deviceId);
    if (changeDevice) {
      changeDevice(deviceId);
    } else {
      console.error("Change device function is undefined!");
    }
  };

  useEffect(() => {
    if (!userName) {
      alert("Bạn cần đăng nhập để tham gia phòng");
      const currentURL: string = window.location.href;
      localStorage.setItem("currentURL", currentURL);
      navigate(`/login`);
    }
  }, [userName, navigate]);

  useEffect(() => {
    if (isReady && stream) {
      ws.emit("join-room", { roomId: id, peerId: userId, userName });
    }
  }, [isReady, id, userId, userName, stream]);

  useEffect(() => {
    setRoomId(id || "");
  }, [id, setRoomId]);
  useEffect(() => {
    console.log("List of peers raise hand in the room:");
    Object.values(peers).forEach((peer) => {
      if (peer.isHandRaised) {
        console.log("Username:", peer.userName);
      }
    });
  }, [peers, isHandRaised]);

  useEffect(() => {
    setSelectedDeviceId(loadSelectedVideoDevice());
  }, [videoInputDevices]);

  // useEffect(() => {
  //   // Đếm số lượng peers và log ra console
  //   const numberOfPeers = Object.values(peers).length;
  //   console.log("Number of peers:", numberOfPeers);
  // }, [peers]);

  const screenSharingVideo =
    screenSharingId === userId ? screenStream : peers[screenSharingId]?.stream;

  const { [screenSharingId]: sharing, ...peersToShow } = peers;

  const enterRoom = () => {
    setIsReady(true);
  };

  if (!userName) return null;

  return isReady ? (
    <div className="flex flex-col min-h-screen m-5 py-3">
      {/* <div className="bg-red-500 p-4 text-white">
        Room id {id}
        <CopyToClipboard text={id || ""}>
          <button style={{ marginLeft: "20px" }}>Copy</button>
        </CopyToClipboard>
      </div> */}

      <div>
        {screenSharingVideo && (
          <div className="w-4/5 pr-4">
            <div className="relative h-full">
              <VideoPlayer stream={screenSharingVideo} isScreenSharing={true} />
            </div>
          </div>
        )}
        <div className="peer-grid">
          {screenSharingId !== userId && (
            <div
              className={isSoundDetected ? "highlight" : ""}
              ref={divRef}
              style={{
                border: "5px solid",
                borderColor: isSoundDetected ? "green" : "black",
              }}
            >
              <VideoPlayer
                stream={stream}
                userName={userName + " (You)"}
                isMicOn={isMicOn}
                isHandRaised={isHandRaised}
              />
            </div>
          )}

          {Object.values(peersToShow as PeerState)
            .filter((peer) => !!peer.stream)
            .map((peer) => (
              <div
                key={peer.peerId}
                className={peer.isSpeaking ? "highlight" : ""}
                ref={divRef}
                style={{
                  border: "5px solid",
                  borderColor: peer.isSpeaking ? "green" : "black",
                }}
              >
                <VideoPlayer
                  stream={peer.stream}
                  userName={peer.userName}
                  isMicOn={peer.isMicOn}
                  isHandRaised={peer.isHandRaised}
                />
              </div>
            ))}
        </div>
        {chat.isChatOpen && (
          <div className="border-l-2 pb-28 chat">
            <Chat />
          </div>
        )}
      </div>

      <div className="bottom-bar">
        <CameraButton onClick={toggleCamera} isCameraOn={isCameraOn} />
        <MicButton onClick={toggleMicro} isMicOn={isMicOn} />
        <ShareScreenButton onClick={shareScreen} />
        <ChatButton onClick={toggleChat} />
        <HandRaiseButton onClick={HandRaise} />
        <CancelButton onClick={CancelCall} />
        <div>
          <select
            id="videoInput"
            value={selectedDeviceId || ""}
            onChange={(e) => handleChange(e, changeVideoInputDevice)}
          >
            {videoInputDevices &&
              videoInputDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
          </select>
        </div>
        <select
          id="audioInput"
          onChange={(e) => handleChange(e, changeAudioInputDevice)}
        >
          {audioInputDevices &&
            audioInputDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
        </select>
      </div>
    </div>
  ) : (
    <div>
      <div style={{ width: "50%" }}>
        <VideoPlayer stream={stream} userName={userName} />
      </div>
      <div className="h-28 fixed bottom-0 p-6 w-full flex items-center justify-center border-t-2 bg-white">
        <CameraButton onClick={toggleCamera} isCameraOn={isCameraOn} />
        <MicButton onClick={toggleMicro} isMicOn={isMicOn} />
      </div>
      <div className="flex flex-col">
        <Button onClick={enterRoom} className="py-2 px-8 text-xl">
          Join
        </Button>
      </div>
    </div>
  );
};
