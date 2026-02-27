import { PileElementType } from "../../types/pile.types";
import Card from "../card/card";

export async function fanPile<T extends Card>(pile: PileElementType<T>) {
  pile.applyCascadeLayout("test");
  const totalCards = pile.cardElements.length;
  const fanSpread = 90; // Total angle of the fan (degrees)
  const startAngle = -fanSpread / 2; // Start from negative angle to center the fan
  const fanTilt = 45; // Overall tilt of the entire fan

  for (let index = 0; index < totalCards; index++) {
    const sourceCascade = [
      pile.cascadeOffset[0] *
        pile.cardElements[index].container.offsetWidth *
        index,
      pile.cascadeOffset[1] *
        pile.cardElements[index].container.offsetHeight *
        index,
    ];
    const card = pile.cardElements[index];

    // Calculate rotation for this card + the overall fan tilt
    const rotation =
      startAngle + (fanSpread / (totalCards - 1)) * index + fanTilt;

    // Apply all transformations in one style
    card.container.style.position = "absolute";
    card.container.style.transformOrigin = "bottom center";
    card.container.style.transitionDuration = "0.22s";
    const translate = `translate(${sourceCascade[0]}px,0px)`;
    const scale = 1.0;
    card.container.style.transform = `${translate} scale(${scale}) rotate(${rotation}deg)`;
    for (let j = index; j < totalCards; j++) {
      pile.cardElements[j].container.style.transformOrigin = "bottom center";
      card.container.style.transitionDuration = "0.2s";
      pile.cardElements[j].container.style.transform =
        `${translate} scale(${scale}) rotate(${rotation}deg)`;
      card.container.style.transitionDuration = "0.05s";
    }

    // Add a tiny z-index adjustment so cards stack properly left to right
    card.container.style.zIndex = `${index}`;

    // Wait for transition to complete before moving to next card
    await new Promise((resolve) => setTimeout(resolve, 32));
  }
}

export async function flipPileSequential<T extends Card>(
  pile: PileElementType<T>,
  delay = 0,
) {
  const totalCards = pile.cardElements.length;
  await new Promise((resolve) => setTimeout(resolve, delay));
  for (let index = 0; index < totalCards; index++) {
    const card = pile.cardElements[index];
    card.flip(400);

    setTimeout(() => {
      card.container.style.zIndex = JSON.stringify(totalCards - index);
    }, 405);

    // Wait for transition to complete before moving to next card
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  await setTimeout(() => {
    pile.cardElements.forEach((element) => {
      element.container.style.transitionDuration = "1.0s";
      element.container.style.transform =
        pile.topCardElement.container.style.transform;
    });
  }, 1500);
  await setTimeout(() => {
    pile.applyCascadeLayout("stack");
    pile.cascade(500);
  }, 2500);
}
