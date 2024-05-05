// import React, { useContext } from "react";
// import { RoomContext } from "../context/RoomContext";

// export const Test: React.FC = () => {
//   const {
//     audioInputDevices,
//     audioOutputDevices,
//     videoInputDevices,
//     changeAudioInputDevice,
//     changeAudioOutputDevice,
//     changeVideoInputDevice,
//   } = useContext(RoomContext);

//   const handleChange = (
//     event: React.ChangeEvent<HTMLSelectElement>,
//     changeDevice: ((deviceId: string) => void) | undefined
//   ) => {
//     const deviceId = event.target.value;
//     if (changeDevice) {
//       changeDevice(deviceId);
//     } else {
//       console.error("Change device function is undefined!");
//     }
//   };

//   return (
//     <div>
//       <label htmlFor="audioInput">Audio Input:</label>
//       <select
//         id="audioInput"
//         onChange={(e) => handleChange(e, changeAudioInputDevice)}
//       >
//         {audioInputDevices &&
//           audioInputDevices.map((device) => (
//             <option key={device.deviceId} value={device.deviceId}>
//               {device.label}
//             </option>
//           ))}
//       </select>

//       <label htmlFor="audioOutput">Audio Output:</label>
//       <select
//         id="audioOutput"
//         onChange={(e) => handleChange(e, changeAudioOutputDevice)}
//       >
//         {audioOutputDevices &&
//           audioOutputDevices.map((device) => (
//             <option key={device.deviceId} value={device.deviceId}>
//               {device.label}
//             </option>
//           ))}
//       </select>

//       <label htmlFor="videoInput">Video Input:</label>
//       <select
//         id="videoInput"
//         onChange={(e) => handleChange(e, changeVideoInputDevice)}
//       >
//         {videoInputDevices &&
//           videoInputDevices.map((device) => (
//             <option key={device.deviceId} value={device.deviceId}>
//               {device.label}
//             </option>
//           ))}
//       </select>
//     </div>
//   );
// };
import React, { useContext, useEffect, useRef, useState } from "react";
import { VideoPlayer } from "../components/VideoPlayer";
import { UserContext } from "../context/UserContext";
import { RoomContext } from "../context/RoomContext";
export const Test: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isSoundDetected, setIsSoundDetected] = useState(false);
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(true);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const { stream, isMicOn, isHandRaised } = useContext(RoomContext);
  const { userName } = useContext(UserContext);
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

  const toggleMicrophone = () => {
    setIsMicrophoneActive((prevState) => !prevState);
  };

  return (
    <div className="App">
      <div
        className={isSoundDetected ? "highlight" : ""}
        ref={divRef}
        style={{
          border: "5px solid",
          borderColor: isSoundDetected ? "blue" : "black",
        }}
      >
        <VideoPlayer
          stream={stream}
          userName={userName + " (You)"}
          isMicOn={isMicOn}
          isHandRaised={isHandRaised}
        />
      </div>
      <button onClick={toggleMicrophone}>
        {isMicrophoneActive ? "Stop Microphone" : "Start Microphone"}
      </button>
    </div>
  );
};
