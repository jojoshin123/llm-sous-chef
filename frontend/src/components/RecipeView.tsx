import React from 'react';
import type { Recipe } from '../types/recipe';
import { ExternalLink } from 'lucide-react';

interface RecipeViewProps {
  recipe: Recipe;
}

const RecipeView: React.FC<RecipeViewProps> = ({ recipe }) => {
  return (
    <div className="flex gap-8">
      {/* Ingredients Sidebar */}
      <div className="w-80 shrink-0">
        <div className="bg-white p-6 rounded-lg border border-papyrus-200 shadow-sm sticky top-4">
          <h2 className="text-xl font-serif text-papyrus-800 mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.recipe.ingredients.map((ingredient, index) => (
              <li 
                key={index}
                className="font-serif text-papyrus-700 flex items-start gap-2"
              >
                <span className="block w-2 h-2 mt-2 rounded-full bg-papyrus-400 shrink-0" />
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        <h1 className="text-3xl font-serif text-papyrus-800">
          {recipe.recipe.title}
        </h1>

        <p className="text-md font-serif py-4 text-papyrus-600 mb-4">
          <a 
            href={recipe.recipe.url}
            target="_blank"
            rel="noopener noreferrer"
            className='inline-flex items-center gap-2 hover:text-papyrus-200 transition-colors'>
            {recipe.recipe.url} <ExternalLink size={16}/>
          </a>
        </p>
        
        <p className="text-lg font-serif text-papyrus-600 mb-8">
          {recipe.recipe.description}
        </p>
        
        

        <div className="bg-white p-6 rounded-lg border border-papyrus-200 shadow-sm">
          <h2 className="text-xl font-serif text-papyrus-800 mb-4">Instructions</h2>
          <ol className="space-y-4">
            {recipe.recipe.instructions.map((instruction, index) => (
              <li 
                key={index}
                className="font-serif text-papyrus-700 flex gap-4"
              >
                <span className="font-serif text-papyrus-500 shrink-0">
                  {index + 1}.
                </span>
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeView;