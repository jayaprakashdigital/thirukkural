/**
 * Characters Database - Kural-wise Character Mapping
 * Maintains: Name, Gender, Character Consistency, Character Details
 * Dynamically linked to stories and kurals
 */

const CHARACTER_DATABASE = {
  // Kural 1-10: The Praise of God (கடவுள் வாழ்த்து)
  1: [
    {
      id: "char-1-god",
      name: "The Supreme Being",
      transliteration: "Paramatman",
      gender: "Divine",
      role: "The Eternal Lord",
      consistency: "Supreme Creator",
      details: "Represents divine knowledge and creation. The source of all existence and learning.",
      story: "Praise of God",
      storyId: "story-1"
    }
  ],
  2: [
    {
      id: "char-2-god",
      name: "The Omniscient Lord",
      transliteration: "Ariven",
      gender: "Divine",
      role: "Pure Knowledge",
      consistency: "Embodies all wisdom",
      details: "The source of pure knowledge that transcends all learning. Those who worship this divine wisdom gain eternal rewards.",
      story: "Praise of God",
      storyId: "story-1"
    }
  ],
  3: [
    {
      id: "char-3-god",
      name: "The Divine Lotus-Dweller",
      transliteration: "Malarmisai Ekinaan",
      gender: "Divine",
      role: "Transcendent Deity",
      consistency: "Beyond human comprehension",
      details: "Dwells in the lotus of the mind. Those who meditate on His feet attain eternal bliss.",
      story: "Praise of God",
      storyId: "story-1"
    }
  ],
  4: [
    {
      id: "char-4-god",
      name: "The Unattached Divine",
      transliteration: "Veendum Veundaamai",
      gender: "Divine",
      role: "Supreme Consciousness",
      consistency: "Indifferent to worldly desires",
      details: "Free from desire and aversion. Worshippers of this divine consciousness are free from all sorrows.",
      story: "Praise of God",
      storyId: "story-1"
    }
  ],
  5: [
    {
      id: "char-5-seeker",
      name: "The Humble Seeker",
      transliteration: "Padaimai Adaiya",
      gender: "Gender-neutral",
      role: "Spiritual Aspirant",
      consistency: "Pursues divine wisdom",
      details: "Represents those who humbly seek the divine feet. A symbol of devotion and spiritual progress.",
      story: "Praise of God",
      storyId: "story-1"
    }
  ],
  6: [
    {
      id: "char-6-god",
      name: "The Infinite Divine",
      transliteration: "Aadiyan",
      gender: "Divine",
      role: "Primordial Creator",
      consistency: "Source of all existence",
      details: "The beginning and end of all things. Worshipped by the wise as the foundation of the universe.",
      story: "Praise of God",
      storyId: "story-1"
    }
  ],

  // Kural 11-20: The Blessing of Rain (வான்சிறப்பு)
  11: [
    {
      id: "char-11-rain",
      name: "The Divine Rain",
      transliteration: "Vaan Mazhai",
      gender: "Divine",
      role: "Life-giver",
      consistency: "Sustainer of all life",
      details: "Symbolizes divine grace and abundance. Rain nourishes all life and is essential for civilization.",
      story: "The Blessing of Rain",
      storyId: "story-2"
    }
  ],
  12: [
    {
      id: "char-12-soil",
      name: "The Fertile Earth",
      transliteration: "Nilam",
      gender: "Feminine",
      role: "Mother Provider",
      consistency: "Life-sustaining force",
      details: "The earth that receives rain and produces abundance. Without rain, the earth cannot fulfill its purpose.",
      story: "The Blessing of Rain",
      storyId: "story-2"
    }
  ],
  13: [
    {
      id: "char-13-farmer",
      name: "The Humble Farmer",
      transliteration: "Urali",
      gender: "Male",
      role: "Laborer",
      consistency: "Dependent on divine grace",
      details: "Represents those who work the land and depend on rain for their livelihood and survival.",
      story: "The Blessing of Rain",
      storyId: "story-2"
    }
  ],
  14: [
    {
      id: "char-14-crops",
      name: "The Golden Harvest",
      transliteration: "Nelvanam",
      gender: "Gender-neutral",
      role: "Blessing",
      consistency: "Result of divine grace",
      details: "The crops that grow from the combination of rain and fertile soil, symbolizing prosperity and abundance.",
      story: "The Blessing of Rain",
      storyId: "story-2"
    }
  ],
  15: [
    {
      id: "char-15-cloud",
      name: "The Merciful Cloud",
      transliteration: "Megam",
      gender: "Gender-neutral",
      role: "Messenger",
      consistency: "Brings divine blessing",
      details: "Clouds carry the rain from heaven to earth, acting as messengers of divine mercy.",
      story: "The Blessing of Rain",
      storyId: "story-2"
    }
  ],

  // Kural 21-30: The Greatness of Ascetics (நீத்தார் பெருமை)
  21: [
    {
      id: "char-21-ascetic",
      name: "The Enlightened Ascetic",
      transliteration: "Needhaar",
      gender: "Male",
      role: "Sage",
      consistency: "Renouncer of worldly desires",
      details: "Those who have transcended worldly attachments and live in virtue and wisdom. Their greatness is unparalleled.",
      story: "",
      storyId: ""
    }
  ],
  22: [
    {
      id: "char-22-virtue",
      name: "The Path of Virtue",
      transliteration: "Aram",
      gender: "Gender-neutral",
      role: "Principle",
      consistency: "Eternal truth",
      details: "The way of righteousness that ascetics follow. Virtue itself becomes their ornament and strength.",
      story: "",
      storyId: ""
    }
  ],

  // Kural 41-50: Domestic Life (இல்வாழ்க்கை)
  41: [
    {
      id: "char-41-householder",
      name: "The Wise Householder",
      transliteration: "Ilaravan",
      gender: "Male",
      role: "Family man",
      consistency: "Virtuous domestic provider",
      details: "The foundation of society. A householder who maintains virtue within the home contributes to the world's stability.",
      story: "",
      storyId: ""
    }
  ],
  42: [
    {
      id: "char-42-wife",
      name: "The Devoted Wife",
      transliteration: "Manaivi",
      gender: "Female",
      role: "Life companion",
      consistency: "Pillar of household",
      details: "A wife's virtue and devotion strengthen her household and ensure its prosperity and continuity.",
      story: "",
      storyId: ""
    }
  ],

  // Kural 51-60: The Worth of a Wife (வாழ்க்கைத் துணைநலம்)
  51: [
    {
      id: "char-51-spouse",
      name: "The Perfect Companion",
      transliteration: "Thunai",
      gender: "Female",
      role: "Partner",
      consistency: "Equal in virtue",
      details: "A virtuous spouse doubles the wealth of a household through wisdom and dedication. She is the support of family life.",
      story: "",
      storyId: ""
    }
  ],
  52: [
    {
      id: "char-52-husband",
      name: "The Responsible Husband",
      transliteration: "Kathalin",
      gender: "Male",
      role: "Provider and protector",
      consistency: "Dutiful guardian",
      details: "A man's worth is measured by his treatment and care of his wife. A good husband is the foundation of family happiness.",
      story: "",
      storyId: ""
    }
  ],

  // Kural 61-70: The Wealth of Children (மக்கட்பேறு)
  61: [
    {
      id: "char-61-child",
      name: "The Blessed Child",
      transliteration: "Makkal",
      gender: "Gender-neutral",
      role: "Legacy",
      consistency: "Continuation of family",
      details: "Children are the greatest wealth of a family. Virtuous children ensure the family's name and prosperity endure.",
      story: "",
      storyId: ""
    }
  ],
  62: [
    {
      id: "char-62-mother",
      name: "The Nurturing Mother",
      transliteration: "Thaai",
      gender: "Female",
      role: "Nurturer",
      consistency: "Source of life",
      details: "A mother's role in shaping virtuous children is paramount. She is the first teacher of morality and virtue.",
      story: "",
      storyId: ""
    }
  ],

  // Kural 71-80: The Possession of Love (அன்புடைமை)
  71: [
    {
      id: "char-71-lover",
      name: "The Devoted Lover",
      transliteration: "Anpudan",
      gender: "Gender-neutral",
      role: "Affectionate one",
      consistency: "Bearer of compassion",
      details: "One possessed of love and compassion. Such a person's presence brings comfort and peace to all.",
      story: "Love's First Meeting",
      storyId: "story-7"
    }
  ],
  72: [
    {
      id: "char-72-beloved",
      name: "The Cherished Beloved",
      transliteration: "Anbudeyvan",
      gender: "Gender-neutral",
      role: "Object of affection",
      consistency: "Receiver of love",
      details: "One who is loved and cherished. The beloved reflects the devotion of those who love them.",
      story: "Love's First Meeting",
      storyId: "story-7"
    }
  ],

  // Kural 81-90: The Agony of Separation (பிரிதல் நोவு)
  81: [
    {
      id: "char-81-separated",
      name: "The Yearning Lover",
      transliteration: "Pirinthudan",
      gender: "Gender-neutral",
      role: "The bereft",
      consistency: "Sufferer of absence",
      details: "One separated from their beloved. The pain of separation is depicted as one of the deepest human sorrows.",
      story: "The Agony of Separation",
      storyId: "story-9"
    }
  ],
  82: [
    {
      id: "char-82-absence",
      name: "The Painful Absence",
      transliteration: "Pirivai",
      gender: "Gender-neutral",
      role: "Torment",
      consistency: "Source of anguish",
      details: "The absence of a beloved creates deep pain. This separation becomes unbearable for the devoted heart.",
      story: "The Agony of Separation",
      storyId: "story-9"
    }
  ],

  // Kural 91-100: Union of Lovers (ஊடல் நிறுத்தல்)
  91: [
    {
      id: "char-91-reconciling",
      name: "The Reconciling Lovers",
      transliteration: "Orathudan",
      gender: "Gender-neutral",
      role: "The reunited",
      consistency: "Restorers of peace",
      details: "Those who overcome quarrels and misunderstandings to reunite. Such reconciliation is sweeter than initial union.",
      story: "Union of Lovers",
      storyId: "story-10"
    }
  ],
  92: [
    {
      id: "char-92-peace",
      name: "The Healed Heart",
      transliteration: "Vidal",
      gender: "Gender-neutral",
      role: "Restored peace",
      consistency: "Triumph over conflict",
      details: "After disagreement and pain comes the joy of making peace. The healed relationship is stronger than before.",
      story: "Union of Lovers",
      storyId: "story-10"
    }
  ]
};

// Helper function to get characters for a specific kural
function getCharactersForKural(kuralNumber) {
  return CHARACTER_DATABASE[kuralNumber] || [];
}

// Helper function to get all kurals with characters
function getKuralsWithCharacters() {
  return Object.keys(CHARACTER_DATABASE).map(Number).sort((a, b) => a - b);
}

// Helper function to get character count
function getTotalCharacterCount() {
  let count = 0;
  for (const characters of Object.values(CHARACTER_DATABASE)) {
    count += characters.length;
  }
  return count;
}

// Helper function to get kurals without characters
function getEmptyKurals(totalKurals = 1330) {
  const withCharacters = new Set(getKuralsWithCharacters());
  const empty = [];
  for (let i = 1; i <= totalKurals; i++) {
    if (!withCharacters.has(i)) {
      empty.push(i);
    }
  }
  return empty;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CHARACTER_DATABASE,
    getCharactersForKural,
    getKuralsWithCharacters,
    getTotalCharacterCount,
    getEmptyKurals
  };
}
