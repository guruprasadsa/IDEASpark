import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onShowSaved: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, onShowSaved }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // App.tsx/ChatPage.tsx logic will determine if empty string is acceptable (for initial general ideas)
    // Here, we always call onSendMessage if not loading.
    if (!isLoading) { 
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-slate-700/50 bg-slate-800/80 backdrop-blur-md flex items-center gap-2 sm:gap-3 sticky bottom-0">
      <button
        type="button"
        onClick={onShowSaved}
        className="p-2 sm:p-3 rounded-full hover:bg-sky-700 transition-colors text-sky-400 hover:text-sky-200"
        aria-label="Show saved ideas"
        title="Show saved ideas"
        disabled={isLoading}
      >
        <i className="fas fa-bookmark"></i>
      </button>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Ask about a topic or leave blank for general ideas..."
        className="flex-grow px-3 py-2 sm:px-4 sm:py-3 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200 ease-in-out placeholder-slate-400 disabled:opacity-70"
        disabled={isLoading}
        aria-label="Chat input"
      />
      <button
        type="submit"
        disabled={isLoading} // Button is active if not loading, actual send logic (empty check) is in ChatPage
        className="bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-semibold py-2 px-3 sm:py-3 sm:px-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        aria-label="Send message"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <>
            <span className="hidden sm:inline">Send</span>
            <i className="fas fa-paper-plane sm:ml-2"></i>
          </>
        )}
      </button>
    </form>
  );
};