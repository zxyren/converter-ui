import { useRef } from "react";
import { FileUp, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOOL_ACCEPTED_FILES: Record<string, string> = {
  "json-xml": ".json",
  "xml-json": ".xml",
  "yaml-json": ".yaml,.yml",
  "json-yaml": ".json",
  "base64-encode": ".txt,.json,.xml,.yaml,.yml,.csv,.md",
  "base64-decode": ".txt",
  "md-html": ".md,.markdown",
  "color-converter": ".txt",
};

function getAcceptedFiles(toolId: string): string {
  return TOOL_ACCEPTED_FILES[toolId] ?? ".txt,.json,.xml,.yaml,.yml,.csv,.md";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface UploadedFile {
  name: string;
  size: number;
  content: string;
}

interface FileUploadButtonProps {
  toolId: string;
  uploadedFile: UploadedFile | null;
  onFileLoaded: (file: UploadedFile) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function FileUploadButton({
  toolId,
  uploadedFile,
  onFileLoaded,
  onClear,
  disabled = false,
}: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFile = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const content = await readFile(file);
      onFileLoaded({ name: file.name, size: file.size, content });
    } catch {}
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptedFiles(toolId)}
        className="hidden"
        onChange={handleFileChange}
        data-testid="input-file-upload"
      />

      {uploadedFile ? (
        <>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              data-testid="button-devtool-upload"
            >
              <FileText size={16} />
              <span className="truncate">{uploadedFile.name}</span>
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={onClear}
              aria-label="Remove file"
              data-testid="button-remove-file"
              className="group"
            >
              <X
                size={16}
                className="group-hover:rotate-90 duration-300 transition-all"
              />
            </Button>
            <span className="text-sm font-semibold font-mono text-muted-foreground ml-1">
              {formatSize(uploadedFile.size)}
            </span>
          </div>
        </>
      ) : (
        <Button
          variant="outline"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          data-testid="button-devtool-upload"
        >
          <FileUp size={16} className="shrink-0" />
          Upload File
        </Button>
      )}
    </div>
  );
}
