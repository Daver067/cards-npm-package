import "../navMenu/navMenu";
import "../styles/reset.css";
import "./home.css";
import "../styles/style.css";
import { setTheme, redFelt, StandardDeckOfCards, deal } from "@/dist";

const app = document.getElementById("app");
if (app) {
  setTheme(redFelt, app);
  const deck = StandardDeckOfCards();

  const dealer = deck.createPileElement("dealer", deck.cards);
  dealer.shuffle();
  const titleCards = deck.createPileElement("title");

  (async function createTitle() {
    const titleContainer: HTMLDivElement = document.createElement("div");
    titleContainer.classList.add("title");
    titleContainer.style.position = "relative";
    titleContainer.style.display = "flex";
    titleContainer.style.justifyContent = "center";
    titleContainer.style.alignItems = "center";

    const h1 = document.createElement("h1");
    h1.textContent = "CardsJS";
    h1.style.position = "relative";
    h1.style.zIndex = "100";

    const fan = titleCards.container;
    fan.style.position = "absolute";
    fan.style.bottom = "-50%";
    fan.style.right = "-35%";

    titleContainer.appendChild(h1);
    h1.appendChild(fan);

    app.appendChild(titleContainer);

    const fontSize = parseFloat(window.getComputedStyle(h1).fontSize);
    const resizeCards = (size: number) => size / 150;
    const scale = resizeCards(fontSize);

    titleCards.container.style.transformOrigin = "bottom left";
    titleCards.container.style.zIndex = "-1";

    titleCards.container.style.transform = `
  scale(${scale})
`;

    // If you need it to update on window resize:
    window.addEventListener("resize", () => {
      const fontSize = parseFloat(window.getComputedStyle(h1).fontSize);
      const scale = resizeCards(fontSize);
      titleCards.container.style.transform = `
    scale(${scale})
  `;
    });

    // Add decorative fan cards as a logo behind title text
    window.addEventListener("DOMContentLoaded", async () => {
      titleCards.cascade();
      await deal(3, dealer, titleCards);

      // Create fan effect on cards behind H1 text
      await (async function fanTitleCards() {
        const totalCards = titleCards.cardElements.length;
        const fanSpread = 30; // Total angle of the fan (degrees)
        const startAngle = -fanSpread / 2; // Start from negative angle to center the fan
        const fanTilt = 30; // Overall tilt of the entire fan

        for (let index = 0; index < totalCards; index++) {
          const card = titleCards.cardElements[index];

          // Calculate rotation for this card + the overall fan tilt
          const rotation =
            startAngle + (fanSpread / (totalCards - 1)) * index + fanTilt;

          // Calculate slight vertical offset for arc effect
          const yOffset = Math.abs(rotation - fanTilt) * 0.5; // Subtract fanTilt to keep arc based on relative positions

          // Apply all transformations in one style
          card.container.style.position = "absolute";
          card.container.style.transformOrigin = "bottom center";
          card.container.style.transitionDuration = "0.2s";
          card.container.style.transform = `
      translate(-50%, 0)
      rotate(${rotation}deg)
      translateY(${yOffset}px)
    `;

          // Add a tiny z-index adjustment so cards stack properly left to right
          card.container.style.zIndex = `${index}`;

          // Wait for transition to complete before moving to next card
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      })();

      // After cards have fanned, flip them one by one
      (async function flipTitleCards() {
        const totalCards = titleCards.cardElements.length;
        await new Promise((resolve) => setTimeout(resolve, 400));

        for (let index = totalCards - 1; index > -1; index--) {
          const card = titleCards.cardElements[index];
          card.flip(100);
          card.container.style.transitionDuration = null;

          // Wait for transition to complete before moving to next card
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
      })();
    });
  })();

  (function createHero() {
    // Hero copy
    const content = {
      heading: "Your Cards, Your Rules",
      subheading:
        "A comprehensive library for card manipulation. Built by developers, for developers.",
    };

    // Create hero wrapper
    const container = document.createElement("div");
    container.classList.add("hero");

    // Create Hero text content
    (function createHeroText() {
      const text = document.createElement("div");
      text.classList.add("text");
      const heading = document.createElement("div");
      heading.classList.add("heading");
      heading.textContent = content.heading;
      const subheading = document.createElement("div");
      subheading.classList.add("subheading");
      subheading.textContent = content.subheading;
      text.append(heading);
      text.append(subheading);
      container.append(text);
    })();

    dealer.container.style.setProperty("--card-size", "min(15vw, 80px)");
    container.append(dealer.container);

    document.addEventListener("DOMContentLoaded", () => {
      dealer.cascade();
      setTimeout(() => {
        dealer.topCardElement.flip(1);
      }, 3400);
    });

    app.append(container);
  })();
}
