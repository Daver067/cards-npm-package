---
outline: deep
---

# Pile

The Pile class represents a collection of cards in a game. Piles can be used for hands, discard piles, draw piles, and other card groupings.

## Pile Type

```typescript
type PileType<T extends Card> = {
  name: string;
  readonly cards: T[];
  receiveCard: (cards: T | T[], conditions?: boolean) => boolean;
  passCard: (target: Pile<T>, card?: T, rules?: boolean) => boolean;
  shuffle: () => void;
};
```

## Constructor

```typescript
constructor(name: string, cards: T[] = [])
```

## Use Case

A [Pile Element](/pileElement) will contain a pile. When creating pileElements with your [Deck](/deck) or [Player Class](/playerClass) you do not need to worry about piles.

If you are creating a js or node only game, piles are where cards will reside.

Otherwise, pileElement has methods that will control the pile.
