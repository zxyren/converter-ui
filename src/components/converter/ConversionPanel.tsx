import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropZone } from "./DropZone";
import { FormatSelector } from "./FormatSelector";
import { DownloadSection } from "./DownloadSection";
import { useConversion } from "../../hooks/useConversion";
import { validateFileSize, formatFileSize } from "../../utils/fileDetection";
import {
  getFileExtension,
  getAvailableOutputsForFile,
} from "../../utils/formatOptions";

function ProcessingBorder() {
  return (
    <>
      <style>{`
        @keyframes conic-spin { to { transform: rotate(360deg); } }
        .proc-ring { position:absolute;inset:-2px;border-radius:9px;pointer-events:none;overflow:hidden;z-index:0; }
        .proc-ring::before { content:'';position:absolute;inset:-120%;background:conic-gradient(from 0deg,transparent 0deg,#7c5cfc 50deg,#a78bfa 80deg,#38bdf8 130deg,transparent 180deg);animation:conic-spin 1.6s linear infinite; }
        .proc-ring::after { content:'';position:absolute;inset:2px;border-radius:7px;background:hsl(var(--background)); }
      `}</style>
      <div className="proc-ring" />
    </>
  );
}

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

  const acceptForCategory = useMemo(() => {
    switch (category) {
      case "image":
        return "image/*";
      case "video":
        return "video/*";
      case "audio":
        return "audio/*";
      case "font":
        return ".ttf,.otf,.woff,.woff2";
      default:
        return undefined;
    }
  }, [category]);

  return (
    <div className="space-y-5">
      {!isDone && (
        <>
          <DropZone
            accept={acceptForCategory}
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
                className="flex items-center gap-2 rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-500"
                data-testid="text-unsupported-format"
              >
                <AlertCircle size={20} />
                This file format is not supported. Please upload a different
                file.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated border "Converting…" state */}
          {isConverting && (
            <div className="relative">
              <ProcessingBorder />
              <Button
                disabled
                variant="ghost"
                className="relative z-10 w-full cursor-not-allowed"
              >
                {job?.status === "uploading" ? "Uploading…" : "Converting…"}
              </Button>
            </div>
          )}

          {isError && job?.errorMessage && (
            <div
              className="flex items-center gap-2 rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-500"
              data-testid="text-conversion-error"
            >
              <AlertCircle size={20} />
              {job.errorMessage}
            </div>
          )}

          {canConvert && (
            <Button
              className="w-full text-foreground"
              onClick={handleConvert}
              data-testid="button-convert"
            >
              Convert to{" "}
              {isKeepOriginal
                ? `Trim to ${outputFormat?.toUpperCase()}`
                : `${outputFormat?.toUpperCase()}`}
              <ArrowRight size={20} />
            </Button>
          )}

          {file &&
            !outputFormat &&
            availableFormats.length > 0 &&
            !isConverting && (
              <p className="text-center text-sm text-yellow-400">
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
          resultSizeBytes={job.resultSizeBytes}
          onReset={handleClear}
        />
      )}
    </div>
  );
}

// Suppress unused import warning
void formatFileSize;
