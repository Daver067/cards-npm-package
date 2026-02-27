/**
 * Bare Bones Card, only prop is facedUp
 */
export default class Card {
  private _faceUp: boolean;
  constructor() {
    this._faceUp = false;
  }

  get faceUp() {
    return this._faceUp;
  }

  /**
   * changes whether card is faceUp or not
   */
  flip = () => {
    this._faceUp = !this._faceUp;
  };
}
