import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import CookbooksPage from './pages/CookbooksPage';
import CookbookDetailPage from './pages/CookbookDetailPage';
import RecipeDetailPage from './pages/RecipeDetailPage';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/" />;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/cookbooks" /> : <HomePage />} 
      />
      <Route 
        path="/cookbooks" 
        element={<ProtectedRoute element={<CookbooksPage />} />} 
      />
      <Route 
        path="/cookbooks/:id" 
        element={<ProtectedRoute element={<CookbookDetailPage />} />} 
      />
      <Route 
        path="/cookbooks/:cookbookId/recipes/:recipeId" 
        element={<ProtectedRoute element={<RecipeDetailPage />} />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;