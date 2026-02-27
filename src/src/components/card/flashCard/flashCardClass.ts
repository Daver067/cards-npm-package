import Card from "../card";

export default class FlashCard extends Card {
  question: string;
  answer: string;
  constructor(question: string, answer: string) {
    super();
    this.question = question;
    this.answer = answer;
  }
}
