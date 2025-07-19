import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'drag-drop' | 'code-completion';
  subject: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  imageUrl?: string;
  options?: string[];
  correct: string | string[];
  explanation: string;
  points: number;
  tags: string[];
  createdBy: string;
  createdAt: Date;
}

interface Module {
  id: string;
  title: string;
  subject: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: Question[];
  estimatedTime: number;
  prerequisites: string[];
  createdBy: string;
  createdAt: Date;
  isPublished: boolean;
}

interface ReviewSession {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  settings: {
    timeLimit?: number;
    randomizeQuestions: boolean;
    showExplanations: boolean;
    allowRetakes: boolean;
  };
  createdBy: string;
  createdAt: Date;
}

interface AdminState {
  questions: Question[];
  modules: Module[];
  reviewSessions: ReviewSession[];
  isLoading: boolean;
}

type AdminAction =
  | { type: 'ADD_QUESTION'; payload: Question }
  | { type: 'UPDATE_QUESTION'; payload: Question }
  | { type: 'DELETE_QUESTION'; payload: string }
  | { type: 'ADD_MODULE'; payload: Module }
  | { type: 'UPDATE_MODULE'; payload: Module }
  | { type: 'DELETE_MODULE'; payload: string }
  | { type: 'ADD_REVIEW_SESSION'; payload: ReviewSession }
  | { type: 'UPDATE_REVIEW_SESSION'; payload: ReviewSession }
  | { type: 'DELETE_REVIEW_SESSION'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AdminState = {
  questions: [
    {
      id: '1',
      type: 'multiple-choice',
      subject: 'Mathematics',
      topic: 'Algebra',
      difficulty: 'intermediate',
      question: 'What is the solution to 2x + 5 = 13?',
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
      options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
      correct: 'x = 4',
      explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
      points: 10,
      tags: ['linear-equations', 'solving'],
      createdBy: 'admin',
      createdAt: new Date()
    },
    {
      id: '2',
      type: 'multiple-choice',
      subject: 'Physics',
      topic: 'Mechanics',
      difficulty: 'beginner',
      question: 'What is the formula for calculating force?',
      imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop',
      options: ['F = ma', 'F = mv', 'F = m/a', 'F = a/m'],
      correct: 'F = ma',
      explanation: 'Newton\'s second law states that Force equals mass times acceleration',
      points: 5,
      tags: ['newton-laws', 'force', 'acceleration'],
      createdBy: 'admin',
      createdAt: new Date()
    },
    {
      id: '3',
      type: 'multiple-choice',
      subject: 'Chemistry',
      topic: 'Periodic Table',
      difficulty: 'intermediate',
      question: 'What is the chemical symbol for Gold?',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      options: ['Go', 'Gd', 'Au', 'Ag'],
      correct: 'Au',
      explanation: 'Gold\'s symbol Au comes from its Latin name "aurum"',
      points: 8,
      tags: ['periodic-table', 'elements', 'symbols'],
      createdBy: 'admin',
      createdAt: new Date()
    }
  ],
  modules: [
    {
      id: '1',
      title: 'Introduction to Linear Algebra',
      subject: 'Mathematics',
      description: 'Learn the fundamentals of linear algebra including vectors, matrices, and systems of equations.',
      difficulty: 'intermediate',
      questions: [],
      estimatedTime: 45,
      prerequisites: ['basic-algebra'],
      createdBy: 'admin',
      createdAt: new Date(),
      isPublished: true
    }
  ],
  reviewSessions: [],
  isLoading: false
};

const adminReducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case 'ADD_QUESTION':
      return {
        ...state,
        questions: [...state.questions, action.payload]
      };
    case 'UPDATE_QUESTION':
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.id ? action.payload : q
        )
      };
    case 'DELETE_QUESTION':
      return {
        ...state,
        questions: state.questions.filter(q => q.id !== action.payload)
      };
    case 'ADD_MODULE':
      return {
        ...state,
        modules: [...state.modules, action.payload]
      };
    case 'UPDATE_MODULE':
      return {
        ...state,
        modules: state.modules.map(m => 
          m.id === action.payload.id ? action.payload : m
        )
      };
    case 'DELETE_MODULE':
      return {
        ...state,
        modules: state.modules.filter(m => m.id !== action.payload)
      };
    case 'ADD_REVIEW_SESSION':
      return {
        ...state,
        reviewSessions: [...state.reviewSessions, action.payload]
      };
    case 'UPDATE_REVIEW_SESSION':
      return {
        ...state,
        reviewSessions: state.reviewSessions.map(r => 
          r.id === action.payload.id ? action.payload : r
        )
      };
    case 'DELETE_REVIEW_SESSION':
      return {
        ...state,
        reviewSessions: state.reviewSessions.filter(r => r.id !== action.payload)
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

const AdminContext = createContext<{
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
} | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  return (
    <AdminContext.Provider value={{ state, dispatch }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export type { Question, Module, ReviewSession };