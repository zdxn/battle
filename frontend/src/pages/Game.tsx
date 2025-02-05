import { useState, useEffect } from 'react';
import PlayerList from '../components/PlayerList';
import Chat from '../components/Chat';
import Character from '../components/Character';
import { Player } from '../types';

const Game = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    // TODO: Connect to WebSocket and fetch initial game state
  }, []);

  const handleChallenge = (player: Player) => {
    // TODO: Implement duel challenge system
    console.log(`Challenging player: ${player.username}`);
  };

  return (
    <div className="flex h-screen">
      {/* Left sidebar - Character info */}
      <div className="w-1/4 bg-gray-800 p-4">
        <Character />
      </div>

      {/* Main content - Game area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-gray-700 p-4">
          {selectedPlayer ? (
            <div className="text-center">
              <h2 className="text-2xl mb-4">Challenge {selectedPlayer.username}?</h2>
              <button
                onClick={() => handleChallenge(selectedPlayer)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Start Duel
              </button>
            </div>
          ) : (
            <div className="text-center text-xl">
              Select a player to challenge or explore the world
            </div>
          )}
        </div>
        <Chat />
      </div>

      {/* Right sidebar - Player list */}
      <div className="w-1/4 bg-gray-800 p-4">
        <PlayerList
          players={players}
          onSelectPlayer={setSelectedPlayer}
          selectedPlayer={selectedPlayer}
        />
      </div>
    </div>
  );
};

export default Game;
