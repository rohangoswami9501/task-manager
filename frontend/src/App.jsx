import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Landing from './pages/Landing';

import Layout from './components/Layout';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/projects" element={
          <ProtectedRoute>
            <Layout><Projects /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/tasks" element={
          <ProtectedRoute>
            <Layout><Tasks /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
