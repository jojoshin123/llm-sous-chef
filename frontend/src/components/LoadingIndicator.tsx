import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'Processing recipe...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
      <div className="w-12 h-12 relative">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-papyrus-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-papyrus-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      
      <p className="mt-4 font-serif text-papyrus-700 animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingIndicator;