import { GameAction, GameState } from "./game";

// message type - determines what type of ws message type
export const messageType = {
  CONNECTION: 0x01,
  GAME_ACTION: 0x02,
  GAME_STATE: 0x03,
} as const;
export type MessageType = (typeof messageType)[keyof typeof messageType];

export const connectionStatus = {
  CONNECTED: 0x10,
  DISCONNECTED: 0x11,
};
export type ConnectionStatus =
  (typeof connectionStatus)[keyof typeof connectionStatus];

// WS communication
// discriminated unions for type safety

// base required properties
interface BaseMessage {
  type: MessageType;
  clientId: string;
}

interface ConnectionMessage extends BaseMessage {
  type: typeof messageType.CONNECTION;
  status: ConnectionStatus;
}

interface GameActionMessage extends BaseMessage {
  type: typeof messageType.GAME_ACTION;
  status: GameAction;
}

interface GameStateMessage extends BaseMessage {
  type: typeof messageType.GAME_STATE;
  status: GameState;
}

export type GameMessage =
  | ConnectionMessage
  | GameActionMessage
  | GameStateMessage;
