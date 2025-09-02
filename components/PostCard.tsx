import React, { useState, useCallback } from 'react';
import { Post, User } from '../types';
import { FireIcon } from './icons/FireIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { HeartIcon } from './icons/HeartIcon';
import { CodeBracketIcon } from './icons/CodeBracketIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PencilIcon } from './icons/PencilIcon';

interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onAddComment: (postId: string, text: string) => void;
  onNavigateToProfile: (userId: string) => void;
  onUpdateReaction: (postId: string, reaction: keyof Post['reactions']) => void;
  onDeletePost: (postId: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onEditPost: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onAddComment, onNavigateToProfile, onUpdateReaction, onDeletePost, onDeleteComment, onEditPost }) => {
  const [commentText, setCommentText] = useState('');

  const handleReactionClick = useCallback((reaction: keyof Post['reactions']) => {
    // Basic guard: user must be logged in to react.
    // The main logic is in App.tsx, but this prevents the call.
    if (!currentUser) return;
    onUpdateReaction(post.id, reaction);
  }, [post.id, onUpdateReaction, currentUser]);
  
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && currentUser) {
      onAddComment(post.id, commentText.trim());
      setCommentText('');
    }
  };

  const userHasReactedFire = currentUser ? post.reactions.fire.includes(currentUser.id) : false;
  const userHasReactedIdea = currentUser ? post.reactions.idea.includes(currentUser.id) : false;
  const userHasReactedHeart = currentUser ? post.reactions.heart.includes(currentUser.id) : false;

  return (
    <article className="bg-card-bg border border-border-color rounded-2xl overflow-hidden shadow-lg transition-all hover:border-neon-green/50">
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <button 
            onClick={() => onNavigateToProfile(post.user.id)}
            className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-neon-green rounded-lg -m-1 p-1"
            aria-label={`View profile of ${post.user.name}`}
          >
            <img src={post.user.avatarUrl} alt={post.user.name} className="w-10 h-10 rounded-full border-2 border-border-color group-hover:border-neon-green transition-colors" />
            <div>
              <p className="font-semibold text-white group-hover:text-neon-green transition-colors">{post.user.name}</p>
              <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
            </div>
          </button>
          {currentUser?.id === post.user.id && (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onEditPost(post)}
                    className="text-gray-500 hover:text-neon-green transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-neon-green"
                    aria-label="Edit post"
                >
                    <PencilIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onDeletePost(post.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-red-500"
                    aria-label="Delete post"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
          )}
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
        <p className="text-gray-300 text-sm mb-4">{post.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-gray-700 text-neon-green px-3 py-1 rounded-full text-xs font-medium">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      {post.mediaUrl && (
        <div className="bg-black">
          {post.mediaType === 'image' ? (
            <img src={post.mediaUrl} alt={post.title} className="w-full h-auto max-h-[500px] object-cover" />
          ) : (
            <video src={post.mediaUrl} controls className="w-full h-auto max-h-[500px]" />
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => handleReactionClick('fire')} 
              className={`flex items-center gap-1.5 transition-colors group ${userHasReactedFire ? 'text-orange-400' : 'text-gray-400 hover:text-white'}`}
              aria-pressed={userHasReactedFire}
              aria-label={`Fire reaction, currently ${post.reactions.fire.length} reactions. ${userHasReactedFire ? 'You have reacted.' : ''}`}
            >
              <FireIcon className="w-5 h-5" />
              <span className="text-sm font-medium">{post.reactions.fire.length}</span>
            </button>
            <button 
              onClick={() => handleReactionClick('idea')}
              className={`flex items-center gap-1.5 transition-colors group ${userHasReactedIdea ? 'text-yellow-300' : 'text-gray-400 hover:text-white'}`}
              aria-pressed={userHasReactedIdea}
              aria-label={`Idea reaction, currently ${post.reactions.idea.length} reactions. ${userHasReactedIdea ? 'You have reacted.' : ''}`}
            >
              <LightbulbIcon className="w-5 h-5" />
              <span className="text-sm font-medium">{post.reactions.idea.length}</span>
            </button>
            <button 
              onClick={() => handleReactionClick('heart')}
              className={`flex items-center gap-1.5 transition-colors group ${userHasReactedHeart ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
              aria-pressed={userHasReactedHeart}
              aria-label={`Heart reaction, currently ${post.reactions.heart.length} reactions. ${userHasReactedHeart ? 'You have reacted.' : ''}`}
            >
              <HeartIcon 
                className="w-5 h-5" 
                fill={userHasReactedHeart ? 'currentColor' : 'none'}
              />
              <span className="text-sm font-medium">{post.reactions.heart.length}</span>
            </button>
          </div>
          <a
            href={post.codeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-border-color text-white px-4 py-2 rounded-lg font-bold text-sm transition-all hover:bg-neon-green hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-neon-green"
          >
            <CodeBracketIcon className="w-5 h-5"/>
            <span>View Code</span>
          </a>
        </div>
        
        <div className="mt-4 border-t border-border-color pt-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
             <ChatBubbleIcon className="w-5 h-5" />
             Comments ({post.comments.length})
          </h3>
          <div className="space-y-4">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex items-start gap-3 group/comment">
                <button 
                    onClick={() => onNavigateToProfile(comment.user.id)} 
                    className="flex-shrink-0 rounded-full group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-neon-green" 
                    aria-label={`View profile of ${comment.user.name}`}
                >
                  <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-8 h-8 rounded-full border-2 border-border-color group-hover:border-neon-green transition-colors" />
                </button>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                     <button onClick={() => onNavigateToProfile(comment.user.id)} className="font-semibold text-sm text-white hover:text-neon-green transition-colors focus:outline-none rounded-sm focus:ring-2 focus:ring-offset-1 focus:ring-offset-card-bg focus:ring-neon-green">
                        {comment.user.name}
                     </button>
                     <p className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</p>
                  </div>
                  <p className="text-sm text-gray-300 bg-primary-bg p-2 rounded-lg mt-1">{comment.text}</p>
                </div>
                {(currentUser?.id === comment.user.id || currentUser?.id === post.user.id) && (
                    <button
                        onClick={() => onDeleteComment(post.id, comment.id)}
                        className="text-gray-600 hover:text-red-500 transition-colors p-1 rounded-full opacity-0 group-hover/comment:opacity-100"
                        aria-label="Delete comment"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                )}
              </div>
            ))}
          </div>

          {currentUser && (
            <form onSubmit={handleCommentSubmit} className="mt-4 flex items-center gap-3">
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full"/>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a vibe..."
                aria-label="Add a comment"
                className="flex-1 bg-primary-bg border border-border-color rounded-full py-2 px-4 text-sm text-white focus:ring-2 focus:ring-neon-green focus:outline-none transition"
              />
              <button type="submit" className="text-neon-green font-semibold text-sm hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled={!commentText.trim()}>
                Post
              </button>
            </form>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;