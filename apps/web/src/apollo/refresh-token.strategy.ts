/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Operation } from '@apollo/client';

const REFRESH_TOKEN_STR = `
mutation {
    refreshTokens {
      access_token
      refresh_token
    }
}
`;

interface PendingRequest {
  resolve: ResolveForward;
  operation: Operation;
}

export type ResolveForward = (value: Operation) => void;

export class RefreshTokenStrategy {
  private refresh_process_started = false;
  private pending_requests: PendingRequest[] = [];
  private new_access_token?: string = undefined;

  get isRefreshProcessStarted() {
    return this.refresh_process_started;
  }

  set addPendingRequests(new_item: PendingRequest) {
    this.pending_requests.push(new_item);
  }

  public async getNewToken(): Promise<void> {
    try {
      this.refresh_process_started = true;
      const { access_token, refresh_token } = await this.fetchRefreshToken();

      this.setNewTokens(access_token, refresh_token);
      this.resolvePendingRequests();
    } catch {
      this.removeInvalidTokens();
    } finally {
      this.refresh_process_started = false;
    }
  }

  public removeInvalidTokens(): void {
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token');
    this.pending_requests = [];
    this.new_access_token = '';
  }

  private setNewTokens(access_token: string, refresh_token: string): void {
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('access_token', access_token);

    this.new_access_token = access_token;
  }

  private resolvePendingRequests(): void {
    this.pending_requests.map((request) => {
      const { resolve, operation } = request;
      const oldHeaders = operation.getContext().headers;

      operation.setContext({
        headers: {
          ...oldHeaders,
          authorization: `Bearer ${this.new_access_token || ''}`,
        },
      });
      resolve(operation);
    });
    this.pending_requests = [];
  }

  private async fetchRefreshToken(): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const refresh_token = localStorage.getItem('refresh_token') || '';
    const { data } = await (
      await fetch(
        (process.env.NEXT_PUBLIC_HTTP_BACKEND_URL || '') + '/graphql',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({
            query: REFRESH_TOKEN_STR,
            variables: { refresh_token },
          }),
        },
      )
    ).json();

    return data.refreshToken;
  }
}
