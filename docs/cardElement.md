---
outline: deep
---

# Card Element

The Card Element, this is where the DOM starts getting involved. Card Element must hold a valid card, and has a lot of DOM related props and methods

## Card Element Type

```typescript
type CardElementType<T extends Card> = {
  card: T;
  location: Pile<T> | null;
  parent: HTMLDivElement;
  front: HTMLDivElement;
  back: HTMLDivElement;
  container: HTMLDivElement;
  faceUp: boolean;
  transform: {
    active: boolean;
    translate: string;
    scale: string;
    rotate: string;
  };
  flip: (delay?: number) => void;
};
```

## Constructor

A card Element will create a blank card by default. If you provide a [card](/card) object, a div element for the visual front of the card, and a div element for the back of the card you are able to customize the card in any way you can see fit.

```typescript
const CardElement = <T extends Card>(
  thisCard = new Card() as T,
  _front = document.createElement("div"),
  _back = document.createElement("div"),
): CardElementType<T> => {}; //
```

See our [playing card element](/playingCardElement) for an example of creating a new type of card.

## Event Listeners

The preferred use is to use event listeners on [Pile Elements](pileElement). However, it is possible to set up event listeners on individual cardElements.

When adding listeners to cards, place them on the container. In the following code we are running some game specific function with the card when it is clicked on.

```typescript
cardElement.container.addEventListener("click", () => {
  gameSpecificFunction(cardElement);
});
```

## Disable functionality while animating

Custom listeners may need to be de-activated while the card is animating to prevent unwanted behaviours.

The following line should stop interaction while any cardsJS animations are running.

```typescript
cardElement.container.addEventListener("click", () => {
  if (cardElement.transform.active) return; // add this to stop interactivity while animating
  gameSpecificFunction(cardElement);
});
```

When the card is animating, that property is true, on animationend it turns false.
