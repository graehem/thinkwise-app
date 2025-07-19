import React from 'react';
import { ArrowLeft, Settings, Award, Target, TrendingUp, Calendar, Download } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { DownloadCenter } from './DownloadCenter';

interface ProfileProps {
  onNavigate: (view: 'dashboard' | 'learning' | 'lesson' | 'profile') => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const { state } = useUser();
  const { user } = state;
  const [showDownloadCenter, setShowDownloadCenter] = React.useState(false);

  const stats = [
    { label: 'Current Streak', value: `${user.streak} days`, icon: '🔥' },
    { label: 'Total XP', value: user.totalXP.toLocaleString(), icon: '💎' },
    { label: 'Level', value: user.level, icon: '⭐' },
    { label: 'Lessons Completed', value: user.completedLessons.length, icon: '📚' },
  ];

  const achievements = [
    { name: 'First Lesson', icon: '🎯', earned: true, description: 'Complete your first lesson' },
    { name: 'Week Streak', icon: '🔥', earned: true, description: 'Maintain a 7-day streak' },
    { name: 'Math Master', icon: '📐', earned: true, description: 'Complete 10 math lessons' },
    { name: 'Perfect Score', icon: '⭐', earned: true, description: 'Get 100% on a lesson' },
    { name: 'Night Owl', icon: '🦉', earned: false, description: 'Complete lessons after 10 PM' },
    { name: 'Early Bird', icon: '🌅', earned: false, description: 'Complete lessons before 8 AM' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white text-4xl">
            {user.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏆</span>
                <span className="text-lg font-semibold text-gray-900">Level {user.level}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <span className="text-lg font-semibold text-gray-900">{user.achievements.length} Achievements</span>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={() => setShowDownloadCenter(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                achievement.earned
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  achievement.earned ? 'bg-yellow-200' : 'bg-gray-200'
                }`}>
                  <span className="text-2xl">{achievement.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${
                    achievement.earned ? 'text-yellow-800' : 'text-gray-600'
                  }`}>
                    {achievement.name}
                  </h4>
                  <p className={`text-sm ${
                    achievement.earned ? 'text-yellow-700' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.earned && (
                  <div className="text-yellow-600">
                    <Award className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Download Center Modal */}
      {showDownloadCenter && (
        <DownloadCenter onClose={() => setShowDownloadCenter(false)} />
      )}
    </div>
  );
};