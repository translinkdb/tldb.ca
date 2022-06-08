import React, { useRef } from "react";
import { Page } from "../../components/page/Page";
import "./MapPage.scss";
import { MapDisplay } from "../../components/mapping/TLDBMapDisplay";
import { RealtimeVehicleMap } from "../../lib/mapping/maps/RealtimeVehicleMap";
import { MapControls } from "./MapControls";

export const MapPage: React.FunctionComponent = () => {
  const map = useRef<RealtimeVehicleMap | null>(null);

  if (!map.current) {
    map.current = new RealtimeVehicleMap();
  }

  map.current.onReady(() => {
    map.current!.refresh();
  });

  return (
    <Page title="Map" className="MapPage">
      <MapDisplay map={map.current!} />
      <MapControls map={map.current} />
    </Page>
  );
};
