import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface FormatSelectorProps {
  formats: string[];
  selected: string | null;
  onSelect: (fmt: string) => void;
}

export function FormatSelector({
  formats,
  selected,
  onSelect,
}: FormatSelectorProps) {
  if (!formats.length) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Output format
      </p>
      <div className="flex flex-wrap gap-2">
        {formats.map((fmt) => {
          const isSelected = selected === fmt;
          return (
            <motion.button
              key={fmt}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(fmt)}
              data-testid={`button-format-${fmt}`}
              className={`relative cursor-pointer flex items-center gap-1.5 rounded-md border px-3.5 py-2 text-sm font-semibold uppercase tracking-wide transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary-foreground shadow-sm"
                  : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary"
              }`}
            >
              {isSelected && <Check size={16} />}
              {fmt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
