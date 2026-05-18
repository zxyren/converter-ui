import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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

  const colorPreview = useMemo(() => {
    const hex = input.trim();
    if (/^#?([a-fA-F0-9]{6})$/.test(hex)) {
      return `#${hex.replace(/^#/, "")}`;
    }
    return null;
  }, [input]);

  const colorInputClass = useMemo(() => {
    if (toolId !== "color-converter") return "";
    if (!input.trim()) return "";
    return colorPreview
      ? "ring-2 ring-emerald-400/40"
      : "ring-2 ring-rose-400/40";
  }, [toolId, colorPreview, input]);

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
          <div className="relative mt-3">
            <Textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (uploadedFile) setUploadedFile(null);
              }}
              placeholder={inputPlaceholder}
              rows={10}
              data-testid="textarea-input"
              className={`font-mono text-sm resize-none w-full ${colorInputClass}`}
            />
            {toolId === "color-converter" && (
              <div className="absolute right-3 top-3 flex items-center">
                <span
                  className="inline-block h-6 w-6 rounded border border-border"
                  style={{ backgroundColor: colorPreview ?? "transparent" }}
                />
              </div>
            )}
          </div>
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
  return (
    <DevToolPanel
      toolId="md-html"
      inputLabel="Markdown"
      outputLabel="HTML Output"
      inputPlaceholder={`# Hello World\n\nWrite your **markdown** here...`}
    />
  );
}
