import { AnyLayer } from "mapbox-gl";
import { TLDBBaseMap } from "../../BaseMap";
import { BaseLayer, BaseLayerOptions } from "./BaseLayer";

export type LineLayerOptions = BaseLayerOptions<"line"> & {
  // Aesthetics
  color?: string;
  thickness?: number;
  visible?: boolean;
};

export class LineLayer extends BaseLayer<LineLayerOptions> {
  public apply(map: TLDBBaseMap): TLDBBaseMap {
    for (const layer of this.layerOptions) {
      map.addLayer(this.generateLayer(layer) as AnyLayer);
    }

    return map;
  }

  protected generateLayer(options: LineLayerOptions) {
    return {
      ...super.generateLayer(options),
      type: "line",
      paint: {
        "line-width": options.thickness,
        "line-color": options.color,
      },
      layout: {
        visibility:
          options.visible === true || options.visible === undefined
            ? "visible"
            : "none",
      },
    };
  }
}
