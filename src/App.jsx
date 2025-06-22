import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query'; // IMPORTANT: Using react-query (v3)
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import LandingPage from './pages/LandingPage';
import CaretakerDashboard from './pages/CaretakerDashboard';
import LoadingSpinner from './components/LoadingSpinner';

const queryClient = new QueryClient();

// A wrapper component for protected routes, now handling role-based redirection
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Check if the user's current role is allowed for this route
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.warn(`Access Denied: User role "${userRole}" not allowed for this route. Required roles: ${allowedRoles.join(', ')}`);
    // Redirect to the dashboard appropriate for their actual role, or landing page if no specific dashboard
    if (userRole === 'patient') {
      return <Navigate to="/dashboard" replace />;
    } else if (userRole === 'caretaker') {
      return <Navigate to="/caretaker-dashboard" replace />;
    }
    return <Navigate to="/" replace />; // Fallback to landing if role is unexpected
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider> {/* AuthProvider must wrap Router as it uses useNavigate */}
          <SocketProvider>
            <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white font-inter">
              <Routes>
                <Route path="/" element={<LandingPage />} /> {/* Landing Page as root */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Patient Dashboard accessible only by 'patient' role */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <PatientDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Caretaker Dashboard accessible only by 'caretaker' role */}
                <Route
                  path="/caretaker-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['caretaker']}>
                      <CaretakerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect any other unknown paths back to the landing page */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;