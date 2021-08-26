/*import {
    ApolloClient,
    InMemoryCache,
    gql,
  } from "@apollo/client/core";
  import { WebSocketLink } from "@apollo/client/link/ws";

  const link = new WebSocketLink({
    uri: `ws://localhost:4000/`,
    options: {
      reconnect: true,
    },
  });
  
  const client = new ApolloClient({
    link,
    uri: "http://localhost:4000/",
    cache: new InMemoryCache(),
  });
  
  const GET_MESSAGES = gql`
    subscription {
      messages {
        id
        content
        user
      }
    }
  `;
  
  const POST_MESSAGE = gql`
    type
    mutation($user: String!, $content: String!) {
      postMessage(user: $user)
    }
  `; */