const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  // Auto update check
  autoUpdater.checkForUpdatesAndNotify();

  setInterval(
    () => {
      autoUpdater.checkForUpdates();
    },
    5 * 60 * 1000,
  );
});

// Manual trigger from UI
ipcMain.on("check-update", () => {
  autoUpdater.checkForUpdates();
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox({
      type: "info",
      message: "Update downloaded. Restarting...",
    })
    .then(() => {
      autoUpdater.quitAndInstall();
    });
});

autoUpdater.on("checking-for-update", () => {
  mainWindow.webContents.send("update-status", "Checking for updates...");
});

autoUpdater.on("update-available", () => {
  mainWindow.webContents.send(
    "update-status",
    "Update available. Downloading...",
  );
});

autoUpdater.on("update-not-available", () => {
  mainWindow.webContents.send("update-status", "Application is up to date.");
});

autoUpdater.on("download-progress", (progress) => {
  mainWindow.webContents.send(
    "update-status",
    `Downloading update: ${Math.round(progress.percent)}%`,
  );
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox(mainWindow, {
      type: "info",
      title: "Update ready",
      message: "A new version has been downloaded.",
      detail: "Restart the application to apply the update.",
      buttons: ["Restart now", "Later"],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
});

autoUpdater.on("error", (err) => {
  console.log(err);
  mainWindow.webContents.send(
    "update-status",
    "Error while checking for updates.",
  );
});

ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});
