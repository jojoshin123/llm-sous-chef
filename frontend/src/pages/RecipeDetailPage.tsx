import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RecipeView from '../components/RecipeView';
import type { Recipe } from '../types/recipe';

const RecipeDetailPage: React.FC = () => {
  const { cookbookId, recipeId } = useParams();

  // Mock data - replace with actual data fetching
  const recipe: Recipe = {
    id: recipeId!,
    recipe: {
      title: "Classic Spaghetti Carbonara",
      description: "A traditional Roman pasta dish made with eggs, hard cheese, cured pork, and black pepper. Simple yet delicious, this dish comes together in minutes.",
      ingredients: [
        "400g spaghetti",
        "200g guanciale or pancetta, diced",
        "4 large eggs",
        "100g Pecorino Romano, grated",
        "100g Parmigiano Reggiano, grated",
        "2 tsp freshly ground black pepper",
        "Salt to taste"
      ],
      instructions: [
        "Bring a large pot of salted water to boil. Add spaghetti and cook until al dente.",
        "While pasta cooks, whisk eggs in a bowl. Add grated cheeses and black pepper. Mix well.",
        "In a large pan, cook guanciale over medium heat until crispy. Remove from heat.",
        "Reserve 1 cup pasta water, then drain pasta.",
        "Working quickly, add pasta to pan with guanciale. Toss well.",
        "Add egg mixture, stirring quickly to coat pasta. Add pasta water as needed.",
        "Serve immediately with extra cheese and black pepper."
      ],
      url: ""
    }
  };

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