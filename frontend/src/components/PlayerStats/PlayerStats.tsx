import React from 'react';

interface PlayerStatsProps {}

const PlayerStats: React.FC<PlayerStatsProps> = () => {
  // This would be fetched from your game state/context
  const playerData = {
    name: 'Player1',
    level: 10,
    experience: 1500,
    nextLevel: 2000,
    gold: 1250,
    stats: {
      strength: 15,
      dexterity: 12,
      intelligence: 8,
      vitality: 10
    },
    combat: {
      wins: 25,
      losses: 10,
      winRate: '71.4%'
    },
    titles: ['Novice Warrior', 'Beast Slayer'],
    activeTitle: 'Novice Warrior'
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{playerData.name}</h2>
        <span className="text-yellow-500">{playerData.activeTitle}</span>
      </div>

      {/* Level and Experience */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span>Level {playerData.level}</span>
          <span>{playerData.experience}/{playerData.nextLevel} XP</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 rounded-full h-2" 
            style={{ width: `${(playerData.experience / playerData.nextLevel) * 100}%` }}
          />
        </div>
      </div>

      {/* Gold */}
      <div className="mb-4">
        <span className="text-yellow-400">
          {playerData.gold} Gold
        </span>
      </div>

      {/* Combat Stats */}
      <div className="mb-4">
        <h3 className="text-lg mb-2">Combat Record</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-green-500">{playerData.combat.wins}</div>
            <div className="text-sm">Wins</div>
          </div>
          <div className="text-center">
            <div className="text-red-500">{playerData.combat.losses}</div>
            <div className="text-sm">Losses</div>
          </div>
          <div className="text-center">
            <div className="text-blue-500">{playerData.combat.winRate}</div>
            <div className="text-sm">Win Rate</div>
          </div>
        </div>
      </div>

      {/* Character Stats */}
      <div className="mb-4">
        <h3 className="text-lg mb-2">Stats</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>STR: {playerData.stats.strength}</div>
          <div>DEX: {playerData.stats.dexterity}</div>
          <div>INT: {playerData.stats.intelligence}</div>
          <div>VIT: {playerData.stats.vitality}</div>
        </div>
      </div>

      {/* Titles */}
      <div className="mt-auto">
        <h3 className="text-lg mb-2">Available Titles</h3>
        <div className="flex flex-wrap gap-2">
          {playerData.titles.map((title) => (
            <span 
              key={title}
              className={`px-2 py-1 rounded text-sm ${
                title === playerData.activeTitle 
                  ? 'bg-blue-600' 
                  : 'bg-gray-700'
              }`}
            >
              {title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
