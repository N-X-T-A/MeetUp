import { useContext } from "react";
import { VideoPlayer } from "../components/VideoPlayer"
import { RoomContext } from "../context/RoomContext";
import { CameraButton } from "../components/CameraButton";
import { MicButton } from "../components/MicButton";
import { Button } from "../components/common/Button";
import { useNavigate } from "react-router-dom";

// interface RoomValue {
//     isCameraOn: boolean
//     isMicOn: boolean
//     setIsCameraOn : (isCameraOn: boolean) => void
//     setIsMicOn : (isMicOn: boolean) => void
// }

// export const RoomReadyContext = createContext<RoomValue>({
//     isCameraOn: true,
//     isMicOn: true,
//     setIsCameraOn: (isCameraOn) => {},
//     setIsMicOn: (isMicOn) => {},
// });

export const Ready = () => {
    const { stream } = useContext(RoomContext);
    const navigate = useNavigate();
    const {roomId,isCameraOn,toggleCamera,isMicOn,toggleMicro} = useContext(RoomContext);

    const enterRoom = () => {
        navigate(`/room/${roomId}`);
    };

    return (
        <div>
            <div style={{width: "50%"}}>
                <VideoPlayer stream={stream} />
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
    )
}