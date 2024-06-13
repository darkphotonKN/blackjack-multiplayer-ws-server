import WebSocket from "ws";
import { decodeAction, encodeClients } from "./utils/bufferConversion";
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
  clients.set(id, `client-${clients.size + 1}`);

  // send their unique identifier to the client
  ws.send(JSON.stringify({ id }));

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("message", (data) => {
    console.log("Received data:", data);

    const { clientId, actionType, actionData } = decodeAction(data);

    console.log("clientId received:", clientId);
    console.log("actionType received:", actionType);
    console.log("actionData received:", actionData);

    console.log("clients:", clients);

    const encodedClients = encodeClients(clients);

    ws.send(encodedClients);
  });

  ws.on("close", (data) => {
    console.log("Client disconnected.");

    // remove from connected clients
  });
}
