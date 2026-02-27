---
outline: deep
---

# Rules

Rules are what controls whether a card is able to be passed, or able to be recieved. Every pileElement requires rules, but they default to always allow both passing and receiving.

## Rules Properties

| Property       | Type                                                          | Description                                                           | Default                           | Alternative Options               |
| -------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------- | --------------------------------- |
| `passRules`    | `Array of Functions that return booleans`                     | Rules to allow card(s?) to be passed                                  | [() => true]                      | Provide Array                     |
| `receiveRules` | `Array of Functions that return booleans`                     | Rules to allow card(s?) to be received                                | [() => true]                      | Provide Array                     |
| `type`         | `object {pass: 'every' or 'any', receieve: 'every' or 'any'}` | Whether all rules, or any rule needs to be true to pass/receieve card | `{pass:'every', receieve:'every}` | `{pass: 'any', receive: 'any'  }` |
| `canPass`      | `Function that returns boolean`                               | Runs every pass rule, if all are true returns true                    | function                          | none: required                    |
| `canReceive`   | `Function that returns boolean`                               | Runs every receive rule, if all are true returns true                 | function                          | none: required                    |

## Rules Type

```typescript
export interface RuleSet<T extends Card> {
  canPass: Rule<T>;
  canReceive: Rule<T>;
  type: { pass: "every" | "any"; receive: "every" | "any" };
}

export type Rule<T extends Card> = (
  source: PileElementType<T>,
  destination: PileElementType<T>,
  card: CardElementType<T>,
  ...extraArgs: unknown[]
) => boolean;
```

## Rules Constructor

```typescript
  constructor(
    passRules: Rule<T>[] = [() => true],
    receiveRules: Rule<T>[] = [() => true],
    type: { pass: "every" | "any"; receive: "every" | "any" } = {
      pass: "every",
      receive: "every",
    },
  ) {
    this.passRules = passRules;
    this.receiveRules = receiveRules;
    this.type = type;
  }
```

## Creating New Rules

Every game will require different rules, as well as every pile will have differing rules.
Lets make a rule for our crazy 8's game.

```typescript
const onlyPassToDiscard: Rule<PlayingCard> = (
  source,
  destination,
  cardElement,
) => {
  if (destination.pile.name === "discard") return true;
  else return false;
};

const rules = new Rules([onlyPassToDiscard], [() => true]);
hand.options.rules = rules;
```

_Please note: this will be up to us to create our discard pile using the name we are looking for. `const discard = deck.createPileElement('discard')`_

Our game will definitely require more rules than just playing cards to discard, but at least now we can't pass cards to draw pile or to another player!

Lets look into following suit.

```typescript
const followSuit: Rule<PlayingCard> = (source, destination, cardElement) => {
  const card = cardElement.card;
  const destTopCard = destination.topCardElement.card;
  if (destTopCard.suit === card.suit) return true;
  else return false;
};

const rules = new Rules([onlyPassToDiscard, followSuit], [() => true]);
hand.options.rules = rules;
```

Now every time our player wants to pass a card it must be to the discard pile, and it must follow suit!

Oh No! But what if we want to play an 8? Now we can only play it if the 8 is the same suit...

Let's make some changes.

```typescript
const followSuitOrPlayAnEight: Rule<PlayingCard> = (
  source,
  destination,
  cardElement,
) => {
  const card = cardElement.card;
  if (card.number === "8") return true;
  const destTopCard = destination.topCardElement.card;
  if (destTopCard.suit === card.suit) return true;
  else return false;
};

const rules = new Rules(
  [onlyPassToDiscard, followSuitOrPlayAnEight],
  [() => true],
);
hand.options.rules = rules;
```

Why did we adjust the follow suit rule and not just make a new rule that would be true if the card was an 8?
EVERY rule needs to be true in order to pass a card by default. This means we may have to shortcut some rules with base cases. If you find yourself having multiple base cases (likely) a shortcut function may be helpful, or changing the rules to allow ANY true to pass may suffice.

```typescript
const allowAnEight = () => {}; // ...code
const allowSameNumber = () => {}; // ...code
const allowSomethingElse = () => {}; // ...code

const baseCases: Rule<PlayingCard> = (source, destination, cardElement) => {
  if (allowAnEight(source, destination, cardElement) === true) return true;
  if (allowSameNumber(source, destination, cardElement) === true) return true;
  if (allowSomethingElse(source, destination, cardElement) === true)
    return true;
  return false;
};

const followSuit: Rule<PlayingCard> = (source, destination, cardElement) => {
  if (baseCases(source, destination, cardElement) === true) return true;
  const card = cardElement.card;
  const destTopCard = destination.topCardElement.card;
  if (destTopCard.suit === card.suit) return true;
  else return false;
};

const rules = new Rules([onlyPassToDiscard, followSuit], [() => true]);
hand.options.rules = rules;
```

Now if the card played is an 8, the same number as the last card, or another variable it well default to true.

## Alternative - change rules to pass for any true rule

We can change the default type of rules to allow the pass to occur when any of the rules are true. Any and Every will both have flaws, as they both may require base cases.

Lets change the above rules to accomodate ANY rules.

```typescript
const allowAnEight = () => {
  if (onlyPassToDiscard(...args) === false) return false;
}; // ... rest of code
const allowSameNumber = () => {
  if (onlyPassToDiscard(...args) === false) return false;
}; // ... rest of code
const allowSomethingElse = () => {
  if (onlyPassToDiscard(...args) === false) return false;
}; // ... rest of code

const followSuit: Rule<PlayingCard> = (source, destination, cardElement) => {
  {
    if (onlyPassToDiscard(source, destination, cardElement) === false)
      return false;
  }
  const card = cardElement.card;
  const destTopCard = destination.topCardElement.card;
  if (destTopCard.suit === card.suit) return true;
  else return false;
};

const rules = new Rules(
  [allowAnEight, allowSameNumber, allowSomethingElse, followSuit],
  [() => true],
);
hand.options.rules = rules;
```

As you can see, we can accomplish the same outcome, but now onlyPassToDiscard has become a base case in every rule that will return false if the destination isnt the discard pile.

This is up to you to decide which rule variation suits your game, and coding style best. Let's face it, rules are hard, and having a system to accomodate any rule is hard to imagine.

### How do I know if it should be a passRule or a receiveRule?

There may not be a clear cut case for every pile. The above rules could be either a players pass rules, or the discard piles receive rules. There is a lot of overlap in a simple game such as crazy 8's, where players can only play in one spot.

## Changing Rules

Piles can change rules at any point, just assign new rules under the piles.options.rules property. Common use of changing rules could be dealing cards.
For more info on animations like deal, see [animations](animations)

```typescript
hand.options.rules = new Rules([() => true], [() => true]); // allow receiving cards
await deal(7, deck, hand, 100); // deal the cards to hand
hand.options.rules = new Rules([() => true], [() => false]); // now restrict receiving cards
```

## Pre-Made Rules

This gets shipped with a couple of quick and easy rules to implement. Most are directed towards a Solitaire style game.

### Quick Pass Rules

Use import statement: `import { quickPassRules } from "@/components/rules/quickRules";`

| Name                | Usage                              | Description                                              |
| ------------------- | ---------------------------------- | -------------------------------------------------------- |
| alwaysPass          | quickPassRules.alwaysPass          | Always allow passing                                     |
| neverPass           | quickPassRules.neverPass           | Never allow passing                                      |
| onlyFaceUp          | quickPassRules.onlyFaceUp          | Only pass face up cards                                  |
| onlyTopCard         | quickPassRules.onlyTopCard         | Only pass top card                                       |
| redBlackAlternating | quickPassRules.redBlackAlternating | Always a pile if they alternate color, and increase by 1 |

```typescript
const solitarePassRules = [
  quickPassRules.onlyFaceUp,
  quickPassRules.redBlackAlternating,
];
const solitareReceiveRules = [];
const solitareRules = new Rules(solitarePassRules, solitareReceiveRules);
```

### Quick Receive Rules

Use import statement: `import { quickReceiveRules } from "@/components/rules/quickRules";`

| Name                        | Usage                                      | Description                                                                      |
| --------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------- |
| alwaysReceive               | quickPassRules.alwaysReceive               | Always allow receiving                                                           |
| neverReceive                | quickPassRules.neverReceive                | Never allow receiving                                                            |
| emptyAndRedBlackAlternating | quickPassRules.emptyAndRedBlackAlternating | An Empty Pile Accepts cards always, or if cards alternate red and black          |
| emptyAndOneLessThanTopCard  | quickPassRules.emptyAndOneLessThanTopCard  | An Empty Pile Accepts cards always, or if card is one less than current top card |
| emptyAndOneMoreThanTopCard  | quickPassRules.emptyAndOneMoreThanTopCard  | An Empty Pile Accepts cards always, or if card is one more than current top card |
| onlySpecificCardValue       | quickPassRules.onlySpecificCardValue       | Only a certain card will go here                                                 |
| sameSuitPlusOneOrAce        | quickPassRules.sameSuitPlusOneOrAce        | If card is same suit and one more than top card, or an Ace                       |

```typescript
const solitareAcePilePassRules = [quickPassRules.neverPass];
const solitareAcePileReceiveRules = [quickPassRules.sameSuitPlusOneOrAce];
const acePileRules = new Rules(
  solitareAcePilePassRules,
  solitareAcePileReceiveRules,
);
```
