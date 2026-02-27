import Card from "../components/card/card";
import { CardElementType } from "./card.types";
import { PileElementType } from "./pile.types";

export interface RuleSet<T extends Card> {
  canPass: Rule<T>;
  canReceive: Rule<T>;
}

export type Rule<T extends Card> = (
  source: PileElementType<T>,
  destination: PileElementType<T>,
  card: CardElementType<T>,
  ...extraArgs: unknown[]
) => boolean;
