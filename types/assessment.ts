export interface AssessmentQuestion {
  id: string;
  question: string;
  description: string;
  tools?: string[];
}

export interface AssessmentPillar {
  name: string;
  description: string;
  icon: any;
  tools: string[];
  questions: AssessmentQuestion[];
}

export interface AssessmentAnswer {
  questionId: string;
  response: boolean | null;
  evidence: {
    fileName: string;
    fileSize: number;
    fileType: string;
    uploadDate: string;
    fileData: string; // base64 encoded file data
  } | null;
  notes: string;
}

export interface ProjectAssessment {
  id: string;
  projectId: string;
  projectName: string;
  assessor: string;
  startDate: string;
  lastUpdated: string;
  completedDate?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  answers: Record<string, AssessmentAnswer>;
  pillarScores: {
    code: number;
    build: number;
    codeQuality: number;
    security: number;
    testing: number;
    package: number;
    deploy: number;
    monitoring: number;
  };
  overallScore: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdDate: string;
  lastAssessed?: string;
  currentAssessment?: ProjectAssessment;
  assessmentHistory: ProjectAssessment[];
}
