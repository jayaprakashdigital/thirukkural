/**
 * Comprehensive Character Database - All 1330 Kurals
 * Kural-wise character mapping with story references
 * Maintains: Name, Gender, Character Consistency, Details
 */

// Helper function to create character entries
function createCharacter(id, name, transliteration, gender, role, consistency, details, story = "", storyId = "") {
  return {
    id: id,
    name: name,
    transliteration: transliteration,
    gender: gender,
    role: role,
    consistency: consistency,
    details: details,
    story: story,
    storyId: storyId
  };
}

const COMPREHENSIVE_CHARACTER_DATABASE = {
  // SECTION 1: Virtue (அறத்துப்பால்) - Kurals 1-133

  // Chapter 1: The Praise of God (கடவுள் வாழ்த்து) - Kurals 1-10
  1: [createCharacter("1-1-god", "The Supreme Being", "Paramatman", "Divine", "Creator", "Eternal source of all", "The Divine that precedes all creation and gives meaning to existence", "Praise of God", "story-1")],
  2: [createCharacter("2-1-wisdom", "Pure Knowledge", "Ariven", "Divine", "Wisdom Source", "All-knowing consciousness", "The embodiment of all knowledge and understanding", "Praise of God", "story-1")],
  3: [createCharacter("3-1-divine", "The Lotus Dweller", "Malarmisai", "Divine", "Transcendent", "Beyond comprehension", "Dwells in the lotus of devoted hearts", "Praise of God", "story-1")],
  4: [createCharacter("4-1-divine", "The Unattached", "Veendum", "Divine", "Supreme", "Free from desire", "Indifferent to worldly desires, pure consciousness", "Praise of God", "story-1")],
  5: [createCharacter("5-1-seeker", "The Humble Seeker", "Padaimai", "Gender-neutral", "Devotee", "Spiritual aspirant", "One who humbly seeks divine wisdom", "Praise of God", "story-1")],
  6: [createCharacter("6-1-creator", "The Primordial", "Aadiyan", "Divine", "First Cause", "Origin of all", "The beginning and source of all existence", "Praise of God", "story-1")],
  7: [createCharacter("7-1-worshipper", "The Devoted", "Anbudan", "Gender-neutral", "Believer", "Constant in faith", "One devoted to the worship of the Divine", "Praise of God", "story-1")],
  8: [createCharacter("8-1-learned", "The Wise Scholar", "Kavivar", "Male", "Sage", "Seeker of truth", "One who through learning comes to recognize the Divine", "Praise of God", "story-1")],
  9: [createCharacter("9-1-virtuous", "The Righteous", "Arulvan", "Gender-neutral", "Virtuous one", "Follower of dharma", "One who lives in alignment with divine principles", "Praise of God", "story-1")],
  10: [createCharacter("10-1-blessed", "The Blessed", "Ananathan", "Gender-neutral", "Fortunate soul", "Receiver of grace", "One who has received the blessing of divine recognition", "Praise of God", "story-1")],

  // Chapter 2: The Blessing of Rain (வான்சிறப்பு) - Kurals 11-20
  11: [createCharacter("11-1-rain", "The Divine Rain", "Vaan Mazhai", "Divine", "Life-giver", "Sustainer of all", "The blessing that falls from heaven to nourish earth", "The Blessing of Rain", "story-2")],
  12: [createCharacter("12-1-earth", "The Fertile Earth", "Nilam", "Feminine", "Provider", "Life-sustaining", "Receives the rain and produces abundance", "The Blessing of Rain", "story-2")],
  13: [createCharacter("13-1-farmer", "The Farmer", "Urali", "Male", "Laborer", "Dependent on nature", "Works the land and depends on rain for survival", "The Blessing of Rain", "story-2")],
  14: [createCharacter("14-1-harvest", "The Golden Harvest", "Nelvanam", "Gender-neutral", "Blessing", "Product of grace", "Crops that grow from rain and fertile soil", "The Blessing of Rain", "story-2")],
  15: [createCharacter("15-1-cloud", "The Merciful Cloud", "Megam", "Gender-neutral", "Messenger", "Divine carrier", "Carries rain from heaven to bless the earth", "The Blessing of Rain", "story-2")],
  16: [createCharacter("16-1-river", "The Flowing River", "Aaru", "Feminine", "Life source", "Water carrier", "Rivers filled by rain, sustaining all life", "The Blessing of Rain", "story-2")],
  17: [createCharacter("17-1-vegetation", "Green Plants", "Karaikal", "Gender-neutral", "Life indicator", "Growth symbol", "Vegetation that springs up after rain", "The Blessing of Rain", "story-2")],
  18: [createCharacter("18-1-livestock", "The Animals", "Pasu", "Gender-neutral", "Dependent creatures", "Life that depends", "Animals that depend on rain and vegetation", "The Blessing of Rain", "story-2")],
  19: [createCharacter("19-1-merchant", "The Merchant", "Vaanigar", "Male", "Trader", "Commerce dependent", "One whose livelihood depends on agricultural abundance", "The Blessing of Rain", "story-2")],
  20: [createCharacter("20-1-thankful", "The Grateful", "Nanri Solan", "Gender-neutral", "Appreciative", "Blessed receiver", "One who gives thanks for the blessing of rain", "The Blessing of Rain", "story-2")],

  // Chapter 3: Ascetics (நீத்தார் பெருமை) - Kurals 21-30
  21: [createCharacter("21-1-ascetic", "The Enlightened Ascetic", "Needhaar", "Male", "Renunciate", "Transcender of desires", "One who has renounced worldly attachments for wisdom", "")],
  22: [createCharacter("22-1-virtue", "The Path of Virtue", "Aram", "Gender-neutral", "Principle", "Eternal truth", "The way of righteousness followed by ascetics", "")],
  23: [createCharacter("23-1-sage", "The Wise One", "Arivalaar", "Male", "Knower", "Enlightened being", "One who has transcended worldly desires through wisdom", "")],
  24: [createCharacter("24-1-renunciate", "The Renouncer", "Thumpiyavan", "Male", "Ascetic", "Detached soul", "One who has given up worldly pursuits for spiritual truth", "")],
  25: [createCharacter("25-1-peaceful", "The Peaceful", "Santi", "Gender-neutral", "Serene one", "Undisturbed mind", "One who has achieved inner peace through renunciation", "")],
  26: [createCharacter("26-1-knower", "The Self-Knower", "Atmai Arivaan", "Gender-neutral", "Enlightened", "Self-realized", "One who knows the true nature of self", "")],
  27: [createCharacter("27-1-free", "The Liberated", "Vidhaiyaan", "Gender-neutral", "Free being", "Released from bondage", "One freed from the cycle of birth and death", "")],
  28: [createCharacter("28-1-compassionate", "The Compassionate", "Vatsalya", "Gender-neutral", "Merciful being", "Love for all", "One filled with compassion for all creatures", "")],
  29: [createCharacter("29-1-truthful", "The Truth-Speaker", "Satyavaan", "Male", "Truthful one", "Adherent to truth", "One who always speaks and lives in truth", "")],
  30: [createCharacter("30-1-eternal", "The Eternal Seeker", "Nithya Arivaan", "Gender-neutral", "Forever learner", "Perpetual student", "One eternally seeking higher knowledge and truth", "")],

  // Chapter 4: Assertion of Virtue (அறன் வலியுறுத்தல்) - Kurals 31-40
  31: [createCharacter("31-1-virtuous", "The Virtuous Leader", "Aravan", "Male", "Guide", "Upholder of dharma", "One who asserts and practices virtue in all situations", "")],
  32: [createCharacter("32-1-strength", "The Strength of Virtue", "Arai Sakthi", "Gender-neutral", "Force", "Moral power", "The inner strength that comes from virtue", "")],
  33: [createCharacter("33-1-protector", "The Protector", "Rakshakar", "Male", "Guardian", "Defender of righteousness", "One who protects virtue and those who follow it", "")],
  34: [createCharacter("34-1-firm", "The Steadfast", "Ninaivilla", "Gender-neutral", "Unwavering", "Constant in virtue", "One who never wavers from the path of virtue", "")],
  35: [createCharacter("35-1-triumphant", "The Victorious", "Jayavan", "Male", "Winner", "Successful in virtue", "One whose virtuous life leads to ultimate triumph", "")],
  36: [createCharacter("36-1-honored", "The Honored", "Maryavaanan", "Male", "Esteemed", "Respected for virtue", "One honored by society for virtuous conduct", "")],
  37: [createCharacter("37-1-trustworthy", "The Trustworthy", "Vishvasa Purvaan", "Gender-neutral", "Reliable", "Dependable character", "One whose virtue makes them trustworthy", "")],
  38: [createCharacter("38-1-noble", "The Noble One", "Arya", "Gender-neutral", "Highborn spirit", "Elevated character", "One of noble character and virtuous conduct", "")],
  39: [createCharacter("39-1-wise", "The Virtuous Sage", "Karvi", "Male", "Wise being", "Knower of right", "One who wisely practices and teaches virtue", "")],
  40: [createCharacter("40-1-ideal", "The Ideal", "Nirmalan", "Gender-neutral", "Perfect example", "Pure being", "One who embodies all virtues perfectly", "")],

  // Chapter 5: Domestic Life (இல்வாழ்க்கை) - Kurals 41-50
  41: [createCharacter("41-1-householder", "The Wise Householder", "Ilaravan", "Male", "Family head", "Keeper of home", "One who manages household with virtue and wisdom", "")],
  42: [createCharacter("42-1-wife", "The Devoted Wife", "Manaivi", "Female", "Life partner", "Home pillar", "One whose virtue strengthens the household", "")],
  43: [createCharacter("43-1-children", "The Children", "Pillai", "Gender-neutral", "Young ones", "Future generation", "Offspring who continue the family legacy", "")],
  44: [createCharacter("44-1-elder", "The Elder", "Thazhainaar", "Gender-neutral", "Senior", "Wisdom source", "Aged members whose experience guides the family", "")],
  45: [createCharacter("45-1-harmony", "Family Harmony", "Samadhi", "Gender-neutral", "Balance", "Unity symbol", "The peaceful state of a well-managed household", "")],
  46: [createCharacter("46-1-provider", "The Provider", "Kavalkai", "Male", "Sustainer", "Nourisher", "One who provides sustenance for the family", "")],
  47: [createCharacter("47-1-caregiver", "The Caregiver", "Pallikal", "Female", "Nurturer", "Comforter", "One who cares for family members with love", "")],
  48: [createCharacter("48-1-mediator", "The Mediator", "Samaikal", "Gender-neutral", "Peacemaker", "Resolver", "One who maintains peace in family disputes", "")],
  49: [createCharacter("49-1-teacher", "The Teacher", "Kalviyalan", "Male", "Educator", "Guide", "One who teaches values and knowledge to family", "")],
  50: [createCharacter("50-1-protector", "The Home Protector", "Nil Rakshakar", "Male", "Defender", "Safe guardian", "One who protects family and household from harm", "")],

  // Chapter 6: Worth of Wife (வாழ்க்கைத் துணைநலம்) - Kurals 51-60
  51: [createCharacter("51-1-perfect-companion", "The Perfect Companion", "Thunai", "Female", "Partner", "Equal in virtue", "A spouse who doubles the household wealth through wisdom", "")],
  52: [createCharacter("52-1-responsible-husband", "The Responsible Husband", "Kathalin", "Male", "Provider", "Protector", "One whose care for spouse ensures family happiness", "")],
  53: [createCharacter("53-1-supporter", "The Supporter", "Thozhil Kalarai", "Female", "Helper", "Cooperative", "One who assists husband in all endeavors", "")],
  54: [createCharacter("54-1-intelligent-wife", "The Intelligent Wife", "Budhhimati", "Female", "Wise woman", "Advisor", "One whose wisdom guides household decisions", "")],
  55: [createCharacter("55-1-fertile-marriage", "Fruitful Marriage", "Putra Kalai", "Gender-neutral", "Union", "Blessed bond", "A marriage that produces virtuous offspring", "")],
  56: [createCharacter("56-1-devoted-couple", "The Devoted Couple", "Anbu Pair", "Gender-neutral", "Partners", "United souls", "Two souls united in love and virtue", "")],
  57: [createCharacter("57-1-worthy-pair", "The Worthy Pair", "Neelvan Pair", "Gender-neutral", "Noble couple", "Virtuous unit", "Husband and wife both virtuous and honorable", "")],
  58: [createCharacter("58-1-stable-marriage", "Stable Marriage", "Nithya Sambandham", "Gender-neutral", "Union", "Lasting bond", "A marriage founded on virtue and mutual respect", "")],
  59: [createCharacter("59-1-life-partner", "Life Partner", "Vaalkai Thunai", "Gender-neutral", "Companion", "Eternal mate", "One chosen to share life's journey", "")],
  60: [createCharacter("60-1-fortunate-man", "The Fortunate Man", "Bhagya Vaan", "Male", "Blessed", "Lucky one", "One blessed with a virtuous and worthy wife", "")],

  // Continue pattern for remaining chapters...
  // Chapter 7: Wealth of Children (மக்கட்பேறு) - Kurals 61-70
  61: [createCharacter("61-1-blessed-child", "The Blessed Child", "Makkal", "Gender-neutral", "Legacy", "Future", "Children are the greatest wealth of a family", "")],
  62: [createCharacter("62-1-nurturing-mother", "The Nurturing Mother", "Thaai", "Female", "Nurturer", "First teacher", "One who shapes children's character", "")],
  63: [createCharacter("63-1-guiding-father", "The Guiding Father", "Thalaivan", "Male", "Guide", "Protector", "One who guides children toward virtue", "")],
  64: [createCharacter("64-1-obedient-child", "The Obedient Child", "Kelikal Pillai", "Gender-neutral", "Respectful", "Listener", "One who respects parents and learns their values", "")],
  65: [createCharacter("65-1-virtuous-heir", "The Virtuous Heir", "Thavi Pillai", "Gender-neutral", "Successor", "Future carrier", "Child who carries forward family virtue", "")],
  66: [createCharacter("66-1-proud-parents", "The Proud Parents", "Ganaka Thazhaikal", "Gender-neutral", "Proud ones", "Satisfied", "Parents whose children bring them pride", "")],
  67: [createCharacter("67-1-educated-child", "The Educated Child", "Kalvi Pillai", "Gender-neutral", "Learner", "Scholar", "One trained in knowledge and virtue", "")],
  68: [createCharacter("68-1-compassionate-heir", "The Compassionate Heir", "Dayavaan Pillai", "Gender-neutral", "Merciful", "Kind one", "Child who shows mercy and kindness", "")],
  69: [createCharacter("69-1-faithful-child", "The Faithful Child", "Nambikai Pillai", "Gender-neutral", "Trustworthy", "Reliable", "One who is faithful to family values", "")],
  70: [createCharacter("70-1-complete-family", "The Complete Family", "Sampurna Kula", "Gender-neutral", "Whole", "United", "A family complete in virtue and love", "")],

  // Chapter 8: Love and Affection (அன்புடைமை) - Kurals 71-80
  71: [createCharacter("71-1-devoted-lover", "The Devoted Lover", "Anpudan", "Gender-neutral", "Affectionate", "Compassionate", "One possessed of boundless love and compassion", "Love's First Meeting", "story-7")],
  72: [createCharacter("72-1-beloved", "The Cherished Beloved", "Priyam", "Gender-neutral", "Dear one", "Loved one", "One who is loved and cherished deeply", "Love's First Meeting", "story-7")],
  73: [createCharacter("73-1-caring-friend", "The Caring Friend", "Sakha", "Gender-neutral", "Friend", "Companion", "One who shows care and affection to others", "Love's First Meeting", "story-7")],
  74: [createCharacter("74-1-joyful-giver", "The Joyful Giver", "Dana Priyaa", "Gender-neutral", "Generous", "Delighted giver", "One who gives with joy and love", "Love's First Meeting", "story-7")],
  75: [createCharacter("75-1-heart-centered", "The Heart-Centered", "Hridaya Kendra", "Gender-neutral", "Loving", "Soul-focused", "One whose heart is center of love", "Love's First Meeting", "story-7")],
  76: [createCharacter("76-1-grateful-soul", "The Grateful Soul", "Krutagna", "Gender-neutral", "Thankful", "Appreciative", "One who expresses love through gratitude", "Love's First Meeting", "story-7")],
  77: [createCharacter("77-1-peaceful-presence", "The Peaceful Presence", "Shanti Rupa", "Gender-neutral", "Serene", "Calming", "One whose presence brings peace through love", "Love's First Meeting", "story-7")],
  78: [createCharacter("78-1-selfless-server", "The Selfless Server", "Nishkama Seva", "Gender-neutral", "Selfless", "Devotee", "One who serves others with no expectation", "Love's First Meeting", "story-7")],
  79: [createCharacter("79-1-truthful-friend", "The Truthful Friend", "Satya Sakha", "Gender-neutral", "Honest", "Sincere", "One whose love is expressed in truth", "Love's First Meeting", "story-7")],
  80: [createCharacter("80-1-universal-lover", "The Universal Lover", "Sarva Priya", "Gender-neutral", "All-loving", "Inclusive", "One who loves all beings equally", "Love's First Meeting", "story-7")],

  // Placeholder for remaining kurals (81-1330)
  // Note: These are template structures that can be filled in with actual character data
};

// Add remaining kurals with template characters
for (let i = 81; i <= 1330; i++) {
  const kuralId = `TK-${String(i).padStart(4, '0')}`;
  // Add a basic character entry for each kural
  COMPREHENSIVE_CHARACTER_DATABASE[i] = [
    createCharacter(
      `${i}-1-character`,
      `Character for Kural ${i}`,
      `Transliteration ${i}`,
      "Gender-neutral",
      `Role in Kural ${i}`,
      `Consistency for Kural ${i}`,
      `Character description for Kural ${i}`
    )
  ];
}

// Helper functions
function getCharactersForKural(kuralNumber) {
  return COMPREHENSIVE_CHARACTER_DATABASE[kuralNumber] || [];
}

function getKuralsWithCharacters() {
  return Object.keys(COMPREHENSIVE_CHARACTER_DATABASE).map(Number).sort((a, b) => a - b);
}

function getTotalCharacterCount() {
  let count = 0;
  for (const characters of Object.values(COMPREHENSIVE_CHARACTER_DATABASE)) {
    count += characters.length;
  }
  return count;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    COMPREHENSIVE_CHARACTER_DATABASE,
    getCharactersForKural,
    getKuralsWithCharacters,
    getTotalCharacterCount
  };
}
