/*
 * injected.js — PAGE MAIN WORLD (manifest: "world": "MAIN", "run_at": "document_start")
 *
 * Runs before any page script. Blocks NPTEL's copy/paste/contextmenu/keydown
 * protection handlers — but only at the document/window/body level where the
 * page registers them. Element-level handlers (e.g. ACE editor) are untouched.
 */
(function () {
  var _add = EventTarget.prototype.addEventListener;
  var _rem = EventTarget.prototype.removeEventListener;

  var BLOCKED = {
    copy:1, cut:1, paste:1, contextmenu:1,
    selectstart:1, dragstart:1, selectionchange:1,
    keydown:1, keyup:1, keypress:1
  };

  function isPageTarget(t) {
    return t === window || t === document ||
           t === document.body || t === document.documentElement;
  }

  // drop the page's event listeners; leave element-level alone (ACE editor)
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    if (isPageTarget(this) && BLOCKED[type]) return;
    return _add.call(this, type, fn, opts);
  };

  EventTarget.prototype.removeEventListener = function (type, fn, opts) {
    if (isPageTarget(this) && BLOCKED[type]) return;
    return _rem.call(this, type, fn, opts);
  };

  // clear inline on* handlers - overwrite addEventListener
  var INLINE = Object.keys(BLOCKED);
  function clearInline() {
    var targets = [window, document, document.documentElement, document.body];
    targets.forEach(function (t) {
      if (!t) return;
      INLINE.forEach(function (evt) {
        if (t["on" + evt]) t["on" + evt] = null;
      });
    });
  }

  clearInline();
  var fast = setInterval(clearInline, 300);
  setTimeout(function () { clearInterval(fast); setInterval(clearInline, 3000); }, 60000);

  console.log("[RO] active on", location.hostname);
}());
