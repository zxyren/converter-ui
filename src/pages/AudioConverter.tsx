import { Music } from 'lucide-react';
import { ConverterPage } from './ConverterPage';

export default function AudioConverter() {
  return (
    <ConverterPage
      title="Audio Converter"
      description="Convert between audio formats. Drop your audio file to see available output options."
      icon={Music}
      iconColor="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      category="audio"
    />
  );
}
