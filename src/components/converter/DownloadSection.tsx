import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FilePlus2, FolderDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadSectionProps {
  resultUrl?: string;
  outputFormat: string;
  fileName: string;
  resultSizeBytes?: number;
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
  resultSizeBytes,
  onReset,
}: DownloadSectionProps) {
  const [isSaving, setIsSaving] = useState(false);
  const baseName = fileName.replace(/\.[^.]+$/, "");
  const downloadName = `${baseName}.${outputFormat}`;
  const previewCategory = getPreviewCategory(outputFormat);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const getFontFormat = (format: string) => {
    switch (format.toLowerCase()) {
      case "ttf":
        return "truetype";
      case "otf":
        return "opentype";
      case "woff":
        return "woff";
      case "woff2":
        return "woff2";
      default:
        return format.toLowerCase();
    }
  };

  const previewFontFamily = `${baseName.replace(/[^a-zA-Z0-9_-]/g, "-")}-preview`;

  const handleSaveTo = async () => {
    if (!resultUrl || isSaving) return;

    setIsSaving(true);
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const picker = (window as any).showSaveFilePicker;

      if (picker) {
        const fileHandle = await picker({
          suggestedName: downloadName,
          types: [
            {
              description: `${outputFormat.toUpperCase()} file`,
              accept: { "*/*": [`.${outputFormat.toLowerCase()}`] },
            },
          ],
        });

        if (fileHandle) {
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
          return;
        }
      }

      const link = document.createElement("a");
      link.href = resultUrl;
      link.download = downloadName;
      link.click();
    } catch (error) {
      console.error("Save to failed", error);
      const errName = (error as any)?.name;
      if (
        errName === "AbortError" ||
        errName === "NotAllowedError" ||
        errName === "SecurityError"
      ) {
        return;
      }

      alert(
        "Save to folder failed. Your browser may not support the file picker API. Use Download instead.",
      );
    } finally {
      setIsSaving(false);
    }
  };

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
            <div className="grid gap-4 text-left text-muted-foreground">
              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10">
                  <style>{`@font-face { font-family: '${previewFontFamily}'; src: url('${resultUrl}') format('${getFontFormat(outputFormat)}'); font-weight: 400; font-style: normal; }`}</style>
                  <span
                    className="text-2xl text-foreground"
                    style={{ fontFamily: `${previewFontFamily}, sans-serif` }}
                  >
                    Abg
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-foreground break-normal">
                    {downloadName}
                  </p>
                  {resultSizeBytes !== undefined && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        Size:
                      </span>{" "}
                      <span className="font-mono">
                        {formatFileSize(resultSizeBytes)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  Font conversion ready
                </p>
                <p>Download and install the converted font file.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <p className="font-semibold text-foreground">Conversion complete</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Your file is ready to download.
        </p>
        {resultSizeBytes !== undefined && (
          <p className="text-sm text-muted-foreground">
            Size: {formatFileSize(resultSizeBytes)}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
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
          onClick={handleSaveTo}
          disabled={!resultUrl || isSaving}
          data-testid="button-save-to"
        >
          <FolderDown size={20} />
          {isSaving ? "Saving..." : "Save As..."}
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          data-testid="button-convert-another"
        >
          <FilePlus2 size={20} />
          Convert Another
        </Button>
      </div>
    </motion.div>
  );
}
