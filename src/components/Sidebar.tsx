import React from 'react';
import { LayoutDashboard, FileText, History, Shield } from 'lucide-react';
import { NavigationView } from '../App';

interface SidebarProps {
  currentView: NavigationView;
  onNavigate: (view: NavigationView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    {
      id: 'dashboard' as NavigationView,
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview of all projects'
    },
    {
      id: 'assessment' as NavigationView,
      label: 'Assessment',
      icon: FileText,
      description: 'Conduct assessments'
    },
    {
      id: 'history' as NavigationView,
      label: 'History',
      icon: History,
      description: 'Assessment history'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">DevSecOps</h2>
            <p className="text-sm text-gray-600">Assessment Portal</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Version 1.0.0
          <br />
          OpenShift Ready
        </div>
      </div>
    </div>
  );
};
