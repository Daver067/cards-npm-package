import Card from "../components/card/card";
import Pile from "../components/pile/pile";

export type CardElementType<T extends Card> = {
  card: T;
  location: Pile<T> | null;
  parent: HTMLDivElement;
  front: HTMLDivElement;
  back: HTMLDivElement;
  container: HTMLDivElement;
  faceUp: boolean;
  transform: {
    active: boolean;
    translate: string;
    scale: string;
    rotate: string;
  };
  flip: (delay?: number) => void;
};
