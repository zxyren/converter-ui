import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: API_BASE });

export async function convertFile(
  category: string,
  file: File,
  outputFormat: string,
  options?: Record<string, string>
): Promise<{ job_id: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('output_format', outputFormat);
  if (options) {
    Object.entries(options).forEach(([k, v]) => formData.append(k, v));
  }
  const res = await api.post(`/convert/${category}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function getJobStatus(jobId: string): Promise<{
  status: string;
  progress: number;
  result_url?: string;
  error?: string;
}> {
  const res = await api.get(`/jobs/${jobId}`);
  return res.data;
}

export async function runDeveloperTool(
  toolId: string,
  input: string,
  options?: Record<string, string>
): Promise<{ output: string }> {
  const res = await api.post(`/developer/${toolId}`, { input, ...options });
  return res.data;
}
