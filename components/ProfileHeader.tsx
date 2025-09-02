
import React from 'react';
import { User } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface ProfileHeaderProps {
  user: User;
  postCount: number;
  onNavigateToFeed: () => void;
  currentUser: User;
  onFollowToggle: (userId: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, postCount, onNavigateToFeed, currentUser, onFollowToggle }) => {
  const isOwnProfile = user.id === currentUser.id;
  const isFollowing = currentUser.following.includes(user.id);

  return (
    <div className="mb-8 p-6 bg-card-bg border border-border-color rounded-2xl">
      <div className="relative h-6 mb-4">
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
        
        <div className="flex justify-center gap-8 mt-4 text-center w-full">
            <div>
                <p className="text-xl font-bold text-white">{postCount}</p>
                <p className="text-sm text-gray-400">Vibes</p>
            </div>
            <div>
                <p className="text-xl font-bold text-white">{user.followers.length}</p>
                <p className="text-sm text-gray-400">Followers</p>
            </div>
            <div>
                <p className="text-xl font-bold text-white">{user.following.length}</p>
                <p className="text-sm text-gray-400">Following</p>
            </div>
        </div>

        {!isOwnProfile && (
            <div className="mt-6">
                <button 
                    onClick={() => onFollowToggle(user.id)}
                    className={`min-w-[120px] px-6 py-2 rounded-lg font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-neon-green ${isFollowing ? 'bg-border-color text-white hover:bg-gray-700' : 'bg-neon-green text-black hover:bg-white hover:shadow-neon'}`}
                >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;