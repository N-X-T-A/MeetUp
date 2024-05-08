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
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

export const Test: React.FC = () => {
  const { Avatar } = useContext(UserContext);

  return (
    <div className="App">
      <Avatar />
    </div>
  );
};
