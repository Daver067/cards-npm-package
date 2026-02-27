---
outline: deep
---

# Playing Card

Playing Card Element is our extension of Card Element.

No new properties are added in the element, it is purely for typecasting, and visual appearance of the card.

## Playing Card Constructor

First you must construct a [playing card](/playingCard), before constructing a playing card Element.

```typescript
import PlayingCard from "@/components/card/playingCard/playingCardClass";
import PlayingCardElement from "@/components/card/playingCard/playingCardElement";

const aceOfSpades = new PlayingCard("A", "spade");
const jackOfdiamonds = new PlayingCard("J", "diamond");

const aceElement = PlayingCardElement(aceOfSpades);
const jackElement = PlayingCardElement(jackOfdiamonds);
```

## Card Builder

As you can see from the return statement of PlayingCardElement `return CardElement<PlayingCard>(card, frontDiv, backDiv);` It is just creating the frontDiv and backDiv visually of the playing card, and then using [cardElement](/cardElement) to make the element.

Any playing card specific properties will be found in `cardElement.card.SpecificProperty`
