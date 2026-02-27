// table.ts
type TableGradientType = "linear" | "radial";
type Direction = `to ${string}` | `${number}deg`;

interface TableVignetteOptions {
  enabled?: boolean;
  center?: string;
  size?: string;
  color?: string;
}

export interface TableOptions {
  tileImage?: string; // ex: /images/black-felt.png
  overlayStartColor?: string;
  overlayEndColor?: string;
  overlayGradientType?: TableGradientType;
  overlayDirection?: Direction;
  overlayCenter?: string;
  overlaySize?: string;
  vignette?: TableVignetteOptions;
  backgroundColor?: string;
}

export interface TableSettings
  extends Required<Omit<TableOptions, "vignette">> {
  vignette: Required<TableVignetteOptions>;
}
