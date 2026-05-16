import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  X,
  Image,
  Video,
  Music,
  Type,
  Paperclip,
} from "lucide-react";
import { formatFileSize, validateFileSize } from "../../utils/fileDetection";
import { Button } from "@/components/ui/button";

const IMAGE_EXTENSIONS = new Set([
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
]);
const VIDEO_EXTENSIONS = new Set(["mp4", "mov", "mkv", "avi", "webm", "m4v"]);
const AUDIO_EXTENSIONS = new Set([
  "mp3",
  "wav",
  "aac",
  "flac",
  "ogg",
  "opus",
  "m4a",
]);
const FONT_EXTENSIONS = new Set(["ttf", "otf", "woff", "woff2"]);

interface DropZoneProps {
  accept?: string;
  onFile: (file: File) => void;
  currentFile?: File | null;
  onClear?: () => void;
  disabled?: boolean;
}

function getFileCategory(
  file: File,
): "image" | "video" | "audio" | "font" | "other" {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (IMAGE_EXTENSIONS.has(ext) || file.type.startsWith("image/"))
    return "image";
  if (VIDEO_EXTENSIONS.has(ext) || file.type.startsWith("video/"))
    return "video";
  if (AUDIO_EXTENSIONS.has(ext) || file.type.startsWith("audio/"))
    return "audio";
  if (FONT_EXTENSIONS.has(ext)) return "font";
  return "other";
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);
  const padded = (value: number) => value.toString().padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${padded(minutes)}:${padded(secs)}`;
  }

  return `${minutes}:${padded(secs)}`;
}

function getIcon(category: string) {
  switch (category) {
    case "image":
      return Image;
    case "video":
      return Video;
    case "audio":
      return Music;
    case "font":
      return Type;
    default:
      return FileText;
  }
}

function getFontFormat(ext: string) {
  switch (ext) {
    case "woff2":
      return "woff2";
    case "woff":
      return "woff";
    case "ttf":
      return "truetype";
    case "otf":
      return "opentype";
    default:
      return undefined;
  }
}

export function DropZone({
  accept,
  onFile,
  currentFile,
  onClear,
  disabled,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fontPreview, setFontPreview] = useState<{
    family: string;
    url: string;
    format: string;
  } | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const category = currentFile ? getFileCategory(currentFile) : "other";

  const handleFile = useCallback(
    (file: File) => {
      const sizeError = validateFileSize(file);
      if (sizeError) {
        setError(sizeError);
        return;
      }
      setError(null);
      onFile(file);
    },
    [onFile],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  useEffect(() => {
    let url: string | null = null;

    if (currentFile && (category === "image" || category === "video")) {
      url = URL.createObjectURL(currentFile);
      setPreviewUrl(url);
      setFontPreview(null);
    } else {
      setPreviewUrl(null);
    }

    if (currentFile && category === "font") {
      const ext = currentFile.name.split(".").pop()?.toLowerCase() ?? "";
      const format = getFontFormat(ext);

      if (format) {
        url = URL.createObjectURL(currentFile);
        setFontPreview({
          family: `uploaded-font-${Math.random().toString(36).slice(2, 8)}`,
          url,
          format,
        });
      } else {
        setFontPreview(null);
      }
    } else if (category !== "font") {
      setFontPreview(null);
    }

    if (!currentFile || category !== "video") {
      setDuration(null);
    }

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [currentFile, category]);

  if (currentFile) {
    const IconComponent = getIcon(category);
    const previewText = "Abg";

    return (
      <div className="rounded-xl border border-border bg-card p-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
            {fontPreview ? (
              <>
                <style>{`@font-face { font-family: '${fontPreview.family}'; src: url('${fontPreview.url}') format('${fontPreview.format}'); font-weight: 400; font-style: normal; }`}</style>
                <span
                  className="text-2xl font-semibold leading-none text-primary"
                  style={{ fontFamily: fontPreview.family }}
                >
                  {previewText}
                </span>
              </>
            ) : previewUrl ? (
              category === "image" ? (
                <img
                  src={previewUrl}
                  alt={currentFile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <video
                  src={previewUrl}
                  className="h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                  onLoadedMetadata={(e) =>
                    setDuration(e.currentTarget.duration)
                  }
                />
              )
            ) : (
              <IconComponent className="h-7 w-7 text-primary" />
            )}
          </div>
          <div className="min-w-0 flex flex-col items-start gap-1">
            <p
              className="text-base font-medium text-foreground truncate"
              data-testid="text-filename"
            >
              {currentFile.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(currentFile.size)}
            </p>
            {duration !== null && category === "video" && (
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-bold">Duration:</span>{" "}
                <span className="font-mono">{formatDuration(duration)}</span>
              </p>
            )}
          </div>
        </div>
        {onClear && (
          <Button
            variant="destructive"
            size="icon"
            onClick={onClear}
            data-testid="button-clear-file"
            className="h-8 w-8 group"
          >
            <X
              size={16}
              className="group-hover:rotate-90 duration-300 transition-all"
            />
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
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
        } ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        <motion.div
          animate={{ y: isDragging ? -4 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
        >
          <Paperclip size={23} className="text-primary" />
        </motion.div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Drop your file here, or <span className="text-primary">browse</span>
          </p>
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            Up to 500 MB supported
          </p>
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
        <p
          className="mt-2 text-xs text-destructive"
          data-testid="text-file-error"
        >
          {error}
        </p>
      )}
    </div>
  );
}
