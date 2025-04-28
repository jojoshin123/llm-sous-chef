import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 px-4 sm:px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="border-t border-papyrus-200 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="font-serif text-papyrus-600 text-sm mb-4 sm:mb-0">
            © {new Date().getFullYear()} RecipeParser. All rights reserved.
          </p>
          
          <div className="flex gap-4 items-center">
            <a 
              href="#" 
              className="text-papyrus-600 hover:text-papyrus-800 transition-colors"
              aria-label="GitHub Repository"
            >
              <Github size={20} />
            </a>
            
            <a 
              href="#" 
              className="font-serif text-papyrus-600 hover:text-papyrus-800 transition-colors text-sm"
            >
              Privacy
            </a>
            
            <a 
              href="#" 
              className="font-serif text-papyrus-600 hover:text-papyrus-800 transition-colors text-sm"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;