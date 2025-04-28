import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CookbooksPage: React.FC = () => {
  const navigate = useNavigate();
  const [cookbooks, setCookbooks] = useState(null);
  const [error, setError] = useState(null);
  
  // Mock data - replace with actual data fetching
  useEffect(() => {
    // Define an async function inside useEffect
    const fetchData = async () => {
        const token = localStorage.getItem('token');
        console.log()
        try {
          const response = await fetch('http://127.0.0.1:5000/recipes/get-cookbooks',{
              method: 'GET',
              headers: {
                  'Authorization': 'Bearer ' + token,
                },
              });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result = await response.json();
          setCookbooks(result); // Save the data into state
        } catch (err) {
          setError(err.message); // Save the error if any
        }
      };
    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!cookbooks) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-papyrus-50">
      <Header />
      
      <main className="flex-grow px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-serif text-papyrus-800">My Cookbooks</h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-papyrus-800 text-white rounded-lg hover:bg-papyrus-900 transition-colors font-serif">
              <Plus size={20} />
              New Cookbook
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cookbooks.map((cookbook) => (
              <div
                key={cookbook.id}
                onClick={() => navigate(`/cookbooks/${cookbook.id}`)}
                className="bg-white p-6 rounded-lg border border-papyrus-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <BookOpen size={24} className="text-papyrus-600" />
                  <span className="text-sm text-papyrus-600 font-serif">
                    {cookbook.recipeCount} recipes
                  </span>
                </div>
                <h2 className="text-xl font-serif text-papyrus-800">{cookbook.name}</h2>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CookbooksPage;