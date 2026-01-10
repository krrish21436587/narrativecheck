import { Brain, Github } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-t-0 border-x-0 rounded-none">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="w-8 h-8 text-primary" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                NarrativeCheck
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                KDSH 2026
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <span className="text-xs font-mono text-muted-foreground">
              v1.0.0-beta
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
