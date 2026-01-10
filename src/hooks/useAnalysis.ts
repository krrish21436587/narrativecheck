import { useState, useCallback } from 'react';
import { 
  AnalysisJob, 
  AnalysisResult, 
  ProcessingLog, 
  UploadedFile,
  Claim,
  Evidence,
  ConstraintAnalysis,
  Metrics,
  Track
} from '@/types/analysis';

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

  const runAnalysis = useCallback(async (
    storyFile: UploadedFile, 
    backstoryFile: UploadedFile,
    track: Track = 'A',
    storyId?: string
  ) => {
    const jobId = generateId();
    const finalStoryId = storyId || storyFile.name.replace(/\.[^/.]+$/, '').slice(0, 10);
    
    const initialJob: AnalysisJob = {
      id: jobId,
      status: 'pending',
      progress: 0,
      storyFileName: storyFile.name,
      backstoryFileName: backstoryFile.name,
      storyId: finalStoryId,
      logs: [createLog('init', `Analysis job started (Track ${track})`, 'success')],
      startTime: new Date(),
      track,
    };
    
    setJob(initialJob);

    // Phase 1: Chunking
    await sleep(400);
    updateProgress(5, 'chunking');
    addLog(createLog('chunking', `Loading narrative: ${storyFile.name}`));
    
    await sleep(600);
    const wordCount = storyFile.content?.split(/\s+/).filter(Boolean).length || 0;
    addLog(createLog('chunking', `Loaded ${wordCount.toLocaleString()} words`));
    
    await sleep(500);
    const chunkCount = Math.max(1, Math.ceil(wordCount / 2000));
    addLog(createLog('chunking', `Created ${chunkCount} semantic chunks`));
    
    await sleep(400);
    addLog(createLog('chunking', 'Text chunking complete', 'success'));
    updateProgress(25, 'embedding');

    // Phase 2: Embedding
    await sleep(300);
    if (track === 'B') {
      addLog(createLog('embedding', 'Initializing BDH encoder'));
    } else {
      addLog(createLog('embedding', 'Initializing embedding model'));
    }
    
    await sleep(600);
    addLog(createLog('embedding', `Processing ${chunkCount} chunks...`));
    
    const embedSteps = Math.min(chunkCount, 4);
    for (let i = 0; i < embedSteps; i++) {
      await sleep(250);
      updateProgress(25 + (i + 1) * 7, 'embedding');
    }
    
    await sleep(400);
    addLog(createLog('embedding', 'Embeddings generated', 'success'));
    updateProgress(55, 'reasoning');

    // Phase 3: Reasoning
    await sleep(300);
    addLog(createLog('reasoning', 'Parsing backstory claims'));
    
    await sleep(500);
    const claimCount = Math.floor(Math.random() * 4) + 3;
    addLog(createLog('reasoning', `Found ${claimCount} claims to verify`));
    
    await sleep(400);
    addLog(createLog('reasoning', 'Running constraint analysis'));
    
    await sleep(350);
    addLog(createLog('reasoning', 'Checking temporal consistency'));
    
    await sleep(350);
    addLog(createLog('reasoning', 'Evaluating causal relationships'));
    
    await sleep(400);
    addLog(createLog('reasoning', 'Linking evidence to claims', 'success'));
    
    updateProgress(85, 'reasoning');
    await sleep(300);
    addLog(createLog('reasoning', 'Computing final verdict'));

    // Generate result
    await sleep(500);
    const isConsistent = Math.random() > 0.45;
    
    const mockEvidence1: Evidence[] = [
      {
        id: generateId(),
        quote: 'The salt-worn docks of her childhood village haunted her dreams, each creak of wood a reminder of the life she left behind.',
        chapterRef: 'Chapter 3, Page 47',
        relevanceScore: 0.94,
        analysisNote: 'Directly supports claim of coastal upbringing. The sensory details match backstory description.',
      },
    ];

    const mockEvidence2: Evidence[] = isConsistent ? [
      {
        id: generateId(),
        quote: 'His father\'s sword lessons echoed in muscle memory, each parry instinctive after years of practice in the dusty courtyard.',
        chapterRef: 'Chapter 12, Page 203',
        relevanceScore: 0.91,
        analysisNote: 'Confirms early training mentioned in backstory. Temporal alignment verified.',
      },
    ] : [
      {
        id: generateId(),
        quote: 'He gripped the blade awkwardly, its weight unfamiliar in his untrained hands. This was the first time he had ever held a weapon.',
        chapterRef: 'Chapter 8, Page 156',
        relevanceScore: 0.93,
        analysisNote: 'Directly contradicts backstory claim of martial training. Character demonstrates no prior experience.',
      },
    ];

    const mockClaims: Claim[] = [
      {
        id: generateId(),
        text: 'The protagonist spent their early childhood in a coastal fishing community',
        status: 'supported',
        confidence: 0.94,
        evidence: mockEvidence1,
      },
      {
        id: generateId(),
        text: 'The character received combat training from a family member',
        status: isConsistent ? 'supported' : 'contradicted',
        confidence: isConsistent ? 0.89 : 0.93,
        evidence: mockEvidence2,
      },
      {
        id: generateId(),
        text: 'Major events occurred during a period of political upheaval',
        status: 'unverified',
        confidence: 0.42,
        evidence: [],
      },
    ];

    const mockConstraints: ConstraintAnalysis[] = [
      {
        id: generateId(),
        constraintType: 'temporal',
        description: 'Character age progression matches timeline of narrative events',
        status: isConsistent ? 'satisfied' : 'violated',
        relatedClaims: [mockClaims[0].id],
      },
      {
        id: generateId(),
        constraintType: 'causal',
        description: 'Backstory motivations logically lead to observed character decisions',
        status: 'satisfied',
        relatedClaims: [mockClaims[1].id],
      },
      {
        id: generateId(),
        constraintType: 'character',
        description: 'Personality traits align with described formative experiences',
        status: isConsistent ? 'satisfied' : 'uncertain',
        relatedClaims: [mockClaims[0].id, mockClaims[1].id],
      },
      {
        id: generateId(),
        constraintType: 'factual',
        description: 'World-building details consistent with backstory assumptions',
        status: 'uncertain',
        relatedClaims: [mockClaims[2].id],
      },
    ];

    const result: AnalysisResult = {
      id: generateId(),
      storyId: finalStoryId,
      consistencyLabel: isConsistent ? 1 : 0,
      overallConfidence: isConsistent ? 0.86 : 0.84,
      rationale: isConsistent
        ? 'Key backstory elements find support in narrative evidence without contradiction.'
        : 'Critical backstory claims are refuted by explicit narrative passages.',
      explanation: isConsistent
        ? 'The proposed backstory is consistent with the narrative. Claims about the protagonist\'s origins and formative experiences are supported by textual evidence. Temporal, causal, and character constraints are satisfied. No significant contradictions were identified during analysis.'
        : 'The backstory contains inconsistencies with the narrative. While some claims about the protagonist\'s background are verified, critical elements regarding their training and abilities directly contradict established facts in the text. The evidence clearly shows a character with no prior combat experience, which refutes the backstory\'s claims.',
      claims: mockClaims,
      constraintAnalysis: mockConstraints,
      processingTime: Date.now() - initialJob.startTime.getTime(),
      timestamp: new Date(),
      track,
    };

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

    addLog(createLog('complete', `Verdict: ${isConsistent ? 'CONSISTENT (1)' : 'INCONSISTENT (0)'}`, 'success'));
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