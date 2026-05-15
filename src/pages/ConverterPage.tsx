import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ConversionPanel } from "../components/converter/ConversionPanel";
import { CATEGORY_FORMAT_MAP } from "../utils/formatOptions";

interface ConverterPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  category: string;
  extraFields?: React.ReactNode;
  extraOptions?: Record<string, string>;
}

export function ConverterPage({
  title,
  description,
  icon: Icon,
  iconColor,
  category,
  extraFields,
  extraOptions,
}: ConverterPageProps) {
  const formatMap = CATEGORY_FORMAT_MAP[category] ?? {};
  const supportedInputs = Object.keys(formatMap);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-md ${iconColor}`}
          >
            <Icon size={23} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <ConversionPanel
          category={category}
          extraFields={extraFields}
          extraOptions={extraOptions}
        />
      </motion.div>

      {/* Supported formats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="mt-6 rounded-xl border border-border bg-card/50 p-4"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Supported input formats
        </p>
        <div className="flex flex-wrap gap-2">
          {supportedInputs.map((ext) => (
            <span
              key={ext}
              className="rounded-sm border border-primary/50 bg-secondary/10 px-2.5 py-1 text-xs font-medium text-foreground uppercase"
            >
              {ext}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
