import { useContext, useState } from "react";
import { RoomContext } from "../context/RoomContext";

export const IDInput: React.FC = () => {
    const { roomId, setRoomId} = useContext(RoomContext);
    return(
        <input
            className="border rounded-md p-2 h-10 my-2 w-full"
            placeholder="Enter ID Room"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
        />
    );
};