import { gql } from '@apollo/client';

export const SAVE_DATABASE = gql`
  mutation saveDatabase(
    $port: String!
    $password: String!
    $host: String!
    $database: String!
    $username: String!
  ) {
    saveDatabase(
      saveDatabase: {
        port: $port
        password: $password
        host: $host
        database: $database
        username: $username
      }
    ) {
      id
      database
    }
  }
`;
