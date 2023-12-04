import { gql } from '@apollo/client';

export const REGISTRATION = gql`
  mutation registration($name: String!, $email: String!, $password: String!) {
    registration(
      credentials: { name: $name, email: $email, password: $password }
    ) {
      id
      name
      email
    }
  }
`;
