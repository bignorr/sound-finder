// Theme: light by default, dark when the person taps the toggle; remembered on this phone.
(function () {
  var KEY = "sf-theme";
  function get() { try { return localStorage.getItem(KEY) || "light"; } catch (e) { return "light"; } }
  function apply(t) {
    document.documentElement.setAttribute("data-theme", t);
    var m = document.querySelector('meta[name="theme-color"]:not([media])');
    if (m) m.setAttribute("content", t === "dark" ? "#1c1509" : "#fbf5e6");
  }
  apply(get());
  function install() {
    var slot = document.querySelector(".top .row");
    if (!slot || slot.querySelector(".theme")) return;
    var b = document.createElement("button");
    b.type = "button"; b.className = "btn theme"; b.setAttribute("aria-label", "Switch light or dark");
    b.innerHTML = '<svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
      '<svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
    b.addEventListener("click", function () {
      var t = get() === "dark" ? "light" : "dark";
      try { localStorage.setItem(KEY, t); } catch (e) {}
      apply(t);
    });
    slot.appendChild(b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install); else install();
})();
