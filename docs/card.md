---
outline: deep
---

# Card

The card is where it all starts.

Card is a javascript Class, and is ready to be extended to fit your need. Shipped with this package is [Playing Card](playingcard), which extends Card, however, let your imagination run wild, and create any type of Card extensions you wish!

[Card Element](/cardElement) contains the DOM element for the card, and [Playing Card](playingcard) extends card to give it more props and methods.

## Card Type

Card only has one property and one method.

```typescript
export default class Card {
  private _faceUp: boolean;
  constructor() {
    this._faceUp = false;
  }

  get faceUp() {
    return this._faceUp;
  }

  flip = () => {
    this._faceUp = !this._faceUp;
  };
}
```
