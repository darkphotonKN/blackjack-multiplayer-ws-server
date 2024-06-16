import { WebSocket } from "ws";
import { v4 as uuid } from "uuid";
import { decodeAction, encodeClients } from "./utils/bufferConversion";
import { clients } from "./data/client";
import { initalizeGame } from "./utils/gameLogic";
import { messageType } from "./types/general";

/*TODO:
- Track the current turn.
- Track current moves and values.
*/

// handle connection to game
export function handleConnection(ws: WebSocket) {
  // notify client that they connected to the game server
  ws.send("Connected to WebSocket server");
  console.log("Client connected.");

  // generate unique identifier for the current client
  const id = uuid();
  // initialize game for client
  initalizeGame(id, ws);

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("message", (data) => {
    console.log("Received data:", data);
    const { clientId, actionType, actionData } = decodeAction(data);

    // determine action type
    console.log("clientId received:", clientId);
    console.log("actionType received:", actionType);
    console.log("actionData received:", actionData);

    console.log("clients:", clients);

    // update current clients
    const encodedClients = encodeClients(clients);

    ws.send(encodedClients);
  });

  ws.on("close", (data) => {
    console.log("Client disconnected. clientId:", id);

    // remove from connected clients
    clients.delete(id);

    // loop and check who is in readyState among the clients
    clients.forEach((client) => {
      // check that client is still ready
      if (client.readyState === WebSocket.OPEN) {
      }
      // inform all ready clients the client that disconnected
      client.send(
        JSON.stringify({
          message: `The client disconnected ${id}`,
          id,
          type: "Disconnection.",
        }),
      );
    });
  });
}
