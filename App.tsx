
import React, { useState, useCallback, useMemo } from 'react';
import { Post, User, Comment } from './types';
import { MOCK_POSTS, MOCK_USERS } from './constants';
import Header from './components/Header';
import Feed from './components/Feed';
import CreatePostModal from './components/CreatePostModal';
import LoginScreen from './components/LoginScreen';
import ProfilePage from './components/ProfilePage';

function App() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<{ page: 'feed' | 'profile'; userId?: string }>({ page: 'feed' });

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setView({ page: 'feed' }); // Reset view on logout
  }, []);

  const handleSignUp = useCallback((username: string, password: string): User => {
    const newUser: User = {
        id: String(users.length + 1),
        name: username,
        password: password,
        avatarUrl: `https://picsum.photos/seed/${username.toLowerCase()}/100/100`,
        followers: [],
        following: [],
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  }, [users.length]);

  const handleResetPassword = useCallback((username: string, newPassword: string): boolean => {
    let success = false;
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.name.toLowerCase() === username.toLowerCase()) {
        success = true;
        return { ...user, password: newPassword };
      }
      return user;
    }));
    return success;
  }, []);

  const handleOpenModal = useCallback(() => {
    if (currentUser) {
      setIsModalOpen(true);
    }
  }, [currentUser]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCreatePost = useCallback((newPostData: Omit<Post, 'id' | 'createdAt' | 'user' | 'reactions' | 'comments'>) => {
    if (!currentUser) return;
    const newPost: Post = {
      ...newPostData,
      id: new Date().toISOString(),
      user: currentUser,
      reactions: { fire: 0, idea: 0, heart: 0 },
      createdAt: new Date().toISOString(),
      comments: [],
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setIsModalOpen(false);
  }, [currentUser]);

  const handleAddComment = useCallback((postId: string, text: string) => {
    if (!currentUser) return;
    
    setPosts(prevPosts => {
      return prevPosts.map(post => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: new Date().toISOString(),
            user: currentUser,
            text,
            createdAt: new Date().toISOString(),
          };
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      });
    });
  }, [currentUser]);
  
  const handleUpdateReaction = useCallback((postId: string, reaction: keyof Post['reactions']) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            reactions: {
              ...post.reactions,
              [reaction]: post.reactions[reaction] + 1,
            },
          };
        }
        return post;
      })
    );
  }, []);

  const handleDeletePost = useCallback((postId: string) => {
    if (!currentUser) return;
    const postToDelete = posts.find(p => p.id === postId);
    // Authorization check: Only the post owner can delete.
    if (postToDelete && postToDelete.user.id === currentUser.id) {
       if (window.confirm('Are you sure you want to delete this vibe?')) {
         setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
       }
    }
  }, [currentUser, posts]);

  const handleDeleteComment = useCallback((postId: string, commentId: string) => {
    if (!currentUser) return;
    
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        const commentToDelete = post.comments.find(c => c.id === commentId);
        // Authorization check: Comment owner or post owner can delete.
        if (commentToDelete && (commentToDelete.user.id === currentUser.id || post.user.id === currentUser.id)) {
          return {
            ...post,
            comments: post.comments.filter(c => c.id !== commentId),
          };
        }
      }
      return post;
    }));
  }, [currentUser]);

  const handleFollowToggle = useCallback((userIdToToggle: string) => {
    if (!currentUser) return;
    
    const newUsers = users.map(user => {
        // Update the current user's following list
        if (user.id === currentUser.id) {
            const isFollowing = user.following.includes(userIdToToggle);
            const newFollowing = isFollowing
                ? user.following.filter(id => id !== userIdToToggle)
                : [...user.following, userIdToToggle];
            return { ...user, following: newFollowing };
        }
        // Update the target user's followers list
        if (user.id === userIdToToggle) {
            const isFollowed = user.followers.includes(currentUser.id);
            const newFollowers = isFollowed
                ? user.followers.filter(id => id !== currentUser.id)
                : [...user.followers, currentUser.id];
            return { ...user, followers: newFollowers };
        }
        return user;
    });
    
    const updatedCurrentUser = newUsers.find(u => u.id === currentUser.id);

    setUsers(newUsers);
    if(updatedCurrentUser) setCurrentUser(updatedCurrentUser);

  }, [users, currentUser]);

  const navigateToProfile = useCallback((userId: string) => {
    window.scrollTo(0, 0);
    setView({ page: 'profile', userId });
  }, []);

  const navigateToFeed = useCallback(() => {
    window.scrollTo(0, 0);
    setView({ page: 'feed' });
  }, []);

  const { displayedPosts, profileUser } = useMemo(() => {
    if (view.page === 'profile' && view.userId) {
      const user = users.find(u => u.id === view.userId) || null;
      if (user) {
        return {
          displayedPosts: posts.filter(p => p.user.id === view.userId),
          profileUser: user
        };
      }
    }
    return { displayedPosts: posts, profileUser: null };
  }, [view, posts, users]);


  if (!currentUser) {
    return (
      <LoginScreen 
        users={users} 
        onLogin={handleLogin} 
        onSignUp={handleSignUp}
        onResetPassword={handleResetPassword}
      />
    );
  }

  return (
    <div className="bg-primary-bg min-h-screen font-sans">
      <Header 
        onShareClick={handleOpenModal} 
        currentUser={currentUser} 
        onLogout={handleLogout}
        onNavigateToFeed={navigateToFeed}
        onNavigateToProfile={navigateToProfile}
      />
      <main className="max-w-2xl mx-auto px-4 py-8">
        {view.page === 'profile' && profileUser ? (
          <ProfilePage
            profileUser={profileUser}
            posts={displayedPosts}
            currentUser={currentUser}
            onNavigateToFeed={navigateToFeed}
            onAddComment={handleAddComment}
            onNavigateToProfile={navigateToProfile}
            onUpdateReaction={handleUpdateReaction}
            onDeletePost={handleDeletePost}
            onDeleteComment={handleDeleteComment}
            onFollowToggle={handleFollowToggle}
          />
        ) : (
          <Feed 
            posts={displayedPosts} 
            onAddComment={handleAddComment} 
            currentUser={currentUser}
            onNavigateToProfile={navigateToProfile}
            onUpdateReaction={handleUpdateReaction}
            onDeletePost={handleDeletePost}
            onDeleteComment={handleDeleteComment}
          />
        )}
      </main>
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreatePost={handleCreatePost}
      />
    </div>
  );
}

export default App;