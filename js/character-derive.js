/**
 * Character Derivation Engine — shared by characters.html and character-detail.html.
 *
 * Turns the raw story cast (KURAL_CHARACTERS[].characters, sourced from
 * all_stories_final.json) into full "deep detail" character profiles
 * (age, gender, body, personality, voice, AI prompts) deterministically —
 * same kural + same character index always produces the same profile,
 * with no backend and nothing checked in beyond the raw cast list.
 *
 * Also owns the character storage layer (localStorage) that used to live
 * in characters.js, so both pages share one copy.
 */

/* ===== STORAGE LAYER (moved from characters.js so both pages share it) ===== */
var CHAR_STORE_KEY = "thirukkural-character-store";

function loadCharStore() {
  try { return JSON.parse(localStorage.getItem(CHAR_STORE_KEY)) || {}; }
  catch (e) { return {}; }
}
function saveCharStore(store) {
  try { localStorage.setItem(CHAR_STORE_KEY, JSON.stringify(store)); } catch (e) {}
}
function saveChar(char) {
  var store = loadCharStore();
  char.modifiedAt = new Date().toISOString();
  if (!char.createdAt) char.createdAt = char.modifiedAt;
  if (!char.uuid) char.uuid = "char-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  store[char.id] = Object.assign({}, store[char.id] || {}, char);
  saveCharStore(store);
}
function deleteCharFromStore(id) {
  var store = loadCharStore();
  delete store[id];
  saveCharStore(store);
}

function defaultExtendedFields() {
  return {
    nickname: "", status: "Active", description: "",
    age: "", ageGroup: "", height: "", weight: "", bodyType: "", skinTone: "", faceShape: "",
    hairStyle: "", hairColor: "", eyeColor: "", facialHair: "", specialMarks: "",
    defaultCostume: "", footwear: "", accessories: "", jewelry: "", props: "", seasonalOutfit: "", festivalOutfit: "",
    traits: "", behaviour: "", emotionStyle: "", strengths: "", weaknesses: "", speakingStyle: "", walkingStyle: "",
    language: "Tamil", accent: "", voiceGender: "", voiceStyle: "", speakingSpeed: 1.0, pitch: 1.0, voiceEmotion: "Calm",
    masterPrompt: "", facePrompt: "", bodyPrompt: "", costumePrompt: "", expressionPrompt: "", posePrompt: "", negativePrompt: "", stylePrompt: "",
    frontView: "", sideView: "", backView: "", expressionSheet: "", poseSheet: "", costumeSheet: "",
    lockFace: false, lockHair: false, lockSkin: false, lockCostume: false, lockHeight: false, lockAccessories: false,
    videoWalkingStyle: "", handMovement: "", eyeMovement: "", smile: "", idlePose: "", animationStyle: "",
    voiceLock: false, emotionRange: "", defaultVoice: "", voiceReference: "",
    storiesUsed: [], scriptsUsed: [], scenesUsed: [], imagesGenerated: 0, videosGenerated: 0,
    relationships: { father: "", mother: "", teacher: "", friend: "", villain: "", animal: "", village: "", familyMembers: "" },
    versionHistory: [], createdAt: "", modifiedAt: "", version: 1, promptVersion: "v1.0", uuid: "",
    legacy: false, storyContext: null
  };
}

/* ===== AI PROMPT AUTO-GENERATION (moved from characters.js) ===== */
function autoGenCharPrompts(c) {
  var desc = c.description || c.name + " is a " + (c.role || "character") + " in " + (c.kuralId || "a Thirukkural story") + ".";
  c.masterPrompt = desc + " " + (c.gender || "") + " character, " + (c.age || "adult") + " years old. " +
    "Traditional Tamil setting. Cinematic lighting, 4K, highly detailed, professional portrait.";
  c.facePrompt = (c.faceShape || "oval") + " face, " + (c.skinTone || "warm brown") + " skin, " +
    (c.eyeColor || "dark brown") + " eyes, " + (c.hairStyle || "traditional") + " " + (c.hairColor || "black") + " hair. Detailed facial features, portrait lighting.";
  c.bodyPrompt = (c.bodyType || "average") + " build, " + (c.height || "average height") + ". " +
    (c.walkingStyle || "confident posture") + ". Full body shot, anatomically correct.";
  c.costumePrompt = (c.defaultCostume || "Traditional Tamil attire") + ". " +
    (c.accessories || "") + " " + (c.jewelry || "") + " Detailed fabric textures, culturally accurate.";
  c.expressionPrompt = (c.emotionStyle || "calm and serene") + " expression. " +
    "Natural micro-expressions, " + (c.behaviour || "composed") + " demeanor.";
  c.posePrompt = (c.pose || "standing naturally") + ". " + (c.walkingStyle || "Confident stance") + ". Full body pose reference.";
  c.negativePrompt = "deformed, blurry, bad anatomy, extra limbs, ugly, low quality, distorted face, watermark, text";
  c.stylePrompt = "Cinematic realism, golden hour lighting, Tamil cultural aesthetic, warm color palette, film grain, shallow depth of field";
  c.promptVersion = "v2.0";
  return c;
}

/* ===== NAME / AGE / ROLE PARSING =====
 * The raw cast strings in all_stories_final.json are inconsistently
 * formatted ("Kavitha (7)", "Karthik 10", "Teacher Meenakshi",
 * "His father Suresh", "சேகர் (14)", occasional malformed entries like
 * "1.5 NAME)"). This turns any of them into a clean {displayName, age,
 * role, relGender, relAgeBand} shape.
 */
// Relational nouns, keyed by lowercase single-token form (two-word phrases
// like "elder sister" are collapsed to one token before matching — see
// TWO_WORD_REL below). These are Tamil family terms ("Appa", "Paati"...)
// AND their English equivalents, since the raw cast data mixes both.
var RELATIONAL_SINGLE = {
  grandmother: { role: "grandmother", gender: "Female", ageBand: "Mature (50+)" },
  grandfather: { role: "grandfather", gender: "Male", ageBand: "Mature (50+)" },
  eldersister: { role: "elder sister", gender: "Female", ageBand: "Young (20-35)" },
  elderbrother: { role: "elder brother", gender: "Male", ageBand: "Young (20-35)" },
  youngersister: { role: "younger sister", gender: "Female", ageBand: "Teen (13-19)" },
  youngerbrother: { role: "younger brother", gender: "Male", ageBand: "Teen (13-19)" },
  mother: { role: "mother", gender: "Female", ageBand: "Middle (35-50)" },
  father: { role: "father", gender: "Male", ageBand: "Middle (35-50)" },
  sister: { role: "sister", gender: "Female", ageBand: "Young (20-35)" },
  brother: { role: "brother", gender: "Male", ageBand: "Young (20-35)" },
  son: { role: "son", gender: "Male", ageBand: "Teen (13-19)" },
  daughter: { role: "daughter", gender: "Female", ageBand: "Teen (13-19)" },
  appa: { role: "father", gender: "Male", ageBand: "Middle (35-50)" },
  amma: { role: "mother", gender: "Female", ageBand: "Middle (35-50)" },
  paati: { role: "grandmother", gender: "Female", ageBand: "Mature (50+)" },
  paatti: { role: "grandmother", gender: "Female", ageBand: "Mature (50+)" },
  thatha: { role: "grandfather", gender: "Male", ageBand: "Mature (50+)" },
  thaatha: { role: "grandfather", gender: "Male", ageBand: "Mature (50+)" },
  anna: { role: "elder brother", gender: "Male", ageBand: "Young (20-35)" },
  akka: { role: "elder sister", gender: "Female", ageBand: "Young (20-35)" },
  thambi: { role: "younger brother", gender: "Male", ageBand: "Teen (13-19)" },
  thangai: { role: "younger sister", gender: "Female", ageBand: "Teen (13-19)" },
  thangachi: { role: "younger sister", gender: "Female", ageBand: "Teen (13-19)" },
  mama: { role: "uncle", gender: "Male", ageBand: "Middle (35-50)" },
  mamu: { role: "uncle", gender: "Male", ageBand: "Middle (35-50)" },
  athai: { role: "aunt", gender: "Female", ageBand: "Middle (35-50)" },
  chithi: { role: "aunt", gender: "Female", ageBand: "Middle (35-50)" },
  uncle: { role: "uncle", gender: "Male", ageBand: "Middle (35-50)" },
  aunt: { role: "aunt", gender: "Female", ageBand: "Middle (35-50)" },
  aunty: { role: "aunt", gender: "Female", ageBand: "Middle (35-50)" },
  thaai: { role: "mother", gender: "Female", ageBand: "Middle (35-50)" },
  periyavar: { role: "elder", gender: "Male", ageBand: "Mature (50+)" }
};

// Collapsed before tokenizing so "elder sister Kavya" is treated as one
// relational token ("eldersister") + one name token ("Kavya").
var TWO_WORD_REL = [
  [/elder sister/gi, "eldersister"], [/elder brother/gi, "elderbrother"],
  [/younger sister/gi, "youngersister"], [/younger brother/gi, "youngerbrother"]
];

// Occupation/descriptor words — stripped and kept as `role`, but never
// treated as part of the person's name and never override a relational
// gender/age hint found elsewhere in the same string (e.g. "Farmer Appa").
var ROLE_WORDS = new Set(["teacher", "coach", "farmer", "doctor", "shopkeeper", "priest", "king", "queen",
  "headmaster", "principal", "counselor", "captain", "classmate", "cousin", "friend", "neighbour",
  "neighbor", "fisherman", "goldsmith", "potter", "vendor", "driver", "guard", "nurse", "owner",
  "bully", "rival", "bestie", "senior", "junior", "elder", "younger", "older", "village", "school", "class",
  "team", "music", "yoga", "temple", "street", "auto", "history", "science", "new", "old", "rich",
  "best", "shop", "classmates", "friends", "leader", "little", "cycle", "sparrow", "monitor", "art",
  "running", "gang", "serviceman", "officer"]);

// Generic role words that also carry a gender hint.
var GENDERED_ROLE_WORDS = { boy: "Male", girl: "Female", madam: "Female", miss: "Female", sir: "Male" };

var NAME_GENDER = {
  // female
  meena: "Female", divya: "Female", priya: "Female", deepa: "Female", kavya: "Female", pooja: "Female",
  selvi: "Female", gowri: "Female", meera: "Female", lakshmi: "Female", anitha: "Female", janani: "Female",
  ananya: "Female", chitra: "Female", nithya: "Female", harini: "Female", anjali: "Female", swetha: "Female",
  mala: "Female", meenakshi: "Female", rani: "Female", bhavani: "Female", pavithra: "Female", viji: "Female",
  latha: "Female", venba: "Female", vennila: "Female", swathi: "Female", nandini: "Female", raji: "Female",
  chinnu: "Female", lavanya: "Female", sneha: "Female", bhuvana: "Female", sruthi: "Female", sandhya: "Female",
  padma: "Female", sangeetha: "Female", nila: "Female", revathi: "Female", devi: "Female", muthulakshmi: "Female",
  kavitha: "Female", kamala: "Female", usha: "Female", priyanka: "Female", shruthi: "Female", lalitha: "Female",
  vanitha: "Female", rohini: "Female", esther: "Female", uma: "Female", anu: "Female", kokila: "Female",
  nandhini: "Female", mary: "Female", leela: "Female", dhanya: "Female", hema: "Female", jyothi: "Female",
  maya: "Female", renuka: "Female", keerthi: "Female", deepika: "Female", kani: "Female", pavi: "Female",
  gnanam: "Female", divyaa: "Female", indhu: "Female", kanna: "Female", tamil: "Female", amudha: "Female",
  geetha: "Female", pavitra: "Female", thenmozhi: "Female", nalini: "Female", sumathi: "Female",
  thulasi: "Female", aadhira: "Female", diya: "Female", chellam: "Female", karuna: "Female",
  // male
  arjun: "Male", karthik: "Male", mani: "Male", kumar: "Male", ravi: "Male", rajesh: "Male", muthu: "Male",
  kavin: "Male", bala: "Male", ganesh: "Male", selvam: "Male", suresh: "Male", murugan: "Male", karthi: "Male",
  balu: "Male", ramesh: "Male", kannan: "Male", vikram: "Male", sanjay: "Male", sekar: "Male", senthil: "Male",
  arul: "Male", vignesh: "Male", arun: "Male", saravanan: "Male", gowtham: "Male", vetri: "Male", dinesh: "Male",
  mano: "Male", velu: "Male", vasu: "Male", surya: "Male", kavi: "Male", vicky: "Male", murali: "Male",
  gopi: "Male", mahesh: "Male", rohan: "Male", deepak: "Male", vinoth: "Male", siva: "Male", venkat: "Male",
  manoj: "Male", ezhil: "Male", babu: "Male", jeeva: "Male", kiran: "Male", varun: "Male", srini: "Male",
  rohit: "Male", harish: "Male", suriya: "Male", aravind: "Male", vasanth: "Male", naveen: "Male", rajiv: "Male",
  pandi: "Male", deepan: "Male", rahul: "Male", prasanna: "Male", chezhiyan: "Male", arvind: "Male",
  bharath: "Male", hari: "Male", vimal: "Male", kumaresan: "Male", manikandan: "Male", anand: "Male",
  chinna: "Male", guna: "Male", dhruv: "Male", santhosh: "Male", rajan: "Male", chinnathambi: "Male",
  sundar: "Male", akash: "Male", siddharth: "Male", shiva: "Male", mari: "Male", perumal: "Male",
  rishi: "Male", mithran: "Male", kathiravan: "Male", sathish: "Male", vijay: "Male", raja: "Male",
  mariappan: "Male", chandru: "Male", raju: "Male", kathir: "Male", deva: "Male", somu: "Male",
  pappu: "Male", shankar: "Male", veera: "Male", karuppu: "Male", priyan: "Male", tharun: "Male",
  raja: "Male", anbu: "Male", velan: "Male", meenatchi: "Female",
  rajeshwari: "Female", சேகர்: "Male", மாரியப்பன்: "Male", சந்துரு: "Male",
  ரேணுகா: "Female", திவ்யா: "Female", ஞானம்: "Female"
};

function hashStr(str) {
  var h = 5381;
  for (var i = 0; i < str.length; i++) h = ((h * 33) ^ str.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

function seededRng(seed) {
  var s = seed >>> 0;
  return function () {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    var t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function pick(rng, arr) { return arr[Math.floor(rng() * arr.length) % arr.length]; }
function pickFew(rng, arr, n) {
  var pool = arr.slice(), out = [];
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  return out;
}

function parseCharacterString(raw) {
  var s = (raw || "").trim();
  // strip stray leading numerics/periods from malformed entries like "1.5 NAME)"
  s = s.replace(/^[\d.\s]+/, "");
  // balance stray trailing parens
  var opens = (s.match(/\(/g) || []).length, closes = (s.match(/\)/g) || []).length;
  while (closes > opens) { s = s.replace(/\)$/, ""); closes--; }

  var age = null;
  var m = s.match(/\((\d{1,3})\)/);
  if (m) { age = parseInt(m[1], 10); s = s.replace(m[0], ""); }
  else {
    m = s.match(/\b(\d{1,3})\s*$/);
    if (m) { age = parseInt(m[1], 10); s = s.replace(m[0], ""); }
  }
  s = s.replace(/[(),]/g, " ").replace(/\s+/g, " ").trim();
  s = s.replace(/^(His|Her|Their|My)\s+/i, "").trim();
  TWO_WORD_REL.forEach(function (p) { s = s.replace(p[0], p[1]); });

  // Classify every token: a relational noun (Appa/father/eldersister...)
  // sets gender/age/role hints; an occupation word sets `role` only; a
  // proper name is anything left over. A relational or role word is never
  // added to the name — but if EVERY token turns out to be relational/role
  // (e.g. the raw string was just "Appa", or "Farmer Appa"), the first
  // relational token IS the display name, kept verbatim (not translated
  // to English), since that's how it's referred to in the story/script.
  var tokens = s.split(/\s+/).filter(Boolean);
  var role = "", relGender = "", relAgeBand = "", relToken = "", nameTokens = [];
  tokens.forEach(function (tok) {
    var low = tok.toLowerCase();
    if (RELATIONAL_SINGLE[low]) {
      var hit = RELATIONAL_SINGLE[low];
      role = role || hit.role; relGender = relGender || hit.gender; relAgeBand = relAgeBand || hit.ageBand;
      relToken = relToken || tok;
      return;
    }
    if (ROLE_WORDS.has(low)) { role = role || low; return; }
    if (GENDERED_ROLE_WORDS[low]) { relGender = relGender || GENDERED_ROLE_WORDS[low]; role = role || low; return; }
    nameTokens.push(tok);
  });

  var displayName = nameTokens.length ? nameTokens.join(" ") :
    (relToken || (role ? role.replace(/\b\w/g, function (c) { return c.toUpperCase(); }) : (raw || "Character").trim()));
  var isTamil = /[஀-௿]/.test(displayName);
  return { raw: raw, displayName: displayName, age: age, role: role, relGender: relGender, relAgeBand: relAgeBand, isTamil: isTamil };
}

function guessGender(parsed) {
  if (parsed.relGender) return parsed.relGender;
  var key = parsed.displayName.toLowerCase().split(/\s+/)[0];
  if (NAME_GENDER[key]) return NAME_GENDER[key];
  if (NAME_GENDER[parsed.displayName]) return NAME_GENDER[parsed.displayName];
  if (!parsed.isTamil && /(a|i|ee|ya|dhi|ika|itha|priya)$/i.test(key)) return "Female";
  // last-resort deterministic fallback so the same name always resolves the same way
  return (hashStr(key) % 2 === 0) ? "Male" : "Female";
}

function ageBandFor(age, relAgeBand) {
  if (age != null) {
    if (age <= 12) return "Child (0-12)";
    if (age <= 19) return "Teen (13-19)";
    if (age <= 35) return "Young (20-35)";
    if (age <= 50) return "Middle (35-50)";
    return "Mature (50+)";
  }
  return relAgeBand || "Young (20-35)";
}

/* ===== DEEP ATTRIBUTE OPTION POOLS ===== */
var BODY_TYPE = { child: ["slight", "small-framed", "wiry", "lanky"], adult: ["lean", "average build", "stocky", "broad-shouldered", "slender", "athletic"] };
var HEIGHT_M = { child: ["3'8\"", "4'0\"", "4'4\"", "4'8\""], teen: ["5'0\"", "5'3\"", "5'6\""], adult: ["5'6\"", "5'8\"", "5'10\"", "5'11\""] };
var HEIGHT_F = { child: ["3'6\"", "3'10\"", "4'2\"", "4'6\""], teen: ["4'10\"", "5'0\"", "5'3\""], adult: ["5'0\"", "5'2\"", "5'4\"", "5'6\""] };
var SKIN_TONE = ["wheatish", "warm brown", "dusky", "fair-brown", "deep brown", "golden brown", "olive-tan"];
var FACE_SHAPE = ["oval", "round", "heart-shaped", "square", "long"];
var HAIR_STYLE_F = { child: ["two neat plaits", "short bob with a ribbon", "loose curls"], adult: ["long braid with jasmine", "neat bun", "shoulder-length wavy hair", "side plait"] };
var HAIR_STYLE_M = { child: ["short crop", "side-parted crop", "tousled short hair"], adult: ["short crop", "neat side-part", "slightly wavy short hair", "close-cropped"] };
var HAIR_COLOR = ["jet black", "black", "dark brown"];
var HAIR_COLOR_MATURE = ["salt-and-pepper grey", "silver-grey", "greying black"];
var EYE_COLOR = ["dark brown", "black", "warm hazel"];
var FACIAL_HAIR = ["clean-shaven", "light stubble", "trimmed moustache", "full moustache"];
var COSTUME_F = { child: ["cotton pavadai-chattai (half-saree set)", "printed cotton frock"], teen: ["salwar kameez", "school uniform with a pavadai"], adult: ["cotton saree with a contrast border", "simple salwar kameez", "silk-cotton saree for festival days"] };
var COSTUME_M = { child: ["shirt and shorts", "cotton kurta and pants"], teen: ["school uniform shirt and trousers", "t-shirt and jeans"], adult: ["veshti (dhoti) and shirt", "formal shirt and trousers", "cotton kurta"] };
var FOOTWEAR = ["simple rubber slippers", "bare feet at home", "leather sandals", "school shoes"];
var ACCESSORIES = ["a small cotton bag", "a wristwatch", "a pair of spectacles", "none, keeps it simple"];
var JEWELRY_F = ["gold studs and a thin chain", "jasmine flowers in her hair", "bangles and a small nose stud", "minimal — just earrings"];
var JEWELRY_M = ["a simple thread bracelet", "none", "a plain wristwatch"];
var TRAITS = ["curious", "warm-hearted", "stubborn in a lovable way", "quietly observant", "quick to laugh", "protective of family", "hardworking", "a little mischievous", "patient", "deeply respectful of elders", "soft-spoken", "determined"];
var BEHAVIOUR = ["listens more than he/she speaks", "asks a lot of 'why' questions", "leads by quiet example", "comforts others instinctively", "thinks before acting", "acts first, reflects later", "always ready to help a neighbour"];
var EMOTION_STYLE = ["calm and steady", "expressive and warm", "reserved but caring", "cheerful and animated", "gentle and reassuring", "earnest and sincere"];
var STRENGTHS = ["empathy", "patience", "practical wisdom", "loyalty", "resilience", "a sharp memory for stories", "a talent for making people feel at ease"];
var WEAKNESSES = ["a little impatient at times", "worries too much about small things", "can be stubborn once decided", "shy around strangers at first"];
var SPEAKING_STYLE = ["speaks in a soft Tamil-English mix", "uses proverbs naturally in conversation", "direct and to the point", "gentle, storytelling tone", "animated with lots of gestures"];
var WALKING_STYLE = ["brisk and purposeful", "unhurried, steady steps", "light on the feet, almost skipping", "measured, dignified pace"];
var VOICE_STYLE_F = ["warm and melodic", "soft-spoken", "clear and bright", "gentle with a musical lilt"];
var VOICE_STYLE_M = ["deep and steady", "warm baritone", "clear and measured", "gentle but firm"];
var VOICE_EMOTION = ["Calm", "Warm", "Serious", "Joyful", "Reverent", "Gentle", "Dramatic", "Inspiring"];

function ageKey(band) {
  if (band === "Child (0-12)") return "child";
  if (band === "Teen (13-19)") return "teen";
  return "adult";
}

function accentFor(location) {
  if (!location) return "Standard Tamil accent";
  var city = location.split(/[·\-–]/)[0].trim();
  return city ? "Tamil Nadu — " + city + " accent" : "Standard Tamil accent";
}

function emotionHintFrom(emotions) {
  if (!emotions) return null;
  var e = emotions.toLowerCase();
  if (e.indexOf("joy") >= 0 || e.indexOf("happ") >= 0) return "Joyful";
  if (e.indexOf("love") >= 0 || e.indexOf("family") >= 0) return "Warm";
  if (e.indexOf("fear") >= 0 || e.indexOf("suspicion") >= 0) return "Serious";
  if (e.indexOf("pride") >= 0 || e.indexOf("triumph") >= 0) return "Inspiring";
  if (e.indexOf("devotion") >= 0 || e.indexOf("reverence") >= 0) return "Reverent";
  return null;
}

/**
 * Deterministically derives a full deep-detail character profile from a raw
 * story-cast string. Same kuralNumber + index + name always produces the
 * same profile — no backend, nothing extra checked in.
 */
function deriveCharacterProfile(kuralNumber, index, rawStr, storyEntry) {
  var kuralIdStr = (typeof kuralId === "function") ? kuralId(kuralNumber) : "TK-" + String(kuralNumber).padStart(4, "0");
  var parsed = parseCharacterString(rawStr);
  var gender = guessGender(parsed);
  var band = ageBandFor(parsed.age, parsed.relAgeBand);
  var ak = ageKey(band);
  var seed = hashStr(kuralIdStr + ":" + index + ":" + parsed.displayName);
  var rng = seededRng(seed);

  var isFemale = gender === "Female";
  var heightPool = isFemale ? HEIGHT_F : HEIGHT_M;
  var hairPool = isFemale ? HAIR_STYLE_F : HAIR_STYLE_M;
  var costumePool = isFemale ? COSTUME_F : COSTUME_M;
  var hairColorPool = (band === "Mature (50+)") ? HAIR_COLOR_MATURE : HAIR_COLOR;

  var role = parsed.role ? parsed.role.replace(/\b\w/g, function (c) { return c.toUpperCase(); }) : (ak === "child" ? "Child" : "Character");
  var location = storyEntry.location || "";
  var emotionHint = emotionHintFrom(storyEntry.emotions);

  var c = Object.assign({}, defaultExtendedFields(), {
    id: kuralIdStr + "-c" + index,
    name: parsed.displayName,
    transliteration: "",
    gender: gender,
    role: role,
    consistency: "Story-derived (matches Kural DB, Story Library, Script Page)",
    kuralNumber: kuralNumber,
    kuralId: kuralIdStr,
    age: parsed.age != null ? String(parsed.age) : "",
    ageGroup: band,
    height: pick(rng, heightPool[ak] || heightPool.adult),
    weight: "",
    bodyType: pick(rng, BODY_TYPE[ak === "child" ? "child" : "adult"]),
    skinTone: pick(rng, SKIN_TONE),
    faceShape: pick(rng, FACE_SHAPE),
    hairStyle: pick(rng, hairPool[ak] || hairPool.adult),
    hairColor: pick(rng, hairColorPool),
    eyeColor: pick(rng, EYE_COLOR),
    facialHair: (!isFemale && ak !== "child") ? pick(rng, FACIAL_HAIR) : "",
    specialMarks: "",
    defaultCostume: pick(rng, costumePool[ak] || costumePool.adult),
    footwear: pick(rng, FOOTWEAR),
    accessories: pick(rng, ACCESSORIES),
    jewelry: isFemale ? pick(rng, JEWELRY_F) : pick(rng, JEWELRY_M),
    props: "",
    traits: pickFew(rng, TRAITS, 3).join(", "),
    behaviour: pick(rng, BEHAVIOUR),
    emotionStyle: emotionHint || pick(rng, EMOTION_STYLE),
    strengths: pickFew(rng, STRENGTHS, 2).join(", "),
    weaknesses: pick(rng, WEAKNESSES),
    speakingStyle: pick(rng, SPEAKING_STYLE),
    walkingStyle: pick(rng, WALKING_STYLE),
    language: parsed.isTamil ? "Tamil" : "Tamil",
    accent: accentFor(location),
    voiceGender: isFemale ? "Female" : "Male",
    voiceStyle: isFemale ? pick(rng, VOICE_STYLE_F) : pick(rng, VOICE_STYLE_M),
    speakingSpeed: (0.9 + Math.round(rng() * 3) / 10).toFixed(1),
    pitch: (0.85 + Math.round(rng() * 3) / 10).toFixed(1),
    voiceEmotion: emotionHint || pick(rng, VOICE_EMOTION),
    storyContext: {
      title: storyEntry.title || "", theme: storyEntry.theme || "", emotions: storyEntry.emotions || "",
      location: location, hook: storyEntry.hook || "", moral: storyEntry.moral || ""
    }
  });
  c.description = c.name + ", a " + (c.age ? c.age + "-year-old " : "") + c.gender.toLowerCase() + " " + c.role.toLowerCase() +
    (location ? " from " + location.split(/[·\-–]/)[0].trim() : "") + ", appears in “" + (storyEntry.title || c.kuralId) + "”.";
  autoGenCharPrompts(c);
  return c;
}

/* ===== KURAL -> CHARACTERS RESOLUTION (overrides characters-data.js) ===== */
function deriveKuralCharacters(kuralNumber) {
  if (typeof KURAL_CHARACTERS === "undefined") return [];
  var entry = KURAL_CHARACTERS[kuralNumber - 1];
  if (!entry || !entry.characters || !entry.characters.length) return [];
  return entry.characters.map(function (raw, i) { return deriveCharacterProfile(kuralNumber, i, raw, entry); });
}

function getKuralsWithCharacters() {
  if (typeof KURAL_CHARACTERS === "undefined") return [];
  return KURAL_CHARACTERS.map(function (e) { return e.n; });
}

function getCharactersForKural(kuralNumber) {
  return deriveKuralCharacters(kuralNumber);
}

function getTotalCharacterCount() {
  if (typeof KURAL_CHARACTERS === "undefined") return 0;
  var count = 0;
  KURAL_CHARACTERS.forEach(function (e) { count += (e.characters || []).length; });
  return count;
}

/* ===== 3D AVATAR PLACEHOLDER ===== */
function initialsOf(name) {
  var parts = (name || "?").trim().split(/\s+/);
  var s = parts[0] ? parts[0].charAt(0) : "?";
  if (parts.length > 1) s += parts[parts.length - 1].charAt(0);
  return s.toUpperCase();
}

/**
 * Builds an inline SVG "bust" placeholder avatar for a character face
 * (front/side/back). Used whenever no real reference image URL is set —
 * there is no image-generation backend in this static site, so this is
 * the default "3D" placeholder; a real reference photo/render can be
 * pasted into the front/side/back URL fields to replace it.
 */
function buildAvatarSVG(name, seed, face) {
  var hue = seed % 360;
  var hue2 = (hue + 45) % 360;
  var uid = "cdg" + seed + "_" + face;
  var skewX = face === "side" ? 18 : (face === "back" ? -6 : 0);
  var label = face === "back" ? "" : (typeof esc === "function" ? esc(initialsOf(name)) : initialsOf(name));
  return '<svg viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + face + ' view placeholder">' +
    '<defs><linearGradient id="' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0%" stop-color="hsl(' + hue + ',55%,32%)"/>' +
    '<stop offset="100%" stop-color="hsl(' + hue2 + ',60%,16%)"/>' +
    '</linearGradient></defs>' +
    '<rect width="240" height="320" fill="url(#' + uid + ')"/>' +
    '<g transform="skewX(' + skewX + ')" transform-origin="120 320">' +
    '<circle cx="120" cy="112" r="50" fill="rgba(255,255,255,0.14)"/>' +
    '<path d="M42 320 Q42 208 120 198 Q198 208 198 320 Z" fill="rgba(255,255,255,0.14)"/>' +
    '</g>' +
    (label ? '<text x="120" y="126" font-family="DM Sans, sans-serif" font-size="40" font-weight="700" fill="rgba(255,255,255,0.85)" text-anchor="middle" dominant-baseline="middle">' + label + '</text>' : '') +
    '</svg>';
}
