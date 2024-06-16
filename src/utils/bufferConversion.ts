import { WebSocket, RawData } from "ws";
import { MessageType, messageType } from "../types/general";

// decode action from buffer
export function decodeAction(buffer: RawData): {
  clientId: string;
  actionType: number;
  actionData: string;
} {
  // guarding against non-buffer
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("data is not a buffer.");
  }

  // decode action which is represented by the first index of the Buffer
  const clientIdLength = buffer[0];

  // decode clientId by extracting the subsequent digits of clientId out
  const clientId = buffer.subarray(1, 1 + clientIdLength).toString();

  // extract action typ
  const actionType = buffer[1 + clientIdLength];

  // the remaining buffer will comprise of the action data
  const actionData = buffer.subarray(2 + clientIdLength).toString();

  console.log("clientIdLength:", clientIdLength);
  console.log("actionType:", actionType);
  console.log("clientId decoded:", clientId);
  console.log("actionData decoded:", actionData);
  return { actionType, clientId, actionData };
}

// encode action into a buffer
export function encodeAction(
  clientId: string,
  actionType: number,
  actionData: string,
): Buffer {
  const clientIdBuffer = Buffer.from(clientId);
  const clientIdLengthBuffer = Buffer.from([clientId.length]);
  const actionDataBuffer = Buffer.from(actionData);
  const actionTypeBuffer = Buffer.from([actionType]);

  // construct action package into a single Buffer
  const actionPackageBuffer = Buffer.concat([
    clientIdLengthBuffer,
    clientIdBuffer,
    actionTypeBuffer,
    actionDataBuffer,
  ]);

  console.log("actionPackageBuffer", actionPackageBuffer);
  return actionPackageBuffer;
}

// encode list of clients into a buffer
export function encodeClients(clients: Map<string, WebSocket>): Buffer {
  const clientsJson = JSON.stringify(Object.fromEntries(clients));

  return Buffer.from(clientsJson);
}

// get the message type
export function decodeMessageType(message: Buffer): MessageType {
  // extract the bit responsible for message type

  // extract client id length
  const clientIdLength = message[0];
  const messageTypeBuffer = message[1 + clientIdLength];

  let messageTypeKey: keyof typeof messageType | undefined;
  // check if mesageTypeBuffer matches one of our MessageTypes

  for (let [key, value] of Object.entries(messageType)) {
    if (messageTypeBuffer === value) {
      messageTypeKey = key as keyof typeof messageType;
    }
  }

  if (!messageTypeKey) {
    throw new Error("Decode messageType sent via web socket was invalid.");
  }
  return messageType[messageTypeKey];
}
