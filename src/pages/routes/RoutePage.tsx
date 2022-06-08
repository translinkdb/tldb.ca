import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { MapDisplay } from "../../components/mapping/TLDBMapDisplay";
import { Breadcrumbs } from "../../components/page/Breadcrumbs";
import { Page } from "../../components/page/Page";
import { RouteLineDisplay } from "../../components/routes/RouteLineDisplay";
import { optionalClass } from "../../helpers/components";
import { Route } from "../../lib/expo/structures/Route";
import { RoutePageMap } from "../../lib/mapping/maps/RoutePageMap";
import "./RoutePage.scss";

export const RoutePage: React.FunctionComponent = () => {
  const { routeNumber } = useParams();
  const location = useLocation();

  const map = useRef<RoutePageMap | null>(null);

  const [selectedPattern, setSelectedPattern] = useState<string | undefined>(
    undefined
  );
  const [route, setRoute] = useState<Route | undefined>(undefined);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setSelectedPattern(queryParams.get("pattern") ?? undefined);
  }, [location]);

  useEffect(() => {
    map.current!.selectPattern(selectedPattern);
  }, [selectedPattern]);

  if (!map.current) {
    map.current = new RoutePageMap();
  }

  map.current.onReady(async () => {
    await map.current?.createLayers(routeNumber!);

    setRoute(map.current?.route);
  });

  return (
    <Page title={route?.number || "Route"} className="RoutePage">
      {!route && <p>Loading...</p>}

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
          </div>
        </div>
      )}

      <MapDisplay map={map.current} hidden={!route} />
    </Page>
  );
};
