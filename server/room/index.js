const { v4: uuidV4 } = require("uuid");

const rooms = {};
const chats = {};

const generateRoomId = () => {
  const uniqueId = uuidV4();
  const formattedId = [uniqueId.slice(0, 3), uniqueId.slice(4, 8)].join("-");
  return formattedId;
};

let hostRoomID = "";

const roomHandler = (socket) => {
  const createRoom = ({ peerId }) => {
    const roomId = generateRoomId();
    rooms[roomId] = {};
    socket.emit("room-created", { roomId });
    console.log(`user created the room: ${roomId}`);
    for (const id in rooms) {
      if (rooms.hasOwnProperty(id)) {
        rooms[id] = {};
        console.log(`${id}`);
      }
    }
    hostRoomID = peerId;
  };

  const checkRoom = ({ roomId }) => {
    if (rooms.hasOwnProperty(roomId)) {
      socket.emit("room-exists");
    } else {
      socket.emit("room-not-exists");
    }
  };

  const joinRoom = ({ roomId, peerId, userName }) => {
    if (!rooms[roomId]) rooms[roomId] = {};
    if (!chats[roomId]) chats[roomId] = [];
    socket.emit("get-messages", chats[roomId]);
    console.log("user joined the room", roomId, peerId, userName);
    rooms[roomId][peerId] = { peerId, userName };
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { peerId, userName });
    socket.emit("get-users", {
      roomId,
      participants: rooms[roomId],
    });

    socket.on("disconnect", () => {
      if (hostRoomID === peerId) {
        console.log("host left the room", peerId);
      } else {
        console.log("user left the room", peerId);
      }
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ peerId, roomId }) => {
    if (hostRoomID === peerId) {
      console.log("host left the room", peerId);
      // delete rooms[roomId];
      // socket.to(roomId).emit("room-deleted", { roomId, reason: "host-left" });
    } else {
      console.log("user left the room", peerId);
    }
    socket.to(roomId).emit("user-disconnected", peerId);
  };

  const startSharing = ({ peerId, roomId }) => {
    console.log({ roomId, peerId });
    socket.to(roomId).emit("user-started-sharing", peerId);
  };

  const stopSharing = (roomId) => {
    socket.to(roomId).emit("user-stopped-sharing");
  };

  const addMessage = (roomId, message) => {
    console.log({ message });
    if (chats[roomId]) {
      chats[roomId].push(message);
    } else {
      chats[roomId] = [message];
    }
    socket.to(roomId).emit("add-message", message);
  };

  const changeName = ({ peerId, userName, roomId }) => {
    if (rooms[roomId] && rooms[roomId][peerId]) {
      rooms[roomId][peerId].userName = userName;
      socket.to(roomId).emit("name-changed", { peerId, userName });
    }
  };

  const toggleMic = ({ roomId, peerId, isMicOn }) => {
    socket.to(roomId).emit("mic-toggled", { peerId, isMicOn });
  };
  const toggleHandRaised = ({ roomId, peerId, isHandRaised }) => {
    socket.to(roomId).emit("handraised-toggled", { peerId, isHandRaised });
  };
  const check_isSpeaking = ({ roomId, peerId, isSpeaking }) => {
    socket.to(roomId).emit("speaking_Checked", { peerId, isSpeaking });
  };
  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("check-room", checkRoom);
  socket.on("start-sharing", startSharing);
  socket.on("stop-sharing", stopSharing);
  socket.on("send-message", addMessage);
  socket.on("change-name", changeName);
  socket.on("leave-room", leaveRoom);
  socket.on("toggle-mic", toggleMic);
  socket.on("toggle-handraised", toggleHandRaised);
  socket.on("check_isSpeaking", check_isSpeaking);
};

module.exports = { roomHandler, generateRoomId };
