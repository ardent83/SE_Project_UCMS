import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './auth/AuthPage'
import Dashboard from './Dashboard';
import { AuthProvider } from './auth/context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ClassesPage from './classes/ClassesPage'; 
import MainLayout from './main/MainLayout';

function App() {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/classes" element={<MainLayout><ClassesPage /> </MainLayout>} />
          <Route path='/' element={<Navigate to={'/auth'} replace/>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
