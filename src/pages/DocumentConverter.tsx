import { ConverterPage } from './ConverterPage';
import { DocsIcon } from '@/components/icons/previewIcons';

export default function DocumentConverter() {
  return (
    <ConverterPage
      title="Document Converter"
      description="Convert Word documents to PDF, or PDF files back to editable Word (.docx). Drop your file — the app detects the type and shows your options."
      icon={DocsIcon}
      category="document"
    />
  );
}
