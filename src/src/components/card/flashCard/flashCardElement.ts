import FlashCard from "./flashCardClass";
import { CardElement } from "../cardElement";
import "../../../styles/flashCard.css";

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
