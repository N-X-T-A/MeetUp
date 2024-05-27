# **WebRTC**

## **What is WebRTC?**
WebRTC stands for Web Real-Time Communication. It is an open-source project that enables real-time communication of audio, video, and data directly between web browsers and mobile applications. WebRTC eliminates the need for plugins or third-party software by leveraging browser APIs.

## **How Does WebRTC Work?**
WebRTC operates through a set of APIs and protocols that facilitate peer-to-peer communication. Here's a simplified overview of its functioning:

1. **getUserMedia**: WebRTC begins by accessing the user's media devices such as a webcam and microphone using the `getUserMedia` API. This allows the browser to capture audio and video streams.

2. **RTCPeerConnection**: Once the media streams are captured, WebRTC establishes a peer-to-peer connection using the `RTCPeerConnection` API. This connection is encrypted to ensure security and privacy.

3. **ICE (Interactive Connectivity Establishment)**: WebRTC utilizes ICE to establish a connection between peers across various networks, including NATs and firewalls. ICE helps in determining the best possible route for data transmission.

4. **STUN (Session Traversal Utilities for NAT)**: If direct peer-to-peer communication is not possible due to network configurations, WebRTC employs STUN servers to discover the public IP address and port of a user's device.

5. **TURN (Traversal Using Relays around NAT)**: In cases where direct communication and STUN fail, WebRTC falls back to TURN servers. TURN servers act as relay points for media streams, facilitating communication between peers by relaying data.

6. **Signaling**: WebRTC requires a signaling mechanism to exchange metadata such as session initiation, network information, and media codecs between peers. Signaling can be implemented using various methods like WebSocket, HTTP, or a dedicated signaling server.

7. **Media Communication**: Once the peer connection is established and signaling is complete, WebRTC enables real-time communication of audio, video, and data directly between peers, bypassing intermediary servers.

## **Example**
```javascript
// Get access to user's media devices
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(function(stream) {
    // Create a new RTCPeerConnection
    const peerConnection = new RTCPeerConnection();

    // Add the stream to the peer connection
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    // Implement ICE, STUN, TURN, and signaling logic here

    // Example of sending media stream to a remote peer
    const remotePeerConnection = new RTCPeerConnection();
    remotePeerConnection.addStream(stream);

    // Implement ICE, STUN, TURN, and signaling logic for remote peer connection

  })
  .catch(function(err) {
    console.error("Error accessing media devices: " + err);
  });
```

## **How to install**

### 1. First go to client to build front end

	npm install
	npm run build
### 2. Next go to server

	npm install
### To run app use `npm run dev` in server folder
