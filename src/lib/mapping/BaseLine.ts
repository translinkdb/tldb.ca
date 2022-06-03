import { Feature, LineString } from "@turf/turf";
import { AnyLayer } from "mapbox-gl";

export interface BaseLineOptions {
  // Metadata
  id: string;
  name?: string;

  // Line data
  linestring: Feature<LineString>;

  // Aesthetics
  thickness?: number;
  color?: string;
}

export class BaseLine {
  constructor(protected options: BaseLineOptions) {}

  public asLayer(): AnyLayer {
    return {
      id: this.options.id,
      type: "line",
      source: {
        type: "geojson",
        data: this.options.linestring,
      },
      paint: {
        "line-width": this.options.thickness,
        "line-color": this.options.color,
      },
    };
  }
}
