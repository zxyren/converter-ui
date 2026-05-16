import { useState, useEffect, useRef, useCallback } from "react";
import { Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { runDeveloperTool } from "../../services/api";
import { FileUploadButton, UploadedFile } from "./FileUploadButton";

// ── Client-side converters ───────────────────────────────────────────────────
function clientConvert(toolId: string, input: string): string | null {
  try {
    switch (toolId) {
      case "base64-encode":
        return btoa(unescape(encodeURIComponent(input)));
      case "base64-decode":
        return decodeURIComponent(escape(atob(input)));
      case "color-converter": {
        const hex = input.trim();
        if (/^#?([a-fA-F0-9]{6})$/.test(hex)) {
          const h = hex.replace("#", "");
          const r = parseInt(h.substring(0, 2), 16);
          const g = parseInt(h.substring(2, 4), 16);
          const b = parseInt(h.substring(4, 6), 16);
          return `RGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round(
            (Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * 180) / Math.PI,
          )}, ${Math.round(
            Math.max(r, g, b) === 0
              ? 0
              : ((Math.max(r, g, b) - Math.min(r, g, b)) / Math.max(r, g, b)) *
                  100,
          )}%, ${Math.round(((Math.max(r, g, b) + Math.min(r, g, b)) / 2 / 255) * 100)}%)`;
        }
        return null;
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
}

// ── Types ────────────────────────────────────────────────────────────────────
interface DevToolPanelProps {
  toolId: string;
  inputLabel?: string;
  outputLabel?: string;
  inputPlaceholder?: string;
  isClientSide?: boolean;
}

// Debounce delay for typed input (ms). File uploads convert instantly.
const DEBOUNCE_MS = 500;

// ── DevToolPanel ─────────────────────────────────────────────────────────────
export function DevToolPanel({
  toolId,
  inputLabel = "Input",
  outputLabel = "Output",
  inputPlaceholder = "Paste your input here...",
  isClientSide = false,
}: DevToolPanelProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  // Ref to hold the debounce timer
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Core convert logic ─────────────────────────────────────────────────────
  const convert = useCallback(
    async (value: string) => {
      if (!value.trim()) {
        setOutput("");
        setError(null);
        return;
      }

      setError(null);

      if (isClientSide) {
        const result = clientConvert(toolId, value);
        if (result !== null) {
          setOutput(result);
        } else {
          setError("Conversion failed. Check your input format.");
          setOutput("");
        }
        return;
      }

      setLoading(true);
      try {
        const { output: result } = await runDeveloperTool(toolId, value);
        setOutput(result);
      } catch {
        setError("Conversion failed. Please check your input and try again.");
        setOutput("");
      } finally {
        setLoading(false);
      }
    },
    [toolId, isClientSide],
  );

  // ── Auto-convert with debounce when user types ─────────────────────────────
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      convert(input);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [input, convert]);

  // ── File upload: convert immediately, no debounce ──────────────────────────
  const handleFileLoaded = (file: UploadedFile) => {
    setUploadedFile(file);
    setInput(file.content);
    setError(null);
    // Cancel any pending debounce and run immediately
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    convert(file.content);
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Input pane */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {inputLabel}
          </label>
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (uploadedFile) setUploadedFile(null);
            }}
            placeholder={inputPlaceholder}
            rows={10}
            data-testid="textarea-input"
            className="font-mono text-sm resize-none mt-3 w-full"
          />
        </div>

        {/* Output pane */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center justify-between mt-0">
            <label className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {outputLabel}
            </label>
            {/* Loading spinner sits next to the label while converting */}
            {loading && (
              <Loader2
                size={14}
                className="animate-spin text-muted-foreground"
              />
            )}
          </div>
          <div className="relative w-full">
            <Textarea
              value={output}
              readOnly
              rows={10}
              data-testid="textarea-output"
              placeholder="Output will appear here..."
              className="font-mono text-sm resize-none bg-secondary/50 mt-3 w-full"
            />
            {output && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                data-testid="button-copy"
                className="absolute right-2 top-5 h-6 gap-1 text-xs"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span className="hidden sm:inline">
                  {copied ? "Copied" : "Copy"}
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-yellow-500" data-testid="text-devtool-error">
          {error}
        </p>
      )}

      {/* Bottom bar — Upload only */}
      <div className="flex">
        <FileUploadButton
          toolId={toolId}
          uploadedFile={uploadedFile}
          onFileLoaded={handleFileLoaded}
          onClear={handleClearFile}
          disabled={loading}
        />
      </div>
    </div>
  );
}

// ── InstantDevToolPanel ──────────────────────────────────────────────────────
export function InstantDevToolPanel({
  toolId,
  inputLabel,
  outputLabel,
  inputPlaceholder,
}: DevToolPanelProps) {
  return (
    <DevToolPanel
      toolId={toolId}
      inputLabel={inputLabel}
      outputLabel={outputLabel}
      inputPlaceholder={inputPlaceholder}
      isClientSide={true}
    />
  );
}

// ── MarkdownPanel ────────────────────────────────────────────────────────────
export function MarkdownPanel() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const convert = useCallback(async (value: string) => {
    if (!value.trim()) {
      setOutput("");
      return;
    }
    setLoading(true);
    try {
      const { output: result } = await runDeveloperTool("md-html", value);
      setOutput(result);
    } catch {
      setOutput("<p>Conversion failed.</p>");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => convert(input), DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [input, convert]);

  const handleFileLoaded = (file: UploadedFile) => {
    setUploadedFile(file);
    setInput(file.content);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    convert(file.content);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Markdown input */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Markdown
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="# Hello World&#10;&#10;Write your **markdown** here..."
            rows={12}
            data-testid="textarea-markdown-input"
            className="font-mono text-sm resize-none w-full"
          />
        </div>

        {/* HTML output */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              HTML Output
            </label>
            <div className="flex items-center gap-2">
              {loading && (
                <Loader2
                  size={14}
                  className="animate-spin text-muted-foreground"
                />
              )}
              {output && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await navigator.clipboard.writeText(output);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="h-6 gap-1 text-xs"
                  data-testid="button-copy-html"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span className="hidden sm:inline">
                    {copied ? "Copied" : "Copy"}
                  </span>
                </Button>
              )}
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            rows={12}
            data-testid="textarea-html-output"
            placeholder="HTML output will appear here..."
            className="font-mono text-xs resize-none bg-secondary/50 w-full"
          />
        </div>
      </div>

      {/* Bottom bar — Upload only */}
      <div className="flex items-center justify-end">
        <FileUploadButton
          toolId="md-html"
          uploadedFile={uploadedFile}
          onFileLoaded={handleFileLoaded}
          onClear={() => {
            setUploadedFile(null);
            setInput("");
            setOutput("");
          }}
          disabled={loading}
        />
      </div>
    </div>
  );
}
