import { motion } from "framer-motion";
import { Download, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadSectionProps {
  resultUrl?: string;
  outputFormat: string;
  fileName: string;
  onReset: () => void;
}

function getPreviewCategory(
  format: string,
): "image" | "video" | "audio" | "font" | "other" {
  const extension = format.toLowerCase();
  if (
    [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "gif",
      "bmp",
      "avif",
      "tiff",
      "tif",
      "ico",
    ].includes(extension)
  ) {
    return "image";
  }
  if (["mp4", "mov", "mkv", "avi", "webm", "m4v"].includes(extension)) {
    return "video";
  }
  if (["mp3", "wav", "aac", "flac", "ogg", "opus", "m4a"].includes(extension)) {
    return "audio";
  }
  if (["ttf", "otf", "woff", "woff2"].includes(extension)) {
    return "font";
  }
  return "other";
}

export function DownloadSection({
  resultUrl,
  outputFormat,
  fileName,
  onReset,
}: DownloadSectionProps) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const downloadName = `${baseName}.${outputFormat}`;
  const previewCategory = getPreviewCategory(outputFormat);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 p-6 text-center"
      data-testid="download-section"
    >
      {resultUrl && previewCategory !== "other" && (
        <div className="w-full overflow-hidden rounded-2xl border border-border bg-background p-4 text-left">
          {previewCategory === "image" && (
            <img
              src={resultUrl}
              alt={`Converted ${outputFormat}`}
              className="mx-auto max-h-60 w-full object-contain"
            />
          )}
          {previewCategory === "video" && (
            <video
              src={resultUrl}
              controls
              className="mx-auto max-h-60 w-full rounded-xl bg-black"
            />
          )}
          {previewCategory === "audio" && (
            <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Preview audio</p>
              <audio controls src={resultUrl} className="w-full" />
            </div>
          )}
          {previewCategory === "font" && (
            <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                Font conversion ready
              </p>
              <p>Download and install the converted font file.</p>
            </div>
          )}
        </div>
      )}

      <div>
        <p className="font-semibold text-foreground">Conversion complete</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Your file is ready to download.
        </p>
      </div>
      <div className="flex gap-3">
        {resultUrl ? (
          <Button asChild data-testid="button-download">
            <a href={resultUrl} download={downloadName}>
              <Download size={20} />
              Download {outputFormat.toUpperCase()}
            </a>
          </Button>
        ) : (
          <Button disabled data-testid="button-download-unavailable">
            <Download size={20} />
            Download {outputFormat.toUpperCase()}
          </Button>
        )}
        <Button
          variant="outline"
          onClick={onReset}
          data-testid="button-convert-another"
        >
          <RotateCcw size={20} />
          Convert another
        </Button>
      </div>
    </motion.div>
  );
}
