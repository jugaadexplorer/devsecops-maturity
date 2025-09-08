import { Project, ProjectAssessment, AssessmentAnswer } from '../types/assessment';

const STORAGE_KEYS = {
  PROJECTS: 'devops_assessment_projects',
  ASSESSMENTS: 'devops_assessment_assessments',
};

// Project Storage
export const saveProjects = (projects: Project[]): void => {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

export const loadProjects = (): Project[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return stored ? JSON.parse(stored) : [];
};

export const saveProject = (project: Project): void => {
  const projects = loadProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }
  
  saveProjects(projects);
};

export const getProject = (projectId: string): Project | null => {
  const projects = loadProjects();
  return projects.find(p => p.id === projectId) || null;
};

// Assessment Storage
export const saveAssessment = (assessment: ProjectAssessment): void => {
  const project = getProject(assessment.projectId);
  if (!project) return;

  // Update project with current assessment
  project.currentAssessment = assessment;
  project.lastAssessed = assessment.lastUpdated;

  // If assessment is completed, move to history
  if (assessment.status === 'completed' && assessment.completedDate) {
    const existingHistoryIndex = project.assessmentHistory.findIndex(a => a.id === assessment.id);
    if (existingHistoryIndex >= 0) {
      project.assessmentHistory[existingHistoryIndex] = assessment;
    } else {
      project.assessmentHistory.push(assessment);
    }
  }

  saveProject(project);
};

export const getAssessment = (projectId: string): ProjectAssessment | null => {
  const project = getProject(projectId);
  return project?.currentAssessment || null;
};

export const saveAssessmentAnswer = (projectId: string, answer: AssessmentAnswer): void => {
  const assessment = getAssessment(projectId);
  if (!assessment) return;

  assessment.answers[answer.questionId] = answer;
  assessment.lastUpdated = new Date().toISOString();
  
  // Recalculate scores
  updateAssessmentScores(assessment);
  
  saveAssessment(assessment);
};

export const updateAssessmentScores = (assessment: ProjectAssessment): void => {
  const pillarQuestionCounts = {
    code: 6,
    build: 6,
    codeQuality: 6,
    security: 6,
    testing: 6,
    package: 6,
    deploy: 6,
    monitoring: 6
  };

  // Calculate pillar scores based on yes responses
  Object.keys(pillarQuestionCounts).forEach(pillar => {
    const pillarQuestions = Object.keys(assessment.answers).filter(qId => 
      qId.startsWith(pillar === 'codeQuality' ? 'quality' : pillar)
    );
    
    const yesResponses = pillarQuestions.filter(qId => 
      assessment.answers[qId]?.response === true
    ).length;
    
    const totalQuestions = pillarQuestionCounts[pillar as keyof typeof pillarQuestionCounts];
    assessment.pillarScores[pillar as keyof typeof assessment.pillarScores] = 
      totalQuestions > 0 ? Math.round((yesResponses / totalQuestions) * 100) : 0;
  });

  // Calculate overall score
  const pillarScores = Object.values(assessment.pillarScores);
  assessment.overallScore = Math.round(
    pillarScores.reduce((sum, score) => sum + score, 0) / pillarScores.length
  );

  // Update status based on completion
  const totalQuestions = Object.values(pillarQuestionCounts).reduce((sum, count) => sum + count, 0);
  const answeredQuestions = Object.values(assessment.answers).filter(a => 
    a.response !== null && a.response !== undefined
  ).length;

  if (answeredQuestions === totalQuestions) {
    assessment.status = 'completed';
    if (!assessment.completedDate) {
      assessment.completedDate = new Date().toISOString();
    }
  } else if (answeredQuestions > 0) {
    assessment.status = 'in-progress';
  }
};

// File handling utilities
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove data:type;base64, prefix
    };
    reader.onerror = error => reject(error);
  });
};

export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

export const downloadFile = (base64: string, fileName: string, mimeType: string): void => {
  const blob = base64ToBlob(base64, mimeType);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
