import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // TODO: Actually send message through WebSocket
    const message: ChatMessage = {
      id: Date.now().toString(),
      username: 'You', // This will be replaced with actual username
      message: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  return (
    <div className="h-64 bg-gray-800 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-bold text-blue-400">{msg.username}: </span>
            <span>{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-gray-900">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-gray-700 rounded px-3 py-2"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
