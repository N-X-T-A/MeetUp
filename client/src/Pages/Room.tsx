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
import { Background } from "../components/Background";
import { Popup } from "../components/Popup";




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
    audioInputDevices,
    changeAudioInputDevice,
    audioOutputDevices,
    changeAudioOutputDevice,
    videoInputDevices,
    changeVideoInputDevice,
    loadSelectedVideoDevice,
  } = useContext(RoomContext);
  const { userName, userId, isMicOn, isCameraOn, Avatar } = useContext(UserContext);
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [showChat, setShowChat] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
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
    setSelectedDeviceId(loadSelectedVideoDevice());
  }, [videoInputDevices]);

  useEffect(() => {
    setIsSidebarCollapsed(true);
  }, []);

  useEffect(() => {
    setIsSidebarCollapsed(true);
  }, []);

  useEffect(() => {
    const handleUserJoined = (data: { userName: string }) => {
      setPopupMessage(`${data.userName} đã tham gia phòng`);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 100000);
    };

    ws.on("user-joined", handleUserJoined);

    return () => {
      ws.off("user-joined", handleUserJoined);
    };
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
      {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />} 
      <div className="row">
        <div className={`col-md-${isSidebarCollapsed ? "12" : "9"}`}>
          <div
            className={`${
              screenSharingVideo ? "container-str" : "peer-grid"
            }`}
          >
            {screenSharingVideo && (
            <div className="stream-area">
              <div className="relative h-full">
                <VideoPlayer
                  stream={screenSharingVideo}
                  isScreenSharing={true}
                />
              </div>
            </div>
          )}
            {screenSharingId !== userId && (
              <div
                className= {`info-area  ${isSoundDetected ? "highlight" : ""}`}
                ref={divRef}
                style={{
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
                  className={`info-area  ${peer.isSpeaking ? "highlight" : ""}`}
                  ref={divRef}
                  style={{
                    
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
    <div className="Ready">
    <Background></Background>
    <div className="Container">
      <div className="row">
        <div className="col Left-Container">
          <div className="">
          <div className="Camerasite">
            <VideoPlayer stream={stream} userName={userName}/>
          </div>
          <div className="btn-ready py-3">
            <div className="row">
              <div className="col">
                <CameraButton onClick={toggleCamera} isCameraOn={isCameraOn} />
                <MicButton onClick={toggleMicro} isMicOn={isMicOn} />
              </div>
            </div> 
          </div>
          </div>
        </div>
        <div className="col">
          <div className="Right-Container">
            Những người trong phòng
            {Object.values(peersToShow as PeerState)
              .filter((peer) => !!peer.stream)
              .map((peer) => (
                <Avatar name={peer.userName || ""} size="50" fontSize="10px" />
              ))}
            
            <Button onClick={enterRoom} className="Button btn-join">
              Tham Gia
            </Button>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="option-input">
        <div className="row">
          <div className="col">
            <div className="section">
                <label className="label">🎤</label>
                <select
                  className="select"
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

          <div className="col">
            <div className="section">
                <label className="label">Loa</label>
                <select
                  className="select"
                  id="audioOutput"
                  onChange={(e) => handleChange(e, changeAudioOutputDevice)}
                >
                  {audioOutputDevices &&
                    audioOutputDevices.map((device) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </option>
                    ))}
                </select>
              </div>
          </div>

          <div className="col">
            <div className="section">
                <label className="label">Camera</label>
                <select
                  className="select"
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
          </div>
        </div>
    </div>
  </div>
</div>
  );
};
