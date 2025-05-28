import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import ControlPanel from './ControlPanel';
import Analysis from './Analysis';
import Routines from './Routines';
import AdminPanel from './admin/AdminPanel';
import { getStoredProfile } from '../lib/storage';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('panel');
  const [selectedProfile, setSelectedProfile] = useState(getStoredProfile());
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard') setActiveTab('panel');
    else if (path === '/dashboard/routines') setActiveTab('rutinas');
    else if (path === '/dashboard/analysis') setActiveTab('analisis');
    else if (path === '/dashboard/admin') setActiveTab('admin');
  }, [location]);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const greeting = `Bienvenido a ${selectedProfile}`;

  return (
    <div className="min-h-screen flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        selectedProfile={selectedProfile} 
      />
      <div className="flex-1">
        <Header 
          selectedProfile={selectedProfile}
          setSelectedProfile={setSelectedProfile}
          theme={theme}
          toggleTheme={toggleTheme}
          greeting={greeting}
        />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<ControlPanel selectedProfile={selectedProfile} />} />
            <Route path="/routines" element={<Routines selectedProfile={selectedProfile} />} />
            <Route path="/analysis" element={<Analysis selectedProfile={selectedProfile} />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;