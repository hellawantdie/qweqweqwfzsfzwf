# Loop Visualizer — Windows Portable build

## What this package is

This is the source project prepared for a Windows portable `.exe` build using Electron.
The resulting app does not require the user to install Node.js, npm, or the application itself.

**Important:** this ZIP contains the app source and Windows build configuration, not a precompiled `.exe`.
A Windows runner must produce the actual executable.

## Build the portable EXE on Windows

1. Install Node.js 20 LTS on the build computer.
2. Extract this project folder.
3. Open PowerShell in the extracted folder.
4. Run:

```powershell
npm install
npm run dist:win
```

5. The portable executable will appear in:

```text
release/LoopVisualizer-1.0.0-portable.exe
```

You can copy that `.exe` to another Windows 10/11 computer and run it without installing the app.

## Build without setting up a local Windows environment

The repository includes `.github/workflows/build-windows-portable.yml`.

1. Upload this project to a GitHub repository.
2. Open the repository's **Actions** tab.
3. Select **Build Windows portable EXE**.
4. Click **Run workflow**.
5. When the workflow finishes, download the artifact named `LoopVisualizer-Windows-Portable`.

## Development

```bash
npm install
npm run electron:dev
```

## Notes

- The Electron wrapper loads the Vite production build from local files.
- Renderer Node.js integration is disabled; context isolation and sandboxing are enabled.
- This packaging step does not change the visualizer's existing feature limitations: the current browser export is WebM, not MP4.
