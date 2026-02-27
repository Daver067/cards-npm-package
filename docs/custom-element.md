---
outline: deep
---

# Custom Card

Now we get to start making some DOM elements. I have tried to make this as simple as I could.

## Building the Card Element

We will take our new extension of class Card, [FlashCard](/extend-card) and use it as a parameter for our new Factory Function FlashCardElement.

This Factory Function will have two functions, one to build the div for the front of the flashCard, and one to build the back.

Our function will return a CardElement of the type `<FlashCard>` using the card we provide, along with the return of the front and back div functions.

```typescript
import { FlashCard, CardElement } from "card-factory";
import "./flashCard.css";

const FlashCardElement = (card: FlashCard) => {
  // pull info out of flashcard
  const answer = card.answer;
  const question = card.question;

  // create the element for the front div
  const frontDiv = () => {
    const card = document.createElement("div");
    card.classList.add("flash-front"); // Specific to Standard 52 Deck
    const span = document.createElement("span");
    span.textContent = answer;
    card.appendChild(span);
    return card;
  };

  // create the element for the backDiv
  const backDiv = () => {
    const card = document.createElement("div");
    const questionSpan = document.createElement("span");
    questionSpan.classList.add("flash-back");
    questionSpan.textContent = question;
    card.appendChild(questionSpan);
    return card;
  };

  // return a new CardElement, extended by flashcard with our new divs
  return CardElement<FlashCard>(card, frontDiv(), backDiv());
};

export default FlashCardElement;
```

## Styles In a New Element

Some styles can be completely new - see `flash-front` and `flash-back`, however, some will be applied in the default CardElement Factory function. I have overridden a couple to make our flash-cards wider than they are tall. See [override css](/overrideCSS) for more on that.

I will provide the css file that is imported below for context.

```css
.flash-back {
  height: 100%;
  width: 100%;
  text-align: center;
  background-color: antiquewhite;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flash-front {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-wrap: break-word;
  word-break: break-word;
  & > span {
    font-size: 20px;
    text-align: center;
  }
}

/* widen the deckBase to look more like a flash card */
.deck-base {
  width: calc(var(--card-size) * 5);
}

/* also have to widen the card-parent the same size */
.card-parent {
  width: calc(var(--card-size) * 5);
}

/* half opacity on dragging cards looks bad when text is on it */
.card-dragging {
  opacity: 1;
}
```

## All set!

Now we are all done setting up a new card, and can use all of our existing pileElements, decks, players, and animations!

Let's check out the [final steps](/custom-card-final-steps) to get these flashcards running.
