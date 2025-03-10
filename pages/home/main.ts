import "../navMenu/navMenu";
import "../styles/reset.css";
import "../styles/style.css";
import { setTheme, redFelt, StandardDeckOfCards, deal } from "@/dist";
import "./home.css";

const app = document.getElementById("app");

if (app) {
  setTheme(redFelt, app);
  const deck = StandardDeckOfCards();
  const dealer = deck.createPileElement("dealer", deck.cards);
  dealer.shuffle();
  const titleCards = deck.createPileElement("title");

  const createTitle = () => {
    const titleContainer = document.createElement("div");
    titleContainer.classList.add("title");
    titleContainer.style.position = "relative";
    titleContainer.style.display = "flex";
    titleContainer.style.justifyContent = "center";
    titleContainer.style.alignItems = "center";

    const h1 = document.createElement("h1");
    h1.textContent = "Card-Factory";
    h1.style.position = "relative";
    h1.style.zIndex = "100";

    const fan = titleCards.container;
    fan.style.position = "absolute";
    fan.style.right = "0";
    fan.style.zIndex = "-1";

    titleContainer.appendChild(h1);
    h1.appendChild(fan);
    app.appendChild(titleContainer);

    const resizeCards = (size) => size / 150;
    const updateScale = () => {
      const fontSize = parseFloat(window.getComputedStyle(h1).fontSize);
      titleCards.container.style.transform = `scale(${resizeCards(fontSize)})`;
      fanTitleCards();
    };
    updateScale();

    window.addEventListener("resize", updateScale);
  };

  const fanTitleCards = async () => {
    const totalCards = titleCards.cardElements.length;
    const fanSpread = 30;
    const startAngle = -fanSpread / 2;
    const fanTilt = 30;

    for (let index = 0; index < totalCards; index++) {
      const card = titleCards.cardElements[index];
      const rotation =
        startAngle + (fanSpread / (totalCards - 1)) * index + fanTilt;
      const yOffset = Math.abs(rotation - fanTilt) * 0.5;

      Object.assign(card.container.style, {
        position: "absolute",
        transformOrigin: "bottom center",
        transitionDuration: "0.2s",
        transform: `translate(-50%, 0) rotate(${rotation}deg) translateY(${yOffset}px)`,
        zIndex: `${index}`,
      });

      await new Promise((resolve) => setTimeout(resolve, 200));
      card.container.style.transitionDuration = null;
    }
  };

  const flipTitleCards = async () => {
    const totalCards = titleCards.cardElements.length;
    await new Promise((resolve) => setTimeout(resolve, 400));

    for (let index = totalCards - 1; index > -1; index--) {
      titleCards.cardElements[index].flip(100);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  };

  const createHero = () => {
    const content = {
      heading: "Your Cards, Your Rules",
      subheading:
        "A comprehensive library for card manipulation. Built by developers, for developers.",
      primaryButton: {
        text: "Get Started",
        url: "/docs/getting-started",
        icon: "/icons/mdi--check-bold.svg",
      },
      secondaryButton: {
        text: "GitHub Repo",
        url: "https://github.com/Daver067/cards-npm-package",
        icon: "/icons/mdi--github.svg",
      },
    };

    const container = document.createElement("div");
    container.classList.add("hero");

    const text = document.createElement("div");
    text.classList.add("text");
    text.innerHTML = `<div class="heading">${content.heading}</div><div class="subheading">${content.subheading}</div>`;

    container.append(text);
    dealer.container.style.setProperty("--card-size", "min(15vw, 80px)");
    container.append(dealer.container);
    app.append(container);
  };

  const initialize = async () => {
    createTitle();
    createHero();
    await dealer.cascade();
    await deal(3, dealer, titleCards);
    await fanTitleCards();
    await flipTitleCards();
    dealer.topCardElement.flip(100);
    titleCards.options.receiveCardAnimationCallback = fanTitleCards;
    titleCards.options.passCardAnimationCallback = fanTitleCards;
  };

  initialize();
}
