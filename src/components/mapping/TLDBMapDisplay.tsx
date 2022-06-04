import { useEffect, useRef } from "react";
import { TLDBMap } from "../../lib/mapping/Map";

interface MapDisplayProps {
  map: TLDBMap;
}

export const MapDisplay: React.FunctionComponent<MapDisplayProps> = ({
  map,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // initialize map only once
    if (map.base) return;

    map.apply(mapContainer);
  }, [map, map.base]);

  return <div className="MapDisplay map-container" ref={mapContainer}></div>;
};
