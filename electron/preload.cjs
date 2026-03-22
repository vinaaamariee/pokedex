const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openImageFile: () => ipcRenderer.invoke('dialog:openImage'),
  saveImageFile: (dataUrl) => ipcRenderer.invoke('dialog:saveImage', dataUrl),
});
