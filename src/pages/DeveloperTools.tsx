import { useState } from "react";
import { motion } from "framer-motion";
import { Code, FileJson, FileText, Hash, Palette, Ruler } from "lucide-react";
import {
  DevToolPanel,
  InstantDevToolPanel,
  MarkdownPanel,
} from "../components/developer/DevToolPanel";

const TOOLS = [
  { id: "json-xml", label: "JSON to XML", icon: FileJson, panel: "api" },
  { id: "xml-json", label: "XML to JSON", icon: FileJson, panel: "api" },
  { id: "yaml-json", label: "YAML to JSON", icon: FileText, panel: "api" },
  { id: "json-yaml", label: "JSON to YAML", icon: FileText, panel: "api" },
  { id: "base64-encode", label: "Text to Base64", icon: Hash, panel: "client" },
  { id: "base64-decode", label: "Base64 to Text", icon: Hash, panel: "client" },
  {
    id: "md-html",
    label: "Markdown to HTML",
    icon: FileText,
    panel: "markdown",
  },
  {
    id: "color-converter",
    label: "Color Converter",
    icon: Palette,
    panel: "client",
  },
];

const TOOL_CONFIG: Record<
  string,
  { inputLabel: string; outputLabel: string; inputPlaceholder: string }
> = {
  "json-xml": {
    inputLabel: "JSON",
    outputLabel: "XML",
    inputPlaceholder: '{\n  "key": "value"\n}',
  },
  "xml-json": {
    inputLabel: "XML",
    outputLabel: "JSON",
    inputPlaceholder: "<root><key>value</key></root>",
  },
  "yaml-json": {
    inputLabel: "YAML",
    outputLabel: "JSON",
    inputPlaceholder: "key: value\nlist:\n  - item1\n  - item2",
  },
  "json-yaml": {
    inputLabel: "JSON",
    outputLabel: "YAML",
    inputPlaceholder: '{\n  "key": "value"\n}',
  },
  "base64-encode": {
    inputLabel: "Plain Text",
    outputLabel: "Base64",
    inputPlaceholder: "Enter text to encode...",
  },
  "base64-decode": {
    inputLabel: "Base64",
    outputLabel: "Plain Text",
    inputPlaceholder: "SGVsbG8gV29ybGQ=",
  },
  "md-html": {
    inputLabel: "Markdown",
    outputLabel: "HTML",
    inputPlaceholder: "# Hello\n\nWrite markdown here...",
  },
  "color-converter": {
    inputLabel: "HEX Color",
    outputLabel: "RGB / HSL",
    inputPlaceholder: "#1a73e8",
  },
};

export default function DeveloperTools() {
  const [activeTool, setActiveTool] = useState(TOOLS[0].id);
  const active = TOOLS.find((t) => t.id === activeTool)!;
  const config = TOOL_CONFIG[activeTool];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <Code size={23} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Developer Tools
          </h1>
        </div>
        <p className="text-muted-foreground">
          Text-based data format converters, encoders, and utilities — no file
          upload needed.
        </p>
      </motion.div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Tool selector sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="w-full shrink-0 md:w-52"
        >
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tools
          </p>
          <nav className="flex flex-col gap-1">
            {TOOLS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTool(id)}
                data-testid={`button-tool-${id}`}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-left transition-colors ${
                  activeTool === id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </motion.aside>

        {/* Tool panel */}
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-2">
            <active.icon className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-foreground">{active.label}</h2>
          </div>

          {active.panel === "markdown" ? (
            <MarkdownPanel />
          ) : active.panel === "client" ? (
            <InstantDevToolPanel
              toolId={activeTool}
              inputLabel={config.inputLabel}
              outputLabel={config.outputLabel}
              inputPlaceholder={config.inputPlaceholder}
            />
          ) : (
            <DevToolPanel
              toolId={activeTool}
              inputLabel={config.inputLabel}
              outputLabel={config.outputLabel}
              inputPlaceholder={config.inputPlaceholder}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
