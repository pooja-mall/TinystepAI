import { 
  ActivityItem, 
  MealPlan, 
  BedtimeStory, 
  CoachMessage, 
  LearningGoalItem, 
  WeeklyPlannerData,
  ChildProfile
} from '../types';
import { getStoryIllustration } from '../utils/illustration';

// Helper to simulate API network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 1. AI DAILY ACTIVITY GENERATOR
 */
export async function createActivity(
  age: number,
  interests: string[],
  availableTime: number, // in minutes
  indoorOutdoor: 'indoor' | 'outdoor' | 'both',
  difficulty: 'easy' | 'medium' | 'creative'
): Promise<ActivityItem> {
  await delay(1500); // Trigger loader skeleton

  const interestTag = interests.length > 0 ? interests[0] : 'Exploration';
  
  // Custom templates based on age and interests
  let title = `Sensory Play: The ${interestTag} Safari`;
  let materials: string[] = ['Safe child-friendly clay or playdough', 'Colored paper', 'Safety scissors', 'Child safe markers'];
  let instructions: string[] = [
    `Set up a designated "creation station" with the materials, laying down old newspapers first.`,
    `Guide your child to choose their favorite color of playdough or clay.`,
    `Work together to sculpt simple objects or animals related to "${interestTag}". For younger kids, help roll balls; for older kids, challenge them to build structures.`,
    `Use the safety scissors to cut out simple grass shapes or stars from the colored paper to build a mini-world.`,
    `Encourage your child to describe their creation. Ask open-ended questions like, "What does your ${interestTag} animal love to do?"`
  ];
  let outcome = 'Enhances fine motor skills, hand-eye coordination, spatial reasoning, and creative vocabulary expression.';
  let safety = 'Adult supervision is required while using scissors. Ensure playdough is non-toxic and not ingested.';
  let estTime = `${availableTime || 30} Minutes`;

  // Tailoring content based on age and interests
  if (age <= 2) {
    title = `Baby Touch & Feel: ${interestTag} Textures`;
    materials = ['Clean plastic container', 'Large dry pasta shapes or oats', 'Large smooth colorful plastic toys', 'A soft hand towel'];
    instructions = [
      `Fill the container with dry oats or large uncooked pasta shapes (making sure they are too big to be a choking hazard).`,
      `Bury 3-4 of your child's favorite colorful ${interestTag} toys under the oats.`,
      `Invite your baby to run their fingers through the oats to find the hidden treasures.`,
      `Describe the sensations out loud: "The oats feel smooth!" "The toy is hard and yellow!"`,
      `Enjoy pouring the oats gently over their hands to stimulate sensory nerve endings.`
    ];
    outcome = 'Stimulates early sensory processing, hand grip strength, tactile discrimination, and core object permanence concepts.';
    safety = 'CHOKING HAZARD: Constant adult observation is mandatory. Do not leave the baby unattended with small objects.';
    estTime = '15-20 Minutes';
  } else if (age >= 6) {
    if (indoorOutdoor === 'outdoor') {
      title = `Junior Detective: Outdoor ${interestTag} Scavenger Hunt`;
      materials = ['Scavenger checklist sheet', 'Pencil or crayon', 'Magnifying glass (optional)', 'Small collection bag'];
      instructions = [
        `Design a mini scavenger list with items reflecting "${interestTag}" (e.g. 3 different leaves, a smooth round pebble, something fuzzy, a green twig).`,
        `Head outside to a safe garden, backyard, or local park area.`,
        `Equip your child with the magnifying glass and collection bag to examine their findings.`,
        `Challenge them to categorize their findings by texture, weight, or shade of color.`,
        `Ask them to explain how each found item contributes to the local ecosystem.`
      ];
      outcome = 'Fosters scientific inquiry, observation skills, physical activity, ecological awareness, and early taxonomy classification.';
      safety = 'Stay within visual boundaries. Avoid touching unknown insects or plants. Wash hands thoroughly afterwards.';
      estTime = `${availableTime || 45} Minutes`;
    } else {
      title = `Architect Academy: ${interestTag} Fort Engineering`;
      materials = ['Sturdy chairs', '2-3 Large bed sheets or blankets', 'Cushions and pillows', 'Safety clothes-pins or heavy books to secure corners', 'Flashlight'];
      instructions = [
        `Select an indoor space. Work together to arrange chairs in a sturdy circle or rectangle to act as supporting pillars.`,
        `Drape the bed sheets across the chairs. Use clothes-pins or heavy books to anchor the edges down safely.`,
        `Line the inside floor with plush pillows and cozy cushions to create a snug reading/learning pod.`,
        `Bring in a flashlight and pretend this is a secret scientific laboratory exploring "${interestTag}".`,
        `Read a book or sketch a picture of your "${interestTag}" discoveries inside the cozy fort together!`
      ];
      outcome = 'Introduces introductory engineering principles (stability, gravity, tension), enhances collaborative teamwork, and provides a calming sensory environment.';
      safety = 'Ensure chairs are sturdy and secured so they do not tip over on your child. Keep heavy objects away from draping sheets.';
      estTime = `${availableTime || 60} Minutes`;
    }
  } else { // Ages 3-5
    if (difficulty === 'creative') {
      title = `Creative Studio: The Art of ${interestTag}`;
      materials = ['Washable kid paints or watercolors', 'Thick paper or canvas', 'A wet sponge or paint brushes', 'Sellers tape or painters tape'];
      instructions = [
        `Tape the corners of the thick paper to a table to keep it flat.`,
        `Use painter's tape to form the silhouette of an animal or shape related to "${interestTag}" directly on the paper.`,
        `Let your child paint freely over the entire sheet, covering the tape! Encourage blending of favorite colors.`,
        `Let the paint dry for a few minutes.`,
        `Gently peel away the painter's tape to reveal a gorgeous crisp white silhouette surrounded by vibrant colors!`
      ];
      outcome = 'Fosters artistic self-expression, color theory knowledge, fine motor control, and understanding of negative space concepts.';
      safety = 'Use only washable, non-toxic water-based paints. Protect surrounding furniture with paper or a plastic tablecloth.';
      estTime = '35-40 Minutes';
    }
  }

  return {
    id: `act_${Math.random().toString(36).substr(2, 9)}`,
    title,
    materialsNeeded: materials,
    instructions,
    learningOutcome: outcome,
    safetyTips: safety,
    estimatedTime: estTime,
    indoorOutdoor: indoorOutdoor === 'both' ? 'indoor' : indoorOutdoor,
    difficulty,
    ageRange: age <= 2 ? '0-2 Years' : age <= 5 ? '3-5 Years' : '6-10 Years',
    category: interestTag,
    createdAt: new Date().toISOString()
  };
}

/**
 * 2. AI MEAL PLANNER
 */
export async function createMeal(
  ingredients: string[],
  dietPreference: string,
  mealType: string
): Promise<MealPlan> {
  await delay(1500);

  const ingredientList = ingredients.length > 0 ? ingredients : ['Apples', 'Oatmeal', 'Milk', 'Bananas'];
  const formattedIngredients = ingredientList.join(', ');

  let breakfast = 'Sweet Banana Oatmeal Smile';
  let lunch = 'Rainbow Cream Cheese & Avocado Pinwheels';
  let snack = 'Crispy Apple Slices with Creamy Seed Butter Star';
  let dinner = 'Hidden-Veggie Cheesy Pasta Bake';
  let tips = [
    'Always cut round items like grapes and cherry tomatoes into quarters lengthwise to prevent choking.',
    'Involve your child in mixing the ingredients to spark interest in trying new foods!'
  ];

  if (dietPreference === 'vegetarian' || dietPreference === 'vegan') {
    breakfast = 'Creamy Coconut Chia Seed Pudding with Fresh Mango';
    lunch = 'Hummus and Shredded Cucumber Pocket Pitas';
    snack = 'Crunchy Cinnamon Apple Rings';
    dinner = 'Golden Sweet Potato and Chickpea Mild Curry';
    tips = [
      'Incorporate a source of Vitamin C (like berries or citrus) alongside plant-based iron (chickpeas, spinach) to boost iron absorption.',
      'Blend silken tofu or soaked cashews into sauces to add healthy proteins and fats smoothly!'
    ];
  } else if (dietPreference === 'allergy-friendly') {
    breakfast = 'Gluten-Free Rice Flakes with Almond Milk & Berries';
    lunch = 'Quinoa Bowls with Shredded Carrots and Steamed Chicken Breast';
    snack = 'Baked Pear Slices with a dusting of organic cinnamon';
    dinner = 'Allergy-Safe Beef & Zucchini Skillet Noodles';
    tips = [
      'Double-check all packaged ingredients for hidden traces of common allergens like soy, gluten, or nuts.',
      'Using pureed pumpkin or banana is an excellent egg-free binder for pancakes and baking!'
    ];
  }

  // Adjust dinner if ingredients are provided
  if (ingredients.length > 0) {
    const mainIngredient = ingredients[0];
    dinner = `Gently Roasted ${mainIngredient} with Fluffy Rice and Mild Herb Drizzle`;
    tips.unshift(`This meal makes great use of your fresh ${mainIngredient}! It provides a comforting texture that children enjoy.`);
  }

  return {
    id: `meal_${Math.random().toString(36).substr(2, 9)}`,
    breakfast,
    lunch,
    snack,
    dinner,
    nutritionTips: tips,
    dietType: dietPreference || 'Healthy Kids Balance',
    ingredientsUsed: ingredientList,
    createdAt: new Date().toISOString()
  };
}

/**
 * 3. AI STORY GENERATOR
 */
export async function createStory(
  childName: string,
  favoriteAnimal: string,
  theme: string,
  storyLength: 'short' | 'medium' | 'long'
): Promise<BedtimeStory> {
  await delay(1800);

  const name = childName || 'Leo';
  const animal = favoriteAnimal || 'Fox';
  const selectedTheme = theme || 'Bedtime Adventure';

  let title = `The ${selectedTheme}: ${name} and the Magic ${animal}`;
  let paragraphs: string[] = [];
  let moral = 'The best adventures are those that are fueled by kindness, patience, and a curious spirit.';
  let discussion = [
    `How do you think ${name} felt when they first saw the magic ${animal}?`,
    `If you had a companion like the ${animal}, where would you choose to go exploring tomorrow?`,
    `Why was it important that they worked together instead of giving up?`
  ];

  // Story writing based on theme
  if (selectedTheme.toLowerCase().includes('space') || selectedTheme.toLowerCase().includes('star')) {
    title = `The Starry Search: ${name} and the Cosmic ${animal}`;
    paragraphs = [
      `Once upon a twilight, as the stars began to blink like tiny nightlights in the sky, a clever child named ${name} noticed something unusual shining from the window. It was a soft, glowing trail of stardust that led right down into the garden.`,
      `With a quiet rustle, out stepped an adorable, stardust-dusted ${animal}! This wasn't any ordinary forest creature; this was a Cosmic ${animal} with eyes as bright as distant moons. "Hello, ${name}," the ${animal} whispered in a voice that sounded like soft wind chimes. "I have lost my favorite glowing star in the sky, and I need a companion who is brave and kind to help me search."`,
      `Without hesitation, ${name} nodded. Together, they hopped onto a soft, floating cloud that drifted down to greet them. The cloud lifted them high above the treetops, sailing gently past the sleepy birds and through the silver beams of the moon.`,
      `They searched behind the big blue planet, they peeked under the golden rings of Saturn, and finally, tucked snugly inside a sleepy crescent moon, they found the missing star! It was humming a quiet, sleepy tune. ${name} gently picked it up and placed it back in the night sky.`,
      `The Cosmic ${animal} smiled warmly and hugged ${name}. "Thank you for your warm heart," the ${animal} said, as the floating cloud brought ${name} safely back to bed. "Whenever you look up at the night sky, remember that you are a protector of stars." ${name} closed their eyes, feeling cozy and safe, knowing the stars were watching over them.`
    ];
    moral = 'A small act of kindness can make the entire universe shine a little brighter.';
  } else if (selectedTheme.toLowerCase().includes('forest') || selectedTheme.toLowerCase().includes('magic') || selectedTheme.toLowerCase().includes('mystery')) {
    title = `The Whispering Woods: ${name} & the Ancient ${animal}`;
    paragraphs = [
      `Deep inside the Whispering Woods, where the giant old oak trees hummed ancient lullabies, lived a magical ${animal}. This ${animal} had a special gift—it could make beautiful flowers bloom just by telling a happy joke.`,
      `One bright afternoon, ${name} was walking along the mossy path when they heard a soft sigh. Behind a giant wild fern, the ${animal} was sitting with floppy ears, looking quite puzzled. "What is wrong, friend?" ${name} asked, sitting down gently beside them.`,
      `"I have forgotten my happiest joke, and now the flowers are too sleepy to bloom," said the ${animal}. ${name} thought for a moment and then told a silly joke about a butterfly wearing yellow rainboots.`,
      `The ${animal} giggled, then laughed, and finally let out a giant, joyful chuckle! Instantly, all the surrounding forest wild roses and bluebells popped open, filling the air with a sweet scent of honeysuckle and wild strawberries.`,
      `The woods were filled with color and light. The ${animal} thanked ${name} and gifted them a small wooden leaf whistle that would always remind them of the forest. Hand in hand, they walked back to the edge of the woods, ready for a cozy night of sweet dreams.`
    ];
    moral = 'Laughter is a magical key that can bring warmth, color, and life to any gloomy day.';
  } else {
    // Bedtime / General Adventure
    title = `The Great Pajama Expedition: ${name} and the Sleepy ${animal}`;
    paragraphs = [
      `It was almost bedtime, and ${name} had already brushed their teeth and put on their favorite pajamas. But just as they were about to tuck under the blankets, a tiny tapping sound came from the closet.`,
      `Out waddled a beautiful, sleepy ${animal} wearing a tiny nightcap! "Excuse me, ${name}," yawned the ${animal}. "I am searching for the Land of Soft Pillows, but I am simply too tired to find the secret path."`,
      `"I know exactly where it is!" ${name} declared. They lined up all their stuffed animals to form a protective path across the rug, then constructed a soft stepping-stone bridge using three fluffy pillows.`,
      `With great care, ${name} guided the sleepy ${animal} across the bridge, past the stuffed bears, and right onto the center of the bed, which was the softest place in the whole house!`,
      `The ${animal} curled up in a snug circle and began to purr a peaceful song. "This is perfect," whispered the ${animal}. ${name} crawled in beside them, pulled up the heavy, warm duvet, and together they drifted off to have the sweetest adventures in the land of dreams.`
    ];
    moral = 'Helping others find their comfort is the most peaceful way to prepare for our own rest.';
  }

  // Adjust content if short or long length is requested
  if (storyLength === 'short') {
    paragraphs = [paragraphs[0], paragraphs[1] || '', paragraphs[paragraphs.length - 1] || ''].filter(p => p !== '');
  } else if (storyLength === 'long') {
    paragraphs.push(`As the silver stars kept watch, the sweet scent of bedtime flowers drifted through the open window, promising that ${name} and the friendly ${animal} would have many more wonderful secrets to explore when the morning sun woke up.`);
  }

  // Get a beautiful customized SVG representation for the story card!
  const illustration = getStoryIllustration(animal, selectedTheme, '#6C63FF');

  return {
    id: `story_${Math.random().toString(36).substr(2, 9)}`,
    title,
    storyText: paragraphs,
    moral,
    discussionQuestions: discussion,
    characterName: name,
    favoriteAnimal: animal,
    theme: selectedTheme,
    length: storyLength,
    illustrationUrl: illustration,
    isFavorited: false,
    createdAt: new Date().toISOString()
  };
}

/**
 * 4. PARENTING COACH
 */
export async function askParentCoach(
  question: string,
  chatHistory: CoachMessage[],
  childProfile?: ChildProfile | null
): Promise<CoachMessage> {
  await delay(1200);

  const q = question.toLowerCase();
  const childName = childProfile?.name || 'your child';
  const childAge = childProfile?.age !== undefined ? childProfile.age : 'this age';

  let replyText = `Thank you for sharing your parenting experience. It takes incredible patience and dedication to navigate these moments!

For a child around ${childAge} years old, here are some supportive strategies to try:

1. **Acknowledge & Validate**: Speak their feelings first. For instance: *"I see you are really frustrated that we have to pack up the toys."* This makes them feel heard and calms their emotional brain.
2. **Offer Simple, Structured Choices**: Give power back to them. Try: *"Would you like to put the blocks in the blue box or the red box first?"* or *"Do you want to brush your teeth before or after putting on your pajamas?"*
3. **Establish a Predictable Routine**: Children thrive on predictability. Use visual charts or short, gentle count-downs (e.g. *"In 5 minutes, we will wash hands for dinner"*).

Remember, consistency is key, and it is completely normal to have bumps along the road!`;

  let followUps = [
    'How can I handle tantrums in public settings?',
    'What is a healthy routine for bedtime?',
    'How do I maintain my own composure during a tantrum?'
  ];

  // Tailored responses for common topics
  if (q.includes('vegetable') || q.includes('food') || q.includes('eat') || q.includes('refuses')) {
    replyText = `It is incredibly common for children, particularly toddlers aged 2-5, to go through picky eating phases. Here is a compassionate approach to vegetable refusal for ${childName}:

• **No Pressure, Exposure Only**: Focus on exposure rather than consumption. It can take up to 15-20 positive exposures for a child to taste and accept a new food! Keep placing a small portion of veggies on their plate without commenting on whether they eat it.
• **Role Modeling**: Children love to copy their parents. Let them see you enjoying broccoli or carrots with enthusiasm!
• **Interactive Gardening/Cooking**: Have ${childName} help wash lettuce, tear spinach leaves, or pick cherry tomatoes. When children help prepare food, they are 80% more likely to try it.
• **Familiar Pairings**: Serve unfamiliar veggies with a beloved dip (hummus, yogurt, or mild cheese). 

Avoid power struggles at the dinner table; your job is to provide healthy food, and their job is to decide how much of it to eat!`;
    
    followUps = [
      'Should I hide vegetables in their favorite sauces?',
      'How do I make mealtime a stress-free environment?',
      'What are some high-protein snacks my child might enjoy?'
    ];
  } else if (q.includes('screen') || q.includes('ipad') || q.includes('tv') || q.includes('phone') || q.includes('tablet')) {
    replyText = `Managing screen time is one of the most prominent challenges for modern parents. For a child at ${childAge} years old, here are developmental guidelines:

• **Age Boundaries**: Pediatric experts recommend under 1 hour of high-quality, co-viewed content daily for ages 2-5, and clear consistent limits for ages 6+. For children under 2, screens are best avoided except for brief video chats with family.
• **Create "Screen-Free Zones"**: Establish strict boundaries such as no screens in bedrooms, during mealtimes, or in the 1 hour preceding bedtime (as blue light disrupts natural sleep melatonin).
• **The "First/Then" Rule**: Anchor screen time to completed tasks: *"First we put on our shoes and play outside, then we can watch 20 minutes of your favorite show."*
• **Co-Viewing**: Sit with ${childName} and ask active questions: *"What is that character doing?"* or *"What do you think will happen next?"* This turns a passive activity into an active cognitive exercise!`;

    followUps = [
      'What are good interactive educational apps for kids?',
      'How do I transition away from screens without a tantrum?',
      'How does screen time affect early childhood development?'
    ];
  } else if (q.includes('tantrum') || q.includes('scream') || q.includes('cry') || q.includes('meltdown')) {
    replyText = `Tantrums are not bad behavior; they are an emotional overload when a child's big feelings exceed their developmental ability to communicate! Here is a loving roadmap to navigate these storms with ${childName}:

• **Connection Before Correction**: During a meltdown, ${childName}'s logical brain is offline. Reasoning, lecturing, or shouting will not work. Sit quietly nearby so they know they are safe. You can say: *"I am right here with you. I will keep you safe until you feel calm."*
• **The Power of the Pause**: Avoid reacting immediately. Take a deep breath to co-regulate. If you stay calm, their mirror neurons will help them match your calm frequency over time.
• **Name the Feeling**: Teach them emotional vocabulary: *"You are angry because we cannot go to the park. It is okay to feel angry, but it is not okay to hit."*
• **Praise the Calm Down**: Once the storm passes, offer a warm hug and say: *"You did a great job breathing and calming your body down. Let's talk about what we can do next time."*`;

    followUps = [
      'How do I prevent meltdowns before they start?',
      'Is it okay to use time-outs during big tantrums?',
      'How do I teach my child to express anger safely?'
    ];
  } else if (q.includes('speech') || q.includes('talk') || q.includes('word') || q.includes('communicate')) {
    replyText = `Fostering early language development is a wonderful, conversational journey. To help ${childName} expand their speech skills at ${childAge} years old, try these daily techniques:

• **Narrate Your Day**: Act as a sports commentator for your life! Say what you are doing out loud: *"Now I am pouring the fresh milk into the blue cup."* This surrounds your child with rich, contextual vocabulary.
• **The "Pause and Wait" Strategy**: When asking ${childName} a question, pause and count slowly to 5 in your head before filling the silence. This gives their developing brain the vital processing time they need to formulate their words.
• **Expand Their Sentences**: If they say *"Car go!"*, respond by expanding: *"Yes! The big red car is going very fast!"* This naturally teaches sentence structure and adjectives.
• **Shared Reading**: Point to pictures and describe them. Ask *"What sound does this duck make?"* or *"What color is this apple?"* rather than just reading the text.`;

    followUps = [
      'What are indicators that my child might need speech therapy?',
      'How many words should a typical child speak at this age?',
      'Are language learning apps helpful for early speech?'
    ];
  }

  return {
    id: `msg_${Date.now()}`,
    sender: 'ai',
    text: replyText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedQuestions: followUps
  };
}

/**
 * 5. LEARNING PLANNER
 */
export async function getLearningPlan(
  childProfile: ChildProfile
): Promise<LearningGoalItem[]> {
  await delay(1200);

  const age = childProfile.age;
  const name = childProfile.name;
  const interest = childProfile.interests.length > 0 ? childProfile.interests[0] : 'Curiosity';

  if (age <= 2) {
    return [
      {
        category: 'Language',
        goal: 'Sound mimicking and early labeling',
        description: `Fosters vocabulary association by linking sounds and objects, tailored to ${name}'s world.`,
        suggestedActivities: ['Animal sound bingo', 'Singing simple nursery rhymes with hand movements', 'Pointing and naming household objects']
      },
      {
        category: 'Math',
        goal: 'Spatial shapes and sizes sorting',
        description: 'Introducing physical geometries and spatial awareness through hands-on tactile play.',
        suggestedActivities: ['Nesting cups play', 'Stacking large wooden rings', 'Comparing big vs small toys in their toy-chest']
      },
      {
        category: 'Creativity',
        goal: 'Finger painting and sensory textures',
        description: 'Encouraging fine sensory processing and early self-expression without rigid rules.',
        suggestedActivities: ['Yogurt/food-color safe finger painting', 'Squeezing soft textured fabrics', 'Playing with water pouring in a shallow tub']
      },
      {
        category: 'Motor Skills',
        goal: 'Pincer grasp and core balance stability',
        description: 'Strengthening finger grip coordination and crawling/standing leg muscles.',
        suggestedActivities: ['Picking up large colorful buttons', 'Rolling soft tennis balls back and forth', 'Tummy-time crawls over soft pillows']
      },
      {
        category: 'Social Skills',
        goal: 'Emotional expressions recognition',
        description: 'Helping babies understand facial cues and self-awareness in a mirror.',
        suggestedActivities: ['Peek-a-boo with expressive faces', 'Mirror mirror play pointing to nose/ears', 'Waving goodbye and blowing sweet kisses']
      },
      {
        category: 'Life Skills',
        goal: 'Holding utensils and picking up blocks',
        description: 'Early building blocks of personal independence during feeding and clean up.',
        suggestedActivities: ['Practicing holding a soft silicone baby spoon', 'Placing three large toys back into a clean basket', 'Splashing hands during bath clean time']
      }
    ];
  } else if (age <= 5) {
    return [
      {
        category: 'Language',
        goal: 'Story-telling and phonetic sound matching',
        description: `Expanding vocabulary structure and recognizing early letter sounds, utilizing ${name}'s interest in ${interest}.`,
        suggestedActivities: ['Telling a 3-sentence story together', 'Letter-sound matching games (e.g., A is for Apple)', 'Rhyming word games during car rides']
      },
      {
        category: 'Math',
        goal: 'Counting 1-20 and early basic sorting',
        description: 'Fostering numerical ordering, group sizes comparison, and recognizing simple patterns.',
        suggestedActivities: ['Counting green blocks vs yellow blocks', 'Creating a pattern with colored stones (AB-AB)', 'Measuring food ingredients using child cups']
      },
      {
        category: 'Creativity',
        goal: 'Dramatic roleplay and structured sketching',
        description: 'Developing imagination by acting out characters and drawing meaningful scenes.',
        suggestedActivities: ['Dressing up as an explorer on a safari', 'Drawing a house showing windows, trees, and sun', 'Building a modern clay castle with high pillars']
      },
      {
        category: 'Motor Skills',
        goal: 'Safety cutting and hopping balance',
        description: 'Improving coordination of fingers and gross-motor leg balance.',
        suggestedActivities: ['Cutting out wavy strips of colored paper', 'Hopping on one foot across the rug', 'Threading large chunky beads on a shoe-lace']
      },
      {
        category: 'Social Skills',
        goal: 'Taking turns and emotional vocabulary',
        description: 'Learning to share, waiting for their turn, and labeling big feelings.',
        suggestedActivities: ['Playing a simple board game with family', 'Using the "Feelings Wheel" to choose their emotion', 'Collaborating with a friend to build a block tower']
      },
      {
        category: 'Life Skills',
        goal: 'Putting on shoes and sorting clean laundry',
        description: 'Fostering personal hygiene, self-dressing, and contributing to home care.',
        suggestedActivities: ['Putting velcro shoes on the correct feet', 'Sorting socks by matching colors together', 'Wiping the dinner table clean with a damp cloth']
      }
    ];
  } else { // 6-10 Years
    return [
      {
        category: 'Language',
        goal: 'Guided reading, grammar basics, and vocabulary',
        description: `Encouraging independent reading comprehension and constructing creative written stories about ${interest}.`,
        suggestedActivities: ['Writing a 1-paragraph story about a magic quest', 'Reading a favorite chapter book out loud', 'Finding three synonyms for the word "happy"']
      },
      {
        category: 'Math',
        goal: 'Introductory multiplication, symmetry, and money management',
        description: 'Exploring early multiplication grids, spatial geometry symmetries, and counting pocket coins.',
        suggestedActivities: ['Playing a storekeeper game with pretend coins', 'Finding symmetrical shapes in nature', 'Learning 2x and 5x multiplication skip-counting']
      },
      {
        category: 'Creativity',
        goal: 'Stop-motion planning, model crafting, and landscape watercolors',
        description: 'Nurturing advanced planning, fine artistic techniques, and architectural designs.',
        suggestedActivities: ['Water-color landscape painting with depth', 'Building a detailed LEGO model with moving gear wheels', 'Creating a comic strip outlining a hero adventure']
      },
      {
        category: 'Motor Skills',
        goal: 'Rope skipping, bicycle balance, and origami folding',
        description: 'Honing high-level physical stamina, hand agility, and precise finger folding.',
        suggestedActivities: ['Learning to fold a beautiful paper crane', 'Practicing rope skipping in the backyard', 'Agility course run with quick side-shuffling']
      },
      {
        category: 'Social Skills',
        goal: 'Empathetic listening and resolving peer conflict',
        description: 'Fostering active listening, perspective-taking, and communicating compromise.',
        suggestedActivities: ['Roleplaying a resolution when friends disagree', 'Discussing how characters in books feel', 'Writing a thank-you letter to an inspiring teacher']
      },
      {
        category: 'Life Skills',
        goal: 'Safe basic kitchen baking, budget saving, and daily schedule',
        description: 'Developing essential practical self-reliance and organizing time effectively.',
        suggestedActivities: ['Mixing and measuring batter for healthy muffins', 'Setting up a 3-box savings system (Save, Spend, Give)', 'Making their own bed and packing their school bag']
      }
    ];
  }
}

/**
 * 6. AI WEEKLY PLANNER
 */
export async function createWeeklyPlan(
  childProfile: ChildProfile
): Promise<WeeklyPlannerData> {
  await delay(1800);

  const name = childProfile.name;
  const age = childProfile.age;
  const interest = childProfile.interests.length > 0 ? childProfile.interests[0] : 'Creativity';
  const animal = childProfile.favoriteAnimals.length > 0 ? childProfile.favoriteAnimals[0] : 'Rabbit';

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const days: { [key: string]: any } = {};

  // Sample templates for days
  const activities = [
    `Sensory exploration with safe clay sculpting a beautiful ${animal}`,
    `Outdoor leaf sorting scavenger expedition exploring ${interest}`,
    `DIY bird feeder construction using pine cones and seeds`,
    `Watercolors painting session blending their favorite colors`,
    `Indoor obstacle course crawling through blanket forts`,
    `Baking healthy mini oatmeal banana muffins together`,
    `Planting a magical seed in a small decorated terracotta pot`
  ];

  const meals = [
    { breakfast: 'Creamy Berry Oatmeal', lunch: 'Avocado Roll-ups', snack: 'Sliced Apples & Dip', dinner: 'Cheesy Vegetable Pasta' },
    { breakfast: 'Fluffy Banana Pancakes', lunch: 'Mild Pumpkin Soup', snack: 'Homemade Granola', dinner: 'Roasted Chicken/Tofu with Rice' },
    { breakfast: 'Yogurt Parfait & Honey', lunch: 'Pita Pocket with Hummus', snack: 'Carrot Sticks & Dip', dinner: 'Sweet Potato Veggie Skillet' },
    { breakfast: 'Scrambled Eggs & Toast', lunch: 'Shredded Turkey/Cheese Sandwich', snack: 'Watermelon Stars', dinner: 'Mild Baked Salmon with Broccoli' },
    { breakfast: 'Berry French Toast Slices', lunch: 'Mac & Cheese with Pea Puree', snack: 'Baked Pear Slices', dinner: 'Veggie Pizza on Whole Wheat Crust' },
    { breakfast: 'Fruit & Oats Smoothie Bowl', lunch: 'Quesadilla with Beans & Cheese', snack: 'Roasted Chickpeas', dinner: 'Mild Turkey/Lentil Cozy Stew' },
    { breakfast: 'Waffles with Fresh Strawberry', lunch: 'Fried Rice with Colorful Peas', snack: 'Yogurt Drops', dinner: 'Noodle Soup with Soft Veggies' }
  ];

  const learningGoals = [
    'Language: Learning three new action verbs in sentences',
    'Math: Counting sets of blocks up to their age level',
    'Creativity: Crafting a small paper card for family',
    'Motor Skills: Practicing precise scissors safety cuts',
    'Social Skills: Practicing active waiting during play-time',
    'Life Skills: Learning to wipe their spillages independently',
    'Reflection: Sharing their favorite moment of the week'
  ];

  const stories = [
    `The Starry search of a beautiful Cosmic ${animal}`,
    `How a brave kid and a ${animal} saved the garden`,
    `The sleepy adventure of ${name} and the bedtime cloud`,
    `When the laughing ${animal} made the flowers bloom`,
    `The magical pajamas expedition to pillow island`,
    `How ${name} taught the wild forest ${animal} to sing`,
    `The beautiful star that sang a bedtime lullaby`
  ];

  const familyTime = [
    `Building a giant bedsheet living-room fort and reading inside with flashlights`,
    `Family board game or puzzle evening with cozy popcorn`,
    `A 20-minute dance party in the living room to upbeat children songs`,
    `Heading to the neighborhood playground for a game of tag`,
    `Stargazing out of the window wrapped in warm fluffy blankets`,
    `Looking through family photo albums sharing funny childhood memories`,
    `A calm Sunday evening family baking and decoration session`
  ];

  daysOfWeek.forEach((day, index) => {
    days[day] = {
      activity: activities[index % activities.length],
      meal: meals[index % meals.length],
      learningGoal: learningGoals[index % learningGoals.length],
      storyTheme: stories[index % stories.length],
      familyTime: familyTime[index % familyTime.length]
    };
  });

  return {
    id: `wp_${Math.random().toString(36).substr(2, 9)}`,
    childName: name,
    weekStart: 'This Week',
    days,
    createdAt: new Date().toISOString()
  };
}
