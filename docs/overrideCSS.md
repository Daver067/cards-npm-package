---
outline: deep
---

# Override CSS

The default CSS shipped with CardJS can be altered.

## How to override

Create your own css file, target the classes you with to alter in the css file, and import it into your javascript/typescript file as the last import.

**script file**

```typescript
import StandardDeckOfCards from "../../src/components/card/playingCard/standardDeckOfCards";
import "./styles.css"; // always import last, to override other stylings

const playingCards = StandardDeckOfCards();
const drawPile = playingCards.createPileElement("draw", playingCards.cards);
document.getElementById("drawPile").appendChild(drawPile.container);
drawPile.cascade();
```

**styles.css**

```css
:root {
  --card-flip-speed: 0.3s;
  --card-size: 35px;
}

.back-center {
  background-image: none;
}
```

## Other Style Changes

The only styles applied to root are `--card-flip-speed` and `--card-size`

Please use developer tools and find what classes you would like to alter, or go through the css files yourself at /src/styles
