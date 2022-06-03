import { lineString } from "@turf/turf";
import { Coordinates } from "../lib/expo/structures/Misc";

export function coordinatesToLinestring(coords: Coordinates[]) {
  return lineString(coords.map((c) => coordinatesToLatLongArray(c)));
}

export function coordinatesToLatLongArray(
  coords: Coordinates
): [longitude: number, latitude: number] {
  return [coords.longitude, coords.latitude];
}
