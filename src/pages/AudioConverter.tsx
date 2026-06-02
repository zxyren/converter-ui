import { ConverterPage } from "./ConverterPage";
import { AudioIcon } from "@/components/icons/previewIcons";

export default function AudioConverter() {
  return (
    <ConverterPage
      title="Audio Converter"
      description="Convert between audio formats. Drop your audio file to see available output options."
      icon={AudioIcon}
      category="audio"
    />
  );
}
