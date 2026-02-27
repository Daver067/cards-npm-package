import "../styles/style.css";
import "./styles.css";
import "../navMenu/navMenu";
import { setTheme, tanTiles, StandardDeckOfCards, Player } from "@/dist";

const app = document.getElementById("app");

if (app) {
  setTheme(tanTiles, app);

  const deck = StandardDeckOfCards();

  const player1 = new Player("Player 1", deck, [{ name: "Hand" }]);
  const player2 = new Player("Player 2", deck, [{ name: "Hand" }]);
  const main = new Player(
    "Dealer",
    deck,
    [{ name: "Draw" }, { name: "Discard" }],
    "Draw",
  );

  const hand1 = player1.getPile("Hand");
  document.getElementById("p1Hand")?.appendChild(hand1.container);

  const hand2 = player2.getPile("Hand");
  document.getElementById("p2Hand")?.appendChild(hand2.container);

  const draw = main.getPile("Draw");
  document.getElementById("mainDraw")?.appendChild(draw.container);

  const discard = main.getPile("Discard");
  document.getElementById("mainDiscard")?.appendChild(discard.container);

  draw.cascade();

  hand1.createCascadeLayout("flop", [0.2, 0]);
  hand1.createCascadeLayout("tight", [0, -0.01]);
  hand1.applyCascadeLayout("flop");
  hand2.applyCascadeLayout("tight");
  hand1.cascade();
  hand2.cascade();

  window.addEventListener("DOMContentLoaded", async () => {
    for (let i = 0; i < 15; i++) {
      draw.moveCardToPile(hand1);
      await delay(5);
    }

    for (let i = 0; i < 15; i++) {
      draw.moveCardToPile(hand2);
      await delay(50);
    }
  });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
