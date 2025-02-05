import React from 'react';
import PlayerStats from '../PlayerStats/PlayerStats';
import ReactiveWindow from '../ReactiveWindow/ReactiveWindow';
import MainChatroom from '../Chat/MainChatroom';
import CombatChat from '../Chat/CombatChat';

const MainLayout: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-gray-900 text-white p-4">
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-full">
        {/* Player Stats - Top Left */}
        <div className="col-span-2 row-span-1 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <PlayerStats />
        </div>

        {/* Reactive Window - Top Right */}
        <div className="col-span-2 row-span-1 bg-gray-800 rounded-lg border border-gray-700">
          <ReactiveWindow />
        </div>

        {/* Main Chatroom - Bottom Left */}
        <div className="col-span-2 row-span-1 bg-gray-800 rounded-lg border border-gray-700">
          <MainChatroom />
        </div>

        {/* Combat Chat - Bottom Right */}
        <div className="col-span-2 row-span-1 bg-gray-800 rounded-lg border border-gray-700">
          <CombatChat />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
