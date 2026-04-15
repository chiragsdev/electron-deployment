const { app, BrowserWindow, dialog } = require("electron");
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
});

// Events
autoUpdater.on("checking-for-update", () => {
  console.log("Checking for update...");
});

autoUpdater.on("update-available", () => {
  dialog.showMessageBox({
    type: "info",
    message: "Update available. Downloading...",
  });
});

autoUpdater.on("update-not-available", () => {
  console.log("No updates");
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

autoUpdater.on("error", (err) => {
  console.log("Update error:", err);
});
