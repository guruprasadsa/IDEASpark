import React from 'react';
import type { ChatMessage as ChatMessageType, Idea } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface ChatMessageProps {
  message: ChatMessageType;
  onTellMeMore: (idea: Idea) => void;
  onToggleSave: (idea: Idea) => void;
  onShare: (idea: Idea) => void;
}

const IdeaItem: React.FC<{ idea: Idea; onTellMeMore: (idea: Idea) => void; onToggleSave: (idea: Idea) => void; onShare: (idea: Idea) => void;}> = ({ idea, onTellMeMore, onToggleSave, onShare }) => {
  
  const formatTextWithNewLines = (text: string) => {
    return text.split('\\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-slate-700/50 p-4 rounded-lg mb-3 border border-slate-600/50">
      <h3 className="text-xl font-semibold text-sky-300 mb-2">{idea.title}</h3>
      <p className="text-sm text-slate-300 mb-1"><strong className="text-sky-400">Category:</strong> {idea.category}</p>
      <p className="text-sm text-slate-300 mb-3 leading-relaxed">{idea.description}</p>
      <div>
        <h4 className="font-semibold text-sky-400 mb-1">First Steps:</h4>
        <div className="text-slate-300 text-sm leading-relaxed prose prose-sm prose-invert max-w-none">
            {formatTextWithNewLines(idea.firstSteps)}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 items-center">
        <button
          onClick={() => onToggleSave(idea)}
          className={`p-2 rounded-md text-sm transition-colors flex items-center gap-1 ${idea.isSaved ? 'bg-yellow-500/80 text-white hover:bg-yellow-600/80' : 'bg-slate-600 hover:bg-slate-500 text-slate-200'}`}
          aria-label={idea.isSaved ? 'Unsave idea' : 'Save idea'}
          title={idea.isSaved ? 'Unsave idea' : 'Save idea'}
        >
          <i className={`fas fa-star ${idea.isSaved ? 'text-white' : 'text-yellow-400'}`}></i> {idea.isSaved ? 'Saved' : 'Save'}
        </button>
        <button
          onClick={() => onTellMeMore(idea)}
          className="p-2 rounded-md text-sm bg-sky-600 hover:bg-sky-700 text-white transition-colors flex items-center gap-1"
          title="Tell me more about this idea"
        >
          <i className="fas fa-info-circle"></i> Tell Me More
        </button>
        <button
          onClick={() => onShare(idea)}
          className="p-2 rounded-md text-sm bg-teal-600 hover:bg-teal-700 text-white transition-colors flex items-center gap-1"
          title="Share this idea"
        >
          <i className="fas fa-share-alt"></i> Share
        </button>
      </div>
    </div>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onTellMeMore, onToggleSave, onShare }) => {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';
  const isSystem = message.sender === 'system';

  const baseBubbleClasses = "p-3 sm:p-4 rounded-xl max-w-lg lg:max-w-xl xl:max-w-2xl break-words shadow-md";
  const userBubbleClasses = `bg-sky-600 text-white ml-auto ${baseBubbleClasses}`;
  const aiBubbleClasses = `bg-slate-700 text-slate-100 mr-auto ${baseBubbleClasses}`;
  
  // Specific styling for system messages like "Copied to clipboard"
  const systemMessageClasses = message.error 
    ? `bg-red-700/30 border border-red-500 text-red-300 text-sm italic text-center mx-auto my-2 px-3 py-2 rounded-lg max-w-md ${baseBubbleClasses}`
    : `bg-green-600/30 border border-green-500 text-green-300 text-sm italic text-center mx-auto my-2 px-3 py-2 rounded-lg max-w-md ${baseBubbleClasses}`;
  
  const regularSystemBubbleClasses = `bg-slate-600/80 text-slate-300 text-sm italic text-center mx-auto my-2 px-3 py-2 rounded-lg ${baseBubbleClasses}`;


  let bubbleClassToUse = regularSystemBubbleClasses;
  if (isUser) bubbleClassToUse = userBubbleClasses;
  else if (isAI) bubbleClassToUse = aiBubbleClasses;
  else if (isSystem) {
     // Differentiate between general system messages and specific notifications like copy success/error
    if (message.text?.includes("copied to clipboard") || message.error?.includes("Failed to copy")) {
        bubbleClassToUse = systemMessageClasses;
    } else {
        bubbleClassToUse = regularSystemBubbleClasses;
    }
  }


  const queryContextText = message.queryContext?.originalIdeaTitle 
    ? `About: "${message.queryContext.originalIdeaTitle}"` 
    : null;

  return (
    <div className={`flex ${isUser ? 'justify-end' : isAI ? 'justify-start' : 'justify-center'} w-full`}>
      <div className={bubbleClassToUse} role="log" aria-live={isAI ? "polite" : "off"}>
        {message.isLoading && <LoadingSpinner text={isAI ? "Thinking..." : undefined} size="small"/>}
        
        {isSystem && message.error && <ErrorMessage title="System Error" message={message.error} />}
        {isAI && message.error && <ErrorMessage title="AI Error" message={message.error} />}
        
        {message.text && (
          <div className="prose prose-sm prose-invert max-w-none">
            {isUser && queryContextText && <p className="text-xs opacity-70 mb-1">{queryContextText}</p>}
            <p>{message.text}</p>
          </div>
        )}

        {message.ideas && message.ideas.length > 0 && (
          <div>
            <p className="mb-3 text-slate-200">{message.ideas.length > 1 ? "Here are a few ideas I found:" : "Here's an idea I found:"}</p>
            {message.ideas.map(idea => (
              <IdeaItem 
                key={idea.id} 
                idea={idea} 
                onTellMeMore={onTellMeMore} 
                onToggleSave={onToggleSave}
                onShare={onShare}
              />
            ))}
          </div>
        )}
        {message.ideaDetails && (
           <div className="prose prose-sm prose-invert max-w-none whitespace-pre-line">
             <p>{message.ideaDetails}</p>
           </div>
        )}
         <p className="text-xs mt-2 opacity-60 text-right">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
      </div>
    </div>
  );
};