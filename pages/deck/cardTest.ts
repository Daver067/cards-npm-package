import {
  setTheme,
  redOak,
  StandardDeckOfCards,
  slideCard,
  zoomCard,
} from "@/dist";
import "../navMenu/navMenu";
import "../styles/reset.css";
import "./styles.css";

const app = document.getElementById("app");
if (app) {
  setTheme(redOak, app);

  // Deck
  const playingCards = StandardDeckOfCards();
  const drawPile = playingCards.createPileElement("draw", playingCards.cards);
  drawPile.pile.shuffle();

  const p1DrawPileElement = playingCards.createPileElement(
    "p1draw",
    drawPile.cards.splice(0, 5),
    { draggable: true },
  );
  const player1HandPile = playingCards.createPileElement(
    "p1Hand",
    drawPile.cards.splice(0, 5),
  );

  const p1DrawDOM = document.getElementById("p1DrawPile");
  p1DrawDOM?.appendChild(p1DrawPileElement.container);
  p1DrawPileElement.cascade();
  p1DrawPileElement.container.addEventListener("dblclick", () => {
    p1DrawPileElement.moveCardToPile(player1HandPile);
  });
  p1DrawPileElement.container.addEventListener("click", () => {
    p1DrawPileElement.topCardElement.flip();
  });

  const p1Hand = document.getElementById("p1Hand");
  p1Hand?.appendChild(player1HandPile.container);
  player1HandPile.cascade();
  player1HandPile.container.addEventListener("click", async () => {
    const card = player1HandPile.topCardElement;
    //turnCard(card, 1000);

    //denyMove(card);

    slideCard(card, [100, 100], 1000).then(() => slideCard(card, [0, 0], 1000));

    /* uncomment the next two lines together to see await */
    await zoomCard(card, 2, 1000);
    zoomCard(card, 1, 2000);
  });
}
