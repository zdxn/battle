import { Player } from '../types';

interface PlayerListProps {
  players: Player[];
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player | null) => void;
}

const PlayerList = ({ players, selectedPlayer, onSelectPlayer }: PlayerListProps) => {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Online Players</h2>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {players.length === 0 ? (
          <div className="text-gray-400 text-center">No other players online</div>
        ) : (
          players.map((player) => (
            <div
              key={player.id}
              className={`p-3 rounded cursor-pointer ${
                selectedPlayer?.id === player.id
                  ? 'bg-blue-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => onSelectPlayer(player)}
            >
              <div className="flex justify-between items-center">
                <span>{player.username}</span>
                <span className="text-sm">Level {player.level}</span>
              </div>
              <div className="text-sm text-gray-400">
                Wins: {player.stats.wins} / Losses: {player.stats.losses}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlayerList;
