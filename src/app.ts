import { createServer } from "http";
import { handleConnection } from "./game";
import dotenv from "dotenv";

import { WebSocketServer } from "ws";

// setup env
dotenv.config();

// create server
const server = createServer();

// create websocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => handleConnection(ws));

const PORT = Number(process.env.PORT) ?? 3030;

server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
