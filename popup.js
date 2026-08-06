const statusEl = document.getElementById("status");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  if (!tab || !tab.url) {
    statusEl.textContent = "No active tab";
    statusEl.style.background = "#f5f5f5";
    statusEl.style.color = "#666";
    return;
  }
  statusEl.textContent = "Loaded — check console for confirmation log";
});
