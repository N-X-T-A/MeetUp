import React, { useContext } from "react";
import { RoomContext } from "../context/RoomContext";
import "../css/Join.css";

export const IDInput: React.FC = () => {
  const { roomId, setRoomId } = useContext(RoomContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");

    if (value.length > 3) {
      value = `${value.slice(0, 3)}-${value.slice(3, 7)}`;
    }

    if (value.length > 8) {
      value = value.slice(0, 8);
    }

    setRoomId(value);
  };

  return (
    <input
      className="Input-ID"
      placeholder="Enter ID Room"
      onChange={handleChange}
      value={roomId}
      pattern="\d{3}-\d{4}"
      title="ID Room must be in the format xxx-xxxx"
      required
    />
  );
};