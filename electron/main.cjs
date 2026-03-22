const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

/** @type {BrowserWindow | null} */
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function imageDataUrlFromBuffer(buf, ext) {
  const mime =
    ext === 'png'
      ? 'image/png'
      : ext === 'jpg' || ext === 'jpeg'
        ? 'image/jpeg'
        : ext === 'gif'
          ? 'image/gif'
          : ext === 'webp'
            ? 'image/webp'
            : 'image/png';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

ipcMain.handle('dialog:openImage', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Import image',
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] },
      { name: 'All files', extensions: ['*'] },
    ],
  });

  if (canceled || !filePaths?.length) {
    return null;
  }

  const filePath = filePaths[0];
  const buf = fs.readFileSync(filePath);
  const lower = filePath.toLowerCase();
  const ext = lower.endsWith('.png')
    ? 'png'
    : lower.endsWith('.jpg') || lower.endsWith('.jpeg')
      ? 'jpg'
      : lower.endsWith('.gif')
        ? 'gif'
        : lower.endsWith('.webp')
          ? 'webp'
          : 'png';

  return {
    filePath,
    dataUrl: imageDataUrlFromBuffer(buf, ext),
  };
});

ipcMain.handle('dialog:saveImage', async (_event, dataUrl) => {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    return { ok: false, error: 'Invalid image data' };
  }

  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Save image',
    defaultPath: 'pokedex-edit.png',
    filters: [{ name: 'PNG image', extensions: ['png'] }],
  });

  if (canceled || !filePath) {
    return { ok: false, canceled: true };
  }

  const m = /^data:image\/png;base64,(.+)$/.exec(dataUrl);
  if (!m) {
    return { ok: false, error: 'Expected PNG data URL' };
  }

  fs.writeFileSync(filePath, Buffer.from(m[1], 'base64'));
  return { ok: true, filePath };
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
