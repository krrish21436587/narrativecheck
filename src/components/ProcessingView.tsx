import { useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Info, Clock } from 'lucide-react';
import { AnalysisJob, ProcessingLog } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface ProcessingViewProps {
  job: AnalysisJob;
}

const PHASES = [
  { key: 'chunking', label: 'Chunking Text', description: 'Splitting narrative into semantic chunks' },
  { key: 'embedding', label: 'Generating Embeddings', description: 'Creating vector representations' },
  { key: 'reasoning', label: 'Reasoning Analysis', description: 'Evaluating narrative consistency' },
  { key: 'complete', label: 'Complete', description: 'Analysis finished' },
];

function LogIcon({ level }: { level: ProcessingLog['level'] }) {
  switch (level) {
    case 'success':
      return <CheckCircle2 className="w-3 h-3 text-success" />;
    case 'warning':
      return <AlertCircle className="w-3 h-3 text-warning" />;
    case 'error':
      return <AlertCircle className="w-3 h-3 text-destructive" />;
    default:
      return <Info className="w-3 h-3 text-muted-foreground" />;
  }
}

export function ProcessingView({ job }: ProcessingViewProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [job.logs]);

  const currentPhaseIndex = PHASES.findIndex(p => p.key === job.status);
  const elapsedTime = Math.round((new Date().getTime() - job.startTime.getTime()) / 1000);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress Header */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Processing Analysis</h2>
              <p className="text-sm text-muted-foreground">
                Analyzing {job.storyFileName} with {job.backstoryFileName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm">{elapsedTime}s</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-mono text-primary">{job.progress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phase Indicators */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Processing Phases</h3>
        <div className="space-y-3">
          {PHASES.map((phase, index) => {
            const isActive = phase.key === job.status;
            const isComplete = index < currentPhaseIndex || job.status === 'complete';
            const isPending = index > currentPhaseIndex;

            return (
              <div
                key={phase.key}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-lg transition-all',
                  isActive && 'bg-primary/10 border border-primary/30',
                  isComplete && 'opacity-70',
                  isPending && 'opacity-40'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono',
                  isComplete && 'bg-success/20 text-success',
                  isActive && 'bg-primary/20 text-primary',
                  isPending && 'bg-secondary text-muted-foreground'
                )}>
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    'font-medium',
                    isActive && 'text-primary',
                    isPending && 'text-muted-foreground'
                  )}>
                    {phase.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{phase.description}</p>
                </div>
                {isActive && (
                  <div className="pulse-dot" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Logs */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Live Logs</h3>
        <div className="bg-terminal-bg rounded-lg border border-border p-4 max-h-64 overflow-y-auto">
          <div className="space-y-1">
            {job.logs.map((log) => (
              <div
                key={log.id}
                className={cn(
                  'log-entry flex items-start gap-2',
                  `log-${log.level}`
                )}
              >
                <LogIcon level={log.level} />
                <span className="text-muted-foreground opacity-60">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                <span className="text-primary/70">[{log.phase}]</span>
                <span>{log.message}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
