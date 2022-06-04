import EventEmitter from "events";
import { Map } from "mapbox-gl";
import { MutableRefObject } from "react";
import { BaseMapOptions, TLDBBaseMap } from "./BaseMap";
import { BaseLayer } from "./layers/BaseLayer";

export interface MapOptions {
  base?: Omit<BaseMapOptions, "container">;
  layers?: BaseLayer[];
}

export class TLDBMap {
  private _base!: TLDBBaseMap;
  private _ready = false;
  private emiter = new EventEmitter();

  constructor(private options: MapOptions = {}) {}

  public apply(container: MutableRefObject<HTMLDivElement | null>) {
    this._base = new TLDBBaseMap({ container, ...this.options.base });

    this._base.on("load", () => {
      this._ready = true;
      this.init();
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

  public toggleLayerSolo(layerID: string) {
    for (const layer of this.layers) {
      if (layer.id === `tldb-${layerID}`) {
        this.setLayerVisibility(layer.id, true);
      } else {
        this.setLayerVisibility(layer.id, false);
      }
    }
  }

  public addLayers(...layers: BaseLayer[]) {
    if (!this._ready) {
      if (!this.options.layers) this.options.layers = [];

      this.options.layers.push(...layers);
    } else {
      for (const layer of layers) {
        layer.apply(this.base);
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

  private init() {
    this.addLayers(...(this.options.layers || []));
    this.emiter.emit("on");
  }

  private get layers() {
    if (!this.ready) return [];

    return this.base.getStyle().layers.filter((l) => l.id.startsWith("tldb-"));
  }
}
