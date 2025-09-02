
import { Post, User } from './types';

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Alex Dev', avatarUrl: 'https://picsum.photos/seed/alex/100/100', password: 'password1' },
  { id: '2', name: 'UI Specialist', avatarUrl: 'https://picsum.photos/seed/uidev/100/100', password: 'password2' },
  { id: '3', name: 'Backend Wizard', avatarUrl: 'https://picsum.photos/seed/backend/100/100', password: 'password3' },
  { id: '4', name: 'AI Explorer', avatarUrl: 'https://picsum.photos/seed/ai/100/100', password: 'password4' },
  { id: '5', name: 'Data Diva', avatarUrl: 'https://picsum.photos/seed/datagirl/100/100', password: 'password5' },
  { id: '6', name: 'Rookie Coder', avatarUrl: 'https://picsum.photos/seed/rookie/100/100', password: 'password6' },
];

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    user: MOCK_USERS[0],
    title: 'Generative Art with p5.js',
    description: 'Exploring Perlin noise to create dynamic, flowing landscapes. Each refresh generates a unique piece of art. The code is surprisingly simple for such a complex output!',
    mediaUrl: 'https://picsum.photos/seed/art/600/400',
    mediaType: 'image',
    codeLink: 'https://github.com/example/p5-art',
    tags: ['p5js', 'creative-coding', 'generative-art', 'javascript'],
    reactions: { fire: 12, idea: 25, heart: 42 },
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    comments: [
      { id: 'c1-1', user: MOCK_USERS[1], text: 'This is amazing! The colors are so vibrant.', createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
      { id: 'c1-2', user: MOCK_USERS[3], text: 'Love how you used Perlin noise. Have you tried adding simplex noise for comparison?', createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
    ],
  },
  {
    id: '2',
    user: MOCK_USERS[1],
    title: 'Sleek Tailwind CSS Login Form',
    description: 'A fully responsive login form component built with Tailwind CSS utility classes. Features custom focus rings and a subtle neon glow effect on the button.',
    mediaUrl: 'https://picsum.photos/seed/login/600/400',
    mediaType: 'image',
    codeLink: 'https://codepen.io/example/tailwind-login',
    tags: ['react', 'tailwindcss', 'ui-design', 'frontend'],
    reactions: { fire: 8, idea: 15, heart: 30 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    comments: [
       { id: 'c2-1', user: MOCK_USERS[0], text: 'Clean UI. Looks great!', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    ],
  },
  {
    id: '3',
    user: MOCK_USERS[2],
    title: 'Microservice API with Go',
    description: 'Built a high-performance REST API for user authentication using Go and Gorilla Mux. Benchmarked at over 10,000 requests per second!',
    mediaUrl: 'https://picsum.photos/seed/gocode/600/400',
    mediaType: 'image',
    codeLink: 'https://github.com/example/go-api',
    tags: ['golang', 'api', 'microservices', 'backend'],
    reactions: { fire: 45, idea: 18, heart: 55 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    comments: [],
  },
  {
    id: '4',
    user: MOCK_USERS[3],
    title: 'Image Recognition with Python',
    description: 'A simple Python script using TensorFlow to classify images. Trained it on a custom dataset of plant species. The accuracy is surprisingly high.',
    mediaUrl: 'https://picsum.photos/seed/python/600/400',
    mediaType: 'image',
    codeLink: 'https://replit.com/@example/image-classifier',
    tags: ['python', 'ai', 'tensorflow', 'machine-learning'],
    reactions: { fire: 33, idea: 50, heart: 78 },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    comments: [
      { id: 'c4-1', user: MOCK_USERS[4], text: 'This is super cool. What was the size of your dataset?', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
      { id: 'c4-2', user: MOCK_USERS[2], text: 'Impressive accuracy! Could this be deployed to an edge device?', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString() },
    ],
  },
];
