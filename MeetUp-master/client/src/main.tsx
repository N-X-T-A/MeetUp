import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RoomProvider } from "./context/RoomContext";
import { Home } from "./Pages/Home";
import { Room } from "./Pages/Room";
import { Login } from "./Pages/Login";
import { Register } from "./Pages/Register";
import { UserProvider } from "./context/UserContext";
import { ChatProvider } from "./context/ChatContext";
import { Test } from "./Pages/test";


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <UserProvider>
        <RoomProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/test" element={<Test />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/room/:id"
              element={
                <ChatProvider>
                  <Room />
                </ChatProvider>
              }
            />
            
          </Routes>
          
        </RoomProvider>
      </UserProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
