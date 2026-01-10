export interface Claim {
  id: string;
  text: string;
  status: 'supported' | 'contradicted' | 'unverified';
  confidence: number;
  evidence: Evidence[];
}

export interface Evidence {
  id: string;
  quote: string;
  chapterRef: string;
  relevanceScore: number;
}

export interface AnalysisResult {
  id: string;
  consistencyLabel: 0 | 1;
  overallConfidence: number;
  explanation: string;
  claims: Claim[];
  constraintAnalysis: ConstraintAnalysis[];
  processingTime: number;
  timestamp: Date;
}

export interface ConstraintAnalysis {
  id: string;
  constraintType: 'temporal' | 'spatial' | 'causal' | 'character' | 'factual';
  description: string;
  status: 'satisfied' | 'violated' | 'uncertain';
  relatedClaims: string[];
}

export interface Metrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    truePositive: number;
    trueNegative: number;
    falsePositive: number;
    falseNegative: number;
  };
}

export interface ProcessingLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  phase: string;
}

export interface AnalysisJob {
  id: string;
  status: 'pending' | 'chunking' | 'embedding' | 'reasoning' | 'complete' | 'failed';
  progress: number;
  storyFileName: string;
  backstoryFileName: string;
  logs: ProcessingLog[];
  result?: AnalysisResult;
  startTime: Date;
  endTime?: Date;
}

export interface UploadedFile {
  file: File;
  name: string;
  size: number;
  content?: string;
}
