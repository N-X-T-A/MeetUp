import { useContext, useState } from "react";
import { RoomContext } from "../context/RoomContext";
import "../css/pages/Home.css"

export const IDInput: React.FC = () => {
    const { roomId, setRoomId} = useContext(RoomContext);
    return(
        <input
            className="input-code"
            placeholder="Enter ID Room"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
        />
    );
};