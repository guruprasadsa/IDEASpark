import React, { forwardRef } from 'react';
import type { ChatMessage as ChatMessageType, Idea } from '../types';
import { ChatMessage } from './ChatMessage';
import { LoadingSpinner } from './LoadingSpinner';

interface ChatDisplayProps {
  messages: ChatMessageType[];
  onTellMeMore: (idea: Idea) => void;
  onToggleSave: (idea: Idea) => void;
  onShare: (idea: Idea) => void;
  isLoadingGlobal?: boolean; // To show a global spinner perhaps at the end
}

export const ChatDisplay = forwardRef<HTMLDivElement, ChatDisplayProps>(({ messages, onTellMeMore, onToggleSave, onShare, isLoadingGlobal }, ref) => {
  return (
    <div ref={ref} className="flex-grow p-4 space-y-4 overflow-y-auto chat-display-area pb-20">
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          onTellMeMore={onTellMeMore}
          onToggleSave={onToggleSave}
          onShare={onShare}
        />
      ))}
      {isLoadingGlobal && messages.length > 0 && !messages[messages.length-1].isLoading && (
        <div className="flex justify-center">
           <LoadingSpinner text="Thinking..." />
        </div>
      )}
       {/* Add a spacer div to ensure content above input bar is not hidden */}
      <div className="h-10"></div>
    </div>
  );
});

ChatDisplay.displayName = 'ChatDisplay';
