import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export const Test: React.FC = () => {
  const navigate = useNavigate();
  const { setUserName } = useContext(UserContext);

  useEffect(() => {
    setUserName("");
    navigate("/");
  });

  return null;
};
