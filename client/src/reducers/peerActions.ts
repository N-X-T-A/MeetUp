import { IPeer } from "../types/peer";

export const ADD_PEER_STREAM = "ADD_PEER_STREAM" as const;
export const REMOVE_PEER_STREAM = "REMOVE_PEER_STREAM" as const;
export const ADD_PEER_NAME = "ADD_PEER_NAME" as const;
export const ADD_ALL_PEERS = "ADD_ALL_PEERS" as const;

export const addPeerStreamAction = (peerId: string, stream: MediaStream) => ({
  type: ADD_PEER_STREAM,
  payload: { peerId, stream },
});
export const addPeerNameAction = (peerId: string, userName: string) => ({
  type: ADD_PEER_NAME,
  payload: { peerId, userName },
});
export const removePeerStreamAction = (peerId: string) => ({
  type: REMOVE_PEER_STREAM,
  payload: { peerId },
});

export const addAllPeersAction = (peers: Record<string, IPeer>) => {
  const peersWithDefaults: Record<string, IPeer> = {};
  for (const peerId in peers) {
    peersWithDefaults[peerId] = {
      ...peers[peerId],
      isHandRaised: false,
      isSpeaking: false,
      isMicOn: true,
      isCameraOn: true,
      role: false,
    };
  }
  return {
    type: ADD_ALL_PEERS,
    payload: { peers: peersWithDefaults },
  };
};

export const toggleMicAction = (peerId: string, isMicOn: boolean) => ({
  type: "TOGGLE_MIC",
  payload: { peerId, isMicOn },
});

export const toggleCaneraAction = (peerId: string, isCameraOn: boolean) => ({
  type: "TOGGLE_CAMERA",
  payload: { peerId, isCameraOn },
});

export const toggleHandRaiseAction = (
  peerId: string,
  isHandRaised: boolean
) => ({
  type: "HAND_RAISED" as const,
  payload: { peerId, isHandRaised },
});

export const toggleAddPeerSpeaking = (peerId: string, isSpeaking: boolean) => ({
  type: "SPEAKING" as const,
  payload: { peerId, isSpeaking },
});

export const addPeerRole = (peerId: string, role: boolean) => ({
  type: "ROLE" as const,
  payload: { peerId, role },
});
