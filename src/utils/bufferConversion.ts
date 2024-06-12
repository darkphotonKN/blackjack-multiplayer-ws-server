import WebSocket from "ws";

// decode action from buffer
export function decodeAction(buffer: WebSocket.RawData): {
  actionType: number;
  clientId: string;
  actionData: string;
} {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("data is not a buffer.");
  }

  // decode action which is represented by the first index of the Buffer
  const actionType = buffer[0];
  const clientIdLength = buffer[1];

  console.log("actionType:", actionType);
  console.log("clientIdLength:", clientIdLength);

  // decode clientId by extracting the subsequent digits of clientId out
  const clientId = buffer.subarray(2, clientIdLength).toString();

  // the remaining buffer will comprise of the action data
  const actionData = buffer.subarray(2 + clientIdLength).toString();

  console.log("clientId decoded:", clientId);
  console.log("actionData decoded:", actionData);
  return { actionType, clientId, actionData };
}

// encode action into a buffer
export function encodeAction(
  actionType: number,
  clientId: string,
  actionData: string,
): Buffer {
  const clientIdBuffer = Buffer.from(clientId);
  const clientIdLengthBuffer = Buffer.from([clientId.length]);
  const actionDataBuffer = Buffer.from(actionData);
  const actionTypeBuffer = Buffer.from([actionType]);

  // construct action package into a single Buffer
  const actionPackageBuffer = Buffer.concat([
    actionTypeBuffer,
    clientIdLengthBuffer,
    clientIdBuffer,
    actionDataBuffer,
  ]);

  console.log("actionPackageBuffer", actionPackageBuffer);
  return actionPackageBuffer;
}
