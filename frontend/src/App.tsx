import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import CookbooksPage from './pages/CookbooksPage';
import CookbookDetailPage from './pages/CookbookDetailPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import SignupConfirmation from './pages/SignupConfirmationPage';

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <></>;
  }
  return isAuthenticated ? element : <Navigate to="/" />;
};

function AppRoutes() {
  
  return (
    <Routes>
      <Route 
        path="/" 
        element={<HomePage />} 
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
      <Route 
        path="/recipes/new" 
        element={<ProtectedRoute element={<RecipeDetailPage />} />} 
      />
      <Route 
        path="/signup-confirmation" 
        element={<SignupConfirmation />}
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