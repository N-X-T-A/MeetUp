import { useEffect, useRef, useContext } from "react";
import "../css/components/VideoPlayer.css";
interface VideoPlayerProps {
  stream?: MediaStream;
  isScreenSharing?: boolean;
  userName?: string;
  isMicOn?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  stream,
  isScreenSharing,
  userName,
  isMicOn,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

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
        <div className="user">
          <p className="userName">{userName}</p>
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
