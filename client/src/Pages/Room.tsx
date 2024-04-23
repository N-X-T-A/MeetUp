import { useContext, useEffect, useState } from "react";
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
  } = useContext(RoomContext);
  const { userName, userId } = useContext(UserContext);
  const { toggleChat, chat } = useContext(ChatContext);
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState<boolean>(false);
  // const [isMultipleUsers, setIsMultipleUsers] = useState<boolean>(false);

  // const bounds = { left: 0, top: 0, right: 142, bottom: 435 };

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
    console.log("List of peers in the room:");
    Object.values(peers).forEach((peer) => {
      console.log("Username:", peer.userName);
    });

    // if (Object.keys(peers).length > 1) {
    //   setIsMultipleUsers(true);
    // } else {
    //   setIsMultipleUsers(false);
    // }
  }, [peers]);

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
            <div>
              <VideoPlayer
                stream={stream}
                userName={userName + " (You)"}
                isMicOn={isMicOn}
              />
            </div>
          )}

          {Object.values(peersToShow as PeerState)
            .filter((peer) => !!peer.stream)
            .map((peer) => (
              <div key={peer.peerId}>
                <VideoPlayer
                  stream={peer.stream}
                  userName={peer.userName}
                  isMicOn={peer.isMicOn}
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
        <CancelButton onClick={CancelCall} />
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
