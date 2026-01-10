import { useCallback, useState } from 'react';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { UploadedFile } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  label: string;
  description: string;
  accept?: string;
  onFileSelect: (file: UploadedFile | null) => void;
  selectedFile: UploadedFile | null;
}

export function FileUpload({
  label,
  description,
  accept = '.txt',
  onFileSelect,
  selectedFile,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    const content = await file.text();
    onFileSelect({
      file,
      name: file.name,
      size: file.size,
      content,
    });
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (selectedFile) {
    return (
      <div className="glass-panel p-4 animate-fade-in">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{selectedFile.name}</span>
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                {formatFileSize(selectedFile.size)} • {selectedFile.content?.split(/\s+/).length.toLocaleString()} words
              </p>
            </div>
          </div>
          <button
            onClick={() => onFileSelect(null)}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-3 p-3 rounded-md bg-terminal-bg border border-border">
          <p className="text-xs font-mono text-terminal-text line-clamp-3">
            {selectedFile.content?.slice(0, 300)}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'upload-zone animate-fade-in',
        isDragging && 'active'
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        id={`file-upload-${label}`}
      />
      <label htmlFor={`file-upload-${label}`} className="cursor-pointer">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">{label}</p>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Drop file here or click to browse
          </p>
        </div>
      </label>
    </div>
  );
}
