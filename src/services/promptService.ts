import { ChildProfile } from '../types';

/**
 * Prompt Service
 * Generates highly structured, personalized prompts for the Gemini API.
 * This establishes the architectural foundation for a later transition to live LLM generation.
 */

export const promptService = {
  /**
   * Generates a prompt for creating a personalized story book.
   */
  buildStoryPrompt(
    profile: ChildProfile | null,
    theme: string,
    mood: string,
    length: string,
    language: string,
    narrator: string
  ): string {
    const childName = profile?.name || 'a happy child';
    const childAge = profile?.age || 3;
    const childGender = profile?.gender || 'child';
    const interests = profile?.interests?.join(', ') || 'playing, reading';
    const favoriteAnimals = profile?.favoriteAnimals?.join(', ') || 'animals';
    const favoriteColors = profile?.favoriteColors?.join(', ') || 'colorful things';

    return `
You are a master children's bedtime storyteller specializing in creating calming, engaging, and personalized stories.

Generate a highly personalized children's bedtime story in the language: "${language}" with the following parameters:
- **Child's Name**: ${childName}
- **Age**: ${childAge} years old (${childGender})
- **Interests**: ${interests}
- **Favorite Animals**: ${favoriteAnimals}
- **Favorite Colors**: ${favoriteColors}
- **Theme**: ${theme}
- **Bedtime Mood**: ${mood} (Ensure the narrative pacing and word choice reflect this mood)
- **Length**: ${length} reading time
- **Narrator Tone**: ${narrator}

### OUTPUT FORMAT:
Your output must be structured as a JSON object with the following properties:
{
  "title": "A beautiful story title",
  "quote": "An inspirational or calming quote from the story",
  "moral": "The central moral or lesson of the story in 1 short sentence",
  "readingTime": "e.g., 5 min",
  "scenes": [
    {
      "pageNumber": 1,
      "paragraph": "The opening paragraph, setting up the adventure... (use vivid, age-appropriate descriptions, incorporate favorite colors and animals)",
      "illustrationDescription": "A detailed visual description for an illustrator (e.g., 'An adorable little panda resting on a soft yellow cloud in a starry indigo sky')"
    },
    ... (Generate 4 to 6 scenes depending on length)
  ],
  "discussionQuestions": [
    "Question 1 (e.g. What was your favorite part of the adventure?)",
    "Question 2 (e.g. How did the character show kindness?)",
    "Question 3 (e.g. What would you do if you were on a soft cloud?)"
  ],
  "offlineActivities": [
    "Activity 1 (e.g. Draw a picture of the panda and the yellow cloud)",
    "Activity 2 (e.g. Pretend to float in the room like a sleepy cloud)",
    "Activity 3 (e.g. Hug your favorite stuffed animal and whisper a secret)"
  ]
}

Ensure the story is calming, has safe boundaries, avoids scary themes, has a slow and comforting resolution, and prepares the child for peaceful sleep.
`;
  }
};
