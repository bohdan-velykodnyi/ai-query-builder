'use client';
import { ApolloProvider } from '@apollo/client';
import { client } from 'apollo/apollo-client';
import { Context, initialState, reducer } from 'apollo/global-context';
import { LOGIN } from 'apollo/mutations/login';
import { LOGOUT } from 'apollo/mutations/logout';
import { REGISTRATION } from 'apollo/mutations/registration';
import { GET_CURRENT_USER, User } from 'apollo/querys/get-current-user';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useReducer, useState } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useProvideAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ ...state, ...auth, dispatch }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </Context.Provider>
  );
}

export const useGlobalContext = () => {
  return useContext(Context);
};

const useProvideAuth = () => {
  const [authInfo, setAuthInfo] = useState<{
    access_token?: string;
    refresh_token?: string;
    user?: User;
    loading: boolean;
  }>({ loading: true });

  const router = useRouter();

  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');

    if (access_token && refresh_token) {
      getCurrentUser({ access_token, refresh_token });
    } else {
      setAuthInfo((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const signOut = async () => {
    await client
      .mutate<{ logout: { message: string } }, { refresh_token?: string }>({
        mutation: LOGOUT,
        variables: { refresh_token: authInfo?.refresh_token },
      })
      .finally(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        (client as { resetStore: () => void }).resetStore();
        setAuthInfo({ loading: false });
      });
  };

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> => {
    return await client
      .mutate<
        { login: { access_token: string; refresh_token: string } },
        { email: string; password: string }
      >({
        mutation: LOGIN,
        variables: { email, password },
      })
      .then((r) => {
        if (r.data?.login) {
          localStorage.setItem('access_token', r.data.login.access_token);
          localStorage.setItem('refresh_token', r.data.login.refresh_token);
          getCurrentUser(r.data?.login);
          router.push('/databases');
        }
      });
  };

  const registration = async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }): Promise<void> => {
    return await client
      .mutate<
        { registration: { id: string } },
        { email: string; password: string; name: string }
      >({
        mutation: REGISTRATION,
        variables: { email, password, name },
      })
      .then((r) => {
        if (r.data?.registration) {
          signIn({ email, password }).catch(() => {
            throw new Error('Error login');
          });
        }
      });
  };

  const getCurrentUser = (tokens: {
    access_token: string;
    refresh_token: string;
  }) => {
    client
      .query<{ getCurrentUser: User }>({ query: GET_CURRENT_USER })
      .then((r) => {
        if (r.data) {
          setAuthInfo((prev) => ({
            prev,
            ...tokens,
            user: r.data.getCurrentUser,
            loading: false,
          }));
        }
      })
      .catch(() => {
        setAuthInfo({ ...tokens, loading: false });
      });
  };

  const isSignedIn = () => {
    return !!authInfo;
  };

  return {
    authInfo,
    signIn,
    signOut,
    isSignedIn,
    registration,
  };
};
