import React from 'react';
import { BookOpen, Target, Award, TrendingUp, Clock, Star, Plus, Settings } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface DashboardProps {
  onNavigate: (view: string, subject?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { state } = useUser();
  const { user } = state;

  const subjects = [
    { name: 'Mathematics', icon: '📐', color: 'bg-blue-500', progress: 75, lessons: 24 },
    { name: 'Physics', icon: '⚛️', color: 'bg-purple-500', progress: 60, lessons: 18 },
    { name: 'Chemistry', icon: '🧪', color: 'bg-green-500', progress: 40, lessons: 12 },
    { name: 'Biology', icon: '🧬', color: 'bg-emerald-500', progress: 30, lessons: 8 },
    { name: 'Computer Science', icon: '💻', color: 'bg-indigo-500', progress: 85, lessons: 32 },
    { name: 'Engineering', icon: '⚙️', color: 'bg-orange-500', progress: 20, lessons: 6 },
  ];

  const recentAchievements = [
    { name: 'Week Streak', icon: '🔥', date: '2 days ago' },
    { name: 'Math Master', icon: '🎯', date: '1 week ago' },
    { name: 'Perfect Score', icon: '⭐', date: '1 week ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600">Ready to continue your learning journey?</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-orange-600">{user.streak} days</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total XP</p>
              <p className="text-2xl font-bold text-blue-600">{user.totalXP.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💎</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Level</p>
              <p className="text-2xl font-bold text-purple-600">{user.level}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lessons Completed</p>
              <p className="text-2xl font-bold text-green-600">{user.completedLessons.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Progress */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Daily Goal</h2>
          <span className="text-sm text-gray-600">{user.todayXP} / {user.dailyGoal} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((user.todayXP / user.dailyGoal) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {user.todayXP >= user.dailyGoal ? 'Goal completed! 🎉' : `${user.dailyGoal - user.todayXP} XP to go`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subjects Grid */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                onClick={() => onNavigate('learning', subject.name.toLowerCase())}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${subject.color} rounded-full flex items-center justify-center text-white text-xl`}>
                      {subject.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-gray-600">{subject.lessons} lessons</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${subject.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => onNavigate('reviewer-creator')}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      Create Reviewer
                    </h3>
                    <p className="text-sm text-gray-600">Build custom study sessions</p>
                  </div>
                </div>
              </div>
              
              <div
                onClick={() => onNavigate('reviewer-list')}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      My Reviewers
                    </h3>
                    <p className="text-sm text-gray-600">Access saved review sessions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Achievements</h2>
          <div className="space-y-4">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">{achievement.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{achievement.name}</h3>
                    <p className="text-sm text-gray-600">{achievement.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Admin Panel Access (for demo purposes) */}
          <div className="mt-8">
            <button
              onClick={() => onNavigate('admin-panel')}
              className="w-full flex items-center justify-center space-x-2 bg-gray-800 text-white p-4 rounded-xl hover:bg-gray-900 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};