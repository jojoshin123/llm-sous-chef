import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCookbooks } from '../pages/CookbooksPage';
import { CookbookType } from '../types/cookbook';
import { Check } from 'lucide-react';
import { Recipe } from '../types/recipe';
import AlertModal from '../components/AlertModal';

interface SelectCookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
}

const SelectCookbookModal: React.FC<SelectCookbookModalProps> = ({ isOpen, onClose, recipe }) => {
  const navigate = useNavigate();
  const [selectedCookbooks, setSelectedCookbooks] = useState<number[]>([]);
  const [cookbooks, setCookbooks] = useState<CookbookType[]>([]);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (!isOpen) return null;

  useEffect(() => {
    const fetchData = async () => {
      await fetchCookbooks(setCookbooks, setError);
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/recipes/add-recipe`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'cookbook-ids': selectedCookbooks.toString(),
        },
        body: JSON.stringify(recipe.recipe),
      });
      
      if (!response.ok) {
        throw new Error('Sign up failed');
      }
      console.log("Recipe added to cookbooks:", selectedCookbooks);
      setShowSuccessModal(true);
    } catch (err) {
      setError('Error adding recipe to cookbooks. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-serif mb-4">Select cookbooks:</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="max-h-64 overflow-y-auto mb-4">
          {cookbooks.map((cookbook) => (
            <label key={cookbook.id} className="flex items-center gap-3 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCookbooks.includes(cookbook.id)}
                onChange={() => {
                  setSelectedCookbooks((prev) =>
                    prev.includes(cookbook.id)
                      ? prev.filter((id) => id !== cookbook.id)
                      : [...prev, cookbook.id]
                  );
                }}
                className="hidden peer"
              />
              {/* Custom checkbox UI */}
              <div className="w-5 h-5 border-2 border-gray-400 rounded flex items-center justify-center peer-checked:bg-papyrus-600 transition-colors">
                <Check className="w-4 h-4 text-white peer-checked:opacity-100 transition-opacity duration-150" />
              </div>
               <span className="font-serif text-papyrus-700">{cookbook.name}</span>
            </label>
          ))}
        </div>
        {showSuccessModal && (
          <AlertModal
            onClose={() => {
              setShowSuccessModal(false);
              onClose();
              navigate('/cookbooks');
            }}
            titleText="Added successfully!"
            message={`Added recipes to: ${
              cookbooks.filter(item => selectedCookbooks.includes(item.id))
              .map(item => item.name)
              .join(', ')
              .replace(/^"|"$/g, '')
            }.`
            }
            closeText="View cookbooks"
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-papyrus-800 text-white rounded hover:bg-papyrus-900"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectCookbookModal;