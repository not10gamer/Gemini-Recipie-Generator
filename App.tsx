import React, { useState, useCallback } from 'react';
import type { Recipe, Ingredient } from './types';
import { generateRecipes } from './services/geminiService';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import RecipeDisplay from './components/RecipeDisplay';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: 'Tomatoes', quantity: '3' }, 
    { name: 'Chicken Breast', quantity: '1 large' }, 
    { name: 'Garlic', quantity: '2 cloves' }
  ]);
  const [desiredDish, setDesiredDish] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [strictIngredients, setStrictIngredients] = useState<boolean>(false);

  const handleAddIngredient = (ingredient: Ingredient) => {
    if (ingredient.name && !ingredients.some(i => i.name.toLowerCase() === ingredient.name.toLowerCase())) {
      setIngredients(prev => [...prev, ingredient]);
    }
  };

  const handleRemoveIngredient = (ingredientNameToRemove: string) => {
    setIngredients(prev => prev.filter(i => i.name !== ingredientNameToRemove));
  };

  const handleGenerateRecipes = useCallback(async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const generatedRecipes = await generateRecipes(ingredients, desiredDish, strictIngredients);
      setRecipes(generatedRecipes);
    } catch (err) {
      console.error(err);
      setError('Sorry, we couldn\'t generate recipes at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [ingredients, desiredDish, strictIngredients]);

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200">
      <Header />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <IngredientInput
              ingredients={ingredients}
              onAddIngredient={handleAddIngredient}
              onRemoveIngredient={handleRemoveIngredient}
              onGenerate={handleGenerateRecipes}
              isLoading={isLoading}
              desiredDish={desiredDish}
              setDesiredDish={setDesiredDish}
              strictIngredients={strictIngredients}
              setStrictIngredients={setStrictIngredients}
            />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <RecipeDisplay
              recipes={recipes}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;