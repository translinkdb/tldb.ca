import { AnySourceData, GeoJSONSource } from "mapbox-gl";
import { TLDBBaseMap } from "../BaseMap";

type SourceDataType =
  | "vector"
  | "raster"
  | "raster-dem"
  | "geojson"
  | "image"
  | "video"
  | "canvas";

export type SourceData<T extends SourceDataType> = T extends "geojson"
  ?
      | GeoJSON.Feature<GeoJSON.Geometry>
      | GeoJSON.FeatureCollection<GeoJSON.Geometry>
      | string
  : never;

type SourceOptions<T extends SourceDataType> = {
  name: string;
  type: T;
  initialData?: SourceData<T>;
};

export abstract class BaseSource<
  SourceDataT extends SourceDataType,
  RawDataT = never,
  VariablesT = never
> {
  private _data!: RawDataT;

  public get data() {
    return this._data;
  }

  constructor(protected options: SourceOptions<SourceDataT>) {}

  public get id() {
    return this.options.name;
  }

  public apply(map: TLDBBaseMap) {
    map.addSource(this.options.name, {
      type: this.options.type,
      data: this.options.initialData,
    } as AnySourceData);
  }

  public async init(args?: VariablesT) {
    this.options.initialData = await this.fetchAndProcessData(args);
  }

  public async refreshData(map: TLDBBaseMap, args?: VariablesT) {
    const data = await this.fetchAndProcessData(args);

    const source = map.getSource(this.options.name) as GeoJSONSource;

    source.setData(data);
  }

  private async fetchAndProcessData(
    args?: VariablesT
  ): Promise<SourceData<SourceDataT>> {
    const rawData = await Promise.resolve(this.fetchData(args));

    this._data = rawData;

    return this.processRawData(rawData);
  }

  protected abstract fetchData(args?: VariablesT): Promise<RawDataT> | RawDataT;

  protected abstract processRawData(data: RawDataT): SourceData<SourceDataT>;
}
