import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface LessonProps {
  lesson: any;
  onNavigate: (view: 'dashboard' | 'learning' | 'lesson' | 'profile', subject?: string) => void;
}

export const Lesson: React.FC<LessonProps> = ({ lesson, onNavigate }) => {
  const { dispatch } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What is the solution to the equation 2x + 5 = 13?',
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
      options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
      correct: 'x = 4',
      explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4'
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: 'Which of the following is equivalent to (x + 3)²?',
      imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=300&fit=crop',
      options: ['x² + 6x + 9', 'x² + 3x + 9', 'x² + 6x + 6', 'x² + 9'],
      correct: 'x² + 6x + 9',
      explanation: 'Use the formula (a + b)² = a² + 2ab + b²'
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: 'What is the vertex of the parabola y = x² - 4x + 3?',
      imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop',
      options: ['(2, -1)', '(-2, 1)', '(1, 0)', '(4, 3)'],
      correct: '(2, -1)',
      explanation: 'Complete the square or use the vertex formula x = -b/2a'
    }
  ];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Lesson completed
      const earnedXP = Math.floor((score / questions.length) * lesson.xp);
      dispatch({ type: 'ADD_XP', payload: earnedXP });
      dispatch({ type: 'COMPLETE_LESSON', payload: lesson.id });
      onNavigate('learning');
    }
  };

  const isCorrect = selectedAnswer === questions[currentQuestion].correct;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onNavigate('learning')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 mx-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <span className="text-sm text-gray-600">
          {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {questions[currentQuestion].question}
        </h2>

        {/* Question Image */}
        {questions[currentQuestion].imageUrl && (
          <div className="mb-8 flex justify-center">
            <img
              src={questions[currentQuestion].imageUrl}
              alt="Question illustration"
              className="max-w-full h-auto max-h-64 rounded-lg border border-gray-200 shadow-sm"
            />
          </div>
        )}
        {/* Answer Options */}
        <div className="space-y-4 mb-8">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedAnswer === option
                  ? showResult
                    ? option === questions[currentQuestion].correct
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{option}</span>
                {showResult && selectedAnswer === option && (
                  option === questions[currentQuestion].correct ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <X className="w-6 h-6 text-red-500" />
                  )
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Result and Explanation */}
        {showResult && (
          <div className={`p-6 rounded-lg mb-6 ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <X className="w-6 h-6 text-red-500" />
              )}
              <h3 className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h3>
            </div>
            <p className={`${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {questions[currentQuestion].explanation}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div></div>
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedAnswer
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Check Answer</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              <span>{currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Lesson'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};