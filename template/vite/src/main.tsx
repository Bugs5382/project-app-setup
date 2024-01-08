// @ts-nocheck
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { accessEnv } from "./helpers/accessEnv.ts";
import { getLocalStorage } from "./helpers/localStroage.ts";
import "./index.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-toastify/dist/ReactToastify.css";

interface IMainProperties {
  defaultLang: string;
}

export const Main: React.FC<Readonly<IMainProperties>> = (props) => {
  const GRAPHQL_HTTPS = accessEnv("GRAPHQL_HTTPS", "http");
  const GRAPHQL_HOST = accessEnv("GRAPHQL_HOST", "localhost");
  const GRAPHQL_PORT = accessEnv("GRAPHQL_PORT", "3000");

  const httpLink = createHttpLink({
    uri: `${GRAPHQL_HTTPS}://${GRAPHQL_HOST}:${GRAPHQL_PORT}/graphql`,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        "x-user-language": getLocalStorage("i18nextLng")
          ? getLocalStorage("i18nextLng")
          : props.defaultLang,
      },
    };
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });

  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <Error />,
      children: [],
    },
  ]);

  return (
    <>
      <ApolloProvider client={client}>
        <ToastContainer
          autoClose={5000}
          toastClassName="toast-container"
          style={{ width: "50rem" }}
        />
        <RouterProvider router={router} />
      </ApolloProvider>
    </>
  );
};
