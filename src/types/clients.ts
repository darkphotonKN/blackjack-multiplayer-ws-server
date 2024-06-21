import { WebSocket } from "ws";

export type Clients = Map<string, WebSocket>;
export type ClientInformation = {
  clientId: string;
  clientIdList: string[];
};
