import { gql } from '@apollo/client';

export const GET_ALL_DATABASES = gql`
  query getAllDatabases {
    getAllDatabases {
      id
      database
    }
  }
`;
