import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Upload, Download, Search, Filter } from 'lucide-react';
import { useAdmin, Question, Module } from '../contexts/AdminContext';

interface AdminPanelProps {
  onNavigate: (view: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  const { state, dispatch } = useAdmin();
  const [activeTab, setActiveTab] = useState<'questions' | 'modules'>('questions');
  const [searchTerm, setSearchTerm] = useState('');
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const [questionForm, setQuestionForm] = useState({
    type: 'multiple-choice' as Question['type'],
    subject: 'Mathematics',
    topic: '',
    difficulty: 'intermediate' as Question['difficulty'],
    question: '',
    imageUrl: '',
    options: ['', '', '', ''],
    correct: '',
    explanation: '',
    points: 10,
    tags: ''
  });

  const [moduleForm, setModuleForm] = useState({
    title: '',
    subject: 'Mathematics',
    description: '',
    difficulty: 'intermediate' as Module['difficulty'],
    estimatedTime: 30,
    prerequisites: ''
  });

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Engineering'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const questionTypes = ['multiple-choice', 'true-false', 'fill-blank', 'drag-drop', 'code-completion'];

  const filteredQuestions = state.questions.filter(question =>
    question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredModules = state.modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveQuestion = () => {
    if (!questionForm.question.trim() || !questionForm.topic.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    const question: Question = {
      id: editingQuestion?.id || Date.now().toString(),
      type: questionForm.type,
      subject: questionForm.subject,
      topic: questionForm.topic,
      difficulty: questionForm.difficulty,
      question: questionForm.question,
      imageUrl: questionForm.imageUrl || undefined,
      options: questionForm.type === 'multiple-choice' ? questionForm.options.filter(opt => opt.trim()) : undefined,
      correct: questionForm.correct,
      explanation: questionForm.explanation,
      points: questionForm.points,
      tags: questionForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdBy: 'admin',
      createdAt: editingQuestion?.createdAt || new Date()
    };

    if (editingQuestion) {
      dispatch({ type: 'UPDATE_QUESTION', payload: question });
    } else {
      dispatch({ type: 'ADD_QUESTION', payload: question });
    }

    resetQuestionForm();
    setShowQuestionForm(false);
    setEditingQuestion(null);
  };

  const handleSaveModule = () => {
    if (!moduleForm.title.trim() || !moduleForm.description.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    const module: Module = {
      id: editingModule?.id || Date.now().toString(),
      title: moduleForm.title,
      subject: moduleForm.subject,
      description: moduleForm.description,
      difficulty: moduleForm.difficulty,
      questions: editingModule?.questions || [],
      estimatedTime: moduleForm.estimatedTime,
      prerequisites: moduleForm.prerequisites.split(',').map(req => req.trim()).filter(req => req),
      createdBy: 'admin',
      createdAt: editingModule?.createdAt || new Date(),
      isPublished: editingModule?.isPublished || false
    };

    if (editingModule) {
      dispatch({ type: 'UPDATE_MODULE', payload: module });
    } else {
      dispatch({ type: 'ADD_MODULE', payload: module });
    }

    resetModuleForm();
    setShowModuleForm(false);
    setEditingModule(null);
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      type: 'multiple-choice',
      subject: 'Mathematics',
      topic: '',
      difficulty: 'intermediate',
      question: '',
      imageUrl: '',
      options: ['', '', '', ''],
      correct: '',
      explanation: '',
      points: 10,
      tags: ''
    });
  };

  const resetModuleForm = () => {
    setModuleForm({
      title: '',
      subject: 'Mathematics',
      description: '',
      difficulty: 'intermediate',
      estimatedTime: 30,
      prerequisites: ''
    });
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionForm({
      type: question.type,
      subject: question.subject,
      topic: question.topic,
      difficulty: question.difficulty,
      question: question.question,
      imageUrl: question.imageUrl || '',
      options: question.options || ['', '', '', ''],
      correct: Array.isArray(question.correct) ? question.correct.join(', ') : question.correct,
      explanation: question.explanation,
      points: question.points,
      tags: question.tags.join(', ')
    });
    setShowQuestionForm(true);
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setModuleForm({
      title: module.title,
      subject: module.subject,
      description: module.description,
      difficulty: module.difficulty,
      estimatedTime: module.estimatedTime,
      prerequisites: module.prerequisites.join(', ')
    });
    setShowModuleForm(true);
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      dispatch({ type: 'DELETE_QUESTION', payload: id });
    }
  };

  const handleDeleteModule = (id: string) => {
    if (confirm('Are you sure you want to delete this module?')) {
      dispatch({ type: 'DELETE_MODULE', payload: id });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">Manage questions, modules, and learning materials</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              const questions = state.questions.map(q => ({
                ...q,
                createdAt: q.createdAt.toISOString(),
                tags: q.tags.join(', ')
              }));
              const dataStr = JSON.stringify(questions, null, 2);
              const dataBlob = new Blob([dataStr], {type: 'application/json'});
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `thinkwise-questions-${new Date().toISOString().split('T')[0]}.json`;
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          <button 
            onClick={() => {
              const questions = state.questions.map(q => ({
                ...q,
                createdAt: q.createdAt.toISOString(),
                tags: q.tags.join(', ')
              }));
              const dataStr = JSON.stringify(questions, null, 2);
              const dataBlob = new Blob([dataStr], {type: 'application/json'});
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `thinkwise-questions-${new Date().toISOString().split('T')[0]}.json`;
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-blue-600">{state.questions.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">❓</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Modules</p>
              <p className="text-2xl font-bold text-green-600">{state.modules.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Review Sessions</p>
              <p className="text-2xl font-bold text-purple-600">{state.reviewSessions.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published Modules</p>
              <p className="text-2xl font-bold text-orange-600">
                {state.modules.filter(m => m.isPublished).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search questions, modules, or topics..."
            />
          </div>
          <button
            onClick={() => {
              if (activeTab === 'questions') {
                setShowQuestionForm(true);
              } else {
                setShowModuleForm(true);
              }
            }}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeTab === 'questions' ? 'Question' : 'Module'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
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
              Questions ({state.questions.length})
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'modules'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Modules ({state.modules.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {filteredQuestions.map(question => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {question.type}
                        </span>
                        <span className="text-sm text-gray-600">{question.points} pts</span>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{question.question}</h3>
                      <p className="text-sm text-gray-600 mb-2">Topic: {question.topic}</p>
                      {question.imageUrl && (
                        <div className="mb-2">
                          <img
                            src={question.imageUrl}
                            alt="Question"
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                          />
                        </div>
                      )}
                      {question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {question.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
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

          {activeTab === 'modules' && (
            <div className="space-y-4">
              {filteredModules.map(module => (
                <div key={module.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          module.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          module.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {module.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {module.subject}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          module.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {module.isPublished ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-sm text-gray-600">{module.estimatedTime} min</span>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{module.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                      <p className="text-sm text-gray-500">
                        {module.questions.length} questions • Created {module.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditModule(module)}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteModule(module.id)}
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

      {/* Question Form Modal */}
      {showQuestionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                      value={questionForm.subject}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                    <input
                      type="text"
                      value={questionForm.topic}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, topic: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Linear Equations"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={questionForm.type}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, type: e.target.value as Question['type'] }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {questionTypes.map(type => (
                        <option key={type} value={type}>
                          {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      value={questionForm.difficulty}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, difficulty: e.target.value as Question['difficulty'] }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                    <input
                      type="number"
                      value={questionForm.points}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, points: parseInt(e.target.value) || 10 }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                  <textarea
                    value={questionForm.question}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    placeholder="Enter the question text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Image (Optional)</label>
                  <div className="space-y-3">
                    <input
                      type="url"
                      value={questionForm.imageUrl || ''}
                      onChange={(e) => setQuestionForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="mb-2">💡 <strong>Free Image Sources:</strong></p>
                      <ul className="space-y-1 text-xs">
                        <li>• <a href="https://unsplash.com" target="_blank" className="text-blue-600 hover:underline">Unsplash</a> - High-quality photos</li>
                        <li>• <a href="https://www.pexels.com" target="_blank" className="text-blue-600 hover:underline">Pexels</a> - Free stock photos</li>
                        <li>• <a href="https://imgur.com" target="_blank" className="text-blue-600 hover:underline">Imgur</a> - Upload your own images</li>
                        <li>• <a href="https://postimg.cc" target="_blank" className="text-blue-600 hover:underline">PostImg</a> - Simple image hosting</li>
                      </ul>
                    </div>
                    {questionForm.imageUrl && (
                      <div className="border border-gray-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                        <img
                          src={questionForm.imageUrl}
                          alt="Question preview"
                          className="max-w-full h-auto max-h-48 rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling!.style.display = 'block';
                          }}
                        />
                        <div className="hidden text-red-600 text-sm mt-2">
                          ❌ Failed to load image. Please check the URL.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {questionForm.type === 'multiple-choice' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Answer Options</label>
                    <div className="space-y-2">
                      {questionForm.options.map((option, index) => (
                        <input
                          key={index}
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...questionForm.options];
                            newOptions[index] = e.target.value;
                            setQuestionForm(prev => ({ ...prev, options: newOptions }));
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder={`Option ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                  <input
                    type="text"
                    value={questionForm.correct}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, correct: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter the correct answer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
                  <textarea
                    value={questionForm.explanation}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, explanation: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    placeholder="Explain why this is the correct answer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={questionForm.tags}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., algebra, equations, solving"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowQuestionForm(false);
                    setEditingQuestion(null);
                    resetQuestionForm();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveQuestion}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  {editingQuestion ? 'Update' : 'Save'} Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Module Form Modal */}
      {showModuleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingModule ? 'Edit Module' : 'Add New Module'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module Title</label>
                  <input
                    type="text"
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Introduction to Linear Algebra"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                      value={moduleForm.subject}
                      onChange={(e) => setModuleForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      value={moduleForm.difficulty}
                      onChange={(e) => setModuleForm(prev => ({ ...prev, difficulty: e.target.value as Module['difficulty'] }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={4}
                    placeholder="Describe what students will learn in this module"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time (minutes)</label>
                  <input
                    type="number"
                    value={moduleForm.estimatedTime}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) || 30 }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites (comma-separated)</label>
                  <input
                    type="text"
                    value={moduleForm.prerequisites}
                    onChange={(e) => setModuleForm(prev => ({ ...prev, prerequisites: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., basic-algebra, arithmetic"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowModuleForm(false);
                    setEditingModule(null);
                    resetModuleForm();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveModule}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  {editingModule ? 'Update' : 'Save'} Module
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};