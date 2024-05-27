import React, { useContext, useEffect, useRef, useState } from "react";
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
import "../css/pages/room.css";
import { HandRaiseButton } from "../components/HandRaiseButton";
import { SettingButton } from "../components/SettingButton";
import { UserListButton } from "../components/UserListButton";
import "../../src/css/Button.css";
import { Settings } from "../components/Settings";
import { Participants } from "../components/Participants";

export const Room = () => {
  const { id } = useParams();
  const {
    stream,
    screenStream,
    peers,
    shareScreen,
    screenSharingId,
    setRoomId,
    toggleCamera,
    toggleMicro,
    CancelCall,
    HandRaise,
    isHandRaised,
    isSoundDetected,
  } = useContext(RoomContext);
  const { userName, userId, isMicOn, isCameraOn } = useContext(UserContext);
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [showChat, setShowChat] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    setIsSidebarCollapsed(true);
  }, []);

  const screenSharingVideo =
    screenSharingId === userId ? screenStream : peers[screenSharingId]?.stream;

  const { [screenSharingId]: sharing, ...peersToShow } = peers;

  const enterRoom = () => {
    setIsReady(true);
  };

  if (!userName) return null;

  const handleChatButtonClick = () => {
    setShowChat(!showChat);
    setShowMember(false);
    if (!showMember) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleListButtonClick = () => {
    setShowMember(!showMember);
    setShowChat(false);
    if (!showChat) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return isReady ? (
    <div className="Main">
      <div className="row">
        <div className={`col-md-${isSidebarCollapsed ? "12" : "9"}`}>
          {screenSharingVideo && (
            <div className="w-4/5 pr-4">
              <div className="relative h-full">
                <VideoPlayer
                  stream={screenSharingVideo}
                  isScreenSharing={true}
                />
              </div>
            </div>
          )}
          <div
            className={`${
              screenSharingVideo ? "w-1/5 grid-col-1" : "peer-grid"
            }`}
          >
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
                  isCameraOn={isCameraOn}
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
                    isCameraOn={peer.isCameraOn}
                  />
                </div>
              ))}
          </div>
        </div>

        {showChat && (
          <div className="col-md-3">
            <div className="sidebar">
              <Chat />
            </div>
          </div>
        )}

        {showMember && (
          <div className="col-md-3">
            {/* <div className="sidebar">
              <Member />
            </div> */}
            <Participants />
          </div>
        )}

        {isDialogOpen && (
          <div className="dialog-overlay">
            <div className="dialog">
              <Settings />
            </div>
          </div>
        )}
      </div>

      <div className="row bottom-bar">
        <div className="col d-flex justify-content-center">
          <CopyToClipboard text={id || ""} onCopy={handleCopy}>
            <Button className="Button">
              {copied ? `Đã Sao Chép` : `Room id ${id}`}
            </Button>
          </CopyToClipboard>
        </div>

        <div className="col d-flex justify-content-center">
          <CameraButton onClick={toggleCamera} isCameraOn={isCameraOn} />
          <MicButton onClick={toggleMicro} isMicOn={isMicOn} />
          <ShareScreenButton onClick={shareScreen} />
          <HandRaiseButton onClick={HandRaise} />
          <CancelButton onClick={CancelCall} />
        </div>

        <div className="col d-flex justify-content-center">
          <SettingButton onClick={toggleDialog} />
          <ChatButton onClick={handleChatButtonClick} />
          <UserListButton onClick={handleListButtonClick} />
        </div>
      </div>
    </div>
  ) : (
    <div className="center">
      <div className="contaier">
        <div className="camerasite">
          <VideoPlayer stream={stream} userName={userName} />
        </div>
        <div className="btn-ready py-3">
          <div className="row">
            <div className="col-md-auto">
              <CameraButton onClick={toggleCamera} isCameraOn={isCameraOn} />
              <MicButton onClick={toggleMicro} isMicOn={isMicOn} />
            </div>
            <div className="col col-lg-7">
              <Button onClick={enterRoom} className="Button btn-join">
                Join
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
