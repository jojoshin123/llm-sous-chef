import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Users, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { Recipe } from '../types/recipe';

const CookbookDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock data - replace with actual data fetching
  const cookbook = {
    id,
    name: 'Weeknight Dinners',
    recipes: [
      {
        id: "1",
        recipe: {
          title: "Classic Spaghetti Carbonara",
          description: "A traditional Roman pasta dish made with eggs, hard cheese, cured pork, and black pepper.",
          cookTime: "30 mins",
          servings: 4,
          ingredients: [],
          instructions: [],
          url: ""
        }
      },
      {
        id: "2",
        recipe: {
          title: "Chicken Stir Fry",
          description: "Quick and healthy stir-fried chicken with colorful vegetables in a savory sauce.",
          cookTime: "25 mins",
          servings: 4,
          ingredients: [],
          instructions: [],
          url: ""
        }
      }
    ] as Recipe[]
  };

  return (
    <div className="min-h-screen flex flex-col bg-papyrus-50">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              to="/cookbooks"
              className="inline-flex items-center text-papyrus-600 hover:text-papyrus-800 font-serif"
            >
              <ChevronLeft size={20} />
              Back to Cookbooks
            </Link>
          </div>

          <h1 className="text-3xl font-serif text-papyrus-800 mb-8">{cookbook.name}</h1>

          <div className="space-y-4">
            {cookbook.recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => navigate(`/cookbooks/${id}/recipes/${recipe.id}`)}
                className="bg-white p-6 rounded-lg border border-papyrus-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-grow">
                    <h2 className="text-xl font-serif text-papyrus-800 mb-2 group-hover:text-papyrus-600 transition-colors">
                      {recipe.recipe.title}
                    </h2>
                    <p className="text-papyrus-600 font-serif line-clamp-2">
                      {recipe.recipe.description}
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-papyrus-400 group-hover:text-papyrus-600 transition-colors" />
                </div>
                <div className="flex items-center gap-6 mt-4 text-papyrus-600">
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span className="font-serif">{recipe.recipe.cookTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={18} />
                    <span className="font-serif">Serves {recipe.recipe.servings}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CookbookDetailPage;