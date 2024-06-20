import { WebSocket } from "ws";
import { v4 as uuid } from "uuid";

import { Card, Deck, values, suits } from "../types/game";
import { clients } from "../data/client";
import { encodeMessage } from "../utils/bufferConversion";
import { GameMessageBundle, clientsList, messageType } from "../types/message";

/*TODO:
- Provide clientId and client List to client [x]
- Provide the state of the deck to client. []
- Tie game moves to socket message connection types. []
  - Draw Card []
  - Join Game [] 
  - Forfeit Game [] 
- Game State Checking []
  - Check Each Player's Totals []
  - Check For Winner [] */

// initializes game by creating a new id for the connected client,
// adding them to the client list, creating a buffer message with all this
// information and returning the new client id
export function initalizeGame(ws: WebSocket): { clientId: string } {
  // TODO: check if client is already in the client list as part of a game

  // generate unique identifier for the current client
  const clientId = uuid();

  // store user with generated id
  clients.set(clientId, ws);

  console.log(
    "Clients List current (before encoding):",
    clients.toString().slice(1, 50),
  );
  // create buffer containing all game information for starting a game

  // clientId and clientList information
  const selectedMessageType = messageType.CLIENTS_LIST;
  const selectedActionType = clientsList.CLIENT_LIST;

  const messageBundle: GameMessageBundle = {
    clientId,
    selectedMessageType,
    selectedActionType,
    selectedActionValue: clients,
  };

  const initGameMessage: Buffer = encodeMessage(messageBundle);
  // deck information

  // send information to client
  ws.send(initGameMessage);

  return { clientId };
}

// initialize deck
export function initalizeDeck(): Deck {
  let deck: Card[] = [];

  // create deck

  for (let value of values) {
    for (let suit of Object.keys(suits)) {
      deck.push({ value, suit: suits[suit as keyof typeof suits] });
    }
  }

  if (deck.length != 52) {
    throw Error("Deck length is not 52!");
  }
  return deck as Deck;
}

/**
 * @description Shuffles a deck using Phisher-Yates Algorithm
 */
export function shuffleDeck(deck: Deck): Deck {
  const copiedDeck = [...deck] as Deck;

  // loop from highest number to lowest
  for (let i = copiedDeck.length - 1; i > 0; i--) {
    // pick a random number between 0 to the current remaining iteration range
    const randomIndex = Math.floor(Math.random() * (i + 1));

    const temp = copiedDeck[i];
    copiedDeck[i] = copiedDeck[randomIndex];
    copiedDeck[randomIndex] = temp;
  }

  return copiedDeck;
}

/**
 * @description Draws a card and returns it and the remaining deck if any cards are remaining.
 */
export function drawCard(
  deck: Deck,
): { drawnCard: Card; remainingDeck: Deck } | undefined {
  // check if deck is empty before drawing
  if (deck.length < 1) {
    return;
  }
  const [drawnCard, ...remainingDeck] = deck;
  return { drawnCard, remainingDeck };
}
