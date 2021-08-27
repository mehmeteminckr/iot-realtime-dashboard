import { ApolloClient, gql, HttpLink, InMemoryCache, split, useSubscription } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';


class ApolloQLClient {
  public instance: any;

  constructor(){
    const wsLink = new WebSocketLink({
      uri: `ws://localhost:4000/graphql`,
      options: {
        reconnect: true,
        timeout:30000
      },
    });
    
    const httpLink = new HttpLink({
      uri: 'http://localhost:4000/graphql',
    });
    
    const link = split(
      // split based on operation type
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink,
    );
    
    this.instance = new ApolloClient({
      cache: new InMemoryCache(),
      link,
    });
  }
}

export default new ApolloQLClient();