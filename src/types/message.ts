import { Clients } from "../data/client";
import { Deck, GameAction, GameState } from "./game";

// message type - determines what type of ws message type
export const messageType = {
  CONNECTION: 0x01,
  CLIENTS_LIST: 0x02,
  GAME_ACTION: 0x03,
  GAME_STATE: 0x04,
} as const;
export type MessageType = (typeof messageType)[keyof typeof messageType];

export const clientsList = { CLIENT_LIST: 0x40 } as const;
export type ClientsList = (typeof clientsList)[keyof typeof clientsList];

export const connectionStatus = {
  CONNECTED: 0x10,
  DISCONNECTED: 0x11,
} as const;
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
  actionType: ConnectionStatus;
  actionValue: Clients;
}

interface GameActionMessage extends BaseMessage {
  type: typeof messageType.GAME_ACTION;
  actionType: GameAction;
  actionValue: string;
}

interface GameStateMessage extends BaseMessage {
  type: typeof messageType.GAME_STATE;
  actionType: GameState;
  actionValue: Deck;
}

// Sub set of types based on message type
export type ActionType =
  | ConnectionStatus
  | GameState
  | GameAction
  | ClientsList;

/*
 * Game Message
 *
 * Represented as a buffer from messages transmitted to and from clients.
 *
 * Game Message Buffer Structure
 * ClientIdLength [0] - ClientId [1 -> ClientIdLength] - MessageType[2 + ClientIdLength] -
 * ActionType[3 + ClientIdLength] - ActionValue[4+ ClientIdLength -> BufferLength-1]
 * */
export type GameMessage =
  | ConnectionMessage
  | GameActionMessage
  | GameStateMessage;
