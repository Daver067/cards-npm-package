import "../navMenu/navMenu";
import "./styles.css";
import "../styles/reset.css";
import { FlashCard, Deck, FlashCardElement } from "@/dist";

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

const informationalCard = new FlashCard(
  "Double Click to Flip Flashcards!",
  "Drag and Drop to the other pile!",
);

// building the flashCardObjects in an Array from the generic object above
const cardClasses = flashcards.map((flashCard) => {
  return new FlashCard(flashCard.question, flashCard.answer);
});

// creating a deck containing my flashCardObjects, using the factory function I built in the last step
const deck = new Deck([...cardClasses, informationalCard], FlashCardElement);
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

window.addEventListener("DOMContentLoaded", async () => {
  const cardElem = drawPile.cardElements.find(
    (card) => card.card === informationalCard,
  );
  await new Promise((resolve) => setTimeout(resolve, 100));
  drawPile.moveCardToPile(discardPile, cardElem);
});
