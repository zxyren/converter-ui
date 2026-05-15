import { useState, useCallback } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropZone } from "./DropZone";
import { FormatSelector } from "./FormatSelector";
import { ProgressBar } from "./ProgressBar";
import { DownloadSection } from "./DownloadSection";
import { useConversion } from "../../hooks/useConversion";
import { validateFileSize, formatFileSize } from "../../utils/fileDetection";
import {
  getFileExtension,
  getAvailableOutputsForFile,
} from "../../utils/formatOptions";

interface ConversionPanelProps {
  category: string;
  extraFields?: React.ReactNode;
  extraOptions?: Record<string, string>;
}

export function ConversionPanel({
  category,
  extraFields,
  extraOptions,
}: ConversionPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<string | null>(null);
  const { job, startConversion, resetJob } = useConversion(category);

  const inputFormat = file ? getFileExtension(file) : null;
  const availableFormats = file
    ? getAvailableOutputsForFile(file, category)
    : [];

  const handleFile = useCallback(
    (f: File) => {
      const sizeErr = validateFileSize(f);
      if (sizeErr) {
        toast.error(sizeErr);
        return;
      }
      setFile(f);
      setOutputFormat(null);
      resetJob();
    },
    [resetJob],
  );

  const handleClear = useCallback(() => {
    setFile(null);
    setOutputFormat(null);
    resetJob();
  }, [resetJob]);

  const handleConvert = useCallback(async () => {
    if (!file || !outputFormat) return;
    try {
      await startConversion(
        file,
        getFileExtension(file),
        outputFormat,
        extraOptions,
      );
      toast.success("Conversion started");
    } catch {
      toast.error("Conversion failed. Please try again.");
    }
  }, [file, outputFormat, extraOptions, startConversion]);

  const isConverting =
    job?.status === "uploading" || job?.status === "processing";
  const isDone = job?.status === "done";
  const isError = job?.status === "error";
  const canConvert = !!file && !!outputFormat && !isConverting && !isDone;
  const isKeepOriginal = !!outputFormat && outputFormat === inputFormat;

  return (
    <div className="space-y-5">
      {!isDone && (
        <>
          <DropZone
            onFile={handleFile}
            currentFile={file}
            onClear={handleClear}
            disabled={isConverting}
          />

          <AnimatePresence mode="wait">
            {file && availableFormats.length > 0 && (
              <motion.div
                key="selector"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <FormatSelector
                  formats={availableFormats}
                  selected={outputFormat}
                  onSelect={setOutputFormat}
                />
                {extraFields}
              </motion.div>
            )}

            {file && availableFormats.length === 0 && (
              <motion.div
                key="unsupported"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                data-testid="text-unsupported-format"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                This file format is not supported. Please upload a different
                file.
              </motion.div>
            )}
          </AnimatePresence>

          {isConverting && job && (
            <ProgressBar
              progress={job.progress}
              status={
                job.status as "uploading" | "processing" | "done" | "error"
              }
            />
          )}

          {isError && job?.errorMessage && (
            <div
              className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              data-testid="text-conversion-error"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {job.errorMessage}
            </div>
          )}

          {canConvert && (
            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handleConvert}
              data-testid="button-convert"
            >
              {isKeepOriginal
                ? `Trim to ${outputFormat?.toUpperCase()}`
                : `Convert to ${outputFormat?.toUpperCase()}`}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          {file &&
            !outputFormat &&
            availableFormats.length > 0 &&
            !isConverting && (
              <p className="text-center text-xs text-muted-foreground">
                Select an output format above to continue
              </p>
            )}

          {isError && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleClear}
              data-testid="button-try-again"
            >
              Try again
            </Button>
          )}
        </>
      )}

      {isDone && job && (
        <DownloadSection
          resultUrl={job.resultUrl}
          outputFormat={job.outputFormat}
          fileName={job.file.name}
          onReset={handleClear}
        />
      )}
    </div>
  );
}

// Suppress unused import warning
void formatFileSize;
