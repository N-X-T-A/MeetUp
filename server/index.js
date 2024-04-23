const express = require("express");
const https = require("https");
const { Server } = require("socket.io");
const { ExpressPeerServer } = require("peer");
const os = require("os");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { roomHandler } = require("./room");
const authRouter = require("./api/auth");

const app = express();
const PORT = 5000;

//we want to get the interfaces
const interfaces = os.networkInterfaces();
const netkeys = Object.keys(interfaces);

//internal family
for (const net of netkeys) {
  const network = interfaces[net];
  for (const anet of network) {
    if (anet.family != "IPv4") continue;
    if (!anet.internal) {
      externalIP = anet.address;
      console.log(`Running on https://${externalIP}:${PORT}`);
      break;
    }
  }
}

app.get("/api/getExternalIP", (req, res) => {
  res.json({ externalURL: `https://${externalIP}:${PORT}` });
});

//website
app.use("/", express.static(path.join(__dirname, "dist")));

// Handle HTML5 routing fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

//cors
app.use(
  cors({
    allowedHeaders: "*",
    origin: "*",
    methods: "*",
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);
//keys and certificatse
const key = fs.readFileSync(path.join(__dirname, "key.pem"), {
  encoding: "utf-8",
});
const cert = fs.readFileSync(path.join(__dirname, "cert.pem"), {
  encoding: "utf-8",
});

//server
const server = https.createServer(
  {
    cert,
    key,
  },
  app
);

//peer server
const peer = ExpressPeerServer(server, {
  debug: true,
  path: "/",
});

//listen on peer for peer
app.use("/peer", peer);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  roomHandler(socket);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Mount auth router
app.use("/api/auth", authRouter);
// app.listen(3000, () => {
//   console.log(`running at 3000`);
// });
//listen on port for website
server.listen(PORT);

module.exports = app;
