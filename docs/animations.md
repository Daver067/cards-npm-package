---
outline: deep
---

# Animations

These are the animations that we have created for this package.

## Animation Functions

| name                     | parameters                                           | description                                                            |
| ------------------------ | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| slideCard                | cardElement, vector, duration                        | used for sliding a card from one spot to another                       |
| turnCard                 | cardElement, duration                                | turns a card 90 degrees, or back straight                              |
| zoomCard                 | cardElement, factor, duration                        | enlarges a card to see it more clearly                                 |
| slideDeck                | pileElement, vector, duration                        | moves a whole pile from its original location to another               |
| deal                     | numberOfCards,from,to,delayTime                      | deals a number of cards from one pile to one or multiple other piles   |
| denyMove                 | cardElement                                          | Card will turn red and do a little shimmy to express inability to move |
| animateMoveCardToNewPile | source, destination, cardElement, index, groupOffset | default animation for passing cards                                    |

## Using animations

First import the animation to your file.

You will need to create a [pile element](/pileElement) to store the card elements. Next set a listener and use the animation.

See uses of animations below, only uncomment one animation at a time to see the example

```typescript
import { denyMove, slideCard, turnCard, zoomCard } from "card-factory";

player1HandPile.container.addEventListener("click", async () => {
  const card = player1HandPile.topCardElement;
  turnCard(card, 1000);

  // denyMove(card);

  // slideCard(card, [100, 100], 1000).then(() => slideCard(card, [0, 0], 1000));

  /* uncomment the next two lines together to see await */
  // await zoomCard(card, 2, 1000);
  // zoomCard(card, 1, 2000);
});
```

Animations will return promises, and thus can be chained by using `.then()` or `await`. If using await, don't forget the async in the function declaration.

## Dealing

Deal is just multiple pileElement.moveCardToPile strung together with a nice delay. It will return an array of promises, thus can also be chained with `.then()` or `await`

As deal requires the cards to be loaded, it is smart to nest deal in a listener waiting for DOMContent to be loaded.

Use of deal below:

```typescript
import { deal } from "card-factory";

window.addEventListener("DOMContentLoaded", async () => {
  await deal(7, drawPile, handPile, 100);
});
```
