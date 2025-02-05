import { useState } from 'react';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'weapon' | 'armor' | 'potion';
  stats: {
    attack?: number;
    defense?: number;
    health?: number;
    speed?: number;
  };
}

const STORE_ITEMS: StoreItem[] = [
  {
    id: '1',
    name: 'Steel Sword',
    description: 'A sharp and reliable weapon',
    price: 100,
    type: 'weapon',
    stats: { attack: 15 },
  },
  {
    id: '2',
    name: 'Chain Mail',
    description: 'Protective armor made of interlocking rings',
    price: 150,
    type: 'armor',
    stats: { defense: 12 },
  },
  {
    id: '3',
    name: 'Greater Health Potion',
    description: 'Restores 50 HP',
    price: 50,
    type: 'potion',
    stats: { health: 50 },
  },
];

const Store = () => {
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [gold] = useState(500); // This would come from the player's actual state

  const handlePurchase = (item: StoreItem) => {
    if (gold >= item.price) {
      // TODO: Implement actual purchase logic
      console.log(`Purchased ${item.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Store</h1>
          <div className="text-xl text-yellow-400">Gold: {gold}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STORE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700"
              onClick={() => setSelectedItem(item)}
            >
              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <p className="text-gray-400 mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">{item.price} gold</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePurchase(item);
                  }}
                  className={`px-4 py-2 rounded ${
                    gold >= item.price
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                  disabled={gold < item.price}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedItem.name}</h2>
            <p className="text-gray-400 mb-4">{selectedItem.description}</p>
            <div className="space-y-2 mb-4">
              {Object.entries(selectedItem.stats).map(([stat, value]) => (
                <div key={stat} className="flex justify-between">
                  <span className="capitalize">{stat}:</span>
                  <span>+{value}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => handlePurchase(selectedItem)}
                className={`px-4 py-2 rounded ${
                  gold >= selectedItem.price
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
                disabled={gold < selectedItem.price}
              >
                Buy for {selectedItem.price} gold
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
