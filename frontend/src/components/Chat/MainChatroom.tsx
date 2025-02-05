import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  sender: {
    name: string;
    rank?: string;
    flair?: string;
  };
  content: string;
  timestamp: string;
  type: 'global' | 'private';
}

const MainChatroom: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: { 
        name: 'System',
        rank: 'Admin',
        flair: '⚡'
      },
      content: 'Welcome to Battle Arena!',
      timestamp: new Date().toISOString(),
      type: 'global'
    },
    {
      id: '2',
      sender: {
        name: 'Player1',
        rank: 'Warrior',
        flair: '⚔️'
      },
      content: 'Hello everyone!',
      timestamp: new Date().toISOString(),
      type: 'global'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: {
        name: 'You',
        rank: 'Novice',
        flair: '🌟'
      },
      content: inputMessage,
      timestamp: new Date().toISOString(),
      type: 'global'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Messages */}
      <div 
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        {messages.map((message) => (
          <div key={message.id} className="flex items-start space-x-2">
            <span className="text-gray-400 text-sm">
              {formatTime(message.timestamp)}
            </span>
            <div>
              <span className="mr-1">{message.sender.flair}</span>
              <span className={`font-semibold ${
                message.sender.rank === 'Admin' ? 'text-red-400' : 'text-blue-400'
              }`}>
                {message.sender.name}
              </span>
              <span className="text-gray-400 text-sm ml-1">
                [{message.sender.rank}]
              </span>
              <span className="ml-2 text-gray-100">
                {message.content}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form 
        onSubmit={handleSubmit}
        className="p-2 bg-gray-700 flex space-x-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 bg-gray-600 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MainChatroom;
