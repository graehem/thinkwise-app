import React from 'react';
import { Brain, User, Home, BookOpen, Trophy, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: 'dashboard' | 'learning' | 'lesson' | 'profile') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { logout } = useAuth();
  const { state } = useUser();
  const { user } = state;

  const handleLogout = () => {
    logout();
  };
  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ThinkWise</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('learning')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'learning'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Learn
            </button>
            <button
              onClick={() => onNavigate('reviewer-list')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'reviewer-list' || currentView === 'reviewer-creator'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Reviewers
            </button>
            <button className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </button>
          </nav>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">🔥 {user.streak}</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">💎 {user.totalXP}</span>
              </div>
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            {/* User Menu */}
            <div className="relative group">
              <button
                onClick={() => onNavigate('profile')}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                  {user.avatar}
                </div>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <button
                    onClick={() => onNavigate('profile')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};