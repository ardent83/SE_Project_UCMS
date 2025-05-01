import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './auth/AuthPage';
// import ClassForm from './class-form/ClassForm';
import AccountSettings from './account-settings/AccountSettings';
import Dashboard from './Dashboard';
import { AuthProvider } from './auth/context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './main/MainLayout';
import VerificationPage from "./auth/email-validation/emailVerificationPage.jsx";
// import ClassPage from './class-page/ClassPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          } />

          {/*<Route path="/test" element={*/}
          {/*  <MainLayout>*/}
          {/*    <ClassForm formType={"create"} />*/}
          {/*  </MainLayout>*/}
          {/*} />*/}

          <Route path="/ue" element={
            <MainLayout>
              <AccountSettings />
            </MainLayout>
          } />

          {/*<Route path="/class" element={*/}
          {/*  <MainLayout>*/}
          {/*    <ClassPage />*/}
          {/*  </MainLayout>*/}
          {/*} />*/}

          <Route path='/' element={<Navigate to={'/class'} replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
