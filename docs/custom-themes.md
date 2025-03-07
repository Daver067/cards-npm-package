---
outline: deep
---

# Custom Theme Configuration

#### Quick Setup

The fastest way to apply a theme is using the `setTheme` function with a predefined theme:

```typescript
import { setTheme, greenFelt } from "card-factory";

const body = document.querySelector("body");
if (body) {
  setTheme(greenFelt, body);
}
```

#### Custom Theme Configuration

For more control, you can configure the table directly using the `Table` class:

```typescript
import { TableSettings, Table } from "card-factory";

// Define your custom theme
const customTheme: TableSettings = {
  tileImage: "/images/45-degree-fabric-light.png",
  backgroundColor: "rgb(38, 133, 72)",
  overlayStartColor: "rgba(0, 100, 0, 0)",
  overlayEndColor: "rgba(0, 0, 0, 1)",
  overlayGradientType: "radial",
  overlayDirection: "to bottom",
  overlayCenter: "center",
  overlaySize: "100%",
  vignette: {
    enabled: true,
    center: "center",
    size: "80%",
    color: "rgba(0, 0, 0, 0.4)",
  },
};

// Apply the theme
const table = new Table(customTheme, element);
table.setBackground();
```

### Theme Properties

| Property              | Type                   | Description                            | Default             |
| --------------------- | ---------------------- | -------------------------------------- | ------------------- |
| `tileImage`           | `string`               | Path to the background texture image   | Required            |
| `backgroundColor`     | `string`               | Base color of the table                | Required            |
| `overlayStartColor`   | `string`               | Starting color of the gradient overlay | Required            |
| `overlayEndColor`     | `string`               | Ending color of the gradient overlay   | Required            |
| `overlayGradientType` | `"radial" \| "linear"` | Type of gradient to apply              | Required            |
| `overlayDirection`    | `string`               | Direction of the gradient              | Required            |
| `overlayCenter`       | `string`               | Center point of the overlay            | Required            |
| `overlaySize`         | `string`               | Size of the overlay                    | Required            |
| `vignette.enabled`    | `boolean`              | Whether to enable vignette effect      | `false`             |
| `vignette.center`     | `string`               | Center point of vignette               | Required if enabled |
| `vignette.size`       | `string`               | Size of vignette effect                | Required if enabled |
| `vignette.color`      | `string`               | Color of vignette effect               | Required if enabled |

### Predefined Themes

CardsJS comes with several predefined themes that you can use out of the box. These themes can be found and customized in `/components/table/themes.ts`:

#### greenFelt

Classic casino table felt with a deep green background and subtle fabric texture.

```typescript
const greenFelt: TableSettings = {
  tileImage: "/images/45-degree-fabric-light.png",
  backgroundColor: "rgb(38, 133, 72)",
  overlayStartColor: "rgba(0, 100, 0, 0)",
  overlayEndColor: "rgba(0, 0, 0, 1)",
  overlayGradientType: "radial",
  overlayDirection: "to bottom",
  overlayCenter: "center",
  overlaySize: "100%",
  vignette: {
    enabled: true,
    center: "center",
    size: "80%",
    color: "rgba(0, 0, 0, 0.4)",
  },
};
```

#### redFelt

Traditional card room aesthetic with rich red tones and fabric texture.

```typescript
const redFelt: TableSettings = {
  tileImage: "/images/45-degree-fabric-light.png",
  backgroundColor: "rgb(181 44 44)",
  overlayStartColor: "rgba(0, 100, 0, 0)",
  overlayEndColor: "rgba(0, 0, 0, 0.6)",
  overlayGradientType: "radial",
  overlayDirection: "to bottom",
  overlayCenter: "center",
  overlaySize: "100%",
  vignette: {
    enabled: true,
    center: "center",
    size: "80%",
    color: "rgba(0, 0, 0, 0.4)",
  },
};
```

#### brickWall

Unique brick pattern background with dramatic linear gradient overlay.

```typescript
const brickWall: TableSettings = {
  tileImage: "/images/brick-wall.png",
  backgroundColor: "rgba(114, 6, 6, 1)",
  overlayStartColor: "rgba(0, 100, 0, 0)",
  overlayEndColor: "rgba(0, 0, 0, 1)",
  overlayGradientType: "linear",
  overlayDirection: "to bottom",
  overlayCenter: "top",
  overlaySize: "100%",
  vignette: {
    enabled: false,
    center: "center",
    size: "80%",
    color: "rgba(0, 0, 0, 0.4)",
  },
};
```

#### redOak

Elegant wooden table finish with subtle vignette effect.

```typescript
const redOak: TableSettings = {
  tileImage: "/images/wood-pattern.png",
  backgroundColor: "rgb(100 70 70)",
  overlayStartColor: "rgba(0, 100, 0, 0)",
  overlayEndColor: "rgba(0, 0, 0, 0.6)",
  overlayGradientType: "radial",
  overlayDirection: "to bottom",
  overlayCenter: "center",
  overlaySize: "100%",
  vignette: {
    enabled: true,
    center: "center",
    size: "80%",
    color: "rgba(0, 0, 0, 0.4)",
  },
};
```

#### tanTiles

Modern geometric pattern with warm tan colors.

```typescript
const tanTiles: TableSettings = {
  tileImage: "/images/gradient-squares.png",
  backgroundColor: "rgb(175 157 149)",
  overlayStartColor: "rgba(118 60 28 / 35%)",
  overlayEndColor: "rgba(0, 0, 0, 1)",
  overlayGradientType: "radial",
  overlayDirection: "to bottom",
  overlayCenter: "center",
  overlaySize: "100%",
  vignette: {
    enabled: true,
    center: "center",
    size: "80%",
    color: "rgba(0, 0, 0, 0.4)",
  },
};
```

### Best Practices

1. Always check if the DOM element exists before applying themes
2. Use TypeScript interfaces for better type safety
3. Consider performance when using custom background images
4. Test themes across different screen sizes

For more examples and advanced usage, visit our [GitHub repository]()
