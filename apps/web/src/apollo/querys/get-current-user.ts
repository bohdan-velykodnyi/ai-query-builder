import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query getCurrentUser {
    getCurrentUser {
      id
      name
      email
    }
  }
`;

export interface User {
  id: string;
  name: string;
  email: string;
}
