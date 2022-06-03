import { gql, useQuery } from "@apollo/client";
import { Map } from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import { Page } from "../../components/page/Page";
import { Route } from "../../lib/expo/structures/Route";
import { getPaletteColor, rainbowPalette } from "../../lib/mapping/palettes";
import { PatternLine } from "../../lib/mapping/PatternLine";
import "./MapPage.scss";

const TEST = gql`
  query {
    routes(filters: { name: { contains: "haney pl" } }) {
      number
      patterns {
        name
        headsign
        id
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

export const MapPage: React.FunctionComponent = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { data } = useQuery<{ routes: [Route] }>(TEST);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/dark-v10",
      center: [-122.8641768, 49.2193935],
      zoom: 10,
      attributionControl: false,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });
  });

  useEffect(() => {
    if (!mapLoaded || !map.current || !data) return;

    const routes = data.routes.filter((r) => !r.number.startsWith("N"));

    routes.forEach((route, idx) => {
      const pattern =
        route.patterns.find((p) =>
          p.headsign.toLowerCase().includes("haney pl")
        ) || route.patterns[0];

      const patternLine = new PatternLine(
        pattern,
        getPaletteColor(rainbowPalette, idx)
      );

      map.current!.addLayer(patternLine.asLayer());
    });
  }, [data, map, mapLoaded]);

  return (
    <Page title="Map" className="MapPage">
      <div ref={mapContainer} className="map-container"></div>
    </Page>
  );
};
