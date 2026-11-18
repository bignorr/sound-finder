// Cross-check: pruned search vs brute force on synthetic catalogs.
// Run: node tests/cross_check.js [catalogs=60] [budgets per layout=60] [seed=20261118]
"use strict";
const path = require("path");
const SF = require(path.join(__dirname, "..", "engine.js"));

const CATALOGS = Number(process.argv[2] || 60);
const BUDGETS = Number(process.argv[3] || 60);
const SEED = Number(process.argv[4] || 20261118);
const MAX = Number.MAX_SAFE_INTEGER;

// mulberry32: small seeded PRNG so every run is repeatable.
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const pick = (r, xs) => xs[Math.floor(r() * xs.length)];

// Half the prices sit on a $250 grid, so cost ties are common.
function price(r) {
  return r() < 0.5 ? int(r, 4, 300) * 25000 : int(r, 4000, 300000);
}

// One product per entry; one option per allowed quantity.
function speakers(r, prefix, count, qtys) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const sku = prefix + i;
    const cents = price(r);
    const ref = { sku: sku, ohm: pick(r, [4, 6, 8]), sens: int(r, 84, 93), sourced: r() > 0.12 };
    qtys.forEach(function (q) {
      out.push({ id: sku + "x" + q, cents: cents, qty: q, ref: ref });
    });
  }
  return out;
}

function makeCatalog(r) {
  const receivers = [];
  const rx = int(r, 2, 4);
  for (let i = 0; i < rx; i++) {
    const w8 = pick(r, [60, 100, 150, 200]);
    receivers.push({
      id: "rx" + i + "x1",
      cents: price(r),
      qty: 1,
      ref: {
        sku: "rx" + i, sourced: true, channels: pick(r, [5, 7, 9]),
        subOut: pick(r, [1, 2]), w8: w8, w6: Math.round(w8 * 1.3), w4: Math.round(w8 * 1.6)
      }
    });
  }
  return {
    receivers: receivers,
    fronts: speakers(r, "f", int(r, 2, 3), [1, 2]),
    centers: speakers(r, "c", int(r, 2, 3), [1]),
    surrounds: speakers(r, "s", int(r, 2, 4), [2]),
    heights: speakers(r, "h", int(r, 1, 2), [2]),
    subs: speakers(r, "b", int(r, 2, 3), [1, 2])
  };
}

// Receiver is always the first slot.
function layoutsFor(cat) {
  const rx = { name: "receiver", options: cat.receivers };
  const fr = { name: "front", options: cat.fronts };
  const ce = { name: "center", options: cat.centers };
  const su = { name: "surround", options: cat.surrounds };
  const he = { name: "height", options: cat.heights };
  const sb = { name: "sub", options: cat.subs };
  return [
    { id: "5.1", slots: [rx, fr, ce, su, sb] },
    { id: "5.1.2", slots: [rx, fr, ce, su, he, sb] }
  ];
}

// Synthetic stand-in for the real rules (sourcing, channels, sub outputs,
// power). Returns null when the build is valid, else the excluding rule.
function feasible(picks) {
  for (const p of picks) if (p.ref.sourced === false) return "unsourced-spec";
  const rx = picks[0].ref;
  let amped = 0;
  let subs = 0;
  for (const p of picks) {
    if (p.slot === "receiver") continue;
    if (p.slot === "sub") subs += p.qty;
    else amped += p.qty;
  }
  if (amped > rx.channels) return "receiver-channels";
  if (subs > rx.subOut) return "sub-outputs";
  for (const p of picks) {
    if (p.slot === "receiver" || p.slot === "sub") continue;
    const need = 2 * Math.pow(10, (100 - p.ref.sens) / 10) * (8 / p.ref.ohm);
    const have = p.ref.ohm <= 4 ? rx.w4 : p.ref.ohm <= 6 ? rx.w6 : rx.w8;
    if (have < need) return "power-" + p.ref.ohm + "ohm";
  }
  return null;
}

// Same options in a random order: the answer must not depend on input order.
function shuffled(layout, r) {
  return {
    id: layout.id,
    slots: layout.slots.map(function (sl) {
      const opts = sl.options.slice();
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        const t = opts[i];
        opts[i] = opts[j];
        opts[j] = t;
      }
      return { name: sl.name, options: opts };
    })
  };
}

// Budget ranges: edges at real build totals, exact amounts, lo > hi, random.
function rangeFor(r, all, maxTotal) {
  const k = int(r, 0, 4);
  if (k <= 1 && all.length) {
    const t = pick(r, all).total;
    return k === 0
      ? [t, t + int(r, 0, 20000)]
      : [Math.max(0, t - int(r, 0, 20000)), t];
  }
  if (k === 2) {
    const t = int(r, 0, maxTotal);
    return [t, t];
  }
  if (k === 3) {
    const lo = int(r, 1, maxTotal);
    return [lo, lo - 1];
  }
  const lo = int(r, 0, maxTotal);
  return [lo, lo + int(r, 0, maxTotal)];
}

function unitChecks() {
  let passed = 0;
  const eq = function (a, b, label) {
    if (a !== b) throw new Error("unit check failed: " + label + " (got " + a + ", want " + b + ")");
    passed++;
  };
  const threw = function (fn, label) {
    let t = false;
    try { fn(); } catch (e) { t = true; }
    eq(t, true, label);
  };
  const one = function (opts) { return { id: "u", slots: [{ name: "a", options: opts }] }; };
  const ok = function () { return null; };
  const x500 = one([{ id: "x", cents: 500, qty: 1 }]);
  threw(function () { SF.prepare({ slots: [] }); }, "no slots throws");
  threw(function () { SF.prepare(one([{ id: "x", cents: 1.5, qty: 1 }])); }, "fractional cents throw");
  threw(function () { SF.prepare(one([{ id: "x", cents: 100, qty: 0 }])); }, "zero qty throws");
  threw(function () {
    SF.prepare(one([{ id: "x", cents: 1, qty: 1 }, { id: "x", cents: 2, qty: 1 }]));
  }, "duplicate option id throws");
  eq(SF.countBuilds(x500, 500, 500, ok).count, 1, "lower bound inclusive");
  eq(SF.countBuilds(x500, 0, 500, ok).count, 1, "upper bound inclusive");
  eq(SF.countBuilds(x500, 501, 900, ok).count, 0, "above range");
  eq(SF.countBuilds(x500, 0, 499, ok).count, 0, "below range");
  eq(SF.countBuilds(x500, 600, 500, ok).count, 0, "lo above hi");
  eq(SF.countBuilds(one([{ id: "y", cents: 300, qty: 2 }]), 600, 600, ok).count, 1, "cost is cents times qty");
  const emptySlot = { id: "e", slots: [
    { name: "a", options: [{ id: "x", cents: 100, qty: 1 }] },
    { name: "b", options: [] }
  ] };
  eq(SF.countBuilds(emptySlot, 0, MAX, ok).count, 0, "empty slot gives no builds");
  eq(SF.countBuilds(x500, 0, MAX, function () { return "nope"; }).count, 0, "rejected builds not counted");
  eq(SF.scanProduct(x500, 0, MAX, ok, function () { return true; }).covered, true, "coverage when valid");
  eq(SF.scanProduct(x500, 0, 100, ok, function () { return true; }).reason, "budget", "coverage names budget");
  eq(SF.scanProduct(x500, 0, MAX, function () { return "power-4ohm"; }, function () { return true; }).reason,
    "rule:power-4ohm", "coverage names rule");
  return passed;
}

const unitPassed = unitChecks();
const tally = {
  catalogs: 0, layouts: 0, validTotal: 0, budgetsTested: 0, nonEmptyBudgets: 0,
  validBuildsCompared: 0, mismatches: 0, countMismatches: 0, fullCountMismatch: 0,
  emptyWhenValid: 0, shuffleMismatches: 0, nodesPruned: 0, combosBrute: 0,
  coverageChecks: 0, coverageMismatches: 0, uncoveredWithoutReason: 0,
  uncoveredByReason: {}, rejectsByRule: {}
};
const examples = [];

for (let c = 0; c < CATALOGS; c++) {
  const r = rng(SEED + c);
  const cat = makeCatalog(r);
  tally.catalogs++;
  for (const layout of layoutsFor(cat)) {
    tally.layouts++;
    const maxTotal = layout.slots.reduce(function (s, sl) {
      return s + Math.max.apply(null, sl.options.map(function (o) { return o.cents * o.qty; }));
    }, 0);
    const combos = layout.slots.reduce(function (p, sl) { return p * sl.options.length; }, 1);
    tally.combosBrute += combos * BUDGETS;
    const all = SF.bruteBuilds(layout, 0, MAX, feasible);
    tally.validTotal += all.length;
    if (SF.countBuilds(layout, 0, MAX, feasible).count !== all.length) tally.fullCountMismatch++;
    SF.forEachBuild(layout, 0, MAX, feasible, null, function (rule) {
      tally.rejectsByRule[rule] = (tally.rejectsByRule[rule] || 0) + 1;
    });
    const sh = shuffled(layout, r);
    const skus = Array.from(new Set(layout.slots.flatMap(function (sl) {
      return sl.options.map(function (o) { return o.ref.sku; });
    })));
    for (let b = 0; b < BUDGETS; b++) {
      const range = rangeFor(r, all, maxTotal);
      const lo = range[0];
      const hi = range[1];
      const expected = all.filter(function (x) { return x.total >= lo && x.total <= hi; });
      const got = SF.collectBuilds(layout, lo, hi, feasible, Infinity);
      const cmp = SF.compareBuildSets(got.builds, expected);
      tally.budgetsTested++;
      if (expected.length > 0) tally.nonEmptyBudgets++;
      tally.validBuildsCompared += expected.length;
      tally.nodesPruned += got.nodes;
      if (expected.length > 0 && got.count === 0) tally.emptyWhenValid++;
      if (!cmp.match || got.count !== expected.length) {
        tally.mismatches++;
        if (examples.length < 5) {
          examples.push({ catalog: c, layout: layout.id, lo: lo, hi: hi, expected: expected.length, got: got.count });
        }
      }
      if (SF.countBuilds(layout, lo, hi, feasible).count !== expected.length) tally.countMismatches++;
      if (b === 0) {
        const alt = SF.collectBuilds(sh, lo, hi, feasible, Infinity);
        if (!SF.compareBuildSets(alt.builds, expected).match) tally.shuffleMismatches++;
      }
      skus.forEach(function (sku) {
        const want = expected.some(function (x) {
          return x.picks.some(function (p) { return p.ref.sku === sku; });
        });
        const sc = SF.scanProduct(layout, lo, hi, feasible, function (o) { return o.ref.sku === sku; });
        tally.coverageChecks++;
        if (sc.covered !== want) tally.coverageMismatches++;
        if (!sc.covered) {
          if (!sc.reason) tally.uncoveredWithoutReason++;
          tally.uncoveredByReason[sc.reason] = (tally.uncoveredByReason[sc.reason] || 0) + 1;
        }
      });
    }
  }
}

const failing = tally.mismatches + tally.countMismatches + tally.fullCountMismatch +
  tally.emptyWhenValid + tally.shuffleMismatches + tally.coverageMismatches + tally.uncoveredWithoutReason;
console.log(JSON.stringify({
  seed: SEED,
  unitChecksPassed: unitPassed,
  catalogs: tally.catalogs,
  layouts: tally.layouts,
  validBuildsEnumerated: tally.validTotal,
  budgetsTested: tally.budgetsTested,
  budgetsWithValidBuilds: tally.nonEmptyBudgets,
  validBuildsCompared: tally.validBuildsCompared,
  mismatches: tally.mismatches,
  countMismatches: tally.countMismatches,
  fullCountMismatch: tally.fullCountMismatch,
  emptyWhenValid: tally.emptyWhenValid,
  shuffleMismatches: tally.shuffleMismatches,
  coverage: {
    checks: tally.coverageChecks,
    mismatches: tally.coverageMismatches,
    uncoveredWithoutReason: tally.uncoveredWithoutReason,
    uncoveredByReason: tally.uncoveredByReason
  },
  pruning: { bruteCombosForSameBudgets: tally.combosBrute, prunedNodesVisited: tally.nodesPruned },
  rejectsByRule: tally.rejectsByRule,
  examples: examples
}, null, 2));
process.exitCode = failing === 0 ? 0 : 1;
