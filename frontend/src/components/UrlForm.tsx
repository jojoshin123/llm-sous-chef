import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AlertModal from './AlertModal';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../types/recipe';

interface UrlFormProps {
  onSubmit: (url: string) => void;
}

const UrlForm: React.FC<UrlFormProps> = () => {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!isAuthenticated) {
      
      setAuthError('You must be logged in to submit a URL');
      return;
    }
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    
    try {
      new URL(url); // Will throw if invalid URL
      setError('');
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      console.log("Processing recipe URL:", url);      

      const response = await fetch('http://127.0.0.1:5000/recipes/process', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
          'url': url,
        },
      });

      if (!response.ok) {
        setIsSubmitting(false);
        setError('Failed to submit URL. Please try again.');
        return;
      }

      const recipe: Recipe = await response.json();
      setIsSubmitting(false);
      navigate(`/recipes/new?url=${encodeURIComponent(url)}`, { state: { recipe } });
    } catch (err) {
      setError('Please enter a valid URL');
    }
  };

  return (
    <>
      <form 
        className="w-full max-w-xl mx-auto mt-8" 
        onSubmit={handleSubmit}
      >
        <div className="relative">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a recipe URL..."
            className={`
              w-full px-5 py-4 pr-12
              font-serif text-lg
              bg-papyrus-50 
              border-2 border-papyrus-300
              focus:border-papyrus-500 focus:ring-0
              transition-all duration-300
              rounded-lg
              placeholder-papyrus-500
              text-ink-800
              ${error ? 'border-red-500' : ''}
            `}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              absolute right-3 top-1/2 transform -translate-y-1/2
              p-2 rounded-full
              text-papyrus-50
              bg-papyrus-800 hover:bg-papyrus-900
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              ${isSubmitting ? 'animate-pulse' : ''}
            `}
            aria-label="Submit URL"
          >
            <Send size={20} />
          </button>
        </div>
        
        {error && (
          <p className="mt-2 text-red-600 text-sm animate-fade-in">
            {error}
          </p>
        )}
        {isSubmitting && (
          <div className="flex justify-center items-center my-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-papyrus-300 border-t-transparent"></div>
          </div>
        )}
        
        <p className="mt-3 text-papyrus-700 text-sm text-center italic">
          Enter any recipe URL to extract ingredients and instructions
        </p>
      </form>
      
      <AlertModal message={authError} titleText={"Error"} closeText={"Close"} onClose={() => setAuthError('')} />
    </>
  );
};

export default UrlForm;