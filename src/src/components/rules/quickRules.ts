/* eslint-disable @typescript-eslint/no-unused-vars */
import { CardElementType } from "../../types/card.types";
import { PileElementType } from "../../types/pile.types";
import PlayingCard from "../card/playingCard/playingCardClass";

const s = {} as PileElementType<PlayingCard>;
const d = {} as PileElementType<PlayingCard>;
const c = {} as CardElementType<PlayingCard>;

export const quickPassRules = {
  alwaysPass: (_: unknown, __: unknown, ___: unknown) => true,
  neverPass: (_: unknown, __: unknown, ___: unknown) => false,
  onlyFaceUp: (_: unknown, __: unknown, card = c) => {
    return card.card.faceUp;
  },

  onlyTopCard: (source = s, __: unknown, card = c) => {
    return source.topCardElement === card;
  },

  redBlackAlternating: (source = s, __: unknown, card = c) => {
    const cardIndex = source.cardElements.findIndex(
      (element) => JSON.stringify(element) === JSON.stringify(card),
    );

    if (cardIndex === -1) return false;

    const cardsOnTop = source.cardElements.slice(cardIndex);

    // To move a pile, must be in sequence
    return cardsOnTop.every((cardElement, index, arr) => {
      if (index === 0) return true; // First card has nothing to compare with

      const prevCard = arr[index - 1].card;
      const currentCard = cardElement.card;

      return (
        prevCard.color !== currentCard.color &&
        prevCard.value === currentCard.value + 1
      );
    });
  },
};

export const quickReceiveRules = {
  alwaysReceive: (_: unknown, __: unknown, ___: unknown) => true,
  neverReceive: (_: unknown, __: unknown, ___: unknown) => false,
  onlyIfEmpty: (_: unknown, dest = d, ___: unknown) => {
    return dest.cardElements.length === 0;
  },

  emptyAndRedBlackAlternating: (_: unknown, dest = d, card = c) => {
    // always must be willing to receive if no cards in the pile, this shortcut must be here for every rule
    if (dest.cardElements.length === 0) return true;
    if (card.card.color === dest.topCardElement.card.color) return false;
    else return true;
  },

  emptyAndOneLessThanTopCard: (_: unknown, dest = d, card = c) => {
    if (dest.cardElements.length === 0) return true;
    if (card.card.value !== dest.topCardElement.card.value - 1) return false;
    else return true;
  },

  emptyAndOneMoreThanTopCard: (_: unknown, dest = d, card = c) => {
    if (dest.cardElements.length === 0) return true;
    if (card.card.value !== dest.topCardElement.card.value + 1) return false;
    else return true;
  },

  onlySpecificCardValue: (
    _: unknown,
    __: unknown,
    card = c,
    specificValue: number,
  ) => {
    return card.card.value === specificValue;
  },
  sameSuitPlusOneOrAce: (_: unknown, dest = d, card = c) => {
    if (dest.cardElements.length > 0) {
      const topCard = dest.topCardElement.card;
      return (
        topCard.suit === card.card.suit && card.card.value - 1 === topCard.value
      );
    } else return card.card.value === 1;
  },
};
