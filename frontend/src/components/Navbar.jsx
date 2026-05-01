import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  let user = null;
  if (token) {
    try {
      const payload = token.split('.')[1];
      user = JSON.parse(atob(payload));
    } catch (e) {
      console.error('Failed to parse token payload');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-2xl font-black tracking-wider text-blue-500">
              TaskFlow
            </Link>
            <div className="hidden md:flex space-x-2">
              <Link to="/dashboard" className="hover:bg-gray-800 px-3 py-2 rounded-md font-medium transition-colors">
                Dashboard
              </Link>
              <Link to="/projects" className="hover:bg-gray-800 px-3 py-2 rounded-md font-medium transition-colors">
                Projects
              </Link>
              <Link to="/tasks" className="hover:bg-gray-800 px-3 py-2 rounded-md font-medium transition-colors">
                Tasks
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {user && (
              <div className="flex items-center space-x-3">
                <span className="font-semibold">{user.name || user.email}</span>
                <span 
                  className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-600 text-purple-100 shadow-sm shadow-purple-500/50' 
                      : 'bg-gray-600 text-gray-100'
                  }`}
                >
                  {user.role}
                </span>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors font-bold text-sm shadow-sm shadow-red-600/30"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
