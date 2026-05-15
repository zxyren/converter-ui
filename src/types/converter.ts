export type ConverterCategory = 'image' | 'video' | 'audio' | 'font' | 'developer';

export interface ConversionOption {
  id: string;
  label: string;
  inputFormats: string[];
  outputFormats: string[];
  acceptedMimeTypes: string[];
  supportsClip?: boolean;
}

export interface ConversionJob {
  id: string;
  file: File;
  inputFormat: string;
  outputFormat: string;
  status: 'idle' | 'uploading' | 'processing' | 'done' | 'error';
  progress: number;
  resultUrl?: string;
  resultSizeBytes?: number;
  errorMessage?: string;
}

export interface DeveloperToolInput {
  toolId: string;
  input: string;
  output: string;
}
