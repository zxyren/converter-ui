import { IconBrandYoutube, IconFileDescription, IconFileTypography, IconMusic, IconPackage, IconPhoto } from "@tabler/icons-react";
import { motion } from "framer-motion";

interface FormatSelectorProps {
  formats: string[];
  selected: string | null;
  onSelect: (fmt: string) => void;
}

// Format descriptions
const FORMAT_DESCRIPTIONS: Record<string, string> = {
  // Image formats
  jpg: "Best for photos and sharing",
  jpeg: "Best for photos and sharing",
  png: "High quality with transparency",
  webp: "Smaller size, great quality",
  gif: "Short animations and graphics",
  bmp: "Uncompressed bitmap image",
  avif: "Modern format, excellent compression",
  tiff: "High quality, print-ready",
  tif: "High quality, print-ready",
  ico: "Icon format for web",
  heic: "Apple's modern format",

  // Video formats
  mp4: "Most compatible video format",
  mov: "QuickTime video format",
  mkv: "High quality, multiple tracks",
  webm: "Web-optimized format",
  avi: "Legacy video format",
  m4v: "iTunes compatible video",

  // Audio formats
  mp3: "Universal audio format",
  wav: "Uncompressed audio quality",
  aac: "Apple's audio format",
  flac: "Lossless audio quality",
  ogg: "Open-source audio format",
  opus: "Modern audio compression",
  m4a: "iTunes compatible audio",

  // Font formats
  ttf: "TrueType font format",
  otf: "OpenType font format",
  woff: "Web font format",
  woff2: "Optimized web font",

  // Document formats
  pdf: "Universal document format",
  docx: "Microsoft Word document",
  doc: "Legacy Word document",
};

function getFormatIcon(format: string) {
  const cat = format.toLowerCase();
  if (["jpg", "jpeg", "png", "webp", "gif", "bmp", "avif", "tiff", "tif", "ico", "heic"].includes(cat)) {
    return IconPhoto;
  }
  if (["mp4", "mov", "mkv", "webm", "avi", "m4v"].includes(cat)) {
    return IconBrandYoutube;
  }
  if (["mp3", "wav", "aac", "flac", "ogg", "opus", "m4a"].includes(cat)) {
    return IconMusic;
  }
  if (["ttf", "otf", "woff", "woff2"].includes(cat)) {
    return IconFileTypography;
  }
  if (["pdf", "docx", "doc"].includes(cat)) {
    return IconFileDescription;
  }
  return IconPackage;
}

export function FormatSelector({
  formats,
  selected,
  onSelect,
}: FormatSelectorProps) {
  if (!formats.length) return null;

  return (
    <div className="space-y-4">
      <p className="font-medium text-muted-foreground">
        Select output format
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {formats.map((fmt) => {
          const isSelected = selected === fmt;
          const description = FORMAT_DESCRIPTIONS[fmt.toLowerCase()] || `Convert to ${fmt.toUpperCase()}`;
          const IconComponent = getFormatIcon(fmt);

          return (
            <motion.button
              key={fmt}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(fmt)}
              data-testid={`button-format-${fmt}`}
              className={`relative flex flex-col cursor-pointer items-center justify-start gap-2 rounded-xl border px-3 py-4 text-center transition-all ${isSelected
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border bg-card hover:border-primary/50 hover:bg-secondary/50"
                }`}
            >
              <IconComponent size={28} strokeWidth={1.5} className="text-primary/70" />

              <p className="text-md font-bold uppercase tracking-wide text-foreground">
                {fmt.toUpperCase()}
              </p>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
