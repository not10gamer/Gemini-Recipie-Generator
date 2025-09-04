import React from 'react';
import { ChefHatIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-gray-900/70 backdrop-blur-lg border-b border-gray-700/50">
      <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center gap-4">
        <div className="text-orange-500">
          <ChefHatIcon className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100 tracking-tight">
            Gemini Recipe Genius
          </h1>
          <p className="text-sm text-gray-400">
            Turn your ingredients into delicious meals.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;