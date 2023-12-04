import { ApolloClient, ApolloLink } from '@apollo/client';
import { cache } from 'apollo/cache';
import { errorLink } from 'apollo/error';
import { authLink, httpLink } from 'apollo/links';

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink, errorLink]),
  cache: cache,
  connectToDevTools: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
    },
  },
});
