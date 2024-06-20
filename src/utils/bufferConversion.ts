import { RawData } from "ws";
import {
  ActionType,
  GameMessageBundle,
  MessageType,
  clientsList,
  messageType,
} from "../types/message";
import {
  Card,
  Deck,
  gameAction,
  gameState,
  suits,
  values,
} from "../types/game";
import { Clients } from "../data/client";
import { isCard, isClients } from "./typeGuards";

// TODO: refactor to match new encodeMessage
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

// encode message components into a single buffer
export function encodeMessage(gameMessageBundle: GameMessageBundle): Buffer {
  const {
    clientId,
    selectedMessageType,
    selectedActionType,
    selectedActionValue,
  } = gameMessageBundle;

  const clientIdLengthBuffer = Buffer.from([clientId.length]);
  const clientIdBuffer = Buffer.from(clientId);
  const messageTypeBuffer = Buffer.from([selectedMessageType]);
  const actionTypeBuffer = Buffer.from([selectedActionType]);
  let actionValueBuffer: Buffer | undefined = undefined;

  // convert value to buffer based on selectedActionType and chosenActionValues
  switch (selectedActionType) {
    // Game State Actions
    case gameState.INIT_GAME || gameState.RESET_GAME: {
      // convert array of deck information into string then into a buffer
      if (typeof selectedActionValue !== "string") {
        actionValueBuffer = Buffer.from(JSON.stringify(selectedActionValue));
      } else {
        throw new Error(
          "selectedActionValue is not the correct type 'Deck' when matching against the chosenActionType.",
        );
      }
    }
    // Clients List Actions
    case clientsList.CLIENT_LIST: {
      // check that value passed in matches Clients type
      if (isClients(selectedActionValue)) {
        console.log("encoding clients for browser-client");
        actionValueBuffer = encodeClients(selectedActionValue);
      } else {
        throw new Error(
          "selectedActionValue is not the correct type 'Clients' when matching against the chosenActionType.",
        );
      }
    }

    // Game Action Actions
    case gameAction.DRAW_CARD: {
      // check that value passed in matches the Card type
      if (isCard(selectedActionValue)) {
        actionValueBuffer = Buffer.from(JSON.stringify(selectedActionValue));
      }
    }

    // Default case, everything else is a string
    default: {
      if (typeof selectedActionValue === "string") {
        actionValueBuffer = Buffer.from(selectedActionValue);
      }
    }
  }

  if (!actionValueBuffer) {
    throw new Error("Action Value while encoding message was invalid.");
  }

  // construct action package into a single Buffer
  const actionPackageBuffer = Buffer.concat([
    clientIdLengthBuffer,
    clientIdBuffer,
    messageTypeBuffer,
    actionTypeBuffer,
    actionValueBuffer,
  ]);

  console.log("actionPackageBuffer", actionPackageBuffer);
  return actionPackageBuffer;
}

// encode list of clients into a buffer
export function encodeClients(clients: Clients): Buffer {
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
