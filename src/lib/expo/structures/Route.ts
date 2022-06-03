import { Coordinates } from "./Misc";

export interface Route {
  id: number;
  name: string;
  number: string;
  patterns: Pattern[];
}

export interface Pattern {
  id: number;
  name: string;
  headsign: string;
  shape: Shape;
}

export interface Shape {
  points: ShapePoint[];
}

export interface ShapePoint {
  coordinates: Coordinates;
}
