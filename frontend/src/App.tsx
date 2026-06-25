import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './core/application/store/authStore';
import { DashboardLayout } from './core/presentation/layout/DashboardLayout';
import { LoginPage } from './modules/auth/presentation/pages/LoginPage';
import { RegisterPage } from './modules/auth/presentation/pages/RegisterPage';
import { ProjectsPage } from './modules/projects/presentation/pages/ProjectsPage';
import { TasksPage } from './modules/tasks/presentation/pages/TasksPage';
import { DashboardPage } from './modules/reports/presentation/pages/DashboardPage';
import { ReportsPage } from './modules/reports/presentation/pages/ReportsPage';

// Protected Route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};



// Public Route wrapper component (redirects to home if already logged in)
const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Private dashboard layout routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
