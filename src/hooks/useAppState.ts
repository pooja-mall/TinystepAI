import { useState, useEffect } from 'react';
import { ChildProfile, ActivityItem, BedtimeStory, AppState } from '../types';

const STORAGE_KEY = 'tinysteps_app_state';

const initialProfile: ChildProfile = {
  name: 'Pranooja',
  age: 2.7,
  gender: 'Girl',
  interests: ['Drawing', 'Blocks', 'Animals'],
  favoriteAnimals: ['Puppy', 'Kitten'],
  favoriteColors: ['Pink', 'Yellow'],
  school: 'Sunshine Preschool',
  allergies: [],
  dietPreference: 'none',
  languages: ['English']
};

const initialAppState: AppState = {
  user: {
    name: 'Pooja',
    email: 'pooja072cs@gmail.com',
    isLoggedIn: true, // Auto login for premium feel, but supports auth views!
    isGuest: false
  },
  childProfile: initialProfile,
  favoritedActivities: [],
  favoritedStories: [],
  recentHistory: [],
  darkMode: false
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure childProfile exists or fallback
        if (!parsed.childProfile && parsed.user?.isLoggedIn) {
          parsed.childProfile = initialProfile;
        }
        // Migrate legacy profile name/age/gender to Pranooja / 2.7 Girl
        if (parsed.childProfile && 
            (parsed.childProfile.name === 'Aarav' || 
             parsed.childProfile.name === 'Aryan' || 
             parsed.childProfile.name === 'Aryan Sharma' || 
             parsed.childProfile.name === 'Aarav Sharma' || 
             parsed.childProfile.name === 'My Kid' || 
             parsed.childProfile.age === 4)) {
          parsed.childProfile = {
            ...parsed.childProfile,
            name: 'Pranooja',
            age: 2.7,
            gender: 'Girl',
            interests: ['Drawing', 'Blocks', 'Animals'],
            favoriteAnimals: ['Puppy', 'Kitten'],
            favoriteColors: ['Pink', 'Yellow'],
            allergies: [],
            dietPreference: 'none',
            languages: ['English']
          };
        }
        return parsed;
      } catch (e) {
        console.error('Error parsing storage', e);
      }
    }
    return initialAppState;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('tinysteps_dark_mode') === 'true';
  });

  // Save state on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Handle dark mode class toggles
  useEffect(() => {
    localStorage.setItem('tinysteps_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const login = (name: string, email: string, isGuest: boolean = false) => {
    setState(prev => ({
      ...prev,
      user: {
        name,
        email,
        isLoggedIn: true,
        isGuest
      },
      // Keep existing profile if any, else initialize
      childProfile: prev.childProfile || (isGuest ? {
        name: 'My Kid',
        age: 3,
        gender: 'Girl',
        interests: ['Puzzles', 'Animals'],
        favoriteAnimals: ['Kangaroo'],
        favoriteColors: ['Yellow'],
        allergies: [],
        dietPreference: 'none',
        languages: ['English']
      } : initialProfile)
    }));
  };

  const logout = () => {
    setState({
      user: null,
      childProfile: null,
      favoritedActivities: [],
      favoritedStories: [],
      recentHistory: [],
      darkMode: false
    });
  };

  const saveProfile = (profile: ChildProfile) => {
    setState(prev => ({
      ...prev,
      childProfile: profile
    }));
  };

  const toggleFavoriteActivity = (activity: ActivityItem) => {
    setState(prev => {
      const isFav = prev.favoritedActivities.some(a => a.id === activity.id);
      const updated = isFav 
        ? prev.favoritedActivities.filter(a => a.id !== activity.id)
        : [...prev.favoritedActivities, { ...activity, isFavorited: true }];
      
      return {
        ...prev,
        favoritedActivities: updated
      };
    });
  };

  const toggleFavoriteStory = (story: BedtimeStory) => {
    setState(prev => {
      const isFav = prev.favoritedStories.some(s => s.id === story.id);
      const updated = isFav
        ? prev.favoritedStories.filter(s => s.id !== story.id)
        : [...prev.favoritedStories, { ...story, isFavorited: true }];

      return {
        ...prev,
        favoritedStories: updated
      };
    });
  };

  const addToHistory = (type: 'activity' | 'meal' | 'story' | 'weekly-plan', id: string, title: string) => {
    setState(prev => {
      // Remove duplicate if already present in history
      const cleaned = prev.recentHistory.filter(item => !(item.type === type && item.id === id));
      const newItem = {
        type,
        id,
        title,
        timestamp: new Date().toISOString()
      };
      return {
        ...prev,
        recentHistory: [newItem, ...cleaned].slice(0, 15) // Keep last 15 items
      };
    });
  };

  return {
    state,
    darkMode,
    setDarkMode,
    login,
    logout,
    saveProfile,
    toggleFavoriteActivity,
    toggleFavoriteStory,
    addToHistory
  };
}
