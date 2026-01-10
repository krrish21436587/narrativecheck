import { Metrics } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface MetricsPanelProps {
  metrics: Metrics;
}

function MetricValue({ label, value, suffix = '%' }: { label: string; value: number; suffix?: string }) {
  const displayValue = suffix === '%' ? (value * 100).toFixed(1) : value.toString();
  
  return (
    <div className="metric-card">
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <span className="text-2xl font-bold gradient-text">
        {displayValue}{suffix}
      </span>
    </div>
  );
}

function ConfusionMatrix({ matrix }: { matrix: Metrics['confusionMatrix'] }) {
  const cells = [
    { label: 'TP', value: matrix.truePositive, position: 'top-left' },
    { label: 'FP', value: matrix.falsePositive, position: 'top-right' },
    { label: 'FN', value: matrix.falseNegative, position: 'bottom-left' },
    { label: 'TN', value: matrix.trueNegative, position: 'bottom-right' },
  ];

  return (
    <div className="glass-panel p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Confusion Matrix</h3>
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-2 gap-2 w-fit">
          {cells.map((cell) => (
            <div
              key={cell.label}
              className={cn(
                'w-24 h-24 rounded-lg flex flex-col items-center justify-center',
                (cell.label === 'TP' || cell.label === 'TN') 
                  ? 'bg-success/10 border border-success/30' 
                  : 'bg-destructive/10 border border-destructive/30'
              )}
            >
              <span className="text-xs font-mono text-muted-foreground">{cell.label}</span>
              <span className={cn(
                'text-2xl font-bold',
                (cell.label === 'TP' || cell.label === 'TN') ? 'text-success' : 'text-destructive'
              )}>
                {cell.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-8 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-success/20 border border-success/30" />
          <span>Correct</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-destructive/20 border border-destructive/30" />
          <span>Incorrect</span>
        </div>
      </div>
    </div>
  );
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Evaluation Metrics</h3>
        <div className="data-grid">
          <MetricValue label="Accuracy" value={metrics.accuracy} />
          <MetricValue label="Precision" value={metrics.precision} />
          <MetricValue label="Recall" value={metrics.recall} />
          <MetricValue label="F1 Score" value={metrics.f1Score} />
        </div>
      </div>

      <ConfusionMatrix matrix={metrics.confusionMatrix} />

      <div className="glass-panel p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Results saved to</span>
          <code className="font-mono text-primary bg-primary/10 px-2 py-1 rounded">
            metrics/metrics.txt
          </code>
        </div>
      </div>
    </div>
  );
}
