import Card from "../components/card/card";
import Pile from "../components/pile/pile";
import { PileElementType, PileOptionsType } from "./pile.types";

export type DeckType<T extends Card> = {
  readonly cards: T[];
  readonly pileElements: PileElementType<T>[];
  addCards: (cards: T | T[]) => void;
  createPile: (name: string, cards?: T[]) => Pile<T>;
  createPileElement: (
    name: string,
    cards?: T[],
    options?: Partial<PileOptionsType<T>>,
  ) => PileElementType<T>;
  removeCard: (card: T) => boolean;
};
