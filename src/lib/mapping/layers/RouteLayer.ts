import { Route } from "../../expo/structures/Route";
import { getPaletteColor, getPaletteForRoute, Palette } from "../palettes";
import { LineLayer } from "./base/LineLayer";
import { PatternLayer } from "./PatternLayer";

export interface RouteLayerOptions {
  source?: string;
  palette?: Palette;
  pattern?: string;
}

export class RouteLayer extends LineLayer {
  constructor(route: Route, options: RouteLayerOptions = {}) {
    const patterns = options.pattern
      ? route.patterns.filter((p) => p.name === options.pattern)
      : route.patterns;

    super(
      patterns.map((p, idx) => ({
        ...PatternLayer.asOptions(p, {
          color: getPaletteColor(
            options?.palette || getPaletteForRoute(route),
            idx
          ),
        }),
      }))
    );
  }
}
