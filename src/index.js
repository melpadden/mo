const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });

  if (result.canceled) return null;

  const folderPath = result.filePaths[0];
  const files = fs.readdirSync(folderPath).map((file) => ({
    name: file,
    path: path.join(folderPath, file),
    isDirectory: fs.statSync(path.join(folderPath, file)).isDirectory(),
  }));

  return { folderPath, files };
});