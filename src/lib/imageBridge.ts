import type { OpenImageResult } from '../types/electron';

const PNG_DATA_URL = /^data:image\/png;base64,/;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Opens an image from disk via Electron (dialog + fs in main), or file input in the browser. */
export async function openImageFromDisk(): Promise<OpenImageResult | null> {
  if (window.electronAPI?.openImageFile) {
    return window.electronAPI.openImageFile();
  }

  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/gif,image/webp';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      try {
        const dataUrl = await readFileAsDataUrl(file);
        resolve({ filePath: file.name, dataUrl });
      } catch {
        resolve(null);
      }
    };
    input.oncancel = () => resolve(null);
    input.click();
  });
}

/** Saves a PNG data URL via Electron save dialog + fs, or browser download. */
export async function savePngDataUrl(dataUrl: string): Promise<{ ok: boolean; filePath?: string }> {
  if (!PNG_DATA_URL.test(dataUrl)) {
    return { ok: false };
  }

  if (window.electronAPI?.saveImageFile) {
    const result = await window.electronAPI.saveImageFile(dataUrl);
    if (result.ok && result.filePath) {
      return { ok: true, filePath: result.filePath };
    }
    if (result.canceled) {
      return { ok: false };
    }
    return { ok: false };
  }

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'pokedex-edit.png';
  link.click();
  return { ok: true, filePath: 'pokedex-edit.png' };
}
