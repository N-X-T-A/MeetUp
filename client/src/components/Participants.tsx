import React, { useContext, useEffect, useState } from "react";
import "../css/components/Participants.css";
import { RoomContext } from "../context/RoomContext";
import { UserContext } from "../context/UserContext";
import { PeerState } from "../reducers/peerReducer";

export const Participants: React.FC = () => {
  const { peers, isHandRaised } = useContext(RoomContext);
  const { Avatar, userName, isMicOn, role } = useContext(UserContext);
  const { ...peersToShow } = peers;
  const [value, setValue] = useState("");

  const checkIfNameMatches = (name: string, value: string) => {
    const nameParts = name.split(" ");
    const initials = nameParts
      .map((part) => part.charAt(0))
      .join("")
      .toLowerCase();
    return initials.includes(value.toLowerCase());
  };

  return (
    <div className="participants-container">
      <div className="header">
        <h2>Mọi người</h2>
        {/* <button className="close-button">×</button> */}
      </div>
      {/* <button className="add-button">
        <span className="icon">+</span>
        Thêm người
      </button> */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm người"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div className="section-title">Đang tham gia cuộc họp</div>

      {Object.values(peers).filter(
        (peer) => !!peer.stream && (peer.isHandRaised || isHandRaised)
      ).length > 0 && (
        <>
          <div className="collaborator">
            <div className="collaborator-header">
              <span>Những người đang giơ tay</span>
            </div>
            {isHandRaised === true && (
              <div className="collaborator-item">
                <div style={{ marginRight: "5%" }}>
                  <Avatar name={userName} size="50" fontSize="40px" />
                </div>
                <div className="info">
                  <span className="name">{userName + " (You)"}</span>
                </div>
                <div className="actions">
                  <span className="hand-icon">
                    <div className="iconWrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
                        />
                      </svg>
                    </div>
                  </span>
                  {/* <span className="more-options">⋮</span> */}
                </div>
              </div>
            )}
            {Object.values(peers)
              .filter((peer) => !!peer.stream && peer.isHandRaised === true)
              .map((peer) => (
                <div className="collaborator-item">
                  <div style={{ marginRight: "5%" }}>
                    <Avatar name={userName} size="50" fontSize="40px" />
                  </div>
                  <div className="info">
                    <span className="name">{peer.userName + " (You)"}</span>
                  </div>
                  <div className="actions">
                    <span className="hand-icon">
                      <div className="iconWrapper">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
                          />
                        </svg>
                      </div>
                    </span>
                    {/* <span className="more-options">⋮</span> */}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      <div className="collaborator">
        <div className="collaborator-header">
          <span>Cộng tác viên</span>
          <span className="count">
            {Object.values(peersToShow as PeerState).filter(
              (peer) => !!peer.stream
            ).length + 1}
          </span>
        </div>
        {checkIfNameMatches(userName, value) && (
          <div className="collaborator-item">
            <div style={{ marginRight: "5%" }}>
              <Avatar name={userName} size="50" fontSize="40px" />
            </div>
            <div className="info">
              <span className="name">{userName + " (You)"}</span>
              {role === true && (
                <span className="role">Người tổ chức cuộc họp</span>
              )}
            </div>
            <div className="actions">
              <span className="mute-icon">
                {isMicOn === false && (
                  <div className="iconWrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="black"
                      className="w-6 h-6"
                    >
                      <>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 19L17.591 17.591L5.409 5.409L4 4"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 18.75C13.5913 18.75 15.1174 18.1179 16.2426 16.9926C17.3679 15.8674 18 14.3413 18 12.75V11.25M12 18.75C10.4087 18.75 8.88258 18.1179 7.75736 16.9926C6.63214 15.8674 6 14.3413 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C11.2044 15.75 10.4413 15.4339 9.87868 14.8713C9.31607 14.3087 9 13.5456 9 12.75V4.5C9 3.70435 9.31607 2.94129 9.87868 2.37868C10.4413 1.81607 11.2044 1.5 12 1.5C12.7956 1.5 13.5587 1.81607 14.1213 2.37868C14.6839 2.94129 15 3.70435 15 4.5V12.75C15 13.5456 14.6839 14.3087 14.1213 14.8713C13.5587 15.4339 12.7956 15.75 12 15.75Z"
                        />
                      </>
                    </svg>
                  </div>
                )}
              </span>
              {/* <span className="more-options">⋮</span> */}
            </div>
          </div>
        )}

        {Object.values(peersToShow as PeerState)
          .filter(
            (peer) =>
              !!peer.stream && checkIfNameMatches(peer.userName || "", value)
          )
          .map((peer) => (
            <div className="collaborator-item" key={peer.peerId}>
              <div style={{ marginRight: "5%" }}>
                <Avatar name={peer.userName || ""} size="50" fontSize="40px" />
              </div>
              <div className="info">
                <span className="name">{peer.userName}</span>
                {peer.role === true && (
                  <span className="role">Người tổ chức cuộc họp</span>
                )}
              </div>
              <div className="actions">
                <span className="mute-icon">
                  {peer.isMicOn === false && (
                    <div className="iconWrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="black"
                        className="w-6 h-6"
                      >
                        <>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 19L17.591 17.591L5.409 5.409L4 4"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 18.75C13.5913 18.75 15.1174 18.1179 16.2426 16.9926C17.3679 15.8674 18 14.3413 18 12.75V11.25M12 18.75C10.4087 18.75 8.88258 18.1179 7.75736 16.9926C6.63214 15.8674 6 14.3413 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C11.2044 15.75 10.4413 15.4339 9.87868 14.8713C9.31607 14.3087 9 13.5456 9 12.75V4.5C9 3.70435 9.31607 2.94129 9.87868 2.37868C10.4413 1.81607 11.2044 1.5 12 1.5C12.7956 1.5 13.5587 1.81607 14.1213 2.37868C14.6839 2.94129 15 3.70435 15 4.5V12.75C15 13.5456 14.6839 14.3087 14.1213 14.8713C13.5587 15.4339 12.7956 15.75 12 15.75Z"
                          />
                        </>
                      </svg>
                    </div>
                  )}
                </span>
                {/* <span className="more-options">⋮</span> */}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
