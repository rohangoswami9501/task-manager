import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { isTaskOverdue, formatDisplayDate } from '../utils/dateFormatter';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const userId = user?.userId;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        const [dashRes, tasksRes, projRes] = await Promise.all([
          api.get('/api/dashboard'),
          api.get(`/api/tasks?assignedToId=${userId}`),
          api.get('/api/projects')
        ]);
        setDashboardData(dashRes.data.data);
        setMyTasks(tasksRes.data.data);
        setProjects(projRes.data.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);



  const getStatusBadge = (status) => {
    switch (status) {
      case 'TODO':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">TODO</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">IN PROGRESS</span>;
      case 'DONE':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">DONE</span>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 h-24"></div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 h-16"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <p className="text-sm font-semibold text-blue-600 mb-1 uppercase tracking-wider">Total Tasks</p>
            <h3 className="text-3xl font-bold text-gray-900">{dashboardData?.totalTasks || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-16 h-16 bg-yellow-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <p className="text-sm font-semibold text-yellow-600 mb-1 uppercase tracking-wider">In Progress</p>
            <h3 className="text-3xl font-bold text-gray-900">{dashboardData?.byStatus.IN_PROGRESS || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-16 h-16 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <p className="text-sm font-semibold text-green-600 mb-1 uppercase tracking-wider">Completed</p>
            <h3 className="text-3xl font-bold text-gray-900">{dashboardData?.byStatus.DONE || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <p className="text-sm font-semibold text-red-600 mb-1 uppercase tracking-wider">Overdue</p>
            <h3 className="text-3xl font-bold text-gray-900">{dashboardData?.overdueTasks || 0}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: My Tasks */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              My Tasks
            </h2>
            <Link to="/tasks" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">View All &rarr;</Link>
          </div>
          <div className="p-6">
            {myTasks.length === 0 ? (
              <div className="text-center py-10 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks assigned</h3>
                <p className="mt-1 text-sm text-gray-500">You're all caught up! Enjoy your free time.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {myTasks.slice(0, 5).map(task => {
                  const overdue = isTaskOverdue(task.dueDate, task.status);
                  const project = projects.find(p => p.id === task.projectId);

                  return (
                    <li key={task.id} className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 truncate">{task.title}</h4>
                        <p className="text-xs font-medium text-gray-500 mt-1 flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          {project ? project.name : 'Unknown Project'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        {getStatusBadge(task.status)}
                        <div className={`flex items-center whitespace-nowrap ${overdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                          {overdue && (
                            <svg className="w-4 h-4 mr-1 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          <span className="text-xs">{formatDisplayDate(task.dueDate, 'No due date')}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Recent Projects */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Recent Projects
            </h2>
            <Link to="/projects" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">View All &rarr;</Link>
          </div>
          <div className="p-6">
            {projects.length === 0 ? (
              <div className="text-center py-10 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
                <p className="mt-1 text-sm text-gray-500">Admins need to create a project first.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {projects.slice(0, 5).map(project => (
                  <li key={project.id} className="p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{project.name}</h4>
                        <p className="text-xs text-gray-500 truncate max-w-[200px] sm:max-w-xs">{project.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {project._count?.tasks || 0} tasks
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
