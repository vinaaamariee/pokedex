export interface OpenImageResult {
  filePath: string;
  dataUrl: string;
}

export interface SaveImageResult {
  ok: boolean;
  canceled?: boolean;
  filePath?: string;
  error?: string;
}

export interface ElectronAPI {
  openImageFile: () => Promise<OpenImageResult | null>;
  saveImageFile: (dataUrl: string) => Promise<SaveImageResult>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
