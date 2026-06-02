import { FileText, Image, Video, Music, Type, X } from "lucide-react";
import { formatFileSize } from "../../utils/fileDetection";
import { Button } from "@/components/ui/button";
import { DOCIcon, DOCXIcon, PDFIcon } from "../icons/previewIcons";

interface FontPreview {
  family: string;
  url: string;
  format: string;
}

interface FilePreviewProps {
  file: File;
  category: "image" | "video" | "audio" | "font" | "document" | "other";
  previewUrl: string | null;
  fontPreview: FontPreview | null;
  duration: number | null;
  onClear?: () => void;
  onVideoLoadedMetadata?: (duration: number) => void;
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
    case "document":
      return FileText;
    default:
      return FileText;
  }
}

function getDocumentIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return PDFIcon;
  if (ext === "docx") return DOCXIcon;
  if (ext === "doc") return DOCIcon;
  return FileText;
}

function formatDuration(seconds: number) {
  const rounded = Math.round(seconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const secs = rounded % 60;
  const padded = (value: number) => value.toString().padStart(2, "0");

  if (hours > 0) {
    return `${padded(hours)}:${padded(minutes)}:${padded(secs)}`;
  }

  return `${padded(minutes)}:${padded(secs)}`;
}

function getDisplayFileName(fileName: string, maxLength = 28) {
  if (fileName.length <= maxLength) return fileName;

  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex === -1 || dotIndex === 0) {
    return `${fileName.slice(0, maxLength - 3)}...`;
  }

  const extension = fileName.slice(dotIndex);
  const baseName = fileName.slice(0, dotIndex);
  const maxBaseLength = maxLength - extension.length - 3;

  if (maxBaseLength <= 0) {
    return `...${extension}`;
  }

  return `${baseName.slice(0, maxBaseLength)}...${extension}`;
}

function getAudioGradient(fileName: string): string {
  const hash = fileName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    "from-purple-600 to-pink-600",
    "from-blue-600 to-cyan-600",
    "from-green-600 to-emerald-600",
    "from-orange-600 to-red-600",
    "from-indigo-600 to-purple-600",
    "from-lime-600 to-green-600",
  ];
  return gradients[hash % gradients.length];
}

export function FilePreview({
  file,
  category,
  previewUrl,
  fontPreview,
  duration,
  onClear,
  onVideoLoadedMetadata,
}: FilePreviewProps) {
  const IconComponent = getIcon(category);
  const previewText = "Abg";
  const displayName = getDisplayFileName(file.name);

  return (
    <div className="relative w-full max-w-full rounded-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-30 w-30 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 sm:h-35 sm:w-35">
            {fontPreview ? (
              <>
                <style>{`@font-face { font-family: '${fontPreview.family}'; src: url('${fontPreview.url}') format('${fontPreview.format}'); font-weight: 400; font-style: normal; }`}</style>
                <span
                  className="text-2xl leading-none dark:text-white text-black"
                  style={{ fontFamily: fontPreview.family }}
                >
                  {previewText}
                </span>
              </>
            ) : previewUrl ? (
              category === "image" ? (
                <img
                  src={previewUrl}
                  alt={file.name}
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
                    onVideoLoadedMetadata?.(e.currentTarget.duration)
                  }
                />
              )
            ) : category === "document" && previewUrl ? (
              <iframe
                src={previewUrl}
                title={file.name}
                className="h-full w-full rounded-lg bg-white"
              />
            ) : category === "audio" ? (
              <div
                className={`h-full w-full bg-linear-to-br ${getAudioGradient(file.name)} flex items-center justify-center`}
              >
                <Music size={28} className="text-white" />
              </div>
            ) : category === "document" ? (
              <div className="flex items-center justify-center">
                {(() => {
                  const DocumentIcon = getDocumentIcon(file.name);
                  return <DocumentIcon size={32} className="text-primary" />;
                })()}
              </div>
            ) : (
              <IconComponent size={28} className="text-primary" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="text-base mb-2 font-semibold text-foreground truncate"
              title={file.name}
              data-testid="text-filename"
            >
              {displayName}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold ">Size:</span>{" "}
              <span className="font-mono">{formatFileSize(file.size)}</span>
            </p>
            {duration !== null &&
              (category === "video" || category === "audio") && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold ">Duration:</span>{" "}
                  <span className="font-mono">{formatDuration(duration)}</span>
                </p>
              )}
          </div>
        </div>
      </div>

      {onClear && (
        <Button
          variant="destructive"
          size="icon"
          onClick={onClear}
          data-testid="button-clear-file"
          className="absolute group right-2 top-2 h-8 w-8 sm:right-2 sm:top-2"
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
