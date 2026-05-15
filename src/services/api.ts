import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api";
const CATEGORY_ROUTE_MAP: Record<string, string> = {
  image: "images",
  video: "videos",
  audio: "audio",
  font: "fonts",
};

const api = axios.create({ baseURL: API_BASE });

export async function convertFile(
  category: string,
  file: File,
  outputFormat: string,
  options?: Record<string, string>,
): Promise<{ job_id: string; result_url?: string; result_size_bytes?: number }> {
  const route = CATEGORY_ROUTE_MAP[category];
  if (!route) {
    throw new Error(`Unsupported conversion category: ${category}`);
  }

  const formData = new FormData();
  formData.append("file", file);

  const params: Record<string, string> = { to_format: outputFormat };
  if (options) {
    Object.entries(options).forEach(([k, v]) => {
      params[k] = v;
    });
  }

  const res = await api.post(`/${route}/convert`, formData, {
    params,
    headers: { "Content-Type": "multipart/form-data" },
    responseType: "blob",
  });

  const resultUrl = URL.createObjectURL(res.data);
  return {
    job_id: `direct-${Date.now()}`,
    result_url: resultUrl,
    result_size_bytes: res.data.size,
  };
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
  options?: Record<string, string>,
): Promise<{ output: string }> {
  const res = await api.post(`/devtools/${toolId}`, {
    text: input,
    ...options,
  });
  return { output: res.data.output ?? res.data.result };
}
