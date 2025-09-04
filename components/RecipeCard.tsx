import React, { useState } from 'react';
import type { Recipe } from '../types';
import { ExternalLinkIcon, ClockIcon, FireIcon, ChevronDownIcon } from './icons';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, index }) => {
  const [ingredientsOpen, setIngredientsOpen] = useState(index === 0);
  const [instructionsOpen, setInstructionsOpen] = useState(index === 0);

  // Generate unique IDs for ARIA attributes
  const ingredientsId = `ingredients-panel-${index}`;
  const instructionsId = `instructions-panel-${index}`;
  
  const imageUrl = recipe.imageBase64
    ? `data:image/jpeg;base64,${recipe.imageBase64}`
    : `https://picsum.photos/seed/${recipe.recipeName.replace(/\s/g, '')}/800/450`;


  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-900/20">
      <div>
        <img
          src={imageUrl}
          alt={recipe.recipeName}
          className="h-56 w-full object-cover"
        />
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-100 mb-2">{recipe.recipeName}</h3>
          <p className="text-gray-400 mb-4">{recipe.description}</p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-400 mb-6">
            <div className="flex items-center gap-2" title="Estimated cooking time">
              <ClockIcon className="w-5 h-5 text-yellow-500" />
              <span>{recipe.timeTaken}</span>
            </div>
            <div className="flex items-center gap-2" title="Estimated calories per serving">
              <FireIcon className="w-5 h-5 text-red-500" />
              <span>{recipe.calories}</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Ingredients Accordion */}
            <div>
              <button
                onClick={() => setIngredientsOpen(!ingredientsOpen)}
                aria-expanded={ingredientsOpen}
                aria-controls={ingredientsId}
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-emerald-400 border-b-2 border-emerald-800/50 pb-1 transition-colors hover:text-emerald-300"
              >
                <span>Ingredients</span>
                <ChevronDownIcon className={`w-6 h-6 transform transition-transform duration-300 ${ingredientsOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                id={ingredientsId}
                className={`transition-all duration-500 ease-in-out grid ${ingredientsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                    <ul className="list-disc list-inside space-y-1 text-gray-300 pt-3">
                    {recipe.ingredients.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                    </ul>
                </div>
              </div>
            </div>

            {/* Instructions Accordion */}
            <div>
               <button
                onClick={() => setInstructionsOpen(!instructionsOpen)}
                aria-expanded={instructionsOpen}
                aria-controls={instructionsId}
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-orange-400 border-b-2 border-orange-800/50 pb-1 transition-colors hover:text-orange-300"
              >
                <span>Instructions</span>
                <ChevronDownIcon className={`w-6 h-6 transform transition-transform duration-300 ${instructionsOpen ? 'rotate-180' : ''}`} />
              </button>
              <div
                id={instructionsId}
                className={`transition-all duration-500 ease-in-out grid ${instructionsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                    <ol className="list-decimal list-inside space-y-2 text-gray-300 pt-3">
                    {recipe.instructions.map((step, i) => (
                        <li key={i}>{step}</li>
                    ))}
                    </ol>
                </div>
              </div>
            </div>
          </div>
          
          {recipe.sourceLinks && recipe.sourceLinks.length > 0 && (
            <div className="mt-8 pt-4 border-t border-gray-700">
              <h4 className="text-lg font-semibold text-sky-400 mb-3">Sources & Further Reading</h4>
              <ul className="space-y-2">
                {recipe.sourceLinks.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sky-300 hover:text-sky-200 hover:underline transition-colors group"
                    >
                      <ExternalLinkIcon className="w-4 h-4 flex-shrink-0 text-sky-400 group-hover:text-sky-300 transition-colors" />
                      <span>{link.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;