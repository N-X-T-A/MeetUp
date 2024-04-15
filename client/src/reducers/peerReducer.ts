import { IPeer } from "../types/peer";
import {
  ADD_PEER_STREAM,
  REMOVE_PEER_STREAM,
  ADD_PEER_NAME,
  ADD_ALL_PEERS,
} from "./peerActions";

export type PeerState = Record<
  string,
  { stream?: MediaStream; userName?: string; peerId: string; isMicOn?: boolean }
>;

type PeerAction =
  | {
      type: typeof ADD_PEER_STREAM;
      payload: { peerId: string; stream: MediaStream };
    }
  | {
      type: typeof REMOVE_PEER_STREAM;
      payload: { peerId: string };
    }
  | {
      type: typeof ADD_PEER_NAME;
      payload: { peerId: string; userName: string };
    }
  | {
      type: typeof ADD_ALL_PEERS;
      payload: {
        peers: Record<string, IPeer>;
      };
    }
  | {
      type: "TOGGLE_MIC";
      payload: { peerId: string; isMicOn: boolean };
    };

export const peersReducer = (
  state: PeerState,
  action: PeerAction
): PeerState => {
  switch (action.type) {
    case ADD_PEER_STREAM:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          stream: action.payload.stream,
        },
      };
    case ADD_PEER_NAME:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          userName: action.payload.userName,
        },
      };
    case REMOVE_PEER_STREAM:
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          stream: undefined,
        },
      };
    case ADD_ALL_PEERS:
      return { ...state, ...action.payload.peers };
    case "TOGGLE_MIC":
      return {
        ...state,
        [action.payload.peerId]: {
          ...state[action.payload.peerId],
          isMicOn: action.payload.isMicOn,
        },
      };
    default:
      return { ...state };
  }
};

/**
 * ...state: Đây là cách sao chép toàn bộ trạng thái hiện tại của ứng dụng. 
 Khi thay đổi trạng thái, Redux yêu cầu trả về một bản sao của trạng thái cũ, không thay đổi trực tiếp trạng thái hiện tại.

[action.payload.peerId]: {...}: Đoạn mã này là để cập nhật thông tin của một đối tượng trong trạng thái Redux. 
action.payload.peerId là một ID duy nhất đại diện cho một peer cụ thể.

...state[action.payload.peerId]: Đây là cách sao chép thông tin của peer cụ thể mà chúng ta đang thay đổi. 
Bằng cách này, Redux không bị ảnh hưởng bởi việc thay đổi trực tiếp các đối tượng trong trạng thái.

stream: action.payload.stream: Đây là cách cập nhật thông tin mới cho peer. Trong trường hợp này, đang thêm một stream mới cho peer với ID là action.payload.peerId.
 */
