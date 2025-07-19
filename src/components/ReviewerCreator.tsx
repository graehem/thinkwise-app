import React, { useState } from 'react';
import { ArrowLeft, Plus, Settings, Play, Save, Trash2, Clock, Shuffle, Eye, RotateCcw } from 'lucide-react';
import { useAdmin, Question, ReviewSession } from '../contexts/AdminContext';
import { useUser } from '../contexts/UserContext';

interface ReviewerCreatorProps {
  onNavigate: (view: string) => void;
}

export const ReviewerCreator: React.FC<ReviewerCreatorProps> = ({ onNavigate }) => {
  const { state: adminState, dispatch } = useAdmin();
  const { state: userState } = useUser();
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [reviewSettings, setReviewSettings] = useState({
    title: '',
    description: '',
    timeLimit: 0,
    randomizeQuestions: true,
    showExplanations: true,
    allowRetakes: true
  });
  const [activeTab, setActiveTab] = useState<'questions' | 'settings'>('questions');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredQuestions = adminState.questions.filter(question => {
    const subjectMatch = filterSubject === 'all' || question.subject === filterSubject;
    const difficultyMatch = filterDifficulty === 'all' || question.difficulty === filterDifficulty;
    return subjectMatch && difficultyMatch;
  });

  const handleQuestionToggle = (question: Question) => {
    setSelectedQuestions(prev => {
      const isSelected = prev.some(q => q.id === question.id);
      if (isSelected) {
        return prev.filter(q => q.id !== question.id);
      } else {
        return [...prev, question];
      }
    });
  };

  const handleSaveReviewer = () => {
    if (!reviewSettings.title.trim() || selectedQuestions.length === 0) {
      alert('Please provide a title and select at least one question.');
      return;
    }

    const newReviewSession: ReviewSession = {
      id: Date.now().toString(),
      title: reviewSettings.title,
      description: reviewSettings.description,
      questions: selectedQuestions,
      settings: {
        timeLimit: reviewSettings.timeLimit > 0 ? reviewSettings.timeLimit : undefined,
        randomizeQuestions: reviewSettings.randomizeQuestions,
        showExplanations: reviewSettings.showExplanations,
        allowRetakes: reviewSettings.allowRetakes
      },
      createdBy: userState.user.id,
      createdAt: new Date()
    };

    dispatch({ type: 'ADD_REVIEW_SESSION', payload: newReviewSession });
    alert('Review session created successfully!');
    onNavigate('reviewer-list');
  };

  const handleStartReview = () => {
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question to start the review.');
      return;
    }
    // Navigate to review session with selected questions
    onNavigate('review-session');
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
            <h1 className="text-3xl font-bold text-gray-900">Create Custom Reviewer</h1>
            <p className="text-gray-600">Build your personalized study session</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleStartReview}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Start Review</span>
          </button>
          <button
            onClick={handleSaveReviewer}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Reviewer</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Selected Questions</p>
              <p className="text-2xl font-bold text-indigo-600">{selectedQuestions.length}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-lg">📝</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-green-600">
                {selectedQuestions.reduce((sum, q) => sum + q.points, 0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Est. Time</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.ceil(selectedQuestions.length * 1.5)} min
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Questions</p>
              <p className="text-2xl font-bold text-purple-600">{filteredQuestions.length}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-lg">📚</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('questions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'questions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Select Questions
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'settings'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Review Settings
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'questions' && (
            <div>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>
                        {subject === 'all' ? 'All Subjects' : subject}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {filteredQuestions.map(question => {
                  const isSelected = selectedQuestions.some(q => q.id === question.id);
                  return (
                    <div
                      key={question.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleQuestionToggle(question)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              question.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                              question.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {question.difficulty}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {question.subject}
                            </span>
                            <span className="text-sm text-gray-600">{question.points} pts</span>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-1">{question.question}</h3>
                          <p className="text-sm text-gray-600">Topic: {question.topic}</p>
                          {question.imageUrl && (
                            <div className="mt-2">
                              <img
                                src={question.imageUrl}
                                alt="Question"
                                className="w-12 h-12 object-cover rounded border border-gray-200"
                              />
                            </div>
                          )}
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-500'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && <span className="text-white text-sm">✓</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Title *</label>
                <input
                  type="text"
                  value={reviewSettings.title}
                  onChange={(e) => setReviewSettings(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter review session title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={reviewSettings.description}
                  onChange={(e) => setReviewSettings(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Describe what this review covers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                <input
                  type="number"
                  value={reviewSettings.timeLimit}
                  onChange={(e) => setReviewSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0 for no time limit"
                  min="0"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shuffle className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Randomize Questions</h3>
                      <p className="text-sm text-gray-600">Shuffle question order for each attempt</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reviewSettings.randomizeQuestions}
                      onChange={(e) => setReviewSettings(prev => ({ ...prev, randomizeQuestions: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Show Explanations</h3>
                      <p className="text-sm text-gray-600">Display explanations after each question</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reviewSettings.showExplanations}
                      onChange={(e) => setReviewSettings(prev => ({ ...prev, showExplanations: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Allow Retakes</h3>
                      <p className="text-sm text-gray-600">Let users retake this review session</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reviewSettings.allowRetakes}
                      onChange={(e) => setReviewSettings(prev => ({ ...prev, allowRetakes: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};