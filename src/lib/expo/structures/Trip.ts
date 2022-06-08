import { Pattern, Route } from "./Route";

export interface Trip {
  id: number;
  headsign: string;
  routePattern: RoutePattern;
}

export interface RoutePattern {
  route: Route;
  routeID: number;

  pattern: Pattern;
  patternID: number;
}
