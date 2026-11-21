// Sound Finder sales tools, shared by every page: your settings (contact, financing promos, install bands, demo clips),
// monthly-payment math, install ranges, the customer-facing view, norrito SKU links, and the floor cards (openers, objections).
// Everything is saved on this phone only (localStorage), nothing leaves the device.
(function () {
  const KEY = "sf-settings";
  const DEFAULTS = {
    phone: "", email: "",
    // Financing promos on the norrito card. Starting points only: edit them to match this week's offer.
    promos: [
      { months: 12, min: 299, on: true },
      { months: 18, min: 499, on: false },
      { months: 24, min: 799, on: true },
      { months: 36, min: 1999, on: false },
    ],
    // Install labor bands, equipment excluded. Starting points: replace with your store's norrito numbers.
    install: {
      bar: { low: 100, high: 250 },
      setup: { low: 150, high: 350 },
      wired: { low: 400, high: 900 },
      ceiling: { low: 700, high: 1400 },
      arch: { low: 1500, high: 3500 },
    },
    // Your go-to demo clips, one per job. Blank means the script describes the kind of scene to use.
    clips: { height: "", bass: "", dialog: "", imaging: "", music: "" },
    customer: false,
    skus: {},
  };
  const INSTALL_LABELS = {
    bar: "Soundbar and sub: mount the bar, pair the sub, set up eARC",
    setup: "Receiver and fronts, no wall work: place, wire, calibrate",
    wired: "Wired surrounds or rears in the room: concealed runs, brackets, calibration",
    ceiling: "In-ceiling heights: cuts, ceiling or attic runs, calibration",
    arch: "Full in-wall and in-ceiling theater: every channel cut in and run",
  };

  let cache = null;
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function get() {
    if (cache) return cache;
    let s = clone(DEFAULTS);
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved && typeof saved === "object") {
        if (typeof saved.phone === "string") s.phone = saved.phone;
        if (typeof saved.email === "string") s.email = saved.email;
        if (Array.isArray(saved.promos) && saved.promos.length) s.promos = saved.promos.slice(0, 4).map(function (p) { return { months: +p.months || 12, min: +p.min || 0, on: !!p.on }; });
        if (saved.install && typeof saved.install === "object") Object.keys(s.install).forEach(function (k) { if (saved.install[k]) s.install[k] = { low: +saved.install[k].low || 0, high: +saved.install[k].high || 0 }; });
        if (saved.clips && typeof saved.clips === "object") Object.keys(s.clips).forEach(function (k) { if (typeof saved.clips[k] === "string") s.clips[k] = saved.clips[k]; });
        s.customer = !!saved.customer;
        if (saved.skus && typeof saved.skus === "object") s.skus = saved.skus;
      }
    } catch (e) {}
    cache = s;
    return s;
  }
  function set(patch) {
    const s = Object.assign(get(), patch || {});
    cache = s;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    document.dispatchEvent(new CustomEvent("sf-settings", { detail: s }));
    return s;
  }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }

  // ---------- financing ----------
  // The longest promo the total qualifies for gives the lowest payment.
  function plan(total) {
    const ok = get().promos.filter(function (p) { return p.on && p.months > 0 && total >= p.min; });
    if (!ok.length) return null;
    const best = ok.sort(function (a, b) { return b.months - a.months; })[0];
    return { months: best.months, min: best.min, per: Math.ceil(total / best.months) };
  }
  function monthlyText(total) {
    const p = plan(total);
    return p ? "about " + money(p.per) + "/mo for " + p.months + " months" : "";
  }
  function monthlyHtml(total, cls) {
    const p = plan(total);
    if (!p) return "";
    return "<div class='fin " + (cls || "") + "'><b>" + money(p.per) + "<small>/mo</small></b><span>" + p.months + " months on the norrito card<br><em>equal payments on " + money(total) + " · confirm this week's terms" + (total > 20000 ? " · a purchase this size depends on the customer's credit line" : "") + "</em></span></div>";
  }

  // ---------- install ----------
  function installKind(o) {
    o = o || {};
    if (o.path === "bar") return "bar";
    if (o.arch) return "arch";
    const inWall = o.surroundType === "inwall" || o.surroundType === "inceiling";
    const ceilHeights = o.heights > 0 && o.heightType === "inceiling";
    if (inWall && ceilHeights) return "arch";
    if (inWall || ceilHeights) return "ceiling";
    if (o.around >= 5) return "wired";
    return "setup";
  }
  function installBand(kind) { const b = get().install[kind] || get().install.setup; return { kind: kind, low: b.low, high: b.high, label: INSTALL_LABELS[kind] }; }
  function installText(kind) { const b = installBand(kind); return money(b.low) + " to " + money(b.high); }

  // ---------- SKUs ----------
  function norm(s) { return String(s || "").toLowerCase().replace(/\s+/g, " ").trim(); }
  function sku(text) {
    const o = get().skus[norm(text)];
    if (o) return String(o);
    return window.SF_IMG && window.SF_IMG.skuFor ? window.SF_IMG.skuFor(text) : null;
  }
  function setSku(text, value) {
    const skus = Object.assign({}, get().skus);
    const k = norm(text); const v = String(value || "").replace(/\D/g, "");
    if (v) skus[k] = v; else delete skus[k];
    set({ skus: skus });
    return v;
  }
  function bbyUrl(text, query) {
    const s = sku(text);
    return s ? "https://www.bestbuy.com/site/" + s + ".p" : "https://www.bestbuy.com/site/searchpage.jsp?st=" + encodeURIComponent(query || text);
  }

  // ---------- customer view ----------
  function isCustomer() { return !!get().customer; }
  function applyMode() {
    document.documentElement.setAttribute("data-mode", isCustomer() ? "customer" : "coach");
    const b = document.querySelector(".top .mode");
    if (b) { b.setAttribute("aria-pressed", String(isCustomer())); b.title = isCustomer() ? "Customer view on. Tap for your notes." : "Show the customer: hides your notes"; }
    let chip = document.getElementById("modeChip");
    if (isCustomer()) {
      if (!chip) { chip = document.createElement("button"); chip.id = "modeChip"; chip.type = "button"; chip.className = "modechip"; chip.textContent = "Customer view · tap to exit"; chip.addEventListener("click", function () { setCustomer(false); }); document.body.appendChild(chip); }
    } else if (chip) chip.remove();
  }
  function setCustomer(on) { set({ customer: !!on }); applyMode(); }

  // ---------- floor cards ----------
  const OPENERS = [
    { where: "TV wall", line: "Which room is this TV going in, and what's on it most nights, movies, sports, or the news?" },
    { where: "TV wall", line: "What size are you replacing? I'll tell you how different this one is going to feel from across the room." },
    { where: "Soundbar aisle", line: "What's the sound like on your TV right now, is it dialogue you can't make out, or is it just small?" },
    { where: "Soundbar aisle", line: "Is this for the main room or a bedroom? The right answer changes a lot between those two." },
    { where: "Speaker room", line: "Have you ever heard a real Atmos setup with speakers in the ceiling? Give me two minutes and I'll show you what you're missing." },
    { where: "Speaker room", line: "What's the last movie or concert that sounded great to you? I'll play something like it on these." },
    { where: "Receivers", line: "What are you plugging into it, and how many speakers are we talking about?" },
    { where: "Anywhere", line: "How do you feel about wires? That one question decides which half of the store I walk you to." },
    { where: "Anywhere", line: "Are you building this room from scratch or upgrading something that's already there?" },
  ];
  const OBJECTIONS = [
    { say: "A soundbar is fine.",
      answer: "A good bar is fine, and for a bedroom I'd sell you one. In this room the gap is dialogue and bass: a bar fires from one spot, separate speakers put the voice at the screen and the bass where you sit. Let me play the same scene on both and you tell me.",
      proof: "Demo a dialogue-heavy scene on a bar, then on the floor system. Say nothing until they react." },
    { say: "I'll get it cheaper online.",
      answer: "Price-match it here, same price, and you walk out with it today. What you don't get online is me setting the crossover and running the room correction, and Geek Squad if anything ever goes wrong. Bring me the link.",
      proof: "Open the price match policy on the phone. Then offer the financing number so the conversation moves from price to payment." },
    { say: "The Sonance package is cheaper.",
      answer: "It is, and for ceiling speakers in the kitchen it's what I'd recommend. In a theater the front three are the voice, and ceiling speakers up front fire at the floor, so dialogue never comes from the screen. Keep Sonance in the ceiling, put real speakers up front.",
      proof: "Show the Brands page: Sonance Mag for heights and surrounds, a VX62 LCR or a box center up front." },
    { say: "That's more than I wanted to spend.",
      answer: "Then let's not spend it. Here's the same room at the price you had in mind, and here's what you'd add later without replacing anything. Which pieces matter most to you, the picture or the sound?",
      proof: "Drop to the Good column, show the monthly payment, and keep the upgrade path on the screen." },
    { say: "My TV speakers are okay.",
      answer: "They're okay in a quiet room. Turn on the dishwasher or put four people in the room and the voices disappear. That's the first thing a center channel fixes, and it's the cheapest part of the system.",
      proof: "Play a quiet-dialogue scene on the TV, then on a center channel at the same volume." },
    { say: "I need to talk to my spouse.",
      answer: "You should. Let me text you the exact list with the price and the monthly number so you're not describing it from memory. What night this week could you both come in for ten minutes? I'll have it set up.",
      proof: "Save the lead, send the summary, book the follow-up on the spot." },
    { say: "I'll wait for a sale.",
      answer: "Fair. Two things: the financing promo runs now, and I can note the price on your lead and call you the day it drops. What's the number you'd buy at?",
      proof: "Save the lead with the target price in Notes and set the follow-up reminder." },
  ];

  // ---------- settings sheet ----------
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]; }); }
  function sheetHtml() {
    const s = get();
    const promoRows = s.promos.map(function (p, i) {
      return "<div class='prow'><label class='chk'><input type='checkbox' data-p='" + i + "' data-k='on'" + (p.on ? " checked" : "") + "> On</label>" +
        "<label>Months <input type='number' inputmode='numeric' min='1' max='60' data-p='" + i + "' data-k='months' value='" + p.months + "'></label>" +
        "<label>Minimum $ <input type='number' inputmode='numeric' min='0' step='1' data-p='" + i + "' data-k='min' value='" + p.min + "'></label></div>";
    }).join("");
    const installRows = Object.keys(INSTALL_LABELS).map(function (k) {
      return "<div class='irow'><span>" + esc(INSTALL_LABELS[k]) + "</span><label>Low $ <input type='number' inputmode='numeric' min='0' data-i='" + k + "' data-k='low' value='" + s.install[k].low + "'></label><label>High $ <input type='number' inputmode='numeric' min='0' data-i='" + k + "' data-k='high' value='" + s.install[k].high + "'></label></div>";
    }).join("");
    const clipRows = [["height", "Height (Atmos)"], ["bass", "Bass"], ["dialog", "Dialogue"], ["imaging", "Imaging / width"], ["music", "Music"]].map(function (c) {
      return "<label>" + c[1] + " <input type='text' data-c='" + c[0] + "' value='" + esc(s.clips[c[0]]) + "' placeholder='Scene or track you demo for this'></label>";
    }).join("");
    return "<form method='dialog' class='sheetform'>" +
      "<div class='row between'><h3>Settings</h3><button class='btn link' type='button' data-close>Close</button></div>" +
      "<p class='muted small'>Saved on this phone only. Nothing here goes to a server.</p>" +
      "<div class='sgroup'><p class='eyebrow'>You</p><div class='grid2'><label>Your mobile <input type='tel' inputmode='tel' data-f='phone' value='" + esc(s.phone) + "' placeholder='For Text me this lead'></label><label>Your email <input type='email' inputmode='email' data-f='email' value='" + esc(s.email) + "' placeholder='For Email me this lead'></label></div></div>" +
      "<div class='sgroup'><p class='eyebrow'>Financing on the norrito card</p><p class='muted small'>Equal monthly payments. The app shows the longest promo a total qualifies for. Edit to match this week's offer.</p>" + promoRows + "</div>" +
      "<div class='sgroup'><p class='eyebrow'>Install ranges (labor only)</p><p class='muted small'>Starting points. Replace with the low and high norrito gives you for each kind of job.</p>" + installRows + "</div>" +
      "<div class='sgroup'><p class='eyebrow'>Your demo clips</p><p class='muted small'>The demo script names these. Leave blank and it describes the kind of scene to use.</p>" + clipRows + "</div>" +
      "<div class='row'><button class='btn primary' type='button' data-save>Save</button><button class='btn link' type='button' data-reset>Reset to defaults</button></div>" +
      "</form>";
  }
  function openSettings() {
    let d = document.getElementById("sfSettings");
    if (!d) {
      d = document.createElement("dialog"); d.id = "sfSettings"; d.className = "sheet"; document.body.appendChild(d);
      d.addEventListener("click", function (e) {
        if (e.target === d) { d.close(); return; }
        const t = e.target.closest("button"); if (!t) return;
        if (t.hasAttribute("data-close")) d.close();
        if (t.hasAttribute("data-reset")) {
          if (t.dataset.armed !== "1") { t.dataset.armed = "1"; t.textContent = "Tap again to reset"; setTimeout(function () { t.dataset.armed = ""; t.textContent = "Reset to defaults"; }, 3000); return; }
          set(Object.assign(clone(DEFAULTS), { skus: get().skus }));
          setTimeout(function () { d.innerHTML = sheetHtml(); }, 0);
        }
        if (t.hasAttribute("data-save")) {
          const s = clone(get());
          d.querySelectorAll("[data-f]").forEach(function (i) { s[i.dataset.f] = i.value.trim(); });
          d.querySelectorAll("[data-p]").forEach(function (i) { const p = s.promos[+i.dataset.p]; if (!p) return; if (i.dataset.k === "on") p.on = i.checked; else p[i.dataset.k] = Math.max(0, parseInt(i.value, 10) || 0); });
          d.querySelectorAll("[data-i]").forEach(function (i) { s.install[i.dataset.i][i.dataset.k] = Math.max(0, parseInt(i.value, 10) || 0); });
          d.querySelectorAll("[data-c]").forEach(function (i) { s.clips[i.dataset.c] = i.value.trim(); });
          d.close();
          set(s);
          if (window.SF_TOAST) window.SF_TOAST("Settings saved");
        }
      });
    }
    d.innerHTML = sheetHtml();
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
  }

  // ---------- header buttons ----------
  function install() {
    applyMode();
    const slot = document.querySelector(".top .row");
    if (!slot || slot.querySelector(".mode")) return;
    const m = document.createElement("button");
    m.type = "button"; m.className = "btn mode"; m.setAttribute("aria-label", "Customer view"); m.setAttribute("aria-pressed", String(isCustomer()));
    m.innerHTML = "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z'/><circle cx='12' cy='12' r='3'/></svg>";
    m.addEventListener("click", function () { setCustomer(!isCustomer()); });
    const g = document.createElement("button");
    g.type = "button"; g.className = "btn sgear coach"; g.setAttribute("aria-label", "Settings");
    g.innerHTML = "<svg viewBox='0 0 24 24' aria-hidden='true'><circle cx='12' cy='12' r='3'/><path d='M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z'/></svg>";
    g.addEventListener("click", openSettings);
    const theme = slot.querySelector(".theme");
    if (theme) { slot.insertBefore(m, theme); slot.insertBefore(g, theme); } else { slot.appendChild(m); slot.appendChild(g); }
  }
  applyMode();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install); else install();

  window.SF_SALES = {
    get: get, set: set, money: money,
    plan: plan, monthlyText: monthlyText, monthlyHtml: monthlyHtml,
    installKind: installKind, installBand: installBand, installText: installText, INSTALL_LABELS: INSTALL_LABELS,
    sku: sku, setSku: setSku, bbyUrl: bbyUrl,
    isCustomer: isCustomer, setCustomer: setCustomer, openSettings: openSettings,
    OPENERS: OPENERS, OBJECTIONS: OBJECTIONS, esc: esc,
  };
})();
