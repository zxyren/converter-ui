import { FileText } from 'lucide-react';
import { ConverterPage } from './ConverterPage';

export default function DocumentConverter() {
  return (
    <ConverterPage
      title="Document Converter"
      description="Convert Word documents to PDF, or PDF files back to editable Word (.docx). Drop your file — the app detects the type and shows your options."
      icon={FileText}
      iconColor="bg-amber-500/15 text-amber-600 dark:text-amber-400"
      category="document"
    />
  );
}
