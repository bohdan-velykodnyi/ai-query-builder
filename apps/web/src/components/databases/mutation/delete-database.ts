import { gql } from '@apollo/client';

export const DELETE_DATABASE = gql`
  mutation deleteDatabase($id: ID!) {
    deleteDatabase(id: $id)
  }
`;
