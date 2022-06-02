import { Link } from "react-router-dom";
import { Route } from "../../lib/expo/structures/Route";
import "./RouteLineDisplay.scss";
import { RoutePill } from "./RoutePill";

interface RouteLineDisplayProps {
  route: Route;
  linkTo?: string;
}

export const RouteLineDisplay: React.FunctionComponent<
  RouteLineDisplayProps
> = ({ route, linkTo }) => {
  return (
    <div className="RouteLineDisplay">
      <RoutePill routeNumber={route.number} />
      {linkTo ? <Link to={linkTo}>{route.name}</Link> : <p>{route.name}</p>}
    </div>
  );
};
