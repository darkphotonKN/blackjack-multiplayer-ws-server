import { WebSocket } from "ws";
import { decodeAction, encodeClients } from "./utils/bufferConversion";
import { v4 as uuid } from "uuid";
import { clients } from "./data/client";

/*TODO:
1. Get rid of clients that disconnect.
2. Track the current turn.
3. Track current moves and values.
*/

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

  // send clients to client

  const encodedClients = encodeClients(clients);

  ws.send(encodedClients);

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
