import React from 'react';
import { Shield, GitBranch, Users, Clock } from 'lucide-react';
import { NavigationView } from '../App';

interface HeaderProps {
  currentView: NavigationView;
}

export const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const getTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Assessment Dashboard';
      case 'assessment':
        return 'Project Assessment';
      case 'history':
        return 'Assessment History';
      default:
        return 'Assessment Portal';
    }
  };

  const getDescription = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Monitor and manage DevOps and DevSecOps assessments across all projects';
      case 'assessment':
        return 'Comprehensive assessment across eight key DevOps pillars';
      case 'history':
        return 'Review completed assessments and track progress over time';
      default:
        return 'DevOps and DevSecOps Assessment Platform';
    }
  };

  const getIcon = () => {
    switch (currentView) {
      case 'dashboard':
        return <GitBranch className="h-6 w-6 text-blue-600" />;
      case 'assessment':
        return <Shield className="h-6 w-6 text-blue-600" />;
      case 'history':
        return <Clock className="h-6 w-6 text-blue-600" />;
      default:
        return <Users className="h-6 w-6 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            {getIcon()}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
              <p className="text-sm text-gray-600">{getDescription()}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
