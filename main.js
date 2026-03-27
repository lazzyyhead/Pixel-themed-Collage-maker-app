const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 527,
        height: 581,
        frame: false,
        transparent: true,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('index.html');

    // Open DevTools in development (optional)
    // mainWindow.webContents.openDevTools();
}

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

// Handle image selection
ipcMain.handle('dialog:selectImage', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'] }
        ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0];
    }
    return null;
});

// Handle collage saving
ipcMain.handle('dialog:saveCollage', async (event, dataUrl) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        title: 'Save Collage',
        defaultPath: path.join(app.getPath('desktop'), 'my-collage.png'),
        filters: [
            { name: 'PNG Image', extensions: ['png'] }
        ]
    });

    if (!result.canceled && result.filePath) {
        try {
            // Remove the data URL prefix
            const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            
            fs.writeFileSync(result.filePath, buffer);
            return true;
        } catch (error) {
            console.error('Error saving file:', error);
            return false;
        }
    }
    return false;
});

// Window controls
ipcMain.on('window:minimize', () => {
    mainWindow.minimize();
});

ipcMain.on('window:close', () => {
    mainWindow.close();
});
