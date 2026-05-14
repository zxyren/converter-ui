import { FileImage } from 'lucide-react';
import { ConverterPage } from './ConverterPage';

export default function ImageConverter() {
  return (
    <ConverterPage
      title="Image Converter"
      description="Convert between image formats. Drop your file — the app detects the type and shows your options."
      icon={FileImage}
      iconColor="bg-cyan-500/15 text-cyan-600 dark:text-cyan-400"
      category="image"
    />
  );
}
