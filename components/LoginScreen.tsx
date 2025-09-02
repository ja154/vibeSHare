
import React, { useState } from 'react';
import { User } from '../types';

interface LoginScreenProps {
  users: User[];
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = users.find(user => user.name.toLowerCase() === username.toLowerCase().trim());
    if (foundUser) {
      // In a real app, passwords would be hashed. Here we do a simple string comparison.
      if (foundUser.password === password) {
        onLogin(foundUser);
      } else {
        setError('Incorrect password. Please try again.');
      }
    } else {
      setError(`User not found. Please check the username.`);
    }
  };

  const clearError = () => {
    if (error) setError('');
  }

  return (
    <div className="fixed inset-0 bg-primary-bg flex flex-col items-center justify-center z-50 p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white tracking-tighter mb-2">
          Welcome to Vibe<span className="text-neon-green">share</span>
        </h1>
        <p className="text-lg text-gray-400">Log in to start sharing your vibes.</p>
      </div>
      
      <div className="max-w-sm w-full">
        <form 
            onSubmit={handleLoginAttempt} 
            className="bg-card-bg border border-border-color rounded-2xl p-8 shadow-lg"
        >
            <div className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            clearError();
                        }}
                        placeholder="e.g. Alex Dev"
                        required
                        className="w-full bg-primary-bg border border-border-color rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-green focus:outline-none transition"
                        aria-describedby="error-message"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            clearError();
                        }}
                        placeholder="e.g. password1"
                        required
                        className="w-full bg-primary-bg border border-border-color rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-green focus:outline-none transition"
                        aria-describedby="error-message"
                    />
                </div>
                {error && (
                    <p id="error-message" className="text-sm text-red-400 -mt-2">
                        {error}
                    </p>
                )}
                <button
                    type="submit"
                    className="w-full bg-neon-green text-black font-bold px-6 py-3 rounded-lg transition-all hover:bg-white hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-neon-green"
                >
                    Login
                </button>
            </div>
        </form>
         <p className="text-xs text-center text-gray-500 mt-4">Hint: For any user, the password is 'password' + their ID number (e.g., 'password1').</p>
      </div>

       <footer className="absolute bottom-8 text-gray-600 text-sm">
        This is a simulated login experience. No data is stored or sent.
      </footer>
    </div>
  );
};

export default LoginScreen;
