import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context & Components
import { AuthProvider } from './auth/context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './main/MainLayout';

// Pages & Forms
import AuthPage from './auth/AuthPage';
import EmailVerificationPage from './auth/email-validation/EmailVerificationPage';
import EmailConfirmedPage from './auth/email-validation/EmailConfirmedPage';
import Dashboard from './dashboard/Dashboard';
import AccountSettings from './account-settings/AccountSettings';
import ProfilePage from './profile-page/Profile';
import ClassesPage from './classes/ClassesPage';
import ClassPage from './class-page/ClassPage';
import ProjectsPage from './project-list/ProjectsPage';
import ProjectManagementPage from './project-management-page/ProjectManagementPage';
import ClassForm from './class-form/ClassForm';
import ProjectForm from './project-form/ProjectForm';
import GroupForm from './group-form/GroupForm';
import PhaseForm from './phase-form/PhaseForm';
import ExamForm from './exam-form/ExamForm';
import ExerciseForm from './exercise-form/ExerciseForm';
import TestPage from './Test';
import NotFound from './components/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* =================================================================
           * AUTHENTICATION ROUTES (Public)
           * ================================================================= */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/confirmation" element={<EmailConfirmedPage />} />
          <Route path="/verification" element={<EmailVerificationPage />} />
          <Route path='/' element={<Navigate to={'/auth'} replace />} />

          {/* =================================================================
           *  MAIN APPLICATION ROUTES (Private)
           *  ================================================================== */}
          <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            {/* --- Core Pages --- */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/test" element={<TestPage />} />

            {/* --- Resource List Pages --- */}
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path='/exams' element={<div><h1>Exams</h1></div>} />
            <Route path='/exercises' element={<div><h1>Exercises</h1></div>} />

            {/* --- Class Routes (Correct Order) --- */}
            <Route path="/class/create" element={<ClassForm />} />
            <Route path="/class/edit/:classId" element={<ClassForm formType='edit' />} />
            <Route path="/class/:classId/project/create" element={<ProjectForm />} />
            <Route path="/class/:classId/exam/create" element={<ExamForm />} />
            <Route path="/class/:classId/exercise/create" element={<ExerciseForm />} />
            <Route path="/class/:classId" element={<ClassPage />} />

            {/* --- Project Routes (Correct Order) --- */}
            <Route path="/project/edit/:projectId" element={<ProjectForm formType='edit' />} />
            <Route path="/project/:projectId/group/create" element={<GroupForm />} />
            <Route path="/project/:projectId/group/edit/:groupId" element={<GroupForm formType='edit' />} />
            <Route path="/project/:projectId/phase/create" element={<PhaseForm />} />
            <Route path="/project/:projectId" element={<ProjectManagementPage />} />

            {/* --- Phase Routes (Correct Order) --- */}
            <Route path="/phase/edit/:phaseId" element={<PhaseForm formType='edit' />} />
            <Route path="/phase/:phaseId" element={<div><h1>Phase Detail</h1></div>} />

            {/* --- Exam Routes --- */}
            <Route path="/class/:classId/exam/edit/:examId" element={<ExamForm formType='edit' />} />
            <Route path="/exam/edit/:examId" element={<ExamForm formType='edit' />} />

            {/* --- Exercise Routes (Correct Order) --- */}
            <Route path="/exercise/edit/:exerciseId" element={<ExerciseForm formType='edit' />} />
            <Route path="/exercise/:exerciseId" element={<div><h1>Exercise Detail</h1></div>} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;