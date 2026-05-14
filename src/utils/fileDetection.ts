export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function validateFileSize(file: File, maxMB = 500): string | null {
  if (file.size > maxMB * 1024 * 1024) {
    return `File is too large. Maximum size is ${maxMB} MB.`;
  }
  return null;
}
