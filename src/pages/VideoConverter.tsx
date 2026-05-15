import { useState } from "react";
import { Film } from "lucide-react";
import { ConverterPage } from "./ConverterPage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function VideoConverter() {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const extraOptions =
    startTime || endTime
      ? {
          ...(startTime && { start_time: startTime }),
          ...(endTime && { end_time: endTime }),
        }
      : undefined;

  const extraFields = (
    <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Clip options (optional)
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs" htmlFor="start-time">
            Start time (seconds)
          </Label>
          <Input
            id="start-time"
            type="number"
            min="0"
            placeholder="0"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            data-testid="input-start-time"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs" htmlFor="end-time">
            End time (seconds)
          </Label>
          <Input
            id="end-time"
            type="number"
            min="0"
            placeholder="e.g. 60"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            data-testid="input-end-time"
            className="h-8 text-sm"
          />
        </div>
      </div>
    </div>
  );

  return (
    <ConverterPage
      title="Video Converter"
      description="Convert video files, extract audio, create GIFs, and more. Optionally clip a specific time range and keep the original format."
      icon={Film}
      iconColor="bg-violet-500/15 text-violet-600 dark:text-violet-400"
      category="video"
      extraFields={extraFields}
      extraOptions={extraOptions}
    />
  );
}
