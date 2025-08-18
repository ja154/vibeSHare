import React from 'react';
import { User } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface ProfileHeaderProps {
  user: User;
  postCount: number;
  onNavigateToFeed: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, postCount, onNavigateToFeed }) => {
  return (
    <div className="mb-8 p-6 bg-card-bg border border-border-color rounded-2xl">
      <div className="relative h-6">
        <button
          onClick={onNavigateToFeed}
          className="absolute top-0 left-0 flex items-center gap-2 text-sm text-gray-400 hover:text-neon-green transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-neon-green rounded-md"
          aria-label="Back to feed"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Feed
        </button>
      </div>
      <div className="flex flex-col items-center">
        <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full border-4 border-neon-green shadow-lg mb-4" />
        <h2 className="text-3xl font-bold text-white">{user.name}</h2>
        <p className="text-gray-400 mt-1">{postCount} {postCount === 1 ? 'Vibe' : 'Vibes'}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
