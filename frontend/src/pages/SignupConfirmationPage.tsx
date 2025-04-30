import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const SignupConfirmationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-papyrus-50">
      <Header />
      
      <main className="flex-grow px-4 py-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Sign up successful!
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            You can now start cooking!
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Go back to Homepage
          </button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignupConfirmationPage;