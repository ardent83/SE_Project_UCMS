import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './auth/AuthPage';
import Dashboard from './Dashboard';
import { AuthProvider } from './auth/context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ClassesPage from './classes/ClassesPage';
import MainLayout from './main/MainLayout';
import ProjectForm from './project-form/ProjectForm';
import AccountSettings from './account-settings/AccountSettings';
import ClassForm from './class-form/ClassForm'
import GroupForm from './group-form/GroupForm';
import PhaseForm from './phase-form/PhaseForm';
import ExerciseForm from './exercise-form/ExerciseForm';
import ProfilePage from './profile-page/Profile';
import VerificationPage from './auth/email-validation/emailVerificationPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path='/' element={<Navigate to={'/auth'} replace/>} />

          <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/classes" element={<div><ClassesPage /></div>} />
            <Route path="/test" element={<div>صفحه تست (محتوای این مسیر)</div>} />
            <Route path="/class/edit/:classId" element={<ClassForm formType='edit' />} />
            <Route path="/class/create/" element={<ClassForm />} />
            <Route path="/group/edit/:groupId" element={<GroupForm formType='edit' />} />
            <Route path="project/:projectId/group/create/" element={<GroupForm />} />
            <Route path="class/:classId/project/edit/:projectId" element={<ProjectForm formType='edit' />} />
            <Route path="class/:classId/project/create/" element={<ProjectForm />} />
            <Route path="project/:projectId/phase/edit/:phaseId" element={<PhaseForm formType='edit' />} />
            <Route path="project/:projectId/phase/create/" element={<PhaseForm />} />
            <Route path="class/:classId/exercise/edit/:exerciseId" element={<ExerciseForm formType='edit' />} />
            <Route path="class/:classId/exercise/create/" element={<ExerciseForm />} />
          </Route>

          {/* <Route path="*" element={<div>404 Not Found</div>} /> */}

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;