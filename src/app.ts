import express from "express";
import { Server, createServer } from "http";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import { handleConnection } from "./game";

// setup env
dotenv.config();

// create express App
const app = express();

const server = new Server(app);

// create web socket server
const wss = new WebSocketServer({ server });

wss.on("connection", handleConnection);

app.get("/", (req, res) => {
  res.send("Blackjack!!");
});

app.listen(process.env.PORT, () =>
  console.log(`server listening on port ${process.env.PORT}`),
);
