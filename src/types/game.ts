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

// WS Communication Types

export const gameState = {
  INIT_GAME: 0x20,
  RESET_GAME: 0x21,
} as const;
export type GameState = (typeof gameState)[keyof typeof gameState];

export const gameAction = {
  DRAW_CARD: 0x30,
  SKIP_TURN: 0x31,
  JOIN: 0x32,
  FORFEIT: 0x33,
} as const;
export type GameAction = (typeof gameAction)[keyof typeof gameAction];
