const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  console.log("App Loaded");
});

contextBridge.exposeInMainWorld("api", {
  getVersion: () => ipcRenderer.invoke("get-app-version"),
});
