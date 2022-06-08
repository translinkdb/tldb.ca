import { TLDBBaseMap } from "../../BaseMap";
import { BaseLayer, BaseLayerOptions } from "./BaseLayer";

export type PointsLayerOptions = BaseLayerOptions<"circle"> & {
  color?: {
    fill?: string;
    outline?: string;
  };
  width?: {
    circle?: number;
    outline?: number;
  };
};

export class PointsLayer extends BaseLayer<PointsLayerOptions> {
  public apply(map: TLDBBaseMap): TLDBBaseMap {
    for (const layer of this.layerOptions) {
      map.addLayer(this.generateLayer(layer) as any);
    }

    return map;
  }

  protected generateLayer(options: PointsLayerOptions) {
    const paint = {} as { [key: string]: string | number };

    if (options.color?.fill) paint["circle-color"] = options.color.fill;
    if (options.width?.circle) paint["circle-radius"] = options.width?.circle;
    if (options.color?.outline)
      paint["circle-stroke-color"] = options.color?.outline;
    if (options.width?.outline)
      paint["circle-stroke-width"] = options.width?.outline;

    return {
      ...super.generateLayer(options),
      type: "circle",
      paint: {
        ...paint,
      },
    };
  }
}
