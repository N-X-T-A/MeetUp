import { NameInput } from "../common/Name";
import { Button } from "./common/Button";
import { IDInput } from "../common/IDRoom";
import { ws } from "../ws";
import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

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
    <div className=" flex flex-col">
      <Button onClick={createRoom} className="py-2 px-8 text-xl">
        Start new meeting
      </Button>
      <IDInput />
      <Button onClick={joinRoom} className="py-2 px-8 text-xl">
        Join Room
      </Button>
    </div>
  );
};
