---
outline: deep
---

# Player

Player Class is syntactic sugar for making pileElements, and organizing them by player

## Player Type

```typescript
type PlayerType<T extends Card> = {
  readonly name: string;
  readonly deck: Deck<T>;
  readonly piles: PileElementType<T>[];

  getPile: (name: string) => PileElementType<T> | undefined;
};
```

## Constructor

```typescript
  constructor(
    name: string,
    deck: Deck<T>,
    piles: { name: string; options?: Partial<PileOptionsType<T>> }[],
    cardInitializer?: string,
  )
```

## Usage

Below we will create 3 players, 2 "human" players with hands, and one "dealer" player which will act as our draw pile and discard pile.

All of the cards will be initiated in the Draw pile of the Dealer Player.

```typescript
const player1 = new Player("Player 1", deck, [{ name: "Hand" }]);
const hand1 = player1.getPile("Hand");

const player2 = new Player("Player 2", deck, [{ name: "Hand" }]);
const hand2 = player2.getPile("Hand");

const main = new Player(
  "Dealer",
  deck,
  [{ name: "Draw" }, { name: "Discard" }],
  "Draw",
);
const draw = main.getPile("Draw");
const discard = main.getPile("Discard");
```
