import "../style_card.scss";
export {make54, makeFlop};

// Dictionary of Standard 52 Card deck definitions
const Standard = (function () { 
	const suit = {
    'diamond':"♦",
    'heart': "♥",
    'spade': "♠",
    'club': "♣"
    }

    const members = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]
    
    return {
        suit,
        members
    }
})();

// Creates card object, and handles DOM instantiation
const Card = (faceUp) => {
    //Properties
    let parent; // Describes where in the DOM the card currently resides

    const front = (() => {
        const front = document.createElement('div');
        front.classList.add('front')
        front.classList.add('card'); // Generic to all cards
        front.dataset.number = "front";
        return(front);
    })();

    const back = (() => {
        const back = document.createElement('div');
        back.classList.add('back')
        back.dataset.number = "back";
        return(back);
    })();

    const card = (() => {
        const card = document.createElement('div');
        if(faceUp === true){
            card.appendChild(front);
        } else {
            card.appendChild(back);
        }
        return(card);
    })();

    //Functions
    const setParent = (newParent) => {
        parent = newParent;
        return;
    }; // Set to "front" or "back";

    const getParent = () => parent;

    const flipCard = () => {
        if(faceUp === true){ 
            card.removeChild(front);
            card.appendChild(back);
            faceUp=false;
            return
        } else {
            card.removeChild(back);
            card.appendChild(front);
            faceUp=true;
            return
        };
        return
    }
    
    return {
        card,
        front,
        back,
        faceUp,

        setParent,
        getParent,
        flipCard,
    };
}

const Playing = (instance, number, suit) => {
    //Properties
    number = number;
    suit =  suit; // True of False, describes whether card is face up or down // Describes where in the DOM the card currently resides

    const face = (() => {
        const card = instance.front;
        const top_left = document.createElement('div');
        const bottom_right = document.createElement('div');
        // Add CSS classes to DOM object
        card.classList.add('playing'); // Specific to Standard 52 Deck
        
        card.dataset.suit = suit; // Adds suit as a data attribute to DOM object.
        card.dataset.number = number;
        // Adds CSS classes to corners of the card
        top_left.classList.add('top-left');
        bottom_right.classList.add('bottom-right');
        // Adds Suit and Number to opposite corners of cards
        [top_left, bottom_right].forEach(node => {
            const cornerNumber = document.createElement('div');
            const cornerSuit = document.createElement('div');
            // Sets text content of the card corners
            cornerNumber.textContent = number;
            cornerSuit.textContent = suit;
            // Adds data attribute of suit to both symbol and Letters for each corner
            cornerNumber.dataset.suit = suit;
            cornerSuit.dataset.suit = suit;
            // Adds both corner DOM elements to parent corner
            node.appendChild(cornerNumber);
            node.appendChild(cornerSuit);
            // Adds both corner elements to parent card
            card.appendChild(node);
        });
        // Adds center div to card with class 'card-center'
        const cardCenter = document.createElement('div');
        cardCenter.classList.add('card-center');
        card.appendChild(cardCenter);
        cardCenter.dataset.number = number;
        cardCenter.dataset.suit = suit;
        
        // Makes a center flexbox, appends it to cardCenter
        const makeCenterFlex = () => {
            const newDiv = document.createElement('div');
            newDiv.classList.add('center-flex');
            cardCenter.appendChild(newDiv);
            return(newDiv);
        }

        // Makes a new card symbol, appends it to target
        const makeSymbol = (target) => {
            const symbol = document.createElement('div');
            symbol.textContent = suit;
            target.appendChild(symbol)
            return(symbol);
        }

        // These functions specify instructions for each type of card,
        // including instructions on how many flex containers to add.
        const makeAce = () => {
            const flex = makeCenterFlex();
            makeSymbol(flex);
            flex.dataset.number = "A";
        }

        const makeTwo = () => {
            const flex = makeCenterFlex();
            for (let i = 1; i <= number; i++) makeSymbol(flex);
        }

        const makeThree = () => {
            const flex = makeCenterFlex();
            for (let i = 1; i <= number; i++) makeSymbol(flex);
        }

        const makeFour = () => {
            const flex1 = makeCenterFlex();
            const flex2 = makeCenterFlex();
            for (let i = 1; i <= 2; i++) makeSymbol(flex1);
            for (let i = 1; i <= 2; i++) makeSymbol(flex2);
        }

        const makeFive = () => {
            const flex1 = makeCenterFlex();
            const flex2 = makeCenterFlex();
            const flex3 = makeCenterFlex();
            for (let i = 1; i <= 2; i++) makeSymbol(flex1);
            for (let i = 1; i <= 2; i++) makeSymbol(flex3);
            makeSymbol(flex2);
            flex2.dataset.number = "5";
        }

        const makeSix = () => {
            const flex1 = makeCenterFlex();
            const flex2 = makeCenterFlex();
            for (let i = 1; i <= 3; i++) makeSymbol(flex1);
            for (let i = 1; i <= 3; i++) makeSymbol(flex2);
        }

        const makeSeven = () => {
            const flex1 = makeCenterFlex();
            const flex2 = makeCenterFlex();
            const flex3 = makeCenterFlex();
            for (let i = 1; i <= 3; i++) makeSymbol(flex1);
            for (let i = 1; i <= 3; i++) makeSymbol(flex3);
            makeSymbol(flex2);
            flex2.dataset.number = "7";
        }

        const makeEight = () => {
            const flex1 = makeCenterFlex();
            const flex2 = makeCenterFlex();
            const flex3 = makeCenterFlex();
            for (let i = 1; i <= 3; i++) makeSymbol(flex1);
            for (let i = 1; i <= 3; i++) makeSymbol(flex3);
            for (let i = 1; i <= 2; i++) makeSymbol(flex2);
            flex2.dataset.number = "8";
        }

        const makeNine = () => {
            const flex1 = makeCenterFlex();
            const flex2 = makeCenterFlex();
            const flex3 = makeCenterFlex();
            for (let i = 1; i <= 4; i++) makeSymbol(flex1);
            for (let i = 1; i <= 4; i++) makeSymbol(flex3);
            makeSymbol(flex2);
            flex2.dataset.number = "5";
        }

        const makeTen = () => {
            const flex1 = makeCenterFlex();
            const flex2 = makeCenterFlex();
            const flex3 = makeCenterFlex();
            for (let i = 1; i <= 4; i++) makeSymbol(flex1);
            for (let i = 1; i <= 4; i++) makeSymbol(flex3);
            for (let i = 1; i <= 2; i++) makeSymbol(flex2);
            flex2.dataset.number = "10";
        }

        const makeJack = () => {
            const flex = makeCenterFlex();
            makeSymbol(flex);
            flex.dataset.number = "J";
        }

        const makeQueen = () => {
            const flex = makeCenterFlex();
            makeSymbol(flex);
            flex.dataset.number = "Q";
        }

        const makeKing = () => {
            const flex = makeCenterFlex();
            makeSymbol(flex);
            flex.dataset.number = "K";
        }

        const makeJoker = () => {
            card.classList.add('back')
            card.classList.remove('playing')
            card.classList.remove('card')
            card.removeChild(cardCenter);
            card.removeChild(top_left);
            card.removeChild(bottom_right);

            const symbol = document.createElement('div');
            card.appendChild(symbol)

            card.dataset.number = "joker";
        }


        // Determines which of the above functions to run
        // depending on card number.
        if(number ==="A") makeAce();
        if(number ==="2") makeTwo();
        if(number ==="3") makeThree();
        if(number ==="4") makeFour();
        if(number ==="5") makeFive();
        if(number ==="6") makeSix();
        if(number ==="7") makeSeven();
        if(number ==="8") makeEight();
        if(number ==="9") makeNine();
        if(number ==="10") makeTen();
        if(number ==="J") makeJack();
        if(number ==="Q") makeQueen();
        if(number ==="K") makeKing();
        if(number ==="joker") makeJoker();

        return(card);
    })();

    const reverse = (() => {
        const card = instance.back;
        const symbol = document.createElement('div');
        card.appendChild(symbol)
        return(card);
    })();

    //Functions
    const getNumber = () => number;
    const getSuit = () => suit;
    
    return {
        number,
        suit,
        face,
        reverse,

        getNumber,
        getSuit,
    };
}

const makePlayingCard = (number, suit) => {
    const instance = Card(true);
    const playing = Playing(instance, number, suit);
    return Object.assign(
        {},
        instance,
        playing
    )
}



// Generates a standard deck of 54 cards to a specified target.
// Same as a 52 card deck, but incldues two jokers
const make54 = () => {
    const deck = [];
    const suitArray = [
        Standard.suit["diamond"],
        Standard.suit["heart"],
        Standard.suit["club"],
        Standard.suit["spade"]
    ]
    
    for (let index = 0; index < suitArray.length; index++) {
        const suit = suitArray[index];
        for (let index = 0; index < Standard.members.length; index++) {
            const cardNumber = Standard.members[index];
            const newCard = makePlayingCard(cardNumber, suit);
            deck.push(newCard);
            newCard.card.addEventListener('click', () => {
                newCard.flipCard(newCard);
            })
        }
    }

    const makeJoker = () => {
        const joker = makePlayingCard("joker", "joker");
        deck.push(joker);
        joker.card.addEventListener('click', () => {
            joker.flipCard(joker);
        })   
        return(joker);
    };

    const joker1 = makeJoker();
    const joker2 = makeJoker();
    return(deck);
}

// Generates 13 cards of a specified suit, to a specified target
const make13 = (suit, target) => {
    const cardSpread = [];
    for (let index = 0; index < Standard.members.length; index++) {
        const cardNumber = Standard.members[index];
        const newCard = Card(cardNumber, suit, true);
        cardSpread.push(newCard);
        newCard.setParent(target);
        newCard.card.addEventListener('click', () => {
            newCard.flipCard(newCard);
        })
        target.appendChild(newCard.card);
    }
    return(cardSpread);
}



// For debugging purposes, everything below
// doesn't need to be exported.

// Makes a grid for cards to instance to, For debug purposes.
const makeFlop = (target) => {
    const flop = document.createElement('div');
    flop.classList.add('flop');

    target.appendChild(flop);
    
    return(flop);
}

// Debug Interface
const interfaceUI = (function () { 
	// Create container for dubug interface
    const interfaceDiv = document.createElement('div');
    interfaceDiv.classList.add('interface');
    // Create form field for inputs
    const interfaceForm = document.createElement('form');
    interfaceForm.classList.add('interface-form');
    // Prevents page from refreshing when enter is pressed
    function handleForm(event) { event.preventDefault(); }
    interfaceForm.addEventListener('submit', handleForm)
    // Adds form to interface
    interfaceDiv.appendChild(interfaceForm);
    // Creates Label for card size input
    const label = document.createElement('label');
    label.classList.add('card-size-label')
    label.for = 'card-size';
    label.textContent= 'Card Size';


    // Creates input field to change card size
    const cardSizeInput = () => {
        const input = document.createElement('input');
        //Input Logic
        input.classList.add('card-size-input');
        input.name = 'card-size';
        input.type = 'number';
        input.minLength = 1;
        input.maxLength = 3;
        input.min = 20;
        input.max = 150;
        input.placeholder = '60'
        //Add logic for when enter key is pressed
        input.addEventListener('keydown', (event) => {
            event.preventDefault;
            if (event.code === 'Enter') {
                const root = document.documentElement;
                root.style.setProperty('--card-size', `${input.value}px`);
            }
        })
        //Adds input field to form
        interfaceForm.appendChild(label);
        interfaceForm.appendChild(input);  
    }
    
    // Adds UI to document body. Add to top of page
    const showUI = () => {
        document.body.appendChild(interfaceDiv);
    }

    cardSizeInput();

    return {
        showUI,
    }
})();

// Debug Commands
//interfaceUI.showUI();


