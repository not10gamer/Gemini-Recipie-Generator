import React from 'react';
import type { Recipe } from '../types';
import RecipeCard from './RecipeCard';
import { ChefHatIcon } from './icons';

interface RecipeDisplayProps {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 animate-pulse">
        <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
    </div>
)

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipes, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-red-900/50 text-red-300 p-8 rounded-xl border border-red-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold">Oops! Something went wrong.</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full bg-gray-800/50 border-2 border-dashed border-gray-700 p-8 rounded-xl">
        <ChefHatIcon className="w-24 h-24 text-gray-600 mb-4" />
        <h3 className="text-2xl font-semibold text-gray-300">Your Recipe Book is Empty</h3>
        <p className="text-gray-500 mt-2 max-w-md">Add some ingredients and let us whip up something magical for you!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {recipes.map((recipe, index) => (
        <RecipeCard key={recipe.recipeName + index} recipe={recipe} index={index} />
      ))}
    </div>
  );
};

export default RecipeDisplay;