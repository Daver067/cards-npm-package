import Card from "../card/card";
import { CardElement } from "../card/cardElement";
import Pile from "../pile/pile";
import { createDefaultOptions, pileElement } from "../pile/pileElement";
import { PileElementType, PileOptionsType } from "../../types/pile.types";
import { CardElementType } from "../../types/card.types";
import { DeckType } from "../../types/deck.types";

/**
 * A deck is all of the cards to be used in your game.
 *
 * Most Standard Playing Card games will only have one deck (52 cards)
 *
 * Players will have cards from this deck in their piles... draw piles, hands, discard piles, etc. Those are Piles.
 *
 * In a more advanced game, each player could be playing from separate decks, ex) Magic The Gathering
 *
 * Pass an argument of an array of Cards to build deck with cards added already. Or initiate a deck and use function addCards to populate cards.
 */
export default class Deck<T extends Card> implements DeckType<T> {
  private _cards: T[];
  private _piles: Pile<T>[];
  private _graveyard: Pile<T>;
  private _cardBuilder: (card: T) => CardElementType<T>;

  pileElements: PileElementType<T>[];

  constructor(
    cards: T[],
    cardBuilder: (card: T) => CardElementType<T> = (card: T) =>
      CardElement(card),
  ) {
    this._cards = cards;
    this._piles = [];
    this._graveyard = new Pile<T>("graveyard");
    this._cardBuilder = cardBuilder;
    this.pileElements = [];
  }

  get cards(): T[] {
    return this._cards;
  }

  /**
   * @param cards must be a singular item of class Card or an Array of class Card
   * @returns card will be added into the deck
   */
  addCards = (cards: T | T[]) => {
    if (Array.isArray(cards)) {
      cards.forEach((card) => {
        this._cards.push(card);
      });
    } else {
      this.cards.push(cards);
    }
    return;
  };

  /**
   * This will create a pile for draw piles, discard piles, hands. Anywhere cards can go!
   * @returns Piles
   */
  createPile = (name: string, cards: T[] = []): Pile<T> => {
    const pile = new Pile(name, cards);
    this._piles.push(pile);
    return pile;
  };

  createPileElement = (
    name: string,
    cards: T[] = [],
    options: Partial<PileOptionsType<T>> = {},
  ): PileElementType<T> => {
    const mergedOptions: PileOptionsType<T> = {
      ...createDefaultOptions(),
      ...{ cardElements: cards.map((card) => this._cardBuilder(card)) },
      ...options,
    };
    const pile = this.createPile(name, cards);
    const pileElem = pileElement(pile, this, mergedOptions);
    this.pileElements.push(pileElem);
    return pileElem;
  };

  // just totally eliminates a card from existence
  /**
   *
   * @param card A singular item of class Card
   * @returns true if card was removed
   * @returns false if card was not found in deck
   */
  removeCard = (card: T): boolean => {
    this.cards.forEach((item) => {
      if (JSON.stringify(item) === JSON.stringify(card)) {
        const removalCard = this._cards.splice(
          this.cards.findIndex((index) => index === card),
          1,
        )[0];
        this._piles.forEach((pile) => {
          if (pile.cards.includes(removalCard)) {
            pile.passCard(this._graveyard, removalCard);
          }
        });
        return true;
      }
    });
    return false;
  };
}
