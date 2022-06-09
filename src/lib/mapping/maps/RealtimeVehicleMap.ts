import { gql } from "@apollo/client";
import { MutableRefObject } from "react";
import { calculateCoordinatesForPopup } from "../../../helpers/map";
import { expoClient } from "../../expo/client";
import { Pattern } from "../../expo/structures/Route";
import { Trip } from "../../expo/structures/Trip";
import { PatternLayer } from "../layers/PatternLayer";
import { RealtimeVehicleLayer } from "../layers/RealtimeVehicleLayer";
import { TLDBMap } from "../Map";
import { rainbowPalette, randomColor } from "../palettes";
import { MouseoverListener } from "../resources/MouseoverListener";
import { Popup } from "../resources/Popup";
import { RealtimeVehicleSource } from "../sources/RealtimeVehicleSource";

export class RealtimeVehicleMap extends TLDBMap {
  constructor() {
    super({
      sources: [new RealtimeVehicleSource()],
      layers: [new RealtimeVehicleLayer()],
    });
  }

  async refresh() {
    const source = this.options.sources!.find((s) => s.id === "gtfs-realtime");

    await source?.refreshData(this.base);
  }

  public apply(container: MutableRefObject<HTMLDivElement | null>): void {
    super.apply(container);

    const popup = new Popup();
    const mouseoverListener = new MouseoverListener({
      layer: "tldb-gtfs-realtime",
      pointerCursor: true,
      initialState: { mousedOut: false },
    });

    mouseoverListener.onMouseover(async (e) => {
      const feature = e.features?.[0];

      if (feature) {
        const vehicleID = feature.properties?.id;
        const description = feature.properties?.description;

        mouseoverListener.state.vehicleID = vehicleID;
        await this.showPattern(mouseoverListener);

        popup.apply(this.base, {
          at: calculateCoordinatesForPopup(
            e.lngLat.lng,
            feature.geometry.coordinates
          ),
          content: description,
        });
      }
    });

    mouseoverListener.onMouseout(() => {
      mouseoverListener.state.mousedOut = true;

      this.hidePattern(mouseoverListener.state.vehicleID);
      popup.remove();
    });

    mouseoverListener.apply(this.base);
  }

  private realtimeVehicleSource(): RealtimeVehicleSource {
    return this.getSource("gtfs-realtime")! as RealtimeVehicleSource;
  }

  private async showPattern(mouseoverListener: MouseoverListener) {
    const vehiclePosition = this.realtimeVehicleSource().data.find(
      (vp) => vp.vehicleID === mouseoverListener.state.vehicleID
    );

    if (vehiclePosition) {
      const layerID = this.getLayerIDFromTrip(vehiclePosition.trip, true);

      const layer = this.base.getLayer(layerID);

      if (!layer) {
        const pattern = await this.fetchTripPattern(
          vehiclePosition.trip.routePattern.patternID
        );

        this.addLayers(
          new PatternLayer(pattern, {
            color: randomColor(rainbowPalette),
            id: this.getLayerIDFromTrip(vehiclePosition.trip),
            visible: !mouseoverListener.state.mousedOut,
          })
        );
      } else {
        this.setLayerVisibility(layerID, true);
      }
    }
  }

  private hidePattern(vehicleID: number) {
    const vehiclePosition = this.realtimeVehicleSource().data.find(
      (vp) => vp.vehicleID === vehicleID
    );

    if (vehiclePosition) {
      const layerID = this.getLayerIDFromTrip(vehiclePosition.trip, true);

      // Set a slight delay to catch cases where the
      // mouseout event triggers immediately after the mouse over event,
      setTimeout(() => {
        if (this.base.getLayer(layerID)) {
          this.setLayerVisibility(layerID, false);
        }
      }, 50);
    }
  }

  private getLayerIDFromTrip(trip: Trip, prefixed: boolean = false) {
    return `${prefixed ? "tldb-" : ""}vp-pattern-${trip.routePattern.routeID}-${
      trip.routePattern.patternID
    }`;
  }

  private async fetchTripPattern(patternID: number): Promise<Pattern> {
    const query = gql`
      query getPattern($id: ID!) {
        patterns(filters: { id: $id }) {
          id
          name

          shape {
            id
            points {
              coordinates {
                latitude
                longitude
              }
            }
          }
        }
      }
    `;

    const results = await expoClient.query({
      query,
      variables: { id: patternID },
    });

    return results.data.patterns[0];
  }
}
