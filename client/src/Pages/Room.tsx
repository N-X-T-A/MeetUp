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
import Draggable from "react-draggable";
import "../css/pages/room.css";
import { HandRaiseButton } from "../components/HandRaiseButton";
import { Member } from "../components/MemberList";
import { SettingButton } from "../components/SettingButton";
import { UserListButton } from "../components/UserListButton";

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
  const { userName, userId, Avatar } = useContext(UserContext);
  const { toggleChat, chat } = useContext(ChatContext);
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(
    loadSelectedVideoDevice()
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [showChat, setShowChat] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [copied, setCopied] = useState(false);

  
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
  }, [isHandRaised]);

  useEffect(() => {
    setSelectedDeviceId(loadSelectedVideoDevice());
  }, [videoInputDevices]);

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
          <div className="peer-grid">
            {screenSharingId !== userId && (
              <div
                className={isSoundDetected ? "highlight" : ""}
                ref={divRef}
                style={{
                  border: "5px solid",
                  borderColor: isSoundDetected ? "green" : "black",
                }}>

                {/* {isCameraOn === false && (<div className="Avatar">
                  <Avatar />
                </div>)} */}

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
                  {/* {isCameraOn === false && (<div className="Avatar">
                    <Avatar />
                  </div>)} */}

                  <VideoPlayer
                    stream={peer.stream}
                    userName={peer.userName}
                    isMicOn={peer.isMicOn}
                    isHandRaised={peer.isHandRaised}
                    isCameraOn={isCameraOn}
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
            <div className="sidebar">
              <Member />
            </div>
          </div>
        )}

        {isDialogOpen && (
          <div className="dialog-overlay">
            <div className="dialog">
              <div className="p-5">
                <h1>Thay đổi đầu vào camera</h1>
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
              <div className="p-5">
                <h1>Thay đổi đầu vào Microphone</h1>
                <div className="Mic-Input">
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
            </div>
          </div>
        )}
      </div>

      <div className="row bottom-bar">
        <div className="col d-flex justify-content-center">
          <CopyToClipboard text={id || ""} onCopy={handleCopy}>
            <Button className="p-4 mx-2">
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
