import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NewCookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewCookbookModal: React.FC<NewCookbookModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [cookbookName, setCookbookName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating new cookbook:", cookbookName);
    
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/recipes/create-cookbook`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'cookbook-name': cookbookName,
        },
      });
      
      if (!response.ok) {
        throw new Error('Error creating new cookbook');
      }
      const data = await response.json();
      const cookbookId = data['cookbook_id'];

      navigate(`/cookbooks/${cookbookId}`);
    } catch (err) {
      setError('Error creating new cookbook. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-serif text-papyrus-800 mb-4">Create New Cookbook</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={cookbookName}
            onChange={(e) => setCookbookName(e.target.value)}
            placeholder="Enter cookbook name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-papyrus-500"
          />
          {error && (
            <p className="mt-2 text-red-600 text-sm animate-fade-in">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="submit"
              className="px-4 py-2 bg-papyrus-800 text-white rounded hover:bg-papyrus-900 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCookbookModal;