import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShareScreenButton } from "../components/ShareScreeenButton";
import { ChatButton } from "../components/ChatButton";
import { VideoPlayer } from "../components/VideoPlayer";
import { PeerState } from "../reducers/peerReducer";
import { RoomContext } from "../context/RoomContext";
import { Chat } from "../components/chat/Chat";
import { NameInput } from "../common/Name";
import { ws } from "../ws";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CameraButton } from "../components/CameraButton";
import { MicButton } from "../components/MicButton";
import { CancelButton } from "../components/CancelButton"; 

export const Room = () => {
    const { id } = useParams();
    const { stream, screenStream, peers, shareScreen ,screenSharingId, setRoomId,isCameraOn,toggleCamera,isMicOn,toggleMicro,CancelCall } =
        useContext(RoomContext);
    const { userName, userId } = useContext(UserContext);
    const { toggleChat, chat } = useContext(ChatContext);

    useEffect(() => {
        if (stream)
            ws.emit("join-room", { roomId: id, peerId: userId, userName });
    }, [id, userId, stream, userName]);

    useEffect(() => {
        setRoomId(id || "");
    }, [id, setRoomId]);

    const screenSharingVideo =
        screenSharingId === userId
            ? screenStream
            : peers[screenSharingId]?.stream;

    const { [screenSharingId]: sharing, ...peersToShow } = peers;

    return (
        <div className="flex flex-col min-h-screen">
            <div className="bg-red-500 p-4 text-white">
                Room id {id}
                <CopyToClipboard text={id || ""}>
                    <button style={{ marginLeft: "20px" }}>
                        Copy
                    </button>
                </CopyToClipboard>
            </div>

            <div className="flex grow">
                {screenSharingVideo && (
                    <div className="w-4/5 pr-4">
                        <div className="relative h-full">
                            <VideoPlayer stream={screenSharingVideo} isScreenSharing={true} />
                        </div>
                    </div>
                )}
                <div
                    className={`grid gap-4 ${screenSharingVideo ? "w-1/5 grid-col-1" : "grid-cols-4"
                        }`}
                >
                    {screenSharingId !== userId && (
                        <div>
                            <VideoPlayer stream={stream} />
                            <NameInput />
                        </div>
                    )}

                    {Object.values(peersToShow as PeerState)
                        .filter((peer) => !!peer.stream)
                        .map((peer) => (
                            <div key={peer.peerId}>
                                <VideoPlayer stream={peer.stream} />
                                <div>{peer.userName}</div>
                            </div>
                        ))}
                </div>
                {chat.isChatOpen && (
                    <div className="border-l-2 pb-28">
                        <Chat />
                    </div>
                )}
            </div>

            <div className="h-28 fixed bottom-0 p-6 w-full flex items-center justify-center border-t-2 bg-white">
                <CameraButton onClick={toggleCamera} isCameraOn={isCameraOn} />
                <MicButton onClick={toggleMicro} isMicOn={isMicOn} />
                <ShareScreenButton onClick={shareScreen} />
                <ChatButton onClick={toggleChat} />
                <CancelButton onClick={CancelCall} />
            </div>
        </div>
    );
};
