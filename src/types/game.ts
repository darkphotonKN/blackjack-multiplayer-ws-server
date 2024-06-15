// Game-Related Types

export const suits = {
  CLUBS: "clubs",
  SPADES: "spades",
  HEARTS: "hearts",
  DIAMONDS: "diamonds",
} as const;
export type Suit = (typeof suits)[keyof typeof suits];

// Card values Possibilties and Type Definiton
export const values = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
] as const;
export type Value = (typeof values)[number];

export type Card = { suit: Suit; value: Value };
export type Deck = Card[];

export type Hand = [Card, Card, ...Card[]];
