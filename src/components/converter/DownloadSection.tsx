import { motion } from 'framer-motion';
import { Download, CheckCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadSectionProps {
  resultUrl?: string;
  outputFormat: string;
  fileName: string;
  onReset: () => void;
}

export function DownloadSection({ resultUrl, outputFormat, fileName, onReset }: DownloadSectionProps) {
  const baseName = fileName.replace(/\.[^.]+$/, '');
  const downloadName = `${baseName}.${outputFormat}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 p-6 text-center"
      data-testid="download-section"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
        <CheckCircle className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="font-semibold text-foreground">Conversion complete</p>
        <p className="mt-0.5 text-sm text-muted-foreground">Your file is ready to download.</p>
      </div>
      <div className="flex gap-3">
        {resultUrl ? (
          <Button asChild data-testid="button-download">
            <a href={resultUrl} download={downloadName}>
              <Download className="mr-2 h-4 w-4" />
              Download {outputFormat.toUpperCase()}
            </a>
          </Button>
        ) : (
          <Button disabled data-testid="button-download-unavailable">
            <Download className="mr-2 h-4 w-4" />
            Download {outputFormat.toUpperCase()}
          </Button>
        )}
        <Button variant="outline" onClick={onReset} data-testid="button-convert-another">
          <RotateCcw className="mr-2 h-4 w-4" />
          Convert another
        </Button>
      </div>
    </motion.div>
  );
}
