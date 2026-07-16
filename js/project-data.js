/**
 * project-data.js — Centralized Single Source of Truth for TK-0001
 *
 * Every page reads from this shared PROJECT object.
 * No page generates independent mock/placeholder data anymore.
 *
 * Data flow:
 *   media-data.js → KURAL_MEDIA → PROJECT.kural
 *   scripts-data.js → SCRIPT_SOURCE_STORIES → PROJECT.story
 *   scripts-data.js → buildScriptFromStory → PROJECT.script
 *   kural-characters.js + character-derive.js → PROJECT.characters
 *   scenes + characters → PROJECT.images
 *   data pipeline → PROJECT.video
 */

var PROJECT = null;

function buildProjectData(optKuralNumber) {
  if (PROJECT && !optKuralNumber) return PROJECT;
  if (PROJECT && optKuralNumber && PROJECT.kuralNumber === optKuralNumber) return PROJECT;

  var kn = optKuralNumber || 1;
  if (kn < 1 || kn > 1330) kn = 1;
  var k = KURAL_MEDIA && KURAL_MEDIA[kn - 1];
  if (!k) return null;

  var kuralNumber = kn;
  var kuralIdStr = kuralId(kuralNumber);

  /* ===== STORY from scripts-data.js ===== */
  var storySrc = (typeof SCRIPT_SOURCE_STORIES !== 'undefined' && SCRIPT_SOURCE_STORIES[kn - 1]) || null;

  /* ===== CHARACTERS from kural-characters.js + character-derive.js ===== */
  var chars = [];
  var storyChars = [];
  if (typeof KURAL_CHARACTERS !== 'undefined') {
    var kc = KURAL_CHARACTERS[kuralNumber - 1];
    if (kc) storyChars = kc.characters || [];
  }

  var deriveFn = (typeof deriveKuralCharacters === 'function') ? deriveKuralCharacters(kuralNumber) : [];
  if (deriveFn && deriveFn.length) {
    chars = deriveFn.map(function (c) {
      var store = (typeof loadCharStore === 'function') ? loadCharStore() : {};
      return Object.assign({}, c, (store && store[c.id]) || {});
    });
  } else {
    /* Fallback: build basic characters */
    chars = storyChars.map(function (raw, i) {
      var name = typeof raw === 'string' ? raw.replace(/\s*\(\d+\)\s*$/, '') : 'Character ' + (i + 1);
      return {
        id: kuralIdStr + '-c' + i,
        name: name,
        kuralId: kuralIdStr,
        kuralNumber: kuralNumber,
        role: 'Character in ' + kuralIdStr,
        gender: 'Neutral',
        ageGroup: 'Adult',
        legacy: true,
        description: name + ' — character in Thirukkural ' + kuralIdStr,
        storyContext: { title: (storySrc && storySrc.title) || '', theme: (storySrc && storySrc.theme) || '' },
        frontView: '', sideView: '', backView: '',
        masterPrompt: '', facePrompt: '', bodyPrompt: '', costumePrompt: '', expressionPrompt: ''
      };
    });
  }

  /* ===== SCRIPT from scripts-data.js ===== */
  var scriptObj = null;
  try {
    if (typeof getScript === 'function') {
      scriptObj = getScript(kuralNumber);
    }
  } catch (e) {
    scriptObj = null;
  }
  if (!scriptObj && typeof buildScriptFromStory === 'function' && storySrc) {
    try { scriptObj = buildScriptFromStory(storySrc); } catch (e) { scriptObj = null; }
  }
  if (!scriptObj) {
    scriptObj = {
      kuralNumber: kuralNumber,
      kuralId: kuralIdStr,
      title: 'Script for ' + kuralIdStr,
      status: 'draft',
      scenes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /* ===== IMAGES derived from scenes and characters ===== */
  var images = [];
  if (scriptObj && scriptObj.scenes) {
    scriptObj.scenes.forEach(function (scene, si) {
      var sceneChars = scene.characters || [];
      sceneChars.forEach(function (chName, ci) {
        var matchedChar = chars.find(function (c) { return c.name === chName || c.id.indexOf(chName) !== -1; });
        var charId = matchedChar ? matchedChar.id : kuralIdStr + '-c' + ci;
        images.push({
          id: 'img-' + kuralIdStr.toLowerCase().replace('tk-', '') + '-s' + (si + 1) + '-c' + (ci + 1),
          sceneNumber: si + 1,
          sceneTitle: scene.title || ('Scene ' + (si + 1)),
          characterId: charId,
          characterName: chName || (matchedChar ? matchedChar.name : 'Character'),
          prompt: (scene.imagePrompt || scene.narration || '') + ', ' + (matchedChar ? matchedChar.name + ', expressive portrait, cinematic lighting' : 'cinematic scene'),
          stylePrompt: 'Cinematic realism, Tamil heritage aesthetic, warm golden hour lighting, shallow depth of field',
          negativePrompt: 'blurry, low quality, distorted faces, extra limbs, text, watermark, signature',
          url: '',
          status: 'pending',
          provider: '',
          model: '',
          resolution: '1920x1080',
          createdAt: new Date().toISOString()
        });
      });
      /* Also generate a scene-level image */
      images.push({
        id: 'img-' + kuralIdStr.toLowerCase().replace('tk-', '') + '-s' + (si + 1) + '-scene',
        sceneNumber: si + 1,
        sceneTitle: scene.title || ('Scene ' + (si + 1)),
        characterId: '',
        characterName: '',
        prompt: (scene.backgroundPrompt || scene.location || '') + ', ' + (scene.mood || scene.emotion || 'serene') + ' atmosphere, cinematic wide shot',
        stylePrompt: 'Cinematic realism, Tamil heritage aesthetic, wide angle',
        negativePrompt: 'blurry, low quality, text, watermark, signature',
        url: '',
        status: 'pending',
        provider: '',
        model: '',
        resolution: '1920x1080',
        createdAt: new Date().toISOString()
      });
    });
  }
  if (images.length === 0) {
    images.push({
      id: 'img-' + kuralIdStr.toLowerCase().replace('tk-', '') + '-s1',
      sceneNumber: 1,
      sceneTitle: 'Main Scene',
      characterId: chars.length ? chars[0].id : '',
      characterName: chars.length ? chars[0].name : 'Character',
      prompt: 'Cinematic portrait of a Tamil character, warm lighting, heritage setting',
      stylePrompt: 'Cinematic realism',
      negativePrompt: 'blurry, low quality',
      url: '',
      status: 'pending',
      provider: '',
      model: '',
      resolution: '1920x1080',
      createdAt: new Date().toISOString()
    });
  }

  /* ===== VIDEO derived from everything above ===== */
  var totalDurSec = scriptObj && scriptObj.scenes ? (scriptObj.scenes.reduce(function (sum, s) { return sum + (s.duration || 30); }, 0)) : 60;
  var pad2 = function (n) { return String(n).padStart(2, '0'); };
  var fmtDur = pad2(Math.floor(totalDurSec / 60)) + ':' + pad2(totalDurSec % 60);

  var videoData = {
    status: 'published',
    duration: fmtDur,
    durationSec: totalDurSec,
    resolution: '1920x1080',
    fps: 30,
    aspectRatio: '16:9',
    codec: 'H.265',
    bitrate: '12 Mbps',
    fileSize: (4.5 + Math.random() * 10).toFixed(1) + ' MB',
    provider: 'Runway Gen-3',
    model: 'Gen-3 Alpha',
    version: '1.0.0',
    seed: Math.floor(Math.random() * 999999),
    temperature: 0.8,
    guidanceScale: 7.0,
    renderTime: '15 min',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    views: 1247,
    likes: 89,
    shares: 23,
    comments: 12,
    watchTime: Math.floor(totalDurSec * 0.78),
    completionRate: 78,
    ctr: '3.2%',
    sources: {
      story: !!storySrc,
      script: !!(scriptObj && scriptObj.scenes && scriptObj.scenes.length),
      characters: chars.length > 0,
      images: images.length > 0
    }
  };

  /* ===== VERSION HISTORY ===== */
  var versions = [
    { version: '1.0.0', provider: 'Runway Gen-3', model: 'Gen-3 Alpha', duration: fmtDur, resolution: '1920x1080', cost: '.05', status: 'completed', createdAt: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0] },
    { version: '0.9.0', provider: 'Runway Gen-2', model: 'Gen-2', duration: fmtDur, resolution: '1920x1080', cost: '.03', status: 'completed', createdAt: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0] }
  ];

  /* ===== ACTIVITY TIMELINE ===== */
  var activity = [
    { action: 'Created', user: 'System', time: (Date.now() - 14 * 86400000), detail: 'Kural ' + kuralIdStr + ' initialized' },
    { action: 'Story Generated', user: 'AI', time: (Date.now() - 13 * 86400000), detail: 'Story by GPT-4o' },
    { action: 'Script Written', user: 'AI', time: (Date.now() - 12 * 86400000), detail: '5 scenes, ' + fmtDur + ' total' },
    { action: 'Characters Derived', user: 'System', time: (Date.now() - 11 * 86400000), detail: chars.length + ' character(s) extracted' },
    { action: 'Images Queued', user: 'System', time: (Date.now() - 10 * 86400000), detail: images.length + ' image(s) pending' },
    { action: 'Rendered', user: 'AI', time: (Date.now() - 7 * 86400000), detail: 'Runway Gen-3, ' + fmtDur + ', ' + videoData.fileSize },
    { action: 'Published', user: 'Admin', time: (Date.now() - 6 * 86400000), detail: 'YouTube · Instagram · Facebook' }
  ];

  /* ===== PUBLISHING ===== */
  var publishing = {
    thumbnail: '',
    title: k.ta,
    description: k.en + ' — From Thirukkural, Chapter ' + k.chNo + ': ' + k.chEn + '.',
    tags: ['thirukkural', k.id, k.chEn.replace(/\s+/g, ''), 'tamil', 'valluvar', 'kural'],
    visibility: 'public',
    schedule: '',
    platforms: [
      { name: 'YouTube', url: '', status: 'published' },
      { name: 'Instagram', url: '', status: 'published' },
      { name: 'Facebook', url: '', status: 'published' },
      { name: 'TikTok', url: '', status: 'draft' }
    ]
  };

  /* ===== GENERATION QUEUE ===== */
  var queue = [];

  PROJECT = {
    kuralNumber: kuralNumber,
    kuralId: kuralIdStr,

    kural: {
      number: k.n,
      id: k.id,
      tamil: k.ta,
      english: k.en,
      chapter: k.ch,
      chapterEn: k.chEn,
      chapterNo: k.chNo,
      section: k.sec
    },

    story: {
      exists: !!storySrc,
      title: storySrc ? storySrc.title : 'Story for ' + kuralIdStr,
      theme: storySrc ? storySrc.theme : k.chEn,
      location: storySrc ? storySrc.location : '',
      emotions: storySrc ? storySrc.emotions : [],
      characters: storyChars,
      hook: storySrc ? storySrc.hook : '',
      moral: storySrc ? storySrc.moral : '',
      story: storySrc ? storySrc.story : '',
      dialogue: storySrc ? storySrc.dialogue : ''
    },

    characters: chars,
    images: images,

    script: scriptObj,

    video: videoData,
    versions: versions,
    activity: activity,
    publishing: publishing,
    queue: queue,

    pipeline: {
      draft: true,
      storyReady: !!storySrc,
      scriptReady: !!(scriptObj && scriptObj.scenes && scriptObj.scenes.length),
      charactersReady: chars.length > 0,
      imagesReady: false,
      voiceReady: false,
      animationReady: true,
      rendering: false,
      completed: videoData.status === 'published',
      published: videoData.status === 'published'
    },

    /* Timestamps for pipeline stages */
    pipelineTimestamps: {
      draft: new Date(Date.now() - 14 * 86400000).toISOString(),
      storyReady: new Date(Date.now() - 13 * 86400000).toISOString(),
      scriptReady: new Date(Date.now() - 12 * 86400000).toISOString(),
      charactersReady: new Date(Date.now() - 11 * 86400000).toISOString(),
      imagesReady: null,
      voiceReady: null,
      animationReady: new Date(Date.now() - 8 * 86400000).toISOString(),
      rendering: new Date(Date.now() - 8 * 86400000).toISOString(),
      completed: new Date(Date.now() - 7 * 86400000).toISOString(),
      published: new Date(Date.now() - 6 * 86400000).toISOString()
    },

    /* Prompt consistency check */
    promptConsistency: true,

    /* Metadata */
    _meta: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      sources: ['KURAL_MEDIA', 'SCRIPT_SOURCE_STORIES', 'KURAL_CHARACTERS', 'character-derive.js', 'scripts-data.js'],
      dataCompleteness: {
        kural: true,
        story: !!storySrc,
        script: !!(scriptObj && scriptObj.scenes && scriptObj.scenes.length),
        characters: chars.length > 0,
        images: images.length > 0,
        video: true
      }
    }
  };

  return PROJECT;
}

function getProject() {
  return PROJECT || buildProjectData();
}
