import { fromPromise, Operation } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import {
  RefreshTokenStrategy,
  ResolveForward,
} from 'apollo/refresh-token.strategy';

export enum Errors {
  JWT_EXPIRED = 'jwt expired',
  REFRESH_TOKEN_NOT_FOUND = 'Refresh token not found',
}

const refreshToken = new RefreshTokenStrategy();

export const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors)
      for (const err of graphQLErrors) {
        switch (err.message) {
          case Errors.JWT_EXPIRED: {
            if (!refreshToken.isRefreshProcessStarted) {
              refreshToken.getNewToken().catch(() => {
                return;
              });
            }

            return fromPromise(
              new Promise(
                (resolve: ResolveForward) =>
                  (refreshToken.addPendingRequests = { resolve, operation }),
              ),
            )
              .filter((value) => Boolean(value))
              .flatMap((new_operation: Operation) => forward(new_operation));
          }
          case Errors.REFRESH_TOKEN_NOT_FOUND: {
            return refreshToken.removeInvalidTokens();
          }
        }
      }

    if (networkError)
      throw new Error(`[Network error]: ${JSON.stringify(networkError)}`);
  },
);
