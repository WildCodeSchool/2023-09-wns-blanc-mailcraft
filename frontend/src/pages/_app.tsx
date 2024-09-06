import "@/styles/globals.css";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { MailingProvider } from "@/contexts/MailContext";
import { TemplateProvider } from "@/contexts/TemplateContext";
import Modal from "react-modal";

Modal.setAppElement("#__next");

const Layout = dynamic(() => import("@/components/Layout"), { ssr: false });

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql", // temporaire à passer en variable d'env
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, operation }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions.code === "UNAUTHENTICATED") {
        localStorage.removeItem("token");
        location.replace("/signIn");
      }
    }
  }
});

const client = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <AuthContextProvider>
        <TemplateProvider>
          <MailingProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MailingProvider>
        </TemplateProvider>
      </AuthContextProvider>
    </ApolloProvider>
  );
}

export default dynamic(() => Promise.resolve(App), { ssr: false });
