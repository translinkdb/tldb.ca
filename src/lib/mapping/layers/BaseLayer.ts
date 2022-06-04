import { Feature, LineString } from "@turf/turf";
import { AnyLayer } from "mapbox-gl";
import { TLDBBaseMap } from "../BaseMap";

export interface BaseLayerOptions {
  // Metadata
  id: string;
  name?: string;

  // Line data
  linestring: Feature<LineString>;

  // Aesthetics
  thickness?: number;
  color?: string;
}

export class BaseLayer {
  constructor(protected options: BaseLayerOptions | BaseLayerOptions[]) {}

  public apply(map: TLDBBaseMap): TLDBBaseMap {
    const optionsList =
      this.options instanceof Array ? this.options : [this.options];

    for (const options of optionsList) {
      map.addLayer(this.generateLayer(options));
    }

    return map;
  }

  private generateLayer(options: BaseLayerOptions): AnyLayer {
    return {
      id: `tldb-${options.id}`,
      type: "line",
      source: {
        type: "geojson",
        data: options.linestring,
      },
      paint: {
        "line-width": options.thickness,
        "line-color": options.color,
      },
      layout: {
        visibility: "visible",
      },
    };
  }
}
