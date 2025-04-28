import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UrlForm from '../components/UrlForm';
import LoadingIndicator from '../components/LoadingIndicator';

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmitUrl = (url: string) => {
    setIsLoading(true);
    setMessage('');
    
    setTimeout(() => {
      setIsLoading(false);
      setMessage(`Successfully submitted URL: ${url}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-papyrus-50">
      <Header />
      
      <main className="flex-grow px-4 py-4 sm:py-8 flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 border border-papyrus-200 animate-slide-up">
            <UrlForm onSubmit={handleSubmitUrl} />
            
            {isLoading && <LoadingIndicator />}
            
            {message && (
              <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 font-serif animate-fade-in">
                {message}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;