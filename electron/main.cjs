
const { app, BrowserWindow, shell } = require("electron");
const path = require("node:path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 980,
    minHeight: 680,
    backgroundColor: "#07080c",
    title: "Loop Visualizer",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  win.webContents.openDevTools({ mode: "detach" });

  win.webContents.on("did-fail-load", (event, code, description, url) => {
    console.error("LOAD ERROR:", code, description, url);
  });

  win.webContents.on("render-process-gone", (event, details) => {
    console.error("RENDERER CRASH:", details);
  });

  win.webContents.on("console-message", (event, level, message) => {
    console.log("APP:", message);
  });

  const pagePath = path.join(__dirname, "..", "dist", "index.html");

  win.loadFile(pagePath).catch(error => {
    console.error("FILE LOAD ERROR:", error);
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://") || url.startsWith("http://")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
