import { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronRight,
  Quote,
  Clock,
  Target,
  AlertTriangle,
  CheckSquare
} from 'lucide-react';
import { AnalysisResult, Claim, Evidence, ConstraintAnalysis } from '@/types/analysis';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface ResultsViewProps {
  result: AnalysisResult;
}

function EvidenceCard({ evidence }: { evidence: Evidence }) {
  return (
    <div className="p-3 bg-terminal-bg rounded-lg border border-border">
      <div className="flex items-start gap-2">
        <Quote className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-mono text-terminal-text">"{evidence.quote}"</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>{evidence.chapterRef}</span>
            <span className="evidence-link">
              Relevance: {(evidence.relevanceScore * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClaimCard({ claim }: { claim: Claim }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-panel overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-4 text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="shrink-0 mt-0.5">
          {expanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground">{claim.text}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className={cn(
              'claim-badge',
              claim.status === 'supported' && 'claim-supported',
              claim.status === 'contradicted' && 'claim-contradicted',
              claim.status === 'unverified' && 'claim-unverified'
            )}>
              {claim.status}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {claim.evidence.length} evidence{claim.evidence.length !== 1 ? 's' : ''}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {(claim.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
        </div>
      </button>
      
      {expanded && claim.evidence.length > 0 && (
        <div className="px-4 pb-4 pt-2 pl-14 space-y-2 animate-fade-in">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Supporting Evidence
          </h4>
          {claim.evidence.map((ev) => (
            <EvidenceCard key={ev.id} evidence={ev} />
          ))}
        </div>
      )}
    </div>
  );
}

function ConstraintCard({ constraint }: { constraint: ConstraintAnalysis }) {
  const icons = {
    temporal: Clock,
    spatial: Target,
    causal: ChevronRight,
    character: CheckSquare,
    factual: CheckCircle2,
  };
  const Icon = icons[constraint.constraintType] || AlertTriangle;

  return (
    <div className={cn(
      'p-4 rounded-lg border',
      constraint.status === 'satisfied' && 'bg-success/5 border-success/20',
      constraint.status === 'violated' && 'bg-destructive/5 border-destructive/20',
      constraint.status === 'uncertain' && 'bg-warning/5 border-warning/20'
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center',
          constraint.status === 'satisfied' && 'bg-success/20 text-success',
          constraint.status === 'violated' && 'bg-destructive/20 text-destructive',
          constraint.status === 'uncertain' && 'bg-warning/20 text-warning'
        )}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-muted-foreground">
              {constraint.constraintType}
            </span>
            <span className={cn(
              'text-xs font-medium',
              constraint.status === 'satisfied' && 'text-success',
              constraint.status === 'violated' && 'text-destructive',
              constraint.status === 'uncertain' && 'text-warning'
            )}>
              {constraint.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-foreground">{constraint.description}</p>
        </div>
      </div>
    </div>
  );
}

export function ResultsView({ result }: ResultsViewProps) {
  const isConsistent = result.consistencyLabel === 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Result Card */}
      <div className={cn(
        'glass-panel p-8 text-center',
        isConsistent ? 'border-success/30' : 'border-destructive/30'
      )}>
        <div className={cn(
          'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4',
          isConsistent ? 'bg-success/20' : 'bg-destructive/20'
        )}>
          {isConsistent ? (
            <CheckCircle2 className="w-10 h-10 text-success" />
          ) : (
            <XCircle className="w-10 h-10 text-destructive" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {isConsistent ? 'Consistent' : 'Inconsistent'}
        </h2>
        
        <p className="text-lg font-mono mb-4">
          <span className="text-muted-foreground">Label: </span>
          <span className={cn(
            'font-bold',
            isConsistent ? 'text-success' : 'text-destructive'
          )}>
            {result.consistencyLabel}
          </span>
        </p>

        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>Confidence: {(result.overallConfidence * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Processed in {(result.processingTime / 1000).toFixed(1)}s</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-left bg-secondary/30 rounded-lg p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Explanation</h3>
          <p className="text-foreground">{result.explanation}</p>
        </div>
      </div>

      {/* Claims Analysis */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Backstory Claims Analysis
          <span className="text-muted-foreground text-sm font-normal ml-2">
            ({result.claims.length} claims identified)
          </span>
        </h3>
        <div className="space-y-3">
          {result.claims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      </div>

      {/* Constraint Analysis */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Constraint Analysis
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {result.constraintAnalysis.map((constraint) => (
            <ConstraintCard key={constraint.id} constraint={constraint} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          New Analysis
        </Button>
        <Button variant="terminal">
          Export Results
        </Button>
      </div>
    </div>
  );
}
