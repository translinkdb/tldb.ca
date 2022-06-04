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

// function getMaxMinOfCoordinates(coordinatesList: Coordinates[]): {
//   max: Coordinates;
//   min: Coordinates;
// } {
//   let maxLat = -Infinity;
//   let minLat = Infinity;
//   let maxLong = -Infinity;
//   let minLong = Infinity;

//   for (const coordinates of coordinatesList) {
//     const { latitude, longitude } = coordinates;

//     if (latitude > maxLat) maxLat = latitude;
//     if (latitude < minLat) minLat = latitude;
//     if (longitude > maxLong) maxLong = longitude;
//     if (longitude < minLong) minLong = longitude;
//   }

//   return {
//     max: { longitude: maxLong, latitude: maxLat },
//     min: { longitude: minLong, latitude: minLat },
//   };
// }

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

export function getZoom(_coordinatesList: Coordinates[]): number {
  // const { max, min } = getMaxMinOfCoordinates(coordinatesList);

  return 10;
  // return 9 / ((max.latitude - min.latitude) / (max.longitude - min.longitude));
}
