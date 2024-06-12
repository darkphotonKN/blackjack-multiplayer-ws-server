import WebSocket from "ws";

// decode action from buffer
export function decodeAction(buffer: WebSocket.RawData): {
  actionType: number;
} {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("data is not a buffer.");
  }

  // decode action which is represented by the first index of the Buffer
  const actionType = buffer[0];

  console.log("actionType:", actionType);

  return { actionType };
}

// encode action into a buffer
export function encodeAction(action: string): Buffer {
  const encodedAction = Buffer.from(action);

  console.log("encodedAction", encodedAction);
  return encodedAction;
}
