import { gql } from '@apollo/client';

export const SEND_MESSAGE = gql`
  mutation sendMessage($database_id: ID!, $message: String!) {
    sendMessage(
      sendMessageDto: { database_id: $database_id, message: $message }
    )
  }
`;
