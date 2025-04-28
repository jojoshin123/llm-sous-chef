import React, { useState } from 'react';
import { BookOpen, User } from 'lucide-react';
import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated, userName } = useAuth();

  return (
    <header className="py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BookOpen 
            size={32} 
            className="text-papyrus-800" 
            strokeWidth={1.5} 
          />
          <h1 className="text-2xl sm:text-3xl font-serif text-papyrus-800">
            LLM<span className="text-papyrus-600">Sous Chef</span>
          </h1>
        </div>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-2 font-serif text-papyrus-800">
            <User size={20} className="text-papyrus-600" />
            <span>{userName}</span>
          </div>
        ) : (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="font-serif px-4 py-2 rounded-lg bg-papyrus-800 text-white hover:bg-papyrus-900 transition-colors"
          >
            Login
          </button>
        )}
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
};

export default Header;