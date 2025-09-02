import React from 'react';
import { Post, User } from '../types';
import ProfileHeader from './ProfileHeader';
import Feed from './Feed';

interface ProfilePageProps {
  profileUser: User;
  posts: Post[];
  currentUser: User;
  onNavigateToFeed: () => void;
  onAddComment: (postId: string, text: string) => void;
  onNavigateToProfile: (userId: string) => void;
  onUpdateReaction: (postId: string, reaction: keyof Post['reactions']) => void;
  onDeletePost: (postId: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  profileUser,
  posts,
  currentUser,
  onNavigateToFeed,
  onAddComment,
  onNavigateToProfile,
  onUpdateReaction,
  onDeletePost,
  onDeleteComment
}) => {
  return (
    <>
      <ProfileHeader 
        user={profileUser}
        postCount={posts.length}
        onNavigateToFeed={onNavigateToFeed}
      />
      <Feed 
        posts={posts}
        currentUser={currentUser}
        onAddComment={onAddComment}
        onNavigateToProfile={onNavigateToProfile}
        onUpdateReaction={onUpdateReaction}
        onDeletePost={onDeletePost}
        onDeleteComment={onDeleteComment}
      />
    </>
  );
};

export default ProfilePage;
