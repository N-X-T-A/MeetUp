const express = require('express');
const https = require('https');
const { Server } = require("socket.io");
const {ExpressPeerServer} = require('peer');
const os = require('os');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { roomHandler } = require("./room");


const app = express();

const PORT = 9898;

//we want to get the interfaces
const interfaces = os.networkInterfaces();
const netkeys = Object.keys(interfaces);

//internal family
for(const net of netkeys){
    const network = interfaces[net]
    for(const anet of network){
        if(anet.family != 'IPv4') continue;
        console.log(`(${anet.internal ? 'Internal' : 'External'})Running on https://${anet.address}:${PORT}`);
    }
}

//website
app.use('/',express.static(path.join(__dirname,'dist')))

// Handle HTML5 routing fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

//cors
app.use(cors({
    allowedHeaders : '*',
    origin : '*',
    methods : '*'
}))
//keys and certificatse
const key = fs.readFileSync(path.join(__dirname,'key.pem'),{encoding : 'utf-8'});
const cert = fs.readFileSync(path.join(__dirname,'cert.pem'),{encoding : 'utf-8'});

//server
const server = https.createServer({
    cert,
    key 
},app)


//peer server
const peer = ExpressPeerServer(server,{
    debug : true,
    path : "/"
})

//listen on peer for peer
app.use('/peer',peer);

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

//listen on port for website
server.listen(PORT);