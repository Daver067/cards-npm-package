import "../styles/style.css";
import "../navMenu/navMenu";
import "./styles.css";
import {
  setTheme,
  redFelt,
  StandardDeckOfCards,
  PlayingCard,
  quickReceiveRules,
  quickPassRules,
  Rules,
  deal,
  denyMove,
  CardElementType,
  PileElementType,
} from "@/dist";

const freeCell = document.getElementById("freeCell");
if (freeCell) {
  // setting the background of the game
  setTheme(redFelt, freeCell);

  // Game specific info
  const gameInfo = {
    freeSpaces: 4,
    getFreeSpaces: () => {
      return gameInfo.freeSpaces;
    },
    addFreeSpace: () => {
      gameInfo.freeSpaces += 1;
      return true;
    },
    minusFreeSpace: () => {
      gameInfo.freeSpaces -= 1;
      return true;
    },
  };

  // Initialize a deck of playing cards
  const gameDeck = StandardDeckOfCards();

  // Type casting my blank objects to ensure I have access to methods and props in my rules. The actual objects will be inserted during a pass.
  const s = {} as PileElementType<PlayingCard>;
  const d = {} as PileElementType<PlayingCard>;
  const c = {} as CardElementType<PlayingCard>;

  // importing some useful rules
  const tableauReceiveRuleArray = [
    quickReceiveRules.emptyAndRedBlackAlternating,
    quickReceiveRules.emptyAndOneLessThanTopCard,
  ];

  // rules for a tableau to be able to pass a card. Once again, SourcePile is the first arg, DestinationPile is the second, CardElement is the third.
  const tableauPassRuleArray = [
    quickPassRules.redBlackAlternating,
    // Can't pass a group if not enough free spaces
    (
      source: PileElementType<PlayingCard>,
      dest: PileElementType<PlayingCard>,
      card: CardElementType<PlayingCard>,
      ...extraArgs: unknown[]
    ) => {
      // the best way to pass game specific info to rules
      const freeSpaces = (extraArgs[0] as number) ?? gameInfo.getFreeSpaces();
      const cardIndex = source.cardElements.findIndex((element) => {
        return JSON.stringify(element) === JSON.stringify(card);
      });

      if (cardIndex === -1) return false;

      const cardDepth = source.cardElements.length - 1 - cardIndex;
      return cardDepth <= freeSpaces;
    },
  ];

  // rules for free spots are pretty much just receive any top card if the pile is empty
  const freeSpotReceiveRules = [
    quickReceiveRules.onlyIfEmpty,
    // if your not passing the top card, its illegal
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (source = s, dest = d, card = c) => {
      if (source.topCardElement !== card) {
        return false;
      } else return true;
    },
  ];

  // ace spot receive rules, must be an ace, or one higher in the same suit as the previous card
  const aceSpotReceiveRules = [quickReceiveRules.sameSuitPlusOneOrAce];

  // initializing all the rules for the 3 separate spots
  // rules for both passing and receiving
  const tableauRules = new Rules(tableauPassRuleArray, tableauReceiveRuleArray);
  // always able to pass a card, rules for receiving
  const freeSpotRules = new Rules(
    [quickPassRules.alwaysPass],
    freeSpotReceiveRules,
  );
  // never pass a card, rules for receiving
  const aceSpotRules = new Rules(
    [quickPassRules.neverPass],
    aceSpotReceiveRules,
  );

  // creating the pile Elements to display the cards
  // deck get made as a pile with all of the cards initialized in it
  const deck = gameDeck.createPileElement("deck", gameDeck.cards);
  // Type casting my blank arrays to ensure I have access to methods and props
  const tableaus: PileElementType<PlayingCard>[] = [];
  const freeSpots: PileElementType<PlayingCard>[] = [];
  const aceSpots: PileElementType<PlayingCard>[] = [];
  // running loops to make elements, as all tableaus are the same, all free spots, and all ace spots.
  for (let i = 1; i < 9; i++) {
    tableaus.push(
      gameDeck.createPileElement(`tableau${i}`, [], {
        // uses option feature layout to show cards in a visible stack
        layout: "visibleStack",
        // stops cards from being grabbed whlie dealing also accepts any card during dealing.
        // We will have to change the rules to the correct rule set once cards are dealt
        rules: new Rules(
          [quickPassRules.neverPass],
          [quickReceiveRules.alwaysReceive],
        ),
      }),
    );
  }
  for (let i = 1; i < 5; i++) {
    freeSpots.push(
      gameDeck.createPileElement(`freeSpot${i}`, [], {
        rules: freeSpotRules,
        // freeSpots are the only pile to take advantage of the callbacks
        // I would like to update the 'freespot' number any time a card comes or goes
        receiveCardCallback: gameInfo.minusFreeSpace,
        passCardCallback: gameInfo.addFreeSpace,
      }),
    );
    aceSpots.push(
      gameDeck.createPileElement(`aceSpot${i}`, [], {
        rules: aceSpotRules,
      }),
    );
  }

  // In my index.html I created a layout with id's matching the names I used for my pileElements.
  // I am getting those elements, and putting the correct pileElement in the spot
  [...tableaus, ...freeSpots, ...aceSpots, deck].forEach((element) => {
    document.getElementById(element.pile.name)?.appendChild(element.container);
  });

  // Once the DomContent is loaded we can run some async operations
  // shuffle the deck before dom content loaded
  deck.shuffle();
  window.addEventListener("DOMContentLoaded", async () => {
    // we will need to cascade the deck as it has had all the cards initiated in it
    // await the cascade, as it may cause a glitch in the first card otherwise
    await deck.cascade();
    // deal the cards, then remove the dealers pile container.
    await deal(7, deck, tableaus, 100);
    document.getElementById("deck")?.removeChild(deck.container);
    // each of the tableaus will now have the cards dealt, and you must flip the cards
    tableaus.forEach((pile) => {
      pile.cardElements.forEach((element) => element.flip());
      // we didn't initialize tableaus with rules, as we wanted to pass shuffled cards to them
      // now we must put the rules into play
      pile.options.rules = tableauRules;
    });

    //! These helper functions and listeners are only for adding extra double click functionality to the game
    //! Drag and drop runs off the ruleSet above. These also will require the rules to be met.
    //! Drag and drop functionality will work without these listeners

    // helper function to look for and return the first empty free spot
    function checkForAvailableFreeSpot() {
      return freeSpots.find((element) => {
        return element.cardElements.length === 0;
      });
    }

    // helper function to move a card to the ace spot if conditions are correct.
    // returns true if it found an acceptable spot, and false if it is unable to move to aces
    function moveToAceSpot(
      source: PileElementType<PlayingCard>,
      cardElement: CardElementType<PlayingCard>,
    ) {
      if (cardElement.card.value === 1) {
        const firstFreeSpot = aceSpots.filter((element) => {
          return element.cardElements.length === 0;
        })[0];
        source.moveCardToPile(firstFreeSpot, cardElement);
        return true;
      } else {
        const allowedMove = aceSpots.filter((element) => {
          if (element.cardElements.length === 0) return false;
          return (
            element.topCardElement.card.suit === cardElement.card.suit &&
            element.topCardElement.card.value === cardElement.card.value - 1
          );
        });
        if (allowedMove.length === 0) return false;
        else {
          source.moveCardToPile(allowedMove[0], cardElement);
          return true;
        }
      }
    }

    // helper function to move a card to tableaus if conditions are correct.
    // returns true if it found an acceptable spot, and false if it is unable to move to tableaus
    // will prioritize a legal move over putting it on a blank tableau
    function moveToTableau(
      source: PileElementType<PlayingCard>,
      cardElement: CardElementType<PlayingCard>,
    ) {
      const legalMove = tableaus.find((pile) => {
        if (pile.cardElements.length === 0) return false;
        return (
          pile.topCardElement.card.color !== cardElement.card.color &&
          pile.topCardElement.card.value === cardElement.card.value + 1
        );
      });
      if (legalMove) {
        source.moveCardToPile(legalMove, cardElement);
        return true;
      }
      const blankTableau = tableaus.find((pile) => {
        return pile.cardElements.length === 0;
      });
      if (blankTableau) {
        source.moveCardToPile(blankTableau, cardElement);
        return true;
      } else return false;
    }

    // now we add the listeners to each pile
    tableaus.forEach((pile) => {
      pile.container.addEventListener("dblclick", (e) => {
        // a check to ensure the target is an element
        if (!(e.target instanceof HTMLElement)) return;
        // a function that recursively finds the card container from anywhere clicked on a card
        const cardElement = pile.findCardContainer(e.target);
        // safety check that the pile had a card
        if (cardElement === null) return;
        // only allow double clicks on the top card of a tableau
        if (pile.topCardElement !== cardElement) {
          denyMove(cardElement);
          return false;
        }
        // prioritize a move to an ace spot
        if (moveToAceSpot(pile, cardElement) === true) return;
        // next priority is a tableau move
        if (moveToTableau(pile, cardElement) === true) return;
        // last option is to move it to a free spot
        const availableFreeSpots = checkForAvailableFreeSpot();
        if (availableFreeSpots) {
          pile.moveCardToPile(availableFreeSpots, cardElement);
          return true;
          // if no available moves, deny the move
        } else denyMove(cardElement);
        return false;
      });
    });

    // please see above breakdown for details
    freeSpots.forEach((pile) => {
      pile.container.addEventListener("dblclick", (e) => {
        if (!(e.target instanceof HTMLElement)) return;
        const cardElement = pile.findCardContainer(e.target);
        if (cardElement === null) return;
        if (moveToAceSpot(pile, cardElement) === true) return;
        if (moveToTableau(pile, cardElement) === true) return;
        else {
          denyMove(cardElement);
          return false;
        }
      });
    });
    // please see above breakdown for details
    aceSpots.forEach((pile) => {
      pile.container.addEventListener("dblclick", (e) => {
        if (!(e.target instanceof HTMLElement)) return;
        const cardElement = pile.findCardContainer(e.target);
        if (cardElement === null) return;
        denyMove(cardElement);
        return false;
      });
    });
  });
}
