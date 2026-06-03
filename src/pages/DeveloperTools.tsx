import { useState } from "react";
import { motion } from "framer-motion";
import {
  DevToolPanel,
  InstantDevToolPanel,
  MarkdownPanel,
} from "../components/developer/DevToolPanel";
import { DevIcon } from "@/components/icons/previewIcons";
import { IconColorFilter, IconFileText, IconFileTypeCsv, IconFileTypeHtml, IconFileTypeXml, IconHash, IconJson } from "@tabler/icons-react";

const TOOLS = [
  { id: "json-xml", label: "JSON to XML", icon: IconFileTypeXml, panel: "api" },
  { id: "xml-json", label: "XML to JSON", icon: IconJson, panel: "api" },
  { id: "yaml-json", label: "YAML to JSON", icon: IconJson, panel: "api" },
  { id: "json-yaml", label: "JSON to YAML", icon: IconFileText, panel: "api" },
  { id: "json-csv", label: "JSON to CSV", icon: IconFileTypeCsv, panel: "api" },
  { id: "csv-json", label: "CSV to JSON", icon: IconJson, panel: "api" },
  { id: "xml-yaml", label: "XML to YAML", icon: IconFileText, panel: "api" },
  { id: "yaml-xml", label: "YAML to XML", icon: IconFileTypeXml, panel: "api" },
  { id: "env-json", label: "ENV to JSON", icon: IconJson, panel: "api" },
  { id: "json-env", label: "JSON to ENV", icon: IconFileText, panel: "api" },
  { id: "base64-encode", label: "Text to Base64", icon: IconHash, panel: "client" },
  { id: "base64-decode", label: "Base64 to Text", icon: IconHash, panel: "client" },
  {
    id: "md-html",
    label: "Markdown to HTML",
    icon: IconFileTypeHtml,
    panel: "markdown",
  },
  {
    id: "color-converter",
    label: "Color Converter",
    icon: IconColorFilter,
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
    inputPlaceholder: "<root>\n  <key>Value</key>\n</root>\n",
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
  "json-csv": {
    inputLabel: "JSON",
    outputLabel: "CSV",
    inputPlaceholder:
      '[\n  {\n    "name": "Alice",\n    "age": 30\n  },\n  {\n    "name": "Bob",\n    "age": 28\n  }\n]',
  },
  "csv-json": {
    inputLabel: "CSV",
    outputLabel: "JSON",
    inputPlaceholder: "name,age\nAlice,30\nBob,28",
  },
  "xml-yaml": {
    inputLabel: "XML",
    outputLabel: "YAML",
    inputPlaceholder: "<root>\n  <name>Alice</name>\n  <age>30</age>\n</root>",
  },
  "yaml-xml": {
    inputLabel: "YAML",
    outputLabel: "XML",
    inputPlaceholder: "name: Alice\nage: 30\n",
  },
  "env-json": {
    inputLabel: "ENV",
    outputLabel: "JSON",
    inputPlaceholder: "FOO=bar\nBAR=42\nDEBUG=true",
  },
  "json-env": {
    inputLabel: "JSON",
    outputLabel: "ENV",
    inputPlaceholder: '{\n  "FOO": "bar",\n  "BAR": 42,\n  "DEBUG": true\n}',
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
          <DevIcon />
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
          <p className="mb-2 px-1 font-black uppercase tracking-wider text-muted-foreground">
            Tools
          </p>
          <nav className="flex flex-col gap-2">
            {TOOLS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTool(id)}
                data-testid={`button-tool-${id}`}
                className={`flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 font-medium text-left transition-colors ${activeTool === id
                  ? "bg-primary/30 text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                <Icon size={20} />
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
            <active.icon size={23} className="text-primary" />
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
