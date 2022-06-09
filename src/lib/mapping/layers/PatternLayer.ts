import { Feature, LineString } from "@turf/turf";
import { coordinatesToLinestring } from "../../../helpers/map";
import { Pattern } from "../../expo/structures/Route";
import { LineLayer, LineLayerOptions } from "./base/LineLayer";

export interface PatternLayerOptions {
  color?: string;
  id?: string;
  visible?: boolean;
}

export class PatternLayer extends LineLayer {
  constructor(pattern: Pattern, options?: PatternLayerOptions) {
    super(PatternLayer.asOptions(pattern, options));
  }

  static asOptions(
    pattern: Pattern,
    options: PatternLayerOptions = {}
  ): LineLayerOptions {
    return {
      id: options?.id || pattern.name,
      source: { type: "geojson", data: linestringFromPattern(pattern) } as any,
      thickness: 3,
      color: options?.color || "#e7e7e7",
      visible: options.visible,
    };
  }
}

function linestringFromPattern(pattern: Pattern): Feature<LineString> {
  return coordinatesToLinestring(
    pattern.shape.points.map((p) => p.coordinates)
  );
}
