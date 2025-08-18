
import React from 'react';
import { User } from '../types';

interface LoginScreenProps {
  users: User[];
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin }) => {
  return (
    <div className="fixed inset-0 bg-primary-bg flex flex-col items-center justify-center z-50 p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white tracking-tighter mb-2">
          Welcome to Vibe<span className="text-neon-green">share</span>
        </h1>
        <p className="text-lg text-gray-400">Choose your developer persona to start sharing.</p>
      </div>
      <div className="max-w-2xl w-full grid grid-cols-2 md:grid-cols-3 gap-6">
        {users.map(user => (
          <button
            key={user.id}
            onClick={() => onLogin(user)}
            className="bg-card-bg border border-border-color rounded-2xl p-6 flex flex-col items-center gap-4 text-center group hover:border-neon-green hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-bg focus:ring-neon-green"
            aria-label={`Log in as ${user.name}`}
          >
            <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full border-4 border-border-color group-hover:border-neon-green transition-colors" />
            <h2 className="font-bold text-lg text-white">{user.name}</h2>
          </button>
        ))}
      </div>
       <footer className="absolute bottom-8 text-gray-600 text-sm">
        This is a simulated login experience. No data is stored or sent.
      </footer>
    </div>
  );
};

export default LoginScreen;
