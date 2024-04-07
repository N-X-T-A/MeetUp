import React, { useEffect, useState } from "react";
import { Route, Navigate } from "react-router-dom";
import { Room } from "../Pages/Room";
import { Ready } from "../Pages/Ready";
import { ChatProvider } from "../context/ChatContext";

export function RoomRoute() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <Route
        path="/room"
        element={loggedIn ? <Ready /> : <Navigate to="/login" />}
      />
      <Route
        path="/room/:id"
        element={
          loggedIn ? (
            <ChatProvider>
              <Room />
            </ChatProvider>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </>
  );
}
