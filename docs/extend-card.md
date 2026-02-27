---
outline: deep
---

# Extending Card

To make your own type of card, you will have to extend the base class of Card.

[Playing Card](/playingCard) is an extention of card, but the code it quite long and maybe not the best for following along. I have created FlashCard as an easy follow along for creating your own card types!

## Extending Card Class

```typescript
import Card from "../card";

export default class FlashCard extends Card {
  question: string;
  answer: string;
  constructor(question: string, answer: string) {
    super();
    this.question = question;
    this.answer = answer;
  }
}
```

It can be as easy as the code above, we are just adding 2 props to the existing Card Class. Now we can make new FlashCard Objects with

```typescript
const flashCard = new FlashCard("the question", "the answer");
```

This is just the first step in making it usable in our library though, we will need to build onto our [card element](/cardElement).

Lets go to [custom element](/custom-element)
