import Card from "../cardFoundations/card";
import { Playing } from "../cardFoundations/playing";

function moveCardInTableauListener(deckBase, cardObj) {
  cardObj.boundListener = tableauClickHandler.bind(deckBase, cardObj, game);
  cardObj.card.addEventListener("click", cardObj.boundListener);
}

function emptyTableauListener(deckBase) {
  const boundListener = tableauClickHandler.bind(
    deckBase,
    { fake: true },
    game
  );
  deckBase.container.addEventListener("click", boundListener);
}

function emptyFoundationListener(deckBase) {
  const blankCard = Object.assign({}, Card(), Playing("joker", "joker"));
  blankCard.foundation = true;
  const boundListener = tableauClickHandler.bind(deckBase, blankCard, game);
  deckBase.container.addEventListener("click", boundListener);
}

// basic rules, and variables (properties...) needed for the game
const game = {
  rules: {
    moveCardToTableauRule() {
      let tableauRules = [
        sameColorCheck,
        secondCardOneHigher,
        notTheSameTableau,
        secondCardIsLastInCascade,
        onlyPassToTableau,
      ];

      let passRules = true;
      tableauRules.forEach((rule) => {
        if (rule() === false) {
          passRules = false;
        }
      });
      if (passRules === false) return false;
      console.log(
        game.firstCard.deckBase.deck.cards.indexOf(game.firstCard.card)
      );
      console.log(game.firstCard.deckBase.deck.cards.length - 1);
      // thats all the rules! It must be able to be placed there!
      if (
        // if this isn't the bottom card, but passed all other checks theres more than 1 card to move
        game.firstCard.deckBase.deck.cards.indexOf(game.firstCard.card) !==
        game.firstCard.deckBase.deck.cards.length - 1
      ) {
        console.log("move more cards");

        // make an array of the rest of the cards
        const otherCardsToMove = game.firstCard.deckBase.deck.cards.slice(
          game.firstCard.deckBase.deck.cards.indexOf(game.firstCard.card) + 1,
          game.firstCard.deckBase.deck.cards.length
        );
        // move the other cards, after the first card is moved
        otherCardsToMove.forEach((card) => {
          card.card.removeEventListener("click", card.boundListener);
          const boundMoveFunc = game.firstCard.deckBase.moveCardToDeck.bind(
            game.firstCard.deckBase,
            game.secondCard.deckBase,
            card
          );
          const boundChangeListener = moveCardInTableauListener.bind(
            null,
            game.secondCard.deckBase,
            card
          );
          setTimeout(() => {
            boundMoveFunc();
            boundChangeListener();
          }, 0);
        });
        const bindCascade = game.firstCard.deckBase.cascade.bind(
          game.firstCard.deckBase
        );
        setTimeout(() => {
          bindCascade();
        }, 750);
      }
      return true;
      ///////////////////////////////////////////////
      //////////////////HELPER FUNCTIONS/////////////
      ///////////////////////////////////////////////
      function sameColorCheck() {
        if (game.firstCard.card.color === game.secondCard.card.color) {
          // if the first card is the same color as the second its not allowed to go there
          console.log("color match = Fail");
          return false;
        }
        return true;
      }

      function secondCardOneHigher() {
        if (game.firstCard.card.value !== game.secondCard.card.value - 1) {
          // if the first card isn't exactly 1 card less than the second card it can't be placed there
          console.log("card number mismatch = Fail");
          return false;
        }
        return true;
      }

      function notTheSameTableau() {
        if (game.firstCard.deckBase === game.secondCard.deckBase) {
          console.log("cant pass to same pile");
          return false;
        }
        return true;
      }

      function secondCardIsLastInCascade() {
        if (
          // checks to see if second click was in the middle of a tableau
          game.secondCard.deckBase.deck.cards.indexOf(game.secondCard.card) !==
          game.secondCard.deckBase.deck.cards.length - 1
        ) {
          console.log("cant place a card in the middle");
          return false;
        }
        return true;
      }
      function onlyPassToTableau() {
        // if the second card isn't in a tableau return
        if (game.secondCard.card.location.location !== "tableau") {
          return false;
        }
      }
    },

    moveCardToFoundationRule() {
      if (
        game.firstCard.card.value === game.secondCard.card.value + 1 &&
        game.firstCard.card.suit === game.secondCard.card.suit
      ) {
        return true;
      }
      return false;
    },
  },
  firstCard: {
    deckBase: null,
    card: null,
  },
  secondCard: {
    deckBase: null,
    card: null,
  },
};

function tableauClickHandler(cardObj, gameInfo, event) {
  event.stopPropagation();

  // moving an ace to the foundation spot
  if (moveAceToFoundation(this) === true) {
    return;
  }
  // moving any other card to foundation spot
  if (moveAnyCardToFoundation(this) === true) {
    return;
  }
  // moving a King to an empty Tableau
  if (moveKingToEmptyTableau(this) === true) {
    return;
  }
  // if a blank tableau or a foundation is clicked first abort
  if (
    (gameInfo.firstCard === null && cardObj.fake === true) ||
    (gameInfo.firstCard === null && cardObj.foundation === true)
  ) {
    clearGameInfo();
    return;
  }

  // if this is the top card and it is faceDown, flip it over
  if (!cardObj.faceUp) {
    if (this.deck.cards.indexOf(cardObj) === this.deck.cards.length - 1)
      cardObj.flipCard();
    clearGameInfo();
    return;
  }

  // if no first card, this first click is the first card
  if (gameInfo.firstCard.card === null) {
    gameInfo.firstCard.deckBase = this;
    gameInfo.firstCard.card = cardObj;
    gameInfo.firstCard.card.card.lastElementChild.lastElementChild.style.setProperty(
      "box-shadow",
      "rgb(251 255 0 / 45%) 0px 0px 60px 2px inset"
    );

    return;

    // if there is a first card, this must be the second card
  } else {
    gameInfo.secondCard.deckBase = this;
    gameInfo.secondCard.card = cardObj;
  }

  // try to pass the first card to the second deckBase
  if (
    gameInfo.firstCard.deckBase.moveCardToDeck(
      gameInfo.secondCard.deckBase,
      gameInfo.firstCard.card,
      gameInfo.rules.moveCardToTableauRule() // apply the rule!
    ) !== false
  ) {
    removeReAddListeners();
  }

  clearGameInfo();
  ///////////////////////////////////////
  //////////////HELPER FUNCTIONS
  ////////////////////////////////////

  // moving an ace to the foundation spot
  function moveAceToFoundation(source) {
    if (cardObj.foundation === true) {
      if (gameInfo.firstCard.card === null) return false;
      if (gameInfo.firstCard.card.value === 1) {
        gameInfo.firstCard.deckBase.moveCardToDeck(
          source,
          gameInfo.firstCard.card
        );

        gameInfo.firstCard.card.card.removeEventListener(
          "click",
          gameInfo.firstCard.card.boundListener
        );
        moveCardInTableauListener(source, gameInfo.firstCard.card);

        gameInfo.firstCard.card.inFoundation = true;
        clearGameInfo();
      }
      return true;
    }
  }

  // moving any other card to foundation spot
  function moveAnyCardToFoundation(source) {
    if (cardObj.inFoundation === true && gameInfo.firstCard.card !== null) {
      gameInfo.secondCard.deckBase = source;
      gameInfo.secondCard.card = cardObj;
      if (
        gameInfo.firstCard.deckBase.moveCardToDeck(
          gameInfo.secondCard.deckBase,
          gameInfo.firstCard.card,
          gameInfo.rules.moveCardToFoundationRule() // apply the rule!
        ) !== false
      ) {
        gameInfo.firstCard.card.inFoundation = true;
        removeReAddListeners();
        clearGameInfo();
        return true;
      }
    }
    return false;
  }

  // moving a King to an empty Tableau
  function moveKingToEmptyTableau(source) {
    if (gameInfo.firstCard.card !== null && cardObj.fake === true) {
      if (gameInfo.firstCard.card.value === 13) {
        // move the card and change its listener
        if (
          // if this isn't the bottom card, but passed all other checks theres more than 1 card to move
          gameInfo.firstCard.deckBase.deck.cards.indexOf(
            gameInfo.firstCard.card
          ) !==
          gameInfo.firstCard.deckBase.deck.cards.length - 1
        ) {
          // make an array of the rest of the cards
          const otherCardsToMove = gameInfo.firstCard.deckBase.deck.cards.slice(
            gameInfo.firstCard.deckBase.deck.cards.indexOf(
              gameInfo.firstCard.card
            ) + 1,
            gameInfo.firstCard.deckBase.deck.cards.length
          );
          // move the other cards, after the first card is moved
          otherCardsToMove.forEach((card) => {
            card.card.removeEventListener("click", card.boundListener);
            const boundMoveFunc =
              gameInfo.firstCard.deckBase.moveCardToDeck.bind(
                gameInfo.firstCard.deckBase,
                source,
                card
              );
            const boundChangeListener = moveCardInTableauListener.bind(
              null,
              source,
              card
            );
            setTimeout(() => {
              boundMoveFunc();
              boundChangeListener();
            }, 0);
          });
          const bindCascade = gameInfo.firstCard.deckBase.cascade.bind(
            gameInfo.firstCard.deckBase
          );
          setTimeout(() => {
            bindCascade();
          }, 750);
        }
        gameInfo.firstCard.deckBase.moveCardToDeck(
          source,
          gameInfo.firstCard.card
        );

        gameInfo.firstCard.card.card.removeEventListener(
          "click",
          gameInfo.firstCard.card.boundListener
        );
        moveCardInTableauListener(source, gameInfo.firstCard.card);

        clearGameInfo();

        return true;
      }
      return false;
    }
  }
  function clearGameInfo() {
    // reset all the props
    if (gameInfo.firstCard.card !== null) {
      gameInfo.firstCard.card.card.lastElementChild.lastElementChild.style.setProperty(
        "box-shadow",
        ""
      );
    }
    gameInfo.firstCard.deckBase = null;
    gameInfo.firstCard.card = null;
    gameInfo.secondCard.deckBase = null;
    gameInfo.secondCard.card = null;
  }

  // remove the two listeners on the cards that had the exchange
  function removeReAddListeners() {
    game.firstCard.card.card.removeEventListener(
      "click",
      game.firstCard.card.boundListener
    );
    game.secondCard.card.card.removeEventListener(
      "click",
      game.secondCard.card.boundListener
    );
    // add new listeners to the exchanged cards
    moveCardInTableauListener(game.secondCard.deckBase, game.firstCard.card);
    moveCardInTableauListener(game.secondCard.deckBase, game.secondCard.card);
  }
}

export {
  moveCardInTableauListener,
  emptyTableauListener,
  emptyFoundationListener,
};
