import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { MapDisplay } from "../../components/mapping/TLDBMapDisplay";
import { Breadcrumbs } from "../../components/page/Breadcrumbs";
import { Page } from "../../components/page/Page";
import { RouteLineDisplay } from "../../components/routes/RouteLineDisplay";
import { optionalClass } from "../../helpers/components";
import {
  coordinatesToLatLongArray,
  getCenter,
  getZoom,
} from "../../helpers/map";
import { Route } from "../../lib/expo/structures/Route";
import { RouteLayer } from "../../lib/mapping/layers/RouteLayer";
import { TLDBMap } from "../../lib/mapping/Map";
import "./RoutePage.scss";

const GET_ROUTE = gql`
  query getRoutes($routeNumber: String!) {
    route: routes(filters: { number: { exact: $routeNumber } }) {
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

export const RoutePage: React.FunctionComponent = () => {
  const { routeNumber } = useParams();
  const location = useLocation();

  const map = useRef<TLDBMap | null>(null);

  const [route, setRoute] = useState<Route | undefined>(undefined);
  const [mapReady, setMapReady] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<string | undefined>(
    undefined
  );

  const { loading, error, data } = useQuery<
    { route: [Route] },
    { routeNumber: string }
  >(GET_ROUTE, { variables: { routeNumber: routeNumber! } });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setSelectedPattern(queryParams.get("pattern") ?? undefined);
  }, [location]);

  useEffect(() => {
    setRoute(data?.route[0]);

    if (!data || !mapReady) return;

    const allCoords =
      data.route[0].patterns.flatMap((p) =>
        p.shape.points.map((p) => p.coordinates)
      ) || [];

    const mapBase = map.current!.base;

    const routeLayer = new RouteLayer(data.route[0]);

    map.current?.addLayers(routeLayer);

    mapBase.zoomTo(getZoom(allCoords));
    mapBase.easeTo({
      center: coordinatesToLatLongArray(getCenter(allCoords)),
    });
  }, [data, mapReady]);

  useEffect(() => {
    if (route && selectedPattern) {
      map.current?.toggleLayerSolo(selectedPattern);
    } else if (route && !selectedPattern) {
      map.current?.makeAllLayersVisible();
    }
  }, [route, selectedPattern]);

  if (!map.current) {
    map.current = new TLDBMap();
    map.current.onReady(() => setMapReady(true));
  }

  return (
    <Page title={route?.number || "Route"} className="RoutePage">
      {loading && <p>Loading...</p>}

      {error && (
        <p>
          <>Error: {error}</>
        </p>
      )}

      {route && (
        <div>
          <Breadcrumbs breadcrumbs={[{ link: "routes", name: "Routes" }]} />

          <div className="route-title">
            <h1>
              <RouteLineDisplay route={route} />
            </h1>
            <small className="route-id">[ID: {route.id}]</small>
          </div>

          <div className="content">
            <div className="patterns">
              <p
                key={"all"}
                onClick={() => setSelectedPattern(undefined)}
                className={`pattern ${optionalClass(
                  selectedPattern === undefined,
                  "selected"
                )}`}
              >
                All Patterns
              </p>
              {route.patterns
                .slice()
                .sort((a, b) => b.tripCount - a.tripCount)
                .map((p) => (
                  <p
                    key={p.id}
                    onClick={() => setSelectedPattern(p.name)}
                    className={`pattern ${optionalClass(
                      p.name === selectedPattern,
                      "selected"
                    )}`}
                  >
                    {p.name}: {p.headsign.replace(routeNumber || "", "").trim()}{" "}
                    - {p.tripCount}
                  </p>
                ))}
            </div>

            <MapDisplay map={map.current} />
          </div>
        </div>
      )}
    </Page>
  );
};
