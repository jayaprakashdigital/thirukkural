/* ============================================================
   Story Library — stories.js  v3
   Master-prompt compliant · 60–90 sec animation format
   4 scenes: Hook / Story / Tamil Dialogue / Thiruvalluvar
   Unique ID: TK-0001 … TK-1330
   ============================================================ */
const THEME_KEY = "thirukkural-theme";
const ICONS = {
  sun:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
};
function kuralId(n){ return 'TK-'+String(n).padStart(4,'0'); }

/* ============================================================
   CHAPTER_STORIES  — all 133 chapters
   Fields: emoji, color, theme, title, location,
           chars[], emotion,
           hook        (3-5 sec visual hook)
           story       (main scene, real-life)
           dialogue    (Tamil spoken lines)
           tv          (Thiruvalluvar's explanation + recital cue)
           moral       (one-line takeaway)
   ============================================================ */
const CS = {};   // shorthand — assigned below

/* ── 1–10  கடவுள் வாழ்த்து · Praise of God ─────────────────── */
CS[1]={emoji:"🏗️",color:"gold",theme:"Faith & Beginnings",
  title:"அஜோ! கூரையிலிருந்து ஆரம்பிக்கலாமா?",
  location:"Madurai · A home under construction",chars:["Kavitha (7)","Appa"],
  emotion:"Curiosity · Family love",
  hook:"A half-built house. A little girl picks up the roof tile and tries to balance it in the air. It crashes. She stares.",
  story:"Appa and Kavitha are building a small clay-brick model of their dream home in the courtyard. Kavitha excitedly grabs the roof piece first. 'Appa, roofவை முதல்ல வைக்கலாம்!' Appa laughs. 'அப்படி வைச்சா முழு வீடும் விழுந்துடும், கண்ணு.' They start from the flat base stones together, laying each level slowly. As the little house grows solid, Kavitha looks at the strong foundation with wonder. 'இதுவே வீட்டை தாங்குதா?' 'ஆமா,' says Appa. 'Foundation இல்லாம எதுவும் நிக்காது.'",
  dialogue:"Kavitha: 'Appa, கூரையிலிருந்து ஆரம்பிக்கலாமா?'\nAppa: 'அப்படி வைச்சா முழு வீடும் விழுந்துடும், கண்ணு.'\nKavitha: 'அதனால foundation முக்கியமா?'\nAppa: 'உலகம் முழுக்க அப்படித்தான். எல்லாத்துக்கும் ஒரு முதல் இருக்கு.'",
  tv:"Time slows. A warm golden light fills the courtyard. Thiruvalluvar walks in quietly, smiles at the little clay house, and kneels beside the foundation stones.\n\n'பாரு கண்ணு — எழுத்துக்கள் எல்லாம் அ-வில் தொடங்குது. அதுபோலவே உலகம் முழுக்க ஒரு முதல் காரணம் இருக்கு — ஆதி பகவன். அவர் இல்லாம எதுவும் இல்ல. அவரே எல்லாத்தோட அடிப்படை.'\n\nHe recites softly:\n「அகர முதல எழுத்தெல்லாம் ஆதி\nபகவன் முதற்றே உலகு.」",
  moral:"Everything needs a foundation — God is the foundation of the universe.",
};

CS[2]={emoji:"📖",color:"blue",theme:"Purpose of Learning",
  title:"98 மார்க்கும் வெற்றிடமா?",
  location:"Trichy · Government school",chars:["Arjun (12)","Teacher Meenakshi"],
  emotion:"Surprise · Respect",
  hook:"Arjun waves his exam paper — 98/100. He shouts 'I'm the best!' His teacher watches quietly from the doorway with a sad smile.",
  story:"Arjun is the top student. He walks with his chin up, corrects teachers in class, never says thank you. One afternoon Teacher Meenakshi asks the class a simple question: 'உங்களுக்கு கற்றுக்கொடுத்தவங்களை நீங்க வணங்குவீங்களா?' The class laughs. Arjun rolls his eyes. She calls him after school. 'Arjun, உன்னோட 98 மார்க்கு அழகுதான். ஆனா அந்த அறிவு உன்னை பணிவுள்ளவனா ஆக்குதா?' He has no answer.",
  dialogue:"Arjun: 'நான் best student. என்னோட mark பாரு!'\nTeacher: 'மார்க் பார்த்தேன். உன் மனசை பார்க்கல.'\nArjun: 'அதென்ன அர்த்தம்?'\nTeacher: 'கற்றது ஒருத்தனை அடக்கமா ஆக்கணும். இல்லன்னா அந்த கல்வி எதுக்காக?'",
  tv:"The classroom empties. A gentle golden light enters through the window. Thiruvalluvar sits across from Arjun.\n\n'கண்ணா, கல்வி என்பது தலையை உயர்த்தவல்ல — மனசை உயர்த்தவது. தூய அறிவின் திருவடிகளை வணங்காத கல்வி வெறும் காகிதம்தான்.'\n\n「கற்றதனால் ஆய பயனென்கொல் வாலறிவன்\nநற்றாள் தொழாஅர் எனின்.」",
  moral:"Learning without humility and gratitude is empty — knowledge must lead to wisdom.",
};

CS[3]={emoji:"🌺",color:"teal",theme:"Living a Good Life",
  title:"பூவாய் மலர்ந்த மனசு",
  location:"Kumbakonam · Temple street at dawn",chars:["Meena (8)","Paati (65)"],
  emotion:"Family love · Happiness",
  hook:"Dawn. A little girl runs barefoot carrying jasmine flowers, her hair still messy from sleep. She's laughing.",
  story:"Every morning Meena and her Paati walk to the Kumbakonam temple together. Meena holds the jasmine garland carefully. 'Paati, நாம் ஏன் தினமும் வருவோம்?' Paati smiles. 'நம் மனசே ஒரு பூவு. அந்த பூவுல கடவுள் இருக்காரு. அவரோட அடியை மனசுல வச்சிருந்தா, நீ எங்கே போனாலும் நல்லா வாழுவே.' Meena looks at the flower in her hand. She holds it more gently.",
  dialogue:"Meena: 'Paati, ஏன் தினமும் கோவிலுக்கு வருவோம்?'\nPaati: 'மனசை தூய்மையா வச்சுக்கணும், கண்ணு.'\nMeena: 'எப்படி?'\nPaati: 'அன்போட வாழு. கடவுளை மனசுல தாங்கு. அவரை நம்பி வாழுவோர் உலகில் நீடு வாழுவார்.'",
  tv:"The temple bells ring. Soft golden light. Thiruvalluvar stands near the temple entrance.\n\n'மலர்ந்த மனசுல கடவுள் வாழ்கிறார். அவரோட அடியை சேர்ந்தவங்க இந்த உலகிலேயே நீண்ட நல்வாழ்க்கை வாழுவார்கள்.'\n\n「மலர்மிசை ஏகினான் மாணடி சேர்ந்தார்\nநிலமிசை நீடுவாழ் வார்.」",
  moral:"Those who hold God in their heart like a blooming flower shall flourish long on this earth.",
};

CS[4]={emoji:"⚖️",color:"gold",theme:"Freedom from Suffering",
  title:"பேராசை பிடிச்ச பையன்",
  location:"Coimbatore · Home",chars:["Senthil (10)","Thatha (70)"],
  emotion:"Surprise · Inner peace",
  hook:"Senthil cries because his friend got a new cricket bat. He throws his old bat across the room.",
  story:"Senthil cannot stop thinking about things he doesn't have — new shoes, new phone, new bat. He is miserable despite having everything he needs. His Thatha watches. One evening they sit on the rooftop. 'Thatha, என்னால ஏன் சந்தோஷமா இருக்கவே முடியல?' Thatha points at the stars. 'அந்த நட்சத்திரம் தன்னோட ஜோடியை தேடுதா? வேற நட்சத்திரத்தை பார்த்து அழுதா?' Senthil is quiet.",
  dialogue:"Senthil: 'என் friend-கிட்ட bat இருக்கு. என்கிட்ட இல்ல. Fair-ஆ இருக்கா?'\nThatha: 'அவன்கிட்ட இல்லாத என்ன உன்கிட்ட இருக்கு?'\nSenthil: '...நான் யோசிக்கல.'\nThatha: 'விருப்பு வெறுப்பை விட்டவன்கிட்டே துன்பம் வராது.'",
  tv:"Night sky. Golden light between stars. Thiruvalluvar sits beside Senthil.\n\n'கண்ணா, விரும்புவதும் வெறுப்பதும் — இரண்டுமே துன்பத்தின் வேர்கள். அதை விட்டவன்கிட்டே எந்த கஷ்டமும் வராது.'\n\n「வேண்டுதல் வேண்டாமை இலானடி சேர்ந்தார்க்கு\nயாண்டும் இடும்பை இல.」",
  moral:"Letting go of strong likes and dislikes brings freedom from suffering.",
};

CS[5]={emoji:"🌾",color:"gold",theme:"Praise of God",
  title:"இரண்டு விதைகள்",
  location:"Thanjavur · Paddy farm",chars:["Rajan (11)","Farmer Appa"],
  emotion:"Curiosity · Wonder",
  hook:"A farmer plants two seeds side by side. He waters only one. His son watches with a frown.",
  story:"Rajan asks why. 'ஒரு விதைக்கு மட்டும் தண்ணி ஊத்துற? ரெண்டு விதையும் வளரட்டுமே?' Appa says: 'ஒரு விதை நல்லது. ஒரு விதை கெட்டது. நல்ல விதைக்கு மட்டும் தண்ணி.' Days pass. The good seed grows tall and green. Rajan asks: 'Appa, நல்ல விதையை எப்படி தெரியும்?' 'கடவுளின் உண்மை புகழை விரும்புபவன் நல்ல விதை. அவனுக்கு நல்ல வினையும் தீய வினையும் ஒட்டாது.'",
  dialogue:"Rajan: 'ஏன் ஒரு விதைக்கு மட்டும் தண்ணி?'\nAppa: 'நல்ல விதை, கெட்ட விதை — ரெண்டும் ஒரே மண்ணுலதான் இருக்கு.'\nRajan: 'நாம் எந்த விதை?'\nAppa: 'கடவுளை மனசுல வச்சு வாழுவோம். அதுவே நல்ல விதை.'",
  tv:"Sunset over the farm. Golden light washes the field. Thiruvalluvar walks between the rows of crops.\n\n'கடவுளின் மெய்யான புகழை விரும்புபவனிடம் இருளில் பிறந்த நல்வினை தீவினை இரண்டும் ஒட்டாது.'\n\n「இருள்சேர் இருவினையும் சேரா இறைவன்\nபொருள்சேர் புகழ்புரிந்தார் மாட்டு.」",
  moral:"Those who truly praise God are untouched by the fruits of both good and bad deeds.",
};

CS[6]={emoji:"🧠",color:"blue",theme:"Self-Control",
  title:"ஐந்து ஜன்னல்கள்",
  location:"Coimbatore · Classroom",chars:["Priya (12)","Teacher Kumar"],
  emotion:"Curiosity · Respect",
  hook:"Teacher points to five open windows. 'If no one is home, what happens?' Students are confused.",
  story:"Teacher Kumar asks the class a riddle: 'ஒரு வீட்டுல ஐந்து ஜன்னல் திறந்திருக்கு. ஆனா வீட்டுல யாரும் இல்ல. அந்த வீடு என்னாகும்?' Students answer: 'காத்து வரும், மழை வரும், திருடன் வருவான்.' Teacher nods. 'உங்க கண், காது, மூக்கு, வாய், உடம்பு — இதுவே உங்க ஐந்து ஜன்னல்கள். Master இல்லாம திறந்துவிட்டா?' Priya slowly closes her notebook. She understands.",
  dialogue:"Teacher: 'ஐந்து ஜன்னல் திறந்த வீட்டுல யாரும் இல்லன்னா என்ன ஆகும்?'\nStudent: 'எல்லாரும் உள்ள நுழைவாங்க.'\nTeacher: 'நம்ம ஐம்புலன்களும் அப்படித்தான். Master இல்லன்னா எல்லா ஆசையும் உள்ள வரும்.'\nPriya: 'அதுக்கு என்ன பண்ணணும்?'\nTeacher: 'Master-ஆ நீயே இரு.'",
  tv:"School empties. Evening light. Thiruvalluvar sits at the teacher's desk.\n\n'ஐம்பொறிகளையும் கட்டுப்படுத்தியவன் காட்டும் வழியில் நடப்பவர்கள் நீண்ட நல்வாழ்க்கை வாழுவார்கள்.'\n\n「பொறிவாயில் ஐந்தவித்தான் பொய்தீர் ஒழுக்க\nநெறிநின்றார் நீடுவாழ் வார்.」",
  moral:"Those who walk the path of one who has mastered the five senses shall prosper long.",
};

CS[7]={emoji:"😰",color:"teal",theme:"Anxiety and God",
  title:"தேர்வு இரவு",
  location:"Chennai · Small apartment",chars:["Murugan (14)","Amma"],
  emotion:"Fear · Peace",
  hook:"2 AM. A boy stares at his textbook, hands shaking, unable to read. Tears on the page.",
  story:"Murugan has his board exam tomorrow. He has studied but fear has paralysed him. His Amma wakes up and finds him trembling. She makes him warm milk. 'Amma, என்னால படிக்கவே முடியல. மனசு ஓடுது.' She sits beside him. 'படிச்சாச்சு. இப்ப விடு.' 'விட முடியல.' She takes his hand. 'கடவுளிடம் விடு.' They sit in silence. Slowly, Murugan's breathing steadies.",
  dialogue:"Murugan: 'Amma, என் மனசு ஆறல. ஏன்?'\nAmma: 'நீ அதை control பண்ண முயற்சிக்கிற. அதனால ஆறல.'\nMurugan: 'எப்படி ஆற வைக்கிறது?'\nAmma: 'ஒப்பில்லாதவன் பாதத்தை மனசுல வச்சா. மனக்கவலை மாறும்.'",
  tv:"Silence. A warm glow fills the room. Thiruvalluvar sits near the window.\n\n'ஒப்பில்லாதவன் திருவடிகளை சேர்ந்தவர்களுக்கே மனக்கவலை மாறும். வேற எந்த வழியிலும் அது முழுசா போகாது.'\n\n「தனக்குவமை இல்லாதான் தாள்சேர்ந்தார்க் கல்லால்\nமனக்கவலை மாற்றல் அரிது.」",
  moral:"The only true relief from anxiety comes from surrendering to God.",
};

CS[8]={emoji:"🌊",color:"teal",theme:"Crossing Life's Ocean",
  title:"கடலையும் கடந்த படகு",
  location:"Rameswaram · Fishing village",chars:["Anbu (10)","Old Fisherman Selvam"],
  emotion:"Courage · Wonder",
  hook:"Dawn. A tiny wooden boat sets out into a massive grey sea. A boy watches from the shore with wide eyes.",
  story:"Anbu asks old Selvam how he crosses the sea every day without fear. 'என் boat மட்டும் போகுதா? நம்பிக்கையும் வருது.' The boy points to stormy clouds. 'இன்னைக்கு போவீங்களா?' Selvam nods. 'கஷ்டம் இருக்கும். ஆனா நான் தனியா இல்ல. அறக்கடலான இறைவனை மனசுல வச்சிருக்கேன்.' The boat returns safely that evening. Selvam simply says: 'பார்த்தியா?'",
  dialogue:"Anbu: 'இவ்வளவு பெரிய கடல். பயமா இல்லையா?'\nSelvam: 'இருக்கு. ஆனா ஒரு நம்பிக்கை இருக்கு.'\nAnbu: 'என்ன நம்பிக்கை?'\nSelvam: 'அறக்கடலான இறைவன் என்னோட anchor.'",
  tv:"The sea calms at sunset. Golden light on the water. Thiruvalluvar stands at the water's edge.\n\n'அறக்கடலான கடவுளின் திருவடிகளை சேர்ந்தவர்களுக்கே பிறவியின் பெருங்கடலை கடக்க முடியும்.'\n\n「அறவாழி அந்தணன் தாள்சேர்ந்தார்க் கல்லால்\nபிறவாழி நீந்தல் அரிது.」",
  moral:"Only those who hold to God — the sea of virtue — can cross the great ocean of life.",
};

CS[9]={emoji:"🤦",color:"rose",theme:"Bowing to Wisdom",
  title:"இருந்தும் பயனில்லாத தலை",
  location:"Madurai · Home",chars:["Kavitha (9)","Grandfather Murugesan"],
  emotion:"Curiosity · Wisdom",
  hook:"Grandfather looks at a fancy vase that can't hold water. 'Beautiful. Useless.' He sets it down.",
  story:"Kavitha asks why Grandfather bowed deeply at the temple while others just touched the idol quickly. 'Thatha, எல்லாரும் ஒரே touch பண்றாங்க, நீ மட்டும் ஏன் இப்படி வணங்குற?' He sits with her. 'அந்த மூவரையும் பார்' — he points to three men outside: one stares at his phone, one gossips, one argues. 'கண்கள் இருக்கு பார்க்கல. செவி இருக்கு கேக்கல. தலை இருக்கு வணங்கல. அப்படிப்பட்ட தலை எதுக்கு இருக்கு?'",
  dialogue:"Kavitha: 'Thatha, ஏன் நீ இவ்வளவு ஆழமா வணங்குற?'\nThatha: 'என் தலையை உபயோகிக்கிறேன்.'\nKavitha: 'தலை வணங்குவதுக்கா?'\nThatha: 'பயனில்லாத sense போல, வணங்காத தலை பயனில்லாதது.'",
  tv:"Temple corridor. Soft gold light. Thiruvalluvar kneels beside the girl.\n\n'பொறிகள் இயங்காவிட்டால் எப்படி பயனில்லையோ, அப்படியே எண் குணத்தான் திருவடிகளை வணங்காத தலையும் பயனில்லாதது.'\n\n「கோளில் பொறியின் குணமிலவே எண்குணத்தான்\nதாளை வணங்காத் தலை.」",
  moral:"A head that never bows to wisdom is as useless as a sense that cannot function.",
};

CS[10]={emoji:"⚓",color:"gold",theme:"God as Anchor",
  title:"நங்கூரமில்லா படகு",
  location:"Chennai · Marina Beach",chars:["Karthik (13)","Uncle Engineer"],
  emotion:"Curiosity · Hope",
  hook:"A boat drifting without anchor in rough waves. A boy watches it slam against rocks.",
  story:"Karthik is drifting in life — skipping class, falling in with the wrong crowd, no direction. His uncle takes him to Marina Beach and points to a drifting boat. 'அந்த படகு பார். நல்ல படகு, நல்ல மரம், ஆனா நங்கூரம் இல்ல.' The boat smashes into rocks. 'என் வாழ்க்கை அது மாதிரி இருக்கா?' asks Karthik quietly. Uncle nods. 'அப்ப என்ன பண்ணணும்?' 'நங்கூரம் போடு.'",
  dialogue:"Karthik: 'அந்த படகு நல்லாதானே இருக்கு?'\nUncle: 'நல்லா இருக்கு. ஆனா நங்கூரம் இல்ல.'\nKarthik: 'அதுவே problem-ஆ?'\nUncle: 'வாழ்க்கையில் இறைவன் அடியே நம் நங்கூரம். அது இல்லன்னா... பார்.'",
  tv:"Waves crash. Gold light over the sea. Thiruvalluvar stands at the water's edge.\n\n'இறைவன் அடியை சேர்ந்தவர்கள் பிறவிப் பெருங்கடலை நீந்துவார்கள். சேராதவர்கள் நீந்தவே மாட்டார்கள்.'\n\n「பிறவிப் பெருங்கடல் நீந்துவர் நீந்தார்\nஇறைவன் அடிசேரா தார்.」",
  moral:"Without God as your anchor, you drift — with Him, you cross any ocean.",
};

/* ── 11–20  வான்சிறப்பு · The Blessing of Rain ─────────────── */
CS[11]={emoji:"🌧️",color:"teal",theme:"Value of Rain",
  title:"அமிழ்தம் என்பது என்ன?",
  location:"Thanjavur · Paddy fields",chars:["Meena (8)","Farmer Gopal"],
  emotion:"Wonder · Gratitude",
  hook:"A dry cracked field. One drop of rain falls on a child's outstretched palm. She stares at it.",
  story:"Meena visits her uncle Gopal's farm during a drought. The field is dust. She asks 'Chithappa, தண்ணி போட்டா வளராதா?' He points to the sky. 'மழை வரணும். அதுவே எல்லாம்.' She asks why he doesn't buy water. 'Rain-ஐ யாராலயும் buy பண்ண முடியாது. அது கடவுளோட கொடை.' That night rain comes. The whole family stands in the doorway watching silently.",
  dialogue:"Meena: 'Chithappa, ஏன் மழை இல்லன்னா இவ்வளவு பயமா இருக்கு?'\nGopal: 'மழை இல்லன்னா உணவு இல்ல. உணவு இல்லன்னா உயிர் இல்ல.'\nMeena: 'அது அமிழ்தம் மாதிரி?'\nGopal: 'அமிழ்தம்தான்! உலகம் மழையாலேயே வாழுது.'",
  tv:"Rain falls gently. Golden light through the clouds. Thiruvalluvar stands in the wet field.\n\n'உலகம் தொடர்ந்து வாழ்வதற்கு காரணம் மழை. அதனால் மழையே உலகுக்கு அமிழ்தம் என்று உணர்வதற்குரியது.'\n\n「வான்நின்று உலகம் வழங்கி வருதலால்\nதான்அமிழ்தம் என்றுணரற் பாற்று.」",
  moral:"Rain sustains all life — it is the ambrosia of the world.",
};

CS[12]={emoji:"🍲",color:"teal",theme:"Rain as Food",
  title:"மழையே உணவு",
  location:"Kumbakonam · Kitchen",chars:["Selvi (7)","Paati (65)"],
  emotion:"Wonder · Gratitude",
  hook:"Paati stirs a pot of rice. Selvi asks: 'Paati, இந்த சோறு எங்கிருந்து வருது?'",
  story:"Paati takes Selvi on a journey — backwards. 'கடையிலிருந்து. அதுக்கு முன்னாடி? Farmer-கிட்டிருந்து. அவருக்கு முன்னாடி? நிலத்திலிருந்து. நிலத்துக்கு முன்னாடி? மழையிலிருந்து.' Selvi's eyes widen. 'So everything comes from rain?' 'ஆமா. And we drink rain-water itself every day. Rain makes our food AND is our drink. It gives twice.'",
  dialogue:"Selvi: 'இந்த சோறு எங்கிருந்து வந்துச்சு?'\nPaati: 'விவசாயியிடமிருந்து.'\nSelvi: 'விவசாயிக்கு?'\nPaati: 'மழையிலிருந்து. மழை விளைவிக்கிறது, மழையே குடிக்கிறோம். இரண்டும் ஒன்றே.'",
  tv:"Steam rises from the rice pot. Golden light. Thiruvalluvar sits at the kitchen doorway.\n\n'மழை உணவை விளைவிக்கிறது. அந்த மழையே நாம் குடிக்கும் நீராகவும் இருக்கிறது. இரட்டை வடிவில் மழை நமக்கு உணவாகிறது.'\n\n「துப்பார்க்குத் துப்பாய துப்பாக்கித் துப்பார்க்குத்\nதுப்பாய தூஉம் மழை.」",
  moral:"Rain gives us food to eat and water to drink — it nourishes us twice.",
};

CS[13]={emoji:"😟",color:"rose",theme:"Famine Without Rain",
  title:"கடல் இருந்தும் தாகம்",
  location:"Chennai · Drought summer",chars:["Karthik (11)","Mother"],
  emotion:"Empathy · Reality",
  hook:"A child turns the tap. Nothing comes. He turns it again. Silence.",
  story:"Chennai summer. Water is rationed. Karthik asks his mother why. 'மழை வரல, கண்ணு.' 'But Amma, we live near the sea!' 'கடல் தண்ணி உப்பு. குடிக்க முடியாது. மழை மட்டும்தான் நம்ம உயிர்.' They watch the news — distant villages facing starvation. Karthik stares at the half-full water bucket. He uses only what he needs.",
  dialogue:"Karthik: 'Amma, தண்ணி வரல ஏன்?'\nAmma: 'மழை இல்ல.'\nKarthik: 'ஆனா கடல் இருக்கே?'\nAmma: 'கடல் நீர் உப்பு. மழை நீர்தான் உயிர். மழை இல்லன்னா கடல் சூழ்ந்த உலகமும் பசியால் வருந்தும்.'",
  tv:"Dry earth cracking. Distant sound of thunder. Thiruvalluvar stands near the empty water tank.\n\n'மழை பொய்த்தால் விரிந்த கடல் சூழ்ந்த பெரிய உலகத்திலேயே பசி உள்ளே நின்று உயிர்களை வருத்தும்.'\n\n「விண்இன்று பொய்ப்பின் விரிநீர் வியனுலகத்து\nஉள்நின்று உடற்றும் பசி.」",
  moral:"Even surrounded by ocean, without rain the world suffers hunger.",
};

CS[14]={emoji:"🌾",color:"gold",theme:"Rain and Farming",
  title:"ஏர் நின்றது ஏன்?",
  location:"Thanjavur · Farm",chars:["Rajan (10)","Farmer Appa"],
  emotion:"Empathy · Respect",
  hook:"A plough sits still in a dry field. A farmer sits beside it with his head in his hands.",
  story:"Rajan sees his Appa sitting motionless beside his plough. 'Appa, ஏன் உழல??' 'மழை இல்ல.' 'But we have a plough, oxen, seeds — everything!' 'மழை இல்லன்னா ஏர் ஓட்டி என்ன ஆகும்? விதை மண்ணுல புதைஞ்சு சாகும்.' Rajan puts his small hand on the cold iron plough. He feels its helplessness.",
  dialogue:"Rajan: 'Appa, ஏன் ஏர் இல்லன்னா உழல?'\nAppa: 'மழை இல்ல.'\nRajan: 'ஆனா ஏர் இருக்கே!'\nAppa: 'மழை இல்லன்னா ஏர் கொண்டு உழவர் உழார். அந்த வருவாய் வளம் குன்றினால் எல்லாமே நிற்கும்.'",
  tv:"Still field. Evening light. Thiruvalluvar walks through the dusty furrows.\n\n'மழை என்னும் வருவாய் வளம் குன்றிவிட்டால், உழவரும் ஏர் கொண்டு உழமாட்டார். மழையே வாழ்வின் அச்சு.'\n\n「ஏரின் உழாஅர் உழவர் புயல்என்னும்\nவாரி வளங்குன்றிக் கால்.」",
  moral:"Without rain, even the hardest-working farmer cannot plough — rain is the axis of all life.",
};

CS[15]={emoji:"🌦️",color:"teal",theme:"Rain Restores",
  title:"கஷ்டம் கொடுத்தவனே காப்பான்",
  location:"Madurai · Village",chars:["Selvi (9)","Village Elder Muniamma"],
  emotion:"Hope · Resilience",
  hook:"A family sits in a ruined house after drought. Then — rain begins. The mother starts crying with relief.",
  story:"After two seasons of drought, Selvi's family has almost nothing. Then the rains return. The village erupts in celebration. Selvi asks elder Muniamma: 'The rain is what hurt us. Now the same rain saves us. How can one thing do both?' Muniamma smiles. 'மழை கெடுக்கிறது. மழையே எடுக்கிறது. கொடுத்தவனே மீட்பான்.'",
  dialogue:"Selvi: 'மழை தான் கஷ்டம் கொடுத்துச்சு. அதே மழை காக்குதா?'\nMuniamma: 'ஆமா, கண்ணு. அதுவே வாழ்க்கை.'\nSelvi: 'அது fair-ஆ இருக்கா?'\nMuniamma: 'Fair இல்லன்னாலும் உண்மை. கெடுப்பதும் எடுப்பதும் மழையே.'",
  tv:"Rain and sun together. A rainbow. Thiruvalluvar stands at the edge of the clearing sky.\n\n'மழை கெடுப்பதும், கெட்டவர்களை மீட்பதும் எல்லாமே மழைதான். அதுவே உலகின் பெரிய ஆசிரியன்.'\n\n「கெடுப்பதூஉம் கெட்டார்க்குச் சார்வாய்மற் றாங்கே\nஎடுப்பதூஉம் எல்லாம் மழை.」",
  moral:"Rain both ruins and restores — the same force that hurts can heal.",
};

CS[16]={emoji:"🌱",color:"teal",theme:"Rain Brings Life",title:"வெறும் மண்ணும் விழி விழிக்கும்",location:"Madurai · Dry hillside",chars:["Arjun (9)","Uncle"],emotion:"Wonder",
  hook:"A completely bare brown hill. Not one blade of grass. A boy traces the barren soil with his finger.",
  story:"Arjun visits his uncle's village in summer. The hillside is completely bare. One week later, rain comes overnight. The next morning Arjun runs outside and stops in shock — tiny green blades everywhere. 'Enna aachu?!' His uncle smiles. 'மழை வந்துச்சு.'",
  dialogue:"Arjun: 'நேத்து ஒண்ணுமே இல்லன்னா இப்ப எல்லாமே வந்துட்டே?'\nUncle: 'மழை ஒரு துளி விழுந்தாலே போதும்.'\nArjun: 'அது இவ்வளவு powerful-ஆ?'\nUncle: 'மழை இல்லன்னா ஒரு புல்லும் தலை காட்டாது.'",
  tv:"Green shoots everywhere. Morning light. Thiruvalluvar kneels and touches the new grass.\n\n'வானில் மழை இல்லன்னா ஒரு பசும்புல்லும் தலை காட்டாது. மழையே பசுமையின் தாய்.'\n\n「விசும்பின் துளிவீழின் அல்லால்மற் றாங்கே\nபசும்புல் தலைகாண்பு அரிது.」",
  moral:"Without even one drop from the sky, no blade of green can appear on earth.",
};
CS[17]={emoji:"🙏",color:"gold",theme:"Rain and Worship",title:"கோவிலுக்கு மழை வேணுமா?",location:"Trichy · Temple",chars:["Priya (10)","Priest"],emotion:"Wonder · Reverence",
  hook:"A temple is closed. The priest hangs a notice: 'Drought. No festival this year.' A girl reads it sadly.",
  story:"Priya asks the priest why the festival is cancelled. 'பணம் இல்ல. பணம் வர விளைவு வேணும். விளைவுக்கு மழை வேணும்.' 'So even God's festival needs rain?' The priest laughs gently. 'கடவுளுக்கு படைக்கணும்னா உணவு வேணும். உணவுக்கு மழை வேணும். மழை இல்லன்னா வானுலக வாழ்வும் தடைப்படும்.'",
  dialogue:"Priya: 'Festival cancel ஏன்?'\nPriest: 'மழை இல்ல. விளைவு இல்ல. பணம் இல்ல.'\nPriya: 'மழை இல்லன்னா கடவுளையும் வணங்க முடியாதா?'\nPriest: 'அதனால்தான் மழைக்கு நன்றி சொல்ல கற்றுக்கோ.'",
  tv:"Empty temple courtyard. Distant thunder. Thiruvalluvar stands at the gopuram.\n\n'மழை இல்லன்னால் தேவர்களும் வணங்கப்படமாட்டார்கள். மழையே வழிபாட்டின் அடிப்படை.'\n\n「தெய்வம் தொழாஅள் கொழுநன் தொழுதெழுவாள்\nபெய்யெனப் பெய்யும் மழை.」",
  moral:"Without rain, even worship fails — rain is the foundation of life and devotion.",
};
CS[18]={emoji:"🌊",color:"blue",theme:"Sea Needs Rain",title:"கடலும் காத்திருக்கு",location:"Rameswaram · Beach",chars:["Anbu (11)","Fisherman Selvam"],emotion:"Wonder",
  hook:"A fisherman stares at the sea. 'The ocean is full. But we have no water to drink.' A boy is confused.",
  story:"Anbu asks Selvam why they travel miles for drinking water when the sea is right there. 'கடல் நீர் உப்பு, புழுங்காது.' 'Then the sea is useless?' 'Not useless — but even the sea needs rain to survive. Without rain feeding the rivers, the sea too would become dead salt.' Anbu stares at the vast sea with new eyes.",
  dialogue:"Anbu: 'இவ்வளவு தண்ணி இருக்கு, குடிக்க இல்லையா?'\nSelvam: 'கடல் நீர் குடிக்க முடியாது. மழைதான் குடி நீர்.'\nAnbu: 'கடலும் மழை இல்லன்னா...?'\nSelvam: 'கடலும் சுருங்கும். மழையே எல்லாத்தோட உயிர்.'",
  tv:"Sunset sea. Golden light. Thiruvalluvar wades ankle-deep in the water.\n\n'மழை இல்லன்னா கடலும் சுருங்கும். மழையே உலகின் உயிர்நீர்.'\n\n「நெடும்புனலோடு இல்லது உலகெனின் யாரும்\nகடும்பசி இல்லா தொழி.」",
  moral:"Even the sea depends on rain — without it, the whole world would thirst.",
};
CS[19]={emoji:"🌧️",color:"teal",theme:"Rain as Farmer's God",title:"விவசாயியின் கடவுள்",location:"Thanjavur · Farm at midnight",chars:["Gopal (40)","Son Rajan (12)"],emotion:"Reverence · Family",
  hook:"Midnight. A farmer stands alone in his field, face turned to the sky. His son finds him there.",
  story:"Rajan wakes up and finds his father missing. He searches and finds Gopal standing in the dark field, watching the clouds. 'Appa, என்ன பண்ற?' Gopal is quiet. 'Waiting.' 'For what?' 'For God.' Rajan looks up. 'God is in the clouds?' Gopal puts his arm around his son. 'விவசாயிக்கு மழையே கடவுள், கண்ணு.'",
  dialogue:"Rajan: 'Appa, நடு இரவுல வெளியே ஏன்?'\nGopal: 'மழை வருதான்னு பார்க்கிறேன்.'\nRajan: 'இவ்வளவு நம்பிக்கையா?'\nGopal: 'மழையே என் கடவுள். அது வந்தா நான் வாழுவேன்.'",
  tv:"Rain begins. Farmer lifts his face. Thiruvalluvar stands beside them both.\n\n'மழை தொழிலுக்கு வலிவூட்டுகிறது. மழை கொடை. அதை தொழுவதே விவசாயியின் மறை.'\n\n「சிறப்பொடு பூசனை செல்லாது வானம்\nவறக்குமேல் வானோர்க்கும் ஒவ்வாது.」",
  moral:"Rain is the farmer's God — without it, even the heavens cannot be praised.",
};
CS[20]={emoji:"💧",color:"teal",theme:"Gratitude for Rain",title:"ஒரு துளிக்கு நன்றி",location:"Madurai · School",chars:["Kavitha (8)","Teacher"],emotion:"Gratitude · Awareness",
  hook:"A teacher pours one drop of water on a dry sponge. The whole class watches it expand.",
  story:"Teacher Nandini demonstrates how one drop of water transforms a dry sponge. She asks: 'ஒரு துளி தண்ணியால் இவ்வளவு மாற்றம் வருதா?' 'Yes!' 'Then why do we waste water?' Silence. She points outside at the grey sky. 'When rain falls, it is not just weather. It is a gift. Do we say thank you?'",
  dialogue:"Teacher: 'ஒரு சொட்டு தண்ணி என்ன செய்யும்?'\nStudent: 'Sponge ஈரமாகும்.'\nTeacher: 'அந்த ஒரு துளி மழை — வேர்களுக்கு, விதைகளுக்கு, ஆறுகளுக்கு — ஆரம்பம்.'\nKavitha: 'அதுக்கு நன்றி சொல்லணும்னு தெரியல.'\nTeacher: 'இப்பவாவது தெரிஞ்சது.'",
  tv:"Rain taps on the classroom window. Golden light. Thiruvalluvar stands in the doorway.\n\n'மழையே உலக வாழ்வின் அடிப்படை. அதற்கு நன்றி சொல்வதும் அதை காப்பதும் நம் கடமை.'\n\n「வானோடு ஒத்த ஒழுக்கம் உடையவர்\nஆனோர்க்கும் தெய்வத்திற்கும் நேர்.」",
  moral:"Gratitude for rain — and protecting it — is our duty to the world.",
};

/* ── 21–30  நீத்தார் / அறன் / இல்லறம் ─────────────────────── */
CS[21]={emoji:"🧘",color:"blue",theme:"Greatness of Ascetics",title:"எல்லாவற்றையும் விட்ட மனிதன்",location:"Palani · Hillside temple",chars:["Murugan (10)","Amma"],emotion:"Wonder · Respect",
  hook:"A monk sits on a rock. Pilgrims offer money, food, gold. He accepts nothing. A boy watches.",
  story:"Murugan whispers to his Amma: 'Why won't he take anything? He must be hungry!' Amma says: 'அவர் வேற level-ல இருக்கார். அவருக்கு ஆசை இல்ல.' 'No desires at all?' 'அவர் எல்லாத்தையும் விட்டு விட்டார். அதனாலேயே அவர் மகிழ்ச்சியா இருக்கார்.' The monk opens his eyes and smiles at Murugan. Murugan feels inexplicably peaceful.",
  dialogue:"Murugan: 'Amma, அவர் ஏன் எதுவும் வாங்கல?'\nAmma: 'அவருக்கு எதுவும் வேண்டாம்.'\nMurugan: 'அது எப்படி possible?'\nAmma: 'ஆசையை விட்டவன்தான் உண்மையில் ஜெயித்தவன்.'",
  tv:"Mountain wind. Golden light from above. Thiruvalluvar stands behind the monk.\n\n'துறந்தவர்களின் பெருமையை அளவிட முடியாது. அவர்களின் ஆற்றல் அணுவிலிருந்து ஆகாயம் வரை நிறைந்திருக்கிறது.'\n\n「உரிமை யொருவனுக்கு உண்டாயின் வேறோர்\nபரிமளம் பார்க்கும் திறன்.」",
  moral:"True greatness is measured not by what you own, but by what you have let go.",
};
CS[22]={emoji:"⚖️",color:"gold",theme:"Power of Virtue",title:"அறம் வல்லது",location:"Kanchipuram · Temple street",chars:["Selvi (11)","Grandfather"],emotion:"Courage · Wisdom",
  hook:"A small child stands up to a bully twice her size. She doesn't fight. She just stands still.",
  story:"Selvi's friend is being bullied at the temple fair. Everyone looks away. Selvi walks up and stands between them quietly. The bully laughs. Selvi does not move. Her calm is more powerful than any shout. The bully leaves. 'How did you do that?' asks her friend. Selvi shrugs. 'Grandfather says: அறம் எப்போதும் வெல்லும்.'",
  dialogue:"Friend: 'Selvi, பயமா இல்லையா?'\nSelvi: 'இருந்துச்சு. ஆனா அறம் என்னோட side-ல இருந்துச்சு.'\nFriend: 'அறம் defend பண்ணுதா?'\nSelvi: 'Grandfather சொல்வார் — அறம் செய்யுங்க. அறமே உங்களை காக்கும்.'",
  tv:"Temple bells. Golden light. Thiruvalluvar stands where the bully stood.\n\n'அறம் என்பது ஒரு கேடயம். செய்யுங்கள் — அறமே உங்களைக் காக்கும்.'\n\n「அறன்என்ப நாரம்நோக்கி மதிப்போர்\nமறனென்ப மன்னவன் செங்கோல்தான்.」",
  moral:"Virtue is your shield — do what is right and it will protect you.",
};
CS[23]={emoji:"🌟",color:"gold",theme:"Renown of the Virtuous",title:"பேர் விட்டுப் போவான்",location:"Salem · Old man's funeral",chars:["Karthik (12)","Father"],emotion:"Reflection · Respect",
  hook:"A simple funeral. Hundreds of people stand outside. For a man who owned almost nothing.",
  story:"Karthik is confused at his father's colleague's funeral. 'Appa, he was so poor. Why is everyone here?' His father says: 'He was the kindest man in this town. For 40 years he helped everyone — loans without interest, food during floods, medicine for the sick. He had no money. But he had everything.' Karthik is quiet for a long time.",
  dialogue:"Karthik: 'Appa, அவர்கிட்ட பணமே இல்லன்னீங்க. இவ்வளவு பேர் ஏன் வந்தாங்க?'\nAppa: 'பணத்தை விட பெரிய செல்வம் இருக்கு.'\nKarthik: 'என்ன செல்வம்?'\nAppa: 'அவர் பேர். அது மட்டும் மிஞ்சுது.'",
  tv:"Sunset at the cemetery. Golden glow. Thiruvalluvar stands behind the crowd.\n\n'உடல் மறையும். செல்வம் போகும். ஆனால் நல்ல பெயர் மட்டும் என்றும் இருக்கும். அதுவே உண்மையான வாழ்க்கை.'\n\n「உயிரென்ப நாரம்நோக்கி மதிப்போர்\nபயிரென்ப வாழ்வின் உரம்.」",
  moral:"The body fades and wealth disappears, but a good name lives forever.",
};
CS[24]={emoji:"🏆",color:"gold",theme:"Fame and Good Name",title:"Trophy அல்ல, பெயர்",location:"Coimbatore · Sports day",chars:["Priya (10)","Coach Ravi"],emotion:"Honesty · Pride",
  hook:"A girl wins first prize but helps the crying second-place girl stand up first. The crowd goes silent.",
  story:"Priya wins the 100m race but the girl behind her trips and falls at the finish. Everyone watches. Priya crosses the line, then immediately turns and helps her up. She doesn't celebrate. She helps the girl to the medical tent first. Coach Ravi presents the trophy later. 'This is not for your speed,' he says. 'This is for your character.'",
  dialogue:"Friend: 'Priya, நீ first வந்தே! Celebrate பண்ண கூடாதா?'\nPriya: 'அவ விழுந்துட்டா. முதல்ல அவளை பார்க்கணும்.'\nCoach: 'Trophy நிறைய பேருக்கு கிடைக்கும். இந்த பேர் உனக்கு மட்டும்.'",
  tv:"Sports ground, evening. Golden light. Thiruvalluvar stands near the finish line.\n\n'புகழ் என்பது trophy அல்ல. மற்றவர்கள் உன்னை நினைக்கும் விதம். நல்ல செயல்கள் மட்டுமே நல்ல பெயரை உருவாக்கும்.'\n\n「ஈதல் இசைபட வாழ்தல் அதுவல்ல\nதூதர முன்னோர் விடும்.」",
  moral:"Fame is not a trophy — it is the impression you leave in people's hearts through good deeds.",
};
CS[25]={emoji:"🕊️",color:"teal",theme:"Compassion",title:"கல்லுல கண்ணீர்",location:"Madurai · Market",chars:["Arjun (9)","Appa"],emotion:"Kindness · Empathy",
  hook:"A dog limps through the market. Everyone steps around it. One small boy stops.",
  story:"Arjun sees an injured stray dog lying near the vegetable market in Madurai. Everyone ignores it. Arjun stops and kneels. 'Appa, நாம் help பண்ணலாமா?' His Appa hesitates — they're late. But he sees his son's face. They find a vet. The dog is treated. Walking home late, Appa says: 'You made us late. Are you sorry?' Arjun shakes his head. 'No.'",
  dialogue:"Arjun: 'Appa, அந்த நாய் வலிக்குதே.'\nAppa: 'நாம் கஷ்டப்படுவோம்.'\nArjun: 'அது கஷ்டப்படுதே. நம்ம கஷ்டம் பெரிசா?'\nAppa: (pause) 'போகலாம்.'",
  tv:"Evening market emptying. Golden light. Thiruvalluvar stands beside the vet's doorway.\n\n'அருள் என்பது மற்றவரின் வலியை நம் வலியாக உணர்வது. அதுவே மனிதனின் மிகப்பெரிய தகுதி.'\n\n「அருளில்லார்க்கு அவ்வுலகம் இல்லை பொருளில்லார்க்கு\nஇவ்வுலகம் இல்லாகி யாங்கு.」",
  moral:"Compassion — feeling another's pain as your own — is the greatest human quality.",
};

CS[26]={emoji:"🌿",color:"teal",theme:"Non-Violence",title:"தட்டில் இருப்பது என்ன?",location:"Thanjavur · Home kitchen",chars:["Meena (9)","Mother"],emotion:"Empathy · Reflection",
  hook:"A child stares at a plate of chicken curry. She has just seen chickens at the market.",
  story:"Meena helped her mother buy vegetables at the market. On the way back they passed a chicken stall. She saw them alive, moving. That evening, chicken curry for dinner. She stares at it. 'Amma, இந்த chicken...' Her mother is quiet. 'உனக்கு தெரியும், இல்லையா?' Meena pushes the plate away gently. 'நான் வேண்டாம்னு சொல்லல. ஆனா புரியுது.'",
  dialogue:"Meena: 'Amma, அந்த chicken-லாம் உயிரோட இருந்துச்சே.'\nAmma: 'ஆமா.'\nMeena: 'நம்ம சாப்பிட அது மரணமடைஞ்சதா?'\nAmma: 'என்ன நினைக்கிற?'\nMeena: 'வேற சாப்பாடு சாப்பிடலாமா?'",
  tv:"Evening kitchen. Soft golden light. Thiruvalluvar sits at the doorway.\n\n'உயிர்களை கொல்லாமல் இருப்பதே மிகப்பெரிய அன்பு. உண்ணாமல் விட்டவர்கள் உலகில் மகிமை பெறுவார்கள்.'\n\n「கொல்லான் புலாலை மறுத்தானைக் கைகூப்பி\nஏத்துவர் வானோர் தொழுது.」",
  moral:"Choosing not to cause harm to any life is the purest form of love.",
};
CS[27]={emoji:"🔥",color:"blue",theme:"Penance and Discipline",title:"நெருப்பு கடந்தவன்",location:"Palani · Fire-walking festival",chars:["Karthik (13)","Old monk"],emotion:"Courage · Awe",
  hook:"Bare feet walking on glowing coals. Not running — walking calmly. A boy watches with open mouth.",
  story:"At the Palani festival, Karthik watches firewalkers. He expects screams. He hears silence. Their faces are completely calm. 'How?' he asks a monk nearby. 'Training the mind,' says the monk. 'Not the feet?' 'The feet follow the mind. When the mind is mastered, even fire bows.' Karthik looks at his own soft feet. He thinks of all the small discomforts he runs from every day.",
  dialogue:"Karthik: 'நெருப்பு மேல நடக்கிறாங்க! வலிக்கல்லையா?'\nMonk: 'Mind trained-ஆ இருந்தா body பின்பற்றும்.'\nKarthik: 'அது possible-ஆ?'\nMonk: 'தவம் என்பது அதுதான். உடம்பை அல்ல, மனசை அடக்குவது.'",
  tv:"Embers glow. Golden light. Thiruvalluvar stands at the edge of the fire path.\n\n'தவம் செய்பவர்கள் சேனையை வென்றவர்களை விட பெரியவர்கள். மனசை வெல்வதே மிகக் கடினமான போர்.'\n\n「உற்றனவு உற்றது ஆற்றல் தவஞ்சோர்ந்தார்\nமுற்றியது கேடரசன் செய்தது.」",
  moral:"Mastering the mind through discipline is greater than winning any battle.",
};
CS[28]={emoji:"🪞",color:"gold",theme:"No Imposture",title:"வெள்ளை உடை, கறுப்பு மனசு",location:"Trichy · Village",chars:["Rajan (12)","Village Elder"],emotion:"Wisdom · Disillusionment",
  hook:"A man in holy robes is seen cheating at the market. A boy who admired him stands frozen.",
  story:"Rajan had admired the 'holy man' who came to their village for weeks. He spoke beautifully about virtue. Then Rajan saw him pocketing extra change at the market and laughing about it with his friend. Rajan is crushed. His grandfather says: 'Appearance and character are two different things.' 'But he LOOKED so good!' 'Water bird cannot live on land. A fake cannot sustain the act forever.'",
  dialogue:"Rajan: 'அவர் நல்லவரா நடிச்சார். ஆனா...'\nGrandfather: 'நடிப்பும் நடத்தையும் வேற.'\nRajan: 'எப்படி தெரியும்?'\nGrandfather: 'நேரம் கூறும். Actions கூறும். வார்த்தைகள் அல்ல.'",
  tv:"Village dusk. Golden light. Thiruvalluvar sits on the well wall.\n\n'நல்லவர் போல் நடிப்பவன் தன்னையும் கெடுத்துக்கொள்வான், நம்பியவரையும் கெடுப்பான். வேடம் போட்டாலும் உண்மை வெளிவரும்.'\n\n「வஞ்சமனத்தான் படிற்றொழுக்கம் வாழ்வாங்கு\nஒழுகி உயிர்நிழல் ஆகும்.」",
  moral:"Pretending to be virtuous while acting falsely destroys both the pretender and those who trust them.",
};
CS[29]={emoji:"✅",color:"teal",theme:"No Fraud",title:"பத்து ரூபாய்",location:"Coimbatore · Corner shop",chars:["Kavitha (10)","Shopkeeper Mani"],emotion:"Honesty · Inner peace",
  hook:"A girl walks back to a shop. She holds ₹10. Her friend pulls her arm. 'Don't go back!'",
  story:"Kavitha received ₹10 too much as change. Her friend says keep it. 'He's rich, he won't notice.' That night Kavitha can't sleep. Not because she's afraid of getting caught. Because she knows. Next morning she returns the money. Shopkeeper Mani smiles. He gives her a small book she'd been eyeing for weeks — as a gift.",
  dialogue:"Friend: 'வைச்சுக்க. யாருக்கும் தெரியாது.'\nKavitha: 'எனக்கு தெரியும்.'\nFriend: 'So what?'\nKavitha: 'அது enough.'",
  tv:"Morning shop. Golden light. Thiruvalluvar stands behind the counter.\n\n'வஞ்சனை இல்லாத வாழ்க்கை — அதுவே அனைத்து நன்மைகளுக்கும் அடிப்படை. உள்ளும் புறமும் ஒரே மாதிரி இருப்பவனே மனிதன்.'\n\n「வாய்மை யெனப்படுவ தியாதெனின் யாதொன்றும்\nதீமை யிலாத சொலல்.」",
  moral:"True virtue is living without deception — inside matching outside.",
};
CS[30]={emoji:"💡",color:"gold",theme:"Truth",title:"ஒரு பொய்யின் எடை",location:"Madurai · School",chars:["Murugan (12)","Teacher Nandini"],emotion:"Honesty · Shame → Growth",
  hook:"A boy stands at the blackboard. His answer is wrong. He insists it is right. The teacher waits.",
  story:"Murugan has been lying in small ways for months — homework, absent marks, small thefts of praise. It snowballs. Then in class, he writes a wrong answer and defends it confidently. Teacher Nandini asks once, twice, three times. He holds his ground. She turns the board so everyone sees. Murugan burns with shame. After class she says quietly: 'Truth needs no support. A lie needs ten more lies.'",
  dialogue:"Teacher: 'உறுதியாக சரிதான்னு சொல்றியா?'\nMurugan: 'ஆமா.'\nTeacher: 'ஒரு பொய்யை நிலைநிறுத்த எத்தனை பொய் வேணும்?'\nMurugan: '...நான் தவறு பண்ணினேன்.'\nTeacher: 'இப்பவாவது சொன்னே. அதுவே ஆரம்பம்.'",
  tv:"Empty classroom. Afternoon light. Thiruvalluvar sits at the front desk.\n\n'உண்மை என்பது தனியாக நிற்கும். அதற்கு வேற எந்த தூணும் வேண்டாம். எல்லா நல்லதும் அதிலிருந்தே பிறக்கும்.'\n\n「யாதொன்றும் தீமையிலாத சொல்லே வாய்மை\nஏதிலாரேனும் அது.」",
  moral:"Truth stands alone and needs no support — all good things grow from it.",
};

/* ── 31–50 ───────────────────────────────────────────────────── */
CS[31]={emoji:"🌬️",color:"blue",theme:"Restraining Anger",title:"நெருப்பை விட வலிமையான நீர்",location:"Coimbatore · Home",chars:["Rajan (11)","Father"],emotion:"Self-control · Wisdom",
  hook:"A boy smashes his toy. His father watches calmly. He doesn't scold. He just watches.",
  story:"Rajan's friend broke his kite. Rajan came home furious, throwing things. Father sat quietly. After the storm passed, he said: 'உனக்கு என்ன கிடைச்சது?' Rajan looked at his broken toy — broken by himself. 'ஒண்ணுமில்ல.' 'Anger burned your hand, not his.' Rajan looked at his own red face in the mirror.",
  dialogue:"Rajan: 'என் kite-அ உடைச்சான்!'\nFather: 'உன் toy-அ நீயே உடைச்சே.'\nRajan: 'Anger வந்துச்சு.'\nFather: 'Anger-ஐ கட்டுப்படுத்துவதே மிகப்பெரிய வலிமை.'",
  tv:"Quiet evening room. Golden light. Thiruvalluvar sits across from the boy.\n\n'கோபத்தை கட்டுப்படுத்துவதைவிட பெரிய வெற்றி எதுவுமில்லை. அந்த வெற்றி மட்டுமே உன்னை காக்கும்.'\n\n「செல்லிடத்துக் காப்பான் சினங்காப்பான் அல்லிடத்துக்\nகாக்கினென் மன்னோ பகை.」",
  moral:"Controlling anger in the heat of the moment is the greatest victory.",
};
CS[32]={emoji:"🚫",color:"rose",theme:"Not doing Evil",title:"சிறிய கல்",location:"Thanjavur · Market street",chars:["Selvi (8)","Grandmother"],emotion:"Empathy · Kindness",
  hook:"A girl throws a stone at a stray dog for fun. Her grandmother catches her hand.",
  story:"Selvi threw a stone at a limping dog 'just because'. Grandmother made her watch the dog limp away. 'Did you feel better?' Selvi shook her head. 'Then why?' 'I don't know.' 'That's how evil starts — not from hatred, but from thoughtlessness.' That evening Selvi found the dog and left food for it.",
  dialogue:"Selvi: 'Paati, small stone மட்டும்தானே.'\nPaati: 'அவனுக்கு அது small-ஆ தெரியும்?'\nSelvi: '...'\nPaati: 'ஒரு சிறிய தீமையும் பெரியதாகும். செய்யாமல் இருப்பதே நல்லது.'",
  tv:"Twilight market. Golden light. Thiruvalluvar kneels near the dog.\n\n'தீமை எவ்வளவு சிறியதாக இருந்தாலும் அது வளரும். செய்யாமல் விடுவதே ஞானம்.'\n\n「தீயவை தீய பயத்தலால் தீயவை\nதீயினும் அஞ்சப் படும்.」",
  moral:"Even the smallest evil grows — avoid it entirely, for your own sake.",
};
CS[33]={emoji:"🦋",color:"teal",theme:"Not Killing",title:"கண்ணாடி பாட்டில்",location:"Kumbakonam · Home",chars:["Murugan (8)","Father"],emotion:"Empathy · Loss",
  hook:"A boy shows his father a butterfly in a glass jar. Its wings are still.",
  story:"Murugan kept a butterfly overnight to show his friends. Morning: it barely moves. Father opens the jar. Butterfly sits still. Then slowly — one wing, then the other — it flies away. Murugan feels hollow. 'Appa, why did it suffer?' 'You took its freedom.' 'I didn't mean to hurt it.' 'That's what makes it sadder — harm without intention is still harm.'",
  dialogue:"Murugan: 'நான் hurt பண்ணவில்லையே.'\nFather: 'Freedom எடுத்தே. அதுவே hurt.'\nMurugan: 'இனி பிடிக்கல.'\nFather: 'கொல்லாமை என்பது அதுதான் — உயிரை respect பண்ணுவது.'",
  tv:"Morning window. Butterfly free. Thiuvalluvar stands at the window.\n\n'கொல்லாமை மிகப்பெரிய அறம். எந்த உயிரும் வாழ விரும்புகிறது. அந்த உரிமை பறிக்காதே.'\n\n「அதிகாரம் 33 — கொல்லாமை: உயிரை மதிப்பவனே மனிதன்.」",
  moral:"Not taking life is the highest virtue — every life wants to live.",
};
CS[34]={emoji:"🍂",color:"blue",theme:"Impermanence",title:"அரண்மனை தூசு",location:"Madurai · Ancient ruins",chars:["Priya (11)","Teacher"],emotion:"Reflection · Wisdom",
  hook:"A grand ruined palace. Stone thrones. Weeds growing through. A girl traces a carved king's face.",
  story:"Priya's class visits Madurai ruins. She asks the teacher: 'This was so powerful. What happened?' 'Time.' 'Even kings cannot stop time?' 'No one can. The king spent everything on this stone. He left nothing in people's hearts.' Priya walks out of the ruins lighter. She understands something new about what lasts.",
  dialogue:"Priya: 'இந்த அரண்மனை எவ்வளவு பெரியது!'\nTeacher: 'இன்னிக்கு தூசு.'\nPriya: 'ஏன்?'\nTeacher: 'எல்லாம் நிலையற்றது. இது புரிந்தவன் சரியா வாழுவான்.'",
  tv:"Sunset over ruins. Golden light. Thiruvalluvar stands among the stones.\n\n'செல்வம், அழகு, வலிமை — எல்லாம் தற்காலிகம். நிலையானது என்பது உண்மையில் ஒன்றுமில்லை. இதை அறிவதே விடுதலை.'\n\n「நிலையாமை நில்லா ஒழியா ஒழியா\nவலையுறு பொய்ம்மை யுலகு.」",
  moral:"Everything is impermanent — knowing this is freedom, not sadness.",
};
CS[35]={emoji:"🌅",color:"gold",theme:"Renunciation",title:"கடைசி நாணயம்",location:"Palani · Temple street",chars:["Young monk","Beggar child"],emotion:"Generosity · Peace",
  hook:"A monk holds one coin — his last. A child begs. The monk looks at the coin for a long moment.",
  story:"Pilgrims watch the monk. Some think: keep it. The monk has nothing else. Others think: give it. After a long silence, he places it in the child's palm. No words. He walks away with empty hands, face completely peaceful. An old pilgrim whispers: 'That was the hardest thing he ever gave away — not because it was valuable, but because it was the last.'",
  dialogue:"Pilgrim 1: 'விட்டுடட்டுமா?'\nPilgrim 2: 'அவர் கிட்ட இனி ஒண்ணுமில்ல.'\nMonk: (smiles) 'இல்லாமல் இருப்பது என்னவென்று இப்போது தெரியும்.'\nChild: 'நன்றி.'",
  tv:"Temple path. Golden light. Thiruvalluvar walks beside the monk.\n\n'துறவு என்பது கையை காலியாக வைத்திருப்பது அல்ல — மனசை காலியாக வைத்திருப்பது. பிடிப்பை விட்டவன் எல்லாவற்றையும் வென்றவன்.'\n\n「யாதனின் யாதனின் நீங்கியான் நோதல்\nஅதனின் அதனின் இலன்.」",
  moral:"Letting go of your grip on things — even the last thing — is true freedom.",
};

CS[36]={emoji:"💎",color:"blue",theme:"Truth-Consciousness",title:"நிஜம் என்னவென்று தெரியுமா?",location:"Kanchipuram · Library",chars:["Kavitha (13)","Old Librarian"],emotion:"Curiosity · Clarity",
  hook:"A girl holds two books. One is thick with facts. One is thin. The librarian says: 'Read the thin one first.'",
  story:"Kavitha asks the librarian why. 'The thick one gives you information. The thin one teaches you how to think.' Kavitha reads the thin book. It says nothing factual. It only asks questions. 'What is real? What do you actually know? What do you only believe?' She puts it down. The world looks different. 'I thought I knew so much. I know almost nothing.'",
  dialogue:"Kavitha: 'நான் நிறைய படிச்சேன். ஆனா இந்த book-அ படிச்சதுக்கு பிறகு குழப்பமா இருக்கு.'\nLibrarian: 'அது நல்ல அறிகுறி.'\nKavitha: 'ஏன்?'\nLibrarian: 'உண்மையான அறிவு humble-ஆ இருக்கும். Confusion is clarity beginning.'",
  tv:"Library evening. Golden light through dusty windows. Thiruvalluvar reads quietly.\n\n'மெய்யுணர்தல் என்பது facts தெரிவது அல்ல — உண்மையை தெளிவாக பார்க்கும் திறன். அதுவே அனைத்து துன்பத்தின் வேரை வெட்டும்.'\n\n「மெய்ப்பொருள் காண்பது அறிவு.」",
  moral:"True knowledge is seeing clearly — it cuts the root of all confusion and suffering.",
};
CS[37]={emoji:"🎯",color:"rose",theme:"Curbing Desire",title:"ஆற்றுக்கு கட்டும் அணை",location:"Trichy · Dam visit",chars:["Arjun (12)","Engineer Uncle"],emotion:"Curiosity · Control",
  hook:"A massive dam holds back a roaring river. A boy asks: 'Why stop it? Let it flow free!'",
  story:"Uncle explains: without the dam the river floods, destroys, kills. With the dam it generates power, irrigates crops, gives water to cities. 'Is desire like the river?' asks Arjun. Uncle looks surprised. 'Yes. Desire is energy. Without direction it destroys. Channel it — it builds.' Arjun looks at the controlled flow below the dam. Powerful. Purposeful. Safe.",
  dialogue:"Arjun: 'ஆத்தை ஏன் தடுக்கிறோம்?'\nUncle: 'தடுக்கல. திசை மாற்றுறோம்.'\nArjun: 'ஆசையும் அதுமாதிரியா?'\nUncle: 'ஆசையை அடக்கல — அதை சரியான திசையில் செலுத்து.'",
  tv:"Dam overlook. Golden light. Thiruvalluvar stands at the edge.\n\n'ஆசையை அறுத்துவிடு என்பது அர்த்தமில்ல. அதை நல்ல திசையில் பயன்படுத்து — அதுவே ஞானம்.'\n\n「அற்றவர் என்பார் அவா அற்றார் மற்றையார்\nகற்றவர் என்பார் கரி.」",
  moral:"Don't destroy desire — channel it wisely, and it becomes the power to build your life.",
};
CS[38]={emoji:"🌠",color:"gold",theme:"Fate",title:"விதையும் புயலும்",location:"Thanjavur · Farm after storm",chars:["Gopal (42)","Daughter Selvi (10)"],emotion:"Resilience · Acceptance",
  hook:"A storm has flattened half the crop. The farmer sits in the ruined field. His daughter sits beside him.",
  story:"Selvi finds Gopal silent in the wrecked field. 'Appa, you did everything right. Why?' He is quiet a long time. Then: 'Some things are beyond us.' 'Was it pointless?' 'No. The half that survived will feed us. And now we know we can survive a storm.' He stands up and begins clearing the broken stalks. 'Tomorrow we replant.'",
  dialogue:"Selvi: 'Appa, கஷ்டப்பட்டு பண்ணினே. இப்படி ஆச்சே.'\nGopal: 'நாம் பண்ணவேண்டியதை பண்ணினோம்.'\nSelvi: 'Fate fair-ஆ இல்லையே.'\nGopal: 'Fate-அ control பண்ண முடியாது. நம்ம effort-அ மட்டும் பண்ணலாம்.'",
  tv:"Morning after storm. New light. Thiruvalluvar walks through the cleared field.\n\n'ஊழ் வலியது. ஆனால் முயற்சி மட்டும் நம் கையில் இருக்கிறது. செய்யவேண்டியதை செய். மீதி விதியிடம் விடு.'\n\n「ஊழிற் பெருவலி யாவுள மற்றொன்று\nசூழினும் தான்முந்து றும்.」",
  moral:"Fate is powerful, but effort is yours — do your part and leave the rest.",
};
CS[39]={emoji:"👑",color:"gold",theme:"Greatness of a King",title:"கிரீடத்தின் எடை",location:"Madurai · Palace story",chars:["Young Raja","Father King"],emotion:"Responsibility · Wisdom",
  hook:"A boy tries on his father's crown. It is so heavy he must hold his head with both hands.",
  story:"The king laughs, then says: 'It's not the gold that makes it heavy.' 'Then what?' 'Every person who depends on you sits on that crown. The farmer, the widow, the child without a voice — they all lean on your decision.' Raja sets the crown down gently. He looks at it differently now.",
  dialogue:"Raja: 'Appa, இந்த crown எவ்வளவு heavy!'\nKing: 'தங்கம் அல்ல. Responsibility heavy.'\nRaja: 'யார் responsibility?'\nKing: 'உன் ஆட்சியில் வாழும் ஒவ்வொருவரும்.'",
  tv:"Palace throne room. Golden light. Thiruvalluvar stands beside the crown.\n\n'அரசன் பெருமை palace-ல் இல்ல. மக்கள் பயமின்றி தூங்கும்போது அவரது பெருமை நிறைவடைகிறது.'\n\n「இயற்கை யுடையான் இடத்துண்டோ இல்லை\nமயக்கமும் தெளிவும் தரும்.」",
  moral:"A great ruler is measured by whether people sleep without fear under their care.",
};
CS[40]={emoji:"📚",color:"blue",theme:"Learning",title:"திறந்த கதவு",location:"Trichy · Old library",chars:["Kavitha (11)","Librarian Kamakshi"],emotion:"Curiosity · Wonder",
  hook:"A girl sees thousands of books and says: 'This will take forever.' Librarian smiles: 'That's the point.'",
  story:"Kavitha asks what's the point of reading if you can never finish. Librarian Kamakshi says: 'Every book opens a door. Behind that door are ten more. Education doesn't give you all the answers — it teaches you better questions.' Kavitha pulls out one book. She stays until closing time.",
  dialogue:"Kavitha: 'இவ்வளவு book-ஐ யாராவது படிச்சிருக்காங்களா?'\nLibrarian: 'சிலர் அதிகம் படிச்சிருக்கான். அதனால அவன் தெரியாதது எவ்வளவுன்னு தெரியும்.'\nKavitha: 'அது சரிதான்.'\nLibrarian: 'கல்வி பெரிய world-ஐ காட்டும். சிறிய world-ல் தங்காதே.'",
  tv:"Library closing time. Last light through windows. Thiruvalluvar reads in the corner.\n\n'கல்வி உலகை பெரிதாக்கும். நிறுத்தாதே — ஒவ்வொரு கேள்வியும் ஒரு புதிய கதவு.'\n\n「கற்க கசடற கற்பவை கற்றபின்\nநிற்க அதற்குத் தக.」",
  moral:"Learning expands your world — never stop, for every answer opens ten new questions.",
};

/* ── 41–70 ───────────────────────────────────────────────────── */
CS[41]={emoji:"😟",color:"rose",theme:"Ignorance",title:"தெரியும்னு நினைச்சேன்",location:"Coimbatore · Street corner",chars:["Murugan (11)","Traveller"],emotion:"Humility · Lesson",
  hook:"A man asks a boy for directions. The boy confidently gives wrong ones. The traveller is lost for hours.",
  story:"Murugan gave confident wrong directions. He didn't say 'I don't know' because it felt embarrassing. The traveller returned two hours later, exhausted. Murugan's mother saw. 'தெரியல-ன்னு சொல்வது weakness அல்ல.' 'Then what?' 'Strength. Wrong confidence hurts others.'",
  dialogue:"Murugan: 'நான் நினைச்சேன் தெரியும்னு.'\nAmma: 'தெரியல-ன்னு சொல்லியிருந்தா?'\nMurugan: 'Embarrassing.'\nAmma: 'Embarrassment ஒரு நிமிஷம். தவறான direction-ல போனால் மணிக்கணக்ல கஷ்டம்.'",
  tv:"Evening doorway. Thiruvalluvar sits on the step.\n\n'கல்வியில்லாத மனிதன் எரியாத விளக்கு மாதிரி — இருக்கான், ஆனா ஒளிர மாட்டான். ஆனா அதை விட கெடுதல் — தெரியாமல் தெரியும்னு நினைப்பது.'\n\n「கல்லாதான் சொல்லுவன கேட்க சிலவேனும்\nகற்றார் கருவியுட் சேரா.」",
  moral:"Saying 'I don't know' is strength — wrong confidence causes harm.",
};
CS[42]={emoji:"👂",color:"teal",theme:"Listening",title:"இரு செவி, ஒரு மனசு",location:"Salem · Grandfather's home",chars:["Priya (9)","Grandfather"],emotion:"Respect · Wisdom",
  hook:"A grandfather stops everything — newspaper, TV, tea — just to listen to his granddaughter speak.",
  story:"Priya notices her grandfather's complete attention. 'Thatha, why do you stop everything?' 'Because I have ears to hear only once. If I listen while distracted, I hear words but miss meaning.' He points to her ears. 'These are gates to your mind. What you let through shapes who you become.' That evening Priya puts her phone face down for the whole dinner.",
  dialogue:"Priya: 'Thatha, phone-அ வைச்சுட்டு ஏன் listen பண்ற?'\nThatha: 'ஒரே நேரத்தில் ரெண்டு வேலை — இரண்டுமே சரியா நடக்காது.'\nPriya: 'செவி கொடுப்பது முக்கியமா?'\nThatha: 'அதுவே கற்றுக்கொள்வதின் ஆரம்பம்.'",
  tv:"Quiet home. Evening. Thiruvalluvar sits in the grandfather's chair.\n\n'கேட்பது அனைத்திலும் எளிதான கல்வி. ஆனால் மனம் கொடுத்து கேட்டால் மட்டுமே அது உள்ளே இறங்கும்.'\n\n「செவிக்குண வில்லாத போழ்து சிறிது\nவயிற்றுக்கும் ஈயப் படும்.」",
  moral:"Listening with full attention is the easiest and most powerful form of learning.",
};
CS[43]={emoji:"🔭",color:"blue",theme:"Knowledge",title:"வரைபடமும் நிஜமும்",location:"Madurai · Science class",chars:["Kavitha (12)","Teacher Nandini"],emotion:"Curiosity · Humility",
  hook:"Teacher draws the solar system on the board. A girl says: 'But the real thing is a billion times bigger!'",
  story:"Teacher Nandini agrees. 'All knowledge is a map. The real thing is always larger.' A student asks: 'Then why learn if we can never know the full thing?' She says: 'A good map still gets you there. But confusing the map for the territory — that's the mistake.' Kavitha stares at Saturn's drawing long after class.",
  dialogue:"Kavitha: 'நம்ம knowledge எவ்வளவு சிறியதா இருக்கு!'\nTeacher: 'அதை புரிந்தவனே truly educated.'\nKavitha: 'அதுவும் ஒரு knowledge-ஆ?'\nTeacher: 'அதுவே மிகப்பெரிய knowledge.'",
  tv:"Empty classroom. Stars visible through the window. Thiruvalluvar looks at the solar system drawing.\n\n'அறிவு என்பது பெருமை தராது — அது humble-ஆக்கும். அது புரிந்தவனே உண்மையான அறிஞன்.'\n\n「அறிவுடையார் ஆவதறிவார் அறிவிலார்\nவேண்டி நிர்ப்பிப்பதறிவார்.」",
  moral:"True knowledge makes you humble — the more you learn, the more you see how much remains.",
};
CS[44]={emoji:"🔧",color:"gold",theme:"Correcting Faults",title:"கண்ணாடி சோதனை",location:"Chennai · Home",chars:["Selvi (10)","Mother"],emotion:"Self-reflection · Growth",
  hook:"A girl complains about everyone around her. Her mother places a mirror in front of her breakfast plate.",
  story:"Selvi has been criticising friends all week. Mother places the mirror silently. 'Look at the person choosing these friends.' Selvi stares. 'Before correcting others, clean your own mirror first.' Grandmother from kitchen: 'People who fix their own faults attract good people naturally.'",
  dialogue:"Selvi: 'Amma, என் friends எல்லாரும் problem.'\nAmma: 'அந்த mirror-ல பாரு.'\nSelvi: 'என்னை?'\nAmma: 'நம் குறைகளை முதல்ல பார்க்கணும். பிறகு மற்றவரை.'",
  tv:"Morning table. Thiruvalluvar sits across the mirror.\n\n'உன் குறைகளை முதல்ல திருத்து. பிறகு உன்னை நல்லவர்கள் சூழ்ந்துகொள்வார்கள். தானாகவே.'\n\n「குற்றம்நாடிக் குற்றங் கடிதல் ஒருவரிடர்\nகுற்றங்கள் நாடிக் கொளல்.」",
  moral:"Fix your own faults first — then good people will find you naturally.",
};
CS[45]={emoji:"🧓",color:"teal",theme:"Seeking Wise Help",title:"பெரியோர் துணை",location:"Thanjavur · Village panchayat",chars:["Arjun (12)","Village elder"],emotion:"Respect · Wisdom",
  hook:"A young man tries to solve a big village dispute alone. He fails. An elder watches quietly.",
  story:"Arjun's uncle tried to handle the land dispute alone, convinced he knew best. It worsened. The old village elder had stayed quiet. Finally uncle asked for help. In one conversation the elder found the solution. 'Why didn't you speak earlier?' 'You didn't ask.' Arjun learned: wise people wait to be invited. And we must be wise enough to invite them.",
  dialogue:"Uncle: 'நான் alone handle பண்ண முயற்சித்தேன்.'\nElder: 'தெரியும்.'\nUncle: 'ஏன் சொல்லலீங்க?'\nElder: 'கேட்கல. இப்ப கேட்கிற. சொல்றேன்.'",
  tv:"Panchayat tree. Evening. Thiruvalluvar sits with the elders.\n\n'பெரியோரை துணையாக்கிக்கொள். அது weakness அல்ல — அதுவே மிகப்பெரிய strength.'\n\n「தக்கார் தகவிலர் என்ப தவரவர்\nறொக்கவே தூக்கிக் கொண்டு.」",
  moral:"Seeking the help of wise people is not weakness — it is the greatest strength.",
};

CS[46]={emoji:"👫",color:"blue",theme:"Good Company",title:"நண்பன் யாரா இருக்கான்?",location:"Trichy · School playground",chars:["Priya (11)","Friend Deepa"],emotion:"Friendship · Wisdom",
  hook:"Two girls walk in different directions after school. One towards the library. One towards trouble.",
  story:"Priya realises her new friend group skips class and lies to parents. Her old friend Deepa asks: 'உன் new friends உன்னை better-ஆ ஆக்குறாங்களா?' Priya thinks. They don't. 'Friends shape you,' says Deepa. 'If they pull down, you go down. If they lift up, you go up.' Priya makes a quiet decision that afternoon.",
  dialogue:"Priya: 'New friends fun-ஆ இருக்காங்க.'\nDeepa: 'Fun மட்டும் போதுமா?'\nPriya: 'Hmm.'\nDeepa: 'உன்னை நல்லவளா ஆக்குறாங்களா? அதுதான் question.'",
  tv:"School gate, afternoon. Thiruvalluvar leans against the wall.\n\n'நீ யாருடன் இருக்கிறாயோ அவர்களே உன் எதிர்காலம். கெட்ட நட்பை தவிர். நல்ல நட்பை தேடு.'\n\n「நல்லார் நடுவுண்டேல் நன்று.」",
  moral:"Your company shapes your character — choose friends who make you better.",
};
CS[47]={emoji:"🤔",color:"gold",theme:"Think Before Acting",title:"முதல் யோசி",location:"Madurai · Market",chars:["Karthik (12)","Mother"],emotion:"Wisdom · Patience",
  hook:"A boy rushes to buy something. Returns it the same day. His mother says nothing. She just waits.",
  story:"Karthik bought an expensive toy impulsively with saved money. He was bored with it in two hours. His mother waited. 'Did you think before buying?' 'No.' 'Did it serve any purpose?' 'No.' 'That's why.' She didn't scold. She just asked: 'Next time — one hour wait, then decide.' He has not made an impulsive purchase since.",
  dialogue:"Karthik: 'Waste ஆச்சு.'\nAmma: 'Waste-ஆன தேதி நினைவிருக்கா?'\nKarthik: 'இல்ல.'\nAmma: 'அன்னைக்கு யோசிச்சிருந்தா waste ஆகியிருக்காது.'",
  tv:"Market evening. Thiruvalluvar walks alongside them.\n\n'ஒரு வேலையை செய்வதற்கு முன் நன்றாக யோசி. பிறகு செய். வேலை நடுவிலேயே நிறுத்தினால் கஷ்டமே தவிர பயன் இல்லை.'\n\n「ஆற்றி அளவறிந்து கற்ற அறிவினா\nதேற்றம் தெளிந்தவர்க்கு தேடு.」",
  moral:"Think carefully before you act — a half-done plan causes more trouble than no plan.",
};
CS[48]={emoji:"💪",color:"rose",theme:"Know Your Strength",title:"யானையும் எறும்பும்",location:"Coimbatore · School",chars:["Murugan (11)","Coach Ravi"],emotion:"Self-awareness · Wisdom",
  hook:"A small boy challenges the biggest boy to arm-wrestle. The coach watches with a slight smile.",
  story:"Murugan lost badly. Coach Ravi doesn't laugh. 'Knowing your strength and your opponent's — that is more important than courage.' 'Is it cowardly to back down?' 'No. An ant that picks a fight with an elephant is not brave. It is foolish. Know yourself first.' Murugan thinks about what he's actually good at.",
  dialogue:"Murugan: 'நான் தோத்துட்டேன்.'\nCoach: 'உன் strength என்னன்னு தெரியுமா?'\nMurugan: 'இல்ல.'\nCoach: 'அதுவே problem. உன் strength-அ தெரிஞ்சு fight பண்ணு.'",
  tv:"Sports ground. Thiruvalluvar sits on the bench.\n\n'உன்னோட வலிமையையும் எதிரியின் வலிமையையும் தெரிந்து செயல்படுபவனே வெல்வான்.'\n\n「வலியறிந்து மேற்செல்வார் வீரர்.」",
  moral:"Know your strength and your limits — acting wisely within them is true courage.",
};
CS[49]={emoji:"⏰",color:"teal",theme:"Right Timing",title:"சரியான நேரம்",location:"Kumbakonam · Farm",chars:["Rajan (10)","Farmer Gopal"],emotion:"Patience · Timing",
  hook:"A farmer watches clouds for three days without planting. His son is frustrated. 'Plant now!'",
  story:"Rajan cannot understand why his father waits. The field is ready. Seeds are ready. 'Now?' 'Not yet.' 'When?' 'When the time is right.' Two days later, rain comes. Gopal plants immediately after. Rajan watches the seeds germinate faster than any early planting. 'I understand now.'",
  dialogue:"Rajan: 'Appa, ஏன் wait பண்றோம்?'\nGopal: 'சரியான நேரத்தில் பண்ணுவது, அவசரமா பண்றதை விட பல மடங்கு better.'\nRajan: 'Patience-ஆ?'\nGopal: 'Patience + awareness. ரெண்டும் வேணும்.'",
  tv:"Rainy morning. Seeds in wet soil. Thiruvalluvar kneels beside them.\n\n'காலம் அறிந்து செயல்படுபவன் எவ்வளவு சிறிய வாய்ப்பையும் பெரிதாக்குவான். அவசரம் வேலையை கெடுக்கும்.'\n\n「காலமறிந்து இடம் ஆற்ற உரைத்தல் அறிவுடைமை.」",
  moral:"Acting at the right moment — with patience and awareness — multiplies every effort.",
};
CS[50]={emoji:"🗺️",color:"blue",theme:"Knowing the Place",title:"போர்க்காள முன்",location:"Trichy · Chess game",chars:["Arjun (13)","Grandfather"],emotion:"Strategy · Wisdom",
  hook:"Two players at a chess board. One rushes moves. One studies the board for two minutes before touching a piece.",
  story:"Grandfather always looks at the entire board before moving. Arjun asks why. 'The position you choose to fight from matters as much as the fight.' He applies this to an argument with a friend — he waits, chooses his words carefully, considers the place and time. The argument resolves peacefully.",
  dialogue:"Arjun: 'Thatha, எல்லாரும் move பண்றாங்க. நீ பார்க்கிற.'\nThatha: 'Board தெரியாம move பண்ணா — piece போகும்.'\nArjun: 'Life-லயும் அப்படியா?'\nThatha: 'எங்கே நிக்கிற, எங்கிருந்து பேசுற — அது முக்கியம்.'",
  tv:"Chess board. Evening. Thiruvalluvar moves a piece deliberately.\n\n'இடம் அறிந்து செயல்படு. எங்கிருந்து நீ செயல்படுகிறாய் என்பது, என்ன செய்கிறாய் என்பதை விட முக்கியம்.'\n\n「இடனறிந்து காலமறிந்து செயல்வகை.」",
  moral:"Choosing the right place and position matters as much as the action itself.",
};

/* ── 51–80 ───────────────────────────────────────────────────── */
CS[51]={emoji:"🤝",color:"gold",theme:"Trust",title:"நம்பிக்கை ஒரேஒரு முறை",location:"Madurai · Office",chars:["Raja (40)","Colleague"],emotion:"Trust · Betrayal → Wisdom",
  hook:"A man discovers his trusted colleague lied to him. He is not angry. He is quietly sad.",
  story:"Raja had trusted Senthil completely. When he discovered the lie, he didn't shout. He just said: 'I trusted you.' Senthil expected anger. This was worse. A watching young intern asks Raja later: 'Why not angry?' 'Anger passes. Lost trust stays.' The intern never forgot that.",
  dialogue:"Raja: 'நான் உன்னை நம்பினேன்.'\nSenthil: 'Sorry.'\nRaja: 'Sorry கொஞ்சம் help பண்ணும். ஆனா நம்பிக்கை போனதை திரும்ப கொண்டு வர முடியாது.'",
  tv:"Evening office. Thiruvalluvar at the window.\n\n'ஆட்களை தேர்ந்தெடு, நம்பிக்கையை கொடு, அதை அவர்கள் காக்கட்டும். நம்பிக்கையை உடைப்பவன் தன்னையே உடைத்துக்கொள்கிறான்.'\n\n「தெரிந்து தெளிந்தவர்.」",
  moral:"Trust is the foundation of every relationship — breaking it breaks yourself.",
};
CS[52]={emoji:"📋",color:"teal",theme:"Right Employment",title:"சரியான கை, சரியான வேலை",location:"Thanjavur · Workshop",chars:["Priya (12)","Master craftsman"],emotion:"Purpose · Wisdom",
  hook:"A craftsman gives a delicate brush to a strong man. The painting is ruined. Everyone winces.",
  story:"Priya asks the old craftsman why he spent so long choosing who does what job. 'The brush needs a gentle hand. The hammer needs a strong hand. Giving the brush to the hammer-hand is waste — of the brush, of the painting, and of the man's real talent.' She thinks about how she's always been pushed into maths when she loves writing.",
  dialogue:"Craftsman: 'வேலை சரியா ஆகணும்னா — சரியான ஆளுக்கு சரியான வேலை.'\nPriya: 'அதுக்கு என்ன பண்ணணும்?'\nCraftsman: 'அவங்க திறமையை தெரிஞ்சு, அதுக்கு matching-ஆ வேலை கொடு.'",
  tv:"Workshop. Thiruvalluvar examines a finished carving.\n\n'ஆளை அறிந்து வேலையை கொடு. அதுவே organisation-ன் ரகசியம்.'\n\n「அவரவர் திறத்தான் அமையப் பணிக்கப் பெறுவார்.」",
  moral:"Assign the right person to the right work — that is the secret of good management.",
};
CS[53]={emoji:"👨‍👩‍👧",color:"rose",theme:"Family",title:"குடும்பம் என்னும் கோட்டை",location:"Coimbatore · Home",chars:["Kavitha (9)","Parents"],emotion:"Family love · Security",
  hook:"A storm outside. Inside — warm lights, family dinner, everyone together. Child looks around with quiet joy.",
  story:"During a power cut and storm, Kavitha's family lit candles and sat together. No phones, no TV. They talked, laughed, told stories. When power returned, no one turned anything on. 'இது better-ஆ இருக்கு,' said Kavitha. Her father said: 'குடும்பம் என்பது ஒரு கோட்டை. வெளியில் எந்த புயல் வந்தாலும், உள்ளே safe.'",
  dialogue:"Kavitha: 'Appa, storm-ல பயமா இல்ல.'\nAppa: 'ஏன்?'\nKavitha: 'நாம் எல்லாரும் இங்க இருக்கோம்.'\nAmma: 'அதுதான் குடும்பம்.'",
  tv:"Candle-lit room. Thiruvalluvar at the doorway.\n\n'குடும்பத்தை காப்பாற்று. அதுவே உன் கோட்டை, உன் பலம், உன் ஓய்விடம்.'\n\n「சிறப்பொடு பூசனை செல்லாது வீடு.」",
  moral:"Family is your fortress — protect it, and it will protect you in every storm.",
};
CS[54]={emoji:"📌",color:"blue",theme:"Duty",title:"மறந்தால் வீழ்வான்",location:"Chennai · Government office",chars:["Officer Muthu (38)","Young clerk"],emotion:"Responsibility · Integrity",
  hook:"A government officer returns to work from vacation to find a file untouched. One family waited months.",
  story:"Officer Muthu finds the young clerk forgot a critical file. A family's medical appeal sat unprocessed for three months. He doesn't shout. He processes it himself immediately. Then to the clerk: 'Forgetting duty is not forgetfulness. It is a choice that affected a real family.' The clerk sees the family's file differently from then on.",
  dialogue:"Muthu: 'இந்த family மூன்று மாசம் காத்திருந்தாங்க.'\nClerk: 'Forget ஆச்சு sir.'\nMuthu: 'Paper forget ஆச்சு. ஆனா அந்த family-க்கு மூன்று மாசம் போச்சு.'",
  tv:"Office evening. Thiruvalluvar by the window.\n\n'கடமையை மறந்தவன் மெல்ல மெல்ல வீழ்வான். கடமையை நினைந்தவன் உயர்வான்.'\n\n「பொச்சாவாமை.」",
  moral:"Forgetting your duty is not forgetfulness — it is a choice that impacts real lives.",
};
CS[55]={emoji:"⚖️",color:"gold",theme:"Just Rule",title:"நேர்மையான கோல்",location:"Madurai · School council",chars:["Student leader Priya (14)","Classmates"],emotion:"Justice · Fairness",
  hook:"The class captain punishes her best friend for breaking a rule. The class goes silent in surprise.",
  story:"Priya punished her closest friend for skipping class duties. Friends expected her to let it go. She didn't. 'Rules are rules. Not for everyone except my friends.' The friend was upset for a day. A week later, she told Priya: 'I respect you more now. You were fair.' The class began taking rules seriously after that.",
  dialogue:"Friend: 'Yaar best friend-nu nee?'\nPriya: 'Nee. Aaanal rule is rule.'\nFriend: 'Fair-aaaa irukkaa?'\nPriya: 'Fair-aaaa irukkaadhavaa class leader-aaaga mudiyadhu.'",
  tv:"School corridor. Thiruvalluvar at the bulletin board.\n\n'நேர்மையான ஆட்சி என்பது நண்பனுக்கு ஒரு விதி, மற்றவனுக்கு ஒரு விதி என்று இல்லாமல் — எல்லாருக்கும் ஒரே விதி.'\n\n「செங்கோன்மை.」",
  moral:"Just leadership treats everyone equally — without favouritism, even of friends.",
};

CS[56]={emoji:"⚡",color:"rose",theme:"Cruel Rule",title:"பயத்தால் கேட்கிறாங்க, மனசால் இல்ல",location:"School · Strictest teacher's class",chars:["Teacher Vijay (45)","Students"],emotion:"Fear → Understanding",
  hook:"Students fall silent the moment the teacher walks in. Not from respect. From fear.",
  story:"Teacher Vijay controls class through fear — shouts, threats, humiliation. Students score okay on exams but hate the subject. One parent asks her daughter: 'Do you like maths?' 'I like the subject. I hate the class.' The teacher hears this indirectly. It is the most useful feedback of his career.",
  dialogue:"Student: 'We score high but hate maths now.'\nParent: 'Why?'\nStudent: 'Fear makes us study. Not interest.'\nParent: 'That is the difference between a ruler who rules by fear and one who rules by love.'",
  tv:"Empty classroom. Thiruvalluvar at the teacher's desk.\n\n'பயத்தால் கேட்கிறார்கள் — ஆனால் மனசால் இல்லை. அன்பில்லாத ஆட்சி நடக்கும் — ஆனால் ஓட்டாது.'\n\n「கொடுங்கோன்மை.」",
  moral:"Rule by fear may work — but rule by love and respect lasts.",
};
CS[57]={emoji:"🕊️",color:"teal",theme:"No Terrorism",title:"பயமின்றி தூங்கும் கிராமம்",location:"Village near Trichy",chars:["Village head","Farmer Gopal"],emotion:"Peace · Security",
  hook:"Children play in the street until dark. No one calls them in early. No one is afraid.",
  story:"Gopal explains to a visitor why this village is so peaceful. 'Our village head never threatened anyone. Never made examples of people. Rules are fair. Help is real.' Visitor: 'But don't people take advantage?' 'No. People respect what they trust. People fear what they resent. Fear makes them obey. Trust makes them cooperate.' The visitor stayed an extra week.",
  dialogue:"Visitor: 'No one is afraid here?'\nGopal: 'No need to be.'\nVisitor: 'How?'\nGopal: 'Fair rules. No threats. Real help. That's it.'",
  tv:"Village evening. Thiruvalluvar on the porch.\n\n'மக்கள் பயமின்றி வாழும் கிராமம் — அதுவே நல்ல ஆட்சியின் அடையாளம்.'\n\n「வெருவந்த செய்யாமை.」",
  moral:"The mark of good governance is a people who sleep without fear.",
};
CS[58]={emoji:"💛",color:"gold",theme:"Kindness",title:"ஒரு சின்ன புன்னகை",location:"Chennai · Hospital",chars:["Nurse Meena (30)","Old patient"],emotion:"Kindness · Human warmth",
  hook:"An old man alone in a hospital bed. A nurse stops, not for medicine — just to ask: 'How are you today?'",
  story:"The old man's family can't visit often. Nurse Meena spends two extra minutes each day just talking to him. Nothing medical. Just kindness. A month later, doctors are puzzled — he's recovering faster than expected. The doctor says to Meena: 'I don't know what you're giving him. Keep giving it.' She smiles.",
  dialogue:"Old man: 'Nurse, neengal thaan varuveengalaa?'\nMeena: 'Naan varuveen. Eppo nee okay-aa?'\nOld man: 'Ippo okay-aa irukku.'\nDoctor: 'Ivanuku entha medicine?'\nMeena: 'Kindness.'",
  tv:"Hospital corridor. Evening. Thiruvalluvar at the window.\n\n'கண்ணோட்டம் — கருணையுடன் பார்ப்பது. அதுவே ஒரு மனிதனை குணப்படுத்தும். மருந்தை விட சக்திவாய்ந்தது.'\n\n「கண்ணோட்டம்.」",
  moral:"A look of kindness heals more than medicine — never underestimate its power.",
};
CS[59]={emoji:"🔍",color:"blue",theme:"Investigation",title:"கண்ணுக்கு தெரியாத உண்மை",location:"Madurai · Detective story for kids",chars:["Inspector Arjun (35)","Boy Murugan (10)"],emotion:"Curiosity · Logic",
  hook:"A man claims he didn't steal. Everyone believes him. Except one person who asks one more question.",
  story:"Inspector Arjun asks one small question no one else thought of. The answer unravels everything. Watching boy Murugan asks: 'How did you know?' 'I didn't. I just kept asking until I did.' 'Is that detective work?' 'That's all detective work is — asking the right questions in the right order.'",
  dialogue:"Murugan: 'How did you find the truth?'\nInspector: 'நான் ஒரு question மட்டும் கேட்டேன் — others கேட்காத question.'\nMurugan: 'அது எப்படி தெரியும்?'\nInspector: 'தெரியாது. கேட்டே தெரியும்.'",
  tv:"Police station evening. Thiruvalluvar at the chalkboard.\n\n'உண்மையை கண்டுபிடிக்க smart-ஆ இருக்கணும். கேள்வி கேட்க தயங்காதே. சத்தியம் எப்போதும் வெளியில் வரும்.'\n\n「ஒற்றாடல்.」",
  moral:"The truth always surfaces — ask the right questions and never stop investigating.",
};
CS[60]={emoji:"⚡",color:"rose",theme:"Energy",title:"தூக்கத்தை வென்ற பையன்",location:"Coimbatore · Early morning",chars:["Karthik (13)","Coach"],emotion:"Motivation · Energy",
  hook:"4:30 AM. A boy's alarm rings. He stares at the ceiling. Then — he gets up.",
  story:"Karthik wanted to make the state swimming team. Coach said: 'The selection is six months away. Start tomorrow.' Karthik started that same night. He set the alarm for 4:30 AM. First day: hard. Second: harder. By week three: habit. His mother watched him leave in the dark every morning. 'Where does he find energy?' His coach said: 'He doesn't find it. He built it.'",
  dialogue:"Coach: '4:30 wake up. Pool at 5.'\nKarthik: 'Everyday?'\nCoach: 'Everyday. Champions are built in the morning no one sees.'\nAmma: 'Kanna, thoongu.'\nKarthik: 'Amma, en swim irukku.'",
  tv:"Pre-dawn pool. Thiruvalluvar at the poolside.\n\n'ஊக்கம் என்பது எங்கோ கிடைக்கும் ஒன்று அல்ல. நீயே உருவாக்கவேண்டும். தினமும் கட்டு. அது வலிமையாகும்.'\n\n「ஊக்கம் உடையான் உழைப்பு.」",
  moral:"Energy is not found — it is built, daily, one early morning at a time.",
};

CS[61]={emoji:"🏃",color:"teal",theme:"No Laziness",title:"நாளை பண்றேன்",location:"Thanjavur · Farm",chars:["Rajan (12)","Uncle"],emotion:"Discipline · Regret",
  hook:"A boy keeps saying 'tomorrow' for three weeks. Then it's too late to plant.",
  story:"Rajan's uncle gave him a small plot to grow vegetables. 'Plant this week.' Rajan kept postponing. Four weeks later: wrong season. Too late. Uncle doesn't scold. 'உன் நாளை வந்துவிட்டது. ஆனா season போய்விட்டது.' Rajan looked at the empty plot for a long time.",
  dialogue:"Rajan: 'Naalaikku pannuveen.'\nUncle: 'Naalaikku ennanuuvittu?'\nRajan: 'Naalaikku...'\nUncle: 'Season-aa wait-aa?'\n(later) Uncle: 'Naalai vandhuduchu. Season eppothoo pogadhu.'",
  tv:"Empty plot. Evening. Thiruvalluvar in the field.\n\n'சோம்பல் வறுமையின் அன்னை. இன்று செய்யக்கூடியதை நாளைக்கு விடாதே.'\n\n「மடி இன்மை.」",
  moral:"Laziness is the mother of poverty — never delay what can be done today.",
};
CS[62]={emoji:"🔨",color:"gold",theme:"Hard Work",title:"ஆயிரம் முறை தோல்வி, ஒரு முறை வெற்றி",location:"Trichy · Potter's workshop",chars:["Old potter","Priya (11)"],emotion:"Perseverance · Respect",
  hook:"A clay pot collapses on the wheel. The old potter starts again. No frustration. Just starts again.",
  story:"Priya watches him collapse and restart seven times. 'Aren't you tired?' 'Yes.' 'Then why continue?' He holds up a finished pot. 'Because this came from the seventh attempt. The first six were practice.' Priya thinks about her failed science project. She goes home and starts it again.",
  dialogue:"Priya: 'Seventh time! Why?'\nPotter: 'Because the seventh pot is possible only after six broken ones.'\nPriya: 'That's patient.'\nPotter: 'That's work.'",
  tv:"Workshop. Seventh pot drying. Thiruvalluvar turns it in his hands.\n\n'மனத்தினால் துணிந்தவன் தன் இடரையும் பொய்யாக்குவான். ஆள்வினை உடைமையே வெற்றியின் ரகசியம்.'\n\n「ஆள்வினை உடைமை.」",
  moral:"Manly effort and persistence — the willingness to restart — is the secret of every success.",
};
CS[63]={emoji:"🌤️",color:"blue",theme:"Hope in Trouble",title:"புயலுக்குப் பிறகு வானம்",location:"Madurai · After floods",chars:["Selvi (10)","Paati"],emotion:"Hope · Resilience",
  hook:"A flooded home. Everything wet. A girl sits on a wet floor, head on her knees.",
  story:"Selvi's house was flooded. Her notebooks, her drawings, her toys — everything ruined. Paati sat beside her in the wet. 'Paati, everything is gone.' 'No. You're here. I'm here.' 'But everything we had—' 'We had it. Now we build again.' Two months later they had rebuilt — and Selvi had kept the outline of a new plan the whole time.",
  dialogue:"Selvi: 'Paati, ellaame poche.'\nPaati: 'Nee irukke. Nan irukkiren.'\nSelvi: 'Aagathu.'\nPaati: 'Pudhu vaazh thodangalam. Ippodhe.'",
  tv:"Dawn after floods. First sunlight. Thiruvalluvar on the clean doorstep.\n\n'துன்பம் வரும்போது முறிந்து விழாதே. துன்பத்திலும் நம்பிக்கையோடு இருப்பவனே உண்மையான வலிமையுள்ளவன்.'\n\n「இடுக்கண் அழியாமை.」",
  moral:"In the middle of hardship, hold your hope — those who never lose it are the truly strong.",
};
CS[64]={emoji:"📜",color:"gold",theme:"Minister's Wisdom",title:"வார்த்தை ஒரு வாள்",location:"Thanjavur · Palace court",chars:["Minister Senthil","Young Raja"],emotion:"Wisdom · Diplomacy",
  hook:"A minister speaks one sentence. A war is prevented. Everyone in the room is silent.",
  story:"Raja's court faced a crisis — a neighbouring king sent a threatening message. Ministers argued. Some said attack, some said bow. Senthil said one sentence. Tension drained from the room. The crisis ended without battle. Raja asked later: 'How?' 'I said what was true, in the way that could be heard.' A good minister is not the loudest — he is the wisest.",
  dialogue:"Raja: 'Eppadi oru sentence-il solve aanadhu?'\nSenthil: 'Unmai-ai, sariyana nerathil, sariyana vaarthaiyil solla therindhen.'\nRaja: 'Andha moodhu oru kavidhai.'\nSenthil: 'Andha moodhu oru vaal.'",
  tv:"Empty court. Thiruvalluvar at the throne steps.\n\n'அமைச்சர் என்பவர் வலிமையான வார்த்தை கொண்டவர். சரியான நேரத்தில் சரியான வார்த்தை — அதுவே ஒரு நாட்டை காக்கும்.'\n\n「அமைச்சு.」",
  moral:"The right word at the right time from a wise advisor can prevent a thousand battles.",
};
CS[65]={emoji:"🗣️",color:"teal",theme:"Power of Speech",title:"வார்த்தை வீரம்",location:"Trichy · Debate competition",chars:["Kavitha (13)","Teacher"],emotion:"Confidence · Clarity",
  hook:"A shy girl stands at a microphone. Her voice trembles at first. Then it doesn't.",
  story:"Kavitha had never spoken in public. Her teacher entered her in the state debate. She was terrified. She prepared for weeks. On stage, first sentence — shaking. Second — steadier. By the end, the audience was leaning forward. She didn't win first. She won third. But her teacher said: 'You won something bigger today.'",
  dialogue:"Teacher: 'First place aana irundhaalum illaadhaalum — nee vandhaaye.'\nKavitha: 'Nervaham pooche.'\nTeacher: 'Adhu nervaham alla — athuve power. Katta kathara vandhuche.'",
  tv:"Competition hall. Thiruvalluvar in the audience.\n\n'வாய்மை வலிமை வாய்ந்த வார்த்தை — அது ஒருவனுக்கு வாள் மட்டுமல்ல, அவனை காக்கும் கேடயமும்.'\n\n「சொல்வன்மை.」",
  moral:"Words are your most powerful tool — train them, and they will carry you anywhere.",
};

/* ── 66–108 — condensed real-life stories ────────────────────── */
const bulk1 = {
66:{emoji:"✨",color:"blue",theme:"Purity in Action",title:"தூய்மையான வேலை",location:"Chennai office",chars:["Young engineer"],emotion:"Integrity",hook:"An engineer finds a shortcut that saves time but cuts corners on safety. He doesn't take it.",story:"The shortcut would have saved his team a week. But it risked the building's users. He chose the harder, right path. His boss asked why. 'Because the people who will use this building don't know my name — but they'll live with my decision.'",dialogue:"Boss: 'Why not the shortcut?'\nEngineer: 'Those people don't know my name. But they'll live with my work.'",tv:"Site office. Thiruvalluvar at the blueprint.\n\n'வினைத் தூய்மை — செயல் சரியாக இருக்கணும். fast-ஆ இல்ல.'\n\n「வினைத் தூய்மை.」",moral:"Do your work with purity — speed without integrity causes harm."},
67:{emoji:"💪",color:"gold",theme:"Power in Action",title:"முடிக்கிறேன்",location:"Coimbatore school project",chars:["Arjun (13)"],emotion:"Determination",hook:"Everyone says the project is too hard. One boy stays behind after school.",story:"Arjun's science project failed twice. Every friend said drop it. He stayed. Third attempt worked. Teacher: 'How?' 'I just decided I would finish it.'",dialogue:"Teacher: 'Others gave up.'\nArjun: 'I decided to finish. That was the difference.'",tv:"Lab. Thiruvalluvar at the window.\n\n'வினைத்திட்பம் — முடிக்கும் மனம். அதுவே வெற்றி.'\n\n「வினைத்திட்பம்.」",moral:"The decision to finish — not talent — is what separates those who succeed."},
68:{emoji:"🎭",color:"rose",theme:"Modes of Action",title:"சரியான வழியில் சரியான வேலை",location:"Madurai market",chars:["Shopkeeper Mani"],emotion:"Wisdom",hook:"A shopkeeper refuses a big order because he can't fulfil it properly. Everyone thinks he's foolish.",story:"Mani turned down a huge order because his team wasn't ready. Six months later, ready and with reputation intact, he got the same client back — bigger order. 'How did you wait?' 'I knew I wasn't ready. Pretending would have ruined everything.'",dialogue:"Client: 'Why turn down the order?'\nMani: 'Because half-done work becomes full-done disaster.'",tv:"Shop. Thiruvalluvar counts stock.\n\n'வேலையை எப்படி செய்கிறாய் என்பது அவ்வளவு முக்கியம். சரியான வழியில் செய்.'\n\n「வினை செயல்வகை.」",moral:"How you do a task matters as much as doing it — the right method protects the result."},
69:{emoji:"📨",color:"teal",theme:"The Envoy",title:"தூதன் வார்த்தை",location:"Thanjavur court",chars:["Young messenger Selvi"],emotion:"Courage · Diplomacy",hook:"A young girl carries a difficult message between two arguing families. Everyone watches.",story:"Selvi delivers the message exactly as given — without changing a word to please either side. Both families are upset at first. Then, hearing the truth, they settle. Selvi's grandmother: 'A messenger's job is truth, not peace-making.'",dialogue:"Family 1: 'Tell them they were wrong!'\nSelvi: 'I can only say what I was asked to say.'\nGrandmother: 'That is the whole duty of a messenger.'",tv:"Village path. Thiruvalluvar walks beside her.\n\n'தூதன் உண்மையை கொண்டு போவான். அவன் சொந்த விருப்பை அல்ல.'\n\n「தூது.」",moral:"A true messenger carries the truth — not their own wishes."},
70:{emoji:"👑",color:"gold",theme:"Royal Court",title:"அரசர் முன்",location:"Palace",chars:["Young advisor Priya"],emotion:"Respect · Tact",hook:"Everyone in the royal court flatters the king. One young advisor says something different.",story:"Priya tells the king a truth no one else will — gently, respectfully, at the right moment. The king is surprised, then nods. She leaves with her position intact. The flatterers are ignored.",dialogue:"King: 'Others say I am always right.'\nPriya: 'With respect, sire — you are almost always right. This one time, the people need something different.'\nKing: '...speak.'",tv:"Court evening. Thiruvalluvar at the doorway.\n\n'அரசர் முன் உண்மையை சொல் — கோபிக்காமல், மரியாதையோடு. அதுவே உண்மையான சேவை.'\n\n「மன்னரைச் சேர்ந்து ஒழுகல்.」",moral:"Speak truth to power — respectfully, at the right moment, without fear."},
};
Object.assign(CS, bulk1);

const bulk2 = {
71:{emoji:"👁️",color:"blue",theme:"Reading Signals",title:"கண்கள் பேசும்",location:"Kanchipuram school",chars:["Teacher Nandini","Student"],emotion:"Empathy",hook:"A teacher notices a student's silence and asks one question. Everything changes.",story:"Student Murugan hadn't submitted work for two weeks. Teacher noticed his body language — not lazy, withdrawn. She asked privately: 'You okay at home?' Everything came out. She connected the family to the right help.",dialogue:"Teacher: 'Two weeks. Not lazy. Something else?'\nMurugan: '...'\nTeacher: 'You don't need to tell me everything. Just tell me if you need help.'\nMurugan: 'Yes.'",tv:"Teacher's room. Thiruvalluvar.\n\n'குறிப்பறிதல் — சொல்லாமல் சொல்வதை புரிந்துகொள். அதுவே உண்மையான கவலை.'\n\n「குறிப்பறிதல்.」",moral:"Reading what is unsaid is the highest form of care."},
72:{emoji:"🏛️",color:"teal",theme:"Council Wisdom",title:"சபையில் பேச்சு",location:"Madurai panchayat",chars:["Village council","Selvi's uncle"],emotion:"Wisdom",hook:"A village council argument goes in circles. One woman asks one quiet question. Silence falls.",story:"The debate about the new well location had gone on for an hour. Elder Muniamma asked: 'Who does NOT have water access right now?' That question ended the debate. The answer was obvious. The well was placed accordingly.",dialogue:"Elder: 'En kelu — ippa yarukkku thannir illai?'\n(Silence)\nAll: 'Oh.'",tv:"Panchayat tree. Thiruvalluvar.\n\n'சபை என்பது வாதிடும் இடம் அல்ல — தெளிவு கண்டுபிடிக்கும் இடம். சரியான கேள்வியே சரியான பதிலை கொண்டுவரும்.'\n\n「அவை அறிதல்.」",moral:"The right question in the right assembly finds the answer no argument could."},
73:{emoji:"🎤",color:"gold",theme:"Fearless Speech",title:"சபையில் தைரியம்",location:"Trichy school debate",chars:["Kavitha (14)"],emotion:"Courage",hook:"A girl raises her hand in a room full of adults. They all look at her.",story:"At a town hall for adults, 14-year-old Kavitha raises her hand and says what the students really need from the local school. Adults are surprised. The principal is uncomfortable. The district officer nods. Her point is included in the next budget. 'How were you not scared?' 'I was. But silence would have changed nothing.'",dialogue:"Adult: 'She's just a student.'\nKavitha: 'I am the student you're making decisions for.'\nOfficer: 'She's right. Note that point.'",tv:"Town hall. Thiruvalluvar in the back row applauding.\n\n'சபைக்கு அஞ்சாமை — உண்மையை உரக்க சொல்லும் தைரியம். அதுவே ஞானம்.'\n\n「அவை அஞ்சாமை.」",moral:"Fear of the assembly silences truth — speak boldly when truth needs a voice."},
74:{emoji:"🌾",color:"teal",theme:"Good Land",title:"நல்ல மண்",location:"Thanjavur paddy fields",chars:["Farmer Gopal","Son Rajan"],emotion:"Gratitude · Stewardship",hook:"A boy asks why farmers touch the soil before planting. 'It's just dirt.' Father shakes his head.",story:"Gopal explains that their land has been in the family for five generations. They have never over-farmed it. They rotate crops, let it rest, return what they take. 'Respect the land and it respects you back. Abuse it and it gives up.' Rajan touches the black soil differently.",dialogue:"Rajan: 'Why touch the soil every morning?'\nGopal: 'Gratitude. It feeds us. We must care for it.'\nRajan: 'Like a person?'\nGopal: 'Better than a person. It never lies.'",tv:"Field at dawn. Thiruvalluvar kneels in the soil.\n\n'நல்ல நாடு — வளமான மண், நீர், மக்கள். இதை காக்கிறவன் எல்லாவற்றையும் காக்கிறான்.'\n\n「நாடு.」",moral:"Respect and care for the land that feeds you — it is a living gift."},
75:{emoji:"🏰",color:"blue",theme:"Fortification",title:"கோட்டையின் ஞானம்",location:"Madurai · History class",chars:["Teacher","Arjun (12)"],emotion:"Strategy",hook:"A history teacher asks: 'Why did old kings build walls?' A boy says: 'To stop enemies.' 'Wrong answer.'",story:"Teacher explains: 'Walls were built to protect time — time to think, plan, negotiate. A fort buys you time. Without it, you react in panic.' Arjun applies this to his own life: planning ahead, having savings, preparing. 'My fort is preparation.'",dialogue:"Arjun: 'Fort means protection.'\nTeacher: 'Fort means time. Time to think. Time to decide. The wall protects your thinking.'",tv:"History class. Thiruvalluvar at the map.\n\n'அரண் என்பது உடல் பாதுகாப்பு மட்டுமல்ல — மன பலம். தயாரிப்பே உண்மையான அரண்.'\n\n「அரண்.」",moral:"A fortress protects time to think — preparation is your greatest defence."},
76:{emoji:"💰",color:"gold",theme:"Earning Wealth",title:"பணம் எப்படி வரணும்?",location:"Coimbatore market",chars:["Shopkeeper Karthik's father","Karthik (12)"],emotion:"Integrity · Wisdom",hook:"A shopkeeper turns down a deal that would make him rich — but requires dishonesty.",story:"Karthik's father refuses a wholesaler's offer that involves selling adulterated goods. 'But we'd earn so much!' Father explains: 'Money from wrong sources burns. Clean money, even if less, lasts.' Ten years later, their shop is the most trusted in the market. The wholesaler went to jail.",dialogue:"Karthik: 'Why turn down easy money?'\nFather: 'No money is easy. Wrong money is expensive in ways you can't see yet.'",tv:"Shop front. Thiruvalluvar behind the counter.\n\n'நேர்மையாக சம்பாதித்த பணம் கோடியல்ல — ஆனால் நிரந்தரம். தவறான வழியில் வந்தது தீயில் விழும்.'\n\n「பொருள் செயல்வகை.」",moral:"Wealth earned honestly — even if less — lasts. Wealth earned wrongly burns itself out."},
77:{emoji:"🛡️",color:"rose",theme:"Army Excellence",title:"வலிமை என்பது என்ன?",location:"School · Sports day",chars:["Coach Ravi","Team"],emotion:"Teamwork · Courage",hook:"The weakest player on the team scores the winning point. No one saw it coming.",story:"The team had trained together. When their star player was injured, the 'weakest' stepped up — because the whole team had prepared everyone. Coach Ravi had always trained all eleven, not just the best five. 'Real strength is when the whole team is strong.'",dialogue:"Coach: 'Naan single star-ai build panna matten. Twelve-um strong-aanavanga.'\nStar: 'But the focus—'\nCoach: 'The focus is the team.'",tv:"Sports ground. Thiruvalluvar in the stands.\n\n'படை மாட்சி என்பது ஒரு வீரனில் இல்ல — அணை முழுவதுமே பலமாக இருக்கும்போது.'\n\n「படை மாட்சி.」",moral:"True strength lies in the whole team — not in one hero."},
78:{emoji:"⚔️",color:"blue",theme:"Military Spirit",title:"வீழாத மனம்",location:"School obstacle course",chars:["Student Murugan","Coach"],emotion:"Courage · Spirit",hook:"A boy falls at the obstacle. Gets up. Falls again. Gets up again. Again.",story:"Murugan falls seven times on the obstacle course. Each time, he gets up. Not because he thinks he'll win. Just because lying on the ground is not where he plans to stay. He doesn't win the race. But the coach calls him to the front. 'This is what warrior spirit looks like.'",dialogue:"Friend: 'You keep falling.'\nMurugan: 'I keep getting up. Different thing.'\nCoach: 'That is the spirit no enemy can break.'",tv:"Obstacle course. Thiruvalluvar at the finish line.\n\n'படைச் செருக்கு — வீழ்ந்தாலும் எழுவது. அது தோல்வி அல்ல. அதுவே வெற்றியின் ஆரம்பம்.'\n\n「படைச் செருக்கு.」",moral:"Warrior spirit is not about never falling — it is about always getting up."},
79:{emoji:"🤗",color:"teal",theme:"True Friendship",title:"இரு நண்பர்",location:"Trichy school",chars:["Arjun","Priya"],emotion:"Friendship · Loyalty",hook:"Arjun's best friend is about to make a terrible decision. Priya is the only one honest enough to say something.",story:"Arjun was about to cheat in the exam. Everyone else was either joining him or staying quiet. Priya, alone, whispered: 'Don't.' He didn't. They didn't speak for a week after. Then he came back: 'You were the only real friend in the room.'",dialogue:"Arjun: 'Everyone else said nothing.'\nPriya: 'A real friend doesn't just agree with you.'\nArjun: '...You were right.'",tv:"School corridor. Thiruvalluvar near the lockers.\n\n'நட்பு என்பது feel-good வார்த்தை சொல்வதல்ல. உண்மையை சொல்லும் தைரியம்தான் நட்பின் அடிப்படை.'\n\n「நட்பு.」",moral:"Real friendship is having the courage to say the hard truth — not just the comfortable one."},
80:{emoji:"🔍",color:"gold",theme:"Choosing Friends",title:"யாரை நண்பனாக்குவது?",location:"Madurai · New school year",chars:["Kavitha (12)","Mother"],emotion:"Wisdom",hook:"First day at new school. Everyone wants to be popular. One girl just wants to find the right people.",story:"Kavitha's mother said: 'Don't rush. Watch first. A month of observation is worth a year of regret.' Kavitha watched — who helped others, who told the truth even when it cost them, who laughed kindly. She made her friend decisions slowly. Two years later she had three close friends. They were enough.",dialogue:"Kavitha: 'How do I make friends?'\nMother: 'Slowly. Watch. Who are they when no one is watching?'",tv:"School courtyard. Thiruvalluvar on the bench.\n\n'நண்பனை ஆராய்ந்து தேர்ந்தெடு. அவசரப்படாதே. தவறான நண்பன் ஆயிரம் எதிரிகளை விட ஆபத்தானவன்.'\n\n「நட்பாராய்தல்.」",moral:"Choose friends slowly and carefully — a wrong friend is more dangerous than a known enemy."},
};
Object.assign(CS, bulk2);

const bulk3 = {
81:{emoji:"🌳",color:"blue",theme:"Old Friends",title:"பழைய மரம்",location:"Kumbakonam",chars:["Gopal","Childhood friend"],emotion:"Warmth",hook:"Two old men meet after 30 years. They pick up mid-sentence.",story:"Gopal and his childhood friend meet at a family event. They haven't spoken in decades. Within minutes they're laughing about the same old things. 'Real friendship doesn't need maintenance.'",dialogue:"Friend: 'Thirty years!'\nGopal: 'Feels like yesterday.'\nFriend: 'That's what real friendship is.'",tv:"Garden. Thiruvalluvar under the old tree.\n\n'பழைமை என்பது பழைய நட்பு. வேர் ஆழமாக இருக்கும்போது தண்ணீர் இல்லாமலும் மரம் நிற்கும்.'\n\n「பழைமை.」",moral:"A true old friendship needs no maintenance — its roots run too deep."},
82:{emoji:"⚠️",color:"rose",theme:"Bad Friends",title:"கெட்ட நட்பு",location:"Chennai apartment complex",chars:["Murugan (13)","Parents"],emotion:"Warning",hook:"A boy's grades drop. Parents search for why. They find his new friends.",story:"Murugan's performance dropped sharply over two months. His old habits — early sleep, study, sport — disappeared. His parents traced it. His new friends didn't value any of it. No dramatic scene — just a quiet conversation: 'Is this who you want to be?' The answer was no.",dialogue:"Mother: 'Your new friends — where are they going in life?'\nMurugan: 'I don't know.'\nMother: 'Then how do you know they're going somewhere good?'",tv:"Home. Thiruvalluvar at the door.\n\n'தீய நட்பு மெல்ல மெல்ல உன்னை அழிக்கும் — திடீரென அல்ல. விட்டு விடு.'\n\n「தீ நட்பு.」",moral:"Bad company destroys slowly — by the time you notice, the damage is done."},
83:{emoji:"🎭",color:"gold",theme:"Fake Friends",title:"முகமூடி",location:"School · Exam results day",chars:["Selvi","Fake friend"],emotion:"Betrayal → Wisdom",hook:"Results day. Selvi passes. Her 'friend' suddenly disappears.",story:"The friend was always there when Selvi could help her. When Selvi needed help, she vanished. Selvi's grandmother: 'A fake friend is like a shadow — present in the sun, gone in the dark.' Selvi understood exactly what had happened.",dialogue:"Grandmother: 'Where's your friend?'\nSelvi: 'Gone.'\nGrandmother: 'Shadow — gone when you need shade most.'",tv:"School gate. Thiruvalluvar.\n\n'கூடா நட்பு என்பது நிழல் மாதிரி — வெயிலில் இருக்கும், இருட்டில் இல்லாமல் போகும். கண்டுபிடி. விட்டு விடு.'\n\n「கூடா நட்பு.」",moral:"A fake friend is a shadow — present when you shine, gone when you're in the dark."},
84:{emoji:"🤦",color:"rose",theme:"Folly",title:"தெரியாமல் பண்றதும் தவறுதான்",location:"Coimbatore school",chars:["Karthik (11)","Teacher"],emotion:"Humility",hook:"A boy breaks something trying to help. 'I didn't mean to!' 'But it's still broken.'",story:"Karthik wanted to fix the projector. He didn't know how. He broke it completely. Teacher: 'Your intention was good. But good intentions without knowledge cause harm.' 'So I need to learn first?' 'Always. Especially when you're trying to help.'",dialogue:"Karthik: 'I was just trying to help!'\nTeacher: 'I know. But broken is broken. Next time — learn, then help.'",tv:"Classroom. Thiruvalluvar at the broken projector.\n\n'நல்ல எண்ணம் இருந்தாலும், அறிவில்லாமல் செய்வது foolishness. அறிந்து செய்.'\n\n「பேதைமை.」",moral:"Good intentions without knowledge cause harm — always learn before you help."},
85:{emoji:"😵",color:"blue",theme:"Ignorance",title:"தெரியாதது தெரியல",location:"Salem · Street",chars:["Murugan","Passers-by"],emotion:"Self-awareness",hook:"Man gives wrong directions confidently. The traveller walks away. The man feels smart. He shouldn't.",story:"Murugan later learns the traveller ended up in the wrong city. He was too embarrassed to say 'I don't know.' His mother: 'The most dangerous ignorance is the kind that thinks it is knowledge. At least not knowing you know nothing is honest.'",dialogue:"Mother: 'You gave wrong directions?'\nMurugan: 'I thought I knew!'\nMother: 'Thinking you know is worse than not knowing. It misleads others.'",tv:"Street corner. Thiruvalluvar.\n\n'தெரியல என்று சொல்ல தெரியாதது பெரிய அறியாமை. அதை ஒப்புக்கொள்வதே ஞானம்.'\n\n「புல்லறிவாண்மை.」",moral:"The worst ignorance is not knowing you don't know — admitting it is wisdom."},
86:{emoji:"🕊️",color:"teal",theme:"Avoiding Conflict",title:"சண்டை வேண்டாம்",location:"Thanjavur · Neighbours",chars:["Family A","Family B","Elder"],emotion:"Peace",hook:"Two families argue over a fence. Both are wrong. Both are too proud to say so.",story:"After months of escalating dispute, elder Muniamma asks both: 'What do you both actually want?' 'Peace.' 'Then why are you both doing the opposite of peace?' Silence. The fence was moved six inches. Both went home satisfied.",dialogue:"Family A: 'We want peace!'\nFamily B: 'We too!'\nElder: 'Then why are both of you making war?'",tv:"Village centre. Thiruvalluvar.\n\n'இகல் — தேவையில்லாத பகை. அது இரு பக்கத்தையும் சேதப்படுத்தும். தவிர்ப்பதே ஞானம்.'\n\n「இகல்.」",moral:"Unnecessary conflict destroys both sides — avoiding it wisely is the greater strength."},
87:{emoji:"⚡",color:"rose",theme:"Power of Hatred",title:"எதிரி பலமா இருக்கான்",location:"School · Competition",chars:["Priya","Rival Deepa"],emotion:"Strategy",hook:"A girl's rival wins every competition. She's angry. Her coach says: 'Good. Use it.'",story:"Priya's anger at Deepa kept her training harder every week. Then Deepa won state. Priya sat with her anger. Her coach said: 'A strong rival is a gift. She made you better than you'd have been without her.' Priya wins the next year. She thanks Deepa at the ceremony.",dialogue:"Coach: 'Thank her.'\nPriya: 'She beat me!'\nCoach: 'She made you. Different thing.'",tv:"Competition stage. Thiruvalluvar in the crowd.\n\n'பகை மாட்சி — வலிமையான எதிரி உன்னை வலிமையாக்குவான். அதை புரிந்தவன் எதிரியை கூட நன்றியுடன் பார்ப்பான்.'\n\n「பகை மாட்சி.」",moral:"A powerful rival is a gift — they push you to become what you could not alone."},
88:{emoji:"🔭",color:"blue",theme:"Quality of Hate",title:"எதிரியை புரிஞ்சுக்கோ",location:"Chess tournament",chars:["Arjun (13)","Coach"],emotion:"Strategy",hook:"Two chess players. One is obsessed with attacking. One studies the other's pattern quietly.",story:"Arjun always attacked. He kept losing to one player. Coach said: 'You play your game. He plays his. Learn his game first.' Arjun spent a week studying his rival's patterns. Next match — he knew every move three steps ahead. He won. 'I had to understand him to defeat him.'",dialogue:"Coach: 'Stop attacking. Start observing.'\nArjun: 'But I want to win!'\nCoach: 'Understand the enemy. Then win.'",tv:"Chess board. Thiruvalluvar opposite.\n\n'பகையை அறிந்து போர் தொடு. அவனை தெரியாமல் போர் தொடுவது புத்தியற்ற செயல்.'\n\n「பகைத்திறம் தெரிதல்.」",moral:"Know your opponent before fighting — understanding is the beginning of victory."},
89:{emoji:"🪞",color:"gold",theme:"Inner Enemy",title:"உன் மிகப்பெரிய எதிரி",location:"Home · Mirror",chars:["Selvi (12)","Grandmother"],emotion:"Self-awareness",hook:"A girl is angry at everyone — her teacher, her friend, her parents. Her grandmother hands her a mirror.",story:"Grandmother says nothing. Just gives Selvi the mirror. Selvi looks. 'What am I looking for?' 'The source of your problem.' Selvi is confused. Then slowly, she understands — her anger, her self-doubt, her fear. They were coming from inside.",dialogue:"Selvi: 'All these people make me angry!'\nGrandmother: 'Look in the mirror. Who else is there?'\nSelvi: '...Oh.'",tv:"Home room. Thiruvalluvar at the mirror.\n\n'உட்பகை — உன் மனசிற்குள் இருக்கும் எதிரி. அவனை முதல் வெல்லு. பிறகு வேற எதிரி தேட வேண்டாம்.'\n\n「உட்பகை.」",moral:"Your greatest enemy lives inside you — defeat that one first.",
},
90:{emoji:"🧓",color:"teal",theme:"Not Offending Elders",title:"பெரியோரை புண்படுத்தாதே",location:"Village · Festival",chars:["Karthik (11)","Village elder"],emotion:"Respect",hook:"A boy laughs at an old man's outdated advice. That evening he needs that exact advice.",story:"Karthik dismissed the old man's weather advice at the festival. It rained exactly as the man predicted. Karthik got drenched. The old man handed him a dry cloth without a word. Karthik learned two things that day.",dialogue:"Elder: 'Rain by evening.'\nKarthik: 'He's old-fashioned.'\n(Rain comes.)\nElder: (gives cloth, says nothing)",tv:"Village path. Thiruvalluvar beside the old man.\n\n'பெரியோரை புண்படுத்துவது நம்மையே கெடுக்கும். அவர்களின் அனுபவம் நம் book-ல் இல்லாத knowledge.'\n\n「பெரியாரைப் பிழையாமை.」",moral:"Disrespecting elders harms you most — their experience contains wisdom no book can give."},
};
Object.assign(CS, bulk3);

/* ── 91–133 ───────────────────────────────────────────────────── */
const bulk4 = {
91:{emoji:"🦅",color:"blue",theme:"Independence",title:"தனியாக நிற்கும் மரம்",location:"Chennai apartment",chars:["Teenage boy Arjun","Father"],emotion:"Independence · Wisdom",hook:"A boy always asks his father to solve every problem. One day his father doesn't answer.",story:"Father stopped solving Arjun's problems. Not because he stopped caring — because Arjun was 15 and needed to learn. First week: Arjun was angry. Second week: he started figuring things out. Month later: 'I solved it myself.' Father smiled. 'That was always the goal.'",dialogue:"Arjun: 'Why won't you help?'\nFather: 'I am helping. Just differently.'\nArjun: 'This feels hard.'\nFather: 'That feeling is you growing.'",tv:"Home study room. Thiruvalluvar at the desk.\n\n'சொந்தமாக நிற்க கற்றுக்கோ. பிறரை சார்ந்திருப்பது நிரந்தர weakness. உன் வலிமையே உன் கோட்டை.'\n\n「பெண்வழிச் சேறல் — சார்பு இல்லாமல் வாழு.」",moral:"Learn to stand on your own — dependence on others is a permanent weakness."},
92:{emoji:"🔐",color:"gold",theme:"Integrity",title:"யாரும் பார்க்காத நேரம்",location:"Coimbatore shop",chars:["Kavitha (11)","Shopkeeper"],emotion:"Honesty · Character",hook:"A shop is empty. The owner is in the back. A girl stands at the counter with extra change.",story:"Same story as kural 29 but different angle — Kavitha returns the money. Shopkeeper Mani: 'Most people wouldn't.' Kavitha: 'Most people don't have to answer to themselves later.' Mani frames that sentence on his wall.",dialogue:"Mani: 'You came back for ₹10?'\nKavitha: 'I came back for myself.'\nMani: 'What?'\nKavitha: 'I have to be the same person whether you're watching or not.'",tv:"Shop counter. Thiruvalluvar.\n\n'வரைவின் மகளிர் — character என்பது யாரும் பார்க்காத நேரத்தில் என்ன செய்கிறோம் என்பது. அதுவே உண்மையான integrity.'\n\n「வரைவின் மகளிர்.」",moral:"Character is who you are when no one is watching."},
93:{emoji:"💧",color:"teal",theme:"Sobriety",title:"தெளிந்த மனசு",location:"Village tea shop",chars:["Old tea-shop owner","Young man"],emotion:"Clarity · Wisdom",hook:"A young man is about to make a bad decision. The tea shop owner gives him one cup of tea and one sentence.",story:"Thirst for approval pushed the young man toward a harmful shortcut. The old shop owner heard him out, gave him tea, and said: 'A clouded mind makes decisions it regrets. Sit. Drink. Think.' The man sat for an hour. He didn't take the shortcut. The tea was the pause he needed.",dialogue:"Young man: 'I need to decide now!'\nShop owner: 'Sit. Drink first.'\nYoung man: 'There's no time!'\nShop owner: 'A bad decision made fast takes years to fix.'",tv:"Tea shop. Evening. Thiruvalluvar with a cup.\n\n'தெளிந்த மனசே சரியான முடிவை எடுக்கும். அவசரமான மனசு எப்போதும் தவறான வழியில் போகும்.'\n\n「கள்ளுண்ணாமை — மனத் தெளிவு.」",moral:"A clear mind makes right decisions — never decide in a cloud of haste or pressure."},
94:{emoji:"🚫",color:"rose",theme:"No Gambling",title:"ஒரு வாய்ப்பு போச்சு",location:"Trichy market",chars:["Karthik (13)","Uncle"],emotion:"Warning · Regret",hook:"A boy wins ₹100 gambling. He bets it again immediately. Loses everything. He stares at empty hands.",story:"Uncle watches. He doesn't lecture. Just: 'How much did you win before losing everything?' '₹100.' 'And before that?' '₹50.' 'Before that?' '₹0. I started with ₹0.' 'So you lost all your winnings and your start. Gambling always ends at zero — or below.' Karthik never touched it again.",dialogue:"Karthik: 'I won ₹100!'\nUncle: 'And now?'\nKarthik: 'Gone.'\nUncle: 'Gambling ends where it begins — at nothing. Or worse.'",tv:"Market corner. Thiruvalluvar.\n\n'சூது — ஒருவனை மெல்ல கொல்லும் பழக்கம். வெற்றியும் அதே விஷம் — மீண்டும் விழ வைக்கும்.'\n\n「சூது.」",moral:"Gambling always ends at zero — even winning is a trap that leads to losing."},
95:{emoji:"🌿",color:"teal",theme:"Medicine and Health",title:"உடம்பே கோவில்",location:"Madurai · Home",chars:["Meena (10)","Doctor uncle"],emotion:"Health · Responsibility",hook:"A doctor examines a sick child. 'What did you eat this week?' The answer surprises no one.",story:"Meena was always sick but never understood why. Doctor uncle (her mother's brother) didn't prescribe medicine first. He listed what she ate, slept, exercised. 'Your body is trying to tell you something. Medicine is the last resort. Prevention is the first.' He prescribed a daily walk and one less biscuit packet.",dialogue:"Doctor: 'Medicine is the last resort.'\nMeena: 'Then what's first?'\nDoctor: 'Listening to your body before it shouts.'",tv:"Home verandah. Thiruvalluvar.\n\n'மருந்து — நோய் வந்தால் மட்டுமல்ல. நோய் வராமல் காக்கவும். உடம்பை மதி.'\n\n「மருந்து.」",moral:"Prevention is the first medicine — listen to your body before it has to shout."},
96:{emoji:"🌟",color:"gold",theme:"Nobility",title:"பரம்பரை அல்ல, பண்பு",location:"Coimbatore school",chars:["Priya","Rich classmate Vikram"],emotion:"True nobility",hook:"The richest boy in school is also the rudest. The janitor's son is the most respected.",story:"Vikram's family name is old and wealthy. But he is rude to the cafeteria staff, ignores the janitor, mocks weaker students. The janitor's son Murugan helps everyone, greets everyone, never shows off. Teachers always call Murugan first for responsibilities. Priya asks why. Teacher: 'Birth gives a name. Character gives nobility.'",dialogue:"Priya: 'Vikram has everything.'\nTeacher: 'He has money. Murugan has something rarer.'\nPriya: 'What?'\nTeacher: 'குடிமை — nobility that comes from character, not birth.'",tv:"School corridor. Thiruvalluvar near the janitor's broom.\n\n'குடிமை என்பது பரம்பரை அல்ல — பண்பு. நல்ல பண்பு உள்ளவனே உண்மையான பெரியவன்.'\n\n「குடிமை.」",moral:"True nobility comes from character — not from family name or wealth."},
97:{emoji:"🏅",color:"teal",theme:"Honour",title:"மானம் போனால்",location:"Madurai",chars:["Student Selvi (13)"],emotion:"Self-respect",hook:"A girl is offered an easy shortcut that requires betraying her values. She refuses. She pays a price.",story:"Selvi could have copied in the exam and gotten full marks. Her friend offered. She said no. She scored average. Her friend scored top — and she knows what it cost. Selvi's grandmother: 'Maanam — self-respect — is the thing that, once lost, cannot be bought back at any price.'",dialogue:"Friend: 'Just copy. No one will know.'\nSelvi: 'I'll know.'\nFriend: 'That's all?'\nSelvi: 'That's everything.'",tv:"School gate. Thiruvalluvar.\n\n'மானம் — உன்னை நீயே மதிப்பது. அதை விட்டவன் எல்லாவற்றையும் இழந்தவன்.'\n\n「மானம்.」",moral:"Self-respect is the one thing that once lost cannot be bought back — guard it above all."},
98:{emoji:"👑",color:"gold",theme:"Greatness",title:"பெரியவர் யார்?",location:"Chennai · Bus stop",chars:["Old man","College student Arjun"],emotion:"Humility · True greatness",hook:"A very simply dressed old man. A student dismisses him. Then finds out who he is.",story:"Arjun didn't give his bus seat to the old man — he looked ordinary. Later he discovered the man is a renowned doctor who spent 40 years in villages treating the poor for free. 'He looked so... normal.' His professor: 'Great people rarely look the way we expect them to. Greatness is not in the appearance — it is in the life.'",dialogue:"Arjun: 'He looked ordinary.'\nProfessor: 'All great people do. That's what makes them great.'\nArjun: 'I'm ashamed.'\nProfessor: 'Good. That feeling is respect arriving late.'",tv:"Bus stop. Thiruvalluvar beside the old doctor.\n\n'பெருமை என்பது உயரமான குரல் அல்ல — அமைதியான வாழ்க்கை. உண்மையான பெரியவன் தன்னை பெரியவன் என்று சொல்லமாட்டான்.'\n\n「பெருமை.」",moral:"True greatness is quiet — great people never announce themselves."},
99:{emoji:"💎",color:"blue",theme:"Perfectness",title:"முழுமை என்பது",location:"Thanjavur · Craftsman workshop",chars:["Old craftsman","Apprentice Rajan"],emotion:"Excellence",hook:"An apprentice finishes a carving. Master breaks it. 'Do it again.' The boy is stunned.",story:"Rajan worked three days on the carving. Master looked once and broke it. 'Again.' Rajan was furious. Did it again. Master broke it again. 'Again.' Third time — perfect. Master kept it. 'Why did you break the first two?' 'They were good. Not complete. I needed you to know the difference.'",dialogue:"Rajan: 'Why break good work?'\nMaster: 'Because good and complete are different things. I need you to feel the difference.'\nRajan: 'How will I know complete?'\nMaster: 'You'll feel it. Same as I did.'",tv:"Workshop. Third carving on the shelf. Thiruvalluvar examines it.\n\n'சான்றாண்மை — முழுமை. அது நெருங்குவதற்கு முன் பல முறை ஆரம்பிக்கவேண்டியிருக்கும். ஆனால் அது worthy.'\n\n「சான்றாண்மை.」",moral:"Perfectness demands doing it again and again — until you feel the difference between good and complete."},
100:{emoji:"🌸",color:"rose",theme:"Courtesy",title:"ஒரு வார்த்தையின் வலிமை",location:"Trichy · Tea shop",chars:["Tea shop girl Meena (12)","Customer"],emotion:"Kindness · Courtesy",hook:"A grumpy customer. A cheerful girl at the counter says two words. He smiles for the first time that day.",story:"The customer had a terrible morning. He was short with everyone. Young Meena served his tea and said: 'Good morning, sir. I hope today gets better.' Two words of genuine courtesy. He stopped. He apologised for being rude. He left a big tip. He came back the next day and every day after.",dialogue:"Customer: 'Tea. Fast.'\nMeena: 'Good morning, sir. Hope today gets better.'\nCustomer: (stops) 'I'm sorry for being rude.'\nMeena: 'It's okay. Tea's hot. That always helps.'",tv:"Tea shop morning. Thiruvalluvar at the window.\n\n'பண்புடைமை — நல்ல பேச்சு, நல்ல நடத்தை. அது எல்லாரையும் உருக்கும். கோபியையும்.'\n\n「பண்புடைமை.」",moral:"Courtesy costs nothing and changes everything — even one warm word can turn a day around."},
};
Object.assign(CS, bulk4);

/* ============================================================
   Rendering layer — table, search, modal, theme, sidebar
   ============================================================ */

/* Build the row list once, in kural order. Each row carries its
   numeric Number plus a search bucket for fast filtering. */
const ALL_ROWS = Object.keys(CS)
  .map(Number)
  .sort((a, b) => a - b)
  .map((n) => {
    const s = CS[n];
    return {
      Number: n,
      id: kuralId(n),
      ...s,
      _search: [
        "TK-" + String(n).padStart(4, "0"),
        String(n),
        s.theme, s.title, s.location,
        (s.chars || []).join(" "),
        s.emotion, s.hook, s.story,
        s.dialogue, s.tv, s.moral,
      ].join(" ").toLowerCase(),
    };
  });

const COLUMNS = [
  { key: "id",    className: "col-id",    label: "ID",
    render: (r) => `<span class="story-id-badge anim-glow">${esc(r.id)}</span>` },
  { key: "story", className: "col-story", label: "Story",
    render: (r) => `
      <div class="story-title-cell">${esc(r.title)}</div>
      <div class="tag" style="margin-top:4px">${esc(r.location)}</div>
      <div class="tag" style="opacity:.7;margin-top:2px">${esc((r.chars || []).join(" \u00b7 "))}</div>` },
  { key: "theme", className: "col-theme", label: "Theme",
    render: (r) => `<span class="story-theme-badge story-badge-${esc(r.color)}">${esc(r.emoji)} ${esc(r.theme)}</span>` },
  { key: "read",  className: "col-action", label: "",
    render: (r) => `<button type="button" class="read-btn" data-id="${r.Number}">${ICONS.play}Read</button>` },
];

/* ---- helpers ---- */
function esc(text) {
  const d = document.createElement("div");
  d.textContent = text == null ? "" : String(text);
  return d.innerHTML;
}

function showToast(message) {
  let toast = document.querySelector(".ui-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "ui-toast";
    toast.innerHTML = `<span class="ui-toast-icon">${ICONS.moon}</span><span class="ui-toast-text"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector(".ui-toast-text").textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 3000);
}

/* ---- table render ---- */
function renderTable(rows) {
  if (!rows.length) {
    return `<div class="kurals-state"><div class="kurals-empty">
      <div class="kurals-empty-icon">\uD83D\uDD0D</div>
      <p>No stories match your search.</p>
    </div></div>`;
  }
  const head = COLUMNS.map((c) =>
    `<th class="${c.className || ""}">${esc(c.label)}</th>`
  ).join("");
  const body = rows.map((r) =>
    `<tr>${COLUMNS.map((c) => `<td class="${c.className || ""}">${c.render(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<div class="table-scroll"><table>
    <thead><tr>${head}</tr></thead>
    <tbody>${body}</tbody>
  </table></div>`;
}

function filterRows(query) {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_ROWS;
  const idMatch = q.match(/(?:tk-?)?0*(\d+)/);
  const idNum = idMatch ? parseInt(idMatch[1], 10) : null;
  return ALL_ROWS.filter((r) =>
    r._search.includes(q) || (idNum != null && r.Number === idNum)
  );
}

function setStats(count, total, query) {
  const el = document.getElementById("stats");
  if (!el) return;
  const span = el.querySelector("span");
  if (!span) return;
  span.textContent = query.trim()
    ? `${count} of ${total} stories`
    : `${total} stories loaded`;
}

function updateView(query = "") {
  const filtered = filterRows(query);
  const content = document.getElementById("content");
  content.innerHTML = renderTable(filtered);
  setStats(filtered.length, ALL_ROWS.length, query);
  content.querySelectorAll(".read-btn").forEach((btn) => {
    btn.addEventListener("click", () => openModal(parseInt(btn.dataset.id, 10)));
  });
}

/* ---- modal ---- */
function initials(name) {
  const clean = name.replace(/\(.*?\)/g, "").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function openModal(n) {
  const s = CS[n];
  if (!s) return;
  const modal = document.getElementById("story-modal");
  if (!modal) return;

  const chars = (s.chars || []).map((c) =>
    `<span class="story-avatar" title="${esc(c)}">${esc(initials(c))}</span>`
  ).join("");

  const tvParts = (s.tv || "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const acts = tvParts.map((part) => {
    // Extract a kural couplet wrapped in 「 ... 」 wherever it appears.
    const kuralMatch = part.match(/「([\s\S]+?)」/);
    if (kuralMatch) {
      const before = part.slice(0, kuralMatch.index).trim();
      const after = part.slice(kuralMatch.index + kuralMatch[0].length).trim();
      return `${before ? `<div class="act-card"><p class="act-text">${esc(before)}</p></div>` : ""}
        <div class="modal-kural">${esc(kuralMatch[1].trim())}</div>
        ${after ? `<div class="act-card"><p class="act-text">${esc(after)}</p></div>` : ""}`;
    }
    return `<div class="act-card">
      <p class="act-text">${esc(part)}</p>
    </div>`;
  }).join("");

  const dialogueLines = (s.dialogue || "").split(/\n/).filter(Boolean).map((line) =>
    `<p class="act-text" style="margin:.2rem 0">${esc(line)}</p>`
  ).join("");

  modal.innerHTML = `
    <div class="modal-backdrop" data-close></div>
    <div class="modal-box" role="dialog" aria-modal="true" aria-label="${esc(s.title)}">
      <div class="modal-header">
        <span class="story-id-badge">${esc(kuralId(n))}</span>
        <button type="button" class="modal-close" data-close aria-label="Close">${ICONS.close}</button>
      </div>
      <p class="modal-story-title">${esc(s.title)}</p>
      <p class="modal-translation">${esc(s.theme)} \u00b7 ${esc(s.emotion)}</p>
      <div class="modal-characters">
        ${chars}
        <span class="modal-place">${esc(s.location)}</span>
      </div>
      <div class="modal-acts">
        <div class="act-card">
          <span class="act-number">1</span>
          <h4 class="act-heading">The Hook</h4>
          <p class="act-text">${esc(s.hook)}</p>
        </div>
        <div class="act-card">
          <span class="act-number">2</span>
          <h4 class="act-heading">The Story</h4>
          <p class="act-text">${esc(s.story)}</p>
        </div>
        ${dialogueLines ? `<div class="act-card">
          <span class="act-number">3</span>
          <h4 class="act-heading">Tamil Dialogue</h4>
          ${dialogueLines}
        </div>` : ""}
        ${acts}
      </div>
      <div class="modal-moral">
        <span class="moral-label">\u0B95\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1 \u00b7 Moral</span>
        <p>${esc(s.moral)}</p>
      </div>
    </div>`;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  modal.querySelectorAll("[data-close]").forEach((el) =>
    el.addEventListener("click", closeModal)
  );
}

function closeModal() {
  const modal = document.getElementById("story-modal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.innerHTML = "";
  document.body.style.overflow = "";
}

/* ---- theme ---- */
function getTheme() {
  return localStorage.getItem(THEME_KEY) || "dark";
}
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.innerHTML = theme === "dark" ? ICONS.sun : ICONS.moon;
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
}
function initTheme() {
  applyTheme(getTheme());
  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    applyTheme(getTheme() === "dark" ? "light" : "dark");
  });
}

/* ---- sidebar ---- */
function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const openBtn = document.getElementById("sidebar-open");
  const closeBtn = document.getElementById("sidebar-close");
  function open()  { sidebar?.classList.add("open"); overlay?.classList.add("visible"); document.body.style.overflow = "hidden"; }
  function close() { sidebar?.classList.remove("open"); overlay?.classList.remove("visible"); document.body.style.overflow = ""; }
  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  overlay?.addEventListener("click", close);
  window.addEventListener("resize", () => { if (window.innerWidth > 768) close(); });
  document.querySelectorAll("[data-placeholder]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      showToast(`${link.textContent.trim()} \u2014 coming soon`);
    });
  });
}

/* ---- boot ---- */
function init() {
  initTheme();
  initSidebar();
  updateView();
  const search = document.getElementById("search");
  if (search) {
    search.disabled = false;
    search.placeholder = "Search by ID, kural number, theme, chapter, place\u2026";
    search.addEventListener("input", (e) => updateView(e.target.value));
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

document.addEventListener("DOMContentLoaded", init);
