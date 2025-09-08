import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, GitBranch, Shield, AlertCircle, CheckCircle, Clock, Users } from 'lucide-react';
import { NavigationView } from '../App';
import { Project } from '../types/assessment';
import { loadProjects, saveProject } from '../utils/storage';

interface DashboardProps {
  onNavigate: (view: NavigationView, projectId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const [projects, setProjects] = useState<Project[]>(() => loadProjects());

  React.useEffect(() => {
    // Initialize with sample data if no projects exist
    if (projects.length === 0) {
      const sampleProjects: Project[] = [
        {
          id: '1',
          name: 'E-Commerce Platform',
          description: 'Core e-commerce application with microservices architecture',
          createdDate: '2024-01-01',
          lastAssessed: '2024-01-15',
          assessmentHistory: []
        },
        {
          id: '2',
          name: 'Mobile Banking API',
          description: 'Secure banking API with OAuth2 and advanced monitoring',
          createdDate: '2024-01-02',
          lastAssessed: '2024-01-10',
          assessmentHistory: []
        }
      ];
      setProjects(sampleProjects);
      sampleProjects.forEach(saveProject);
    }
  }, []);

  const getStatus = (project: Project): 'not-started' | 'in-progress' | 'completed' => {
    if (!project.currentAssessment) return 'not-started';
    return project.currentAssessment.status;
  };

  const getProgress = (project: Project): number => {
    if (!project.currentAssessment) return 0;
    const totalQuestions = 48; // 8 pillars × 6 questions each
    const answeredQuestions = Object.values(project.currentAssessment.answers).filter(a => 
      a.response !== null && a.response !== undefined
    ).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const getStatusIcon = (status: 'not-started' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: 'not-started' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || getStatus(project) === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName,
        description: newProjectDescription,
        createdDate: new Date().toISOString(),
        assessmentHistory: []
      };
      
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      saveProject(newProject);
      setNewProjectName('');
      setNewProjectDescription('');
      setShowNewProjectModal(false);
    }
  };

  const getOverallScore = (project: Project): number => {
    return project.currentAssessment?.overallScore || 0;
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <GitBranch className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {projects.filter(p => getStatus(p) === 'completed').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">
                {projects.filter(p => getStatus(p) === 'in-progress').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-3xl font-bold text-orange-600">
                {projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + getOverallScore(p), 0) / projects.length) : 0}%
              </p>
            </div>
            <Shield className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex-1 flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="review">Review</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Assessment
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  {getStatusIcon(getStatus(project))}
                </div>
                <p className="text-gray-600 text-sm">{project.description}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {project.assessmentHistory.length} Assessments
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-sm font-medium">{getProgress(project)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{width: `${getProgress(project)}%`}}
                ></div>
              </div>
            </div>

            {project.currentAssessment && (
              <div className="grid grid-cols-4 gap-2 mb-4">
                {Object.entries(project.currentAssessment.pillarScores).map(([pillar, score]) => (
                  <div key={pillar} className="text-center">
                    <div className="text-xs text-gray-500 capitalize mb-1">
                      {pillar === 'codeQuality' ? 'Quality' : pillar}
                    </div>
                    <div className={`text-sm font-medium ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {score}%
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                {project.currentAssessment?.assessor || 'Not assigned'}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(getStatus(project))}`}>
                  {getStatus(project).replace('-', ' ').toUpperCase()}
                </span>
                
                <button
                  onClick={() => onNavigate('assessment', project.id)}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  {getStatus(project) === 'not-started' ? 'Start Assessment' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <GitBranch className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first assessment project'}
          </p>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Assessment
          </button>
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Assessment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief project description"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
