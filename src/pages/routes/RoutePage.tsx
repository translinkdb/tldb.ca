import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { Breadcrumbs } from "../../components/page/Breadcrumbs";
import { Page } from "../../components/page/Page";
import { RouteLineDisplay } from "../../components/routes/RouteLineDisplay";
import { Route } from "../../lib/expo/structures/Route";
import "./RoutesPage.scss";

const GET_ROUTE = gql`
  query getRoutes($routeNumber: String!) {
    route: routes(filters: { number: { exact: $routeNumber } }) {
      id
      name
      number
    }
  }
`;

export const RoutePage: React.FunctionComponent = () => {
  const { routeNumber } = useParams();

  const { loading, error, data } = useQuery<
    { route: [Route] },
    { routeNumber: string }
  >(GET_ROUTE, { variables: { routeNumber: routeNumber! } });

  const route = data?.route?.[0];

  return (
    <Page title={route?.number || "Route"}>
      {loading && <p>Loading...</p>}
      {error && (
        <p>
          <>Error: {error}</>
        </p>
      )}
      {route && (
        <div>
          <Breadcrumbs breadcrumbs={[{ link: "routes", name: "Routes" }]} />

          <h1>
            <RouteLineDisplay route={route} />
          </h1>
          <small>[ID: {route.id}]</small>
        </div>
      )}
    </Page>
  );
};
