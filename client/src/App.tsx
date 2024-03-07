import { useState, useRef, useEffect } from 'react'
import './App.css'
import { Peer } from 'peerjs'

type VideoProps = {
  mute?: boolean,
  strm?: MediaStream
}

function Video(props: VideoProps) {
  const VideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const astrm = props.strm;
    const video = VideoRef.current;
    if (astrm == undefined || video == undefined) return;

    video.srcObject = astrm;

  }, [props.strm])


  return <video muted={props.mute} ref={VideoRef} autoPlay />
}

type PeerProps = {
  open: (id: string) => any
}

function usePeer(props: PeerProps) {
  const [APeer, SetPeer] = useState<Peer>();

  useEffect(() => {
    const peer = new Peer({
      host: '/',
      path: 'peer',
      port: 9898,
      secure: true
    })

    SetPeer(peer);

    peer.on('open', props.open)

    //clean up
    return () => {
      peer.destroy();
    }
  }, [props.open])


  return APeer
}

function App() {
  const [MyId, SetMyId] = useState<string>();
  const [PeerId, SetPeerId] = useState<string>();

  const [MyStream, SetMyStream] = useState<MediaStream>();
  const [ForeignStream, SetForeignStream] = useState<MediaStream>();

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const IDREF = useRef<HTMLInputElement>(null);

  const MyPeer = usePeer({
    open: SetMyId
  })

  //load our stream
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).then((stream) => {
      SetMyStream(stream)
    }).catch((e) => {
      console.log("failed to make a stream", String(e))
    })
  }, [])

  //call a peer
  useEffect(() => {
    if (!MyPeer || typeof PeerId == 'undefined' || !MyStream) return;

    const call = MyPeer.call(PeerId, MyStream);

    call.on('stream', (strm) => {
      SetForeignStream(strm);
    })

  }, [PeerId, MyPeer])


  //answer a stream
  useEffect(() => {
    if (!MyPeer) return;

    MyPeer.addListener('call', (acall) => {
      acall.answer(MyStream);

      acall.on('stream', (strm) => {
        SetForeignStream(strm);
      })
    })

    return () => {
      MyPeer.removeListener('call')
    }
  }, [MyPeer, MyStream])


  const toggleCamera = () => {
    const videoTrack = MyStream?.getVideoTracks()[0];

    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  const toggleMicro = () => {
    const audioTrack = MyStream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  return (
    <div className='PeerContainer'>
      <Video mute={true} strm={MyStream} />
      <Video strm={ForeignStream} />

      <button onClick={toggleCamera}>Camera</button>
      <button onClick={toggleMicro}>Mic</button>
      <label>{`My id : ${MyId}`}</label>
      <input placeholder='Peer Id' ref={IDREF} />
      <button onClick={() => SetPeerId(IDREF.current?.value)}>Call</button>
    </div>
  )
}

export default App
