import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Page } from "../../components/page/Page";
import { RouteLineDisplay } from "../../components/routes/RouteLineDisplay";
import { Route } from "../../lib/expo/structures/Route";
import "./RoutesPage.scss";

const ROUTES = gql`
  query getRoutes {
    routes {
      id
      name
      number
    }
  }
`;

export const RoutesPage: React.FunctionComponent = () => {
  const { loading, error, data } = useQuery<{ routes: Route[] }>(ROUTES);

  return (
    <Page title="Routes">
      <h1 className="title">Routes</h1>

      {loading && <p>Loading...</p>}
      {error && (
        <p>
          <>Error: {error}</>
        </p>
      )}
      {data && (
        <div>
          {data.routes.map((route) => (
            <div key={route.id}>
              <RouteLineDisplay
                route={route}
                linkTo={`/routes/${route.number}`}
              />
            </div>
          ))}
        </div>
      )}
    </Page>
  );
};
