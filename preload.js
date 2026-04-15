const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  console.log("App Loaded");
});

contextBridge.exposeInMainWorld("api", {
  checkUpdate: () => ipcRenderer.send("check-update"),
  onUpdateStatus: (callback) =>
    ipcRenderer.on("update-status", (event, data) => callback(data)),
  getVersion: () => ipcRenderer.invoke("get-app-version"),
});
