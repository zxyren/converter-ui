import { Type } from "lucide-react";
import { ConverterPage } from "./ConverterPage";

export default function FontConverter() {
  return (
    <ConverterPage
      title="Font Converter"
      description="Convert between font formats. Drop your font file to start."
      icon={Type}
      iconColor="bg-teal-500/15 text-teal-600 dark:text-teal-500"
      category="font"
    />
  );
}
