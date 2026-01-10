import { useState } from 'react';
import { ArrowRight, BookOpen, Brain, FileSearch, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { ProcessingView } from '@/components/ProcessingView';
import { ResultsView } from '@/components/ResultsView';
import { MetricsPanel } from '@/components/MetricsPanel';
import { TrackSelector } from '@/components/TrackSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnalysis } from '@/hooks/useAnalysis';
import { UploadedFile, Track } from '@/types/analysis';

type ViewState = 'upload' | 'processing' | 'results';

export default function Index() {
  const [viewState, setViewState] = useState<ViewState>('upload');
  const [storyFile, setStoryFile] = useState<UploadedFile | null>(null);
  const [backstoryFile, setBackstoryFile] = useState<UploadedFile | null>(null);
  const [storyId, setStoryId] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<Track>('A');
  const [showMetrics, setShowMetrics] = useState(false);
  
  const { job, metrics, runAnalysis, reset } = useAnalysis();

  const canSubmit = storyFile && backstoryFile;

  const handleSubmit = async () => {
    if (!storyFile || !backstoryFile) return;
    
    setViewState('processing');
    await runAnalysis(storyFile, backstoryFile, selectedTrack, storyId || undefined);
    setViewState('results');
  };

  const handleReset = () => {
    setStoryFile(null);
    setBackstoryFile(null);
    setStoryId('');
    setShowMetrics(false);
    setViewState('upload');
    reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {viewState === 'upload' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
            {/* Hero */}
            <div className="text-center py-6">
              <span className="badge badge-track mb-3">KDSH 2026</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Narrative Consistency Checker
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Determine whether a hypothetical backstory is consistent with a long-form narrative 
                using constraint tracking and causal reasoning.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: BookOpen, title: 'Long Context', desc: 'Handles 100k+ word novels' },
                { icon: Brain, title: 'Causal Reasoning', desc: 'Tracks constraints over time' },
                { icon: FileSearch, title: 'Evidence Linking', desc: 'Verbatim quote extraction' },
              ].map((item) => (
                <div key={item.title} className="card-elevated p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Track Selector */}
            <TrackSelector 
              selectedTrack={selectedTrack} 
              onTrackChange={setSelectedTrack} 
            />

            {/* File Upload Section */}
            <div className="card-elevated p-6 space-y-5">
              <div className="flex items-center gap-3">
                <span className="step-indicator step-active">1</span>
                <div>
                  <h2 className="font-semibold text-foreground">Upload Files</h2>
                  <p className="text-sm text-muted-foreground">
                    Provide the story text and hypothetical backstory
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FileUpload
                  label="Story Narrative"
                  description="Complete novel text (.txt)"
                  onFileSelect={setStoryFile}
                  selectedFile={storyFile}
                />
                <FileUpload
                  label="Hypothetical Backstory"
                  description="Character backstory to verify"
                  onFileSelect={setBackstoryFile}
                  selectedFile={backstoryFile}
                />
              </div>

              {/* Story ID input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Story ID <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Input
                  value={storyId}
                  onChange={(e) => setStoryId(e.target.value)}
                  placeholder="e.g., 1, 2, story_001..."
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Used in the results.csv export. Auto-generated if not provided.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            {canSubmit && (
              <div className="flex justify-center animate-fade-in">
                <Button onClick={handleSubmit} size="lg" className="gap-2">
                  Run Analysis
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Info Note */}
            <div className="card-elevated p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">How it works</p>
                <p>
                  The system extracts claims from the backstory, finds supporting or contradicting 
                  evidence in the narrative, and evaluates temporal, causal, and character constraints 
                  to produce a binary consistency judgment.
                </p>
              </div>
            </div>
          </div>
        )}

        {viewState === 'processing' && job && (
          <div className="max-w-3xl mx-auto">
            <ProcessingView job={job} />
          </div>
        )}

        {viewState === 'results' && job?.result && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Button variant="ghost" onClick={handleReset}>
                ← New Analysis
              </Button>
              <Button
                variant={showMetrics ? 'default' : 'outline'}
                onClick={() => setShowMetrics(!showMetrics)}
              >
                {showMetrics ? 'Show Results' : 'Show Metrics'}
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
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          <p>
            Kharagpur Data Science Hackathon 2026 • 
            <a 
              href="https://pathway.com" 
              className="text-primary hover:underline ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by Pathway
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}