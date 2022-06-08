import { gql } from "@apollo/client";
import { MutableRefObject } from "react";
import { coordinatesToLatLongArray, getCenter } from "../../../helpers/map";
import { expoClient } from "../../expo/client";
import { Route } from "../../expo/structures/Route";
import { RouteLayer, RouteLayerOptions } from "../layers/RouteLayer";
import { TLDBMap } from "../Map";

export class RoutePageMap extends TLDBMap {
  public route!: Route;

  constructor() {
    super({
      layers: [],
    });
  }

  public apply(container: MutableRefObject<HTMLDivElement | null>): void {
    super.apply(container);
  }

  public async createLayers(routeNumber: string, options?: RouteLayerOptions) {
    const route = await this.getRoute(routeNumber);

    this.route = route;

    const layer = new RouteLayer(route, options);

    this.addLayers(layer);
    this.centerOnRoute(route);
  }

  public selectPattern(pattern: string | undefined) {
    if (pattern) {
      this.toggleLayerSolo(pattern);
    } else if (!pattern) {
      this.makeAllLayersVisible();
    }
  }

  private centerOnRoute(route: Route) {
    const allCoords = route.patterns.flatMap((p) =>
      p.shape.points.map((p) => p.coordinates)
    );

    this.base.easeTo({
      center: coordinatesToLatLongArray(getCenter(allCoords)),
    });
  }

  private async getRoute(routeNumber: string) {
    const query = gql`
      query getRoutes($routeNumber: String!) {
        routes(filters: { number: { exact: $routeNumber } }) {
          id
          name
          number

          patterns {
            id
            name
            headsign
            tripCount
            shape {
              points {
                coordinates {
                  latitude
                  longitude
                }
              }
            }
          }
        }
      }
    `;

    const results = await expoClient.query<
      { routes: [Route] },
      { routeNumber: string }
    >({ query, variables: { routeNumber } });

    return results.data.routes[0];
  }
}
