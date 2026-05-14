import { Type } from 'lucide-react';
import { ConverterPage } from './ConverterPage';

export default function FontConverter() {
  return (
    <ConverterPage
      title="Font Converter"
      description="Convert between font formats. Drop your font file to start."
      icon={Type}
      iconColor="bg-orange-500/15 text-orange-600 dark:text-orange-400"
      category="font"
    />
  );
}
