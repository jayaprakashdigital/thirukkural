/**
 * Prompt Library Database - Kural-wise Video Scripts
 * Contains: Script text, Timing, Detailed Explanations, Image/Character/Video prompts
 * Dynamic structure for all 1330 kurals
 */

const PROMPTS_DATABASE = {
  // Kural 1: The Praise of God (கடவுள் வாழ்த்து)
  1: {
    kuralNumber: 1,
    kuralId: "TK-0001",
    title: "The Praise of God",
    story: "Praise of God",
    storyId: "story-1",
    category: "Divine",
    scriptText: `"As the letter 'A' is the first of all letters, so the eternal God is first in the world."

This opening kural of Thirukkural establishes the fundamental principle that just as the letter 'A' begins all words and language, so does the Supreme Being begin all creation and existence. Every syllable, every word, every thought originates from this primordial source.`,
    timing: {
      intro: "0:00-0:05",
      mainNarration: "0:05-0:20",
      explanation: "0:20-0:30",
      outro: "0:30-0:35"
    },
    detailedExplanation: `Thiruvalluvar opens the Thirukkural with this profound statement about the primacy of the Divine. The comparison between the letter 'A' (Akara) and God is intentional - just as no word in Tamil can exist without starting with a vowel, no existence can occur without the Divine. This establishes the theological foundation for all 1330 kurals that follow.

The kural teaches that acknowledging the Divine as the source of all existence is the beginning of wisdom. Before pursuing virtue, wealth, or love, one must recognize the eternal nature of the Divine. This is not mere religious sentiment but a fundamental principle of existence - that consciousness, creation, and continuity all stem from one ultimate source.`,
    imagePrompt: `A sacred Tamil temple with golden gopuram (tower) reaching toward the sky with divine light rays. Ancient Tamil script glowing in golden letters. "Akara" (letter A) in Tamil script radiating light and creating all other letters and words. Ethereal divine presence represented by cosmic light. Serene, spiritual, deeply reverent mood. High quality, cinematic lighting.`,
    characterPrompt: `Thiruvalluvar - elderly sage in traditional white Tamil robes, with kind eyes and a serene expression. Depicted sitting in a contemplative pose, surrounded by sacred light. His presence radiates wisdom and divine connection.`,
    stylePrompt: `cinematic realism, Tamil heritage aesthetic, warm earthy palette, 4K, high detail, professional cinematography`,
    negativePrompt: `blurry, low quality, distorted faces, extra limbs, watermark, text artifacts, oversaturated`,
    videoPrompt: `60 seconds. Opening sequence with cosmic creation: swirling cosmic dust forming into galaxies. Gradually transition to earth and Tamil temples. Camera moves through temple corridors toward the sanctum. Show the letter 'Akara' in Tamil script glowing and transforming into all other letters. Images of creation - sunrise, trees growing, rivers flowing, life emerging. Gentle, meditative background music. Slow, reverent camera movements. Narrator voice: wise, gentle, authoritative but not harsh. 24fps, color graded, cinematic.`,
    narrationScript: `"In the beginning, there is the Divine. Just as the letter 'A' is the foundation of all letters, God is the foundation of all creation. This is the eternal truth that guides us."`,
    keyPoints: [
      "Divine is the source of all existence",
      "Like 'A' in language, God is the beginning of creation",
      "This is wisdom - to recognize the Divine first",
      "All knowledge flows from this understanding"
    ],
    generationNotes: "For image generation: Use warm golden lighting, sacred temple imagery, Tamil script elements. For character: Thiruvalluvar as serene wise sage. For video: Start with cosmic imagery, transition to earth and temple. Emphasize light, creation, and divine presence throughout."
  },

  2: {
    kuralNumber: 2,
    kuralId: "TK-0002",
    title: "The Pure Knowledge",
    story: "Praise of God",
    storyId: "story-1",
    category: "Divine",
    scriptText: `"No fruit have men of all their studied lore, save they the 'Purely Wise One's' feet adore."

Learning and knowledge are valuable only when they lead to devotion to the Divine. All the books one reads, all the wisdom one accumulates, all the intellectual achievements - they bear no fruit unless they culminate in recognizing and worshipping the source of all pure knowledge.`,
    timing: {
      intro: "0:00-0:05",
      mainNarration: "0:05-0:25",
      explanation: "0:25-0:35",
      outro: "0:35-0:40"
    },
    detailedExplanation: `This kural speaks to a universal human tendency - to accumulate knowledge for its own sake. We gather information, study various sciences, read countless books, and feel accomplished. Yet, according to Thiruvalluvar, this is fruitless unless it leads to a higher purpose.

The "Purely Wise One" refers to the Divine - the source of all true knowledge. The kural suggests that true wisdom is recognizing the limits of human knowledge and acknowledging the infinite intelligence of the Divine. This is not anti-intellectual but rather places intellectual pursuits in proper perspective. Knowledge should make us humble, should deepen our wonder at creation, and should lead us to reverence for the Creator.

This principle applies to all fields - whether one is a scientist discovering the laws of nature, an artist creating beauty, or a philosopher contemplating existence - all should recognize that the source of their insights is beyond themselves.`,
    imagePrompt: `A vast library with countless scrolls and books, representing human knowledge. In the center, a figure kneeling in reverence before a divine light. Books arranged in circles around the figure, with the innermost circle illuminated by a golden divine presence. Tamil manuscripts and Vedic texts visible. Transition from darkness (worldly knowledge) to light (divine wisdom). Sacred and contemplative atmosphere.`,
    characterPrompt: `A scholar or sage surrounded by books and manuscripts, humbled before the divine light. Could be a young student, a mature philosopher, or any seeker of knowledge in a moment of reverence and realization.`,
    videoPrompt: `45 seconds. Open with scholar surrounded by countless books and scrolls, appearing proud and accomplished. Camera pans across vast library. Gradually, a divine light appears. Scholar's expression changes from pride to reverence. Books begin to glow with the reflected divine light. Scholar bows in humility. All knowledge is illuminated by this central divine light. End with scholar's peaceful face, eyes closed in devotion. Background music: contemplative, with subtle Indian classical elements.`,
    narrationScript: `"We may spend lifetimes accumulating knowledge. We may master many subjects and impress many people. But true wisdom comes from humility - from recognizing that all knowledge flows from one eternal source of pure understanding."`,
    keyPoints: [
      "Knowledge without spiritual purpose is fruitless",
      "True wisdom recognizes the Divine source of all knowing",
      "Intellectual pride blocks spiritual understanding",
      "Devotion completes the journey of learning"
    ],
    generationNotes: "Contrast worldly knowledge (books, scrolls) with divine wisdom (light). Show transformation from pride to humility. Use illumination metaphors - divine light revealing the true value of knowledge."
  },

  11: {
    kuralNumber: 11,
    kuralId: "TK-0011",
    title: "The Blessing of Rain",
    story: "The Blessing of Rain",
    storyId: "story-2",
    category: "Prosperity",
    scriptText: `"What greater blessing is there than rain, which nourishes the earth and sustains all life?"

Rain is not merely weather - it is the connection between heaven and earth, between the divine and the material world. When rain falls, it brings life to dormant seeds, fills rivers and wells, and ensures the survival of all beings. Without rain, even the richest land becomes a wasteland.`,
    timing: {
      intro: "0:00-0:05",
      mainNarration: "0:05-0:25",
      explanation: "0:25-0:35",
      outro: "0:35-0:40"
    },
    detailedExplanation: `In ancient Tamil civilization, as in all agrarian societies, rain was the most precious natural phenomenon. This kural celebrates rain not as a mere meteorological event but as a divine blessing that sustains civilization itself.

The kural emphasizes several layers of meaning: First, the practical - rain is essential for agriculture, water supply, and all life. Second, the spiritual - rain represents the manifestation of divine grace in the material world. Third, the philosophical - rain teaches the lesson of interconnection - that what falls from heaven sustains what grows on earth.

For Thiruvalluvar, who lived in a land where monsoons were critical for survival, rain represented divine mercy. A year with good rains meant prosperity and happiness; a year of drought meant suffering and hardship. Therefore, rain transcended mere weather to become a symbol of divine favor and human dependence on forces beyond our control.`,
    imagePrompt: `Aerial view of parched earth gradually being blessed by rain. Clouds gathering dramatically over dry landscape. Rain falling on fields, vegetation coming to life. Rivers filling with water, people celebrating. Transition from brown/golden drought-stricken land to lush green vegetation. Include farmers, fields, wells, forests. Divine rays of sunlight breaking through clouds. Cinematic, life-affirming imagery.`,
    characterPrompt: `Farmers - old and young, men and women - celebrating the arrival of rain. Their faces show relief, gratitude, and joy. Traditional Tamil farmers in white clothes with characteristic turbans. Show their connection to the land.`,
    videoPrompt: `60 seconds. Start with wide shot of dry, cracked earth under harsh sun. Show struggling vegetation, dried wells, worried farmers. Clouds gradually gather in the sky (time-lapse). First drops of rain. Celebration begins - people lifting faces to the sky, children dancing. Rapid sequence of rain nourishing the land: seeds sprouting, vegetation growing, rivers flowing, animals returning. Farmers working in fresh green fields. Harvest scenes. End with abundant, thriving landscape under clear sky. Music: from sparse to joyful, with traditional Tamil instruments.`,
    narrationScript: `"The earth cries out for water. The crops need moisture. The animals seek life-giving streams. And from the heavens comes the blessing of rain - transforming the barren into the fertile, the hopeless into the blessed."`,
    keyPoints: [
      "Rain is the most essential blessing for human civilization",
      "It represents divine grace manifested in nature",
      "Without rain, even the richest land becomes wasteland",
      "Rain teaches interconnection and dependence"
    ],
    generationNotes: "Emphasize transformation and contrast - dry to green, barren to fertile, despair to hope. Use water and rain as metaphors for divine blessing. Show celebration and gratitude. Include both spiritual and practical aspects."
  },

  // Template for kurals without stories (majority of 1330)
  41: {
    kuralNumber: 41,
    kuralId: "TK-0041",
    title: "Domestic Life",
    story: "",
    storyId: "",
    category: "Virtue",
    scriptText: `The foundation of a good society is built on good homes. When a householder lives with virtue, maintains their home with care, and nurtures their family with love, they create a sanctuary that radiates outward to strengthen the entire community.`,
    timing: {
      intro: "0:00-0:05",
      mainNarration: "0:05-0:20",
      explanation: "0:20-0:30",
      outro: "0:30-0:35"
    },
    detailedExplanation: `This kural emphasizes that domestic virtue is not a small or insignificant matter. The home is where character is formed, values are learned, and moral foundations are laid. A virtuous household contributes immensely to society's wellbeing.

The householder who maintains ethical standards, who cares for family members with compassion, who manages resources wisely, and who treats all with respect - creates an environment where virtue can flourish. This is the foundation upon which prosperous civilizations are built.`,
    imagePrompt: `A traditional Tamil household with warm, golden lighting. Family members engaged in daily activities - cooking, teaching children, caring for elderly. Home decorated with flowers and traditional art. Sense of harmony, peace, and togetherness. Exterior showing the home as a sanctuary. Warm, inviting, familial atmosphere.`,
    characterPrompt: `A householder - ideally shown as responsible, caring, and virtuous. Could be older or younger, but always depicted as the center of a nurturing home environment.`,
    videoPrompt: `40 seconds. Interior of a warm, well-maintained home. Family members engaged in daily life - cooking together, studying, caring for each other. Show respect between family members. Natural light flowing through windows. Children learning from parents. Elders being cared for. Subtle sequence showing how home values extend to community. End with sense of peace and harmony. Music: warm, traditional, family-focused.`,
    narrationScript: `"A home built on virtue becomes a sanctuary. A household led with wisdom becomes a beacon. The strength of society flows from the strength of its homes."`,
    keyPoints: [
      "Home is foundation of character and virtue",
      "Virtuous households strengthen entire communities",
      "Proper domestic management creates lasting peace",
      "Family care and respect build social stability"
    ],
    generationNotes: "Focus on warmth, family bonds, and domestic harmony. Show intergenerational care and respect. Use natural lighting and traditional home settings to emphasize timelessness of these values."
  }
};

// Helper function to get script for a specific kural
function getPromptForKural(kuralNumber) {
  return PROMPTS_DATABASE[kuralNumber] || null;
}

// Helper function to get all kurals with scripts
function getKuralsWithPrompts() {
  return Object.keys(PROMPTS_DATABASE).map(Number).sort((a, b) => a - b);
}

// Helper function to get total prompt count
function getTotalPromptCount() {
  return Object.keys(PROMPTS_DATABASE).length;
}

// Helper function to create a prompt template for new kurals.
// Template fields use [BRACKETED] placeholders — replace with kural-specific content.
// Style suffix ensures consistent Tamil-heritage visuals across all generated assets.
function createPromptTemplate(kuralNumber, kuralId, title, story = "", storyId = "", category = "General") {
  var IMG_STYLE = "cinematic realism, Tamil heritage aesthetic, warm earthy palette, 4K, high detail, professional cinematography";
  var VID_STYLE = "24fps, color graded, cinematic, smooth motion";
  var NEGATIVE = "blurry, low quality, distorted faces, extra limbs, watermark, text artifacts, oversaturated";
  return {
    kuralNumber: kuralNumber,
    kuralId: kuralId,
    title: title,
    story: story,
    storyId: storyId,
    category: category,
    scriptText: `Kural ${kuralId}: "${title}"\n\n[Tamil kural text]\n\n[English translation]\n\n[2-3 sentence narration explaining the kural's meaning and its relevance to daily life]`,
    timing: {
      intro: "0:00-0:05",
      mainNarration: "0:05-0:20",
      explanation: "0:20-0:30",
      outro: "0:30-0:35"
    },
    detailedExplanation: `[Paragraph 1: Literal meaning of the kural]\n\n[Paragraph 2: Philosophical significance and cultural context]\n\n[Paragraph 3: Modern relevance and practical application]`,
    imagePrompt: `[Main subject]. [Setting/location]. [Mood/atmosphere]. Style: ${IMG_STYLE}. Negative: ${NEGATIVE}.`,
    characterPrompt: `Characters: [list]. Expression: [emotion]. Costume: [attire]. Setting: [location]. Detailed features, portrait lighting, sharp focus, ${IMG_STYLE}.`,
    videoPrompt: `[N]s [shot type] of [subject] at [location]. [Camera movement]. [Lighting/mood]. Narration: "[script]". ${VID_STYLE}.`,
    narrationScript: `"[Opening hook]. [Main teaching]. [Closing reflection]"`,
    keyPoints: [
      "[Core teaching 1]",
      "[Core teaching 2]",
      "[Core teaching 3]",
      "[Modern application]"
    ],
    generationNotes: `Image: [visual approach and key symbols]. Character: [who to depict and how]. Video: [sequence, transitions, camera moves]. Audio: [mood and instrument choices].`
  };
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PROMPTS_DATABASE,
    getPromptForKural,
    getKuralsWithPrompts,
    getTotalPromptCount,
    createPromptTemplate
  };
}
