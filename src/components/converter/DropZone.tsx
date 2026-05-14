import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X } from 'lucide-react';
import { formatFileSize, validateFileSize } from '../../utils/fileDetection';
import { Button } from '@/components/ui/button';

interface DropZoneProps {
  accept?: string;
  onFile: (file: File) => void;
  currentFile?: File | null;
  onClear?: () => void;
  disabled?: boolean;
}

export function DropZone({ accept, onFile, currentFile, onClear, disabled }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    const sizeError = validateFileSize(file);
    if (sizeError) {
      setError(sizeError);
      return;
    }
    setError(null);
    onFile(file);
  }, [onFile]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  if (currentFile) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate" data-testid="text-filename">{currentFile.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(currentFile.size)}</p>
          </div>
        </div>
        {onClear && (
          <Button variant="ghost" size="icon" onClick={onClear} data-testid="button-clear-file" className="h-8 w-8 shrink-0">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <motion.div
        animate={{ scale: isDragging ? 1.01 : 1 }}
        transition={{ duration: 0.15 }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        data-testid="dropzone"
        className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:border-primary/50 hover:bg-primary/[0.02]'
        } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      >
        <motion.div
          animate={{ y: isDragging ? -4 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
        >
          <Upload className="h-6 w-6 text-primary" />
        </motion.div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Drop your file here, or <span className="text-primary">browse</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Up to 500 MB supported</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onInputChange}
          data-testid="input-file"
        />
      </motion.div>
      {error && (
        <p className="mt-2 text-xs text-destructive" data-testid="text-file-error">{error}</p>
      )}
    </div>
  );
}
