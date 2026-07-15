/**
 * Script Module V2 (MVP Prototype) - Scene-based Script Data
 * Scope: TK-0001 to TK-0010 ONLY
 *
 * Pipeline: Kural -> Story -> SCRIPT (this module) -> Character/Image/Video Library
 *
 * No backend. No database. No API. Data lives in memory, generated
 * deterministically from the approved story content, with edits
 * persisted to localStorage so the prototype survives a page reload.
 */

// In the browser, autoGenCharacterPrompt/autoGenBackgroundPrompt/autoGenLightingPrompt/
// autoGenMusicPrompt come from js/shared-prompts.js loaded earlier via <script> (classic
// scripts share one global scope). In Node (studio-server.js requiring this file directly),
// there's no shared scope, so pull them in explicitly.
if (typeof require !== "undefined" && typeof module !== "undefined") {
  var __sharedPrompts = require("./shared-prompts.js");
  var STUDIO_STYLE = __sharedPrompts.STUDIO_STYLE;
  var autoGenCharacterPrompt = __sharedPrompts.autoGenCharacterPrompt;
  var autoGenBackgroundPrompt = __sharedPrompts.autoGenBackgroundPrompt;
  var autoGenLightingPrompt = __sharedPrompts.autoGenLightingPrompt;
  var autoGenMusicPrompt = __sharedPrompts.autoGenMusicPrompt;
}

// ===== MVP SCOPE =====
const MVP_KURAL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// ===== HARDCODED DROPDOWN VALUES (MVP - no libraries yet) =====
const LOCATION_OPTIONS = ["Temple", "Village", "School", "House", "Market", "Forest", "River"];
const EMOTION_OPTIONS = ["Happy", "Sad", "Fear", "Hope", "Curious", "Proud"];
const CAMERA_OPTIONS = ["Wide Shot", "Close Up", "Medium", "Top View", "POV", "Zoom", "Pan", "Tracking"];
const TRANSITION_OPTIONS = ["Cut", "Fade", "Dissolve"];
const MUSIC_OPTIONS = ["Peaceful", "Emotional", "Spiritual", "Adventure", "Comedy"];
const SFX_OPTIONS = ["Birds", "Rain", "Temple Bell", "Wind", "Footsteps", "Children"];

// TODO(Phase 2A-D): Replace hardcoded dropdowns with live Character/Location/Music/Props/Camera library lookups.

// ===== SOURCE STORY CONTENT (TK-0001 - TK-0010, trimmed from all_stories_final.json) =====
const SCRIPT_SOURCE_STORIES = [
  {
    id: "TK-0001", kuralNumber: 1,
    title: "அஜோ! கூரையிலிருந்து ஆரம்பிக்கலாமா?",
    theme: "Faith & Beginnings",
    characters: ["Kavitha (7)", "Appa"],
    location: "Madurai · A home under construction",
    hook: "A half-built house. A little girl picks up the roof tile and tries to balance it in the air. It crashes. She stares.",
    story: "Appa and Kavitha are building a small clay-brick model of their dream home in the courtyard. Kavitha excitedly grabs the roof piece first. As the little house grows solid, Kavitha looks at the strong foundation with wonder.",
    tamilDialogues: [
      "Kavitha: 'Appa, கூரையிலிருந்து ஆரம்பிக்கலாமா?'",
      "Appa: 'அப்படி வைச்சா முழு வீடும் விழுந்துடும், கண்ணு.'",
      "Kavitha: 'அதனால foundation முக்கியமா?'",
      "Appa: 'உலகம் முழுக்க அப்படித்தான். எல்லாத்துக்கும் ஒரு முதல் இருக்கு.'"
    ],
    thiruvalluvarAppears: "Time slows. A warm golden light fills the courtyard. Thiruvalluvar walks in quietly, smiles at the little clay house, and kneels beside the foundation stones.",
    thiruvalluvarExplanation: "பாரு கண்ணு — எழுத்துக்கள் எல்லாம் அ-வில் தொடங்குது. அதுபோலவே உலகம் முழுக்க ஒரு முதல் காரணம் இருக்கு — ஆதி பகவன். அவரே எல்லாத்தோட அடிப்படை.",
    thirukkural: "அகர முதல எழுத்தெல்லாம் ஆதி பகவன் முதற்றே உலகு.",
    englishTranslation: "As 'A' is the first of all letters, so is God the first cause of the world.",
    moral: "Everything needs a foundation — God is the foundation of the universe."
  },
  {
    id: "TK-0002", kuralNumber: 2,
    title: "98 மார்க்கும் வெற்றிடமா?",
    theme: "Purpose of Learning",
    characters: ["Arjun (12)", "Teacher Meenakshi"],
    location: "Trichy · Government school",
    hook: "A boy stares at his report card. 98 marks. But his face is empty. His hands tremble.",
    story: "Arjun scores 98 in Maths but can't fix a punctured tyre or cook rice when Amma is sick. Teacher Meenakshi sits beside him. That evening, Arjun uses his maths to help a farmer calculate crop costs, and smiles for the first time that day.",
    tamilDialogues: [
      "Arjun: 'Teacher, 98 மார்க் வாங்கியும் ஒன்னும் தெரியல.'",
      "Teacher: 'கற்றதனால் ஆய பயன் கையால் எடுக்க முடியாத பயன்.'",
      "Arjun: 'அப்படின்னா என்ன அர்த்தம்?'",
      "Teacher: 'உன் அறிவு உனக்கு மட்டும் சொந்தம் இல்ல. உலகத்துக்கு உதவணும்.'"
    ],
    thiruvalluvarAppears: "As Arjun helps the farmer, a warm breeze blows. Thiruvalluvar appears under the neem tree, his eyes gentle with approval.",
    thiruvalluvarExplanation: "கற்றதனால் ஆய பயன் கையால் எடுக்க முடியாத பயன். படிப்பு என்பது வெறும் மார்க் அல்ல. வாழ்க்கையை மாற்றும் ஆற்றல்.",
    thirukkural: "கற்றதனால் ஆய பயன் கையால் எடுக்க முடியாத பயன்.",
    englishTranslation: "The benefit of learning is a benefit that cannot be taken away by hand.",
    moral: "True learning is not marks — it is the power to change lives."
  },
  {
    id: "TK-0003", kuralNumber: 3,
    title: "பூவாய் மலர்ந்த மனசு",
    theme: "Living a Good Life",
    characters: ["Meena (8)", "Paati (65)"],
    location: "Kumbakonam · Temple street at dawn",
    hook: "A little girl watches her grandmother put a single flower on a stone statue.",
    story: "Every morning, Paati places a fresh jasmine on the old temple statue. Meena follows, curious, and picks a flower from their garden to place beside Paati's.",
    tamilDialogues: [
      "Meena: 'Paati, சிலைக்கு பூ வைச்சா என்ன ஆகும்?'",
      "Paati: 'தெரியாம இருந்தாலும் சரி. நல்லது செய்ய யாரும் பார்க்கணும்னு இல்ல.'",
      "Meena: 'இதுவும் அப்படித்தானா?'",
      "Paati: 'நல்ல வாழ்க்கை வாழ்றது இதுதான் — சின்ன சின்ன நல்ல காரியங்கள் தினமும் செய்யறது.'"
    ],
    thiruvalluvarAppears: "The morning sun casts a golden glow. Thiruvalluvar stands near the temple steps, watching the two flowers on the statue.",
    thiruvalluvarExplanation: "அறம் என்பது பெரிய காரியம் அல்ல. தினமும் செய்யும் சின்ன நல்ல செயல்களே அறம். அதுவே வாழ்க்கையை அழகாக்கும்.",
    thirukkural: "அறத்தாறு இதுவன்னோ உலகம் புரந்தார் புரிந்த வினையால் காண்.",
    englishTranslation: "Is there a path of virtue? See it through the deeds of those who sustained the world.",
    moral: "A good life is built with small daily acts of kindness."
  },
  {
    id: "TK-0004", kuralNumber: 4,
    title: "பேராசை பிடிச்ச பையன்",
    theme: "Freedom from Suffering",
    characters: ["Senthil (10)", "Thatha (70)"],
    location: "Coimbatore · Home",
    hook: "A boy fills his pockets with mangoes from the tree. So many that his pocket tears.",
    story: "Senthil picks mango after mango from Thatha's tree until his pocket rips and they all roll away. Thatha explains that desire, once excessive, brings only sorrow.",
    tamilDialogues: [
      "Senthil: 'Thatha, இந்த மாங்காய் எல்லாம் எனக்கு வேணும்!'",
      "Thatha: 'ஒன்னு எடுத்தா போதும்னு தெரியலையா?'",
      "Senthil: 'ஆசை அதிகமானதும் சுகம் குறைஞ்சுது.'",
      "Thatha: 'ஆசை இல்லாதவன் துன்பம் இல்லாதவன்.'"
    ],
    thiruvalluvarAppears: "As the last mango rolls away, a gentle wind blows. Thiruvalluvar appears at the garden gate, his face calm and wise.",
    thiruvalluvarExplanation: "ஆசை என்பது தீ போன்றது. அது சிறிதாக இருக்கும்போது சுவை. அதிகமானால் எல்லாத்தையும் எரிக்கும். ஆசை இல்லாதவன் துன்பம் இல்லாதவன்.",
    thirukkural: "ஆசை இல்லாதவன் துன்பம் இல்லாதவன்.",
    englishTranslation: "He who has no desire is free from suffering.",
    moral: "Greed takes away what you already have."
  },
  {
    id: "TK-0005", kuralNumber: 5,
    title: "இரண்டு விதைகள்",
    theme: "Praise of God",
    characters: ["Rajan (11)", "Farmer Appa"],
    location: "Thanjavur · Paddy farm",
    hook: "Two seeds. One planted in soil. One kept in a glass jar. After a week, one has roots, the other is lifeless.",
    story: "Rajan and Appa plant one seed in the mud and keep one in a jar. A week later the field seed has sprouted green while the jar seed stays dry. Rajan learns that rain, sun, soil, and God all work together for life to grow.",
    tamilDialogues: [
      "Rajan: 'Appa, ஏன் ஒன்ன மண்ணில வைக்கல?'",
      "Appa: 'மண்ணில் வைச்சா மழை வரும், வேர் விடும். ஜாரில் வைச்சா ஒன்னும் ஆகாது.'",
      "Rajan: 'இதுக்கு யாரு காரணம்?'",
      "Appa: 'மழை. வெயில். மண். கடவுள்.'"
    ],
    thiruvalluvarAppears: "The paddy field glows with morning light. Thiruvalluvar appears between the rows of green, his feet bare on the wet earth.",
    thiruvalluvarExplanation: "இருள்சேர் இருவினையும் சேரா — இறைவனை உண்மையாகப் புகழ்பவர் நன்மை தீமை ஆகிய இரண்டின் பிடியிலும் சிக்கமாட்டார். அவர் இரண்டுக்கும் அப்பாற்பட்டவர்.",
    thirukkural: "இருள்சேர் இருவினையும் சேரா இறைவன் பொருள்சேர் புகழ்புரிந்தார் மாட்டு.",
    englishTranslation: "God's praise who tell, are free from right and wrong, the twins of dreaming night.",
    moral: "Those who truly praise God are untouched by both good and bad deeds."
  },
  {
    id: "TK-0006", kuralNumber: 6,
    title: "ஐந்து புலன்கள் மேல் சண்டை",
    theme: "Self-Control / Mastering the Senses",
    characters: ["Gopi (8)", "Amma"],
    location: "Chennai · Kapaleeshwarar Temple courtyard",
    hook: "Gopi wants every toy, every sweet, every shiny thing — until a quiet temple teaches him stillness.",
    story: "Gopi cries for toys and sweets in the market. Amma takes him into the temple instead and asks him to sit still. Slowly his body calms, and he discovers he doesn't need everything to be happy.",
    tamilDialogues: [
      "Gopi: 'அம்மா அந்த பொம்மை வேணும்! இந்த மிட்டாய் வேணும்! கொடுக்கலையா?'",
      "Amma: 'எல்லாம் வேணும்னு கத்தினா எதுவும் கிடைக்காது. ஒரு நிமிஷம் சும்மா இரு.'",
      "Gopi: 'அம்மா... நிஜமாவே அமைதியா இருந்துட்டேன்!'",
      "Amma: 'சரி, இப்ப சொல்லு. இந்த மிட்டாய் இல்லாம உனக்கு ஒன்னும் ஆகலையே?'"
    ],
    thiruvalluvarAppears: "The bronze lamp in the sanctum flickers. Thiruvalluvar steps out of the crowd, carrying a small oil lamp. He sits beside Gopi and nods at his stillness.",
    thiruvalluvarExplanation: "ஐந்து புலன்களையும் — கண், காது, மூக்கு, நாக்கு, உடல் — அடக்கினவன் பொய் இல்லாத வழியில் நிற்பான். பொறிவாயில் ஐந்தவித்தான் நீடு வாழ்வான்.",
    thirukkural: "பொறிவாயில் ஐந்தவித்தான் பொய்தீர் ஒழுக்க நெறிநின்றார் நீடுவாழ் வார்.",
    englishTranslation: "They prosper long who walk His way Who has the senses signed away",
    moral: "True happiness comes not from getting everything, but from mastering your desires."
  },
  {
    id: "TK-0007", kuralNumber: 7,
    title: "கவலை மரத்தின் கீழே",
    theme: "God as the Only Solace / Faith Overcomes Anxiety",
    characters: ["Pooja (12)", "Teacher Rajeshwari"],
    location: "Salem · Government High School · Banyan tree",
    hook: "Pooja can't sleep, can't eat, can't focus — anxious about everything, until a teacher shows her a place to put her worry.",
    story: "Pooja sits under a banyan tree, overwhelmed with worry about exams, her father's health, and unpaid bills. Teacher Rajeshwari tells her that faith in God can calm the deepest anxiety. That night Pooja prays and sleeps peacefully for the first time in weeks.",
    tamilDialogues: [
      "Pooja: 'எனக்கு எப்பவும் பயமா இருக்கு, Miss. ஒரு நிமிஷம் கூட சந்தோஷமா இல்ல.'",
      "Teacher: 'கவலைங்கிறது பெரிய அலை மாதிரி. நீ நீந்த முடியாது. ஆனா ஒரு படகு இருக்கு — இறைவன்.'",
      "Pooja: 'அவர் என்னைப் பார்த்துப்பாரா?'",
      "Teacher: 'தனக்கு இணையே இல்லாதவன் அவன். அவன் பாதம் சேர்ந்தவங்களுக்கு மனக்கவலை இல்ல.'"
    ],
    thiruvalluvarAppears: "A soft golden light filters through the banyan leaves. Thiruvalluvar stands near the tree root, holding a palm-leaf manuscript.",
    thiruvalluvarExplanation: "கவலை மனசை அரிச்சுடும். ஆனா தனக்கு சமமானவர் யாருமில்லாத இறைவன் பாதம் சேர்ந்தவங்க — அவங்க மனசை கவலை மாத்த முடியாது.",
    thirukkural: "தனக்குவமை இல்லாதான் தாள்சேர்ந்தார்க் கல்லால் மனக்கவலை மாற்றல் அரிது.",
    englishTranslation: "His feet, whose likeness none can find, Alone can ease the anxious mind",
    moral: "When worry overwhelms you, faith in God can calm the deepest anxiety."
  },
  {
    id: "TK-0008", kuralNumber: 8,
    title: "கடலைத் தாண்டும் பயம்",
    theme: "Virtue as a Ship / Crossing Life's Ocean",
    characters: ["Selvi (10)", "Appa"],
    location: "Rameswaram · Pamban Bridge shore",
    hook: "Selvi stares at the roaring sea, terrified, dreaming of becoming a fisherwoman like Appa.",
    story: "Selvi is afraid of the crashing waves. Appa tells her of an even bigger ocean — the ocean of life — and how virtue is the one ship that can carry anyone across it.",
    tamilDialogues: [
      "Selvi: 'Appa, இந்த கடல்ல எப்படி மீன் பிடிப்பீங்க? எனக்கு பயமா இருக்கு!'",
      "Appa: 'பயம் சரிதான். அதை விட பெரிய ஒரு கடல் இருக்கு — உயிர் வாழ்க்கைங்கிற கடல்.'",
      "Selvi: 'அதுல எப்படி நீந்தறது?'",
      "Appa: 'அறம்னு ஒரு கப்பல் இருக்கு. அறவாழி அந்தணன் பாதம் பிடிச்சா, அந்த கப்பல்ல நீந்திடலாம்.'"
    ],
    thiruvalluvarAppears: "The waves suddenly calm. A boat glides in with no rower. Thiruvalluvar steps out, his feet touching the wet sand.",
    thiruvalluvarExplanation: "அறமே பெரிய கடல். அந்த அறவாழி அந்தணன் பாதத்தை சேர்ந்தவனால் மட்டுமே பிறவாழி — இந்த பிறவி கடலை — தாண்ட முடியும்.",
    thirukkural: "அறவாழி அந்தணன் தாள்சேர்ந்தார்க் கல்லால் பிறவாழி நீந்தல் அரிது.",
    englishTranslation: "Who swims the sea of vice is he Who clasps the feet of Virtue's sea",
    moral: "Like a boat crosses the ocean, virtue carries you across life's difficulties."
  },
  {
    id: "TK-0009", kuralNumber: 9,
    title: "தலை கனக்குது",
    theme: "Humility Before the Divine",
    characters: ["Murugan (9)", "Periyavar (village elder)"],
    location: "Kanchipuram · Silk weaving street · Ekambareswarar Temple",
    hook: "Murugan thinks he's the smartest kid in Kanchipuram and refuses to bow to anyone — until an elder teaches him what an unbowed head is worth.",
    story: "Murugan walks with his nose in the air, refusing to touch elders' feet or bow in the temple. Periyavar compares his pride to an instrument with no music in it. That evening, Murugan bows in the temple for the first time and feels, for once, genuinely humble.",
    tamilDialogues: [
      "Murugan: 'நான் காஞ்சிபுரத்துலயே பெரிய அறிஞன்! எனக்கு யாரும் பெரியவன் இல்ல!'",
      "Periyavar: 'கோளில் பொறியின் குணமிலவே — கேட்காத இசைக்கருவி மாதிரி ஆயிட்டே.'",
      "Murugan: 'அப்படின்னா?'",
      "Periyavar: 'தலை வணங்காம போனா, அது எவ்வளவு கற்றாலும் வீண்.'"
    ],
    thiruvalluvarAppears: "The temple lamps glow brighter. Thiruvalluvar walks through the thousand-pillared hall and stands behind young Murugan, placing a gentle hand on his bowed head.",
    thiruvalluvarExplanation: "காது கேளாத இசைக்கருவி எந்த பயனும் இல்லாதது மாதிரி — எண்குணத்தானை வணங்காத தலையும் எந்த பயனும் இல்லை. தலை வணங்குனா தான் அறிவு பெருகும்.",
    thirukkural: "கோளில் பொறியின் குணமிலவே எண்குணத்தான் தாளை வணங்காத் தலை.",
    englishTranslation: "Like senses stale that head is vain Which bows not to Eight-Virtued Divine",
    moral: "Pride makes you useless; humility before God gives life meaning."
  },
  {
    id: "TK-0010", kuralNumber: 10,
    title: "காட்டுக்குள்ள ஒரு வழி",
    theme: "Surrender to God / Crossing the Sea of Birth",
    characters: ["Anbu (11)", "Thatha"],
    location: "Kodaikanal · Dense forest path near Bear Shola Falls",
    hook: "Anbu gets lost chasing a butterfly deep into the forest. Alone and terrified, he remembers Thatha's words.",
    story: "Anbu wanders off the path following a butterfly and finds himself lost among tall trees and dark shadows. He remembers Thatha telling him to hold on to God in fear, prays with all his heart, and is found by a forest guard's whistle soon after.",
    tamilDialogues: [
      "Anbu: 'தாத்தா, நான் காட்டுக்குள்ள கெட்டுட்டேன்! எனக்கு பயமா இருக்கு!'",
      "Thatha: 'நீ இறைவன்கிட்ட பேசுனியா?'",
      "Anbu: 'இல்லையே... இப்ப பேசறேன். இறைவா, என்னை காப்பாத்து!'",
      "Thatha: 'இறைவன் அடி சேர்ந்தாருக்கு பிறவிக்கடல் நீந்த முடியும். நீ இன்னைக்கு அதை உணர்ந்திட்டே.'"
    ],
    thiruvalluvarAppears: "The waterfall behind them glows with rainbow light. Thiruvalluvar stands barefoot on a mossy rock, his white beard lit by the evening sun.",
    thiruvalluvarExplanation: "பிறவி ஒரு பெரிய கடல். அதை நீந்த முடியாது. ஆனா, இறைவன் அடியை சேர்ந்தவன் — அவன் அந்த கடல்ல நீந்திடுவான்.",
    thirukkural: "பிறவிப் பெருங்கடல் நீந்துவர் நீந்தார் இறைவன் அடிசேரா தார்.",
    englishTranslation: "The sea of births they alone swim Who clench His feet and cleave to Him",
    moral: "When you feel lost in life, holding onto God helps you cross every difficulty."
  }
];

// ===== HELPERS =====

function mapLocation(rawLocation) {
  const raw = (rawLocation || "").toLowerCase();
  if (raw.includes("temple")) return "Temple";
  if (raw.includes("school")) return "School";
  if (raw.includes("home") || raw.includes("house") || raw.includes("courtyard")) return "House";
  if (raw.includes("market")) return "Market";
  if (raw.includes("forest") || raw.includes("falls")) return "Forest";
  if (raw.includes("shore") || raw.includes("sea") || raw.includes("bridge") || raw.includes("river")) return "River";
  if (raw.includes("farm") || raw.includes("field") || raw.includes("village")) return "Village";
  return "Village";
}

function parseDialogueLine(line) {
  const match = /^([^:]+):\s*'?(.*?)'?$/.exec(line.trim());
  if (!match) return { character: "", line: line };
  return { character: match[1].trim(), line: match[2].trim() };
}

// Camera department + location/atmosphere defaults per scene position (1-5),
// matching the fixed Hook/Rising/Turning/Wisdom/Moral structure.
const SCENE_CAMERA_PRESETS = [
  { cameraAngle: "Wide Shot", cameraMovement: "Dolly", lens: "35mm", shotType: "Establishing", composition: "Rule of Thirds", focus: "Deep Focus", timeOfDay: "Morning", expression: "Curious", pose: "Standing", action: "Looking around" },
  { cameraAngle: "Medium", cameraMovement: "Pan", lens: "50mm", shotType: "Medium Close-Up", composition: "Rule of Thirds", focus: "Shallow DOF", timeOfDay: "Afternoon", expression: "Hopeful", pose: "Sitting", action: "Talking" },
  { cameraAngle: "Close Up", cameraMovement: "Zoom", lens: "85mm", shotType: "Reaction", composition: "Center", focus: "Shallow DOF", timeOfDay: "Afternoon", expression: "Realization", pose: "Facing camera", action: "Reacting" },
  { cameraAngle: "Top View", cameraMovement: "Tracking", lens: "24mm", shotType: "Establishing", composition: "Symmetry", focus: "Deep Focus", timeOfDay: "Evening", expression: "Reverent", pose: "Kneeling", action: "Listening" },
  { cameraAngle: "Wide Shot", cameraMovement: "Pan", lens: "35mm", shotType: "Master", composition: "Golden Ratio", focus: "Deep Focus", timeOfDay: "Evening", expression: "Content", pose: "Standing", action: "Reflecting" }
];

const SCENE_AMBIENT_BY_LOCATION = {
  Temple: "Temple Bells", School: "Birds", House: "Silence", Market: "Market Crowd",
  Forest: "Forest", River: "River", Village: "Birds"
};

const EMOTION_TO_VOICE_EMOTION = {
  Curious: "Gentle", Hope: "Warm", Proud: "Inspiring", Happy: "Joyful", Sad: "Calm", Fear: "Dramatic"
};

function extractAge(characterLabel) {
  const match = /\((\d+)/.exec(characterLabel || "");
  return match ? match[1] : "";
}

function padScene(kuralNumber, sceneNumber, title, duration, location, characters, narration, dialogueLines, emotion, camera, transition, imagePrompt, videoPrompt, goal, src) {
  const preset = SCENE_CAMERA_PRESETS[sceneNumber - 1];
  const weather = "Clear";
  const environment = src.location;
  const ambientSound = SCENE_AMBIENT_BY_LOCATION[location] || "Silence";
  const voiceEmotion = EMOTION_TO_VOICE_EMOTION[emotion] || "Calm";
  const protagonist = characters[0] || "Protagonist";

  return {
    sceneId: `TK-${String(kuralNumber).padStart(4, "0")}-S${sceneNumber}`,
    sceneNumber,
    title,
    duration,
    location,
    characters,
    narration,
    dialogue: dialogueLines.map(parseDialogueLine),
    emotion,
    camera,
    transition,
    imagePrompt,
    videoPrompt,
    status: "Draft",

    // General
    goal,
    moral: src.moral,
    learningObjective: `Understand: ${src.theme}`,

    // Characters
    characterAge: extractAge(protagonist),
    costume: "Traditional South Indian attire",
    expression: preset.expression,
    pose: preset.pose,
    action: preset.action,

    // Location
    environment,
    weather,
    season: "Summer",
    timeOfDay: preset.timeOfDay,
    lighting: /evening|dusk|night/i.test(preset.timeOfDay) ? "Golden Hour" : "Natural",

    // Camera
    cameraAngle: preset.cameraAngle,
    cameraMovement: preset.cameraMovement,
    lens: preset.lens,
    shotType: preset.shotType,
    composition: preset.composition,
    focus: preset.focus,

    // Image AI
    masterImagePrompt: imagePrompt,
    characterPrompt: autoGenCharacterPrompt(characters, preset.expression, location),
    backgroundPrompt: autoGenBackgroundPrompt(location, preset.timeOfDay, weather),
    stylePrompt: STUDIO_STYLE.artStyle + ", " + STUDIO_STYLE.imageQuality,
    lightingPrompt: autoGenLightingPrompt(preset.timeOfDay, weather),
    negativePrompt: STUDIO_STYLE.negative,
    imageModel: "DALL-E 3",
    imageStatus: "Pending",

    // Video AI
    masterVideoPrompt: videoPrompt,
    cameraMotionPrompt: "Smooth " + preset.cameraMovement.toLowerCase() + " with " + transition.toLowerCase() + " transition. " + STUDIO_STYLE.videoQuality + ".",
    animationPrompt: "Subtle natural motion, " + emotion.toLowerCase() + " mood pacing, gentle ambient movement. " + STUDIO_STYLE.videoQuality + ".",
    videoModel: "Runway Gen-3",
    fps: 24,
    aspectRatio: "16:9",

    // Voice
    narrationVoice: "Narrator",
    voiceGender: "Female",
    voiceAge: "Middle (35-50)",
    voiceEmotion,
    voiceAccent: "Tamil Nadu",
    speed: 1.0,
    pitch: 1.0,
    language: "Tamil",

    // Audio
    backgroundMusic: autoGenMusicPrompt(emotion, environment),
    ambientSound,
    soundEffects: [],
    volume: 0.8,
    fadeIn: 2,
    fadeOut: 2,

    assetStatus: "Not Generated"
  };
}

/**
 * Deterministically builds a 5-scene script from approved story content.
 * Stands in for the "Generate Script" action in this no-backend prototype.
 *
 * Prompt format:
 * - Image: [Shot type] of [subject] at [location]. [Action/scene]. [Style suffix].
 * - Video: [N]s [shot type]. [Camera movement]. [Subject action]. [Quality].
 * Style suffix ensures consistent Tamil-heritage cinematic visuals across scenes.
 */
function buildScenesFromStory(src) {
  const location = mapLocation(src.location);
  const protagonist = src.characters[0] || "Protagonist";
  const secondary = src.characters[1] || "";
  const allCharacters = src.characters.slice();
  const withThiru = allCharacters.concat(["Thiruvalluvar"]);
  var IMG_STYLE = STUDIO_STYLE.artStyle + ", " + STUDIO_STYLE.imageQuality;
  var VID_STYLE = STUDIO_STYLE.videoQuality;
  const LOC = location.toLowerCase();

  return [
    padScene(src.kuralNumber, 1, "The Hook", 8, location, allCharacters,
      src.hook, src.tamilDialogues.slice(0, 1), "Curious", "Wide Shot", "Cut",
      `Wide establishing shot of ${LOC} setting. ${protagonist} at the center of the moment: ${src.hook}. ${IMG_STYLE}.`,
      `8s wide establishing shot of ${LOC}. Slow dolly-in toward ${protagonist}. Curious, intriguing mood. ${VID_STYLE}.`,
      "Hook the viewer with curiosity", src),

    padScene(src.kuralNumber, 2, "Rising Moment", 10, location, allCharacters,
      src.story, src.tamilDialogues.slice(1, 3), "Hope", "Medium", "Cut",
      `Medium shot of ${protagonist}${secondary ? " and " + secondary : ""} in conversation at ${LOC} setting. Warm natural light, hopeful mood. ${IMG_STYLE}.`,
      `10s medium shot dialogue scene between ${protagonist}${secondary ? " and " + secondary : ""} at ${LOC}. Gentle pan, soft over-the-shoulder framing. ${VID_STYLE}.`,
      "Build the story and relationship", src),

    padScene(src.kuralNumber, 3, "The Turning Point", 8, location, allCharacters,
      src.tamilDialogues[3] ? parseDialogueLine(src.tamilDialogues[3]).line : src.story, src.tamilDialogues.slice(3, 4), "Proud", "Close Up", "Cut",
      `Close up on ${protagonist}'s face at the moment of realization. Emotional turning point, expressive eyes, soft portrait lighting. ${IMG_STYLE}.`,
      `8s close up capturing the emotional shift in ${protagonist}. Subtle push-in, shallow depth of field. Proud, reflective mood. ${VID_STYLE}.`,
      "Land the emotional turning point", src),

    padScene(src.kuralNumber, 4, "Thiruvalluvar's Wisdom", 12, location, withThiru,
      `${src.thiruvalluvarAppears} ${src.thiruvalluvarExplanation}`, [], "Hope", "Top View", "Dissolve",
      `Thiruvalluvar appears bathed in golden divine light at ${LOC}. Serene sage in white robes, reverent atmosphere, radiant halo. Kural text overlay: "${src.thirukkural}". ${IMG_STYLE}.`,
      `12s dissolve transition introducing Thiruvalluvar at ${LOC}. Slow crane down to sage, golden hour rays. Voice-over recites: "${src.thirukkural}" ("${src.englishTranslation}"). ${VID_STYLE}.`,
      "Reveal Thiruvalluvar's wisdom", src),

    padScene(src.kuralNumber, 5, "The Moral", 7, location, allCharacters,
      src.moral, [], "Happy", "Pan", "Fade",
      `Wide pan shot closing on ${protagonist} at ${LOC}. Peaceful resolution, warm golden hour lighting, hopeful mood. ${IMG_STYLE}.`,
      `7s closing pan shot of ${protagonist}. Slow horizontal pan, warm golden hour light. Narration: "${src.moral}". Fade to title card. ${VID_STYLE}.`,
      "Land the moral, close the story", src)
  ];
}

function buildScriptFromStory(src) {
  const now = new Date().toISOString();
  return {
    kuralNumber: src.kuralNumber,
    kuralId: src.id,
    title: src.title,
    storyTitle: src.title,
    theme: src.theme,
    status: "Draft",
    createdAt: now,
    updatedAt: now,
    storyPreview: src.story,
    thirukkural: src.thirukkural,
    englishTranslation: src.englishTranslation,
    scenes: buildScenesFromStory(src)
  };
}

// ===== DEFAULT DATABASE (generated once) =====
const DEFAULT_SCRIPTS_DATABASE = {};
SCRIPT_SOURCE_STORIES.forEach(src => {
  DEFAULT_SCRIPTS_DATABASE[src.kuralNumber] = buildScriptFromStory(src);
});

// ===== LOCALSTORAGE PERSISTENCE (prototype only — no backend) =====
const SCRIPTS_STORAGE_KEY = "thirukkural-scripts-v1";

function loadStoredOverrides() {
  try {
    const raw = localStorage.getItem(SCRIPTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("Failed to load stored scripts:", e);
    return {};
  }
}

function persistOverrides(overrides) {
  try {
    localStorage.setItem(SCRIPTS_STORAGE_KEY, JSON.stringify(overrides));
  } catch (e) {
    console.error("Failed to save scripts:", e);
  }
}

function getScript(kuralNumber) {
  const overrides = loadStoredOverrides();
  return overrides[kuralNumber] || DEFAULT_SCRIPTS_DATABASE[kuralNumber] || null;
}

function saveScript(kuralNumber, scriptObj) {
  const overrides = loadStoredOverrides();
  scriptObj.updatedAt = new Date().toISOString();
  overrides[kuralNumber] = scriptObj;
  persistOverrides(overrides);
  return scriptObj;
}

function getAllScripts() {
  return MVP_KURAL_NUMBERS.map(n => getScript(n)).filter(Boolean);
}

function calcTotalDuration(script) {
  return script.scenes.reduce((sum, scene) => sum + (Number(scene.duration) || 0), 0);
}

function formatDuration(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatUpdated(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function computeScriptStatus(script) {
  const statuses = script.scenes.map(s => s.status);
  if (statuses.length > 0 && statuses.every(s => s === "Final")) return "Complete";
  if (statuses.some(s => s === "Ready" || s === "Final")) return "In Progress";
  return "Draft";
}

function statusBadgeClass(status) {
  if (status === "Complete" || status === "Final") return "ui-badge-success";
  if (status === "In Progress" || status === "Ready") return "ui-badge-gold";
  return "ui-badge-warning";
}

function addScene(kuralNumber, afterSceneNumber) {
  const script = getScript(kuralNumber);
  if (!script) return null;

  const newScene = {
    sceneId: `TK-${String(kuralNumber).padStart(4, "0")}-S${Date.now()}`,
    sceneNumber: 0,
    title: "New Scene",
    duration: 5,
    location: LOCATION_OPTIONS[0],
    characters: [],
    narration: "",
    dialogue: [],
    emotion: EMOTION_OPTIONS[0],
    camera: CAMERA_OPTIONS[0],
    transition: TRANSITION_OPTIONS[0],
    imagePrompt: "",
    videoPrompt: "",
    status: "Draft"
  };

  const insertAt = script.scenes.findIndex(s => s.sceneNumber === afterSceneNumber) + 1;
  script.scenes.splice(insertAt || script.scenes.length, 0, newScene);
  renumberScenes(script);
  return saveScript(kuralNumber, script);
}

function deleteScene(kuralNumber, sceneNumber) {
  const script = getScript(kuralNumber);
  if (!script) return null;
  script.scenes = script.scenes.filter(s => s.sceneNumber !== sceneNumber);
  renumberScenes(script);
  return saveScript(kuralNumber, script);
}

function reorderScene(kuralNumber, sceneNumber, direction) {
  const script = getScript(kuralNumber);
  if (!script) return null;
  const idx = script.scenes.findIndex(s => s.sceneNumber === sceneNumber);
  const targetIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || targetIdx < 0 || targetIdx >= script.scenes.length) return script;

  const [scene] = script.scenes.splice(idx, 1);
  script.scenes.splice(targetIdx, 0, scene);
  renumberScenes(script);
  return saveScript(kuralNumber, script);
}

function renumberScenes(script) {
  script.scenes.forEach((scene, i) => {
    scene.sceneNumber = i + 1;
  });
}

function updateScene(kuralNumber, sceneNumber, updatedFields) {
  const script = getScript(kuralNumber);
  if (!script) return null;
  const scene = script.scenes.find(s => s.sceneNumber === sceneNumber);
  if (!scene) return null;
  Object.assign(scene, updatedFields);
  return saveScript(kuralNumber, script);
}

// Export for use
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MVP_KURAL_NUMBERS, SCRIPT_SOURCE_STORIES, LOCATION_OPTIONS, EMOTION_OPTIONS, CAMERA_OPTIONS,
    TRANSITION_OPTIONS, MUSIC_OPTIONS, SFX_OPTIONS,
    buildScriptFromStory,
    getScript, saveScript, getAllScripts, calcTotalDuration, formatDuration,
    addScene, deleteScene, reorderScene, updateScene
  };
}
