import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  streak: number;
  totalXP: number;
  level: number;
  completedLessons: string[];
  achievements: string[];
  dailyGoal: number;
  todayXP: number;
}

interface UserState {
  user: User;
  isLoading: boolean;
}

type UserAction =
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'COMPLETE_LESSON'; payload: string }
  | { type: 'ADD_ACHIEVEMENT'; payload: string }
  | { type: 'SET_DAILY_GOAL'; payload: number };

const initialUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: '🧑‍🎓',
  streak: 7,
  totalXP: 2450,
  level: 12,
  completedLessons: ['math-algebra-1', 'physics-mechanics-1', 'chemistry-atoms-1'],
  achievements: ['First Lesson', 'Week Streak', 'Math Master'],
  dailyGoal: 50,
  todayXP: 35
};

const initialState: UserState = {
  user: initialUser,
  isLoading: false
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'UPDATE_STREAK':
      return {
        ...state,
        user: { ...state.user, streak: action.payload }
      };
    case 'ADD_XP':
      const newTotalXP = state.user.totalXP + action.payload;
      const newTodayXP = state.user.todayXP + action.payload;
      const newLevel = Math.floor(newTotalXP / 200) + 1;
      return {
        ...state,
        user: {
          ...state.user,
          totalXP: newTotalXP,
          todayXP: newTodayXP,
          level: newLevel
        }
      };
    case 'COMPLETE_LESSON':
      return {
        ...state,
        user: {
          ...state.user,
          completedLessons: [...state.user.completedLessons, action.payload]
        }
      };
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        user: {
          ...state.user,
          achievements: [...state.user.achievements, action.payload]
        }
      };
    case 'SET_DAILY_GOAL':
      return {
        ...state,
        user: { ...state.user, dailyGoal: action.payload }
      };
    default:
      return state;
  }
};

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
} | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};