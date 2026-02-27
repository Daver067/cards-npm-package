import Deck from "../../deck/deck";
import { suit, cardNumber } from "./playCard.types";
import PlayingCard from "./playingCardClass";
import PlayingCardElement from "./playingCardElement";

function StandardDeckOfCards(jokers: boolean = false): Deck<PlayingCard> {
  // Dictionary of Standard 52 Card deck definitions
  const standardDeck: { suit: suit[]; members: cardNumber[] } = {
    suit: ["diamond", "heart", "spade", "club"],
    members: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
  };
  const cardArr = [];
  // loop through all the suits
  for (let i = 0; i < standardDeck.suit.length; i++) {
    const suit = standardDeck.suit[i];
    // loop through each card number in each suit
    for (let j = 0; j < standardDeck.members.length; j++) {
      const cardNumber = standardDeck.members[j];
      // make the card for suit[i] and number[j]
      const newCard = new PlayingCard(cardNumber, suit);
      // add that new card to the array of all cards
      cardArr.push(newCard);
    }
  }
  // adds the two jokers if they are required
  if (jokers) {
    cardArr.push(new PlayingCard("joker", "joker"));
    cardArr.push(new PlayingCard("joker", "joker"));
  }
  // make the deck, and return it
  return new Deck(cardArr, PlayingCardElement);
}

export default StandardDeckOfCards;
