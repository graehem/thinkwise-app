export interface ExportData {
  user: any;
  reviewSessions: any[];
  progress: any;
  exportDate: string;
  version: string;
}

export const downloadJSON = (data: any, filename: string) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadText = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateUserReport = (user: any, reviewSessions: any[]) => {
  const report = `
THINKWISE LEARNING REPORT
========================

User Information:
- Name: ${user.name}
- Email: ${user.email}
- Level: ${user.level}
- Total XP: ${user.totalXP}
- Current Streak: ${user.streak} days
- Completed Lessons: ${user.completedLessons.length}

Review Sessions Created: ${reviewSessions.length}

Achievements:
${user.achievements.map((achievement: string) => `- ${achievement}`).join('\n')}

Report Generated: ${new Date().toLocaleString()}
`;
  
  return report;
};

export const formatQuestionForExport = (question: any) => {
  return {
    id: question.id,
    type: question.type,
    subject: question.subject,
    topic: question.topic,
    difficulty: question.difficulty,
    question: question.question,
    image_url: question.imageUrl || '',
    correct_answer: Array.isArray(question.correct) ? question.correct.join('; ') : question.correct,
    explanation: question.explanation,
    points: question.points,
    tags: question.tags.join(', '),
    created_date: question.createdAt ? new Date(question.createdAt).toLocaleDateString() : 'N/A'
  };
};