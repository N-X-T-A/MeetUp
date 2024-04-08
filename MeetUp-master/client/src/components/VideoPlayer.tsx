import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  stream?: MediaStream;
  isScreenSharing?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  stream,
  isScreenSharing,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
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
    </div>
  );
};
