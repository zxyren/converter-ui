import { ConversionOption } from "../types/converter";

// Map of input extension → supported output extensions per category
export const CATEGORY_FORMAT_MAP: Record<string, Record<string, string[]>> = {
  image: {
    jpg: ["png", "webp", "bmp", "gif"],
    jpeg: ["png", "webp", "bmp", "gif"],
    png: ["jpg", "webp", "gif", "bmp", "ico"],
    webp: ["jpg", "png", "gif"],
    heic: ["jpg", "png", "webp"],
    svg: ["png", "jpg", "webp", "avif", "tiff", "ico"],
    bmp: ["jpg", "png", "webp"],
    gif: ["png", "webp"],

    avif: ["jpg", "png", "webp"],
    tiff: ["jpg", "png", "webp"],
    tif: ["jpg", "png", "webp"],
    ico: ["png", "jpg"],
  },
  video: {
    mp4: ["avi", "mkv", "webm", "mov", "mp3", "gif"],
    mov: ["mp4", "avi", "mkv", "mp3", "gif"],
    mkv: ["mp4", "avi", "webm", "mp3", "gif"],
    webm: ["mp4", "avi", "mkv", "mp3", "gif"],
    avi: ["mp4", "mkv", "webm", "mp3"],

    m4v: ["mp4", "mov", "webm", "mp3"],
  },
  audio: {
    mp3: ["wav", "aac", "ogg", "flac"],
    wav: ["mp3", "aac", "ogg", "flac"],
    aac: ["mp3", "wav", "ogg"],
    flac: ["mp3", "wav", "aac"],
    ogg: ["mp3", "wav", "aac"],
    m4a: ["mp3", "wav", "aac"],

    opus: ["mp3", "wav", "ogg"],
  },
  font: {
    ttf: ["otf", "woff", "woff2"],
    otf: ["ttf", "woff", "woff2"],
    woff: ["ttf", "otf", "woff2"],
    woff2: ["ttf", "otf", "woff"],
  },
};

// MIME type → extension lookup for detection fallback
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/bmp": "bmp",
  "image/svg+xml": "svg",
  "image/heic": "heic",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/x-matroska": "mkv",
  "video/webm": "webm",
  "video/x-msvideo": "avi",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/aac": "aac",
  "audio/x-aac": "aac",
  "audio/flac": "flac",
  "audio/x-flac": "flac",
  "audio/ogg": "ogg",
  "audio/mp4": "m4a",
  "font/ttf": "ttf",
  "font/otf": "otf",
  "font/woff": "woff",
  "font/woff2": "woff2",
};

export function getFileExtension(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (ext) return ext;
  return MIME_TO_EXT[file.type] ?? "";
}

export function getAvailableOutputsForCategory(
  ext: string,
  category: string,
): string[] {
  return CATEGORY_FORMAT_MAP[category]?.[ext] ?? [];
}

export function getAvailableOutputsForFile(
  file: File,
  category: string,
): string[] {
  const ext = getFileExtension(file);
  // Try exact extension match first
  const direct = getAvailableOutputsForCategory(ext, category);
  if (direct.length > 0) return direct;
  // Fallback to MIME-based extension
  const mimeExt = MIME_TO_EXT[file.type];
  if (mimeExt && mimeExt !== ext) {
    return getAvailableOutputsForCategory(mimeExt, category);
  }
  return [];
}

// Legacy: still used by ConverterPage for the "supported conversions" badge list
export function FORMAT_OPTIONS_LIST(category: string): ConversionOption[] {
  const map = CATEGORY_FORMAT_MAP[category] ?? {};
  return Object.entries(map).map(([input, outputs]) => ({
    id: `${input}-${outputs[0]}`,
    label: `${input.toUpperCase()} → ${outputs.map((o) => o.toUpperCase()).join(", ")}`,
    inputFormats: [input],
    outputFormats: outputs,
    acceptedMimeTypes: [],
  }));
}

// Keep old FORMAT_OPTIONS for backward compat (used in ConverterPage supported list)
export const FORMAT_OPTIONS: Record<string, ConversionOption[]> =
  Object.fromEntries(
    Object.entries(CATEGORY_FORMAT_MAP).map(([cat, map]) => [
      cat,
      Object.entries(map).map(([input, outputs]) => ({
        id: `${input}-multi`,
        label: `${input.toUpperCase()} to ${outputs.map((o) => o.toUpperCase()).join(" / ")}`,
        inputFormats: [input],
        outputFormats: outputs,
        acceptedMimeTypes: [],
      })),
    ]),
  );

export function getOptionsForCategory(category: string): ConversionOption[] {
  return FORMAT_OPTIONS[category] || [];
}
