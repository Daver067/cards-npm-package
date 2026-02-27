import { Card, PlayingCard, Deck, StandardDeckOfCards } from "../src/src/index";
import { test, expect } from "vitest";

test("can flip a blank card", () => {
  const card = new Card();
  expect(card.faceUp).toBe(false);
  card.flip();
  expect(card.faceUp).toBe(true);
});

test("can make a playing card", () => {
  const aceOfSpades = new PlayingCard("A", "spade");
  expect(aceOfSpades.suit).toBe("spade");
  expect(aceOfSpades.number).toBe("A");
  expect(aceOfSpades.symbol).toBe("♠");
});

test("different varieties of a new card are not the same card", () => {
  const aceOfSpades = new PlayingCard("A", "spade");
  const newAceOfSpades = new PlayingCard("A", "spade");
  expect(aceOfSpades === newAceOfSpades).toBe(false);
});

test("can initialize deck as an array of cards", () => {
  const aceOfSpades = new PlayingCard("A", "spade");
  const twoOfSpades = new PlayingCard("2", "spade");
  const threeOfSpades = new PlayingCard("3", "spade");
  const fourOfSpades = new PlayingCard("4", "spade");
  const deck = new Deck([
    aceOfSpades,
    twoOfSpades,
    threeOfSpades,
    fourOfSpades,
  ]);
  expect(deck.cards).toStrictEqual([
    aceOfSpades,
    twoOfSpades,
    threeOfSpades,
    fourOfSpades,
  ]);
});

test("pile can pass cards", () => {
  const aceOfSpades = new PlayingCard("A", "spade");
  const twoOfSpades = new PlayingCard("2", "spade");
  const threeOfSpades = new PlayingCard("3", "spade");
  const fourOfSpades = new PlayingCard("4", "spade");
  const deck = new Deck([
    aceOfSpades,
    twoOfSpades,
    threeOfSpades,
    fourOfSpades,
  ]);
  const drawPile = deck.createPile("draw", deck.cards);
  expect(drawPile.cards).toStrictEqual(deck.cards);
  const playerHand = deck.createPile("hand");
  drawPile.passCard(playerHand, aceOfSpades);
  // draw pile will no longer have ace of spades
  expect(drawPile.cards).toStrictEqual([
    twoOfSpades,
    threeOfSpades,
    fourOfSpades,
  ]);
  // player hand will have only ace of spades
  expect(playerHand.cards).toStrictEqual([aceOfSpades]);
  // the deck still contains all cards
  expect(deck.cards).toStrictEqual([
    aceOfSpades,
    twoOfSpades,
    threeOfSpades,
    fourOfSpades,
  ]);
});

test("Changing a value in the deck, will change it in the pile", () => {
  const deck = StandardDeckOfCards();
  const drawPile = deck.createPile("draw");
  drawPile.receiveCard(deck.cards);
  const player1 = deck.createPile("player1");
  drawPile.passCard(player1);
  // the decks "last card" is the first one to get passed.
  deck.cards[51].value = 0;
  expect(player1.cards[0].value).toBe(0);
});

test("deleting a card from the deck will delete it from piles", () => {
  const deck = StandardDeckOfCards();
  const drawPile = deck.createPile("draw");
  drawPile.receiveCard(deck.cards);
  const player1 = deck.createPile("player1");
  drawPile.passCard(player1);
  deck.removeCard(deck.cards[51]);
  expect(player1.cards.length).toBe(0);
});
