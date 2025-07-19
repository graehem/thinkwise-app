import React, { useState } from 'react';
import { Download, FileText, Database, User, BookOpen, Settings } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useAdmin } from '../contexts/AdminContext';
import { downloadJSON, downloadCSV, downloadText, generateUserReport, formatQuestionForExport, ExportData } from '../utils/downloadUtils';

interface DownloadCenterProps {
  onClose: () => void;
}

export const DownloadCenter: React.FC<DownloadCenterProps> = ({ onClose }) => {
  const { state: userState } = useUser();
  const { state: adminState } = useAdmin();
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadUserData = () => {
    setIsExporting(true);
    
    const userData = {
      profile: userState.user,
      progress: {
        completedLessons: userState.user.completedLessons,
        achievements: userState.user.achievements,
        totalXP: userState.user.totalXP,
        level: userState.user.level,
        streak: userState.user.streak
      },
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    downloadJSON(userData, `thinkwise-profile-${userState.user.name.replace(/\s+/g, '-').toLowerCase()}.json`);
    setIsExporting(false);
  };

  const handleDownloadReviewSessions = () => {
    setIsExporting(true);
    
    const userReviewSessions = adminState.reviewSessions.filter(
      session => session.createdBy === userState.user.id
    );
    
    downloadJSON(userReviewSessions, `thinkwise-reviewers-${new Date().toISOString().split('T')[0]}.json`);
    setIsExporting(false);
  };

  const handleDownloadAllData = () => {
    setIsExporting(true);
    
    const userReviewSessions = adminState.reviewSessions.filter(
      session => session.createdBy === userState.user.id
    );
    
    const exportData: ExportData = {
      user: userState.user,
      reviewSessions: userReviewSessions,
      progress: {
        completedLessons: userState.user.completedLessons,
        achievements: userState.user.achievements,
        totalXP: userState.user.totalXP,
        level: userState.user.level,
        streak: userState.user.streak,
        dailyGoal: userState.user.dailyGoal,
        todayXP: userState.user.todayXP
      },
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    downloadJSON(exportData, `thinkwise-complete-backup-${new Date().toISOString().split('T')[0]}.json`);
    setIsExporting(false);
  };

  const handleDownloadProgressReport = () => {
    setIsExporting(true);
    
    const userReviewSessions = adminState.reviewSessions.filter(
      session => session.createdBy === userState.user.id
    );
    
    const report = generateUserReport(userState.user, userReviewSessions);
    downloadText(report, `thinkwise-progress-report-${new Date().toISOString().split('T')[0]}.txt`);
    setIsExporting(false);
  };

  const handleDownloadQuestionsCSV = () => {
    setIsExporting(true);
    
    const userReviewSessions = adminState.reviewSessions.filter(
      session => session.createdBy === userState.user.id
    );
    
    const allQuestions = userReviewSessions.flatMap(session => session.questions);
    const formattedQuestions = allQuestions.map(formatQuestionForExport);
    
    if (formattedQuestions.length > 0) {
      downloadCSV(formattedQuestions, `thinkwise-questions-${new Date().toISOString().split('T')[0]}.csv`);
    } else {
      alert('No questions found to export. Create some review sessions first!');
    }
    
    setIsExporting(false);
  };

  const downloadOptions = [
    {
      id: 'user-data',
      title: 'User Profile Data',
      description: 'Download your profile information and basic progress data',
      icon: User,
      color: 'bg-blue-500',
      action: handleDownloadUserData,
      format: 'JSON'
    },
    {
      id: 'review-sessions',
      title: 'Review Sessions',
      description: 'Export all your custom review sessions and their settings',
      icon: BookOpen,
      color: 'bg-green-500',
      action: handleDownloadReviewSessions,
      format: 'JSON'
    },
    {
      id: 'progress-report',
      title: 'Progress Report',
      description: 'Generate a readable summary of your learning progress',
      icon: FileText,
      color: 'bg-purple-500',
      action: handleDownloadProgressReport,
      format: 'TXT'
    },
    {
      id: 'questions-csv',
      title: 'Questions Database',
      description: 'Export all questions from your review sessions as spreadsheet',
      icon: Database,
      color: 'bg-orange-500',
      action: handleDownloadQuestionsCSV,
      format: 'CSV'
    },
    {
      id: 'complete-backup',
      title: 'Complete Backup',
      description: 'Download everything - profile, sessions, progress, and settings',
      icon: Settings,
      color: 'bg-indigo-500',
      action: handleDownloadAllData,
      format: 'JSON'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Download Center</h2>
              <p className="text-gray-600">Export your ThinkWise data and progress</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Profile Level</p>
                  <p className="text-xl font-bold text-blue-900">{userState.user.level}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Review Sessions</p>
                  <p className="text-xl font-bold text-green-900">
                    {adminState.reviewSessions.filter(s => s.createdBy === userState.user.id).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">XP</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600">Total XP</p>
                  <p className="text-xl font-bold text-purple-900">{userState.user.totalXP.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🔥</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600">Streak</p>
                  <p className="text-xl font-bold text-orange-900">{userState.user.streak} days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Download Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Downloads</h3>
            
            {downloadOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${option.color} rounded-full flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{option.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {option.format} Format
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={option.action}
                      disabled={isExporting}
                      className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isExporting ? 'Exporting...' : 'Download'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Export Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• JSON files can be imported back into ThinkWise (future feature)</li>
              <li>• CSV files can be opened in Excel, Google Sheets, or other spreadsheet apps</li>
              <li>• TXT files are human-readable progress reports</li>
              <li>• All exports include timestamps for easy organization</li>
              <li>• Your data is exported locally - nothing is sent to external servers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};