
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  password?: string;
  following: string[];
  followers: string[];
}

export interface Comment {
  id:string;
  user: User;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  user: User;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  codeLink: string;
  tags: string[];
  reactions: {
    fire: number;
    idea: number;
    heart: number;
  };
  createdAt: string;
  comments: Comment[];
}

export interface VibeIdea {
  title: string;
  description: string;
  tags: string[];
}