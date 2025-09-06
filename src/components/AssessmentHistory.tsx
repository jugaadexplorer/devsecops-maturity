import React, { useState } from 'react';
import { Calendar, Download, Eye, Filter, Search, TrendingUp, TrendingDown, Users, FileText } from 'lucide-react';
import { NavigationView } from '../App';

interface HistoryRecord {
  id: string;
  projectName: string;
  assessor: string;
  completedDate: string;
  environment: 'dev' | 'preprod' | 'prod';
  overallScore: number;
  previousScore?: number;
  pillars: {
    code: number;
    build: number;
    codeQuality: number;
    security: number;
    testing: number;
    package: number;
    deploy: number;
    monitoring: number;
  };
}

interface AssessmentHistoryProps {
  onNavigate: (view: NavigationView) => void;
}

export const AssessmentHistory: React.FC<AssessmentHistoryProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnvironment, setFilterEnvironment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'project'>('date');

  const historyRecords: HistoryRecord[] = [
    {
      id: '1',
      projectName: 'Mobile Banking API',
      assessor: 'Sarah Johnson',
      completedDate: '2024-01-15',
      environment: 'prod',
      overallScore: 91,
      previousScore: 87,
      pillars: {
        code: 95,
        build: 90,
        codeQuality: 88,
        security: 92,
        testing: 85,
        package: 90,
        deploy: 87,
        monitoring: 93
      }
    },
    {
      id: '2',
      projectName: 'E-Commerce Platform',
      assessor: 'John Smith',
      completedDate: '2024-01-10',
      environment: 'prod',
      overallScore: 73,
      previousScore: 68,
      pillars: {
        code: 80,
        build: 70,
        codeQuality: 60,
        security: 75,
        testing: 75,
        package: 85,
        deploy: 65,
        monitoring: 90
      }
    },
    {
      id: '3',
      projectName: 'Data Analytics Pipeline',
      assessor: 'Mike Chen',
      completedDate: '2024-01-08',
      environment: 'preprod',
      overallScore: 45,
      previousScore: 52,
      pillars: {
        code: 60,
        build: 45,
        codeQuality: 30,
        security: 35,
        testing: 50,
        package: 40,
        deploy: 25,
        monitoring: 70
      }
    },
    {
      id: '4',
      projectName: 'Customer Portal',
      assessor: 'Lisa Wang',
      completedDate: '2024-01-05',
      environment: 'dev',
      overallScore: 82,
      pillars: {
        code: 85,
        build: 78,
        codeQuality: 80,
        security: 88,
        testing: 75,
        package: 85,
        deploy: 80,
        monitoring: 85
      }
    },
    {
      id: '5',
      projectName: 'Mobile Banking API',
      assessor: 'Sarah Johnson',
      completedDate: '2023-12-20',
      environment: 'prod',
      overallScore: 87,
      previousScore: 82,
      pillars: {
        code: 90,
        build: 85,
        codeQuality: 82,
        security: 88,
        testing: 80,
        package: 85,
        deploy: 85,
        monitoring: 90
      }
    }
  ];

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'prod':
        return 'bg-red-100 text-red-800';
      case 'preprod':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

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
      const matchesEnvironment = filterEnvironment === 'all' || record.environment === filterEnvironment;
      return matchesSearch && matchesEnvironment;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
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
      ['Project Name', 'Assessor', 'Date', 'Environment', 'Overall Score', 'Code', 'Build', 'Quality', 'Security', 'Testing', 'Package', 'Deploy', 'Monitoring'],
      ...filteredRecords.map(record => [
        record.projectName,
        record.assessor,
        record.completedDate,
        record.environment,
        record.overallScore.toString(),
        record.pillars.code.toString(),
        record.pillars.build.toString(),
        record.pillars.codeQuality.toString(),
        record.pillars.security.toString(),
        record.pillars.testing.toString(),
        record.pillars.package.toString(),
        record.pillars.deploy.toString(),
        record.pillars.monitoring.toString()
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
                {historyRecords.filter(r => new Date(r.completedDate) >= new Date('2024-01-01')).length}
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
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filterEnvironment}
                onChange={(e) => setFilterEnvironment(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Environments</option>
                <option value="dev">Development</option>
                <option value="preprod">Pre-Production</option>
                <option value="prod">Production</option>
              </select>
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
                  Environment
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
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEnvironmentColor(record.environment)}`}>
                      {record.environment.toUpperCase()}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${getScoreColor(record.overallScore)}`}>
                        {record.overallScore}%
                      </span>
                      {getTrendIcon(record.overallScore, record.previousScore)}
                      {record.previousScore && (
                        <span className="text-xs text-gray-500">
                          ({record.overallScore > record.previousScore ? '+' : ''}{record.overallScore - record.previousScore})
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="grid grid-cols-4 gap-1 max-w-32">
                      {Object.entries(record.pillars).map(([pillar, score]) => (
                        <div
                          key={pillar}
                          className={`h-2 rounded-full ${score >= 80 ? 'bg-green-400' : score >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          title={`${pillar}: ${score}%`}
                        />
                      ))}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{new Date(record.completedDate).toLocaleDateString()}</div>
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
