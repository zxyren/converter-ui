import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { runDeveloperTool } from '../../services/api';

// Client-side converters for instant results
function clientConvert(toolId: string, input: string): string | null {
  try {
    switch (toolId) {
      case 'base64-encode':
        return btoa(unescape(encodeURIComponent(input)));
      case 'base64-decode':
        return decodeURIComponent(escape(atob(input)));
      case 'color-converter': {
        const hex = input.trim();
        if (/^#?([a-fA-F0-9]{6})$/.test(hex)) {
          const h = hex.replace('#', '');
          const r = parseInt(h.substring(0, 2), 16);
          const g = parseInt(h.substring(2, 4), 16);
          const b = parseInt(h.substring(4, 6), 16);
          return `RGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round(
            (Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * 180) / Math.PI
          )}, ${Math.round(
            Math.max(r, g, b) === 0
              ? 0
              : ((Math.max(r, g, b) - Math.min(r, g, b)) /
                  Math.max(r, g, b)) * 100
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

interface DevToolPanelProps {
  toolId: string;
  inputLabel?: string;
  outputLabel?: string;
  inputPlaceholder?: string;
  isClientSide?: boolean;
}

export function DevToolPanel({
  toolId,
  inputLabel = 'Input',
  outputLabel = 'Output',
  inputPlaceholder = 'Paste your input here...',
  isClientSide = false,
}: DevToolPanelProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    if (!input.trim()) return;
    setError(null);

    if (isClientSide) {
      const result = clientConvert(toolId, input);
      if (result !== null) {
        setOutput(result);
      } else {
        setError('Conversion failed. Check your input format.');
      }
      return;
    }

    setLoading(true);
    try {
      const { output: result } = await runDeveloperTool(toolId, input);
      setOutput(result);
    } catch {
      setError('Conversion failed. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {inputLabel}
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            rows={10}
            data-testid="textarea-input"
            className="font-mono text-sm resize-none"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {outputLabel}
            </label>
            {output && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                data-testid="button-copy"
                className="h-6 gap-1 text-xs"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </div>
          <Textarea
            value={output}
            readOnly
            rows={10}
            data-testid="textarea-output"
            placeholder="Output will appear here..."
            className="font-mono text-sm resize-none bg-secondary/50"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive" data-testid="text-devtool-error">{error}</p>
      )}

      <Button
        onClick={handleConvert}
        disabled={!input.trim() || loading}
        className="gap-2"
        data-testid="button-devtool-convert"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
        {loading ? 'Converting...' : 'Convert'}
      </Button>
    </div>
  );
}

// Separate instant converter panel for things like unit/color converters
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

// Live preview panel for markdown
export function MarkdownPanel() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConvert = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const { output: result } = await runDeveloperTool('md-html', input);
      setOutput(result);
    } catch {
      setOutput('<p>Conversion failed.</p>');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Markdown</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="# Hello World&#10;&#10;Write your **markdown** here..."
            rows={12}
            data-testid="textarea-markdown-input"
            className="font-mono text-sm resize-none"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">HTML Output</label>
            {output && (
              <Button variant="ghost" size="sm" onClick={async () => {
                await navigator.clipboard.writeText(output);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }} className="h-6 gap-1 text-xs" data-testid="button-copy-html">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </div>
          <Textarea
            value={output}
            readOnly
            rows={12}
            data-testid="textarea-html-output"
            placeholder="HTML output will appear here..."
            className="font-mono text-xs resize-none bg-secondary/50"
          />
        </div>
      </div>
      <Button onClick={handleConvert} disabled={!input.trim() || loading} className="gap-2" data-testid="button-convert-markdown">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {loading ? 'Converting...' : 'Convert to HTML'}
      </Button>
    </div>
  );
}
