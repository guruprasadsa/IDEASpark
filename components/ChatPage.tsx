import React, { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatDisplay } from './ChatDisplay';
import { ChatInput } from './ChatInput';
import { LearningPreferencesForm } from './LearningPreferencesForm';
import { generateIdeas, getMoreDetailsForIdea } from '../services/geminiService';
import type { ChatMessage, Idea, LearningPreferences, SavedIdea } from '../types';

export const ChatPage: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [learningPreferences, setLearningPreferences] = useState<LearningPreferences>({
    focus: 'any',
    depth: 'any',
  });
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>(() => {
    const localSavedIdeas = localStorage.getItem('savedIdeas');
    return localSavedIdeas ? JSON.parse(localSavedIdeas) : [];
  });
  const [showLearningPrefs, setShowLearningPrefs] = useState(false);

  const chatDisplayRef = useRef<HTMLDivElement>(null);

  // Welcome message
  useEffect(() => {
    if (chatMessages.length === 0) { // Only add welcome message if chat is empty
        setChatMessages([
          {
            id: uuidv4(),
            sender: 'ai',
            text: "Hi! I'm your Evolving Ideas Generator. What are you curious about today? You can also specify learning preferences using the settings icon.",
            timestamp: new Date(),
          },
        ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once when ChatPage mounts

  // Persist saved ideas to localStorage
  useEffect(() => {
    localStorage.setItem('savedIdeas', JSON.stringify(savedIdeas));
  }, [savedIdeas]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatDisplayRef.current) {
      chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
    }
  }, [chatMessages]);


  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setChatMessages(prev => [...prev, { ...message, id: uuidv4(), timestamp: new Date() } as ChatMessage]);
  };

  const updateLastMessage = (update: Partial<ChatMessage>) => {
    setChatMessages(prev => prev.map((msg, index) => 
      index === prev.length - 1 ? { ...msg, ...update, isLoading: false } : msg
    ));
  };

  const handleSendMessage = useCallback(async (inputText: string) => {
    if (!inputText.trim() && chatMessages.filter(msg => msg.sender === 'user').length > 0) { 
      // Allow empty for initial general ideas, but require input for subsequent user messages
      setCurrentError("Please enter a topic or question.");
      setTimeout(() => setCurrentError(null), 3000);
      return;
    }
    setIsLoading(true);
    setCurrentError(null);

    addMessage({ sender: 'user', text: inputText });
    addMessage({ sender: 'ai', isLoading: true }); // Placeholder for AI response

    try {
      if (typeof process.env.API_KEY !== 'string' || process.env.API_KEY === '') {
         throw new Error('API_KEY is not configured. Please set the API_KEY environment variable.');
      }
      const generatedIdeas = await generateIdeas(inputText, learningPreferences);
      const ideasWithSavedStatus = generatedIdeas.map(idea => ({
        ...idea,
        isSaved: savedIdeas.some(saved => saved.id === idea.id),
      }));
      updateLastMessage({ ideas: ideasWithSavedStatus, isLoading: false });
    } catch (err) {
      console.error("Error generating ideas:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      updateLastMessage({ error: `Failed to generate ideas: ${errorMessage}`, isLoading: false });
    } finally {
      setIsLoading(false);
    }
  }, [learningPreferences, savedIdeas, chatMessages]);

  const handleTellMeMore = useCallback(async (idea: Idea) => {
    setIsLoading(true);
    setCurrentError(null);

    addMessage({ sender: 'user', text: `Tell me more about "${idea.title}"`, queryContext: { originalIdeaTitle: idea.title} });
    addMessage({ sender: 'ai', isLoading: true });

    try {
      const details = await getMoreDetailsForIdea(idea.title, idea.description);
      updateLastMessage({ ideaDetails: details, isLoading: false });
    } catch (err) {
      console.error("Error getting more details:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      updateLastMessage({ error: `Failed to get more details: ${errorMessage}`, isLoading: false });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleSaveIdea = useCallback((ideaToToggle: Idea) => {
    setSavedIdeas(prev => {
      const isAlreadySaved = prev.some(idea => idea.id === ideaToToggle.id);
      if (isAlreadySaved) {
        return prev.filter(idea => idea.id !== ideaToToggle.id);
      } else {
        return [...prev, { ...ideaToToggle, isSaved: true }];
      }
    });
    // Update displayed ideas to reflect saved status
    setChatMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.ideas) {
          return {
            ...msg,
            ideas: msg.ideas.map(idea => 
              idea.id === ideaToToggle.id 
                ? { ...idea, isSaved: !idea.isSaved } 
                : idea
            )
          };
        }
        return msg;
      })
    );
  }, []);

  const handleShareIdea = useCallback((idea: Idea) => {
    const shareText = `Check out this idea: ${idea.title}\n\nDescription: ${idea.description}\nFirst Steps: ${idea.firstSteps}`;
    navigator.clipboard.writeText(shareText)
      .then(() => {
         addMessage({ sender: 'system', text: `"${idea.title}" copied to clipboard!`});
      })
      .catch(err => {
        console.error("Failed to copy idea: ", err);
        addMessage({ sender: 'system', error: "Failed to copy. Check browser permissions."});
      });
  }, []);
  
  const handleShowSavedIdeas = useCallback(() => {
     if (savedIdeas.length === 0) {
        addMessage({ sender: 'system', text: "You haven't saved any ideas yet. Explore and save some!" });
        return;
    }
    addMessage({ sender: 'system', text: "Showing your saved ideas:" });
    addMessage({ sender: 'ai', ideas: savedIdeas.map(idea => ({...idea, isSaved: true})) });
  }, [savedIdeas]);


  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-slate-100 selection:bg-sky-500 selection:text-white overflow-hidden">
      <header className="p-3 sm:p-4 shadow-md bg-slate-800/50 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400">
          Evolving Ideas Chat
        </h1>
         <button 
            onClick={() => setShowLearningPrefs(prev => !prev)} 
            className="p-2 rounded-md hover:bg-sky-600 transition-colors"
            aria-label="Toggle Learning Preferences"
            title="Toggle Learning Preferences"
          >
            <i className={`fas ${showLearningPrefs ? 'fa-times' : 'fa-sliders-h'}`}></i>
          </button>
      </header>
      
      {showLearningPrefs && (
        <div className="p-2 sm:p-4 bg-slate-800/70 backdrop-blur-md shadow-lg border-b border-slate-700/50">
            <LearningPreferencesForm 
                preferences={learningPreferences} 
                onPreferencesChange={setLearningPreferences} 
            />
        </div>
      )}

      <ChatDisplay 
        ref={chatDisplayRef}
        messages={chatMessages} 
        onTellMeMore={handleTellMeMore}
        onToggleSave={handleToggleSaveIdea}
        onShare={handleShareIdea}
        isLoadingGlobal={isLoading}
      />

      {currentError && (
         <div 
            className="p-3 bg-red-600 text-white text-center text-sm fixed bottom-20 left-1/2 transform -translate-x-1/2 rounded-md shadow-lg z-20 w-11/12 max-w-md animate-pulse"
            role="alert"
          >
           {currentError}
         </div>
      )}

      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading}
        onShowSaved={handleShowSavedIdeas}
      />
      
      <footer className="p-2 text-center text-xs text-slate-500 bg-slate-900 border-t border-slate-700/50">
         Powered by Gemini API. Explore. Learn. Evolve.
      </footer>
    </div>
  );
};
