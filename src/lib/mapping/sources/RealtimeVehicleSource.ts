import { gql } from "@apollo/client";
import { FeatureCollection } from "geojson";
import { coordinatesToLatLongArray } from "../../../helpers/map";
import { expoClient } from "../../expo/client";
import { VehiclePosition } from "../../expo/structures/VehiclePosition";
import { BaseSource } from "./BaseSource";

export class RealtimeVehicleSource extends BaseSource<
  "geojson",
  VehiclePosition[]
> {
  constructor() {
    super({
      name: "gtfs-realtime",
      type: "geojson",
    });
  }

  async fetchData() {
    const query = gql`
      query {
        vehiclePositions {
          vehicleID

          trip {
            id
            headsign

            routePattern {
              routeID
              patternID
            }
          }
          position {
            latitude
            longitude
          }
        }
      }
    `;

    const results = await expoClient.query<{
      vehiclePositions: VehiclePosition[];
    }>({ query, fetchPolicy: "no-cache" });

    return results.data.vehiclePositions;
  }

  protected processRawData(data: VehiclePosition[]) {
    const features = data.map((d) => ({
      type: "Feature",
      properties: {
        id: d.vehicleID,
        description: `${d.trip.headsign}`,
      },
      geometry: {
        type: "Point",
        coordinates: coordinatesToLatLongArray(d.position),
      },
    }));

    return {
      type: "FeatureCollection",
      features: features,
    } as FeatureCollection;
  }
}
