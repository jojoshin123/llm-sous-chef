import React, { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RecipeView from '../components/RecipeView';

const RecipeDetailPage: React.FC = () => {
  const { cookbookId } = useParams();
  const location = useLocation();

  // Fetch recipe from navigate state
  const recipe = location.state;

  return (
    <div className="min-h-screen flex flex-col bg-papyrus-50">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              to={`/cookbooks/${cookbookId}`}
              className="inline-flex items-center text-papyrus-600 hover:text-papyrus-800 font-serif"
            >
              <ChevronLeft size={20} />
              Back to Cookbook
            </Link>
          </div>

          <RecipeView recipe={recipe} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeDetailPage;