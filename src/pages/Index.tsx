import { useState } from 'react';
import { ArrowRight, BookOpen, Cpu, FileText, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { ProcessingView } from '@/components/ProcessingView';
import { ResultsView } from '@/components/ResultsView';
import { MetricsPanel } from '@/components/MetricsPanel';
import { Button } from '@/components/ui/button';
import { useAnalysis } from '@/hooks/useAnalysis';
import { UploadedFile } from '@/types/analysis';

type ViewState = 'upload' | 'processing' | 'results';

export default function Index() {
  const [viewState, setViewState] = useState<ViewState>('upload');
  const [storyFile, setStoryFile] = useState<UploadedFile | null>(null);
  const [backstoryFile, setBackstoryFile] = useState<UploadedFile | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);
  
  const { job, metrics, runAnalysis, reset } = useAnalysis();

  const canSubmit = storyFile && backstoryFile;

  const handleSubmit = async () => {
    if (!storyFile || !backstoryFile) return;
    
    setViewState('processing');
    await runAnalysis(storyFile, backstoryFile);
    setViewState('results');
  };

  const handleReset = () => {
    setStoryFile(null);
    setBackstoryFile(null);
    setShowMetrics(false);
    setViewState('upload');
    reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 pt-24 pb-12">
        {viewState === 'upload' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-mono">
                <Sparkles className="w-4 h-4" />
                KDSH 2026 Competition
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Narrative Consistency
                <span className="gradient-text block mt-1">Reasoning Platform</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Analyze whether hypothetical backstories are consistent with long-form narratives 
                using advanced reasoning and constraint tracking.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-4 py-6">
              {[
                { icon: BookOpen, title: 'Long-Context', desc: '100k+ word narratives' },
                { icon: Cpu, title: 'Causal Reasoning', desc: 'Constraint tracking' },
                { icon: FileText, title: 'Evidence Linking', desc: 'Verbatim quotes' },
              ].map((feature) => (
                <div key={feature.title} className="glass-panel p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Section */}
            <div className="glass-panel p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-mono text-primary font-bold">
                  1
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Upload Files</h2>
                  <p className="text-sm text-muted-foreground">
                    Provide the story and backstory text files for analysis
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FileUpload
                  label="Story File"
                  description="The main narrative (supports 100k+ words)"
                  onFileSelect={setStoryFile}
                  selectedFile={storyFile}
                />
                <FileUpload
                  label="Backstory File"
                  description="Hypothetical backstory to verify"
                  onFileSelect={setBackstoryFile}
                  selectedFile={backstoryFile}
                />
              </div>

              {canSubmit && (
                <div className="flex justify-center pt-4 animate-fade-in">
                  <Button 
                    variant="glow" 
                    size="xl"
                    onClick={handleSubmit}
                    className="gap-2"
                  >
                    Start Analysis
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>

            {/* Config Note */}
            <div className="glass-panel p-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-warning" />
                <span className="text-muted-foreground">
                  BDH Integration: <span className="text-warning font-mono">disabled</span>
                </span>
                <span className="text-muted-foreground ml-auto">
                  Configure in <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">config.yaml</code>
                </span>
              </div>
            </div>
          </div>
        )}

        {viewState === 'processing' && job && (
          <div className="max-w-4xl mx-auto">
            <ProcessingView job={job} />
          </div>
        )}

        {viewState === 'results' && job?.result && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleReset}>
                ← New Analysis
              </Button>
              <Button
                variant={showMetrics ? 'default' : 'outline'}
                onClick={() => setShowMetrics(!showMetrics)}
              >
                {showMetrics ? 'Hide Metrics' : 'Show Metrics'}
              </Button>
            </div>

            {showMetrics && metrics ? (
              <MetricsPanel metrics={metrics} />
            ) : (
              <ResultsView result={job.result} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p className="font-mono">
            NarrativeCheck v1.0.0 • Built for KDSH 2026 • 
            <a href="#" className="text-primary hover:underline ml-1">Documentation</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
