import { gql } from "@apollo/client";
import { Popup } from "mapbox-gl";
import { MutableRefObject } from "react";
import { expoClient } from "../../expo/client";
import { Pattern } from "../../expo/structures/Route";
import { Trip } from "../../expo/structures/Trip";
import { PatternLayer } from "../layers/PatternLayer";
import { RealtimeVehicleLayer } from "../layers/RealtimeVehicleLayer";
import { TLDBMap } from "../Map";
import { rainbowPalette, randomColor } from "../palettes";
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

    const popup = new Popup({
      closeButton: false,
      closeOnClick: false,
    });

    let vehicleID: undefined | number = undefined;

    this.base.on("mouseenter", "tldb-gtfs-realtime", async (e) => {
      this.base.getCanvas().style.cursor = "pointer";

      if (e.features) {
        vehicleID = e.features[0].properties?.id;
        await this.showPattern(vehicleID!);

        const coordinates = (e.features[0].geometry as any).coordinates.slice();
        const description = e.features[0].properties?.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates).setHTML(description).addTo(this.base);
      }
    });

    this.base.on("mouseout", "tldb-gtfs-realtime", (e) => {
      this.base.getCanvas().style.cursor = "";
      popup.remove();

      this.hidePattern(vehicleID!);
    });
  }

  private realtimeVehicleSource(): RealtimeVehicleSource {
    return this.getSource("gtfs-realtime")! as RealtimeVehicleSource;
  }

  private async showPattern(vehicleID: number) {
    const vehiclePosition = this.realtimeVehicleSource().data.find(
      (vp) => vp.vehicleID === vehicleID
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

      this.setLayerVisibility(layerID, false);
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
