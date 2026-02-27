import Card from "../card/card";
import { PileElementType } from "../../types/pile.types";
import { CardElementType } from "../../types/card.types";

export const slideCard = async <T extends Card>(
  cardElement: CardElementType<T>,
  vector: number[],
  duration: number,
) => {
  if (cardElement.transform.active) return;
  if (vector.length !== 2) {
    throw "Error: vector must be an array of 2 values, x and y.";
  }
  const { scale, rotate } = cardElement.transform;
  const newTranslate = `translate(${vector[0]}px, ${vector[1]}px)`;
  cardElement.transform.translate = newTranslate;

  const transform = `${newTranslate} ${scale} ${rotate}`;

  const keys = {
    transform: transform,
  };

  const options = {
    duration: duration,
    easing: "ease-out",
    delay: 0,
    direction: "normal" as PlaybackDirection,
  };

  const anim = cardElement.container.animate(keys, options);
  cardElement.container.dispatchEvent(new Event("animationstart"));
  return anim.finished.then((animation) => {
    cardElement.container.style.transform = transform;
    cardElement.container.dispatchEvent(new Event("animationend"));
    return animation;
  });
};

export const turnCard = async <T extends Card>(
  cardElement: CardElementType<T>,
  duration: number,
) => {
  if (cardElement === undefined) return new Promise(() => undefined);
  if (cardElement.transform.active) return new Promise(() => undefined);

  cardElement.transform.rotate =
    cardElement.transform.rotate === `rotate(0deg)`
      ? "rotate(90deg)"
      : "rotate(0deg)";

  const { translate, scale, rotate } = cardElement.transform;
  const transform = `${translate} ${scale} ${rotate}`;

  const keys = {
    transform: transform,
  };

  const options = {
    duration: duration,
    easing: "linear",
    delay: 0,
    direction: "normal" as PlaybackDirection,
  };

  const anim = cardElement.container.animate(keys, options);
  cardElement.container.dispatchEvent(new Event("animationstart"));
  return anim.finished.then(() => {
    cardElement.container.style.transform = transform;
    cardElement.container.dispatchEvent(new Event("animationend"));
    return Promise.resolve(true);
  });
};

export const zoomCard = async <T extends Card>(
  cardElement: CardElementType<T>,
  factor: number,
  duration: number,
) => {
  // eslint-disable-next-line prefer-const
  let { translate, scale, rotate } = cardElement.transform;

  scale = `scale(${factor})`;
  const transform = `${translate} ${scale} ${rotate}`;

  const keys = {
    transform: transform,
  };

  const options = {
    duration: duration,
    easing: "ease-out",
    delay: 0,
    direction: "normal" as PlaybackDirection,
  };

  const anim = cardElement.container.animate(keys, options);
  return anim.finished.then(() => {
    cardElement.container.style.transform = transform;
  });
};

//! I havent tested this
export const slideDeck = async <T extends Card>(
  pile: PileElementType<T>,
  vector: number[],
  duration: number,
) => {
  if (vector.length !== 2) {
    throw "Error: vector must be an array of 2 values, x and y.";
  }

  const translate = `translate(${vector[0]}px, ${vector[1]}px)`;
  const transform = `${translate} scale(1) rotate(0deg)`;

  const keys = {
    transform: transform,
  };

  const options = {
    duration: duration,
    easing: "ease-out",
    delay: 0,
    direction: "normal" as PlaybackDirection,
  };

  const anim = pile.container.animate(keys, options);
  return anim.finished.then(() => {
    pile.container.style.transform = transform;
  });
};

/**
 *
 * This is an ASYNC function. You likely want to AWAIT this before performing more operations
 * @param numberOfCards The number of cards to deal out
 * @param from The pile the cards are coming from
 * @param to The pile(s?) the cards are going to
 * @param delayTime The delay between dealing cards
 */
export async function deal<T extends Card>(
  numberOfCards: number,
  from: PileElementType<T>,
  to: PileElementType<T>[] | PileElementType<T>,
  delayTime: number = 200,
) {
  const piles = Array.isArray(to) ? to : [to];
  const promises: Promise<boolean>[] = [];

  for (let i = 0; i < numberOfCards * piles.length; i++) {
    const currentPile = piles[i % piles.length];

    // Let animations run in parallel.
    const animationPromise = from.moveCardToPile(currentPile);
    if (!animationPromise) {
      return Promise.all(promises);
    } // Handle early exit

    // Await the finished property inside the Promise array.
    promises.push(
      animationPromise.then(
        (animation) =>
          animation?.finished?.then(() => true) ?? Promise.resolve(true),
      ),
    );

    if (i < numberOfCards * piles.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayTime));
    }
  }
  // Now we wait for all animations to complete
  return Promise.all(promises);
}

export async function denyMove<T extends Card>(
  cardElement: CardElementType<T>,
) {
  if (cardElement === undefined) return new Promise(() => undefined);
  if (cardElement.transform.active) return new Promise(() => undefined);
  const backgroundOverlay = document.createElement("div");
  backgroundOverlay.classList.add("card-background-overlay");

  // Append it inside the card container
  cardElement.container.appendChild(backgroundOverlay);

  // Get the computed z-index of the card container
  const computedZIndex = window.getComputedStyle(cardElement.container).zIndex;

  // If the z-index is not 'auto', set the overlay to be one level below
  if (!isNaN(parseInt(computedZIndex)) && computedZIndex !== "auto") {
    backgroundOverlay.style.zIndex = JSON.stringify(parseInt(computedZIndex));
  } else {
    backgroundOverlay.style.zIndex = "1"; // Default if no valid z-index is found
  }
  backgroundOverlay.style.opacity = "0.2";

  const keys = {
    transform: [
      "scale(1)",
      "scale(1.1)",
      "scale(1.1) translateX(-5px)",
      "scale(1.1) translateX(5px)",
      "scale(1.1) translateX(-5px)",
      "scale(1)",
    ],
  };

  const options = {
    duration: 600,
    easing: "ease-in-out",
    delay: 0,
    direction: "normal" as PlaybackDirection,
    composite: "add" as CompositeOperation,
  };
  cardElement.container.style.backgroundColor = "red";
  const anim = cardElement.container.animate(keys, options);
  cardElement.container.dispatchEvent(new Event("animationstart"));
  return anim.finished.then((promise) => {
    cardElement.container.dispatchEvent(new Event("animationend"));
    cardElement.container.removeChild(backgroundOverlay);
    return promise;
  });
}

// animates, and also moves the cardElement to new pile
export async function animateMoveCardToNewPile<T extends Card>(
  source: PileElementType<T>,
  destination: PileElementType<T>,
  cardElement: CardElementType<T>,
  index: number,
  groupOffset: number = 0,
) {
  // ensure moving card has higher z-index than both decks
  cardElement.container.style.zIndex = String(destination.cards.length + 1000);

  // get the values for where the card is and where its going
  const sourceBox = source.container.getBoundingClientRect();
  const destinationBox = destination.container.getBoundingClientRect();

  // The calculation for how far the card needs to be determined by the cascade vectors of the destination pile and the number of cards.
  const destinationCascade = [
    destination.cascadeOffset[0] *
      cardElement.container.offsetWidth *
      (destination.cards.length - 1),
    destination.cascadeOffset[1] *
      cardElement.container.offsetHeight *
      (destination.cards.length - 1),
  ];
  // When the card is appeneded to the new pile, and keeps the old transform, it will move that far away again.
  const sourceCascade = [
    source.cascadeOffset[0] *
      cardElement.container.offsetWidth *
      (index + groupOffset),
    source.cascadeOffset[1] *
      cardElement.container.offsetHeight *
      (index + groupOffset),
  ];

  // change the value of the cards transform to make it appear as it is still on top of the "source" pile
  const { scale, rotate } = cardElement.transform;
  const translate = `translate(${sourceBox.x - destinationBox.x + sourceCascade[0]}px, ${sourceBox.y - destinationBox.y + sourceCascade[1]}px)`;
  cardElement.transform.translate = translate;
  cardElement.container.style.transform = `${translate} ${scale} ${rotate}`;

  // the vector to where slideCard will move the card to
  const vector2: [number, number] = [
    destinationCascade[0],
    destinationCascade[1],
  ];
  cardElement.container.draggable = false;
  const adjustZIndex = (cardElements: CardElementType<T>[]) => {
    for (let index = 0; index < cardElements.length; index++) {
      const card = cardElements[index];
      card.container.style.zIndex = String(index);
    }
  };
  // animate the card moving from the current transform (appearing on source pile) to its rightful spot in destination cascade
  return slideCard(cardElement, vector2, 600).then((animation) => {
    // wait for the card to move, adjust the draggable setting to that of the new pile
    cardElement.container.draggable = destination.options.draggable;
    // adjust the ZIndex of both piles cardElements
    adjustZIndex(destination.cardElements);
    adjustZIndex(source.cardElements);
    // We must adjust the transform on the card to be that of the destinations cascade now.
    cardElement.transform.translate = `translate(${destinationCascade[0]}px, ${destinationCascade[1]}px)`;
    cardElement.container.style.transform = `${`translate(${destinationCascade[0]}px, ${destinationCascade[1]}px)`} ${scale} ${rotate}`;
    return animation;
  });
}
