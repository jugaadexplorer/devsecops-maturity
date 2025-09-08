import React, { useState } from 'react';
import { Calendar, Download, Eye, Filter, Search, TrendingUp, TrendingDown, Users, FileText } from 'lucide-react';
import { NavigationView } from '../App';
import { loadProjects } from '../utils/storage';
import { ProjectAssessment } from '../types/assessment';

interface AssessmentHistoryProps {
  onNavigate: (view: NavigationView) => void;
}

export const AssessmentHistory: React.FC<AssessmentHistoryProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'project'>('date');

  const [historyRecords, setHistoryRecords] = useState<ProjectAssessment[]>([]);

  React.useEffect(() => {
    const projects = loadProjects();
    const allHistory: ProjectAssessment[] = [];
    
    projects.forEach(project => {
      allHistory.push(...project.assessmentHistory);
      // Include current assessment if completed
      if (project.currentAssessment?.status === 'completed') {
        allHistory.push(project.currentAssessment);
      }
    });
    
    setHistoryRecords(allHistory);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (current: number, previous?: number) => {
    if (!previous) return null;
    const diff = current - previous;
    if (diff > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (diff < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const filteredRecords = historyRecords
    .filter(record => {
      const matchesSearch = record.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.assessor.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.completedDate || b.lastUpdated).getTime() - new Date(a.completedDate || a.lastUpdated).getTime();
        case 'score':
          return b.overallScore - a.overallScore;
        case 'project':
          return a.projectName.localeCompare(b.projectName);
        default:
          return 0;
      }
    });

  const exportToCSV = () => {
    const csvContent = [
      ['Project Name', 'Assessor', 'Date', 'Overall Score', 'Code', 'Build', 'Quality', 'Security', 'Testing', 'Package', 'Deploy', 'Monitoring'],
      ...filteredRecords.map(record => [
        record.projectName,
        record.assessor,
        record.completedDate || record.lastUpdated,
        record.overallScore.toString(),
        record.pillarScores.code.toString(),
        record.pillarScores.build.toString(),
        record.pillarScores.codeQuality.toString(),
        record.pillarScores.security.toString(),
        record.pillarScores.testing.toString(),
        record.pillarScores.package.toString(),
        record.pillarScores.deploy.toString(),
        record.pillarScores.monitoring.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assessment-history.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assessments</p>
              <p className="text-3xl font-bold text-gray-900">{historyRecords.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-3xl font-bold text-green-600">
                {Math.round(historyRecords.reduce((sum, r) => sum + r.overallScore, 0) / historyRecords.length)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-blue-600">
                {new Set(historyRecords.map(r => r.projectName)).size}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-orange-600">
                {historyRecords.filter(r => new Date(r.completedDate || r.lastUpdated) >= new Date('2024-01-01')).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex-1 flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'score' | 'project')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
              <option value="project">Sort by Project</option>
            </select>
          </div>
          
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project & Assessor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overall Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pillar Breakdown
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.projectName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {record.assessor}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${getScoreColor(record.overallScore)}`}>
                        {record.overallScore}%
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="grid grid-cols-4 gap-1 max-w-32">
                      {Object.entries(record.pillarScores).map(([pillar, score]) => (
                        <div
                          key={pillar}
                          className={`h-2 rounded-full ${score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          title={`${pillar}: ${score}%`}
                        />
                      ))}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(record.completedDate || record.lastUpdated).toLocaleDateString()}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assessment history found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Complete some assessments to see history here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
