import React, { useState } from 'react';
import type { Recipe } from '../types/recipe';
import { ExternalLink, Trash } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import { useNavigate } from 'react-router-dom';

interface RecipeViewProps {
  recipe: Recipe;
  cookbookId: string | undefined;
}

const RecipeView: React.FC<RecipeViewProps> = ({ recipe, cookbookId }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/recipes/delete-recipe`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'cookbook-id': cookbookId?.toString() ?? '',
          'recipe-id': recipe.recipe.id,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      navigate(`/cookbooks/${cookbookId}`);
    } catch (err) {
      setError('Error while deleting recipe. Please try again.');
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Ingredients Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
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
        <div className="w-full">
          <h1 className="text-3xl font-serif text-papyrus-800 mb-2">
            {recipe.recipe.title}
          </h1>

          <p className="text-md font-serif pb-1 text-papyrus-600 mb-4 break-all">
            <a
              href={recipe.recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-papyrus-400 transition-colors"
            >
              {recipe.recipe.url} <ExternalLink size={16} />
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

          {cookbookId && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowDeleteModal(true)}
                aria-label={`Delete ${recipe.recipe.title}`}
                className="inline-flex items-center gap-2 font-serif px-4 py-2 rounded-lg bg-papyrus-800 text-white hover:bg-red-500 cursor-pointer transition-colors"
              >
                Delete Recipe <Trash size={18} />
              </button>
            </div>
          )}

          {showDeleteModal && (
            <ConfirmationModal
              onClose={() => {
                setShowDeleteModal(false);
                handleDelete();
              }}
              onCancel={() => {
                setShowDeleteModal(false);
              }}
              titleText="Confirm Deletion"
              message="Are you sure you want to delete?"
              closeText="Confirm"
            />
          )}

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default RecipeView;
