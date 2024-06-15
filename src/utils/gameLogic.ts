import { Card, Deck, Hand, values, suits } from "@/types/game/card.types";

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
