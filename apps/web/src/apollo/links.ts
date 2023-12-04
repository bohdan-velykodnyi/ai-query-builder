import { HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import crossFetch from 'cross-fetch';

export const httpLink = new HttpLink({
  uri: (process.env.NEXT_PUBLIC_HTTP_BACKEND_URL || '') + '/graphql',
  fetch: crossFetch,
});

export const authLink = setContext(
  (_, { headers }: { headers: { [key: string]: string } }) => {
    const auth =
      typeof window !== 'undefined'
        ? 'Bearer ' + (localStorage.getItem('access_token') || '')
        : null;

    return {
      headers: {
        ...headers,
        authorization: auth,
      },
    };
  },
);
