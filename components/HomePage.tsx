import React from 'react';

interface HomePageProps {
  onStartDiscovery: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartDiscovery }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 text-slate-100 p-6 selection:bg-sky-500 selection:text-white">
      <main className="text-center max-w-3xl">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400">
            IdeaSpark
          </span>{' '}
          Navigator
        </h1>
        <p className="text-xl sm:text-2xl text-slate-300 mb-10">
          Navigate the Future of Learning. Discover Your Next Big Idea.
        </p>
        <p className="text-md sm:text-lg text-slate-400 mb-12 leading-relaxed">
          Unlock a universe of emerging topics and cutting-edge skills with IdeaSpark Navigator. Powered by Google's Gemini API, this tool helps you explore evolving fields tailored to your interests and learning preferences. Whether you're a student charting your academic path or a lifelong learner hungry for new knowledge, let's find what's next, together.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left">
          <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700/50">
            <div className="flex items-center mb-3">
              <i className="fas fa-brain text-3xl text-sky-400 mr-4"></i>
              <h2 className="text-xl font-semibold text-slate-100">AI-Powered Discovery</h2>
            </div>
            <p className="text-slate-400 text-sm">
              Leverage the power of advanced AI to get curated ideas and insights on topics at the forefront of innovation.
            </p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700/50">
            <div className="flex items-center mb-3">
              <i className="fas fa-sliders-h text-3xl text-cyan-400 mr-4"></i>
              <h2 className="text-xl font-semibold text-slate-100">Tailored Suggestions</h2>
            </div>
            <p className="text-slate-400 text-sm">
              Customize your search with preferences for learning focus and depth, ensuring the ideas align with your goals.
            </p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700/50">
            <div className="flex items-center mb-3">
              <i className="fas fa-bookmark text-3xl text-teal-400 mr-4"></i>
              <h2 className="text-xl font-semibold text-slate-100">Save & Explore</h2>
            </div>
            <p className="text-slate-400 text-sm">
              Bookmark interesting ideas, dive deeper with "Tell Me More," and share your discoveries easily.
            </p>
          </div>
        </div>

        <button
          onClick={onStartDiscovery}
          className="px-10 py-4 bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 hover:from-sky-600 hover:via-cyan-600 hover:to-teal-600 text-white font-bold text-xl rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-300"
        >
          Uncover What's Next
        </button>
      </main>
      <footer className="mt-auto pt-10 text-center text-sm text-slate-500">
        Powered by Google Gemini API.
      </footer>
    </div>
  );
};
