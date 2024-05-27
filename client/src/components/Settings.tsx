import React, { useContext, useEffect, useState } from "react";
import "../css/components/Settings.css";
import { RoomContext } from "../context/RoomContext";
import { UserContext } from "../context/UserContext";

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("audio");

  const {
    audioInputDevices,
    changeAudioInputDevice,
    audioOutputDevices,
    changeAudioOutputDevice,
    videoInputDevices,
    changeVideoInputDevice,
    loadSelectedVideoDevice,
  } = useContext(RoomContext);

  const { isMicOn, isCameraOn } = useContext(UserContext);

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
    setSelectedDeviceId(loadSelectedVideoDevice());
  }, [videoInputDevices]);

  return (
    <>
      <h2 className="settings-title">Cài đặt</h2>
      <div className="settings-container">
        <div className="settings-menu">
          <div
            className={`menu-item ${activeTab === "audio" ? "active" : ""}`}
            onClick={() => setActiveTab("audio")}
          >
            Âm thanh
          </div>
          <div
            className={`menu-item ${activeTab === "video" ? "active" : ""}`}
            onClick={() => setActiveTab("video")}
          >
            Video
          </div>
        </div>
        <div className="settings-content">
          {activeTab === "audio" && (
            <div>
              <div className="section">
                <label className="label">Micrô</label>
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
                <div className={`mic-toggle ${isMicOn ? "" : "muted"}`}>
                  {isMicOn ? "Micrô đang bật" : "Micrô đang tắt"}
                </div>
              </div>
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
          )}
          {activeTab === "video" && (
            <div>
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
                <div className={`camera-toggle ${isCameraOn ? "" : "off"}`}>
                  {isCameraOn ? "Máy ảnh đang bật" : "Máy ảnh đang tắt"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
