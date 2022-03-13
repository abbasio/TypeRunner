const { app, BrowserWindow } = require('electron');

//---------ELECTRON
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 720,
  });
  win.maximize();
  win.loadFile('./public/index.html');
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
