import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans relative overflow-hidden">
      {/* Custom Styles for Animation & Smooth Scroll */}
      <style>
        {`
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 15s ease infinite;
          }
          html {
            scroll-behavior: smooth;
          }
        `}
      </style>

      {/* Animated Background Overlay */}
      <div className="absolute top-0 left-0 w-full h-[80vh] bg-gradient-to-br from-indigo-100/50 via-white to-purple-100/50 animate-gradient-x -z-10" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 -z-10" />

      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center">
          <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">TaskFlow</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
            Login
          </Link>
          <Link to="/signup" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-md shadow-xl z-30 border-t border-gray-100 flex flex-col p-4">
          <Link 
            to="/login" 
            onClick={() => setIsMenuOpen(false)}
            className="block w-full text-center py-4 text-gray-700 font-medium hover:bg-gray-50 rounded-xl mb-3 border border-gray-100"
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            onClick={() => setIsMenuOpen(false)}
            className="block w-full text-center py-4 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700"
          >
            Get Started Free
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 md:mt-24 relative z-10">
        <div className="inline-block mb-6 md:mb-8 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold text-xs sm:text-sm tracking-wide shadow-sm">
          ✨ Introducing TaskFlow 2.0
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 max-w-4xl leading-[1.15] sm:leading-tight">
          Manage Projects. <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">Track Tasks. Ship Faster.</span>
        </h1>
        <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
          The all-in-one platform for modern teams to organize work, collaborate in real-time, and deliver outstanding results without the chaos.
        </p>
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-4 justify-center px-4">
          <Link to="/signup" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 text-center">
            Get Started Free
          </Link>
          <Link to="/login" className="w-full sm:w-auto bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm text-center">
            View Demo
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 mt-16 bg-white/80 backdrop-blur-md sm:rounded-[2.5rem] shadow-xl shadow-indigo-100/40 mb-16 border border-white/60 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 px-4">Everything you need to succeed</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg px-4">Powerful features designed to help your team work smarter, not harder.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 text-center">
          {/* Feature 1 */}
          <div className="flex flex-col items-center p-6 sm:p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Role-Based Access</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Securely manage who sees what. Assign granular permissions to team members instantly.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="flex flex-col items-center p-6 sm:p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className="h-16 w-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Tracking</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Never lose sight of progress. See updates happen live across all your active projects.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center p-6 sm:p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Team Collaboration</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Communicate contextually. Keep discussions, files, and updates right where the work happens.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-400 py-12 md:py-16 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl font-extrabold text-white mb-2 tracking-tight">TaskFlow</span>
            <p className="text-sm text-gray-500 max-w-xs">Empowering teams to build better, ship faster, and scale smoothly.</p>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} TaskFlow Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
