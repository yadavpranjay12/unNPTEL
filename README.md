# UnNPTEL — Browser Extension

> **Enables  copy/paste, right-click, and text-selection on NPTEL's course page.**

---

##  File Structure

```
extension/
├── manifest.json   
├── injected.js     
├── content.js      
├── popup.html      
├── popup.js        
└── logo.png        
```

##  Installing in a Chromium Browser (Chrome, Edge, Brave, Arc, etc.)

> These steps work for any Chromium-based browser that supports **Manifest V3** extensions.

### Step 1 — Download / Clone the extension folder

Make sure you have the `extension/` folder on your computer with all files intact:

```
extension/
├── manifest.json
├── injected.js
├── content.js
├── popup.html
├── popup.js
└── logo.png
```

### Step 2 — Open the Extensions page

| Browser | URL to open                    |
|---------|--------------------------------|
| Chrome  | `chrome://extensions`          |
| Edge    | `edge://extensions`            |
| Brave   | `brave://extensions`           |
| Arc     | `chrome://extensions` (Arc tab)|

### Step 3 — Enable Developer Mode

In the top-right corner of the Extensions page, toggle **"Developer mode"** ON.

### Step 4 — Load the unpacked extension

Click **"Load unpacked"** and select the `extension/` folder (the folder that contains `manifest.json`).

```
Load unpacked  →  Browse to  →  extension/  →  Select Folder
```

### Step 5 — Confirm it loaded

You should see **UnNPTEL** appear in your extensions list with version `1.5.0`.

Click the **puzzle-piece icon** (🧩) in the browser toolbar → pin **UnNPTEL** so its icon is always visible.

### Step 6 — Use it

1. Navigate to any page on **nptel.ac.in** (course pages, assignments, video lectures, etc.).
2. The extension activates automatically — no toggle needed.
3. You can now:
   - **Select and copy** any text on the page.
   - **Right-click** to get the browser's context menu.
   - **Use keyboard shortcuts** (Ctrl+C, Ctrl+A, etc.) normally.

---

##  How It Works

NPTEL's website registers JavaScript event listeners on `window`, `document`, `document.body`, and `document.documentElement` to block:

| Blocked Event     | Effect on the page              |
|-------------------|---------------------------------|
| `copy` / `cut`    | Prevents copying text           |
| `paste`           | Prevents pasting                |
| `contextmenu`     | Disables right-click menu       |
| `selectstart`     | Prevents text selection         |
| `dragstart`       | Prevents drag operations        |
| `selectionchange` | Hides selection state           |
| `keydown/up/press`| Blocks keyboard shortcuts       |

The extension defeats these restrictions using **two content scripts** that run at `document_start` (before any page JavaScript executes):

### 1. `injected.js` — Main World Script

Runs in the **page's own JavaScript context** (`"world": "MAIN"`). It:

- **Patches `EventTarget.prototype.addEventListener`** — Any call from the page to add a blocked event listener on `window`, `document`, `<body>`, or `<html>` is silently dropped.
- **Patches `EventTarget.prototype.removeEventListener`** — Ensures the page cannot remove a listener that was never added.
- **Clears inline `on*` handlers** — Polls every 300 ms (for the first 60 s, then every 3 s) to nullify any `oncopy`, `oncontextmenu`, etc. properties set directly on those targets.
- Element-level handlers (e.g. the ACE code editor) are **not** affected — only document/window-level restrictions are removed.

### 2. `content.js` — Isolated World Script

Runs in the **extension's isolated context**. It:

- Injects a `<style>` tag that forces `user-select: text` and `pointer-events: auto` on every element via CSS, overriding any CSS-based selection blocking.
- Watches for the `<head>` element via a `MutationObserver` so the style is applied as early as possible, even on dynamically loaded pages.

### 3. `popup.html` / `popup.js`

A minimal popup shown when you click the extension icon. It confirms the extension is loaded and active on the current tab.

---
