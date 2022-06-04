import { Feature, LineString } from "@turf/turf";
import { coordinatesToLinestring } from "../../../helpers/map";
import { Pattern } from "../../expo/structures/Route";
import { BaseLayer, BaseLayerOptions } from "./BaseLayer";

export class PatternLayer extends BaseLayer {
  constructor(pattern: Pattern, color?: string) {
    super(PatternLayer.asOptions(pattern, color));
  }

  static asOptions(pattern: Pattern, color?: string): BaseLayerOptions {
    return {
      id: pattern.name,
      name: `${pattern.name} (${pattern.headsign})`,
      linestring: linestringFromPattern(pattern),
      thickness: 3,
      color: color || "#e7e7e7",
    };
  }
}

function linestringFromPattern(pattern: Pattern): Feature<LineString> {
  return coordinatesToLinestring(
    pattern.shape.points.map((p) => p.coordinates)
  );
}
