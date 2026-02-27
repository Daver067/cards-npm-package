---
outline: deep
---

# Making your own cards

With this package you are able to make any type of card imaginable! We built and shipped Playing Cards with the package as a useable example, however, don't let your imagination stop there.

There are three steps to creating a new card type:

1. Create an extension of the [Card](/card) class. See [extending card](/extend-card) for a follow-along on creating a new card type - flash card.

2. Create a factory function that will take your new card as an input, build a div for the front of that card and the back of the card, and return a CardElement with those HTML elements. Follow along with [custom element](/custom-element) for a coding example.

3. Add CSS to target your new card, and possibly [override](/overrideCSS) some of cards native CSS

## Thats it!

Your cards will be completely usable with [deck](/deck) and [Pile Elements](/pileElement) and will come with drag and drop functionality.

The [finals steps](/custom-card-final-steps) will walk you through basic setup of using your new card class and element!

Pretty Cool Stuff.
