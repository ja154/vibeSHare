
import React from 'react';
import { Post, User } from '../types';
import PostCard from './PostCard';

interface FeedProps {
  posts: Post[];
  currentUser: User | null;
  onAddComment: (postId: string, text: string) => void;
  onNavigateToProfile: (userId: string) => void;
  onUpdateReaction: (postId: string, reaction: keyof Post['reactions']) => void;
  onDeletePost: (postId: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, currentUser, onAddComment, onNavigateToProfile, onUpdateReaction, onDeletePost, onDeleteComment }) => {
  return (
    <div className="flex flex-col gap-6">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            currentUser={currentUser} 
            onAddComment={onAddComment}
            onNavigateToProfile={onNavigateToProfile}
            onUpdateReaction={onUpdateReaction}
            onDeletePost={onDeletePost}
            onDeleteComment={onDeleteComment}
          />
        ))
      ) : (
        <div className="text-center py-16 px-6 bg-card-bg border border-border-color rounded-2xl">
            <h3 className="text-2xl font-bold text-white">No vibes here... yet.</h3>
            <p className="text-gray-400 mt-2">This feed is looking a little empty.</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
