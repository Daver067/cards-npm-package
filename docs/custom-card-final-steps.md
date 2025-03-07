---
outline: deep
---

# Lets Put It All Together!

Ok, now we're going to setup a new index.html, styles.css and script.ts for our flashcard extension! I'm keeping this minimalistic so bear with me.

## index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Flash Cards</title>
    <script type="module" src="./script.ts"></script>
  </head>
  <body>
    <div id="flash-card-app">
      <div id="drawPile"></div>
      <div id="discardPile"></div>
    </div>
  </body>
</html>
```

## style.css

```css
:root {
  --card-size: 80px;
}

#flash-card-app {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
```

## script.ts

```typescript
import { FlashCard, Deck, FlashCardElement } from "card-factory";
import "./styles.css";

// the info I want on my flashcards
const flashcards = [
  {
    question: "How do I create a card?",
    answer: "new Flashcard( 'question', 'answer')",
  },
  {
    question: "Who Created this awesome Library?",
    answer: "@Daver067 and @Chartley1988",
  },
  {
    question: "How do I create a pileElement?",
    answer: "Use your deck! deck.createPileElement('hand')",
  },
  {
    question: "Does drag and drop work?",
    answer: "Just give it a shot!",
  },
];

// building the flashCardObjects in an Array from the generic object above
const cardClasses = flashcards.map((flashCard) => {
  return new FlashCard(flashCard.question, flashCard.answer);
});

// creating a deck containing my flashCardObjects, using the factory function I built in the last step
const deck = new Deck(cardClasses, FlashCardElement);

// using my deck to create two pileElements
const drawPile = deck.createPileElement("draw", deck.cards);
const discardPile = deck.createPileElement("discard");

// getting the piles from my html file
const drawPileDiv = document.getElementById("drawPile");
const discardPileDiv = document.getElementById("discardPile");

// adding the pileElements to the html file
drawPileDiv.appendChild(drawPile.container);
discardPileDiv.appendChild(discardPile.container);

// shuffle the cards, then restack them
drawPile.shuffle();
drawPile.cascade();

// adding listeners to both piles so I can flip the top flashcard
drawPile.container.addEventListener("dblclick", () => {
  drawPile.topCardElement.flip();
});

discardPile.container.addEventListener("dblclick", () => {
  discardPile.topCardElement.flip();
});
```

## There you have it!

The cards will drag and drop between the piles, flip on a double click and look pretty damn good.

Now you know how to create a whole new style of card! You will be building new board games, video games, and more in no time!

We would love to know what you create with it!
