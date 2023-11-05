// import { app, BrowserWindow } from 'electron'
//
// /**
//  * Set `__static` path to static files in production
//  * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
//  */
// if (process.env.NODE_ENV !== 'development') {
//   global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
// }
//
// let mainWindow
// const winURL = process.env.NODE_ENV === 'development'
//   ? `http://localhost:9080`
//   : `file://${__dirname}/index.html`
//
// function createWindow () {
//   /**
//    * Initial window options
//    */
//   mainWindow = new BrowserWindow({
//     height: 563,
//     useContentSize: true,
//     width: 1000
//   })
//
//   mainWindow.loadURL(winURL)
//
//   mainWindow.on('closed', () => {
//     mainWindow = null
//   })
// }
//
// app.on('ready', createWindow)
//
// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })
//
// app.on('activate', () => {
//   if (mainWindow === null) {
//     createWindow()
//   }
// })
//
// /**
//  * Auto Updater
//  *
//  * Uncomment the following code below and install `electron-updater` to
//  * support auto updating. Code Signing with a valid certificate is required.
//  * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
//  */
//
// /*
// import { autoUpdater } from 'electron-updater'
//
// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })
//
// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })
//  */

import {
  app, 			// app 模块是为了控制整个应用的生命周期设计的。
  BrowserWindow,  // BrowserWindow 类让你有创建一个浏览器窗口的权力。
  ipcMain
} from 'electron';

// 引入自动更新模块
const { autoUpdater } = require('electron-updater');
// 不支持 ES6 则用如下方式引入
// const autoUpdater = require("electron-updater").autoUpdater

const feedUrl = `http://127.0.0.1/update/`; // 更新包位置


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow, webContents;
const winURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080` :
    `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences:{
      nodeIntegration:true
    }
  });

  mainWindow.loadURL(winURL);

  webContents = mainWindow.webContents;

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 主进程监听渲染进程传来的信息
ipcMain.on('update', (e, arg) => {
  console.log("update");
  checkForUpdates();
});

let checkForUpdates = () => {
  // 配置安装包远端服务器
  autoUpdater.setFeedURL(feedUrl);

  autoUpdater.autoInstallOnAppQuit = false;

  // 下面是自动更新的整个生命周期所发生的事件
  autoUpdater.on('error', function(message) {
    sendUpdateMessage('error', message);
  });
  autoUpdater.on('checking-for-update', function(message) {
    sendUpdateMessage('checking-for-update', message);
  });
  autoUpdater.on('update-available', function(message) {
    sendUpdateMessage('update-available', message);
  });
  autoUpdater.on('update-not-available', function(message) {
    sendUpdateMessage('update-not-available', message);
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function(progressObj) {
    sendUpdateMessage('downloadProgress', progressObj);
  });
  // 更新下载完成事件
  autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    sendUpdateMessage('isUpdateNow');
    ipcMain.on('updateNow', (e, arg) => {
      autoUpdater.quitAndInstall();
    });
  });

  //执行自动更新检查
  autoUpdater.checkForUpdates();
};

// 主进程主动发送消息给渲染进程函数
function sendUpdateMessage(message, data) {
  console.log({ message, data });
  webContents.send('message', { message, data });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

