import { RealtimeVehicleMap } from "../../lib/mapping/maps/RealtimeVehicleMap";
import "./MapControls.scss";

type MapControlsProps = {
  map: RealtimeVehicleMap;
};

export const MapControls: React.FunctionComponent<MapControlsProps> = ({
  map,
}) => {
  return (
    <div className="MapControls">
      <h3>Controls</h3>

      <button onClick={() => map.refresh()}>Refresh</button>
    </div>
  );
};
