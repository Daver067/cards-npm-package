import Pile from "./pile";
import { CardElementType } from "../../types/card.types";
import { DragData } from "../../types/pile.types";
import { PileOptionsType } from "../../types/pile.types";
import Card from "../card/card";
import "../../styles/pile.css";
import type { Layout, Offset, PileElementType } from "../../types/pile.types";
import Deck from "../deck/deck";
import {
  animateMoveCardToNewPile,
  denyMove,
  slideCard,
} from "../animate/animate";
import { Rules } from "../rules/rules";

// These are recipes for cascade()
const layouts: Layout = {
  stack: {
    offset: [-0.003, -0.003],
  },
  cascade: {
    offset: [0.4, 0],
  },
  visibleStack: {
    offset: [0, 0.25],
  },
};

export const createDefaultOptions = <T extends Card>(): PileOptionsType<T> => ({
  cardElements: [],
  layout: "stack",
  rules: new Rules(),
  draggable: true,
  groupDrag: true,
  receiveCardCallback: () => true,
  passCardCallback: () => true,
  animatePass: true,
  passCardAnimationCallback: null,
  receiveCardAnimationCallback: null,
});

// Adds a base the size of the card to be the basis of deck layouts.\
export const pileElement = <T extends Card>(
  pile: Pile<T>,
  deck: Deck<T>,
  partialOptions: Partial<PileOptionsType<T>> = {},
): PileElementType<T> => {
  const options: PileOptionsType<T> = {
    ...createDefaultOptions(),
    ...partialOptions,
  };

  // Cascade values and setters
  const cascadeOffset = [0, 0] as [number, number];
  const cascadeDuration = 0;
  applyCascadeLayout(options.layout);

  // creating the container
  const container = document.createElement("div");
  container.classList.add("deck-base");
  // add a random id to the container. This is for storing the id during click handlers
  container.id = Math.random().toString(36).slice(2, 11);
  // if this pile is draggable, we will add all of the drag functions
  if (options.draggable) {
    container.ondragstart = drag;
    container.ondragend = dragend;
    container.ondrop = drop;
    container.ondragover = allowDrop;
    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);
  }
  window.addEventListener("resize", () => {
    cascade();
  });
  const { cardElements } = options;

  /**
   * Fixes the shadows on cards when a card is moved
   * @returns undefined always
   */
  const updateShadows = () => {
    if (cardElements.length <= 0) return;
    for (let i = 0; i < cardElements.length; i++) {
      const front = cardElements[i].front;
      const back = cardElements[i].back;
      if (
        Math.abs(cascadeOffset[0]) > 0.04 ||
        Math.abs(cascadeOffset[1]) > 0.04 ||
        i === cardElements.length - 1
      ) {
        if (front) {
          front.classList.add("card-shadow");
        }
        back.classList.add("card-shadow");
      } else {
        if (front) {
          front.classList.remove("card-shadow");
        }
        back.classList.remove("card-shadow");
      }
    }
    if (cardElements[0].front) {
      cardElements[0].front.classList.add("card-shadow");
    }
    cardElements[0].back.classList.add("card-shadow");
  };

  /**
   *
   * Use this to initiate decks, or if you have removed/added cards unconventionally this will stack them correctly again
   * @param duration how long the animation will take
   * @returns an array of promises of the animations
   */
  const cascade = (duration = cascadeDuration) => {
    reset();
    updateShadows();
    const arrayFinished = [];
    for (let i = 0; i < cardElements.length; i++) {
      const vector2 = [];
      const cardElement = cardElements[i].container;
      vector2[0] = cascadeOffset[0] * cardElement.offsetWidth * i;
      vector2[1] = cascadeOffset[1] * cardElement.offsetHeight * i;

      const slide = slideCard(cardElements[i], vector2, duration);
      arrayFinished.push(slide);
    }
    return Promise.all(arrayFinished);
  };

  function applyCascadeLayout(layoutName: string) {
    const newOffset = layouts[layoutName].offset.slice();
    if (Object.keys(layouts).includes(layoutName)) {
      cascadeOffset[0] = newOffset[0];
      cascadeOffset[1] = newOffset[1];
    } else {
      throw new Error(`No cascade layout with that name found: ${layouts}`);
    }
  }

  /**
   *
   * @param layoutName a name for your layout
   * @param offset a 2 value array, which represents the x and y shift the cards will appear in
   */
  function createCascadeLayout(layoutName: string, offset: Offset) {
    if (Object.keys(layouts).includes(layoutName)) {
      throw new Error("A layout with that name already exists");
    } else {
      Object.defineProperty(layouts, layoutName, {
        value: { offset },
        enumerable: true, // So it shows up in Object.keys() for your existence check
      });
    }
  }

  /**
   *
   * @param destinationPile PileElement that the card is moving to
   * @param cardElement The card being moved. Defaults to the top card of source pile
   * @param gameRules ability to pass specific rules for this card moving. Defaults to the piles rules which defaults: () => true
   * @param groupOffset this is provided by the drag group move functionality
   * @param animationCallback Allows you to change the default animation, null for no animation
   * @returns false is unsuccessful, an animation with animation.finished as a promise if successful
   */
  function moveCardToPile(
    this: PileElementType<T>,
    destinationPile: PileElementType<T>,
    cardElement = cardElements[cardElements.length - 1],
    groupOffset: number = 0,
  ) {
    const gameRules = options.rules;
    //const animationCallback = options.moveCardAnimation;
    try {
      // checks to find the card in the source pile
      if (cardElements.indexOf(cardElement) === -1) {
        throw "could not find card in source pile";
      }

      // checks to see if this deck can pass that card
      if (gameRules.canPass(this, destinationPile, cardElement) === false) {
        throw "source pile cannot pass card";
      }

      // checks to see if the destination deck can receive this card
      if (
        destinationPile.options.rules.canReceive(
          this,
          destinationPile,
          cardElement,
        ) === false
      ) {
        throw "destination pile cannot receive card";
      }
      // attempt the pass within the pile objects
      const cardPassed = pile.passCard(destinationPile.pile, cardElement.card);
      // if the attempt to pass the card is a fail, return false
      if (cardPassed === false) {
        throw "pile object could not pass card object";
      }
    } catch (error) {
      console.error(error);
      return false;
    }

    // if the animation callback is set to null, don't animate anything and return
    //! untested
    if (options.animatePass === false) {
      destinationPile.cardElements.push(
        cardElements.splice(cardElements.indexOf(cardElement), 1)[0],
      );
      cascade();
      destinationPile.cascade();
      // hit the callbacks for both passing and recieving cards
      options.passCardCallback(cardElement, this, destinationPile);
      destinationPile.options.receiveCardCallback(
        cardElement,
        this,
        destinationPile,
      );
      return Promise.resolve(undefined);
    }

    // Adds card to destination, removes from this pile
    // append the new card to the other container, and cardElement array
    destinationPile.container.appendChild(cardElement.container);
    destinationPile.cardElements.push(cardElement);
    // find the indes of the card element
    const index = cardElements.findIndex((element) => {
      return JSON.stringify(element) === JSON.stringify(cardElement);
    });
    // Should never be -1, but if the index wasn't found abort
    if (index === -1) return Promise.reject(false);
    // If the card wasn't the top card, cascade the hand back together.
    // If group Drag is on, it will cause unneccesary shifting, as the whole pile it leaving anyways
    if (index !== cardElements.length - 1 && options.groupDrag === false) {
      cardElements.splice(cardElements.indexOf(cardElement), 1);
      cascade(300);
    } else {
      cardElements.splice(cardElements.indexOf(cardElement), 1);
    }

    // the card got passed, and this is the animation we want to show.
    return animateMoveCardToNewPile(
      this,
      destinationPile,
      cardElement,
      index,
      groupOffset,
    ).then((animation) => {
      // wait for the card to move, then update the shadows on both piles
      // hit the callbacks for both passing and recieving cards
      options.passCardCallback(cardElement, this, destinationPile);
      destinationPile.options.receiveCardCallback(
        cardElement,
        this,
        destinationPile,
      );
      updateShadows();
      destinationPile.updateShadows();
      if (options.passCardAnimationCallback !== null)
        options.passCardAnimationCallback();
      if (destinationPile.options.receiveCardAnimationCallback !== null)
        destinationPile.options.receiveCardAnimationCallback();
      return animation;
    });
  }

  // resets the container of the DeckBase
  const reset = () => {
    while (container.firstElementChild) {
      container.removeChild(container.firstElementChild);
    }
    adjustZIndex(cardElements);
    cardElements.forEach((element) => {
      element.container.draggable = options.draggable;
      container.appendChild(element.container);
    });
  };

  /**
   *
   * @param cardElements adjusts the zIndex of a piles CardElements. Used during card moving operations
   */
  const adjustZIndex = (cardElements: CardElementType<T>[]) => {
    for (let index = 0; index < cardElements.length; index++) {
      const card = cardElements[index];
      card.container.style.zIndex = String(index);
    }
  };

  /**
   * shuffles the pile object, then sorts the cardElements to match the pile
   */
  const shuffle = () => {
    pile.shuffle();
    // Sort cardElements[] to match the shuffled order of cards[]
    cardElements.sort(
      (a, b) => pile.cards.indexOf(a.card) - pile.cards.indexOf(b.card),
    );
  };
  //
  //
  //
  //
  //
  //
  /********************************************************************************
   * ********************** Drag and Drop Below ***********************************
   * ******************************************************************************
   */
  //
  //
  //
  //
  //
  //
  //

  /**
   *  Used during custom click handlers to return which card element was clicked on.
   * @param element any html element that is a child of a card container
   * @returns the cardElement<T> that was clicked on
   */
  const findCardContainer = (element: HTMLElement) => {
    if (element.classList.contains("card-container")) {
      const returnElement = cardElements.find(
        (cardElement) => cardElement.container === element,
      );
      if (!returnElement) return null;
      else return returnElement;
    }
    if (element.classList.contains("deck-base")) return null;
    else if (element.parentElement)
      return findCardContainer(element.parentElement);
    else throw "something went wrong in find card container";
  };

  // using the id of the pile, step into deck to find which pile it is
  const findPileElement = (id: string) => {
    return deck.pileElements.filter((item) => item.container.id === id)[0];
  };

  // Define the function before it's used
  function allowDrop(e: DragEvent) {
    e.preventDefault();
  }

  function drag(e: DragEvent) {
    if (cardElements[cardElements.length - 1].transform.active === true) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (!(e.target instanceof HTMLElement)) return;

    // Find the main card container.
    const cardElement = findCardContainer(e.target);
    if (cardElement === null) return;
    if (
      options.rules.canPass(
        findPileElement(container.id),
        {} as PileElementType<T>,
        cardElement,
      ) === false
    ) {
      denyMove(cardElement);
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // Prepare your drag data.
    const data = {
      indexs: [cardElements.indexOf(cardElement)],
      sourcePileContainerId: container.id,
    };

    // Create a custom drag image that visually represents the group.
    const dragImage = document.createElement("div");
    dragImage.id = "card-dragImage";
    dragImage.classList.add("drag-image");

    // Get the parent element that holds the card and its siblings.
    const pileElement = cardElement.container.parentElement;
    if (!pileElement) return;

    // Card dragged index
    const originalIndex = cardElements.indexOf(cardElement);

    function isChrome() {
      const userAgent = navigator.userAgent;
      // Check if 'Chrome' exists in the userAgent string but exclude 'Edge' and 'Opera'
      return /Chrome/.test(userAgent) && !/Edge|OPR|Opera/.test(userAgent);
    }

    //! Fix this to actually work for safari and firefox. Chrome Version works fine
    if (isChrome()) {
      cardElements.forEach((element) => {
        // Get the card's z-index as a number.
        const cardIndex = cardElements.indexOf(element);
        if (cardIndex === originalIndex && options.groupDrag === false) {
          element.container.classList.add("card-dragging");
          const originalTransform = element.container.style.transform;
          const containerScale = container.style.transform;
          const newTransform = `${originalTransform} ${containerScale}`;
          element.container.style.transform = newTransform;
          const clone = element.container.cloneNode(true);
          element.container.style.transform = originalTransform;
          dragImage.appendChild(clone);
        }
        // Only add the class if the card's z-index is higher than the original.
        // Clone each card element and append to dragImage.
        if (cardIndex >= originalIndex && options.groupDrag === true) {
          element.container.classList.add("card-dragging");
          const originalTransform = element.container.style.transform;
          const containerScale = container.style.transform;
          const newTransform = `${originalTransform} ${containerScale}`;
          element.container.style.transform = newTransform;
          const clone = element.container.cloneNode(true);
          element.container.style.transform = originalTransform;
          dragImage.appendChild(clone);
          if (cardIndex !== originalIndex) {
            data.indexs.push(cardIndex);
          }
        }
      });
    } else {
      //! this rotates the card back to straight, and only shows 1 card in a group
      cardElements.forEach((element) => {
        // Get the card's z-index as a number.
        const cardIndex = cardElements.indexOf(element);
        if (cardIndex === originalIndex && options.groupDrag === false) {
          element.container.classList.add("card-dragging");
          const originalTransform = element.container.style.transform;
          element.container.style.transform = "";
          const clone = element.container.cloneNode(true);
          element.container.style.transform = originalTransform;
          dragImage.appendChild(clone);
        }
        // Only add the class if the card's z-index is higher than the original.
        // Clone each card element and append to dragImage.
        if (cardIndex >= originalIndex && options.groupDrag === true) {
          element.container.classList.add("card-dragging");
          if (cardIndex === originalIndex) {
            const originalTransform = element.container.style.transform;
            element.container.style.transform = "";
            const clone = element.container.cloneNode(true);
            element.container.style.transform = originalTransform;
            dragImage.appendChild(clone);
          }
          if (cardIndex !== originalIndex) {
            data.indexs.push(cardIndex);
          }
        }
      });
    }
    // It is necessary to add the drag image element off-screen before using it.
    dragImage.style.position = "absolute";
    dragImage.style.top = "-9999px";
    dragImage.style.pointerEvents = "none"; // Prevent interference
    dragImage.style.zIndex = "1";
    dragImage.style.transform = pileElement.style.transform;

    document.body.appendChild(dragImage);

    // calculating where the click occurred on the original card
    const rect = cardElement.container.getBoundingClientRect(); // Get element position
    const offsetX = e.clientX - rect.left; // X offset from where user clicked
    const offsetY = e.clientY - rect.top; // Y offset from where user clicked

    e.dataTransfer?.setDragImage(dragImage, offsetX, offsetY);

    e.dataTransfer?.setData("application/json", JSON.stringify(data));
  }

  function dragend(e: DragEvent) {
    // clears the image being used by drag
    const dragImage = document.getElementById("card-dragImage");
    if (dragImage) {
      dragImage.remove();
    }
    // if the drop target isnt an element then abort
    if (!(e.target instanceof HTMLElement)) return;
    const cardElement = findCardContainer(e.target);

    if (cardElement === null || cardElement === undefined) return;
    const parent = cardElement.container.parentElement;
    // clears dragging class from all selected elements
    if (parent) {
      Array.from(parent.children).forEach((child) => {
        child.classList.remove("card-dragging");
      });
    }
  }

  function drop(e: DragEvent) {
    // if drop target isnt element, get out
    if (!(e.target instanceof HTMLElement)) return;
    const jsonData = e.dataTransfer?.getData("application/json");
    // if the data isnt there, the draggable probably shouldn't have been draggable
    if (!jsonData) throw "no json data... source probably isnt draggable";
    const { indexs, sourcePileContainerId } = JSON.parse(jsonData) as DragData;
    // something went wrong with the data
    if (indexs.length === 0 || !sourcePileContainerId) {
      throw "no card index during drop";
    }
    // figure out which piles the cards came from / are going to
    const sourcePile = findPileElement(sourcePileContainerId);
    const destinationPile = findPileElement(container.id);

    // dont animate when cards set back down
    if (sourcePile.container.id === container.id) {
      return "cant drop in own container";
    }

    // grabs all the card elements from the index data
    const cardElements = indexs.map((index) => {
      return sourcePile.cardElements[parseInt(index)];
    });

    // removes all the card-dragging classes
    cardElements.forEach((element) => {
      element.container.classList.remove("card-dragging");
    });

    // try passing the first card
    const attemptPrimaryMove = sourcePile.moveCardToPile(
      destinationPile,
      sourcePile.cardElements[parseInt(indexs[0])],
    );
    if (attemptPrimaryMove === false) {
      cardElements.forEach((element) => {
        denyMove(element);
      });
    }

    // if the first card is successful, pass the rest
    else {
      cardElements.splice(0, 1);
      cardElements.forEach((element, index) => {
        sourcePile.moveCardToPile(destinationPile, element, index + 1);
      });
    }
  }

  //
  //
  //
  //
  //
  //
  /********************************************************************************
   * ********************** Touch and Drop Below ***********************************
   * ******************************************************************************
   */
  //
  //
  //
  //
  //
  //
  //

  const touchData: {
    startX: number;
    startY: number;
    cardElement: CardElementType<T>[];
    indexs: number[];
    dragImage: HTMLElement | null;
  } = {
    startX: 0,
    startY: 0,
    cardElement: [],
    indexs: [],
    dragImage: null,
  };

  // Handle touch start
  function handleTouchStart(e: TouchEvent) {
    // prevent default stops the scrolling of the page during a touch event
    e.preventDefault();
    e.stopPropagation();
    // if the top card is moving, return
    if (cardElements[cardElements.length - 1].transform.active === true) {
      return;
    }
    if (!(e.target instanceof HTMLElement)) return;

    // separate the touch event and the card element touched
    const touch = e.touches[0];
    const cardElement = findCardContainer(e.target);

    if (!cardElement) return;
    // ensure the card grabbed is passable
    if (
      options.rules.canPass(
        findPileElement(container.id),
        {} as PileElementType<T>,
        cardElement,
      ) === false
    ) {
      denyMove(cardElement);
      return;
    }

    // update touch data
    touchData.startX = touch.clientX;
    touchData.startY = touch.clientY;
    touchData.cardElement.push(cardElement);

    // Create a drag image similar to the desktop version
    const rect = cardElement.container.getBoundingClientRect();
    // using window.scrollX vs clientX because on zoom on mobile clientX causes wrong placement
    touchData.startX = touch.pageX - window.scrollX - rect.left;
    touchData.startY = touch.pageY - window.scrollY - rect.top;
    // save original transform info
    const originalTransform = cardElement.container.style.transform;

    // setup the drag image div
    const dragImage = document.createElement("div");
    dragImage.id = "card-dragImage";
    dragImage.classList.add("drag-image");
    dragImage.style.position = "absolute";
    dragImage.style.left = `${touch.pageX - touchData.startX}px`;
    dragImage.style.top = `${touch.pageY - touchData.startY}px`;
    dragImage.style.opacity = "0.5";
    dragImage.style.pointerEvents = "none";
    dragImage.style.zIndex = "1000";
    dragImage.id = "card-dragImage";

    // clear the transform for the original drag image. (this one is absolute, so a transform will unnecessarily move it)
    cardElement.container.style.transform = "";
    const currentDragItem = cardElement.container.cloneNode(
      true,
    ) as HTMLElement;
    // add the original transform back on after cloned
    cardElement.container.style.transform = originalTransform;
    // Apply dragging class
    cardElement.container.classList.add("card-dragging");

    // append dragItem to dragImage, add to page
    dragImage.appendChild(currentDragItem);
    document.body.appendChild(dragImage);

    // save data to touchData
    touchData.indexs.push(cardElements.indexOf(cardElement));

    if (options.groupDrag) {
      // Get the parent element that holds the card and its siblings.
      const pileElement = cardElement.container.parentElement;
      if (!pileElement) return;
      const originalIndex = cardElements.indexOf(cardElement);
      // Iterate over all children in the pile.
      cardElements.forEach((element) => {
        // Get the card's z-index as a number.
        const cardIndex = cardElements.indexOf(element);

        // Only add the class if the card's z-index is higher than the original.
        // Clone each card element and append to dragImage.
        if (cardIndex > originalIndex) {
          // since were dealing with absolute positioning we have to manually figure out the cascade offset for each subsequent card
          const offsetDifference = cardIndex - originalIndex;
          const Xoffset =
            cascadeOffset[0] *
            cardElement.container.offsetWidth *
            offsetDifference;
          const Yoffset =
            cascadeOffset[1] *
            cardElement.container.offsetHeight *
            offsetDifference;
          // add dragging class to next element
          element.container.classList.add("card-dragging");

          // save original transform info
          const originalTransform = element.container.style.transform;
          const containerScale = container.style.transform;
          // change the transform of the card, so we can accurately clone the element
          const newTransform = `translate(${Xoffset}px, ${Yoffset}px) ${containerScale}`;
          element.container.style.transform = newTransform;
          const clone = element.container.cloneNode(true);
          // after clone, revert to original
          element.container.style.transform = originalTransform;
          // add new element to dragImage
          dragImage.appendChild(clone);
          if (cardIndex !== originalIndex) {
            touchData.indexs.push(cardIndex);
          }
        }
      });
    }
    // save data to touchData
    touchData.dragImage = dragImage;
  }

  // Handle touch move
  function handleTouchMove(e: TouchEvent) {
    // stops scrolling
    e.preventDefault();

    // separate the touch event and get the dragImage from data
    const touch = e.touches[0];
    const { dragImage } = touchData;

    if (dragImage) {
      // Use pageX/pageY for zoom-safe movement
      dragImage.style.left = `${touch.pageX - touchData.startX}px`;
      dragImage.style.top = `${touch.pageY - touchData.startY}px`;
    }
  }

  // Handle touch end
  function handleTouchEnd(e: TouchEvent) {
    if (cardElements[cardElements.length - 1].transform.active === true) {
      // stop scrolling
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (!(e.target instanceof HTMLElement)) return;
    // get the cardElement
    const cardElement = findCardContainer(e.target);

    const { dragImage } = touchData;
    // ensure all the data was found
    if (!cardElement || !dragImage) return;
    if (cardElement === null || cardElement === undefined) return;
    const parent = cardElement.container.parentElement;
    // clears dragging class from all selected elements
    if (parent) {
      Array.from(parent.children).forEach((child) => {
        child.classList.remove("card-dragging");
      });
    }
    // Remove drag image and dragging class
    dragImage.remove();

    // Simulate drop based on final touch position
    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(
      touch.clientX,
      touch.clientY,
    ) as HTMLElement;

    const data = {
      indexs: touchData.indexs,
      sourcePileContainerId: container.id,
    };
    // simulate dataTransfer object
    const dataXfer = new DataTransfer();
    dataXfer.setData("application/json", JSON.stringify(data));

    if (dropTarget) {
      // use the drop event from mouse events
      const dropEvent = new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        clientX: touch.clientX,
        clientY: touch.clientY,
        dataTransfer: dataXfer,
      });
      dropTarget.dispatchEvent(dropEvent);
    }

    // Reset touchData
    touchData.startX = 0;
    touchData.startY = 0;
    touchData.cardElement.length = 0;
    touchData.indexs.length = 0;
    touchData.dragImage = null;
  }

  return {
    get pile() {
      return pile;
    },
    get cards() {
      return pile.cards;
    },
    get cascadeOffset() {
      return cascadeOffset;
    },
    get topCardElement() {
      return cardElements[cardElements.length - 1];
    },
    get cardElements() {
      return cardElements;
    },
    get container() {
      return container;
    },
    get cascadeDuration() {
      return cascadeDuration;
    },
    options,
    moveCardToPile,
    updateShadows,
    cascade,
    applyCascadeLayout,
    createCascadeLayout,
    findCardContainer,
    shuffle,
  };
};
