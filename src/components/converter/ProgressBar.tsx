import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  status: 'uploading' | 'processing' | 'done' | 'error';
}

const STATUS_LABELS: Record<string, string> = {
  uploading: 'Uploading...',
  processing: 'Converting...',
  done: 'Done',
  error: 'Error',
};

export function ProgressBar({ progress, status }: ProgressBarProps) {
  const isError = status === 'error';
  const isDone = status === 'done';

  return (
    <div className="space-y-2" data-testid="progress-bar-container">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
          {!isDone && !isError && (
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          )}
          {STATUS_LABELS[status]}
        </span>
        <span className={`font-semibold tabular-nums ${isError ? 'text-destructive' : isDone ? 'text-primary' : 'text-foreground'}`}>
          {isError ? 'Failed' : `${Math.round(progress)}%`}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${isError ? 100 : progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            isError ? 'bg-destructive' : isDone ? 'bg-primary' : 'bg-primary'
          }`}
        />
      </div>
    </div>
  );
}
