// Quality scores for every family, 1 to 5, judged on sound and engineering with price set aside.
// detail = clarity and refinement; bass = low-end weight without a sub; dyn = dynamics and how loud it goes on a normal receiver;
// imaging = how well it holds the picture off-axis; build = cabinet, finish and driver materials.
// form: box (towers and bookshelf) or arch (in-wall and in-ceiling). best: the jobs each family wins.
window.SF_QUAL = {
  "bw-700":        { detail: 5, bass: 4, dyn: 4, imaging: 4, build: 5, form: "box",  best: ["Music", "Reference rooms", "Finish"] },
  "kef-r":         { detail: 5, bass: 4, dyn: 4, imaging: 5, build: 5, form: "box",  best: ["Wide seating", "Music", "Imaging"] },
  "ml-xt":         { detail: 5, bass: 4, dyn: 5, imaging: 4, build: 4, form: "box",  best: ["Big rooms", "Movies", "Detail"] },
  "dali-opticon":  { detail: 4, bass: 4, dyn: 4, imaging: 4, build: 5, form: "box",  best: ["Music", "Warm sound", "Easy to drive"] },
  "svs-ultra":     { detail: 4, bass: 5, dyn: 5, imaging: 4, build: 4, form: "box",  best: ["Movies", "Bass", "Dynamics"] },
  "kef-q":         { detail: 4, bass: 3, dyn: 3, imaging: 5, build: 4, form: "box",  best: ["Wide seating", "Value", "Imaging"] },
  "bw-600":        { detail: 4, bass: 3, dyn: 3, imaging: 4, build: 4, form: "box",  best: ["Music", "Refinement"] },
  "ml-foundation": { detail: 4, bass: 3, dyn: 4, imaging: 3, build: 3, form: "box",  best: ["Value", "Movies", "Detail"] },
  "klipsch-rp2":   { detail: 3, bass: 4, dyn: 5, imaging: 3, build: 4, form: "box",  best: ["Movies", "Loud rooms", "Easy to drive"] },
  "polk-reserve":  { detail: 4, bass: 4, dyn: 4, imaging: 3, build: 4, form: "box",  best: ["Movies", "Balanced", "Long sessions"] },
  "deftech-dym":   { detail: 3, bass: 5, dyn: 4, imaging: 3, build: 4, form: "box",  best: ["Bass without a sub", "Movies"] },
  "dali-oberon":   { detail: 4, bass: 3, dyn: 3, imaging: 4, build: 4, form: "box",  best: ["Music", "Easy to drive", "Off-axis"] },
  "elac-debut":    { detail: 4, bass: 3, dyn: 3, imaging: 3, build: 3, form: "box",  best: ["Value", "Music", "First real system"] },
  "sonance-vp":    { detail: 4, bass: 3, dyn: 3, imaging: 3, build: 4, form: "arch", best: ["Hidden front stage", "Install jobs"] },
  "sonance-is":    { detail: 3, bass: 2, dyn: 2, imaging: 2, build: 5, form: "arch", best: ["Nothing showing", "Design rooms"] },
  "svs-prime":     { detail: 3, bass: 3, dyn: 4, imaging: 3, build: 3, form: "box",  best: ["Value", "Real height speaker"] },
  "klipsch-ref":   { detail: 2, bass: 3, dyn: 5, imaging: 2, build: 3, form: "box",  best: ["Loud on a budget", "Movies"] },
  "polk-es":       { detail: 3, bass: 3, dyn: 3, imaging: 3, build: 3, form: "box",  best: ["Complete budget family", "Forgiving"] },
  "sonos-arch":    { detail: 3, bass: 3, dyn: 3, imaging: 3, build: 4, form: "arch", best: ["Sonos Amp homes", "Trueplay tuning"] },
  "sonance-vx":    { detail: 3, bass: 3, dyn: 3, imaging: 2, build: 3, form: "arch", best: ["Hidden TV sound", "Secondary rooms"] },
  "jbl-stage2":    { detail: 3, bass: 3, dyn: 4, imaging: 3, build: 3, form: "box",  best: ["Cinema brand", "Entry price"] },
  "bose-791":      { detail: 3, bass: 2, dyn: 3, imaging: 3, build: 3, form: "arch", best: ["Bose households", "Stereo from one spot"] },
  "russound":      { detail: 3, bass: 2, dyn: 3, imaging: 2, build: 3, form: "arch", best: ["Whole-home audio", "Russound amps"] },
  "yamaha-ns":     { detail: 2, bass: 2, dyn: 3, imaging: 2, build: 3, form: "box",  best: ["Budget", "Reliability", "Cheap in-ceilings"] },
  "sony-core":     { detail: 2, bass: 2, dyn: 2, imaging: 2, build: 2, form: "box",  best: ["Lowest price", "Complete family"] },
  "sonance-mag":   { detail: 2, bass: 2, dyn: 3, imaging: 2, build: 3, form: "arch", best: ["Heights", "Surrounds", "$500 5.1"] },
};
window.SF_QUAL_KEYS = [["detail", "Detail"], ["bass", "Bass"], ["dyn", "Dynamics"], ["imaging", "Imaging"], ["build", "Build"]];
