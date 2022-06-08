import { Coordinates } from "./Misc";
import { Trip } from "./Trip";

export interface VehiclePosition {
  vehicleID: number;
  trip: Trip;
  position: Coordinates;
}
