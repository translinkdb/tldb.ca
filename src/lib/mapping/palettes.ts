import { Route } from "../expo/structures/Route";

export type Palette = string[];

export function getPaletteColor(palette: Palette, index: number): string {
  return palette[index % palette.length];
}

export const olivePalette = [
  "#424342",
  "#244f26",
  "#256d1b",
  "#149911",
  "#1efc1e",
];

export const rainbowPalette = [
  "#f94144",
  "#f3722c",
  "#f8961e",
  "#f9844a",
  "#f9c74f",
  "#90be6d",
  "#43aa8b",
  "#4d908e",
  "#577590",
  "#277da1",
];

export const specialPalettes = {
  rapidbus: ["#00b259"],
  bline: ["#f78e1e"],
};

export function getPaletteForRoute(route: Route): Palette {
  if (route.number.startsWith("R")) return specialPalettes.rapidbus;
  if (route.number === "99") return specialPalettes.bline;

  return ["#00355f"];
}
