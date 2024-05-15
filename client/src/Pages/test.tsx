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
