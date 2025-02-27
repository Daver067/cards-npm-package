import Card from "../card/card";
import Deck from "../deck/deck";
import { PileElementType, PileOptionsType } from "../../types/pile.types";

export default class Player<T extends Card> {
  private _deck: Deck<T>;
  private _piles: PileElementType<T>[];
  name: string;
  constructor(
    name: string,
    deck: Deck<T>,
    piles: { name: string; options?: Partial<PileOptionsType<T>> }[],
    cardInitializer?: string,
  ) {
    this._deck = deck;
    this.name = name;
    this._piles = piles.map(({ name, options }) => {
      if (options === undefined) options = {};
      // Need somewhere to put all the cards to start the game... could be 1 spot per player
      if (name === cardInitializer) {
        return deck.createPileElement(name, deck.cards, options);
      }
      return deck.createPileElement(name, [], options);
    });
  }

  get piles() {
    return this._piles as PileElementType<T>[];
  }

  get deck() {
    return this._deck;
  }

  getPile = (name: string) => {
    return this._piles.filter((element) => element.pile.name === name)[0];
  };
}
