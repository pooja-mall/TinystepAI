/**
 * TinySteps AI Types & Interfaces
 */

export interface ChildProfile {
  name: string;
  age: number; // 0 to 10
  gender: string;
  interests: string[];
  favoriteAnimals: string[];
  favoriteColors: string[];
  school?: string;
  allergies: string[];
  dietPreference: string; // 'none' | 'vegetarian' | 'vegan' | 'halal' | 'kosher' | 'allergy-friendly'
  languages: string[];
}

export interface ActivityItem {
  id: string;
  title: string;
  materialsNeeded: string[];
  instructions: string[];
  learningOutcome: string;
  safetyTips: string;
  estimatedTime: string; // e.g., "30-45 mins"
  indoorOutdoor: 'indoor' | 'outdoor' | 'both';
  difficulty: 'easy' | 'medium' | 'creative';
  ageRange: string;
  category: string;
  isFavorited?: boolean;
  createdAt: string;
}

export interface MealPlan {
  id: string;
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
  nutritionTips: string[];
  dietType: string;
  ingredientsUsed: string[];
  createdAt: string;
}

export interface BedtimeStory {
  id: string;
  title: string;
  storyText: string[]; // split into paragraphs
  moral: string;
  discussionQuestions: string[];
  characterName: string;
  favoriteAnimal: string;
  theme: string;
  length: 'short' | 'medium' | 'long';
  illustrationUrl?: string; // Generated SVG or mock image URL
  isFavorited?: boolean;
  createdAt: string;
}

export interface CoachMessage {
  id: string;
  sender: 'parent' | 'ai';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
}

export interface LearningMilestoneItem {
  id: string;
  title: string;
  category: 'physical' | 'language' | 'cognitive';
  completed: boolean;
}

export interface LearningGoalItem {
  category: 'Language' | 'Math' | 'Creativity' | 'Motor Skills' | 'Social Skills' | 'Life Skills';
  goal: string;
  description: string;
  suggestedActivities: string[];
}

export interface DailyPlannerData {
  activity: string;
  meal: {
    breakfast: string;
    lunch: string;
    snack: string;
    dinner: string;
  };
  learningGoal: string;
  storyTheme: string;
  familyTime: string;
}

export interface WeeklyPlannerData {
  id: string;
  childName: string;
  weekStart: string;
  days: {
    [key: string]: DailyPlannerData; // "Monday", "Tuesday", etc.
  };
  createdAt: string;
}

export interface AppState {
  user: {
    name: string;
    email: string;
    isLoggedIn: boolean;
    isGuest: boolean;
  } | null;
  childProfile: ChildProfile | null;
  favoritedActivities: ActivityItem[];
  favoritedStories: BedtimeStory[];
  recentHistory: {
    type: 'activity' | 'meal' | 'story' | 'weekly-plan';
    id: string;
    title: string;
    timestamp: string;
  }[];
  darkMode: boolean;
}

export interface StoryScene {
  id: string;
  pageNumber: number;
  paragraph: string;
  illustrationSvg: string; // SVG code or description
}

export interface StoryStudioBook {
  id: string;
  title: string;
  theme: string;
  mood: string;
  length: '2 min' | '5 min' | '10 min';
  language: string;
  narrator: string;
  moral: string;
  quote: string;
  readingTime: string;
  scenes: StoryScene[];
  discussionQuestions: string[];
  offlineActivities: string[];
  coverSvg: string;
  isFavorited?: boolean;
  createdAt: string;
}

