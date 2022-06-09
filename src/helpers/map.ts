import { lineString } from "@turf/turf";
import { Coordinates, CoordinatesArray } from "../lib/expo/structures/Misc";

export function coordinatesToLinestring(coords: Coordinates[]) {
  return lineString(coords.map((c) => coordinatesToLatLongArray(c)));
}

export function coordinatesToLatLongArray(
  coords: Coordinates
): [longitude: number, latitude: number] {
  return [coords.longitude, coords.latitude];
}

export function getCenter(coordinatesList: Coordinates[]): Coordinates {
  let totalLongitude = 0;
  let totalLatitude = 0;

  for (const { longitude, latitude } of coordinatesList) {
    totalLongitude += longitude;
    totalLatitude += latitude;
  }

  return {
    latitude: totalLatitude / coordinatesList.length,
    longitude: totalLongitude / coordinatesList.length,
  };
}

export function calculateCoordinatesForPopup(
  eventLongitude: number,
  featureCoordinates: CoordinatesArray
): CoordinatesArray {
  let coordinates = featureCoordinates.slice() as CoordinatesArray;

  while (Math.abs(eventLongitude - coordinates[0]) > 180) {
    coordinates[0] += eventLongitude > coordinates[0] ? 360 : -360;
  }

  return coordinates;
}
