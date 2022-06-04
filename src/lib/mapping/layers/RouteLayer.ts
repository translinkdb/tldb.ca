import { Route } from "../../expo/structures/Route";
import { getPaletteColor, getPaletteForRoute, Palette } from "../palettes";
import { BaseLayer } from "./BaseLayer";
import { PatternLayer } from "./PatternLayer";

interface RouteLayerOptions {
  source?: string;
  palette?: Palette;
  pattern?: string;
}

export class RouteLayer extends BaseLayer {
  constructor(route: Route, options: RouteLayerOptions = {}) {
    const patterns = options.pattern
      ? route.patterns.filter((p) => p.name === options.pattern)
      : route.patterns;

    super(
      patterns.map((p, idx) => ({
        ...PatternLayer.asOptions(
          p,
          getPaletteColor(options?.palette || getPaletteForRoute(route), idx)
        ),
      }))
    );
  }
}
