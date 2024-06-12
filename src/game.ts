import WebSocket from "ws";
import { decodeAction, encodeAction } from "./utils/bufferConversion";
import { v4 as uuid } from "uuid";
import { clients } from "./data/users";

// handle connection to game
export function handleConnection(ws: WebSocket) {
  // notify client that they connected to the game server
  ws.send("Connected to WebSocket server");
  console.log("Client connected.");

  // generate unique identifier for the current client
  const id = uuid();

  // store user with generated id
  clients.set(id, ws);

  // send their unique identifier to the client
  ws.send(JSON.stringify({ id }));

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("message", (data) => {
    console.log("Received data:", data);

    const action = decodeAction(data);

    const encodedAction = encodeAction("testerson");

    // check clients
    console.log("client from map:", clients.get(id)?.url);
  });

  ws.on("close", () => {
    console.log("Client disconnected.");
  });
}
