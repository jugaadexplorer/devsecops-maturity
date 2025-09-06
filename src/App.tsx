import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProjectAssessment } from './components/ProjectAssessment';
import { AssessmentHistory } from './components/AssessmentHistory';
import { Header } from './components/Header';

export type NavigationView = 'dashboard' | 'assessment' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<NavigationView>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleNavigate = (view: NavigationView, projectId?: string) => {
    setCurrentView(view);
    if (projectId) {
      setSelectedProjectId(projectId);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'assessment':
        return (
          <ProjectAssessment 
            projectId={selectedProjectId} 
            onNavigate={handleNavigate} 
          />
        );
      case 'history':
        return <AssessmentHistory onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      <div className="flex-1 flex flex-col">
        <Header currentView={currentView} />
        <main className="flex-1 p-6">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

export default App;
