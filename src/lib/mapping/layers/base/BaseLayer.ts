import { Feature, LineString } from "@turf/turf";
import { GeoJSONSourceOptions } from "mapbox-gl";
import { TLDBBaseMap } from "../../BaseMap";

export interface TLDBLayer {
  apply(map: TLDBBaseMap): TLDBBaseMap | void;
}

type AllLayerTypes = "line" | "circle";
type GeoJSONLayerTypes = "line" | "circle";

export type LayerSource<LayerType> = LayerType extends GeoJSONLayerTypes
  ? { source: GeoJSONSourceOptions | string }
  : { source: string };

export type BaseLayerOptions<LayerType extends AllLayerTypes> = {
  // Metadata
  id: string;
} & LayerSource<LayerType>;

export abstract class BaseLayer<
  T extends BaseLayerOptions<AllLayerTypes> = BaseLayerOptions<AllLayerTypes>
> implements TLDBLayer
{
  abstract apply(map: TLDBBaseMap): void | TLDBBaseMap;

  constructor(protected options: T | T[]) {}

  protected get layerOptions() {
    return this.options instanceof Array ? this.options : [this.options];
  }

  protected generateLayer(options: T) {
    let layer = { id: `tldb-${options.id}` } as { [key: string]: any };

    if (isSourced(options)) layer.source = options.source;
    else if (hasLinestring(options)) layer.linestring = options.linestring;

    return layer;
  }
}

function isSourced(opts: any): opts is { source: string } {
  return !!opts.source;
}

function hasLinestring(opts: any): opts is { linestring: Feature<LineString> } {
  return !!opts.linestring;
}
