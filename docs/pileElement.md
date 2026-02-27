---
outline: deep
---

# Pile Element

Pile Elements are where the magic happens. Pile elements house the card elements, handle the moving of the cards, display the cards and facilitate the animations.

## Pile Element Properties and Methods

| Prop Name                | Type                 | Description                                                              |
| ------------------------ | -------------------- | ------------------------------------------------------------------------ |
| readonly: pile           | `Pile<T>`            | Pile object associated with this pile element                            |
| readonly: cards          | `Card<T>`            | Card objects in the associated pile                                      |
| readonly: cascadeOffset  | `[number,number]`    | Visual stack offset of the cards in this pile                            |
| readonly: topCardElement | `CardElement<T>`     | Card Element visually on top of the stack (last in array)                |
| readonly: cardElements   | `CardElement<T>[]`   | Array of all Card Elements associated with pile element                  |
| readonly: container      | `HTMLElement`        | The DOM element of this pile element                                     |
| options                  | `PileOptionsType<T>` | Additional options                                                       |
| moveCardToPile           | `function`           | Passing card function                                                    |
| updateShadows            | `function`           | Updates shadows on cards depending on density of cards                   |
| cascade                  | `function`           | Re-stack cards in pile                                                   |
| applyCascadeLayout       | `function`           | Changes cascadeOffset                                                    |
| createCascadeLayout      | `function`           | Creates new cascadeOffset Layout                                         |
| findCardContainer        | `function`           | Used to find cardElement that was clicked on during event listeners      |
| shuffle                  | `function`           | shuffle the pile object cards, then match the cardElements to that order |

## Creating Piles

There are two suggested methods for creating piles:

1. Use the [deck](/deck) to create a pile. `const playerHand = deck.createPileElement("Hand");`
2. Use [player](/playerClass) to make piles for each player. `const player1 = new Player("Player 1", deck, [{ name: "Hand" }]);`

## Initiating Cards in a Pile

Both methods to create a pile above have a way to initiate the cards in a given pile

1. The third arg to `deck.createPileElement` is an Array of what cards to initiate in the pile
2. Player is a little more rigid, as the 4th arg is a string of which pile name to initiate **all** of the cards in the provided deck.

**IMPORTANT** A pile with cards initialized in it will require a `cascade()` once the DOMContent has loaded.
**IMPORTANT** After a `shuffle()` the pile will also require a `cascade()`

## When to cascade()? {#cascade}

Any time you manipulate cardElements without an animation you should run `cascade()` on that pile afterwords.

Including:

- Initiating cards in a pile
- Shuffling a pile
- Changing cascadeOffset

## Passing Cards Between Piles

Drag and Drop is auto enabled, so if you have two pileElements set up, one with cards, you can drag and drop cards between them. See [pile options](/pile-options) for info on turning drag and drop off. See [rules](/rules) for info on creating rules for dragging and dropping, or for custom card movements.

### Custom Card Passing

Using the method `moveCardToPile` we can setup our own methods for passing cards. Lets look at the method.

```typescript
type MoveCardToPile<T> = (
  destinationPile: PileElementType<T>,
  cardElement?: CardElementType<T>,
  groupOffset?: number,
) => Promise<Animation | undefined> | false;
```

We need to provide the destination pileElement, and optionally a cardElement and a groupOffset.

The cardElement will default to the top card if none is provided.

The groupOffset defaults to 0, and is used in our default animation when moving multiple cards via drag and drop.

The default animation for moving cards from one pile to another can be customized, or deactivated through the [Pile Options](pile-options)

Heres an example on setting up single click card passing. Lets assume 2 pileElements, drawPile and playerHand have been created already.

```typescript
let activePile = null;

drawPile.container.addEventListener("click", () => {
  if (!activePile) return (activePile = drawPile);
  else if (activePile === drawPile) return (activePile = null);
  else {
    activePile.moveCardToPile(drawPile);
    activePile = null;
  }
});

playerHand.container.addEventListener("click", () => {
  if (!activePile) return (activePile = playerHand);
  else if (activePile === playerHand) return (activePile = null);
  else {
    activePile.moveCardToPile(playerHand);
    activePile = null;
  }
});
```

This is a start for handling your own card passing with single click operation. It may be beneficial if you plan on doing your own card pass handling to check out [pile options](/pile-options) and de-activate dragging as single click and dragging are tough to distinguish.

### More examples with event listeners

PileElements also provide you with the method findCardContainer, which takes an html element and returns the cardElement associated with that element.

This method is best used in listeners to figure out what card was clicked on. Especially useful when cards are fanned out in a hand also known as layout:'cascade'

Using the above listeners, I will change the hand to figure out what card was clicked on, and pass that card from the hand to the draw pile.

```typescript
playerHand.applyCascadeLayout("cascade");
playerHand.cascade();

let activePile = null;
let activeCard = null;

drawPile.container.addEventListener("click", () => {
  //check if theres already an active pile
  if (!activePile) {
    // drawpile only wants to pass the top card
    const cardElement = drawPile.topCardElement;
    // if theres no cards, return
    if (cardElement === null) return;
    // else we will make this pile and the top card active
    else {
      activePile = drawPile;
      activeCard = cardElement;
      return;
    }
  }
  // if this is the active pile, its been clicked twice in a row, we will cancel
  if (activePile === drawPile) {
    activePile = null;
    activeCard = null;
    return;
  }
  // otherwise, the other pile is active, and we can pass a card
  else {
    activePile.moveCardToPile(drawPile, activeCard);
    activePile = null;
    activeCard = null;
  }
});

playerHand.container.addEventListener("click", (e) => {
  // ensure the item clicked on was an HTMLElement for type safety
  if (!(e.target instanceof HTMLElement)) return;
  //check if theres already an active pile
  if (!activePile) {
    // we use the method to find the card element that was clicked on
    const cardElement = playerHand.findCardContainer(e.target);
    // in case the pileElement was empty return
    if (cardElement === null) return;
    // else we set out variables
    else {
      activePile = playerHand;
      activeCard = cardElement;
      return;
    }
  }
  // if this is the active pile, its been clicked twice in a row, we will cancel
  if (activePile === playerHand) {
    activePile = null;
    activeCard = null;
    return;
  }
  // otherwise, the other pile is active, and we can pass a card
  else {
    activePile.moveCardToPile(playerHand, activeCard);
    activePile = null;
    activeCard = null;
  }
});
```

Now we have a click listener on the draw pile that will make the top card the active card, and a click listener on the player hand that will make whatever card was clicked the active card.

**NOTE** It's best practise to highlight the card with some sort of css when it is active, as it gets quite confusing which card is 'active'
