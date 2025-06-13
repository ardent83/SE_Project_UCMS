import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './auth/AuthPage';
import AccountSettings from './account-settings/AccountSettings';
import ProjectManagementPage from './project-management-page/ProjectManagementPage';
import Dashboard from './dashboard/Dashboard';
import { AuthProvider } from './auth/context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ClassesPage from './classes/ClassesPage';
import ClassPage from './class-page/ClassPage';
import MainLayout from './main/MainLayout';
import ProjectForm from './project-form/ProjectForm';
import ClassForm from './class-form/ClassForm'
import GroupForm from './group-form/GroupForm';
import PhaseForm from './phase-form/PhaseForm';
import ExerciseForm from './exercise-form/ExerciseForm';
import ProfilePage from './profile-page/Profile';
import ExamForm from './exam-form/ExamForm';
import TestPage from './Test';
import EmailVerificationPage from './auth/email-validation/EmailVerificationPage';
import EmailConfirmedPage from './auth/email-validation/EmailConfirmedPage';
import ProjectsPage from './project-list/ProjectsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/confirmation" element={<EmailConfirmedPage />} />
          <Route path="/verification" element={<EmailVerificationPage />} />
          <Route path='/' element={<Navigate to={'/auth'} replace />} />

          <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/test" element={<TestPage />} />

            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path='/exams' element={<div><h1>Exams</h1></div>} />
            <Route path='/exercises' element={<div><h1>Exercises</h1></div>} />

            <Route path="/class/:classId" element={<ClassPage />} />
            <Route path="/project-management/:projectId" element={<ProjectManagementPage />} />
            <Route path="/phase/:phaseId" element={<div><h1>Phase</h1></div>} />
            <Route path="/exercise/:exerciseId" element={<div><h1>Exercise</h1></div>} />


            {/* Forms */}
            <Route path="/class/create/" element={<ClassForm />} />
            <Route path="/class/edit/:classId" element={<ClassForm formType='edit' />} />

            <Route path="/class/:classId/exam/create/" element={<ExamForm />} />
            {/* برای صفحه کلاس */}
            <Route path="/class/:classId/exam/edit/:examId" element={<ExamForm formType='edit' />} />
            {/* ‌برای لیست امتحان‌ها */}
            <Route path="/exam/edit/:examId" element={<ExamForm formType='edit' />} />

            <Route path="/class/:classId/exercise/create/" element={<ExerciseForm />} />
            <Route path="/exercise/edit/:exerciseId" element={<ExerciseForm formType='edit' />} />

            <Route path="/class/:classId/project/create/" element={<ProjectForm />} />
            <Route path="/project/edit/:projectId" element={<ProjectForm formType='edit' />} />

            {/* جفتش باید ایدی پروژه رو داشته باشه */}
            <Route path="/project/:projectId/group/create/" element={<GroupForm />} />
            <Route path="/project/:projectId/group/edit/:groupId" element={<GroupForm formType='edit' />} />

            <Route path="/project/:projectId/phase/create/" element={<PhaseForm />} />
            <Route path="/phase/edit/:phaseId" element={<PhaseForm formType='edit' />} />
          </Route>

          {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;