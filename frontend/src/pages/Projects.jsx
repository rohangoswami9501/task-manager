import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  
  // Extract user info
  const token = localStorage.getItem('token');
  let user = null;
  if (token) {
    try {
      user = JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Failed to parse token');
    }
  }
  const isAdmin = user?.role === 'ADMIN';

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/api/projects');
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) {
      setError('Project name is required');
      return;
    }
    try {
      await api.post('/api/projects', newProject);
      setIsModalOpen(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? All associated tasks will be permanently deleted.')) return;
    try {
      await api.delete(`/api/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Failed to delete project. Please try again.');
    }
  };

  const getProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const doneTasks = tasks.filter(t => t.status === 'DONE').length;
    return Math.round((doneTasks / tasks.length) * 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Projects</h1>
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-colors font-bold shadow-sm shadow-indigo-600/30 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 h-64 shadow-sm"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
           <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
           </svg>
           <h3 className="mt-4 text-lg font-bold text-gray-900">No projects yet</h3>
           <p className="mt-2 text-gray-500 max-w-sm mx-auto">Get started by creating a new project to organize your tasks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map(project => {
            const progress = getProgress(project.tasks);
            return (
              <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow relative group hover:border-indigo-200">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-extrabold text-gray-900 pr-8">{project.name}</h2>
                    {isAdmin && (
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors absolute top-4 right-4 opacity-0 group-hover:opacity-100"
                        title="Delete project"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-gray-500 line-clamp-2 h-10 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>
                  
                  <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
                    <span className="font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">{project._count?.tasks || 0} tasks</span>
                    <span className="font-medium">Created {formatDate(project.createdAt)}</span>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between text-xs font-bold mb-2 text-gray-700">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between">
                  <div className="text-xs text-gray-500 flex items-center">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black mr-2 shadow-sm border border-indigo-200">
                      {project.createdBy?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-semibold text-gray-700">{project.createdBy?.name || 'Unknown User'}</span>
                  </div>
                  <Link 
                    to={`/tasks?projectId=${project.id}`}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
                  >
                    View Tasks <span className="ml-1 text-lg leading-none">&rarr;</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-extrabold text-gray-900">Create New Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-1 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="name">Project Name <span className="text-red-500">*</span></label>
                  <input
                    id="name"
                    type="text"
                    autoFocus
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-shadow text-gray-900 font-medium"
                    placeholder="e.g. Website Redesign"
                    value={newProject.name}
                    onChange={(e) => { setNewProject({...newProject, name: e.target.value}); setError(''); }}
                  />
                  {error && <p className="text-red-500 text-sm mt-2 font-semibold">{error}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-shadow text-gray-900"
                    placeholder="Briefly describe the project goals..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  ></textarea>
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-colors"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
