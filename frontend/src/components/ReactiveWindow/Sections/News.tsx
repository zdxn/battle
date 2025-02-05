import React from 'react';

interface NewsItem {
  id: number;
  date: string;
  title: string;
  content: string;
  type: 'update' | 'announcement' | 'event';
}

const News: React.FC = () => {
  const newsItems: NewsItem[] = [
    {
      id: 1,
      date: '2025-02-05',
      title: 'New Combat System Released!',
      content: 'We\'ve updated the combat system with new abilities and status effects.',
      type: 'update'
    },
    {
      id: 2,
      date: '2025-02-03',
      title: 'Weekend Event: Double XP',
      content: 'Earn double experience points this weekend in all battles!',
      type: 'event'
    },
    {
      id: 3,
      date: '2025-02-01',
      title: 'Server Maintenance',
      content: 'Scheduled maintenance on February 7th, 2025, from 2-4 AM EST.',
      type: 'announcement'
    }
  ];

  const getTypeStyle = (type: NewsItem['type']) => {
    switch (type) {
      case 'update':
        return 'bg-blue-500';
      case 'event':
        return 'bg-green-500';
      case 'announcement':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Latest News</h2>
      
      {newsItems.map((item) => (
        <div 
          key={item.id}
          className="bg-gray-700 rounded-lg p-4"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <span className={`${getTypeStyle(item.type)} px-2 py-1 rounded text-xs mr-2`}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </span>
              <h3 className="text-lg font-semibold">{item.title}</h3>
            </div>
            <span className="text-sm text-gray-400">{item.date}</span>
          </div>
          <p className="text-gray-300">{item.content}</p>
        </div>
      ))}
    </div>
  );
};

export default News;
