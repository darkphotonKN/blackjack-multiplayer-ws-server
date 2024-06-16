import { WebSocket } from "ws";

import { Card, Deck, values, suits } from "../types/game";
import { clients } from "../data/client";
import { encodeClients } from "../utils/bufferConversion";

/*TODO:
- Provide the state of the deck to client. []
- Tie game moves to socket message connection types. []
  - Draw Card []
  - Join Game [] 
  - Forfeit Game [] 
- Game State Checking []
  - Check Each Player's Totals []
  - Check For Winner []
*/

// initializes game by creating a new id for the connected client,
// sending it to them and adding them to the client list
export function initalizeGame(id: string, ws: WebSocket) {
  // store user with generated id
  clients.set(id, ws);

  // send their unique identifier to the client
  ws.send(JSON.stringify({ id }));

  // send clients to client
  const encodedClients = encodeClients(clients);

  ws.send(encodedClients);
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
