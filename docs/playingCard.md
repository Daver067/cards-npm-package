---
outline: deep
---

# Playing Card

Playing Card is our extension of Card, and our main intended use of this package. Although other classes can be made, which will continue to work with the rest of the codebase.

## Playing Card Type

```typescript
type PlayingCardType = {
  suit: "diamond" | "spade" | "heart" | "club" | "joker";
  symbol: "♦" | "♠" | "♥" | "♣" | "joker";
  number:
    | "A"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "J"
    | "Q"
    | "K"
    | "joker";
  value: number;
  color: "red" | "black" | "joker";
};
```

## Constructor

```typescript
  constructor(
    number: PlayingCardType["number"],
    suit: PlayingCardType["suit"],
    value: number = 0,
  )
```

## Making a playing card

If you use our pre-made deck you will have cards built for you. To use our pre-made deck use:

```typescript
import StandardDeckOfCards from "@/components/card/playingCard/standardDeckOfCards";

const deck = StandardDeckOfCards();
```

If you would like to create cards yourself:

```typescript
import PlayingCard from "@/components/card/playingCard/playingCardClass";

const aceOfSpades = new PlayingCard("A", "spade");
const jackOfdiamonds = new PlayingCard("J", "diamond");
```
