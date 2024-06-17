// Custom Type Guards

import { WebSocket } from "ws";
import { Clients } from "../data/client";
import { suits, values as cardValues, values, Card } from "../types/game";

// check if the value passed in conforms to the "Clients" type
export function isClients(value: any): value is Clients {
  return (
    value instanceof Map &&
    [...value.values()].every((item) => item instanceof WebSocket)
  );
}

// check if the value passed in conforms to the "Card" type
export function isCard(value: any): value is Card {
  if (
    ((value.suit === suits.CLUBS ||
      value.suit === suits.HEARTS ||
      value.suit === suits.SPADES ||
      value.suit === suits.DIAMONDS) &&
      value.value === cardValues[0]) ||
    value.value === cardValues[1] ||
    value.value === cardValues[2] ||
    value.value === cardValues[3] ||
    value.value === cardValues[4] ||
    value.value === cardValues[5] ||
    value.value === cardValues[6] ||
    value.value === cardValues[7] ||
    value.value === cardValues[8] ||
    value.value === cardValues[9] ||
    value.value === cardValues[10] ||
    value.value === cardValues[11] ||
    value.value === cardValues[12]
  ) {
    return true;
  }

  return false;
}
