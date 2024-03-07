import { createContext, useEffect, useState, useReducer, useContext, ReactNode, } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { ws } from "../ws";
import { peersReducer, PeerState } from "../reducers/peerReducer";
import { addPeerStreamAction, addPeerNameAction, removePeerStreamAction, addAllPeersAction } from "../reducers/peerActions";
import { UserContext } from "./UserContext";
import { IPeer } from "../types/peer";

interface RoomValue {
    stream?: MediaStream;
    screenStream?: MediaStream;
    peers: PeerState;
    shareScreen: () => void;
    isCameraOn: boolean
    toggleCamera: () => void;
    isMicOn: boolean
    toggleMicro: () => void;
    roomId: string;
    setRoomId: (id: string) => void;
    screenSharingId: string;
    CancelCall: () => void;
}

export const RoomContext = createContext<RoomValue>({
    peers: {},
    shareScreen: () => { },
    isCameraOn: true,
    toggleCamera: () => { },
    isMicOn: true,
    toggleMicro: () => { },
    setRoomId: (id) => { },
    screenSharingId: "",
    roomId: "",
    CancelCall: () => { },
});

if (!!window.Cypress) {
    window.Peer = Peer;
}

export const RoomProvider: React.FunctionComponent<{ children: ReactNode }> = ({ children }) => {
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
    }

    const toggleCamera = async () => {
        const videoTrack = stream?.getVideoTracks()[0];

        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setIsCameraOn(videoTrack.enabled);
            if (videoTrack.enabled === false) {
                videoTrack.stop();
            } else {
                getUserMedia();
            }
        }
    };

    const toggleMicro = () => {
        const audioTrack = stream?.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    };

    const CancelCall = () => {
        navigate(`/`);
        ws.emit("leave-room", { roomId, peerId: userId })
    }

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

    useEffect(() => {
        const peer = new Peer(userId, {
            host: '/',
            path: 'peer',
            port: 9898,
            secure: true
        });

        setMe(peer);

        getUserMedia();

        ws.on("room-created", enterRoom);
        ws.on("get-users", getUsers);
        ws.on("user-disconnected", removePeer);
        ws.on("user-started-sharing", (sharingPeerId) => { setScreenSharingId(sharingPeerId); });
        ws.on("user-stopped-sharing", () => { setScreenSharingId(""); });
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
            }}
        >
            {children}
        </RoomContext.Provider>
    );
};
