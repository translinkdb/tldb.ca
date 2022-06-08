import EventEmitter from "events";
import { Map } from "mapbox-gl";
import { MutableRefObject } from "react";
import { BaseMapOptions, TLDBBaseMap } from "./BaseMap";
import { TLDBLayer } from "./layers/base/BaseLayer";
import { BaseSource } from "./sources/BaseSource";

export interface MapOptions {
  base?: Omit<BaseMapOptions, "container">;
  layers?: TLDBLayer[];
  sources?: BaseSource<any, any, any>[];
}

export class TLDBMap {
  private _base!: TLDBBaseMap;
  private _ready = false;
  private emiter = new EventEmitter();

  constructor(protected options: MapOptions = {}) {}

  public apply(container: MutableRefObject<HTMLDivElement | null>) {
    this._base = new TLDBBaseMap({ container, ...this.options.base });

    this._base.on("load", async () => {
      this._ready = true;
      await this.init();
    });
  }

  public onReady(func: () => void) {
    this.emiter.addListener("on", func);
  }

  public get base(): Map {
    return this._base;
  }

  public get ready(): boolean {
    return this._ready;
  }

  public getSource<DataT = any, VariablesT = any>(
    name: string
  ): BaseSource<any, DataT, VariablesT> | undefined {
    return this.options.sources?.find((s) => s.id === name);
  }

  public toggleLayerSolo(layerID: string) {
    for (const layer of this.layers) {
      if (layer.id === `tldb-${layerID}`) {
        this.setLayerVisibility(layer.id, true);
      } else {
        this.setLayerVisibility(layer.id, false);
      }
    }
  }

  public addLayers(...layers: TLDBLayer[]) {
    if (!this._ready) {
      if (!this.options.layers) this.options.layers = [];

      this.options.layers.push(...layers);
    } else {
      for (const layer of layers) {
        layer.apply(this.base);
      }
    }
  }

  public addSources(...sources: BaseSource<any, any, any>[]) {
    if (!this._ready) {
      if (!this.options.sources) this.options.sources = [];

      this.options.sources.push(...sources);
    } else {
      for (const source of sources) {
        source.apply(this.base);
      }
    }
  }

  public makeAllLayersVisible() {
    for (const layer of this.layers) {
      this.setLayerVisibility(layer.id, true);
    }
  }

  public setLayerVisibility(layerID: string, toggle: boolean) {
    this.base.setLayoutProperty(
      layerID,
      "visibility",
      toggle ? "visible" : "none"
    );
  }

  private async init() {
    await Promise.all(
      (this.options.sources || []).map((s) => s.init.bind(s)())
    );

    this.addSources(...(this.options.sources || []));
    this.addLayers(...(this.options.layers || []));
    this.emiter.emit("on");
  }

  private get layers() {
    if (!this.ready) return [];

    return this.base.getStyle().layers.filter((l) => l.id.startsWith("tldb-"));
  }
}
