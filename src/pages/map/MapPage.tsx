import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useRef } from "react";
import { Page } from "../../components/page/Page";
import { Route } from "../../lib/expo/structures/Route";
import { getPaletteColor, rainbowPalette } from "../../lib/mapping/palettes";
import { PatternLayer } from "../../lib/mapping/layers/PatternLayer";
import "./MapPage.scss";
import { MapDisplay } from "../../components/mapping/TLDBMapDisplay";
import { TLDBMap } from "../../lib/mapping/Map";

const TEST = gql`
  query {
    routes(filters: { name: { contains: "coquitlam cen" } }) {
      number
      patterns {
        id
        name
        headsign
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
  const map = useRef<TLDBMap | null>(null);
  const { data } = useQuery<{ routes: [Route] }>(TEST);

  useEffect(() => {
    if (!data || !map.current) return;

    const routes = data.routes.filter((r) => !r.number.startsWith("N"));

    routes.forEach((route, idx) => {
      const pattern =
        route.patterns.find((p) =>
          p.headsign.toLowerCase().includes("coquitlam cen")
        ) || route.patterns[0];

      const patternLine = new PatternLayer(
        pattern,
        getPaletteColor(rainbowPalette, idx)
      );

      map.current!.addLayers(patternLine);
    });
  }, [data, map]);

  if (!map.current) {
    map.current = new TLDBMap({});
  }

  return (
    <Page title="Map" className="MapPage">
      <MapDisplay map={map.current!} />
    </Page>
  );
};
