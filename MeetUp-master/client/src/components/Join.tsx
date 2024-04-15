// import { NameInput } from "../common/Name";
import { Button } from "./common/Button";
import { IDInput } from "../common/IDRoom";
import { ws } from "../ws";
import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../css/pages/Home.css"

export const Join: React.FC = () => {
  const { roomId } = useContext(RoomContext);
  const navigate = useNavigate();
  const { userId, userName } = useContext(UserContext);

  const createRoom = () => {
    if (userName) {
      ws.emit("create-room", { peerId: userId });
    } else {
      alert("Bạn cần đăng nhập để tạo phòng");
      navigate(`/login`);
    }
  };
  const joinRoom = () => {
    if (userName) {
      ws.emit("check-room", { roomId: roomId });

      ws.on("room-exists", () => {
        navigate(`/room/${roomId}`);
      });

      ws.on("room-not-exists", () => {
        alert("Phòng không tồn tại");
      });
    } else {
      alert("Bạn cần đăng nhập để tham gia phòng");
      navigate(`/login`);
    }
  };

  return (
    
    <div className="flex flex-col">
      <div className="btn-join p-2">
      <span className="material-icons key">keyboard</span>
      <IDInput />
      <Button onClick={joinRoom} className="mx-2">
        Join Room
      </Button>
      {/* <NameInput></NameInput> */}
      </div>
      
      <div className="btn-createroom p-2">
      <Button onClick={createRoom} className="mx-2">
        Start new meeting
      </Button>
      </div>
    </div>
  );
};
