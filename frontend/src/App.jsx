// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './auth/AuthPage';
import ClassForm from './class-form/ClassForm';
import AccountSettings from './account-settings/AccountSettings';
import Dashboard from './Dashboard';
import { AuthProvider } from './auth/context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './main/MainLayout';
import ProjectForm from './project-form/ProjectForm';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/classes" element={<div>لیست کلاس‌ها (محتوای این مسیر)</div>} />
            <Route path="/test" element={<div>صفحه تست (محتوای این مسیر)</div>} />
            <Route path="/class/edit/:classId" element={<ClassForm formType='edit' />} />
            <Route path="/class/create/" element={<ClassForm />} />
            <Route path="class/:classId/project/edit/:projectId" element={<ProjectForm formType='edit' />} />
            <Route path="class/:classId/project/create/" element={<ProjectForm />} />
          </Route>
          {/* <Route path="/project/create/" element={<ProjectForm />} /> */}

          <Route path='/' element={<Navigate to={'/auth'} replace />} />

          {/* <Route path="*" element={<div>404 Not Found</div>} /> */}

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
