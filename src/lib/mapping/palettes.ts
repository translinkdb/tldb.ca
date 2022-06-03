export function getPaletteColor(palette: string[], index: number): string {
  return palette[index % (palette.length - 1)];
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
