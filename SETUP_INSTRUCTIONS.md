# ThinkWise Setup Instructions

## Quick Setup Guide

### 1. Create New Vite Project
```bash
npm create vite@latest thinkwise-learning -- --template react-ts
cd thinkwise-learning
npm install
```

### 2. Install Dependencies
```bash
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Replace Files
Copy all the files from this project into your new Vite project, replacing the default files.

### 4. Start Development
```bash
npm run dev
```

## File Structure
```
thinkwise-learning/
├── public/
├── src/
│   ├── components/
│   │   ├── AdminPanel.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Header.tsx
│   │   ├── Lesson.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── Profile.tsx
│   │   ├── LearningPath.tsx
│   │   ├── ReviewerCreator.tsx
│   │   ├── ReviewerList.tsx
│   │   └── DownloadCenter.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── UserContext.tsx
│   │   └── AdminContext.tsx
│   ├── utils/
│   │   └── downloadUtils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── postcss.config.js
└── README.md
```

## Demo Credentials
- Email: demo@thinkwise.com
- Password: demo123