import React, { useState } from 'react';
import { BookOpen, User } from 'lucide-react';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const { isAuthenticated, userName, loading } = useAuth();
  
  if (loading) {
    return <></>;
  }

  return (
    <header className="py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3 py-2 rounded-lg hover:scale-105 cursor-pointer transition-all">
          <BookOpen 
            size={32} 
            className="text-papyrus-800" 
            strokeWidth={1.5} 
          />
          <h1 className="text-2xl sm:text-3xl font-serif text-papyrus-800">
            <button onClick={() => navigate('/')}>
              LLM<span className="text-papyrus-600">Sous Chef</span>
            </button>
          </h1>
        </div>
        
        {isAuthenticated ? (
          <UserMenu userName={userName}/>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="font-serif px-4 py-2 rounded-lg bg-papyrus-800 text-white hover:bg-papyrus-900 cursor-pointer transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setIsSignupModalOpen(true)}
              className="font-serif px-4 py-2 rounded-lg bg-papyrus-800 text-white hover:bg-papyrus-900 cursor-pointer transition-colors"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <SignupModal 
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
    </header>
  );
};

export default Header;