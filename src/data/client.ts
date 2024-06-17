import { WebSocket } from "ws";

export type Clients = Map<string, WebSocket>;
export const clients: Clients = new Map<string, WebSocket>();
