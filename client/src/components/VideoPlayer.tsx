import { useEffect, useRef, useContext } from "react";

import "../css/components/VideoPlayer.css";
import { UserContext } from "../context/UserContext";
interface VideoPlayerProps {
  stream?: MediaStream;
  isScreenSharing?: boolean;
  userName?: string;
  isMicOn?: boolean;
  isHandRaised?: boolean;
  isSoundDetected?: boolean;
  isCameraOn?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  stream,
  isScreenSharing,
  userName,
  isMicOn,
  isHandRaised,
  isCameraOn,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const { Avatar } = useContext(UserContext);

  return (
    <>
      <div
        className={`w-full h-full ${
          isScreenSharing ? "screen-sharing-video" : ""
        }`}
      >
        <video
          data-testid="peer-video"
          style={{ width: "100%" }}
          ref={videoRef}
          autoPlay
          muted={false}
        />

        {isCameraOn === false && (
          <div className="Avatar">
            <Avatar name={userName || ""} size="200" fontSize="30px" />
          </div>
        )}

        <div className="user">
          <p className="userName">
            {isHandRaised === true && (
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
            )}
            {userName}
          </p>
          {isMicOn === false && (
            <div className="iconWrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="red"
                className="w-6 h-6 userMic"
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
        </div>
      </div>
    </>
  );
};
