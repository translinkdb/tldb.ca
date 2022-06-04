import { Map } from "mapbox-gl";
import { MutableRefObject } from "react";
import { Coordinates } from "../expo/structures/Misc";
import { coordinatesToLatLongArray } from "../../helpers/map";

export interface BaseMapOptions {
  container: MutableRefObject<HTMLDivElement | null>;
  center?: Coordinates;
  zoom?: number;
}

export class TLDBBaseMap extends Map {
  constructor(options: BaseMapOptions) {
    super({
      container: options.container.current!,
      style: "mapbox://styles/mapbox/light-v10",
      center: options.center
        ? coordinatesToLatLongArray(options.center)
        : [-122.8641768, 49.2193935],
      zoom: options.zoom || 10,
      attributionControl: false,
    });
  }
}
