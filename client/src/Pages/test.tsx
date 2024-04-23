import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { VideoPlayer } from "../components/VideoPlayer";
import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";
import { CameraButton } from "../components/CameraButton";
import { MicButton } from "../components/MicButton";
import { ShareScreenButton } from "../components/ShareScreeenButton";
import { ChatButton } from "../components/ChatButton";
import { CancelButton } from "../components/CancelButton";
import { ChatContext } from "../context/ChatContext";
import { Chat } from "../components/chat/Chat"; // Import the Chat component

interface AutoLayoutExampleProps {
  numberOfItems: number;
}

function AutoLayoutExample({ numberOfItems }: AutoLayoutExampleProps) {
  const { stream } = useContext(RoomContext);

  const maxCols = 3; // Số cột tối đa trong mỗi hàng
  const maxItemsPerGrid = 9; // Số ô tối đa mà chúng ta muốn hiển thị mỗi lần

  // Tính toán số hàng và số cột dựa trên số lượng items
  let numRows = Math.ceil(numberOfItems / maxCols);
  let numCols = Math.min(numberOfItems, maxCols);

  // Nếu số lượng items vượt quá số lượng ô tối đa, thì chúng ta sẽ hiển thị
  // tối đa số lượng ô tối đa, và tính toán lại số hàng và số cột.
  if (numberOfItems > maxItemsPerGrid) {
    numRows = Math.ceil(maxItemsPerGrid / maxCols);
    numCols = maxCols;
  }

  // Tạo các hàng và cột cho grid
  const rows: JSX.Element[] = [];
  for (let i = 0; i < numRows; i++) {
    const cols: JSX.Element[] = [];
    for (let j = 0; j < numCols; j++) {
      const index = i * maxCols + j;
      // Hiển thị số lượng còn lại khi số lượng vượt quá maxItemsPerGrid
      if (index === maxItemsPerGrid - 1 && numberOfItems > maxItemsPerGrid) {
        cols.push(
          <Col key={index} style={{ backgroundColor: "black", color: "white" }}>
            +{numberOfItems - maxItemsPerGrid + 1}
          </Col>
        );
      } else if (index < numberOfItems) {
        // Hiển thị video player nếu vị trí index cần hiển thị
        cols.push(<Col key={index}>{<VideoPlayer stream={stream} />}</Col>);
      } else {
        // Hiển thị ô trống nếu không đủ items
        cols.push(<Col key={index}></Col>);
      }
    }
    rows.push(<Row key={i}>{cols}</Row>);
  }

  return <Container style={{ width: "60%" }}>{rows}</Container>;
}

export function Test() {
  const [numberOfItems, setNumberOfItems] = useState(9);
  const {
    stream,
    screenStream,
    peers,
    shareScreen,
    screenSharingId,
    setRoomId,
    isCameraOn,
    toggleCamera,
    isMicOn,
    toggleMicro,
    CancelCall,
    checkCamera,
    checkMic,
  } = useContext(RoomContext);
  const { toggleChat, chat } = useContext(ChatContext);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      setNumberOfItems(value);
    }
  };

  const handleCheckCamera = async () => {
    const cameraPermission = await checkCamera();
    console.log("Camera permission:", cameraPermission);
  };

  const handleCheckMic = async () => {
    const micPermission = await checkMic();
    console.log("Mic permission:", micPermission);
  };

  return (
    <div>
      {/* <input
        type="number"
        value={numberOfItems}
        onChange={handleChange}
        min="1"
      />
      <AutoLayoutExample numberOfItems={numberOfItems} />
      <div>
        {chat.isChatOpen && (
          <div className="border-l-2 pb-28">
            <Chat />
          </div>
        )}
      </div>
      <div>
        <div className="h-28 fixed bottom-0 p-6 w-full flex items-center justify-center border-t-2 bg-white">
          <CameraButton onClick={toggleCamera} isCameraOn={isCameraOn} />
          <MicButton onClick={toggleMicro} isMicOn={isMicOn} />
          <ShareScreenButton onClick={shareScreen} />
          <ChatButton onClick={toggleChat} />
          <CancelButton onClick={CancelCall} />
        </div>
      </div> */}

      <div>
        <button onClick={handleCheckCamera}>Check Camera Permission</button>
        <button onClick={handleCheckMic}>Check Mic Permission</button>
      </div>
    </div>
  );
}
