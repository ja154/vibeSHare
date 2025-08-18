
import React, { useState, useCallback, FormEvent, useEffect } from 'react';
import { Post, VibeIdea } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { generateVibeIdea } from '../services/geminiService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (postData: Omit<Post, 'id' | 'createdAt' | 'user' | 'reactions' | 'comments'>) => void;
}

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onCreatePost }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [codeLink, setCodeLink] = useState('');
  const [tags, setTags] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setCodeLink('');
    setTags('');
    setMediaFile(null);
    setMediaPreview('');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setMediaFile(file);
       if (mediaPreview) {
          // revokeObjectURL is not needed if we switch to data URLs immediately
          // but good practice if we were keeping blob urls around
      }
      fileToDataUrl(file).then(setMediaPreview);
    } else {
      setMediaFile(null);
      setMediaPreview('');
    }
  };

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description || !codeLink || !mediaFile) {
      alert('Please fill all required fields and upload an image.');
      return;
    }
    setIsSubmitting(true);
    try {
      const mediaUrl = await fileToDataUrl(mediaFile);
      onCreatePost({
        title,
        description,
        codeLink,
        mediaUrl,
        mediaType: 'image',
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      });
      handleClose(); // Use handleClose to properly reset and close
    } catch (error) {
      console.error("Error processing file:", error);
      alert('There was an error processing your image. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [onCreatePost, title, description, codeLink, mediaFile, tags, handleClose]);

  const handleGenerateIdea = async () => {
    setIsGenerating(true);
    try {
      const idea: VibeIdea | null = await generateVibeIdea();
      if (idea) {
        setTitle(idea.title);
        setDescription(idea.description);
        setTags(idea.tags.join(', '));
      } else {
        alert('Could not generate an idea. Please try again.');
      }
    } catch (error) {
      console.error("Failed to generate vibe idea:", error);
      alert(`Error generating idea: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="bg-card-bg border border-border-color rounded-2xl w-full max-w-lg shadow-lg relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-card-bg/80 backdrop-blur-sm z-10 flex justify-between items-center p-4 border-b border-border-color">
          <h2 className="text-xl font-bold text-white">Share your Vibe</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white" aria-label="Close modal">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="relative">
            <button
              type="button"
              onClick={handleGenerateIdea}
              disabled={isGenerating}
              className="absolute top-0 right-0 flex items-center gap-1.5 text-xs bg-neon-green/10 text-neon-green px-2 py-1 rounded-full font-semibold transition hover:bg-neon-green/20 disabled:opacity-50 disabled:cursor-wait"
            >
              <SparklesIcon className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Get Idea with AI'}
            </button>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="title">Title</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-primary-bg border border-border-color rounded-lg p-2 text-white focus:ring-2 focus:ring-neon-green focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="description">Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="w-full bg-primary-bg border border-border-color rounded-lg p-2 text-white focus:ring-2 focus:ring-neon-green focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Image
            </label>
            <div className="mt-1 flex justify-center items-center w-full px-6 pt-5 pb-6 border-2 border-border-color border-dashed rounded-lg">
              {mediaPreview ? (
                <div className="relative group">
                  <img src={mediaPreview} alt="Image preview" className="max-h-48 rounded-lg object-contain" />
                  <button
                    type="button"
                    onClick={() => { setMediaFile(null); setMediaPreview(''); }}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-400 justify-center">
                    <label htmlFor="media-file" className="relative cursor-pointer bg-primary-bg rounded-md font-medium text-neon-green hover:text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-card-bg focus-within:ring-neon-green px-1">
                      <span>Upload an image</span>
                      <input id="media-file" name="media-file" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="codeLink">Code Link</label>
            <input type="url" id="codeLink" value={codeLink} onChange={e => setCodeLink(e.target.value)} required placeholder="https://github.com/..." className="w-full bg-primary-bg border border-border-color rounded-lg p-2 text-white focus:ring-2 focus:ring-neon-green focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="tags">Tags (comma-separated)</label>
            <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)} className="w-full bg-primary-bg border border-border-color rounded-lg p-2 text-white focus:ring-2 focus:ring-neon-green focus:outline-none" />
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSubmitting} className="bg-neon-green text-black font-bold px-6 py-2 rounded-lg transition-all hover:bg-white hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-neon-green disabled:opacity-50 disabled:cursor-wait">
              {isSubmitting ? 'Sharing...' : 'Share'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
