import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { isTaskOverdue, formatDisplayDate } from '../utils/dateFormatter';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // URL Params for filters
  const [searchParams, setSearchParams] = useSearchParams();
  const filterProjectId = searchParams.get('projectId') || '';
  const filterStatus = searchParams.get('status') || '';
  const filterAssigneeId = searchParams.get('assignedToId') || '';
  const filterOverdue = searchParams.get('overdue') === 'true';

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  const initialTaskState = { title: '', description: '', projectId: '', assignedToId: '', dueDate: '', status: 'TODO' };
  const [formData, setFormData] = useState(initialTaskState);

  const { user: currentUser, isAdmin } = useAuth();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Build query
      const params = new URLSearchParams();
      if (filterProjectId) params.append('projectId', filterProjectId);
      if (filterStatus) params.append('status', filterStatus);
      if (filterAssigneeId) params.append('assignedToId', filterAssigneeId);
      if (filterOverdue) params.append('overdue', 'true');

      const tasksRes = await api.get(`/api/tasks?${params.toString()}`);
      setTasks(tasksRes.data.data);

      // Only fetch projects/users once if not loaded
      if (projects.length === 0) {
        const projRes = await api.get('/api/projects');
        setProjects(projRes.data.data);
      }
      if (isAdmin && users.length === 0) {
        const userRes = await api.get('/api/users');
        setUsers(userRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterProjectId, filterStatus, filterAssigneeId, filterOverdue]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/api/tasks/${taskId}`, { status: newStatus });
      fetchData(); // Refresh to ensure backend reflects change
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${taskId}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        projectId: parseInt(formData.projectId),
        status: formData.status,
      };
      if (formData.assignedToId) payload.assignedToId = parseInt(formData.assignedToId);
      if (formData.dueDate) payload.dueDate = formData.dueDate;

      if (isEditModalOpen) {
        await api.patch(`/api/tasks/${currentTask.id}`, payload);
      } else {
        await api.post('/api/tasks', payload);
      }
      
      closeModal();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save task');
    }
  };

  const openCreateModal = () => {
    setFormData({ ...initialTaskState, projectId: filterProjectId || '' });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      projectId: task.projectId.toString(),
      assignedToId: task.assignedToId ? task.assignedToId.toString() : '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      status: task.status
    });
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setCurrentTask(null);
    setFormData(initialTaskState);
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-5 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tasks</h1>
        {isAdmin && (
          <button 
            onClick={openCreateModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-colors font-bold shadow-sm flex items-center shrink-0"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <select 
          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-medium"
          value={filterProjectId}
          onChange={(e) => updateFilter('projectId', e.target.value)}
        >
          <option value="">All Projects</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <select 
          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-medium"
          value={filterStatus}
          onChange={(e) => updateFilter('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>

        {isAdmin && (
          <select 
            className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-medium"
            value={filterAssigneeId}
            onChange={(e) => updateFilter('assignedToId', e.target.value)}
          >
            <option value="">Anyone (Assignee)</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        )}

        <label className="flex items-center space-x-2 cursor-pointer ml-auto sm:ml-0 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
          <input 
            type="checkbox" 
            checked={filterOverdue}
            onChange={(e) => updateFilter('overdue', e.target.checked ? 'true' : '')}
            className="w-4 h-4 text-red-600 border-red-300 rounded focus:ring-red-500 focus:ring-2 cursor-pointer"
          />
          <span className="text-sm font-bold text-red-700">Overdue Only</span>
        </label>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Due Date</th>
                {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="p-8">
                    <div className="space-y-4 animate-pulse">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-12 bg-gray-100 rounded-xl w-full"></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="p-16 text-center">
                    <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <h3 className="mt-4 text-lg font-bold text-gray-900">No tasks found</h3>
                    <p className="mt-2 text-gray-500 max-w-sm mx-auto">Try adjusting your filters or create a new task to get started.</p>
                  </td>
                </tr>
              ) : (
                tasks.map(task => {
                  const overdue = isTaskOverdue(task.dueDate, task.status);
                  const canEditStatus = isAdmin || task.assignedToId === currentUser.userId;

                  return (
                    <tr key={task.id} className="bg-white border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 text-sm">{task.title}</div>
                        {task.description && <div className="text-xs font-medium text-gray-500 truncate max-w-[200px] mt-1">{task.description}</div>}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-semibold text-xs uppercase tracking-wider">
                        {task.project?.name || `Project ${task.projectId}`}
                      </td>
                      <td className="px-6 py-4">
                        {task.assignedTo ? (
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mr-2 border border-indigo-200">
                              {task.assignedTo.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-700">{task.assignedTo.name}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic font-medium">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          disabled={!canEditStatus}
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className={`text-xs font-black rounded-full px-3 py-1 outline-none appearance-none cursor-pointer pr-7 transition-all ${
                            task.status === 'DONE' ? 'bg-green-100 text-green-800 border-2 border-green-200' :
                            task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-200' :
                            'bg-gray-100 text-gray-800 border-2 border-gray-200'
                          } ${!canEditStatus ? 'opacity-70 cursor-not-allowed' : 'hover:ring-indigo-300 shadow-sm'}`}
                          style={{
                            backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right .5rem top 50%',
                            backgroundSize: '.65rem auto'
                          }}
                        >
                          <option value="TODO">TODO</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="DONE">DONE</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center whitespace-nowrap ${overdue ? 'text-red-600 font-bold' : 'text-gray-700 font-medium'}`}>
                          {overdue && (
                            <svg className="w-4 h-4 mr-1 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          <span>{formatDisplayDate(task.dueDate)}</span>
                        </div>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => openEditModal(task)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1.5 rounded-lg transition-colors shadow-sm border border-indigo-100 hover:bg-indigo-100 inline-block" title="Edit">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-lg transition-colors shadow-sm border border-red-100 hover:bg-red-100 inline-block" title="Delete">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden transform transition-all">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-extrabold text-gray-900">
                {isEditModalOpen ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-1 rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateOrUpdate} className="p-6">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    autoFocus
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-gray-900"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Project <span className="text-red-500">*</span></label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium bg-white"
                      value={formData.projectId}
                      onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                    >
                      <option value="" disabled>Select project...</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Assign To</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium bg-white"
                      value={formData.assignedToId}
                      onChange={(e) => setFormData({...formData, assignedToId: e.target.value})}
                    >
                      <option value="">Unassigned</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-bold bg-white"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="TODO">TODO</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="DONE">DONE</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-colors"
                >
                  {isEditModalOpen ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
