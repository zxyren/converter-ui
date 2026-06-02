import { ImageIcon } from '@/components/icons/previewIcons';
import { ConverterPage } from './ConverterPage';

export default function ImageConverter() {
  return (
    <ConverterPage
      title="Image Converter"
      description="Convert between image formats. Drop your file — the app detects the type and shows your options."
      icon={ImageIcon}
      category="image"
    />
  );
}
