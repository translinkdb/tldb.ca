import {
  Popup as MapboxPopup,
  PopupOptions as MapboxPopupOptions,
} from "mapbox-gl";
import { CoordinatesArray } from "../../expo/structures/Misc";
import { TLDBBaseMap } from "../BaseMap";

interface PopupOptions {
  mapboxOptions?: MapboxPopupOptions;
}

export class Popup {
  private popup: MapboxPopup;

  constructor(private options: PopupOptions = {}) {
    this.popup = new MapboxPopup(this.mapboxOptions);
  }

  public apply(
    map: TLDBBaseMap,
    options: { at: CoordinatesArray; content: string }
  ) {
    this.popup.setLngLat(options.at).setHTML(options.content).addTo(map);
  }

  public remove() {
    this.popup.remove();
  }

  private get mapboxOptions() {
    return {
      ...(this.options.mapboxOptions || {}),
      closeButton: false,
      closeOnClick: false,
      className: "tldb-popup",
    };
  }
}
