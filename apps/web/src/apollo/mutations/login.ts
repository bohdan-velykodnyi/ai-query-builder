import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(credentials: { email: $email, password: $password }) {
      access_token
      refresh_token
    }
  }
`;

export type ITokenResponse = {
  access_token: string;
  refresh_token: string;
};
