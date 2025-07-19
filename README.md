# ThinkWise STEM Learning Application

A comprehensive STEM learning platform built with React, TypeScript, and Tailwind CSS.

## Features

- 🎓 **Interactive Learning**: Engaging lessons with visual content
- 📝 **Custom Reviewers**: Create personalized study sessions
- 🏆 **Gamification**: XP system, levels, streaks, and achievements
- 👨‍💼 **Admin Panel**: Manage questions, modules, and content
- 📊 **Progress Tracking**: Detailed analytics and reports
- 💾 **Data Export**: Download progress and custom reviewers
- 🖼️ **Visual Learning**: Support for images in questions
- 📱 **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/thinkwise-learning.git
cd thinkwise-learning
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/          # React components
│   ├── AdminPanel.tsx   # Admin interface
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Header.tsx       # Navigation header
│   ├── Lesson.tsx       # Lesson interface
│   ├── LoginPage.tsx    # Authentication
│   ├── Profile.tsx      # User profile
│   └── ...
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication state
│   ├── UserContext.tsx  # User data management
│   └── AdminContext.tsx # Admin functionality
├── utils/               # Utility functions
│   └── downloadUtils.ts # Export functionality
└── App.tsx             # Main application
```

## Demo Credentials

- **Email**: demo@thinkwise.com
- **Password**: demo123

## Features Overview

### For Students
- Interactive lessons with immediate feedback
- Progress tracking with XP and levels
- Streak system to maintain consistency
- Custom review session creation
- Achievement system for motivation

### For Educators/Admins
- Question bank management
- Module creation and organization
- Image support for visual learning
- Data export and analytics
- User progress monitoring

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with modern React patterns and TypeScript
- Designed with accessibility and user experience in mind
- Educational content structure inspired by modern learning platforms