const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    selectImage: () => ipcRenderer.invoke('dialog:selectImage'),
    saveCollage: (dataUrl) => ipcRenderer.invoke('dialog:saveCollage', dataUrl),
    minimizeWindow: () => ipcRenderer.send('window:minimize'),
    closeWindow: () => ipcRenderer.send('window:close')
});
