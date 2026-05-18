import { Music } from "lucide-react";
import { ConverterPage } from "./ConverterPage";

export default function AudioConverter() {
  return (
    <ConverterPage
      title="Audio Converter"
      description="Convert between audio formats. Drop your audio file to see available output options."
      icon={Music}
      iconColor="bg-lime-500/15 text-lime-600 dark:text-lime-500"
      category="audio"
    />
  );
}
