import { gql } from '@apollo/client';

export const LOGOUT = gql`
  mutation logout($refresh_token: String!) {
    logout(refresh_token: $refresh_token)
  }
`;
