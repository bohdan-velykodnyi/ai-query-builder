export interface ChatProps {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  messages: { text: string; type: 'user' | 'bot' }[];
  handleSendMessage: () => void;
  input: string;
  loading: boolean;
}
