// Sound Finder: package deals and complete systems that give a build a different price than the lines add up to.
// Everything here was read off bestbuy.com on Nov 17, 2026, sold and shipped by Best Buy. Package prices move weekly, and
// bestbuy.com says online package savings may not be honored in store, so confirm the number in norrito before you quote it.
//
// covers:   when the package applies, matched against the builder (series id, speaker count, heights, subs, fronts, surround/height type).
//           A key that is left out matches anything. Packages with no "covers" are listed for the brand but never applied to a build.
// replaces: the speaker groups the package stands in for (Fronts, Center, Side surrounds, Rears, Heights, Subwoofer). Lines outside
//           those groups stay on the list at their own price. amp: the amplifier that comes in the box, if any; it takes the receiver's place.
(function () {
  const UA = { brand: "Sonance", m: "UA 2-125 ARC 2.1-ch TV amplifier", pk: "Sonance UA 2-125 ARC", sku: "6635174", why: "125 W x 2 into 8 ohms, HDMI eARC with CEC so the TV remote runs the volume, sub out; $999.99 on its own" };
  window.SF_BUNDLES = {
    asOf: "Nov 17, 2026",
    list: [
      // ---- Sonance complete systems (one SKU, Only at Best Buy) ----
      { id: "mag51r", kind: "system", brand: "Sonance", name: "MAG5.1R 5.1 in-ceiling system", price: 749, comp: 2499, sku: "6196627", thumb: "arch",
        covers: { series: ["sonance-mag"], around: [5], heights: [0], subs: [1] }, replaces: ["Fronts", "Center", "Side surrounds", "Subwoofer"],
        includes: "Five 6.5 in in-ceiling speakers (left, center, right and two surrounds) and the MS8 SUB 100 W powered subwoofer",
        note: "Runs $499 to $699 on sale days. Passive: add the receiver. This is the discounted Sonance package." },
      { id: "mag51p", kind: "system", brand: "Sonance", name: "MAG5.1 PREMIUM 5.1 in-wall system", price: 1199, comp: 4499, sku: "6401739", thumb: "arch",
        covers: { series: ["sonance-mag"], around: [5], heights: [0], subs: [1] }, replaces: ["Fronts", "Center", "Side surrounds", "Subwoofer"],
        includes: "Three MAG6 LCR in-walls for the screen wall, two MAG6R SUR in-ceilings, the MS10SUB 275 W sub and the wireless sub kit",
        note: "The in-wall Mag front stage is only sold inside this package. Passive: add the receiver. Seen at $1,499 some weeks." },
      { id: "sstv", kind: "system", brand: "Sonance", name: "MAG SSTVAUDIO soundbar alternative", price: 1299, comp: 2999, sku: "6408707", thumb: "arch",
        covers: { series: ["sonance-mag"], around: [2], heights: [0] }, replaces: ["Fronts"],
        amp: { brand: "Sonos", m: "Amp", sku: "6312857", why: "125 W x 2 into 8 ohms, HDMI ARC from the TV, sub out, every streaming service in the Sonos app" },
        includes: "Sonos Amp, two MAG6 LCR in-wall speakers flanking the TV, and the behind-the-TV wall box that hides the Amp",
        note: "The $1,299 Sonance amplifier-and-two-in-walls offer on the front of bestbuy.com. A sub goes on the Amp's sub out." },
      // ---- bestbuy.com packages: Sonance TV amp + speakers ----
      { id: "ua-mag6r", kind: "package", brand: "Sonance", name: "UA 2-125 ARC amp + MAG6R in-ceiling pair", price: 1048.99, comp: 1748.99, thumb: "amp",
        covers: { series: ["sonance-mag"], around: [2], heights: [0], fronts: ["bookshelf"] }, replaces: ["Fronts"], amp: UA,
        includes: "Sonance UA 2-125 ARC 2.1 TV audio amplifier and one MAG6R 6.5 in in-ceiling pair",
        note: "bestbuy.com package price, save $700. TV sound from the ceiling with the TV remote; no surround path." },
      { id: "ua-vx62", kind: "package", brand: "Sonance", name: "UA 2-125 ARC amp + VX62 in-wall pair + AudioQuest HDMI", price: 1579.94, comp: 1679.94, thumb: "amp",
        covers: { series: ["sonance-vx"], around: [2], heights: [0], fronts: ["tower"] }, replaces: ["Fronts"], amp: UA,
        includes: "UA 2-125 ARC amp, one VX62 6.5 in in-wall pair and an AudioQuest Forest 48 5 ft in-wall-rated HDMI cable",
        note: "bestbuy.com package price, save $100. Leave the HDMI line off the accessories; it is in the box." },
      { id: "ua-vx66", kind: "package", brand: "Sonance", name: "UA 2-125 ARC amp + two VX66 LCR in-walls", price: 2929.99, thumb: "amp",
        covers: { series: ["sonance-vx"], around: [2], heights: [0], fronts: ["tower"] }, replaces: ["Fronts"], amp: UA,
        includes: "UA 2-125 ARC amp and two VX66 LCR 6.5 in in-wall speakers, the top VX 6.5 with the ceramic tweeter",
        note: "bestbuy.com package; the step up from the VX62 pair for a main living room." },
      // ---- bestbuy.com receiver packages ----
      { id: "onkyo-klipsch", kind: "package", brand: "Klipsch", name: "Onkyo TX-NR5100 + Klipsch Reference 5.1.2", price: 2724.93, comp: 4224.93, thumb: "tower",
        covers: { series: ["klipsch-ref"], around: [5], heights: [2], subs: [1], fronts: ["tower"], surroundType: ["series"], heightType: ["series"] },
        replaces: ["Fronts", "Center", "Side surrounds", "Heights", "Subwoofer"],
        amp: { brand: "Onkyo", m: "TX-NR5100 7.2-ch receiver", why: "80 W x 2 into 8 ohms (no 7-channel rating published), Dolby Atmos and DTS:X, 8K HDMI; it comes in the package in place of the Sony or Denon" },
        includes: "Onkyo TX-NR5100, two R-800F towers, R-30C center, R-50M surround pair, R-121SW 12 in sub and the R-40SA height pair",
        note: "bestbuy.com package price, save $1,500. The center in the box is the R-30C, not the R-50C on the line-by-line list." },
      { id: "yam-klipsch", kind: "package", brand: "Klipsch", name: "Yamaha R-S202 stereo receiver + Klipsch R-50M pair", price: 499.98, comp: 644.94, thumb: "amp",
        covers: { series: ["klipsch-ref"], around: [2], heights: [0], subs: [0], fronts: ["bookshelf"] }, replaces: ["Fronts"],
        amp: { brand: "Yamaha", m: "R-S202 2-ch stereo receiver", sku: "5037100", why: "100 W x 2 into 8 ohms, Bluetooth, A/B speaker outputs; music only, no HDMI" },
        includes: "Yamaha R-S202BL stereo receiver and one Klipsch R-50M bookshelf pair",
        note: "bestbuy.com package price, save $144.96. The starter stereo for a bedroom, office or garage." },
      // ---- Sonance outdoor systems: listed for the brand, nothing in the builder to stand in for ----
      { id: "mago6", kind: "system", brand: "Sonance", name: "MAGO6SYSV3 2.0 outdoor system powered by Sonos", price: 999, comp: 1499, sku: "6438662",
        includes: "Sonos Amp and two MAGO6V3 all-weather speakers with brackets", note: "A patio music zone in one SKU; the Amp goes inside, wire runs out." },
      { id: "mag61", kind: "system", brand: "Sonance", name: "MAG6.1 landscape system powered by Sonos", price: 1299, comp: 2799, sku: "6440405",
        includes: "Six landscape satellites, an in-ground subwoofer and the Sonos Amp; covers about 1,500 sq ft", note: "$1,299 to $1,499 depending on the week." },
      { id: "magrocks", kind: "system", brand: "Sonance", name: "MAGROCKS2.1 outdoor rock system", price: 799, comp: 1449, sku: "6442556",
        includes: "Two MAGMR6 rock satellites and the MAGMR10W rock woofer; passive, so it needs a Sonos Amp or a receiver zone", note: "$649 to $799 depending on the week." },
      { id: "patio-sonos", kind: "package", brand: "Sonance", name: "PATIO4.1 outdoor system + Sonos Amp", price: 2449,
        includes: "Four Patio Series satellites, the in-ground subwoofer and the Sonos Amp", note: "bestbuy.com package; the bigger yard." }
    ]
  };
})();
