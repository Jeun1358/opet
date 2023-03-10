const { app, BrowserWindow, ipcMain, Menu, Tray }=require('electron');
const process=require('process');
const path=require('path');
const createWindow = () => {
  const win=new BrowserWindow({
    width: 220,
    height: 220,
    frame: false,
    transparent: true,
    fullscreenable: false,
    webPreferences: false,
    useContentSize: true,
    resizable: false,
    icon: 'assets/app_icon.png',
    title: 'Opet',
    skipTaskbar: true,
    webPreferences:{
      preload: path.join(__dirname,'preload.js'),
      nodeIntegration: true,
      defaultFontFamily: {
        standard:"HarmonyOS Sans SC",
        serif:"Noto Serif CJK SC",
        sansSerif:"HarmonyOS Sans SC",
        monospace:"Monospace",
        cursive:"HarmonyOS Sans SC",
        fantasy:"HarmonyOS Sans SC",
      }
    }
  })
  if (process.platform=='linux'||process.platform=='darwin'){
    win.setVisibleOnAllWorkspaces(true);
  }
  ipcMain.on('max',()=>{
    if(win.isMaximized()){win.restore();}
    else{win.maximize();}
  });
  ipcMain.on('min',()=>{win.minimize();});
  ipcMain.on('resize',(stat)=>{win.setResizable(stat);})
  ipcMain.on('devtool',()=>{win.webContents.toggleDevTools({mode:"detach"});});
  ipcMain.on('zoomIn',()=>{
    var now=win.webContents.getZoomFactor();
    win.webContents.setZoomFactor(now+0.1);
  })
  ipcMain.on('zoomOut',()=>{
    var now=win.webContents.getZoomFactor();
    win.webContents.setZoomFactor(now-0.1);
  })
  ipcMain.on('zoomReset',()=>{
    win.webContents.setZoomFactor(1);
  })
  win.loadFile('assets/index.html');
  //globalShortcut.register('F5', () => {win.webContents.reload();})
  win.webContents.setWindowOpenHandler(({url})=>{
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        frame: false,
        fullscreenable: false,
        transparent: true,
        width: 500,
        height: 400,
        icon: 'assets/app_icon.png',
        webPreferences:{
          preload: path.join(__dirname,'preload.js')
        }
      },
    }
  })
  const traymenu=Menu.buildFromTemplate([
    {label:"????????????",type:"submenu",submenu:[
      {label:"????????????",click:function(){win.setIgnoreMouseEvents(true);}},
      {label:"????????????",click:function(){win.setIgnoreMouseEvents(false);}},
    ]},
    {label:"??????",type:"submenu",submenu:[
      {label:"????????????",click:function(){win.setAlwaysOnTop(true);}},
      {label:"?????????",click:function(){win.setAlwaysOnTop(false);}},
    ]},
    {type:"separator"},
    {label:"????????????",click:function(){app.focus();}},
    {label:"????????????",click:function(){win.webContents.executeJavaScript("info();")}},
    {label:"????????????",click:function(){win.webContents.executeJavaScript("help();")}},
    {label:"????????????",click:function(){win.webContents.reload();}},
    {type:"separator"},
    {label:"???????????????",click:function(){win.webContents.executeJavaScript("about();")}},
    {label:"????????????",click:function(){app.quit();}}
  ]);
  const trayico=path.join(__dirname,'assets');
  const apptray=new Tray(path.join(trayico,'app_icon.png'));
  apptray.setToolTip('OPet');
  apptray.setContextMenu(traymenu);
}

app.whenReady().then(() => {
  createWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin'){app.quit();}
})
