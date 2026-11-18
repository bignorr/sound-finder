/* Sound Finder build engine: pure logic, no DOM.
 * Browser: window.SFEngine.  Node (tests): require("./engine.js").
 *
 * Money is integer cents. A layout is an ordered list of slots; each slot
 * lists options { id, cents, qty, ref }. A build takes exactly one option per
 * slot and costs cents * qty for each. feasible(picks) returns null for a
 * valid build, or the name of the rule that excludes it. A budget range
 * [lo, hi] is inclusive. Pruning uses cost only, so it never drops a valid
 * build; tests/cross_check.js checks that against brute force.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SFEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Validates a layout, sorts each slot by cost (ties by id), and records the
  // cheapest and dearest total of the slots after each position. search() uses
  // those sums to prune.
  function prepare(layout) {
    if (!layout || !Array.isArray(layout.slots) || layout.slots.length === 0) {
      throw new Error("layout needs at least one slot");
    }
    const names = new Set();
    const slots = layout.slots.map(function (slot) {
      if (names.has(slot.name)) throw new Error("duplicate slot " + slot.name);
      names.add(slot.name);
      const ids = new Set();
      const options = slot.options.map(function (o) {
        if (!Number.isSafeInteger(o.cents) || o.cents <= 0) {
          throw new Error("cents must be a positive integer: " + o.id);
        }
        if (!Number.isSafeInteger(o.qty) || o.qty < 1) {
          throw new Error("qty must be a positive integer: " + o.id);
        }
        if (ids.has(o.id)) throw new Error("duplicate option " + o.id + " in " + slot.name);
        ids.add(o.id);
        const cost = o.cents * o.qty;
        if (!Number.isSafeInteger(cost)) throw new Error("cost too large: " + o.id);
        return { id: o.id, cents: o.cents, qty: o.qty, cost: cost, ref: o.ref };
      });
      options.sort(function (a, b) {
        return a.cost - b.cost || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
      });
      return { name: slot.name, options: options };
    });
    const n = slots.length;
    const sufMin = new Array(n + 1).fill(0);
    const sufMax = new Array(n + 1).fill(0);
    let empty = false;
    for (let i = n - 1; i >= 0; i--) {
      const opts = slots[i].options;
      if (opts.length === 0) empty = true;
      sufMin[i] = sufMin[i + 1] + (opts.length ? opts[0].cost : 0);
      sufMax[i] = sufMax[i + 1] + (opts.length ? opts[opts.length - 1].cost : 0);
    }
    return { slots: slots, sufMin: sufMin, sufMax: sufMax, empty: empty };
  }

  function checkRange(lo, hi) {
    if (!Number.isSafeInteger(lo) || !Number.isSafeInteger(hi)) {
      throw new Error("budget bounds must be whole cents");
    }
  }

  // Depth-first walk, one slot at a time, options in cost order.
  // break: a dearer option only overshoots hi further.
  // continue: even the dearest completion of this option stays below lo,
  // so only a dearer option can reach the range.
  function search(prep, lo, hi, feasible, onBuild, onReject) {
    const stats = { nodes: 0, leaves: 0 };
    if (prep.empty || lo > hi) return stats;
    const slots = prep.slots;
    const sufMin = prep.sufMin;
    const sufMax = prep.sufMax;
    const n = slots.length;
    const picks = new Array(n);
    let stopped = false;

    function dfs(i, sum) {
      if (i === n) {
        stats.leaves++;
        if (sum < lo || sum > hi) return;
        const rule = feasible(picks);
        if (rule !== null) {
          if (onReject) onReject(rule, picks);
          return;
        }
        if (onBuild && onBuild(sum, picks) === false) stopped = true;
        return;
      }
      const opts = slots[i].options;
      for (let j = 0; j < opts.length; j++) {
        const o = opts[j];
        const c = sum + o.cost;
        if (c + sufMin[i + 1] > hi) break;
        if (c + sufMax[i + 1] < lo) continue;
        stats.nodes++;
        picks[i] = { slot: slots[i].name, id: o.id, qty: o.qty, cents: o.cents, cost: o.cost, ref: o.ref };
        dfs(i + 1, c);
        if (stopped) return;
      }
    }

    dfs(0, 0);
    return stats;
  }

  // Calls onBuild(total, picks) for each valid build in [lo, hi].
  // picks is reused between calls, so copy it if you keep it.
  function forEachBuild(layout, lo, hi, feasible, onBuild, onReject) {
    checkRange(lo, hi);
    return search(prepare(layout), lo, hi, feasible, onBuild, onReject);
  }

  function countBuilds(layout, lo, hi, feasible) {
    let count = 0;
    const stats = forEachBuild(layout, lo, hi, feasible, function () { count++; });
    return { count: count, nodes: stats.nodes, leaves: stats.leaves };
  }

  // Keeps the first `limit` builds in enumeration order and counts them all.
  function collectBuilds(layout, lo, hi, feasible, limit) {
    const kept = [];
    let count = 0;
    const stats = forEachBuild(layout, lo, hi, feasible, function (total, picks) {
      count++;
      if (kept.length < limit) kept.push({ total: total, picks: picks.slice() });
    });
    return { count: count, builds: kept, nodes: stats.nodes, leaves: stats.leaves };
  }

  // Reference answer: every combination, no sorting, no pruning. Used only to
  // check the pruned search on small catalogs.
  function bruteBuilds(layout, lo, hi, feasible) {
    const n = layout.slots.length;
    const picks = new Array(n);
    const out = [];
    (function walk(i, sum) {
      if (i === n) {
        if (sum >= lo && sum <= hi && feasible(picks) === null) {
          out.push({ total: sum, picks: picks.slice() });
        }
        return;
      }
      const slot = layout.slots[i];
      for (let j = 0; j < slot.options.length; j++) {
        const o = slot.options[j];
        const cost = o.cents * o.qty;
        picks[i] = { slot: slot.name, id: o.id, qty: o.qty, cents: o.cents, cost: cost, ref: o.ref };
        walk(i + 1, sum + cost);
      }
    })(0, 0);
    return out;
  }

  function buildKey(picks) {
    return picks.map(function (p) { return p.slot + ":" + p.id + "x" + p.qty; }).join("|");
  }

  // Compares two build lists as sets of keys. match = same builds, no repeats.
  function compareBuildSets(a, b) {
    const ka = a.map(function (x) { return buildKey(x.picks); });
    const kb = b.map(function (x) { return buildKey(x.picks); });
    const sa = new Set(ka);
    const sb = new Set(kb);
    let onlyA = 0;
    let onlyB = 0;
    sa.forEach(function (k) { if (!sb.has(k)) onlyA++; });
    sb.forEach(function (k) { if (!sa.has(k)) onlyB++; });
    const repeats = (ka.length - sa.size) + (kb.length - sb.size);
    return {
      countA: ka.length,
      countB: kb.length,
      onlyA: onlyA,
      onlyB: onlyB,
      repeats: repeats,
      match: onlyA === 0 && onlyB === 0 && repeats === 0
    };
  }

  // Coverage for one product. matches(option) says whether an option is that
  // product. covered=true when some valid build in [lo, hi] contains it.
  // Otherwise reason is "budget" when no build in range contains it, or
  // "rule:<name>" for the rule that removed the most of those builds.
  function scanProduct(layout, lo, hi, feasible, matches) {
    checkRange(lo, hi);
    const inRange = new Set();
    const valid = new Set();
    const rules = {};
    let cheapest = Infinity;
    layout.slots.forEach(function (slot, s) {
      const mine = slot.options.filter(matches);
      if (mine.length === 0) return;
      let restMin = 0;
      layout.slots.forEach(function (other, t) {
        if (t === s) return;
        let m = Infinity;
        other.options.forEach(function (o) { m = Math.min(m, o.cents * o.qty); });
        restMin += m;
      });
      mine.forEach(function (o) { cheapest = Math.min(cheapest, o.cents * o.qty + restMin); });
      const variant = {
        slots: layout.slots.map(function (sl, k) {
          return k === s ? { name: sl.name, options: mine } : sl;
        })
      };
      search(prepare(variant), lo, hi, feasible,
        function (total, picks) {
          const k = buildKey(picks);
          inRange.add(k);
          valid.add(k);
        },
        function (rule, picks) {
          const k = buildKey(picks);
          if (!inRange.has(k)) {
            inRange.add(k);
            rules[rule] = (rules[rule] || 0) + 1;
          }
        });
    });
    const out = {
      covered: valid.size > 0,
      validBuilds: valid.size,
      inRangeBuilds: inRange.size,
      cheapestCents: cheapest === Infinity ? null : cheapest,
      rules: rules,
      reason: null
    };
    if (valid.size === 0) {
      if (inRange.size === 0) {
        out.reason = "budget";
      } else {
        let top = null;
        Object.keys(rules).forEach(function (r) {
          if (top === null || rules[r] > rules[top]) top = r;
        });
        out.reason = "rule:" + top;
      }
    }
    return out;
  }

  return {
    prepare: prepare,
    forEachBuild: forEachBuild,
    countBuilds: countBuilds,
    collectBuilds: collectBuilds,
    bruteBuilds: bruteBuilds,
    buildKey: buildKey,
    compareBuildSets: compareBuildSets,
    scanProduct: scanProduct
  };
});
