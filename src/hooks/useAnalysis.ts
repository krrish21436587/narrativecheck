import { useState, useCallback } from 'react';
import { 
  AnalysisJob, 
  AnalysisResult, 
  ProcessingLog, 
  UploadedFile,
  Claim,
  Evidence,
  ConstraintAnalysis,
  Metrics 
} from '@/types/analysis';

// Simulated processing for demo purposes
// In production, this would connect to Lovable Cloud backend

const generateId = () => Math.random().toString(36).substring(2, 9);

const createLog = (phase: string, message: string, level: ProcessingLog['level'] = 'info'): ProcessingLog => ({
  id: generateId(),
  timestamp: new Date(),
  level,
  message,
  phase,
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useAnalysis() {
  const [job, setJob] = useState<AnalysisJob | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  const addLog = useCallback((log: ProcessingLog) => {
    setJob(prev => prev ? { ...prev, logs: [...prev.logs, log] } : null);
  }, []);

  const updateProgress = useCallback((progress: number, status: AnalysisJob['status']) => {
    setJob(prev => prev ? { ...prev, progress, status } : null);
  }, []);

  const runAnalysis = useCallback(async (storyFile: UploadedFile, backstoryFile: UploadedFile) => {
    const jobId = generateId();
    
    // Initialize job
    const initialJob: AnalysisJob = {
      id: jobId,
      status: 'pending',
      progress: 0,
      storyFileName: storyFile.name,
      backstoryFileName: backstoryFile.name,
      logs: [createLog('init', 'Analysis job initialized', 'success')],
      startTime: new Date(),
    };
    
    setJob(initialJob);

    // Phase 1: Chunking
    await sleep(500);
    updateProgress(5, 'chunking');
    addLog(createLog('chunking', `Loading story: ${storyFile.name}`));
    
    await sleep(800);
    const wordCount = storyFile.content?.split(/\s+/).length || 0;
    addLog(createLog('chunking', `Story loaded: ${wordCount.toLocaleString()} words`));
    
    await sleep(600);
    const chunkCount = Math.ceil(wordCount / 2000);
    addLog(createLog('chunking', `Splitting into ${chunkCount} semantic chunks`));
    
    await sleep(1000);
    addLog(createLog('chunking', `Chunking complete`, 'success'));
    updateProgress(25, 'embedding');

    // Phase 2: Embedding
    await sleep(400);
    addLog(createLog('embedding', 'Initializing embedding model'));
    
    await sleep(800);
    addLog(createLog('embedding', `Processing ${chunkCount} chunks...`));
    
    for (let i = 0; i < Math.min(chunkCount, 5); i++) {
      await sleep(300);
      updateProgress(25 + (i + 1) * 5, 'embedding');
      addLog(createLog('embedding', `Embedded chunk ${i + 1}/${chunkCount}`));
    }
    
    await sleep(500);
    addLog(createLog('embedding', 'Embedding generation complete', 'success'));
    updateProgress(55, 'reasoning');

    // Phase 3: Reasoning
    await sleep(400);
    addLog(createLog('reasoning', 'Extracting backstory claims'));
    
    await sleep(600);
    const claimCount = Math.floor(Math.random() * 5) + 3;
    addLog(createLog('reasoning', `Identified ${claimCount} claims to verify`));
    
    await sleep(800);
    addLog(createLog('reasoning', 'Performing constraint analysis'));
    
    await sleep(600);
    addLog(createLog('reasoning', 'Temporal consistency check...'));
    
    await sleep(500);
    addLog(createLog('reasoning', 'Causal reasoning analysis...'));
    
    await sleep(700);
    addLog(createLog('reasoning', 'Evidence linking complete', 'success'));
    
    await sleep(400);
    updateProgress(90, 'reasoning');
    addLog(createLog('reasoning', 'Generating final verdict'));

    // Generate mock result
    await sleep(800);
    const isConsistent = Math.random() > 0.4;
    
    const mockClaims: Claim[] = [
      {
        id: generateId(),
        text: 'The protagonist grew up in a small coastal town',
        status: 'supported',
        confidence: 0.92,
        evidence: [
          {
            id: generateId(),
            quote: 'She remembered the salt-tinged air of her childhood home, the small fishing village where everyone knew each other.',
            chapterRef: 'Chapter 3, Page 47',
            relevanceScore: 0.95,
          },
        ],
      },
      {
        id: generateId(),
        text: 'The character learned swordsmanship from their father',
        status: isConsistent ? 'supported' : 'contradicted',
        confidence: isConsistent ? 0.87 : 0.91,
        evidence: [
          {
            id: generateId(),
            quote: isConsistent 
              ? 'His father\'s lessons echoed in his mind, each thrust and parry a memory of summers in the training yard.'
              : 'He had never held a sword before that fateful day, his hands trembling with unfamiliarity.',
            chapterRef: isConsistent ? 'Chapter 12, Page 203' : 'Chapter 8, Page 156',
            relevanceScore: 0.89,
          },
        ],
      },
      {
        id: generateId(),
        text: 'The events took place during the Great War',
        status: 'unverified',
        confidence: 0.45,
        evidence: [],
      },
    ];

    const mockConstraints: ConstraintAnalysis[] = [
      {
        id: generateId(),
        constraintType: 'temporal',
        description: 'Timeline of protagonist\'s age matches narrative events',
        status: isConsistent ? 'satisfied' : 'violated',
        relatedClaims: [mockClaims[0].id],
      },
      {
        id: generateId(),
        constraintType: 'causal',
        description: 'Character motivations align with backstory experiences',
        status: 'satisfied',
        relatedClaims: [mockClaims[1].id],
      },
      {
        id: generateId(),
        constraintType: 'character',
        description: 'Personality traits consistent with described upbringing',
        status: isConsistent ? 'satisfied' : 'uncertain',
        relatedClaims: [mockClaims[0].id, mockClaims[1].id],
      },
      {
        id: generateId(),
        constraintType: 'factual',
        description: 'Historical references match world-building details',
        status: 'uncertain',
        relatedClaims: [mockClaims[2].id],
      },
    ];

    const result: AnalysisResult = {
      id: generateId(),
      consistencyLabel: isConsistent ? 1 : 0,
      overallConfidence: isConsistent ? 0.87 : 0.82,
      explanation: isConsistent
        ? 'The backstory is consistent with the narrative. Key claims about the protagonist\'s origins and experiences are supported by textual evidence. No significant contradictions were found in temporal, causal, or character-based constraints.'
        : 'The backstory contains inconsistencies with the narrative. While some claims are supported, critical elements contradict established facts in the story, particularly regarding the protagonist\'s training and background.',
      claims: mockClaims,
      constraintAnalysis: mockConstraints,
      processingTime: Date.now() - initialJob.startTime.getTime(),
      timestamp: new Date(),
    };

    // Generate mock metrics
    const mockMetrics: Metrics = {
      accuracy: 0.847,
      precision: 0.821,
      recall: 0.889,
      f1Score: 0.854,
      confusionMatrix: {
        truePositive: 89,
        trueNegative: 76,
        falsePositive: 12,
        falseNegative: 18,
      },
    };

    addLog(createLog('complete', `Analysis complete: ${isConsistent ? 'CONSISTENT' : 'INCONSISTENT'}`, 'success'));
    updateProgress(100, 'complete');

    setJob(prev => prev ? { ...prev, result, endTime: new Date() } : null);
    setMetrics(mockMetrics);

    return result;
  }, [addLog, updateProgress]);

  const reset = useCallback(() => {
    setJob(null);
    setMetrics(null);
  }, []);

  return {
    job,
    metrics,
    runAnalysis,
    reset,
  };
}
