import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { RoomContext } from "../context/RoomContext";
import { ws } from "../ws";

export const Member: React.FC = () => {
  const { id } = useParams();
  const { userName, userId } = useContext(UserContext);
  const { peers, setRoomId } = useContext(RoomContext);

  useEffect(() => {
    ws.emit("join-room", { roomId: id, peerId: userId, userName });
    setRoomId(id || ""); 
  }, [id, userId, userName, setRoomId]);

  useEffect(() => {
    console.log("List of peers in the room:");
    const userList = Object.values(peers).map((peer) => ({
      Username: peer.userName
    }));
    console.table(userList);

    const numberOfPeers = Object.values(peers).length;
    console.log("Number of peers:", numberOfPeers);
  }, [peers]);

  return (
    <div className="Member flex flex-col h-full justify-between">
      <div className="">
        <h2 className="p-2">Người Dùng Trong Phòng</h2>
        <ul>
          {Object.values(peers).map((peer) => (
            <li className="p-1" key={peer.peerId}>{peer.userName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};


