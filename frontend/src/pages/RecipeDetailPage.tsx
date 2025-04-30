import React, { useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RecipeView from '../components/RecipeView';
import SelectCookbookModal from '../components/SelectCookbookModal';

const RecipeDetailPage: React.FC = () => {
  const [showCookbookModal, setShowCookbookModal] = useState(false);
  const { cookbookId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch recipe from navigate state
  const recipe = location.state;

  return (
    <div className="min-h-screen flex flex-col bg-papyrus-50">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex justify-between">
            <Link
              to={`/cookbooks/${cookbookId}`}
              className="inline-flex items-center text-papyrus-600 hover:text-papyrus-800 font-serif"
            >
              <ChevronLeft size={20} />
              Back to Cookbook
            </Link>
            <button
              onClick={() => setShowCookbookModal(true)}
              className="flex items-center gap-2 font-serif px-4 py-2 rounded-lg bg-papyrus-800 text-white hover:bg-papyrus-900 cursor-pointer transition-colors"
            >
              <Plus size={20} />
              Add to cookbook
            </button>
            {showCookbookModal && (
                <SelectCookbookModal 
                  isOpen={showCookbookModal} 
                  onClose={() => setShowCookbookModal(false)}
                  recipe={recipe}
                />
            )}
          </div>
          

          <RecipeView recipe={recipe} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipeDetailPage;