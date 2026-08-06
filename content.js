/*
 * content.js — isolated world (CSS only)
 * All JS interception is handled by injected.js in the MAIN world.
 */
(function () {
  function injectStyle() {
    if (document.getElementById("__ro-style")) return;
    var s = document.createElement("style");
    s.id = "__ro-style";
    s.textContent = "*, *::before, *::after { -webkit-user-select: text !important; user-select: text !important; pointer-events: auto !important; }";
    (document.head || document.documentElement).appendChild(s);
  }

  if (document.head) {
    injectStyle();
  } else {
    new MutationObserver(function (_, obs) {
      if (document.head) { injectStyle(); obs.disconnect(); }
    }).observe(document.documentElement, { childList: true });
  }

  document.addEventListener("DOMContentLoaded", injectStyle);
  window.addEventListener("load", injectStyle);
}());
