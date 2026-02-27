export type PlayingCardType = {
  suit: "diamond" | "spade" | "heart" | "club" | "joker";
  symbol: "♦" | "♠" | "♥" | "♣" | "joker";
  number:
    | "A"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "J"
    | "Q"
    | "K"
    | "joker";
  value: number;
  color: "red" | "black" | "joker";
};

export type suit = "diamond" | "spade" | "heart" | "club";
export type cardNumber =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";
