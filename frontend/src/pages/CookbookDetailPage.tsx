import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Users, ChevronRight, Plus, Forward } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { Recipe } from '../types/recipe';
import UserSelectModal from '../components/UserSelectModal';

const CookbookDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cookbookName, setCookbookName] = useState<String>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  
  useEffect(() => {
      const fetchData = async () => {
          const token = localStorage.getItem('token');
          try {
            const response = await fetch('http://127.0.0.1:5000/recipes/get-recipes',{
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'cookbook-id' : id!
                  },
                });
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            setRecipes(result["recipes"]);

            setCookbookName(result["name"]);
            
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
          }
        };
      fetchData();
    }, []);

    if (error) {
      return <div>Error: {error}</div>;
    }
    if (!recipes) {
      return <></>;
    }

  return (
    <div className="min-h-screen flex flex-col bg-papyrus-50">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Link
              to="/cookbooks"
              className="inline-flex items-center text-papyrus-600 hover:text-papyrus-800 font-serif"
            >
              <ChevronLeft size={20} />
              Back to Cookbooks
            </Link>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-papyrus-800 text-white rounded-lg hover:bg-papyrus-900 transition-colors font-serif"
              >
                <Plus size={20} />
                Add Recipe
              </button>
              <button 
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-papyrus-800 text-white rounded-lg hover:bg-papyrus-900 transition-colors font-serif"
              >
                <Forward size={20} />
                Share
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-serif text-papyrus-800 text-center pb-4">{cookbookName}</h1>

          <div className="space-y-4">
            {
              recipes.length === 0 
              ? <h4 className="text-center text-papyrus-600 font-serif italic">No recipes in this cookbook yet!</h4>
              :
              recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => navigate(`/cookbooks/${id}/recipes/${recipe.id}`, { state: { recipe } })}
                  className="bg-white p-6 rounded-lg border border-papyrus-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      <h2 className="text-xl font-serif text-papyrus-800 mb-2 group-hover:text-papyrus-600 transition-colors">
                        {recipe.title}
                      </h2>
                      <p className="text-papyrus-600 font-serif line-clamp-2">
                        {recipe.description}
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-papyrus-400 group-hover:text-papyrus-600 transition-colors" />
                  </div>
                  <div className="flex items-center gap-6 mt-4 text-papyrus-600">
                    <div className="flex items-center gap-2">
                      <Clock size={18} />
                      <span className="font-serif">{recipe.cook_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={18} />
                      {/* TODO: Add servings into backend*/}
                      <span className="font-serif">Serves {recipe.servings}</span>
                    </div>
                  </div>
                </div>
              ))}
              {showShareModal && (
                <UserSelectModal 
                  onClose={() => setShowShareModal(false)}
                  onCancel={() => setShowShareModal(false)}
                  cookbookId={id!}
                />
              )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CookbookDetailPage;