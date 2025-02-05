import { useState } from 'react';

interface Stats {
  level: number;
  experience: number;
  health: number;
  attack: number;
  defense: number;
  speed: number;
}

const Character = () => {
  const [stats, setStats] = useState<Stats>({
    level: 1,
    experience: 0,
    health: 100,
    attack: 10,
    defense: 5,
    speed: 5,
  });

  const [inventory, setInventory] = useState<string[]>([
    'Basic Sword',
    'Leather Armor',
    'Health Potion',
  ]);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Your Character</h2>
      
      {/* Stats */}
      <div className="bg-gray-700 p-4 rounded mb-4">
        <h3 className="text-xl mb-2">Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Level:</span>
            <span>{stats.level}</span>
          </div>
          <div className="flex justify-between">
            <span>Experience:</span>
            <span>{stats.experience}/100</span>
          </div>
          <div className="flex justify-between">
            <span>Health:</span>
            <span>{stats.health}</span>
          </div>
          <div className="flex justify-between">
            <span>Attack:</span>
            <span>{stats.attack}</span>
          </div>
          <div className="flex justify-between">
            <span>Defense:</span>
            <span>{stats.defense}</span>
          </div>
          <div className="flex justify-between">
            <span>Speed:</span>
            <span>{stats.speed}</span>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-gray-700 p-4 rounded flex-1">
        <h3 className="text-xl mb-2">Inventory</h3>
        <div className="space-y-2">
          {inventory.map((item, index) => (
            <div
              key={index}
              className="bg-gray-600 p-2 rounded cursor-pointer hover:bg-gray-500"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Character;
