import { ChildProfile, StoryStudioBook, StoryScene } from '../types';
import { illustrationService } from './illustrationService';

// Simulating network delay for that premium AI processing feel
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const HINDI_ANIMALS: Record<string, string> = {
  kitten: 'बिल्ली का बच्चा',
  cat: 'बिल्ली',
  dog: 'कुत्ता',
  puppy: 'पिल्ला',
  lion: 'शेर',
  tiger: 'बाघ',
  elephant: 'हाथी',
  monkey: 'बंदर',
  rabbit: 'खरगोश',
  bear: 'भालू',
  deer: 'हिरण',
  giraffe: 'जिराफ़',
  dinosaur: 'डायनासोर',
  bird: 'चिड़िया',
  squirrel: 'गिलहरी',
  fox: 'लोमड़ी',
  cow: 'गाय',
  horse: 'घोड़ा',
  sheep: 'भेड़',
  panda: 'पांडा',
  koala: 'कोआला',
  penguin: 'पेनगुइन',
  owl: 'उल्लू',
  frog: 'मेढक',
  turtle: 'कछुआ',
  fish: 'मछली',
  dolphin: 'डॉल्फिन',
  butterfly: 'तितली',
  dino: 'डायनासोर',
  cheetah: 'चीता',
  wolf: 'भेड़िया',
  zebra: 'जेब्रा',
  kangaroo: 'कंगारू',
  hippo: 'दरियाई घोड़ा',
  mouse: 'चुहिया'
};

const HINDI_COLORS: Record<string, string> = {
  yellow: 'पीला',
  blue: 'नीला',
  red: 'लाल',
  green: 'हरा',
  pink: 'गुलाबी',
  orange: 'नारंगी',
  purple: 'बैंगनी',
  white: 'सफेद',
  black: 'काला',
  brown: 'भूरा',
  grey: 'स्लेटी',
  gray: 'स्लेटी',
  golden: 'सुनहरा',
  silver: 'चांदी जैसा'
};

const HINDI_INTERESTS: Record<string, string> = {
  drawing: 'चित्रकारी',
  blocks: 'खिलौने',
  reading: 'किताबें पढ़ना',
  singing: 'गाना गाना',
  dancing: 'नाचना',
  puzzles: 'पहेलियां सुलषाना',
  space: 'अंतरिक्ष की बातें',
  dinosaurs: 'डायनासोर के बारे में जानना',
  sports: 'खेलकूद',
  music: 'संगीत',
  animals: 'जानवरों से प्यार करना',
  nature: 'प्रकृति की सैर',
  science: 'विज्ञान के प्रयोग',
  cooking: 'खाना बनाना',
  gardening: 'बागवानी करना',
  painting: 'रंग भरना'
};

function translateToHindi(word: string, type: 'animal' | 'color' | 'interest'): string {
  const cleanWord = word.trim().toLowerCase();
  
  if (type === 'animal') {
    if (HINDI_ANIMALS[cleanWord]) return HINDI_ANIMALS[cleanWord];
    for (const [key, value] of Object.entries(HINDI_ANIMALS)) {
      if (cleanWord.includes(key) || key.includes(cleanWord)) {
        return value;
      }
    }
    return 'नन्हा मित्र';
  }
  
  if (type === 'color') {
    if (HINDI_COLORS[cleanWord]) return HINDI_COLORS[cleanWord];
    for (const [key, value] of Object.entries(HINDI_COLORS)) {
      if (cleanWord.includes(key) || key.includes(cleanWord)) {
        return value;
      }
    }
    return 'प्यारा';
  }
  
  if (type === 'interest') {
    if (HINDI_INTERESTS[cleanWord]) return HINDI_INTERESTS[cleanWord];
    for (const [key, value] of Object.entries(HINDI_INTERESTS)) {
      if (cleanWord.includes(key) || key.includes(cleanWord)) {
        return value;
      }
    }
    return 'नई चीजें सीखना';
  }
  
  return word;
}

export const storyService = {
  /**
   * Generates a fully personalized multi-page storybook
   */
  async generateStoryBook(
    profile: ChildProfile | null,
    theme: string,
    mood: string,
    length: '2 min' | '5 min' | '10 min',
    language: string,
    narrator: string
  ): Promise<StoryStudioBook> {
    await delay(2200); // 2.2 seconds loader to simulate the generative process

    const childName = profile?.name || 'Pranooja';
    const animal = profile?.favoriteAnimals?.[0] || 'Kitten';
    const favoriteColor = profile?.favoriteColors?.[0] || 'Yellow';
    const interests = profile?.interests || ['Drawing', 'Blocks'];

    // Map theme/mood/lang combo to rich templates
    const storyData = this.getStoryTemplate(theme, mood, language, childName, animal, favoriteColor, interests);
    
    // Determine the number of pages based on length
    let pageCount = 5;
    if (length === '2 min') pageCount = 4;
    else if (length === '10 min') pageCount = 6;

    // Prune or pad the scenes to match requested page count
    const baseParagraphs = [...storyData.paragraphs];
    while (baseParagraphs.length < pageCount) {
      baseParagraphs.push(
        language === 'Hindi' 
          ? `तारे धीरे-धीरे चमक रहे थे, और ${childName} को पता था कि यह सोने का समय था।`
          : language === 'Telugu'
          ? `నక్షత్రాలు మెల్లగా మెరుస్తున్నాయి, మరియు ${childName} కి నిద్రపోయే సమయం వచ్చిందని తెలుసు.`
          : `The stars twinkled down softly, reminding ${childName} that it was time to drift into sweet dreams.`
      );
    }
    const finalParagraphs = baseParagraphs.slice(0, pageCount);

    // Build the scenes array
    const scenes: StoryScene[] = finalParagraphs.map((para, index) => {
      const pageNum = index + 1;
      return {
        id: `scene_${Math.random().toString(36).substr(2, 9)}`,
        pageNumber: pageNum,
        paragraph: para,
        illustrationSvg: illustrationService.getSceneIllustration(theme, pageNum, childName, animal)
      };
    });

    const coverSvg = illustrationService.getSceneIllustration(theme, 1, childName, animal);

    return {
      id: `studio_story_${Math.random().toString(36).substr(2, 9)}`,
      title: storyData.title,
      theme,
      mood,
      length,
      language,
      narrator,
      moral: storyData.moral,
      quote: storyData.quote,
      readingTime: length,
      scenes,
      discussionQuestions: storyData.discussionQuestions,
      offlineActivities: storyData.offlineActivities,
      coverSvg,
      isFavorited: false,
      createdAt: new Date().toISOString()
    };
  },

  /**
   * Story Database Templates
   */
  getStoryTemplate(
    theme: string,
    mood: string,
    language: string,
    name: string,
    animal: string,
    color: string,
    interests: string[]
  ) {
    const isHindi = language === 'Hindi';
    const isTelugu = language === 'Telugu';
    
    const interest = interests[0] || 'learning new things';

    // Themes mapping
    let title = '';
    let paragraphs: string[] = [];
    let moral = '';
    let quote = '';
    let discussionQuestions: string[] = [];
    let offlineActivities: string[] = [];

    const themeKey = theme.toLowerCase();

    if (isHindi) {
      const translatedAnimal = translateToHindi(animal, 'animal');
      const translatedColor = translateToHindi(color, 'color');
      const translatedInterest = translateToHindi(interest, 'interest');

      if (themeKey.includes('space')) {
        title = `अंतरिक्ष की सैर: ${name} और ब्रह्मांडीय ${translatedAnimal}`;
        paragraphs = [
          `रात के शांत समय में, जब आसमान में छोटे-छोटे तारे टिमटिमा रहे थे, ${name} ने खिड़की से बाहर देखा। उसे एक जादुई चमकदार रास्ता दिखाई दिया जो सीधे बादलों की तरफ जा रहा था।`,
          `वहाँ एक बहुत ही प्यारा ${translatedAnimal} खड़ा था जिसके शरीर पर सुनहरे तारे चमक रहे थे। "नमस्ते, ${name}!" ${translatedAnimal} ने प्यार से कहा। "क्या तुम मेरे साथ आसमान की सैर पर चलोगे?"`,
          `${name} ने हाँ में सिर हिलाया। वे दोनों एक बेहद नर्म और ${translatedColor} रंग के बादल पर बैठ गए। वह बादल धीरे-धीरे उड़कर आसमान की गहराइयों में जाने लगा।`,
          `रास्ते में उन्होंने एक खोया हुआ छोटा तारा पाया, जो थका हुआ था और सो रहा था। ${name} ने उसे धीरे से उठाया और उसके असली स्थान पर रख दिया। पूरा ब्रह्मांड जगमगा उठा!`,
          `यह देखकर ${translatedAnimal} बहुत खुश हुआ। उसने ${name} को धन्यवाद कहा और वह प्यारा बादल उसे वापस उसके प्यारे बिस्तर पर छोड़ गया।`,
          `${name} ने सोने के लिए अपनी आँखें बंद कर लीं। तारों ने अपनी मखमली रोशनी से उसे ढक लिया, और वह सुंदर सपनों की दुनिया में खो गई।`
        ];
        moral = `एक छोटा सा दयालु काम पूरे ब्रह्मांड को रोशन कर सकता है।`;
        quote = `"जब भी आप रात के आसमान को देखें, याद रखें कि आप भी एक चमकता तारा हैं।"`;
      } 
      else if (themeKey.includes('magic') || themeKey.includes('forest')) {
        title = `जादुई जंगल: ${name} और समझदार ${translatedAnimal}`;
        paragraphs = [
          `हरे-भरे जंगलों में, जहाँ पेड़ों की पत्तियाँ हवा में झूमती थीं और आपस में फुसफुसाती थीं, ${name} अपने प्रिय मित्र ${translatedAnimal} के साथ सैर पर निकली।`,
          `हवा में फूलों की मीठी महक थी। चलते-चलते उन्हें रास्ते में एक बहुत पुराना और समझदार पेड़ मिला। पेड़ की शाखाएं बहुत बड़ी और छायादार थीं।`,
          `उस समझदार पेड़ ने मुस्कुराते हुए उनसे कहा, "जो भी आज रात दूसरों की मदद करेगा, उसे सबसे प्यारे और मीठे सपने मिलेंगे।"`,
          `${name} और ${translatedAnimal} ने तुरंत एक छोटी चिड़िया के बच्चे की मदद की जो उड़ने की कोशिश में अपने घोंसले से नीचे गिर गया था। उन्होंने उसे धीरे से घोंसले में वापस रख दिया।`,
          `उनकी दयालुता से खुश होकर पेड़ ने जादुई जुगनुओं को बुलाया, जिन्होंने पूरे जंगल के रास्ते को ${translatedColor} रोशनी से चमका दिया। पूरा जंगल खिल उठा!`,
          `घर लौटकर, ${name} ने अपने नर्म बिस्तर पर सिर रखा। उसे पता था कि उसने एक अच्छा काम किया है, और वह शांति से गहरी नींद में सो गई।`
        ];
        moral = `दूसरों की मदद करने से हमारे दिल को सबसे ज्यादा खुशी और शांति मिलती है।`;
        quote = `"एक मददगार हाथ दुनिया का सबसे मजबूत और प्यारा सहारा होता है।"`;
      }
      else if (themeKey.includes('friendship') || themeKey.includes('share')) {
        title = `सच्चे मित्र: ${name} और दयालु ${translatedAnimal}`;
        paragraphs = [
          `एक सुंदर बगीचे में, जहाँ चारों तरफ रंग-बिरंगे फूल खिले थे, ${name} अपने खिलौनों के साथ खेल रही थी। उसे ${translatedInterest} बहुत पसंद था।`,
          `तभी वहाँ एक नन्हा और भूखा ${translatedAnimal} आया। उसके पास खेलने के लिए कोई खिलौना नहीं था और वह बहुत उदास लग रहा था।`,
          `${name} ने मुस्कुराकर अपना सबसे पसंदीदा ${translatedColor} खिलौना उस ${translatedAnimal} की तरफ बढ़ा दिया और अपनी मीठी रोटी का आधा हिस्सा भी उसे दे दिया।`,
          `${translatedAnimal} का चेहरा खुशी से चमक उठा। उसने ${name} के साथ मिलकर बहुत सारे खेल खेले और दोनों पक्के दोस्त बन गए।`,
          `शाम ढलने लगी और ठंडी हवा चलने लगी। ${translatedAnimal} ने प्यार से ${name} को एक जादुई चमकता हुआ फूल उपहार में दिया, जो रात को महकाता था।`,
          `अपने घर वापस आकर, ${name} अपनी माँ की गोदी में सो गई। वह बहुत खुश थी क्योंकि उसने आज एक नया और सच्चा मित्र बनाया था।`
        ];
        moral = `चीजें साझा करने और बांटने से दोस्ती और प्यार हमेशा बढ़ता है।`;
        quote = `"सच्ची मित्रता दुनिया का सबसे अनमोल और सुंदर उपहार है।"`;
      }
      else if (themeKey.includes('animal') || themeKey.includes('safari')) {
        title = `जंगल सफ़ारी: ${name} और साहसी ${translatedAnimal}`;
        paragraphs = [
          `एक बार की बात है, ${name} एक जादुई जंगल की सफ़ारी पर गई थी। वहाँ के ऊंचे-ऊंचे घास के मैदान बहुत सुंदर लग रहे थे।`,
          `वहाँ उसकी मुलाक़ात एक बहुत ही प्यारे और चंचल ${translatedAnimal} से हुई। उस ${translatedAnimal} के पास एक सुंदर ${translatedColor} रंग का पट्टा था।`,
          `उन्होंने साथ मिलकर जंगल की सैर शुरू की। रास्ते में उन्हें एक छोटा हाथी मिला जो नदी पार करने में डर रहा था।`,
          `${name} ने उसे मीठे शब्द कहे और ${translatedAnimal} ने उसे सुरक्षित रास्ता दिखाया। छोटा हाथी खुश होकर अपनी सूंड हिलाने लगा।`,
          `सूरज धीरे-धीरे पहाड़ों के पीछे छिप रहा था और पूरा जंगल शांत होने लगा था। सभी जानवर सोने की तैयारी कर रहे थे।`,
          `${translatedAnimal} ने ${name} को विदा किया। ${name} अपने तंबू में आई और कंबल ओढ़कर सो गई, वह सपनों में फिर से सफ़ारी की सैर कर रही थी।`
        ];
        moral = `साहस और दयालुता के साथ हम हर मुश्किल रास्ते को आसान बना सकते हैं।`;
        quote = `"हर छोटा जानवर हमारे प्यार और देखभाल का हकदार होता है।"`;
      }
      else if (themeKey.includes('ocean') || themeKey.includes('sea')) {
        title = `नीला महासागर: ${name} की समुद्री खोज`;
        paragraphs = [
          `समुद्र की ठंडी और नीली लहरें जब आपस में बातें कर रही थीं, ${name} ने किनारे पर एक बहुत ही सुंदर और चमकता हुआ शंख पाया।`,
          `तभी पानी में से एक प्यारी सी समुद्री कछुआ और उसका मित्र ${translatedAnimal} बाहर आए। "हमारे जादुई तैरते महल में आपका स्वागत है!" ${translatedAnimal} ने कहा।`,
          `${name} ने पानी में डुबकी लगाई। जादुई शक्ति के कारण वह पानी के नीचे भी आसानी से सांस ले सकती थी और तैर सकती थी।`,
          `उन्होंने समुद्र के नीचे रंग-बिरंगे कोरल रीफ और सुंदर छोटी मछलियां देखीं जो ${translatedColor} रंग में चमक रही थीं। सब मिलकर गा रहे थे।`,
          `समुद्री कछुए ने खुश होकर ${name} को एक चमकीला मोती उपहार में दिया, जो अंधेरे में भी रास्ता दिखाता था।`,
          `अब घर लौटने का समय था। ${translatedAnimal} ने ${name} को सुरक्षित किनारे पर पहुँचाया। वह अपने नर्म बिस्तर में आ गई, और मीठे सपनों में खो गई।`
        ];
        moral = `प्रकृति के रहस्य बहुत सुंदर हैं और हमें हमेशा उनकी रक्षा करनी चाहिए।`;
        quote = `"शांति और संतोष हमारे दिल की गहराइयों में बसे सुंदर मोती की तरह हैं।"`;
      }
      else if (themeKey.includes('princess') || themeKey.includes('castle') || themeKey.includes('cloud')) {
        title = `बादलों का महल: राजकुमारी ${name} और जादुई ${translatedAnimal}`;
        paragraphs = [
          `एक सुंदर राज्य में ${name} नाम की एक प्यारी राजकुमारी रहती थी। उसे जादुई कहानियां सुनना और ${translatedInterest} बहुत पसंद था।`,
          `एक शाम, उसकी खिड़की से एक प्यारी सी परी अंदर आई। उसके साथ उसका पालतू ${translatedAnimal} भी था, जिसने एक नन्हीं जादुई टोपी पहनी हुई थी।`,
          `परी ने कहा, "राजकुमारी ${name}, हमारे बादलों वाले महल में आज रात एक उत्सव है, और हम चाहते हैं कि आप हमारी मुख्य अतिथि बनें!"`,
          `वे एक उड़ने वाले जादुई रथ पर बैठकर बादलों के पार पहुँचे। वह महल पूरा का पूरा सुंदर ${translatedColor} बादलों से बना हुआ था।`,
          `महल में बहुत ही सुरीला और धीमा संगीत बज रहा था। सबने राजकुमारी ${name} का फूलों से स्वागत किया और स्वादिष्ट फल खिलाए।`,
          `उत्सव के बाद, ${translatedAnimal} ने ${name} को एक बहुत ही मुलायम तकिया दिया। जादुई रथ उसे वापस उसके घर ले आया, जहाँ वह गहरी नींद सो गई।`
        ];
        moral = `विनम्रता और मिठास ही एक सच्चे राजा या राजकुमारी की असली पहचान होती है।`;
        quote = `"सपनों के महल हमेशा हमारे विचारों की सुंदरता से ही बनते हैं।"`;
      }
      else if (themeKey.includes('dinosaur') || themeKey.includes('dino')) {
        title = `डायनासोर घाटी: ${name} और नन्हा ${translatedAnimal}`;
        paragraphs = [
          `बहुत समय पहले, एक हरी-भरी घाटी में प्यारे डायनासोर रहते थे। ${name} और उसका प्रिय ${translatedAnimal} वहाँ की सैर कर रहे थे।`,
          `वहाँ उन्हें एक छोटा और रोता हुआ बेबी डायनासोर मिला। उसने एक सुंदर ${translatedColor} रंग की टोपी पहनी हुई थी।`,
          `उसने बताया कि वह अपनी सोने की रात की टोपी भूल गया है और उसे अंधेरे से थोड़ा डर लग रहा है।`,
          `${name} ने उसे प्यार से गले लगाया और ${translatedAnimal} ने ऊंचे पेड़ की डाल से उसकी मुलायम रात की टोपी उतारकर उसे दी।`,
          `टोपी पहनकर बेबी डायनासोर बहुत खुश हुआ। वह अपनी पूंछ हिलाकर धीरे-धीरे सोने के लिए लेट गया और मधुर आवाज़ निकालने लगा।`,
          `घाटी में अब शांत बारिश की बूंदें गिरने लगी थीं। ${name} और ${translatedAnimal} भी अपने तंबू में आ गए और कंबल तानकर सो गए।`
        ];
        moral = `दूसरों के डर को दूर करना और उन्हें सुरक्षित महसूस कराना सबसे बड़ा पुण्य है।`;
        quote = `"एक छोटा सा दोस्ताना व्यवहार बड़े से बड़े डर को भी पल भर में भगा देता है।"`;
      }
      else if (themeKey.includes('superhero') || themeKey.includes('cape')) {
        title = `शहर के रक्षक: सुपरहीरो ${name} और रक्षक ${translatedAnimal}`;
        paragraphs = [
          `चमकते हुए शहर की ऊँची इमारतों के ऊपर, सुपरहीरो ${name} खड़ी थी। उसके पास रात को देखने का जादुई चश्मा था।`,
          `उसके साथ उसका बहादुर साथी ${translatedAnimal} भी खड़ा था, जिसने एक सुंदर ${translatedColor} रंग का जादुई चोग़ा पहना हुआ था।`,
          `आज रात शहर में बहुत शोर था। गाड़ियों के हॉर्न बज रहे थे और चमकीली बत्तियाँ बच्चों को सोने नहीं दे रही थीं।`,
          `सुपरहीरो ${name} ने हवा में हाथ उठाया और एक शांत करने वाली जादुई लोरी का छिड़काव किया। बत्तियाँ धीमी और रात की रोशनी जैसी हो गईं।`,
          `${translatedAnimal} ने शहर के ऊपर से उड़ते हुए सभी को मीठी नींद का संदेश दिया। धीरे-धीरे पूरा शहर एकदम शांत और सुंदर हो गया।`,
          `अपना काम पूरा करके, ${name} ने अपना मुखौटा उतारा और अपने बिस्तर पर लेट गई। वह शांति से सो गई, यह जानते हुए कि शहर सुरक्षित है।`
        ];
        moral = `सच्ची ताकत दूसरों को शांति, सुरक्षा और आराम पहुंचाने में ही होती है।`;
        quote = `"एक रक्षक का सबसे बड़ा काम दूसरों को सुरक्षित महसूस कराना और मीठी नींद सुलाना है।"`;
      }
      else {
        title = `अनोखा जंगल: ${name} और समझदार ${translatedAnimal}`;
        paragraphs = [
          `हरे-भरे जंगलों में, जहाँ पेड़ों की पत्तियाँ हवा में झूमती थीं, ${name} अपने प्रिय मित्र ${translatedAnimal} के साथ सैर कर रही थी।`,
          `उन्हें रास्ते में एक बहुत पुराना और समझदार पेड़ मिला। पेड़ ने उनसे कहा, "जो भी आज रात एक अच्छा काम करेगा, उसे मीठे सपने मिलेंगे।"`,
          `${name} और ${translatedAnimal} ने तुरंत एक छोटी चिड़िया के बच्चे की मदद की जो अपने घोंसले से गिर गया था। उन्होंने उसे धीरे से घोंसले में रखा।`,
          `पेड़ खुश हुआ और उसने जादुई जुगनुओं को बुलाकर जंगल का रास्ता रोशन कर दिया। जंगल बहुत सुंदर लग रहा था।`,
          `घर लौटकर, ${name} ने अपने नर्म बिस्तर पर सिर रखा। उसे पता था कि उसने एक अच्छा काम किया है, और वह शांति से सो गई।`,
          `सारे जानवर और पेड़-पौधे भी सो गए थे, और चारों ओर केवल मधुर और शांत हवा बह रही थी।`
        ];
        moral = `दूसरों की मदद करने से हमारा मन और तन दोनों शांत और सुखी रहते हैं।`;
        quote = `"परोपकार ही सबसे उत्तम और सच्चा आनंद है।"`;
      }

      discussionQuestions = [
        `आपको कहानी का कौन सा हिस्सा सबसे अच्छा लगा?`,
        `क्या आपके पास भी ${translatedAnimal} जैसा कोई प्यारा मित्र है?`,
        `अगर आप बादलों के महल की सैर पर जा सकते, तो आप अपने साथ किसे ले जाते?`
      ];
      offlineActivities = [
        `आज रात के अपने पसंदीदा दृश्य का एक सुंदर चित्र बनाएं।`,
        `${translatedAnimal} की तरह गहरी सांस लेते हुए सोने का अभिनय करें।`,
        `अपने कमरे में तीन ${translatedColor} रंग की वस्तुएं ढूंढें और उन्हें अपनी जगह पर रखें।`
      ];
    } 
    else if (isTelugu) {
      // TELUGU TEMPLATES
      moral = 'నిజమైన స్నేహం మరియు దయగల మనసు ప్రపంచాన్ని ప్రకాశింపజేస్తాయి.';
      quote = `"పడుకునే సమయం వచ్చింది, నక్షత్రాలు మనకు తోడుగా ఉన్నాయి."`;
      discussionQuestions = [
        `కథలో మీకు బాగా నచ్చిన భాగం ఏది?`,
        `మీకు కూడా ${animal} లాంటి మంచి స్నేహితులు ఉన్నారా?`,
        `మనం మేఘాల మీద ప్రయాణం చేస్తే ఎలా ఉంటుంది?`
      ];
      offlineActivities = [
        `ఈ రోజు కథలో మీకు నచ్చిన బొమ్మను గీయండి.`,
        `${animal} లాగా పడుకునే ప్రయత్నం చేయండి.`,
        `మీ గదిలో మూడు పసుపు రంగు వస్తువులను వెతకండి.`
      ];

      if (themeKey.includes('space')) {
        title = `అంతరిక్ష ప్రయాణం: ${name} మరియు కాస్మిక్ ${animal}`;
        paragraphs = [
          `ఒక అందమైన రాత్రి వేళ, ఆకాశంలో నక్షత్రాలు మెరుస్తుండగా, ${name} కిటికీలోంచి బయటకి చూసింది. అక్కడ ఒక మెరిసే దారి కనిపించింది.`,
          `అక్కడ బంగారు రంగులో మెరుస్తూ ఒక అందమైన ${animal} నిలబడి ఉంది. "హలో ${name}!" అంది ఆ ${animal} ప్రేమగా. "నాతో ఆకాశంలోకి వస్తావా?"`,
          `${name} సంతోషంగా ఒప్పుకుంది. ఇద్దరూ కలిసి ఒక మెత్తని మేఘం మీద కూర్చున్నారు. మేఘం మెల్లగా చంద్రుని వైపు సాగింది.`,
          `అక్కడ దారి తప్పిన ఒక చిన్న నక్షత్రాన్ని చూశారు. ${name} దాన్ని మెల్లగా తీసి దాని సరైన స్థానంలో పెట్టింది. ఆకాశం అంతా వెలిగిపోయింది!`,
          `${animal} సంతోషించి ${name} ని కౌగిలించుకుంది. మేఘం ${name} ని మళ్ళీ ఇంట్లో దించింది. ${name} హాయిగా నిద్రపోయింది.`
        ];
      }
      else if (themeKey.includes('ocean')) {
        title = `నీలి మహాసముద్రం: ${name} సాహస యాత్ర`;
        paragraphs = [
          `సముద్రపు అలలు చల్లగా వీస్తుండగా, ${name} కి ఒక మెరిసే శంఖం దొరికింది. దాని నుండి మధురమైన సంగీతం వినిపిస్తోంది.`,
          `అప్పుడు నీటిలోంచి ఒక తాబేలు మరియు దాని స్నేహితుడు ${animal} వచ్చారు. "మా సముద్ర లోకానికి స్వాగతం!" అంది ${animal}.`,
          `${name} కి నీటిలో ఈదడం చాలా నచ్చింది. అక్కడ రంగురంగుల పగడపు తోటలు, అందమైన చేపలను చూసింది.`,
          `చేపలన్నీ పాటలు పాడుతుంటే ${name} వాటితో కలిసి నాట్యం చేసింది. తాబేలు ${name} కి ఒక అందమైన ముత్యాన్ని బహుమతిగా ఇచ్చింది.`,
          `ఇక ఇంటికి వెళ్ళే సమయం కావడంతో ${animal} ${name} ని ఒడ్డున దించింది. ${name} తన మెత్తని పరుపుపై హాయిగా నిద్రపోయింది.`
        ];
      }
      else {
        // Default Forest/Animals for Telugu
        title = `మాయా అడవి: ${name} మరియు తెలివైన ${animal}`;
        paragraphs = [
          `ఒక దట్టమైన అడవిలో, చెట్లన్నీ జోలపాటలు పాడుతుండగా, ${name} తన స్నేహితుడు ${animal} తో కలిసి నడుస్తోంది.`,
          `దారిలో ఒక పెద్ద ముసలి చెట్టు కనిపించింది. "ఈ రోజు ఎవరైతే ఒక మంచి పని చేస్తారో, వారికి అందమైన కలలు వస్తాయి" అంది ఆ చెట్టు.`,
          `అప్పుడు ${name} మరియు ${animal} గూటి నుండి కిందపడిన ఒక చిన్న పక్షి పిల్లని మెల్లగా తీసి మళ్ళీ గూటిలో పెట్టాయి.`,
          `చెట్టు సంతోషించి, మాయా మిణుగురు పురుగులను పంపి అడవిని వెలిగించింది. ఆ వెలుగులో అడవి చాలా అందంగా కనిపించింది.`,
          `ఇంటికి వచ్చిన ${name} పరుపుపై తల వాల్చింది. తాను మంచి పని చేశానని సంతోషిస్తూ హాయిగా కళ్ళు మూసుకుంది.`
        ];
      }
    } 
    else {
      // ENGLISH TEMPLATES (Rich variations depending on theme and mood)
      discussionQuestions = [
        `What was your absolute favorite part of ${name}'s adventure?`,
        `Why do you think being kind and helping ${animal} was so important?`,
        `If you had a soft cloud like ${name}, where would you drift off to tonight?`
      ];
      offlineActivities = [
        `Draw today's character, the brave little ${name} and the ${animal}.`,
        `Act like the sleepy ${animal} finding the softest spot in the room.`,
        `Find three ${color.toLowerCase() || 'pink'} objects around your bed.`,
      ];

      // Custom thematic paragraphs
      if (themeKey.includes('space')) {
        title = `The Starry Search: ${name} and the Cosmic ${animal}`;
        paragraphs = [
          `Once upon a twilight, as the stars began to blink like tiny nightlights in the sky, a clever child named ${name} noticed something unusual shining from the window. It was a soft, glowing trail of stardust that led right down into the garden.`,
          `With a quiet rustle, out stepped an adorable, stardust-dusted ${animal}! This wasn't any ordinary forest creature; this was a Cosmic ${animal} with eyes as bright as distant moons. "Hello, ${name}," the ${animal} whispered. "I have lost my favorite glowing star, and I need a kind friend to help me find it."`,
          `Without hesitation, ${name} nodded. Together, they hopped onto a soft, floating ${color.toLowerCase() || 'yellow'} cloud that drifted down to greet them. The cloud lifted them high above the treetops, sailing gently past sleepy birds and through the silver beams of the moon.`,
          `They searched behind a giant blue planet, they peeked under the golden rings of Saturn, and finally, tucked snugly inside a sleepy crescent moon, they found the missing star! It was humming a quiet, sleepy tune. ${name} gently picked it up and placed it back in the sky.`,
          `The Cosmic ${animal} smiled warmly and hugged ${name}. "Thank you for your warm heart," the ${animal} said, as the floating cloud brought ${name} safely back to bed. ${name} closed their eyes, feeling cozy and safe, knowing the stars were watching over them.`
        ];
        moral = 'A small act of kindness can make the entire universe shine a little brighter.';
        quote = `"Whenever you look up at the night sky, remember that you are a protector of stars."`;
      } 
      else if (themeKey.includes('ocean')) {
        title = `The Deep Sea Lullaby: ${name}'s Reef Discovery`;
        paragraphs = [
          `Deep down where the ocean water was clear and blue, a gentle sea turtle swam past a beautiful coral reef. ${name}, wearing a magical underwater helmet, was floating alongside, holding hands with a playful ${animal}.`,
          `The ocean was silent except for a soft, rhythmic humming sound. "It is the Ocean Lullaby," whispered the ${animal}. "But the musical shell that sings the song is tucked deep inside the dark cave, and the sea creatures are too nervous to go inside."`,
          `${name} smiled and held up a small glowing lantern of their favorite ${color.toLowerCase() || 'yellow'} color. "I can help light the way!" she said. Step by step, they walked into the cave, their soft light scattering the shadows.`,
          `Inside, sitting on a bed of soft golden sand, was the musical shell. It was just a little lonely! ${name} gently polished it, and instantly, a wave of sweet, relaxing notes flowed out, filling the entire ocean with peace.`,
          `The sea turtle swam them back to the sandy shore. The friendly ${animal} waved goodbye. ${name} snuggled deep under the warm duvet, the gentle rhythm of the ocean waves guiding them into a deep, peaceful sleep.`
        ];
        moral = 'Bringing light and warmth to lonely places makes the whole world feel like home.';
        quote = `"Peace is a light we carry in our hearts to share with the world."`;
      }
      else if (themeKey.includes('princess') || themeKey.includes('magic')) {
        title = `The Sleepy Tiara: ${name} and the Magic Castle`;
        paragraphs = [
          `In a kingdom made of soft cotton-candy clouds, lived a kind girl named ${name} who loved ${interest}. One evening, a tiny glowing fairy landed on her windowsill, accompanied by a fluffy ${animal} wearing a small velvet cape.`,
          `"We need your help, ${name}!" squeaked the fairy. "The Magic Castle is hosting the annual Slumber Feast, but the Prince's Sleepy Tiara has lost its magical glow, and no one can fall asleep without it!"`,
          `${name} put on her softest slippers and rode with them on a flying carriage drawn by three friendly stardust horses. The castle was beautiful, decorated in shades of ${color.toLowerCase() || 'pink'} and gold.`,
          `They found the tiara on a velvet pillow. ${name} realized it just needed some cozy comfort. She wrapped the tiara in her favorite warm scarf and sang a soft lullaby she learned at school. Slowly, the tiara began to pulse with a warm, comforting light.`,
          `A wave of sleepiness washed over the castle. The ${animal} yawned, curling up at ${name}'s feet. The fairy guided ${name} back to her room, where she fell asleep instantly, crowned in sweet dreams.`
        ];
        moral = 'Gentle patience and cozy comfort can solve the biggest problems.';
        quote = `"The best magic in the world is the warmth of a loving song."`;
      }
      else if (themeKey.includes('dinosaur')) {
        title = `The Tiny Dino's Nightcap: ${name}'s Jungle Snooze`;
        paragraphs = [
          `Long, long ago in a tropical valley filled with giant ferns, lived a baby triceratops with a shiny ${color.toLowerCase() || 'green'} collar. ${name} and her trusted companion, a friendly ${animal}, were exploring the jungle paths.`,
          `As evening arrived, they met the baby dinosaur, who was crying soft, rumbling tears. "I lost my fluffy nightcap in the high branches," sniffled the dino, "and I cannot sleep without it!"`,
          `${name} looked at the tall tree. She used her building blocks to construct a safe, sturdy ladder, while the clever ${animal} climbed up nimble as a breeze to retrieve the soft nightcap.`,
          `They placed the cap snug on the baby dino's head. He let out a happy, vibrating purr that shook the leaves gently. He curled up next to a giant sleeping brontosaurus, feeling cozy and warm.`,
          `The jungle grew quiet as a soft rain began to patter on the giant leaves. ${name} walked back to her sleeping tent, pulling up her blanket, ready to dream of prehistoric adventures.`
        ];
        moral = 'Helping a friend, big or small, makes the heart feel cozy and warm.';
        quote = `"A helping hand is the sturdiest ladder in the world."`;
      }
      else if (themeKey.includes('superhero')) {
        title = `The Cape of Kindness: ${name} and the Sleepy City`;
        paragraphs = [
          `High above the glowing lights of Sparkle City, a young superhero named ${name} stood watch. Beside her was her trusty sidekick, a brave ${animal} wearing a tiny matching mask.`,
          `Tonight, the city was restless. Loud car honks and bright neon signs were keeping the citizens awake. ${name} knew it was time for a secret kindness mission.`,
          `She flew gently from roof to roof, spreading a soft blanket of glowing stardust that dimmed the bright lights into warm, eye-safe nightlights. The ${animal} whispered gentle shushing sounds into the wind.`,
          `Soon, the busy city grew quiet. The car honks turned into soft humming, and the busy streets slept under a starry duvet. ${name} had saved bedtime for everyone.`,
          `Flying back home, ${name} hung up her cape and crawled into her cozy bed. She closed her eyes, knowing she had brought peace to the city, and was ready for her own sweet dreams.`
        ];
        moral = 'True heroes bring peace, quiet, and comfort to those around them.';
        quote = `"A hero's greatest power is the ability to make others feel safe and sound."`;
      }
      else {
        // Default Forest/Adventure/Animals for English
        title = `The Whispering Woods: ${name} & the Ancient ${animal}`;
        paragraphs = [
          `Deep inside the Whispering Woods, where the giant old oak trees hummed ancient lullabies, lived a magical ${animal}. This ${animal} had a special gift—it could make beautiful flowers bloom just by telling a happy joke.`,
          `One bright afternoon, ${name} was walking along the mossy path when they heard a soft sigh. Behind a giant wild fern, the ${animal} was sitting with floppy ears, looking quite puzzled. "What is wrong, friend?" ${name} asked, sitting down gently.`,
          `"I have forgotten my happiest joke, and now the flowers are too sleepy to bloom," said the ${animal}. ${name} thought for a moment and then told a silly joke about a butterfly wearing yellow rainboots.`,
          `The ${animal} giggled, then laughed, and finally let out a giant, joyful chuckle! Instantly, all the surrounding forest wild roses and bluebells popped open, filling the air with a sweet scent of honeysuckle and wild strawberries.`,
          `The woods were filled with color and light. The ${animal} thanked ${name} and gifted them a small leaf whistle that would always remind them of the forest. Hand in hand, they walked back to the edge of the woods, ready for a cozy night of sweet dreams.`
        ];
        moral = 'Laughter is a magical key that can bring warmth, color, and life to any gloomy day.';
        quote = `"Laughter and joy are the softest blankets for a peaceful night."`;
      }
    }

    // Modulate story pacing slightly based on mood
    if (mood.toLowerCase() === 'calm') {
      paragraphs = paragraphs.map(p => p + (isHindi ? ' सब कुछ शांत और सुरक्षित था।' : isTelugu ? ' అంతా ప్రశాంతంగా మరియు సురక్షితంగా ఉంది.' : ' Everything was quiet, slow, and perfectly safe.'));
    } else if (mood.toLowerCase() === 'educational') {
      paragraphs = paragraphs.map((p, idx) => p + (isHindi ? ` (सीखने की सीख ${idx + 1})` : isTelugu ? ` (నేర్చుకునే విషయం ${idx + 1})` : ` (Discovery note ${idx + 1})`));
    }

    return {
      title,
      paragraphs,
      moral,
      quote,
      discussionQuestions,
      offlineActivities
    };
  }
};
