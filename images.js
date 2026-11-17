// Sound Finder product images.
// Best Buy serves a photo for every SKU at pisces.bbystatic.com; the folder is the SKU's first four digits.
// SF_SKU maps a model phrase (lower-case, matched as a substring of "brand model") to the Best Buy SKU.
// Anything not mapped, or any photo that fails to load, falls back to a drawn silhouette of the speaker type.
(function () {
  const SKU = [
    // Sony
    ["ss-cs3", 6634686], ["ss-cs5", 6634688], ["ss-cs8", 6634687], ["ss-cse", 6634689], ["ss-cs9", 5721005], ["str-dh590", 6187502],
    // JBL
    ["stage 2 280f", 6584082], ["stage 2 260f", 6584084], ["stage 2 250b", 6584066], ["stage 2 240b", 6584078], ["stage 2 245c", 6584064], ["stage 2 240h", 6584070], ["stage 2 220p", 6584089], ["stage 2 200p", 6584074],
    ["studio 680", 6547544], ["studio 698", 6547547], ["hdi3800", 6426038], ["hdi3600", 6426048],
    // Klipsch
    ["r-800f", 6501480], ["r-600f", 6501478], ["r-605fa", 11989371], ["r-50m", 6501482], ["r-50c", 12089636], ["r-40sa", 6501477], ["r-121sw", 6501481], ["r-101sw", 6501479],
    ["rp-8000f ii", 11634400], ["rp-8060fa ii", 6506573], ["rp-6000f ii", 6506581], ["rp-5000f ii", 6506574],
    ["rp-600m ii", 6506566], ["rp-500m ii", 6506578], ["rp-504c ii", 6506562], ["rp-500c ii", 6506565], ["rp-404c ii", 6506561], ["rp-502s ii", 6506579], ["rp-500sa ii", 6506567],
    ["rp-1200sw", 6535044], ["rp-1000sw", 6535045], ["rp-1400sw", 6535043], ["rp-1600sw", 6535046],
    ["cdt-5650-c ii", 6636745], ["cdt-5800-c ii", 5708524], ["cdt-2650-c ii", 1556883], ["r-5502-w ii", 6552294],
    // Polk
    ["es60", 6477933], ["es20", 6477927], ["es35", 6477935], ["es10", 6477928], ["r700", 6465718], ["r600", 6613895], ["r400", 6465719], ["r200", 6465726], ["r900", 6465723],
    ["hts 12", 6170709], ["hts 10", 6170705], ["mxt12", 6477906],
    ["265-rt", 4215141], ["265-ls", 4215104], ["70-rt", 4215133], ["90-rt", 4215111], ["rc6s", 3992911],
    // Bowers & Wilkins
    ["603 s3", 6551308], ["606 s3", 6553109], ["htm6 s3", 6554271], ["703 s3", 6517787], ["704 s3", 6517799], ["706 s3", 6517786], ["707 s3", 6517791], ["705 s3", 6517797], ["htm71 s3", 6517806], ["htm72 s3", 6517810],
    ["ccm362", 3527067], ["ci300 in-wall", 5160065], ["marine 6", 5711051], ["ccm664", 3526174], ["ccm665", 2155658], ["ccm663sr", 2155524], ["ccm663rd", 6404055], ["ccm662", 2155612], ["ccm632", 4595047],
    ["ccm684", 2156038], ["ccm683", 2165036], ["ccm682", 2156074], ["cwm664", 2165063], ["cwm652", 2156047],
    ["ccm7.5 s2", 6376573], ["ccm7.3 s2", 6376570], ["cwm7.5 s2", 6376597], ["cwm7.4 s2", 6376593], ["cwm7.3 s2", 6376591], ["cwm8.5d", 5799118],
    ["asw610", 6290723], ["asw608", 6290726], ["db4s", 6117900],
    // MartinLogan
    ["motion xt f100", 6531287], ["motion xt f200", 6531263], ["motion xt c100", 6531266], ["motion xt b100", 6531277],
    ["motion foundation f2", 6548309], ["motion foundation f1", 6548326], ["motion foundation c1", 6548307], ["motion foundation b2", 6548313],
    ["motion f20", 6531279], ["motion f10", 6531262], ["motion c10", 6531270],
    ["dynamo 800x", 6255495], ["dynamo 10,", 6587719], ["dynamo 12,", 6587721], ["dynamo 1100x", 6255497], ["dynamo 600x", 6255491],
    [" mc6-ht", 6457010], [" mc6", 6456997], [" mc8", 6457016], [" mc4", 6457008], [" mw6", 6457015], [" mw4lcr", 6457009],
    ["xtc8-ht", null], ["xtc8", 6457017], ["xtw6lcr", 6457006], ["xtw6", 6457019], ["xtw5lcr", 6457021],
    [" ic6", 6332276], [" ic8", 6333173], [" iw6", 6332277], [" iw5lcr", 6332275],
    ["helos 12", 9315064], ["helos 22", 9315143], ["icon 3xw", 6402428], ["tribute 5xw", 6402425], ["dynamo in-wall", 6552338],
    // SVS
    ["prime tower", 5707702], ["prime pinnacle", 6346721], ["prime center", 5707703], ["prime bookshelf", 5707736], ["prime satellite", 5707732], ["prime elevation", 5707717],
    ["ultra evolution tower", 6580394], ["ultra evolution bookshelf", 6580380], ["ultra evolution center", 6580388], ["ultra evolution nano", 6580386], ["ultra evolution elevation", 6580396],
    ["sb-1000 pro", 6455214], ["pb-1000 pro", 6455211], ["sb-2000 pro", 6394990], ["pb-2000 pro", 6394985], ["sb-3000", 6668998], ["pb-3000", 6315938],
    // REL
    ["t/7x", 6492838], ["t/9x", 6492847],
    // DALI
    ["oberon 7", 6450885], ["oberon 5", 6528843], ["oberon 3", 6450909], ["oberon vokal", 6450887],
    // Definitive Technology
    ["dm70", 6532522], ["dm60", 6532524], ["dm40", 6532525], ["dm80", 6532832], ["dm90", 6532730], ["dm30", 6532526], ["dm20", 6532521], ["dm10", 6532523],
    ["dc-65 pro si", 6563224], ["dc-65 pro", 6564542], ["dc-65 max", 6564545], ["dw-65 pro", 6563223], ["dw-80 pro", 6563220], ["dw-65 max", 6563216], ["dw max sur", 6563214],
    ["dc-80 max sur", 6563213], ["dc-80 max", 6563219], ["dc-80 pro", 6563221], ["dw-45 max", 6563222],
    ["di 6.5r", 5977373], ["di 6.5lcr", 5977415], ["lcr-65", 6563249], ["lcr-85", 6563251], ["lcr-525", 6563218],
    ["descend dn12", 6470268], ["descend dn10", 6467273],
    // KEF
    ["q11 meta", 6590360], ["q7 meta", 6590361], ["q6 meta", 6590367], ["q3 meta", 6590373], ["q8 meta", 6590375], ["q concerto", 6590363],
    ["r11 meta", 6534272], ["r7 meta", 6534452], ["r6 meta", 6534457], ["r5 meta", 6534463], ["r3 meta", 6534447], ["r2 meta", 6534459], ["r8 meta", 6534460], ["reference 5", 6502497],
    ["kube 10 mie", 6576945], ["kube 12 mie", 6576947], ["kube 15 mie", 6576950], ["kc62", 6450813],
    ["ci160qr", 6204540], ["ci160qs", 6204535], ["ci200qr", 6204542], ["ci160ql", 6204532], ["ci160rr-thx", 6413896], ["ci200rr-thx", 6382214], ["ci200rs-thx", 6382213],
    ["ci4100ql-thx", 6204534], ["ci3160rlm-thx", 6566992], ["ci5160rlm-thx", 6566972], ["ci3160rlb-thx", 6382205],
    ["ci160crds", 6830235], ["ci200.2cr", 6197964], ["ci130.2cs", 6197963], ["ci160es", 6474476], ["ci160.2cl", 6197977], ["ci160.2cs", 6197980], ["ci130qrfl", 6413898], ["ci130qsfl", 6422080], ["ci3120qlm", 6664631],
    // JBL architectural
    ["stage 280csa", 6528852], ["stage 260csa", 6528864], ["stage 280c", 6528859], ["stage 260c", 6528866], ["stage 260w", 6528853], ["stage 280w", 6528846], ["stage 250wl", 6528863],
    ["studio 6 6iw", 6552249], ["studio 6 8iw", 6528854], ["studio 6 66lcr", 6528861], ["studio 6 88lcr", 6528868], ["studio 6 theater", 6552212], ["conceal c86", 6549269],
    // Monitor Audio
    ["bronze 50", 13220761],
    // Sonance
    ["mag6r", 5852330], ["mag8r", 6342750], ["mag5.1r", 6196627], ["mag5.1 premium", 6401739], ["sstvaudio", 6408707], ["mago6sysv3", 6438662], ["mag6.1 landscape", 6440405], ["magrocks2.1", 6442556], ["ua 2-125 arc", 6635174], ["r-s202", 5037100], ["ms10sub", 6360974], ["vx62 6.5 in in-wall", 6575407], ["impact i8", 6221808], ["impact i10", 6221819], ["impact i12", 6254653], ["sb46m", 5683431],
    ["vp62 lcr", 5683584], ["vp62 rectangle", 5683434], ["vp66r", 5683526], ["vp62r sst", 5683575],
    ["vx62r tl sst", 6624214], ["vx62r tl", 6624217], ["vx62r sst", 6597099], ["vx62r", 6575405], ["vx82r", 6608189], ["vx60r", 6575410], ["vx64r", 6575412], ["vx66r sst", 6597103], ["vx66r tl", 6624216], ["vx66r", 6575408], ["vx62 lcr", 6597097], ["vx42", 6579697],
    ["is6", 6444860], ["is8", 6444932],
    ["mx62", 6590101], ["mx52 sst", 6590114], ["mx52", 6590097],
    ["ua 2-125", 6635174], ["sb46l", 5683586], ["sb46-75", 6341798],
    ["vpsub", 6253955], ["r12sub", 6253942], ["bps6 tl", 6552707], ["bps6", 5683415],
    // Yamaha
    ["ns-ic600", 2052555],
    // Bose
    ["791", 4664000],
    // Sonos
    ["architectural in-ceiling", 6325620], ["architectural in-wall", 11446051], ["in-ceiling 8", 6635492], ["in-ceiling 6 in", 6325620], ["sub (gen 3)", 6411140], ["sub mini", 6520132], ["sonos amp", 6312857],
    // Russound
    ["enhanced-performance in-ceiling", 10884916], ["all-purpose in-ceiling", 10884996],
    // Reference tier (Nov 15, 2026)
    ["803 d4", 6476396], ["804 d4", 6476369], ["805 d4", 6476384], ["db1d", 5796778], ["db3d", 5796780], ["ccm8.5 d", 5799119], ["cwm8.5 d", 5799118], ["cwm8.3 d", 5799117],
    ["702 s3 signature", 6579873], ["705 s3 signature", 6579872],
    ["reference 5 meta", 6502482], ["reference 3 meta", 6502484], ["reference 1 meta", 6502481], ["reference 4 meta", 6502506], ["reference 2 meta", 6502495], ["kc92", 6576949], ["reference 8b", 5838577],
    ["blade one meta", 6502467], ["blade two meta", 6502469], ["ls60", 6563191], ["ls50 meta", 6434268], ["ci5160refm-thx", 6539077],
    ["renaissance esl 15a", 5657348], ["expression esl 13a", 5657278], ["impression esl 11a", 5657303], ["illusion esl c34a", 5657280], ["focus esl c18", 5657353], ["electromotion esl x", 5194101], ["electromotion esl c", 5801801], ["depth 212", 6664661],
    ["av 10 processor", 6522068], ["amp 10", 6522067], ["model 10", 6600038], ["avr-a1h", 6518165], ["michi x5", 6572433], ["michi x3", 6557355], ["avr31", 6504706],
    ["pb17-ultra", 6603477], ["carbon special", 6646499], ["reference r2", 6253952], ["reference r1", 6253944], ["dione", 6505720],
    // Soundbars and their kits (Nov 15, 2026)
    ["hw-q990h", 6670431], ["hw-q930h", 6670433], ["theater trio", 6676688], ["ht-a9000", 6577855], ["ht-a8000", 6577858],
    ["rear 9 (sa-rs9)", 6673696], ["sub 9 (sa-sw9)", 6673694], ["rear 8 (sa-rs8)", 6629536], ["sub 8 (sa-sw8)", 6673697],
    ["s95ar", 6620448], ["s90tr", 6577957], ["q85h", 6580777],
    ["lifestyle ultra soundbar", 6667620], ["lifestyle ultra home speaker", 12624616], ["lifestyle ultra wireless subwoofer", 12646154],
    ["smart ultra soundbar", 12333037], ["bose surround speakers", 12333035], ["bass module 700", 6280563],
    ["arc ultra", 6597167], ["arc (gen 1)", 6411129], ["era 300", 6535189], ["sonos sub 4", 6597168],
    ["bar 1300mk2", 6643311], ["bar 1000mk2", 6643308],
    ["flexus core 300", 12186013], ["core 300 5.1.2", 12186013], ["flexus core 200", 6580304], ["flexus surr 200", 11519492], ["flexus sub 200", 12167989],
    ["ambeo soundbar max", 6401975], ["ambeo soundbar plus", 6520427], ["ambeo sub", 6520426],
    ["dragon 11.4.6", 10207946], ["shockwafe wireless", 10513210], ["true x bar 50a", 10110808],
    // REL, Rotel, Arcam (Nov 15, 2026)
    ["t/zero", 6492845], ["ht/1003", 6525869], ["t/5x", 6492848], ["ht/1205", 6525870], ["classic 98", 6563049], ["t/9x se", 6695022], ["classic 99", 6585797], ["ht/1510", 6526284], ["planar pl-1", 6680382], ["arrow wireless", 5714709], ["ht-air", 6560282],
    ["rotel a8", 6604502], ["a10 mkii", 6571776], ["a11 mkii", 6571771], ["a12 mkii", 6557356], ["a14 mkii", 6557360], ["s14 ", 6635556], ["ra-1572 mkii", 6557369], ["ra-1592 mkii", 6557371], ["rc-1572 mkii", 6557373], ["rc-1590 mkii", 6557375],
    ["rb-1552 mkii", 5708743], ["rb-1582 mkii", 5708736], ["rb-1590", 5708756], ["rmb-1555", 5708426], ["rmb-1585 mkii", 6571702], ["rmb-1587 mkii", 6571770], ["rmb-1506", 5708431], ["prestige x430", 6678050], ["michi s5", 6557361], ["michi m8", 6557394], ["cd11 mkii", 6571703],
    ["avr5 ", 6473960], ["avr11 ", 6504708], ["avr21 ", 6504707], ["ava15", 6679268], ["avp45", 6679207], ["pa240", 6391969], ["radia a5+", 12972876], ["radia a15+", 6642223], ["radia a25+", 6642221], ["sa30 ", 6391974], ["radia sa35", 6622110], ["radia sa45", 6622108], ["radia st5", 6577695], ["radia cd5", 6571276],
    // WiiM (Nov 15, 2026)
    ["wiim amp", 6684568], ["amp ultra", 6684569], ["b1 × wiim", 6596730], ["wiim ultra (streamer)", 6684567], ["wiim pro plus", 6685646], ["wiim pro (streamer)", 6684566], ["wiim mini", 6684570], ["wiim sound (speaker)", 6684943], ["wiim sound lite", 6684942],
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
    if (/receiver|avr-|cinema \d|tx-rz|tx-nr|vsx-|str-dh|str-an|dra-|av 10|model 10|michi|rotel|arcam|radia|integrated|preamplifier|power amplifier|processor/.test(t)) return "avr";
    if (/sonos amp|ua 2-125|amplifier|wiim amp|amp ultra|streamer/.test(t)) return "amp";
    if (/sub|sw\d|kube|kc62|kc92|dynamo|descend|depth 21|hts |pb-|pb17|sb-1|sb-2|sb-3|ms10|impact i|bps6|db[13]d|reference 8b|carbon special|\bt\/\d|t\/zero|ht\/1|classic 9[89]|planar pl/.test(t) && !/sb46/.test(t)) return "sub";
    if (/in-ceiling|in-wall|invisible|ceiling|lcr|mag\d|vx\d|vp\d|is[68]|ic\d|iw\d|791|cdt-|r-\d{4}-[wc]|-rt\b|-ls\b|rc6s|\bci\d|ccm|cwm|\bmc[468]|\bmw[46]|xtc8|xtw[56]|dc-\d|dw-\d|dw max|di \d|lcr-|helos|3xw|5xw|csa\b|2[68]0c\b|\d{3}w\b|\d{3}wl\b|\diw\b|studio 6|conceal|marine 6|i[cw]-d|installer/.test(t)) return "arch";
    if (/module|atmos|elevation|-sa |sa ii|es90|r900|240h|dm90|alteco|ss-cse|r8 meta|q8 meta|rp-500sa|r-40sa/.test(t)) return "module";
    if (/center|vokal|htm|c100|c1\b|c2\b|c10\b|dc53|dc63|r400|r50c|r-50c|es35|245c|ss-cs8|q6 meta|r6 meta|rp-504c|c444|c210|dm30|reference [24] meta|c34a|c18\b|esl c\b/.test(t)) return "center";
    if (/tower|floor|f100|f200|f2\b|f1\b|f20|f10|\b60[3]\b|\b70[34]\b|r700|r600|es60|280f|260f|r-800f|r-600f|rp-8000|rp-6000|rp-5000|q7|q11|r7 meta|r11|r5 meta|oberon [57]|opticon [68]|dm70|dm60|ns-555|ns-f210|df63|df53|pinnacle|ss-cs3|prime tower|evolution tower|80[34] d4|reference [35] meta|blade|esl 1[135]a|esl x\b|ls60/.test(t)) return "tower";
    if (/soundbar|sb46|hw-q9|theater trio|ht-a[89]0|s95ar|s90tr|q85h|arc ultra|arc \(gen|bar 1[03]00|flexus core|core 300|ambeo soundbar|dragon|shockwafe|true x bar|dione/.test(t)) return "bar";
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
    "sonance-vp": "Sonance VP62 LCR in-wall", "sonance-is": "Sonance IS8 invisible in-ceiling", "svs-prime": "SVS Prime Tower",
    "klipsch-ref": "Klipsch R-800F tower", "polk-es": "Polk Audio ES60 tower", "sonos-arch": "Sonos Architectural in-ceiling", "sonance-vx": "Sonance VX62 in-wall",
    "bose-791": "Bose Virtually Invisible 791 II in-ceiling", "russound": "Russound 6.5 in in-ceiling", "jbl-stage2": "JBL Stage 2 280F tower", "sony-core": "Sony SS-CS3 tower", "sonance-mag": "Sonance MAG6R in-ceiling",
    "klipsch-ci": "Klipsch R-5502-W II in-wall", "polk-ci": "Polk Audio 265-RT in-wall", "deftech-ci": "Definitive Technology DC-65 MAX in-ceiling", "ml-ci": "MartinLogan Motion CI MC6-HT in-ceiling",
    "kef-ci": "KEF Ci160QR in-ceiling", "jbl-ci": "JBL Stage 250WL in-wall", "ml-xtci": "MartinLogan Motion XT CI XTW6 in-wall", "bw-ci600": "Bowers & Wilkins CCM664 in-ceiling", "bw-ci700": "Bowers & Wilkins CCM7.5 S2 in-ceiling",
    "bw-800": "Bowers & Wilkins 803 D4 tower", "kef-reference": "KEF Reference 5 Meta tower", "kef-blade": "KEF Blade One Meta tower", "ml-esl": "MartinLogan Renaissance ESL 15A tower",
    "bw-ci800": "Bowers & Wilkins CCM8.5 D in-ceiling", "kef-ci-ref": "KEF Ci5160REFM-THX in-wall", "ml-ci-ref": "MartinLogan Tribute 5XW in-wall", "sonance-ref": "Sonance Reference R2 in-wall",
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
