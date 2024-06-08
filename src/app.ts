import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import { handleConnection } from "./game";

// setup env
dotenv.config();

// create express App
const app = express();

const server = createServer(app);

// socket io connection
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", handleConnection);

app.get("/", (req, res) => {
  res.send("Blackjack Game");
});

server.listen(process.env.PORT, () =>
  console.log(`server listening on port ${process.env.PORT}`),
);
