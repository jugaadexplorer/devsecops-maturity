import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, GitBranch, Shield, AlertCircle, CheckCircle, Clock, Users } from 'lucide-react';
import { NavigationView } from '../App';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'review';
  progress: number;
  lastAssessed: string;
  assessor: string;
  environment: 'dev' | 'preprod' | 'prod';
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

interface DashboardProps {
  onNavigate: (view: NavigationView, projectId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-Commerce Platform',
      description: 'Core e-commerce application with microservices architecture',
      status: 'in-progress',
      progress: 65,
      lastAssessed: '2024-01-15',
      assessor: 'John Smith',
      environment: 'prod',
      pillars: {
        code: 80,
        build: 70,
        codeQuality: 60,
        security: 45,
        testing: 75,
        package: 85,
        deploy: 55,
        monitoring: 90
      }
    },
    {
      id: '2',
      name: 'Mobile Banking API',
      description: 'Secure banking API with OAuth2 and advanced monitoring',
      status: 'completed',
      progress: 100,
      lastAssessed: '2024-01-10',
      assessor: 'Sarah Johnson',
      environment: 'prod',
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
      id: '3',
      name: 'Data Analytics Pipeline',
      description: 'Real-time data processing and analytics platform',
      status: 'in-progress',
      progress: 40,
      lastAssessed: '2024-01-12',
      assessor: 'Mike Chen',
      environment: 'preprod',
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
      name: 'Customer Portal',
      description: 'Self-service customer portal with integration capabilities',
      status: 'not-started',
      progress: 0,
      lastAssessed: 'Never',
      assessor: 'Not assigned',
      environment: 'dev',
      pillars: {
        code: 0,
        build: 0,
        codeQuality: 0,
        security: 0,
        testing: 0,
        package: 0,
        deploy: 0,
        monitoring: 0
      }
    }
  ]);

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'review':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnvironmentColor = (env: Project['environment']) => {
    switch (env) {
      case 'prod':
        return 'bg-red-100 text-red-800';
      case 'preprod':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName,
        description: newProjectDescription,
        status: 'not-started',
        progress: 0,
        lastAssessed: 'Never',
        assessor: 'Not assigned',
        environment: 'dev',
        pillars: {
          code: 0,
          build: 0,
          codeQuality: 0,
          security: 0,
          testing: 0,
          package: 0,
          deploy: 0,
          monitoring: 0
        }
      };
      
      setProjects([...projects, newProject]);
      setNewProjectName('');
      setNewProjectDescription('');
      setShowNewProjectModal(false);
    }
  };

  const calculateOverallScore = (pillars: Project['pillars']) => {
    const scores = Object.values(pillars);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
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
                {projects.filter(p => p.status === 'completed').length}
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
                {projects.filter(p => p.status === 'in-progress').length}
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
                {Math.round(projects.reduce((sum, p) => sum + calculateOverallScore(p.pillars), 0) / projects.length)}%
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
                  {getStatusIcon(project.status)}
                </div>
                <p className="text-gray-600 text-sm">{project.description}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEnvironmentColor(project.environment)}`}>
                  {project.environment.toUpperCase()}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-sm font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{width: `${project.progress}%`}}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {Object.entries(project.pillars).map(([pillar, score]) => (
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
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                {project.assessor}
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ').toUpperCase()}
                </span>
                
                <button
                  onClick={() => onNavigate('assessment', project.id)}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  {project.status === 'not-started' ? 'Start Assessment' : 'Continue'}
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
