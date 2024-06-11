import WebSocket from "ws";

// handle connection to game
export function handleConnection(ws: WebSocket) {
  ws.send("Connected to WebSocket server");
  console.log("Client connected.");

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("message", (data) => {
    console.log("Received data:", data);
    ws.send(`Echo: ${data}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected.");
  });
}
