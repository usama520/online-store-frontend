import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";

const uploadLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL Error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        extensions ? `Extensions: ${JSON.stringify(extensions, null, 2)}` : "",
      );

      // Handle admin authorization error - only redirect when on admin routes
      if (message.startsWith("You must be an admin to")) {
        console.log('Admin authorization error detected:', message);
        if (typeof window !== "undefined") {
          const isAdminRoute = window.location.pathname.startsWith("/admin");
          
          // Only clear tokens and redirect for admin routes
          if (isAdminRoute) {
            // Clear all auth-related storage
            localStorage.removeItem("token");
            localStorage.removeItem("auth-storage");

            // Redirect to admin login page
            window.location.href = "/admin/login";
          }
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network Error]: ${networkError.message}`, networkError);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, uploadLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
