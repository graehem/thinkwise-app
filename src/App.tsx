import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LearningPath } from './components/LearningPath';
import { Lesson } from './components/Lesson';
import { Profile } from './components/Profile';
import { ReviewerCreator } from './components/ReviewerCreator';
import { ReviewerList } from './components/ReviewerList';
import { AdminPanel } from './components/AdminPanel';
import { UserProvider } from './contexts/UserContext';

const AppContent: React.FC = () => {
  const { state: authState } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [currentData, setCurrentData] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Show authentication pages if not authenticated
  if (!authState.isAuthenticated) {
    if (authMode === 'login') {
      return <LoginPage onSwitchToRegister={() => setAuthMode('register')} />;
    } else {
      return <RegisterPage onSwitchToLogin={() => setAuthMode('login')} />;
    }
  }

  const navigateTo = (view: string, subject?: string, lesson?: any, data?: any) => {
    setCurrentView(view);
    if (subject) setCurrentSubject(subject);
    if (lesson) setCurrentLesson(lesson);
    if (data) setCurrentData(data);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'learning':
        return <LearningPath subject={currentSubject} onNavigate={navigateTo} />;
      case 'lesson':
        return <Lesson lesson={currentLesson} onNavigate={navigateTo} />;
      case 'profile':
        return <Profile onNavigate={navigateTo} />;
      case 'reviewer-creator':
        return <ReviewerCreator onNavigate={navigateTo} />;
      case 'reviewer-list':
        return <ReviewerList onNavigate={navigateTo} />;
      case 'admin-panel':
        return <AdminPanel onNavigate={navigateTo} />;
      default:
        return <Dashboard onNavigate={navigateTo} />;
    }
  };

  return (
    <AdminProvider>
      <UserProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
          <Header currentView={currentView} onNavigate={navigateTo} />
          <main className="pt-16">
            {renderCurrentView()}
          </main>
        </div>
      </UserProvider>
    </AdminProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}


export default App