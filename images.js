// Sound Finder product images.
// Best Buy serves a photo for every SKU at pisces.bbystatic.com; the folder is the SKU's first four digits.
// SF_SKU maps a model phrase (lower-case, matched as a substring of "brand model") to the Best Buy SKU.
// Anything not mapped, or any photo that fails to load, falls back to a drawn silhouette of the speaker type.
(function () {
  const SKU = [
    // Sony
    ["ss-cs3", 6634686], ["ss-cs5", 6634688], ["ss-cs8", 6634687], ["ss-cse", 6634689], ["str-dh590", 6187502],
    // JBL
    ["stage 2 280f", 6584082], ["stage 2 260f", 6584084], ["stage 2 245c", 6584064], ["stage 2 240h", 6584070],
    ["studio 680", 6547544], ["studio 698", 6547547], ["hdi3800", 6426038], ["hdi3600", 6426048],
    // Klipsch
    ["r-800f", 6501480], ["r-600f", 6501478], ["r-605fa", 11989371], ["r-50m", 6501482], ["r-50c", 12089636], ["r-121sw", 6501481],
    ["rp-8000f ii", 11634400], ["rp-8060fa ii", 6506573], ["rp-6000f ii", 6506581], ["rp-5000f ii", 6506574],
    ["rp-600m ii", 6506566], ["rp-500m ii", 6506578], ["rp-504c ii", 6506562], ["rp-500c ii", 6506565], ["rp-404c ii", 6506561],
    ["rp-1200sw", 6535044], ["rp-1000sw", 6535045], ["rp-1400sw", 6535043], ["rp-1600sw", 6535046],
    // Polk
    ["es60", 6477933], ["es10", 6477928], ["r700", 6465718], ["r600", 6613895], ["r400", 6465719], ["r200", 6465726],
    // Bowers & Wilkins
    ["603 s3", 6551308], ["606 s3", 6553109], ["htm6 s3", 6554271], ["703 s3", 6517787], ["704 s3", 6517799], ["706 s3", 6517786], ["707 s3", 6517791], ["705 s3", 6517797], ["htm71 s3", 6517806], ["htm72 s3", 6517810],
    // MartinLogan
    ["motion xt f100", 6531287], ["motion xt f200", 6531263], ["motion xt c100", 6531266], ["motion xt b100", 6531277],
    ["motion foundation f2", 6548309], ["motion foundation f1", 6548326], ["motion foundation c1", 6548307],
    ["motion f20", 6531279], ["motion f10", 6531262], ["motion c10", 6531270],
    ["dynamo 800x", 6255495], ["dynamo 10,", 6587719], ["dynamo 12,", 6587721], ["dynamo 1000x", null], ["dynamo 600x", null],
    // SVS
    ["prime tower", 5707702], ["prime pinnacle", 6346721], ["prime center", 5707703], ["prime bookshelf", 5707736], ["prime satellite", 5707732], ["prime elevation", 5707717],
    ["ultra evolution tower", 6580394], ["sb-1000 pro", 6455214], ["sb-2000 pro", 6394990], ["sb-3000", 6668998],
    // DALI
    ["oberon 7", 6450885], ["oberon 5", 6528843], ["oberon 3", 6450909], ["oberon vokal", 6450887],
    // Definitive Technology
    ["dm70", 6532522], ["dm60", 6532524], ["dm40", 6532525], ["dm80", 6532832], ["dm90", 6532730], ["dm30", 6532526], ["dm20", 6532521], ["dm10", 6532523],
    // KEF
    ["q11 meta", 6590360], ["q7 meta", 6590361], ["q6 meta", 6590367], ["q3 meta", 6590373], ["q concerto", 6590363],
    ["r11 meta", 6534272], ["r7 meta", 6534452], ["r6 meta", 6534457], ["r5 meta", 6534463], ["r2 meta", 6534459], ["reference 5", 6502497],
    // ELAC
    ["df63", 12017502], ["df53", 12017495], ["db63", 10417108], ["dc63", 12219055],
    // Monitor Audio
    ["bronze 50", 13220761],
    // Sonance
    ["mag6r", 5852330], ["mag5.1 premium", 6401739], ["ms10sub", 6360974], ["impact i8", 6221808], ["impact i10", 6221819],
    ["vp62 lcr", 5683584], ["vp62 rectangle", 5683434], ["vp66r", 5683526], ["vp62r sst", 5683575],
    ["is6", 6444860], ["is8", 6444932],
    ["mx62", 6590101], ["mx52 sst", 6590114], ["mx52", 6590097],
    ["ua 2-125", 6635174], ["sb46l", 5683586], ["sb46-75", 6341798],
    // Yamaha
    ["ns-ic600", 2052555], ["ns-c210", 2877429], ["ns-ic400", 5607278], ["ns-iw480c", 8285884],
    // Sonos
    ["architectural in-ceiling", 6325620], ["architectural in-wall", 11446051], ["in-ceiling 8", 6635492], ["sonos amp", 6312857],
    // Receivers
    ["avr-s670h", 6551304], ["avr-s770h", 6551305], ["avr-x2800h", 6518172], ["avr-x3800h", 6518170], ["avr-x6800h", 6563194], ["dra-900h", 6561384],
    ["cinema 70s", 6522069], ["cinema 60", 6522070], ["cinema 50", 6522072], ["cinema 30", 6573671],
    ["tx-rz30", 6594911], ["vsx-lx805", 6562899],
  ].sort(function (a, b) { return b[0].length - a[0].length; }); // longest phrase wins

  function norm(s) { return String(s || "").toLowerCase().replace(/[“”"]/g, "").replace(/\s+/g, " "); }

  function skuFor(text) {
    const t = norm(text);
    for (let i = 0; i < SKU.length; i++) if (t.indexOf(SKU[i][0]) >= 0) return SKU[i][1]; // a null entry means "known, no photo"
    return null;
  }
  function imgUrl(sku) {
    const s = String(sku);
    return "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/" + s.slice(0, 4) + "/" + s + "_sd.jpg";
  }
  // Guess the silhouette from the model text.
  function kindFor(text, hint) {
    if (hint) return hint;
    const t = norm(text);
    if (/receiver|avr-|cinema \d|tx-rz|tx-nr|vsx-|str-dh|str-an|dra-/.test(t)) return "avr";
    if (/sonos amp|ua 2-125|amplifier/.test(t)) return "amp";
    if (/sub|sw\d|kube|kc62|dynamo|descend|hts |pb-|sb-1|sb-2|sb-3|ms10|impact i/.test(t) && !/sb46/.test(t)) return "sub";
    if (/in-ceiling|in-wall|invisible|ceiling|lcr|mag\d|vx\d|vp\d|is[68]|ic\d|iw\d|791/.test(t)) return "arch";
    if (/module|atmos|elevation|-sa |sa ii|es90|r900|240h|dm90|alteco|ss-cse|r8 meta|q8 meta|rp-500sa|r-40sa/.test(t)) return "module";
    if (/center|vokal|htm|c100|c1\b|c2\b|c10\b|dc53|dc63|r400|r50c|r-50c|es35|245c|ss-cs8|q6 meta|r6 meta|rp-504c|c444|c210|dm30/.test(t)) return "center";
    if (/tower|floor|f100|f200|f2\b|f1\b|f20|f10|\b60[3]\b|\b70[34]\b|r700|r600|es60|280f|260f|r-800f|r-600f|rp-8000|rp-6000|rp-5000|q7|q11|r7 meta|r11|r5 meta|oberon [57]|opticon [68]|dm70|dm60|ns-555|ns-f210|df63|df53|pinnacle|ss-cs3|prime tower|evolution tower/.test(t)) return "tower";
    if (/soundbar|sb46/.test(t)) return "bar";
    return "bookshelf";
  }
  // Drawn silhouettes, in the page's own colors.
  const SVG = {
    tower: "<svg viewBox='0 0 48 64' aria-hidden='true'><rect x='15' y='3' width='18' height='58' rx='2'/><circle cx='24' cy='12' r='3.2'/><circle cx='24' cy='26' r='5.5'/><circle cx='24' cy='42' r='5.5'/></svg>",
    bookshelf: "<svg viewBox='0 0 48 64' aria-hidden='true'><rect x='12' y='14' width='24' height='36' rx='2'/><circle cx='24' cy='24' r='3.4'/><circle cx='24' cy='38' r='6.5'/></svg>",
    center: "<svg viewBox='0 0 48 64' aria-hidden='true'><rect x='4' y='23' width='40' height='18' rx='2'/><circle cx='13' cy='32' r='5'/><circle cx='24' cy='32' r='3'/><circle cx='35' cy='32' r='5'/></svg>",
    arch: "<svg viewBox='0 0 48 64' aria-hidden='true'><circle cx='24' cy='32' r='19'/><circle cx='24' cy='32' r='13' class='in'/><circle cx='24' cy='32' r='4.5'/></svg>",
    sub: "<svg viewBox='0 0 48 64' aria-hidden='true'><rect x='7' y='15' width='34' height='34' rx='3'/><circle cx='24' cy='32' r='11'/><circle cx='24' cy='32' r='4' class='in'/></svg>",
    module: "<svg viewBox='0 0 48 64' aria-hidden='true'><path d='M8 44 L40 44 L40 28 L8 20 Z'/><circle cx='24' cy='34' r='5'/></svg>",
    avr: "<svg viewBox='0 0 48 64' aria-hidden='true'><rect x='3' y='22' width='42' height='20' rx='2'/><circle cx='36' cy='32' r='5'/><rect x='8' y='29' width='16' height='6' rx='1' class='in'/></svg>",
    amp: "<svg viewBox='0 0 48 64' aria-hidden='true'><rect x='6' y='24' width='36' height='16' rx='3'/><circle cx='34' cy='32' r='3.5'/><rect x='11' y='30' width='14' height='4' rx='1' class='in'/></svg>",
    bar: "<svg viewBox='0 0 48 64' aria-hidden='true'><rect x='3' y='27' width='42' height='10' rx='4'/><circle cx='11' cy='32' r='2.6'/><circle cx='24' cy='32' r='2.6'/><circle cx='37' cy='32' r='2.6'/></svg>",
    stand: "<svg viewBox='0 0 48 64' aria-hidden='true'><rect x='14' y='6' width='20' height='6' rx='1'/><rect x='22' y='12' width='4' height='40'/><rect x='10' y='52' width='28' height='5' rx='1'/></svg>",
  };
  // The photo that stands for a whole family (builder cards, guide rows).
  const LEAD = {
    "bw-700": "Bowers & Wilkins 703 S3 tower", "kef-r": "KEF R7 Meta tower", "ml-xt": "MartinLogan Motion XT F200 tower", "dali-opticon": "DALI Opticon 8 Mk2 tower",
    "svs-ultra": "SVS Ultra Evolution Tower", "kef-q": "KEF Q7 Meta tower", "bw-600": "Bowers & Wilkins 603 S3 tower", "ml-foundation": "MartinLogan Motion Foundation F2 tower",
    "klipsch-rp2": "Klipsch RP-8000F II tower", "polk-reserve": "Polk Audio R700 tower", "deftech-dym": "Definitive Technology DM70 tower", "dali-oberon": "DALI Oberon 7 tower",
    "sonance-vp": "Sonance VP62 LCR in-wall", "sonance-is": "Sonance IS8 invisible in-ceiling", "elac-debut": "ELAC Debut 3.0 DB63 bookshelf", "svs-prime": "SVS Prime Tower",
    "klipsch-ref": "Klipsch R-800F tower", "polk-es": "Polk Audio ES60 tower", "sonos-arch": "Sonos Architectural in-ceiling", "sonance-vx": "Sonance VX62 in-wall",
    "bose-791": "Bose Virtually Invisible 791 II in-ceiling", "russound": "Russound 6.5 in in-ceiling", "jbl-stage2": "JBL Stage 2 280F tower", "yamaha-ns": "Yamaha NS-555 tower",
    "sony-core": "Sony SS-CS3 tower", "sonance-mag": "Sonance MAG6R in-ceiling",
  };
  // One thumbnail: silhouette underneath, Best Buy photo on top when there is one; the photo removes itself if it fails.
  function thumb(text, hint, cls) {
    const kind = kindFor(text, hint);
    const sku = skuFor(text);
    const img = sku ? "<img src='" + imgUrl(sku) + "' alt='' loading='lazy' decoding='async' onerror='this.parentNode.classList.add(\"fb\");this.remove()'>" : "";
    return "<span class='thumb " + (sku ? "" : "fb ") + "k-" + kind + (cls ? " " + cls : "") + "'>" + (SVG[kind] || SVG.bookshelf) + img + "</span>";
  }
  // Best photo for a whole family: first model in the list that has a SKU.
  function familyThumb(brand, models, hint) {
    for (let i = 0; i < models.length; i++) { if (models[i] && skuFor(brand + " " + models[i])) return thumb(brand + " " + models[i], hint); }
    return thumb(brand + " " + (models[0] || ""), hint);
  }
  function lead(id, cls) { return thumb(LEAD[id] || "", null, cls); }
  window.SF_IMG = { skuFor: skuFor, imgUrl: imgUrl, kindFor: kindFor, thumb: thumb, familyThumb: familyThumb, lead: lead, LEAD: LEAD, SVG: SVG };
})();
