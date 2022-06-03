import { Feature, LineString } from "@turf/turf";
import { EventData, Map, MapboxGeoJSONFeature, MapMouseEvent } from "mapbox-gl";
import { coordinatesToLinestring } from "../../helpers/map";
import { Pattern } from "../expo/structures/Route";
import { BaseLine } from "./BaseLine";

type MapEvent = MapMouseEvent & {
  features?: MapboxGeoJSONFeature[] | undefined;
} & EventData;

export class PatternLine extends BaseLine {
  constructor(pattern: Pattern, color?: string) {
    super({
      id: `${pattern.id}`,
      name: `${pattern.name} (${pattern.headsign})`,
      linestring: linestringFromPattern(pattern),
      thickness: 3,
      color: color || "black",
    });
  }

  public onClick(_map: Map): ["click", string, (e: MapEvent) => void] {
    return ["click", this.options.id, (_e: MapEvent) => {}];
  }
}

function linestringFromPattern(pattern: Pattern): Feature<LineString> {
  return coordinatesToLinestring(
    pattern.shape.points.map((p) => p.coordinates)
  );
}
