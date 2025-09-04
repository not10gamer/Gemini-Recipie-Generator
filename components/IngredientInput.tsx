import React, { useState } from 'react';
import type { Ingredient } from '../types';
import { PlusIcon, TrashIcon, SparklesIcon } from './icons';

interface IngredientInputProps {
  ingredients: Ingredient[];
  onAddIngredient: (ingredient: Ingredient) => void;
  onRemoveIngredient: (ingredientName: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  desiredDish: string;
  setDesiredDish: (dish: string) => void;
  strictIngredients: boolean;
  setStrictIngredients: (strict: boolean) => void;
}

const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onGenerate,
  isLoading,
  desiredDish,
  setDesiredDish,
  strictIngredients,
  setStrictIngredients
}) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAdd = () => {
    if (name.trim()) {
      onAddIngredient({ name: name.trim(), quantity: quantity.trim() });
      setName('');
      setQuantity('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">My Kitchen</h2>
      
      <div className="mb-4">
        <label htmlFor="ingredient-name" className="block text-sm font-medium text-gray-400 mb-1">Ingredient</label>
        <div className="flex gap-2">
          <input
            id="ingredient-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Chicken"
            className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition w-3/5"
          />
           <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Quantity"
            className="p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition w-2/5"
          />
          <button
            onClick={handleAdd}
            className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 flex-shrink-0"
            aria-label="Add ingredient"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
      </div>


      <div className="flex-grow space-y-2 overflow-y-auto pr-2 mb-4">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.name}
            className="flex justify-between items-center bg-emerald-900/60 text-emerald-300 p-2 rounded-lg animate-fade-in"
          >
            <div className="flex flex-col">
                <span className="font-medium">{ingredient.name}</span>
                {ingredient.quantity && <span className="text-xs text-emerald-400/80">{ingredient.quantity}</span>}
            </div>
            <button
              onClick={() => onRemoveIngredient(ingredient.name)}
              className="text-emerald-400 hover:text-red-400 transition-colors"
              aria-label={`Remove ${ingredient.name}`}
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
        {ingredients.length === 0 && (
            <p className="text-gray-500 text-center py-4">Add some ingredients to get started!</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="dish-type" className="block text-sm font-medium text-gray-400 mb-1">Desired Dish (Optional)</label>
        <input
            id="dish-type"
            type="text"
            value={desiredDish}
            onChange={(e) => setDesiredDish(e.target.value)}
            placeholder="e.g., a healthy soup"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
          />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">Ingredient Flexibility</label>
        <div
          className="flex items-center justify-between p-2 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
          onClick={() => setStrictIngredients(!strictIngredients)}
        >
          <div className="text-sm">
            <p className="font-semibold text-white">{strictIngredients ? "Use Only These Ingredients" : "Include Pantry Staples"}</p>
            <p className="text-gray-400">{strictIngredients ? "Don't add other items" : "Allows for oil, spices, etc."}</p>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={strictIngredients}
              onChange={() => setStrictIngredients(!strictIngredients)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </div>
        </div>
      </div>


      <button
        onClick={onGenerate}
        disabled={isLoading || ingredients.length === 0}
        className="mt-auto w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-orange-900/20"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Recipes & Images...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            Generate Recipes
          </>
        )}
      </button>
    </div>
  );
};

export default IngredientInput;