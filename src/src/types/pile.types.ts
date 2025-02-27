import { CardElementType } from "./card.types";
import Pile from "../components/pile/pile";
import Card from "../components/card/card";
import { Rules } from "../components/rules/rules";

export type PileElementType<T extends Card> = {
  pile: Pile<T>;
  cards: T[];
  cardElements: CardElementType<T>[];
  container: HTMLDivElement;
  cascadeOffset: [number, number];
  cascadeDuration: number;
  topCardElement: CardElementType<T>;
  updateShadows: () => void;
  cascade: (number?: number) => Promise<unknown>;
  applyCascadeLayout: (layoutName: string) => void | Error;
  createCascadeLayout: (layoutName: string, offset: Offset) => void;
  moveCardToPile: (
    destinationPile: PileElementType<T>,
    cardElement?: CardElementType<T>,
    groupOffset?: number,
  ) => Promise<Animation | undefined> | false;
  findCardContainer: (element: HTMLElement) => null | CardElementType<T>;
  shuffle: () => void;
  options: PileOptionsType<T>;
};

export interface DragData {
  indexs: string[];
  sourcePileContainerId: string;
}

export type PileOptionsType<T extends Card> = {
  cardElements: CardElementType<T>[];
  layout: "stack" | "cascade" | "visibleStack";
  rules: Rules<T>;
  draggable: boolean;
  groupDrag: boolean;
  receiveCardCallback: (
    card: CardElementType<T>,
    source: PileElementType<T>,
    destination: PileElementType<T>,
    ...extraArgs: unknown[]
  ) => boolean;
  passCardCallback: (
    card: CardElementType<T>,
    source: PileElementType<T>,
    destination: PileElementType<T>,
    ...extraArgs: unknown[]
  ) => boolean;
  moveCardAnimation:
    | ((
        source: PileElementType<T>,
        destination: PileElementType<T>,
        cardThatWasPassed: CardElementType<T>,
        index: number,
        groupOffset?: number,
      ) => Promise<Animation | undefined>)
    | null;
};

export type Offset = [number, number];

type LayoutSection = {
  offset: Offset;
};

export type Layout = {
  stack: LayoutSection;
  cascade: LayoutSection;
  [key: string]: LayoutSection;
  visibleStack: LayoutSection;
};

export type PileType<T extends Card> = {
  name: string;
  readonly cards: T[];
  receiveCard: (cards: T | T[], conditions?: boolean) => boolean;
  passCard: (target: Pile<T>, card?: T, rules?: boolean) => boolean;
  shuffle: () => void;
};
