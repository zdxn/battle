import React, { useState } from 'react';
import News from './Sections/News';
import Shop from './Sections/Shop';
import Training from './Sections/Training';
import Equipment from './Sections/Equipment';
import Settings from './Sections/Settings';
import Skills from './Sections/Skills';
import Combat from './Sections/Combat';

type Section = 'news' | 'shop' | 'training' | 'equipment' | 'settings' | 'skills' | 'combat';

const ReactiveWindow: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('news');

  const sections: { value: Section; label: string }[] = [
    { value: 'news', label: 'News' },
    { value: 'shop', label: 'Shop' },
    { value: 'training', label: 'Training' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'settings', label: 'Settings' },
    { value: 'skills', label: 'Skills' },
    { value: 'combat', label: 'Combat' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'news':
        return <News />;
      case 'shop':
        return <Shop />;
      case 'training':
        return <Training />;
      case 'equipment':
        return <Equipment />;
      case 'settings':
        return <Settings />;
      case 'skills':
        return <Skills />;
      case 'combat':
        return <Combat />;
      default:
        return <News />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Section Selector */}
      <div className="flex space-x-1 p-2 bg-gray-700">
        {sections.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveSection(value)}
            className={`px-3 py-1 rounded-t text-sm ${
              activeSection === value
                ? 'bg-gray-800 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-auto">
        {renderSection()}
      </div>
    </div>
  );
};

export default ReactiveWindow;
