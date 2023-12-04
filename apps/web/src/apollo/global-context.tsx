import { User } from 'apollo/querys/get-current-user';
import { createContext, Dispatch } from 'react';

interface StateType {
  signIn: (vars: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  isSignedIn: () => boolean;
  registration: (v: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
  authInfo?: {
    access_token?: string;
    refresh_token?: string;
    user?: User;
    loading: boolean;
  };
}

interface ContextType extends StateType {
  dispatch?: Dispatch<Action>;
}

export enum ContextAction {
  HANDLE_ALERT,
  HANDLE_USER,
  call,
}

export const initialState: ContextType = {
  signIn: () => new Promise((res) => res()),
  signOut: () => new Promise((res) => res()),
  isSignedIn: () => false,
  registration: () => new Promise((res) => res()),
};

type Action = {
  type: ContextAction.HANDLE_USER;
  payload: User;
};

export const Context = createContext(initialState);

export const reducer = (state: StateType, action: Action) => {
  const { type, payload } = action;

  switch (type) {
    case ContextAction.HANDLE_USER:
      return {
        ...state,
        user: payload,
      };
    default:
      return state;
  }
};
