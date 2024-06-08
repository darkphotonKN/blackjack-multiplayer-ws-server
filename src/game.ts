import { Socket } from "socket.io";

// handle connection to game
export function handleConnection(socket: Socket) {
  socket.on("message", (message) => {
    console.log(`Recieved mesage: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected.");
  });
}
