---
outline: deep
---

# Deck

The deck what creates all of the cardElements, cards, pileElements, and piles.

Most games will only require one deck, even if players have separate draw piles typically the game only has one deck; the cards from that deck are just separated into different [piles](/piles).

Exceptions can be found in games where players would bring their own deck, example is Magic the Gathering.

## Deck Type

```typescript
type DeckType<T extends Card> = {
  readonly cards: T[];
  readonly pileElements: PileElementType<T>[];
  addCards: (cards: T | T[]) => void;
  createPile: (name: string, cards?: T[]) => Pile<T>;
  createPileElement: (
    name: string,
    cards?: T[],
    options?: Partial<PileOptionsType<T>>,
  ) => PileElementType<T>;
  removeCard: (card: T) => boolean

```

## Deck Constructor

To make a deck, we need an array of all the cards, and optionally a function to build the cardElements.

```typescript
  constructor(
    cards: T[],
    cardBuilder: (card: T) => CardElementType<T> = (card: T) =>
      CardElement(card),
  ) {
    this._cards = cards;
    this._piles = [];
    this._graveyard = new Pile<T>("graveyard");
    this._cardBuilder = cardBuilder;
    this.pileElements = [];
  }
```

## Actual Use Case

This is the actual code we use to build a deck of 52 playing cards. Hopefully the commented code is clear enough.

```typescript
import { cardNumber, suit } from "@/types/card.types";
import Deck from "../../deck/deck";
import PlayingCard from "./playingCardClass";
import PlayingCardElement from "./playingCardElement";

function StandardDeckOfCards(jokers: boolean = false): Deck<PlayingCard> {
  // Dictionary of Standard 52 Card deck definitions
  const standardDeck: { suit: suit[]; members: cardNumber[] } = {
    suit: ["diamond", "heart", "spade", "club"],
    members: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
  };
  const cardArr = [];
  // loop through all the suits
  for (let i = 0; i < standardDeck.suit.length; i++) {
    const suit = standardDeck.suit[i];
    // loop through each card number in each suit
    for (let j = 0; j < standardDeck.members.length; j++) {
      const cardNumber = standardDeck.members[j];
      // make the card for suit[i] and number[j]
      const newCard = new PlayingCard(cardNumber, suit);
      // add that new card to the array of all cards
      cardArr.push(newCard);
    }
  }
  // adds the two jokers if they are required
  if (jokers) {
    cardArr.push(new PlayingCard("joker", "joker"));
    cardArr.push(new PlayingCard("joker", "joker"));
  }
  // make the deck, and return it
  return new Deck(cardArr, PlayingCardElement);
}

export default StandardDeckOfCards;
```

## Creating Pile Elements

The best way to create [Pile Elements](/pileElement) is by using your deck or by using the [Player Class](/playerClass)

```typescript
const discardPile = deck.createPileElement("discardPile");
```

createPileElement can take 3 arguments:

| parameter name | type                          | required               |
| -------------- | ----------------------------- | ---------------------- |
| name           | `string`                      | Yes                    |
| cards          | `Array of Cards<T>`           | Only if adding options |
| options        | `Partial<PileOptionsType<T>>` | No                     |

Providing any cards to the second argument will initiate those cards in that pile. All cards being used **MUST** be initialized in some pile.

If you wish to pass options, but no cards, simply pass an empty array to the second argument.

```typescript
const playerHand = deck.createPileElement("Hand", [], { layout: "cascade" });
```

for more info on [pile options](/pile-options)
