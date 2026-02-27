import "../styles/style.css";
import "./styles.css";
import "../navMenu/navMenu";
import {
  setTheme,
  greenFelt,
  StandardDeckOfCards,
  PlayingCard,
  PileElementType,
} from "@/dist";

const app = document.getElementById("app");
if (app) {
  // setting the background of the game
  setTheme(greenFelt, app);

  // Initialize a deck of playing cards
  const gameDeck = StandardDeckOfCards();
  // creating the pile Elements to display the cards
  const deck = gameDeck.createPileElement("deck", gameDeck.cards);
  document.getElementById("deck")?.appendChild(deck.container);
  // Type casting my blank arrays to ensure I have access to methods and props
  const tableaus: PileElementType<PlayingCard>[] = [];
  const freeSpots: PileElementType<PlayingCard>[] = [];
  const aceSpots: PileElementType<PlayingCard>[] = [];
  // running loops to make elements, as all tableaus are the same, all free spots, and all ace spots.
  for (let i = 1; i < 5; i++) {
    tableaus.push(gameDeck.createPileElement(`tableau${i}`, [], {}));
    document
      .getElementById(`tableau${i}`)
      ?.appendChild(tableaus[i - 1].container);
  }
  for (let i = 1; i < 3; i++) {
    freeSpots.push(gameDeck.createPileElement(`freeSpot${i}`, [], {}));
    aceSpots.push(gameDeck.createPileElement(`aceSpot${i}`, [], {}));
    document
      .getElementById(`freeSpot${i}`)
      ?.appendChild(freeSpots[i - 1].container);
    document
      .getElementById(`aceSpot${i}`)
      ?.appendChild(aceSpots[i - 1].container);
  }
  deck.cascade();
  window.addEventListener("DOMContentLoaded", async () => {
    deck.cardElements.forEach((element) => {
      element.flip();
    });
  });
}
