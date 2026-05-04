import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">TaskFlow</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Login
          </Link>
          <Link to="/signup" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 max-w-4xl leading-tight">
          Manage Projects. <br className="hidden md:block" />
          <span className="text-indigo-600">Track Tasks. Ship Faster.</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          The all-in-one platform for modern teams to organize work, collaborate in real-time, and deliver outstanding results without the chaos.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Link to="/signup" className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200">
            Get Started Free
          </Link>
          <Link to="/login" className="bg-white text-gray-700 border border-gray-300 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm">
            Login
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mt-16 bg-white rounded-3xl shadow-sm mb-16 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {/* Feature 1 */}
          <div className="flex flex-col items-center p-6">
            <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Role-Based Access</h3>
            <p className="text-gray-600 leading-relaxed">
              Securely manage who sees what. Assign granular permissions to team members instantly.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="flex flex-col items-center p-6">
            <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Real-Time Task Tracking</h3>
            <p className="text-gray-600 leading-relaxed">
              Never lose sight of progress. See updates happen live across all your active projects.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center p-6">
            <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Team Collaboration</h3>
            <p className="text-gray-600 leading-relaxed">
              Communicate contextually. Keep discussions, files, and updates right where the work happens.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-400 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold text-white">TaskFlow</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
