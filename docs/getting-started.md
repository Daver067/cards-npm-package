---
outline: deep
---

# Getting Started with CardsJS

We will take you on a quick walkthrough on how to use our library

## Theme Configuration

The fastest way to apply a [theme](/custom-themes) is using the `setTheme` function with a predefined theme on your playing surface. On this example we will make the body our playing surface:

**card.ts**

```typescript
import { setTheme, greenFelt } from "@/components/table/themes";

const body = document.querySelector("body");
if (body) {
  setTheme(greenFelt, body);
}
```

## Initiating a Deck of Cards

To create a [deck](/deck) of standard playing cards (52 cards, Ace to King, 4 suits) we have provided a quick function.

**card.ts**

```typescript
import StandardDeckOfCards from "@/components/card/playingCard/standardDeckOfCards";

const deck = StandardDeckOfCards(); // StandardDeckOfCards(true) will also provide 2 jokers
```

The deck contains all of the card objects, but is not used to display anything on browsers. It is purely a functional component. Where the cards will get displayed is in the [pile Elements](/pileElement)

## Creating Pile Elements

Pile Elements are visually where cards will appear on the screen. Think of any possible stack or hand or "pile" of cards as a distinct pile Element. The best method of creating piles is by using the deck initiated in the previous step.

Below we will initiate 3 piles, an empty discard pile, an empty hand, and a draw pile with all 52 cards in it.

We can initiate cards in a pile element by passing an array of cards as the second argument to `deck.createPileElement()`

**card.ts**

```typescript
const discardPile = deck.createPileElement("discardPile");
const drawPile = deck.createPileElement("drawPile", deck.cards); // initiate all cards here
const playerHand = deck.createPileElement("Hand"); // will begin with no cards
```

Piles also have more advanced options, which is the third optional argument to createPileElement. Please see more on [Piles Options](/pile-options)

### Appending Piles to Page

I will now append these pileElements to the page. PileElements are objects that contain many methods, and properties. The HTML Element of a pileElement is found under the property container.

For all pileElements properties and methods see [PileElements](/pileElement)

Please ensure script src matches your script.

**index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <script type="module" src="./card.ts"></script>
  </head>
  <body>
    <div id="discardPile"></div>
    <div id="drawPile"></div>
    <div id="hand"></div>
  </body>
</html>
```

**card.ts**

```typescript
const discardDiv = document.getElementById("discardPile");
discardDiv.appendChild(discardPile.container);

const drawDiv = document.getElementById("drawPile");
drawDiv.appendChild(drawPile.container);

const handDiv = document.getElementById("hand");
handDiv.appendChild(playerHand.container);
```

We have created our piles, taken our bare bones html file and appended our piles to them. One more step will have us able to interact with the cards.

We will have to wait for the DOMContent to be loaded, and then run [cascade](/pileElement#cascade) on any piles that have cards initiated in them.

Cascade is essentially, re-stack, and is an async function which should be awaited.
Lets also just shuffle up the cards before we re-stack them.

**Note any time you shuffle cards, you should re-stack `cascade()` them.**

**card.ts**

```typescript
drawPile.shuffle();
window.addEventListener("DOMContentLoaded", async () => {
  await drawPile.cascade();
});
```

Bingo! We now have playing cards in a stack in the middle, an empty pile above, and below.
The cards are able to be dragged and dropped by default, however any other interactions are up to us to code.

Currently I am sure that it doesn't look great, part of the card is likely cut off and the piles are overlapping a bit, but we haven't written any css yet!

## Card Sizing

To [override css](/overrideCSS) on the default card sizing, which is quite large, we will need to configure a css file.

lets create one called styles.css and target the card size. I will also add some minimal styling on the body to clean up the look of our table.

**styles.css**

```css
:root {
  --card-size: 50px;
}

body {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
```

And we will import this into our typescript file after all other imports.

**card.ts**

```typescript
import { setTheme, greenFelt } from "@/components/table/themes";
import StandardDeckOfCards from "@/components/card/playingCard/standardDeckOfCards";
import "./styles.css";
```

## Interactivity With Cards

Now that we have some cards on the screen, we can start adding functionality to them, the best way is to add event listeners to the piles themselves. Lets start with flipping the top card on the draw pile when it is clicked.

**card.ts**

```typescript
drawPile.container.addEventListener("click", () => {
  drawPile.topCardElement.flip();
});
```

Awesome! But, personally I don't think the hand looks much like a hand. It's still a pile, lets change an [option](/pile-options) to the hand so that cards that get put in there are spread out horizontally.

One of the options to a pileElement is layout, lets change hand from the default layout (stack) to a layout of cascade.

**card.ts**

```typescript
playerHand.applyCascadeLayout("cascade");
```

Ok, you may have noticed that we can move a whole bunch of cards from draw pile to the hand. We have included some functions with pile to help figure out which card was clicked on. Lets add an event listener to hand so that we can flip over any card we touch, not just the top card as long as it is face down.

I'm going to write this type safe, to continue using our useful typescript auto-complete

**card.ts**

```typescript
playerHand.container.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLElement)) return;
  const cardElement = playerHand.findCardContainer(e.target);
  if (cardElement === null) return;
  if (cardElement.faceUp) return;
  cardElement.flip();
});
```

Now you may be saying, how do I just grab a middle card from my hand and not the whole stack? It's just another option in pile. Lets fix that so we can play one card at a time.

**card.ts**

```typescript
playerHand.options.groupDrag = false;
```

## Wrapping Up

Ok, That's it for the basics! The final code for the basic tutorial is below, in case you got lost along the way.

**index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <script type="module" src="./card.ts"></script>
  </head>
  <body>
    <div id="discardPile"></div>
    <div id="drawPile"></div>
    <div id="hand"></div>
  </body>
</html>
```

**card.ts**

```typescript
import { setTheme, greenFelt } from "@/components/table/themes";
import StandardDeckOfCards from "@/components/card/playingCard/standardDeckOfCards";
import "./styles.css";

const body = document.querySelector("body");
if (body) {
  setTheme(greenFelt, body);
}
const deck = StandardDeckOfCards(); // StandardDeckOfCards(true) will provide 2 jokers
const discardPile = deck.createPileElement("discardPile");
const drawPile = deck.createPileElement("drawPile", deck.cards); // initiate all cards here
const playerHand = deck.createPileElement("Hand"); // will begin with no cards

const discardDiv = document.getElementById("discardPile");
discardDiv.appendChild(discardPile.container);

const drawDiv = document.getElementById("drawPile");
drawDiv.appendChild(drawPile.container);

const handDiv = document.getElementById("hand");
handDiv.appendChild(playerHand.container);

drawPile.shuffle();
window.addEventListener("DOMContentLoaded", async () => {
  drawPile.cascade();
  drawPile.container.addEventListener("click", () => {
    drawPile.topCardElement.flip();
  });
  playerHand.applyCascadeLayout("cascade");
  drawPile.container.addEventListener("click", () => {
    drawPile.topCardElement.flip();
  });
  playerHand.container.addEventListener("click", (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    const cardElement = playerHand.findCardContainer(e.target);
    if (cardElement === null) return;
    if (cardElement.faceUp) return;
    cardElement.flip();
  });
  playerHand.options.groupDrag = false;
});
```

**styles.css**

```css
:root {
  --card-size: 50px;
}

body {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
```
