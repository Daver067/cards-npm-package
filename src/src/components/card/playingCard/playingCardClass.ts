import Card from "../card";
import { PlayingCardType } from "./playCard.types";

/**
 * @props suit, symbol, number, value, color
 * @methods updateValue(newValue)
 */
export default class PlayingCard extends Card implements PlayingCardType {
  suit: PlayingCardType["suit"];
  symbol: PlayingCardType["symbol"];
  number: PlayingCardType["number"];
  value: PlayingCardType["value"];
  color: PlayingCardType["color"];

  constructor(
    number: PlayingCardType["number"],
    suit: PlayingCardType["suit"],
    value: number = 0,
  ) {
    super();
    this.suit = suit;
    this.number = number;
    this.value = value;

    // Set value based on number
    this.value = this.getCardValue(number);

    // Set symbol & color based on suit
    this.symbol = this.getCardSymbol(suit);
    this.color = this.getCardColor(suit);
  }

  private getCardValue(number: PlayingCardType["number"]): number {
    switch (number) {
      case "A":
        return 1;
      case "J":
        return 11;
      case "Q":
        return 12;
      case "K":
        return 13;
      case "joker":
        return 100;
      default:
        return parseInt(number);
    }
  }

  private getCardSymbol(
    suit: PlayingCardType["suit"],
  ): PlayingCardType["symbol"] {
    const symbols: Record<PlayingCardType["suit"], PlayingCardType["symbol"]> =
      {
        spade: "♠",
        diamond: "♦",
        club: "♣",
        heart: "♥",
        joker: "joker",
      };
    return symbols[suit];
  }

  private getCardColor(
    suit: PlayingCardType["suit"],
  ): PlayingCardType["color"] {
    const colors: Record<PlayingCardType["suit"], PlayingCardType["color"]> = {
      spade: "black",
      club: "black",
      diamond: "red",
      heart: "red",
      joker: "joker",
    };
    return colors[suit];
  }

  updateValue = (newValue: number) => {
    this.value = newValue;
  };
}
