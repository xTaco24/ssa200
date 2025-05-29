import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DeviceProvider } from './contexts/DeviceContext';
import { RoutineProvider } from './contexts/RoutineContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './components/Dashboard';
import { Suspense, useState, useEffect } from 'react';
import { getStoredProfile } from './lib/storage';

function App() {
  const [selectedProfile, setSelectedProfile] = useState(getStoredProfile());

  useEffect(() => {
    const profile = getStoredProfile();
    if (profile) {
      setSelectedProfile(profile);
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />,
      errorElement: <ErrorBoundary />
    },
    {
      path: '/register',
      element: <Register />,
      errorElement: <ErrorBoundary />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />,
      errorElement: <ErrorBoundary />
    },
    {
      path: '/dashboard/*',
      element: (
        <ProtectedRoute>
          <Dashboard 
            selectedProfile={selectedProfile}
            setSelectedProfile={setSelectedProfile}
          />
        </ProtectedRoute>
      ),
      errorElement: <ErrorBoundary />
    },
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />
    },
    {
      path: '*',
      element: <Navigate to="/dashboard" replace />
    }
  ]);

  return (
    <AuthProvider>
      <DeviceProvider selectedProfile={selectedProfile}>
        <RoutineProvider selectedProfile={selectedProfile}>
          <div className="bg-gray-50">
            <Toaster position="top-right" />
            <Suspense fallback={<LoadingSpinner />}>
              <RouterProvider router={router} />
            </Suspense>
          </div>
        </RoutineProvider>
      </DeviceProvider>
    </AuthProvider>
  );
}

export default App;