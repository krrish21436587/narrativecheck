import { useEffect, useRef } from 'react';
import { Loader2, Check, AlertCircle, Info, Clock } from 'lucide-react';
import { AnalysisJob, ProcessingLog } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface ProcessingViewProps {
  job: AnalysisJob;
}

const PHASES = [
  { key: 'chunking', label: 'Text Chunking', description: 'Splitting narrative into segments' },
  { key: 'embedding', label: 'Embedding Generation', description: 'Creating vector representations' },
  { key: 'reasoning', label: 'Reasoning Analysis', description: 'Evaluating consistency' },
  { key: 'complete', label: 'Complete', description: 'Analysis finished' },
];

function LogIcon({ level }: { level: ProcessingLog['level'] }) {
  switch (level) {
    case 'success':
      return <Check className="w-3 h-3 text-success" />;
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
      {/* Header */}
      <div className="card-elevated p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Processing Analysis</h2>
              <p className="text-sm text-muted-foreground">
                Story: {job.storyFileName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{elapsedTime}s</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium text-foreground">{job.progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${job.progress}%` }} />
          </div>
        </div>
      </div>

      {/* Phase Steps */}
      <div className="card-elevated p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Processing Steps</h3>
        <div className="space-y-3">
          {PHASES.map((phase, index) => {
            const isActive = phase.key === job.status;
            const isComplete = index < currentPhaseIndex || job.status === 'complete';
            const isPending = index > currentPhaseIndex;

            return (
              <div
                key={phase.key}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-lg transition-colors',
                  isActive && 'bg-primary/5'
                )}
              >
                <div className={cn(
                  'step-indicator',
                  isComplete && 'step-complete',
                  isActive && 'step-active',
                  isPending && 'step-pending'
                )}>
                  {isComplete ? (
                    <Check className="w-4 h-4" />
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
              </div>
            );
          })}
        </div>
      </div>

      {/* Logs */}
      <div className="card-elevated p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Processing Log</h3>
        <div className="bg-muted/50 rounded-lg border border-border p-4 max-h-48 overflow-y-auto">
          <div className="space-y-1">
            {job.logs.map((log) => (
              <div
                key={log.id}
                className={cn('log-entry flex items-start gap-2', `log-${log.level}`)}
              >
                <LogIcon level={log.level} />
                <span className="text-muted-foreground/60 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-primary/70 shrink-0">[{log.phase}]</span>
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