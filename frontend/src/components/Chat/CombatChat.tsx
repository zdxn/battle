import React, { useRef, useEffect } from 'react';

interface CombatMessage {
  id: string;
  type: 'attack' | 'defense' | 'status' | 'loot' | 'experience';
  content: string;
  timestamp: string;
}

const CombatChat: React.FC = () => {
  const combatLog: CombatMessage[] = [
    {
      id: '1',
      type: 'attack',
      content: 'You strike the enemy for 25 damage!',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      type: 'defense',
      content: 'Enemy blocks your attack, reducing damage by 5',
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      type: 'status',
      content: 'You are bleeding! (-2 HP per turn)',
      timestamp: new Date().toISOString()
    },
    {
      id: '4',
      type: 'loot',
      content: 'You found a Rare Sword! (+10 Attack)',
      timestamp: new Date().toISOString()
    },
    {
      id: '5',
      type: 'experience',
      content: 'You gained 100 XP!',
      timestamp: new Date().toISOString()
    }
  ];

  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [combatLog]);

  const getMessageStyle = (type: CombatMessage['type']) => {
    switch (type) {
      case 'attack':
        return 'text-red-400';
      case 'defense':
        return 'text-blue-400';
      case 'status':
        return 'text-yellow-400';
      case 'loot':
        return 'text-purple-400';
      case 'experience':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-700 px-4 py-2">
        <h2 className="text-lg font-semibold">Combat Log</h2>
      </div>
      
      {/* Combat Messages */}
      <div 
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto p-4 space-y-1"
      >
        {combatLog.map((message) => (
          <div key={message.id} className="flex items-start space-x-2">
            <span className="text-gray-500 text-xs">
              {formatTime(message.timestamp)}
            </span>
            <span className={getMessageStyle(message.type)}>
              {message.content}
            </span>
          </div>
        ))}
      </div>

      {/* Combat Input (if needed) */}
      <div className="p-2 bg-gray-700 flex space-x-2">
        <input
          type="text"
          className="flex-1 bg-gray-600 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Combat commands..."
          disabled
        />
        <button
          className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled
        >
          Attack
        </button>
      </div>
    </div>
  );
};

export default CombatChat;
