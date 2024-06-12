import { createServer } from "http";
import { handleConnection } from "./game";
import dotenv from "dotenv";

import { WebSocketServer } from "ws";
import { decodeAction, encodeAction } from "./utils/bufferConversion";

// setup env
dotenv.config();

const testClientId = "1231231QIEQIWEUWQI123";
const actionType = 0x02;
const actionData = "deal";
const encodedBuffer = encodeAction(actionType, testClientId, actionData);
console.log("encodedBuffer:", encodedBuffer);

decodeAction(encodedBuffer);

// create server
const server = createServer();

// create websocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => handleConnection(ws));

const PORT = Number(process.env.PORT) ?? 3030;

server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
