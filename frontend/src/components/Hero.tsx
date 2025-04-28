import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl text-papyrus-900 leading-tight mb-4">
          Extract Recipes <br className="sm:hidden" />
          <span className="text-papyrus-600">With A Single Click</span>
        </h2>
        
        <p className="font-serif text-lg sm:text-xl text-papyrus-700 max-w-2xl mx-auto leading-relaxed">
          Paste any recipe URL below and we'll transform it into a clean, formatted 
          recipe that's easy to read, save, and cook from.
        </p>
      </div>
    </section>
  );
};

export default Hero;