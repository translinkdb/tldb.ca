import { PointsLayer } from "./base/PointsLayer";

export class RealtimeVehicleLayer extends PointsLayer {
  constructor() {
    super({
      id: "gtfs-realtime",
      source: "gtfs-realtime",
      color: {
        outline: "white",
        fill: "#009ddc",
      },
      width: {
        outline: 2,
      },
    });
  }
}
