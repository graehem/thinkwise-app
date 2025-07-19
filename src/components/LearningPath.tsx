import React from 'react';
import { ArrowLeft, Lock, CheckCircle, Clock } from 'lucide-react';

interface LearningPathProps {
  subject: string;
  onNavigate: (view: 'dashboard' | 'learning' | 'lesson' | 'profile', subject?: string, lesson?: any) => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({ subject, onNavigate }) => {
  const lessons = [
    { id: 1, title: 'Introduction to Algebra', status: 'completed', xp: 20, time: '15 min' },
    { id: 2, title: 'Linear Equations', status: 'completed', xp: 25, time: '20 min' },
    { id: 3, title: 'Quadratic Functions', status: 'current', xp: 30, time: '25 min' },
    { id: 4, title: 'Polynomial Operations', status: 'locked', xp: 35, time: '30 min' },
    { id: 5, title: 'Factoring', status: 'locked', xp: 40, time: '35 min' },
    { id: 6, title: 'Rational Expressions', status: 'locked', xp: 45, time: '40 min' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'current':
        return <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>;
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'current':
        return 'border-blue-200 bg-blue-50';
      case 'locked':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 capitalize">{subject}</h1>
          <p className="text-gray-600">Master the fundamentals and advanced concepts</p>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Progress</h2>
          <span className="text-sm text-gray-600">2 of 6 lessons completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: '33%' }}
          ></div>
        </div>
        <div className="flex justify-between mt-4 text-sm">
          <span className="text-gray-600">33% Complete</span>
          <span className="text-gray-600">45 XP earned</span>
        </div>
      </div>

      {/* Learning Path */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Path</h2>
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="relative">
            {/* Connector Line */}
            {index < lessons.length - 1 && (
              <div className="absolute left-12 top-20 w-0.5 h-8 bg-gray-200"></div>
            )}
            
            <div
              className={`relative flex items-center p-6 rounded-xl border-2 transition-all duration-200 ${
                getStatusColor(lesson.status)
              } ${
                lesson.status === 'current' || lesson.status === 'completed'
                  ? 'cursor-pointer hover:shadow-md'
                  : 'cursor-not-allowed'
              }`}
              onClick={() => {
                if (lesson.status === 'current' || lesson.status === 'completed') {
                  onNavigate('lesson', subject, lesson);
                }
              }}
            >
              <div className="flex items-center space-x-6 w-full">
                <div className="flex-shrink-0">
                  {getStatusIcon(lesson.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-semibold ${
                    lesson.status === 'locked' ? 'text-gray-400' : 'text-gray-900'
                  }`}>
                    {lesson.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{lesson.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-500">💎 {lesson.xp} XP</span>
                    </div>
                  </div>
                </div>
                
                {lesson.status === 'current' && (
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                    Continue
                  </button>
                )}
                
                {lesson.status === 'completed' && (
                  <button className="bg-green-100 text-green-700 px-6 py-2 rounded-lg font-medium hover:bg-green-200 transition-colors">
                    Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};