import React from 'react';
import { ArrowLeft, Play, Edit, Trash2, Clock, Target, Users } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useUser } from '../contexts/UserContext';

interface ReviewerListProps {
  onNavigate: (view: string, data?: any) => void;
}

export const ReviewerList: React.FC<ReviewerListProps> = ({ onNavigate }) => {
  const { state: adminState, dispatch } = useAdmin();
  const { state: userState } = useUser();

  const userReviewSessions = adminState.reviewSessions.filter(
    session => session.createdBy === userState.user.id
  );

  const handleDeleteReviewer = (id: string) => {
    if (confirm('Are you sure you want to delete this review session?')) {
      dispatch({ type: 'DELETE_REVIEW_SESSION', payload: id });
    }
  };

  const handleStartReview = (session: any) => {
    onNavigate('review-session', session);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Review Sessions</h1>
            <p className="text-gray-600">Manage and take your custom review sessions</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('reviewer-creator')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Create New Reviewer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviewers</p>
              <p className="text-2xl font-bold text-indigo-600">{userReviewSessions.length}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-green-600">
                {userReviewSessions.reduce((sum, session) => sum + session.questions.length, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">❓</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Questions</p>
              <p className="text-2xl font-bold text-purple-600">
                {userReviewSessions.length > 0 
                  ? Math.round(userReviewSessions.reduce((sum, session) => sum + session.questions.length, 0) / userReviewSessions.length)
                  : 0
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Review Sessions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Review Sessions</h2>
        </div>
        
        <div className="p-6">
          {userReviewSessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Review Sessions Yet</h3>
              <p className="text-gray-600 mb-6">Create your first custom review session to get started!</p>
              <button
                onClick={() => onNavigate('reviewer-creator')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Create Your First Reviewer
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userReviewSessions.map(session => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.title}</h3>
                      {session.description && (
                        <p className="text-gray-600 mb-4">{session.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{session.questions.length} questions</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {session.settings.timeLimit 
                              ? `${session.settings.timeLimit} min limit`
                              : 'No time limit'
                            }
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <span className="text-xs">
                            Est. {Math.ceil(session.questions.length * 1.5)} min
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-4">
                        {session.settings.randomizeQuestions && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            Randomized
                          </span>
                        )}
                        {session.settings.showExplanations && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            With Explanations
                          </span>
                        )}
                        {session.settings.allowRetakes && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                            Retakes Allowed
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-3">
                        Created {session.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-6">
                      <button
                        onClick={() => handleStartReview(session)}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start</span>
                      </button>
                      
                      <button
                        onClick={() => onNavigate('reviewer-creator', session)}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteReviewer(session.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};