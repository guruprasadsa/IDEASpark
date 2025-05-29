import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { ChatPage } from './components/ChatPage';

export type PageView = 'home' | 'chat';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  const navigateToChat = () => {
    setCurrentPage('chat');
  };

  return (
    <>
      {currentPage === 'home' && <HomePage onStartDiscovery={navigateToChat} />}
      {currentPage === 'chat' && <ChatPage />}
    </>
  );
};

export default App;