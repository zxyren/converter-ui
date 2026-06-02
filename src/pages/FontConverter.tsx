import { ConverterPage } from "./ConverterPage";
import { FontIcon } from "@/components/icons/previewIcons";

export default function FontConverter() {
  return (
    <ConverterPage
      title="Font Converter"
      description="Convert between font formats. Drop your font file to start."
      icon={FontIcon}
      category="font"
    />
  );
}
