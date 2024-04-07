const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('node:path')
const fs = require("fs")
var cmd=require('node-cmd');
var cmd=require('node-fetch');


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth:800,
    minHeight:600,
    show:false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true,
    icon:"app/assets/neoAstatine.png",
    // resizable: false
  })
  win.loadFile('app/install.html')
  win.center();

  var splash = new BrowserWindow({
    width: 600, 
    height: 700, 
    transparent: true, 
    frame: false, 
    alwaysOnTop: true 
  });
  splash.loadFile('./app/index.html');
  splash.center();

  return {win:win,splash:splash}
}



app.whenReady().then(() => {
  var {win,splash} = createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      var win = createWindow()
    }
  })
  ipcMain.handle('dialog', async (event, method, params) => {       
    return dialog[method](params)
  });
  ipcMain.handle('fs', async (event, method, params) => {       
    return fs[method](params)
  });
  ipcMain.handle('rename', async (event, a,b) => {       
    return fs.rename(a,b,()=>{})
  });
  ipcMain.handle('path', async (event, method, params) => {       
    return path[method](params)
  });
  ipcMain.handle('cmd', async (event, command) => {       
    return cmd.runSync(command)
  });
  ipcMain.handle('copyFile', async (event, a, b)=>{
    return fs.copyFile(a,b,(err)=>{if(err)console.warn(err)})
  })
  ipcMain.handle('fetchText', async (event, link)=>{
    let temp = await fetch(link)
    return await temp.text()
  })
  ipcMain.handle('doneLoad', async ()=>{
    setTimeout(()=>{
      splash.close();
      win.show();
      return true
    },2000)

  })
  
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

