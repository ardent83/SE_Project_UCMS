import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './auth/AuthPage';
import AccountSettings from './account-settings/AccountSettings';
import ClassForm from './class-form/ClassForm'
import Dashboard from './Dashboard';
import { AuthProvider } from './auth/context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './main/MainLayout';
import Profile from "./profile-page/Profile.jsx";
import ClassPage from "./class-page/ClassPage.jsx";
import ProjectsPage from "./project-list/ProjectsPage.jsx";
import EmailConfirmedPage from "./auth/email-validation/EmailConfirmedPage.jsx";
import EmailVerificationPage from "./auth/email-validation/emailVerificationPage.jsx";
// import SolarSystem from './s'

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
          <Route path="/profile" element={<Profile />} />
          <Route path="/class/:classId" element={<ClassPage />} />
          <Route path="/projectsPage" element={<ProjectsPage />} />



          </Route>
          <Route path="/confirmation" element={<EmailConfirmedPage />} />
          <Route path="/verification" element={<EmailVerificationPage />} />

          {/*<Route path='/' element={<SolarSystem />} />*/}
          <Route path='/' element={<Navigate to={'/auth'} replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
