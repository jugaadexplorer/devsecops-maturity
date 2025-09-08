import React, { useState } from 'react';
import { ArrowLeft, Upload, Check, X, ExternalLink, AlertTriangle, FileText, Download, Trash2 } from 'lucide-react';
import { NavigationView } from '../App';
import { assessmentData } from '../data/assessmentData';
import { ProjectAssessment as ProjectAssessmentType, AssessmentAnswer } from '../types/assessment';
import { getProject, saveAssessment, saveAssessmentAnswer, fileToBase64, downloadFile } from '../utils/storage';

interface ProjectAssessmentProps {
  projectId: string | null;
  onNavigate: (view: NavigationView) => void;
}

export const ProjectAssessment: React.FC<ProjectAssessmentProps> = ({ projectId, onNavigate }) => {
  const [currentPillar, setCurrentPillar] = useState(0);
  const [assessment, setAssessment] = useState<ProjectAssessmentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pillars = assessmentData;

  React.useEffect(() => {
    if (projectId) {
      const project = getProject(projectId);
      if (project) {
        if (!project.currentAssessment) {
          // Create new assessment
          const newAssessment: ProjectAssessmentType = {
            id: Date.now().toString(),
            projectId: project.id,
            projectName: project.name,
            assessor: 'Current User', // In real app, get from auth
            startDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            status: 'not-started',
            answers: {},
            pillarScores: {
              code: 0,
              build: 0,
              codeQuality: 0,
              security: 0,
              testing: 0,
              package: 0,
              deploy: 0,
              monitoring: 0
            },
            overallScore: 0
          };
          setAssessment(newAssessment);
          saveAssessment(newAssessment);
        } else {
          setAssessment(project.currentAssessment);
        }
      }
    }
  }, [projectId]);

  const handleAnswerChange = (questionId: string, response: boolean | null) => {
    if (!assessment) return;

    const updatedAnswer: AssessmentAnswer = {
      questionId,
      response,
      evidence: assessment.answers[questionId]?.evidence || null,
      notes: assessment.answers[questionId]?.notes || ''
    };

    saveAssessmentAnswer(assessment.projectId, updatedAnswer);
    
    // Reload assessment to get updated scores
    const project = getProject(assessment.projectId);
    if (project?.currentAssessment) {
      setAssessment(project.currentAssessment);
    }
  };

  const handleEvidenceUpload = async (questionId: string, file: File | null) => {
    if (!assessment) return;
    
    setIsLoading(true);
    try {
      let evidenceData = null;
      
      if (file) {
        const base64Data = await fileToBase64(file);
        evidenceData = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadDate: new Date().toISOString(),
          fileData: base64Data
        };
      }

      const updatedAnswer: AssessmentAnswer = {
        questionId,
        response: assessment.answers[questionId]?.response || null,
        evidence: evidenceData,
        notes: assessment.answers[questionId]?.notes || ''
      };

      saveAssessmentAnswer(assessment.projectId, updatedAnswer);
      
      // Reload assessment
      const project = getProject(assessment.projectId);
      if (project?.currentAssessment) {
        setAssessment(project.currentAssessment);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotesChange = (questionId: string, notes: string) => {
    if (!assessment) return;

    const updatedAnswer: AssessmentAnswer = {
      questionId,
      response: assessment.answers[questionId]?.response || null,
      evidence: assessment.answers[questionId]?.evidence || null,
      notes
    };

    saveAssessmentAnswer(assessment.projectId, updatedAnswer);
    
    // Reload assessment
    const project = getProject(assessment.projectId);
    if (project?.currentAssessment) {
      setAssessment(project.currentAssessment);
    }
  };

  const handleDownloadEvidence = (questionId: string) => {
    if (!assessment) return;
    
    const answer = assessment.answers[questionId];
    if (answer?.evidence) {
      downloadFile(
        answer.evidence.fileData,
        answer.evidence.fileName,
        answer.evidence.fileType
      );
    }
  };

  const handleRemoveEvidence = (questionId: string) => {
    if (!assessment) return;

    const updatedAnswer: AssessmentAnswer = {
      questionId,
      response: assessment.answers[questionId]?.response || null,
      evidence: null,
      notes: assessment.answers[questionId]?.notes || ''
    };

    saveAssessmentAnswer(assessment.projectId, updatedAnswer);
    
    // Reload assessment
    const project = getProject(assessment.projectId);
    if (project?.currentAssessment) {
      setAssessment(project.currentAssessment);
    }
  };

  const getProgressForPillar = (pillarIndex: number) => {
    if (!assessment) return 0;
    
    const pillar = pillars[pillarIndex];
    const pillarQuestions = pillar.questions;
    const answeredQuestions = pillarQuestions.filter(q => 
      assessment.answers[q.id]?.response !== undefined && assessment.answers[q.id]?.response !== null
    );
    return Math.round((answeredQuestions.length / pillarQuestions.length) * 100);
  };

  const getOverallProgress = () => {
    if (!assessment) return 0;
    
    const totalQuestions = pillars.reduce((sum, pillar) => sum + pillar.questions.length, 0);
    const answeredQuestions = Object.values(assessment.answers).filter(a => 
      a.response !== undefined && a.response !== null
    ).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const currentPillarData = pillars[currentPillar];

  if (!projectId) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
        <p className="text-gray-500 mb-6">Please select a project from the dashboard to begin assessment.</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Project Assessment</h2>
            <p className="text-sm text-gray-600">
              {assessment ? `${assessment.projectName} - ${assessment.assessor}` : `Project ID: ${projectId}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Overall Progress: <span className="font-medium">{getOverallProgress()}%</span>
          </div>
          {assessment && (
            <div className="text-sm text-gray-600">
              Score: <span className="font-medium text-blue-600">{assessment.overallScore}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Assessment Progress</span>
          <span className="text-sm text-gray-600">{getOverallProgress()}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{width: `${getOverallProgress()}%`}}
          ></div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar - Pillars */}
        <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-4">Assessment Pillars</h3>
          <div className="space-y-2">
            {pillars.map((pillar, index) => {
              const progress = getProgressForPillar(index);
              const isActive = currentPillar === index;
              const Icon = pillar.icon;
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentPillar(index)}
                  className={`
                    w-full p-3 rounded-lg text-left transition-colors
                    ${isActive ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <div className="flex-1">
                      <div className={`font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                        {pillar.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {pillar.questions.length} questions
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${progress === 100 ? 'text-green-600' : 'text-gray-600'}`}>
                        {progress}%
                      </div>
                      <div className="w-12 bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className={`h-1 rounded-full transition-all duration-300 ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{width: `${progress}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <currentPillarData.icon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">{currentPillarData.name}</h2>
            </div>
            <p className="text-gray-600">{currentPillarData.description}</p>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <ExternalLink className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Primary Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentPillarData.tools.map((tool, index) => (
                      <span key={index} className="px-2 py-1 bg-white text-blue-800 rounded text-sm border border-blue-200">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {currentPillarData.questions.map((question, index) => {
              const answer = assessment?.answers[question.id];
              const hasAnswer = answer?.response !== undefined && answer?.response !== null;
              
              return (
                <div key={question.id} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {index + 1}. {question.question}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">{question.description}</p>
                      
                      {question.tools && question.tools.length > 0 && (
                        <div className="mb-4">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Required Tools: </span>
                          <span className="text-sm text-blue-600">{question.tools.join(', ')}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                      ${hasAnswer 
                        ? answer.response 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-400'
                      }
                    `}>
                      {hasAnswer ? (
                        answer.response ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                  </div>

                  {/* Response Buttons */}
                  <div className="flex space-x-3 mb-4">
                    <button
                      onClick={() => handleAnswerChange(question.id, true)}
                      className={`
                        flex items-center px-4 py-2 rounded-lg transition-colors
                        ${answer?.response === true
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-green-50 hover:text-green-700'
                        }
                      `}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Yes
                    </button>
                    
                    <button
                      onClick={() => handleAnswerChange(question.id, false)}
                      className={`
                        flex items-center px-4 py-2 rounded-lg transition-colors
                        ${answer?.response === false
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-red-50 hover:text-red-700'
                        }
                      `}
                    >
                      <X className="h-4 w-4 mr-2" />
                      No
                    </button>
                  </div>

                  {/* Evidence Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Evidence/Documentation
                    </label>
                    
                    {answer?.evidence ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-green-900">{answer.evidence.fileName}</p>
                            <p className="text-xs text-green-600">
                              {(answer.evidence.fileSize / 1024).toFixed(1)} KB • 
                              Uploaded {new Date(answer.evidence.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDownloadEvidence(question.id)}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Download file"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveEvidence(question.id)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Remove file"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className={`flex items-center px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <Upload className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {isLoading ? 'Uploading...' : 'Upload File'}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleEvidenceUpload(question.id, e.target.files?.[0] || null)}
                          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt,.md"
                          disabled={isLoading}
                        />
                      </label>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={answer?.notes || ''}
                      onChange={(e) => handleNotesChange(question.id, e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add any additional context, implementation details, or comments..."
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentPillar(Math.max(0, currentPillar - 1))}
              disabled={currentPillar === 0}
              className={`
                flex items-center px-4 py-2 rounded-lg transition-colors
                ${currentPillar === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Pillar
            </button>
            
            <div className="text-sm text-gray-500">
              Pillar {currentPillar + 1} of {pillars.length}
            </div>
            
            <button
              onClick={() => setCurrentPillar(Math.min(pillars.length - 1, currentPillar + 1))}
              disabled={currentPillar === pillars.length - 1}
              className={`
                flex items-center px-4 py-2 rounded-lg transition-colors
                ${currentPillar === pillars.length - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              Next Pillar
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
