export interface Idea {
  id: string; // Unique identifier for the idea
  title: string;
  description: string;
  firstSteps: string;
  category: string; // e.g., Technology, Science, Arts
  isSaved?: boolean; // Optional, to track saved state client-side
}

export type Sender = 'user' | 'ai' | 'system';

export interface ChatMessage {
  id: string;
  sender: Sender;
  text?: string; // For simple text messages or user queries
  ideas?: Idea[]; // For AI responses containing multiple ideas
  ideaDetails?: string; // For AI responses to "Tell me more"
  isLoading?: boolean; // To show loading state for this specific message
  error?: string; // For error messages
  timestamp: Date;
  queryContext?: { // For "Tell me more" context
    originalIdeaTitle?: string;
  }
}

export interface LearningPreferences {
  focus: 'any' | 'practical' | 'theoretical' | 'overview';
  depth: 'any' | 'beginner' | 'intermediate' | 'advanced';
}

export interface SavedIdea extends Idea {} // For clarity, though structurally same as Idea

export type PageView = 'home' | 'chat'; // For App.tsx routing
