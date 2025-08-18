
import React from 'react';

export const ChatBubbleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.267c-.597.043-1.15-.141-1.566-.557l-2.755-2.755A2.25 2.25 0 0 1 8.25 15H4.5A2.25 2.25 0 0 1 2.25 12.75V8.511c.884-.284 1.5-1.128 1.5-2.097V4.5A2.25 2.25 0 0 1 6 2.25h4.5a2.25 2.25 0 0 1 2.25 2.25v1.714c0 .97.616 1.813 1.5 2.097l4.5.864Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75H4.5m7.5-4.5H13.5" />
  </svg>
);
