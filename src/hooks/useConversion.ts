import { useState, useRef, useCallback } from 'react';
import { ConversionJob } from '../types/converter';
import { convertFile, getJobStatus } from '../services/api';

export function useConversion(category: string) {
  const [job, setJob] = useState<ConversionJob | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startConversion = useCallback(
    async (
      file: File,
      inputFormat: string,
      outputFormat: string,
      options?: Record<string, string>
    ) => {
      stopPolling();

      const newJob: ConversionJob = {
        id: '',
        file,
        inputFormat,
        outputFormat,
        status: 'uploading',
        progress: 0,
      };
      setJob(newJob);

      try {
        const { job_id } = await convertFile(category, file, outputFormat, options);

        setJob((prev) => prev ? { ...prev, id: job_id, status: 'processing', progress: 5 } : prev);

        pollRef.current = setInterval(async () => {
          try {
            const status = await getJobStatus(job_id);
            setJob((prev) => {
              if (!prev) return prev;
              if (status.status === 'done') {
                stopPolling();
                return { ...prev, status: 'done', progress: 100, resultUrl: status.result_url };
              }
              if (status.status === 'error') {
                stopPolling();
                return { ...prev, status: 'error', progress: 0, errorMessage: status.error };
              }
              return { ...prev, progress: status.progress ?? prev.progress };
            });
          } catch {
            stopPolling();
            setJob((prev) => prev ? { ...prev, status: 'error', errorMessage: 'Failed to check conversion status' } : prev);
          }
        }, 2000);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setJob((prev) => prev ? { ...prev, status: 'error', errorMessage: message } : prev);
      }
    },
    [category, stopPolling]
  );

  const resetJob = useCallback(() => {
    stopPolling();
    setJob(null);
  }, [stopPolling]);

  return { job, startConversion, resetJob };
}
