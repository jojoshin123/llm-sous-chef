import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');

    // Validations
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }
    if (password !== passwordConf) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'username': username,
          'email': email,
          'password': password,
        }
      });
      
      if (!response.ok) {
        throw new Error('Sign up failed');
      }

      navigate('/signup-confirmation');
      
    } catch (err) {
      setError('Sign up failed. Please change your username or email and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-papyrus-600 hover:text-papyrus-800"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-serif text-papyrus-800 mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-serif text-papyrus-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="identifier"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-papyrus-300 focus:border-papyrus-500 focus:ring-0"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block font-serif text-papyrus-700 mb-2">
              Email
            </label>
            <input
              type="text"
              id="identifier"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-papyrus-300 focus:border-papyrus-500 focus:ring-0"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block font-serif text-papyrus-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-papyrus-300 focus:border-papyrus-500 focus:ring-0"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="passwordConf" className="block font-serif text-papyrus-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="passwordConf"
              value={passwordConf}
              onChange={(e) => setPasswordConf(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-papyrus-300 focus:border-papyrus-500 focus:ring-0"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-papyrus-800 text-white py-2 px-4 rounded-lg hover:bg-papyrus-900 transition-colors font-serif disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;