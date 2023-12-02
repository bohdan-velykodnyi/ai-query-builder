import React, { useEffect, useRef } from 'react';
import { ChatProps } from 'types';

const Chat = ({
  handleInputChange,
  messages,
  handleSendMessage,
  input,
  loading,
}: ChatProps) => {
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Function to handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Function to scroll to the bottom of the chat box
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Scroll to the bottom whenever new messages are added
    scrollToBottom();
  }, [messages]);

  return (
    <div className="mt-4 w-[100%] rounded-lg bg-gray-100 p-4">
      <div
        className="chat-box h-[500px] w-[100%] overflow-y-auto scroll-smooth pr-3"
        ref={chatBoxRef}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type === 'bot' ? 'bot' : 'user'}`}
          >
            {message.text}
          </div>
        ))}
        {loading && <div className="loader ml-auto"></div>}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-grow rounded-l-md border px-2 py-1"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <button
          className="rounded-r-md bg-blue-500 px-4 py-2 text-white"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
