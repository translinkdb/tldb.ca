import { optionalClass } from "../../helpers/components";
import "./RoutePill.scss";

interface RoutePillProps {
  routeNumber: string;
}

export const RoutePill: React.FunctionComponent<RoutePillProps> = ({
  routeNumber,
}) => {
  return (
    <div
      className={`RoutePill ${optionalClass(
        routeNumber.startsWith("N"),
        "nightbus"
      )} ${optionalClass(
        routeNumber.startsWith("R"),
        "rapidbus"
      )} ${optionalClass(routeNumber === "99", "b-line")} ${optionalClass(
        routeNumber.length === 3 && routeNumber.startsWith("8"),
        "school-special"
      )}`}
    >
      {routeNumber}
    </div>
  );
};
