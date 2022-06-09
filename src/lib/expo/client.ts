import { ApolloClient, InMemoryCache } from "@apollo/client";
import { config } from "../../config";

export const expoClient = new ApolloClient({
  uri: config.expoURL,
  cache: new InMemoryCache(),
});
