import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DeviceProvider } from './contexts/DeviceContext';
import { RoutineProvider } from './contexts/RoutineContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './components/Dashboard';
import { useState, useEffect } from 'react';
import { getStoredProfile } from './lib/storage';

function App() {
  const [selectedProfile, setSelectedProfile] = useState(getStoredProfile());

  useEffect(() => {
    const profile = getStoredProfile();
    if (profile) {
      setSelectedProfile(profile);
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <DeviceProvider selectedProfile={selectedProfile}>
          <RoutineProvider selectedProfile={selectedProfile}>
            <div className="bg-gray-50">
              <Toaster position="top-right" />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <Dashboard 
                        selectedProfile={selectedProfile}
                        setSelectedProfile={setSelectedProfile}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard\" replace />} />
                <Route path="*" element={<Navigate to="/dashboard\" replace />} />
              </Routes>
            </div>
          </RoutineProvider>
        </DeviceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;