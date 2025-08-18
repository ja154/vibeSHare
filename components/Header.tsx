import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { User } from '../types';

interface HeaderProps {
  onShareClick: () => void;
  currentUser: User;
  onLogout: () => void;
  onNavigateToFeed: () => void;
  onNavigateToProfile: (userId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onShareClick, currentUser, onLogout, onNavigateToFeed, onNavigateToProfile }) => {
  return (
    <header className="bg-primary-bg/80 backdrop-blur-lg sticky top-0 z-20 border-b border-border-color">
      <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
        <button onClick={onNavigateToFeed} className="focus:outline-none rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-bg focus:ring-neon-green" aria-label="Go to home feed">
            <h1 className="text-2xl font-bold text-white tracking-tighter">
              Vibe<span className="text-neon-green">share</span>
            </h1>
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={onShareClick}
            className="flex items-center gap-2 bg-neon-green text-black px-4 py-2 rounded-lg font-bold text-sm transition-all hover:bg-white hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-bg focus:ring-neon-green"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Share Vibe</span>
          </button>
          <div className="flex items-center gap-3">
             <button 
                onClick={() => onNavigateToProfile(currentUser.id)} 
                className="group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-bg focus:ring-neon-green rounded-full"
                aria-label="View your profile"
             >
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-9 h-9 rounded-full border-2 border-border-color group-hover:border-neon-green transition-colors" />
             </button>
             <button onClick={onLogout} className="text-sm text-gray-400 hover:text-neon-green transition-colors font-semibold">
                Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
