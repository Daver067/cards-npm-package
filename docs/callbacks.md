# Callbacks

There are two callback options available. receiveCardCallback and passCardCallback.

## Using Callbacks

The receive card and pass card callbacks are extremely useful in assisting with game specific logic as a lot of the passing card logic is handled by this package. The callbacks will automatically pass 3 arguments to any callback you provide.

1. The cardElement being passed
2. The source pileElement
3. The destination pileElement

If, for instance you are making a "crazy 8's" game, you will need to have certain actions depending on what cards are played. Let's code along to make an 8 allow players to pick a suit

```typescript
function eightPlayed(
  cardElement: CardElementType<PlayingCard>,
  source,
  destination,
) {
  const card = cardElement.card;
  if (card.number === "8") {
    promptPickASuit(); // write your own func here
    return true;
  }
  return false;
}

drawPile.options.receiveCardCallback = eightPlayed;
```

The above code, will be run every time drawPile successfully receives a card. Obviously for crazy 8's we would need a bit more of a callback, likely checking for 2's (pick up 2), Jacks (skip a turn) etc. As you only have 1 callback, you will need to make a multipurpose function containing all other functions for your callback.

As cardElement is the only parameter we need, and it is the first provided, we can actually skip writing source and destination in the parameters, but be aware, they will be provided during the function call of your callback.

### Providing extra arguments to callbacks

As the type suggests, there is possibility to provide extra arguments to callbacks. You will have to provide default values for these arguments in the following manner:

```typescript
function myCallback(
      cardElement: CardElementType<PlayingCard>,
      source: PileElementType<PlayingCard>,
      dest: PileElementType<PlayingCard>,
      ...extraArgs: unknown[]
    ) => {
      const myFirstExtraArg = (extraArgs[0] as number) ?? getGameSpecificInfo();
      const mySecondExtraArg = (extraArgs[1] as string) ?? 'a string ';
```
