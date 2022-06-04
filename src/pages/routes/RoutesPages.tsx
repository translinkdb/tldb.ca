import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { Page } from "../../components/page/Page";
import { RouteLineDisplay } from "../../components/routes/RouteLineDisplay";
import { Route } from "../../lib/expo/structures/Route";
import "./RoutesPage.scss";

const ROUTES = gql`
  query getRoutes($keywords: String) {
    routes(filters: { name: { contains: $keywords } }) {
      id
      name
      number
    }
  }
`;

export const RoutesPage: React.FunctionComponent = () => {
  const [keywords, setKeywords] = useState<string | undefined>(undefined);

  const { loading, error, data } = useQuery<
    { routes: Route[] },
    { keywords?: string }
  >(ROUTES, { variables: { keywords } });

  return (
    <Page title="Routes">
      <h1 className="title">Routes</h1>

      <DebounceInput
        className="routes-search"
        minLength={2}
        debounceTimeout={300}
        value={keywords}
        onChange={(event) =>
          setKeywords(event.target.value.trim() || undefined)
        }
      />

      {loading && <p>Loading...</p>}

      {error && (
        <p>
          <>Error: {error}</>
        </p>
      )}

      {keywords && data?.routes.length === 0 && (
        <p>
          No routes found matching <span>"{keywords}"</span>
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
