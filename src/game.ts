import { WebSocket } from "ws";

// handle connection to game
export function handleConnection(ws: WebSocket) {
  ws.on("message", (message) => {
    console.log("Message:", message);
  });

  ws.on("close", () => {
    console.log("client disconnected.");
  });
}
