import "../navMenu/navMenu";
import "../styles/style.css";
import "./styles.css";
import "../styles/reset.css";
import { setTheme, greenFelt, StandardDeckOfCards } from "@/dist";
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

playerHand.applyCascadeLayout("cascade");
playerHand.cascade();

let activePile = null;
let activeCard = null;

drawPile.container.addEventListener("click", () => {
  //check if theres already an active pile
  if (!activePile) {
    // drawpile only wants to pass the top card
    const cardElement = drawPile.topCardElement;
    // if theres no cards, return
    if (cardElement === null) return;
    // else we will make this pile and the top card active
    else {
      activePile = drawPile;
      activeCard = cardElement;
      return;
    }
  }
  // if this is the active pile, its been clicked twice in a row, we will cancel
  if (activePile === drawPile) {
    activePile = null;
    activeCard = null;
    return;
  }
  // otherwise, the other pile is active, and we can pass a card
  else {
    activePile.moveCardToPile(drawPile, activeCard);
    activePile = null;
    activeCard = null;
  }
});
