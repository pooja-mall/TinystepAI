import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Baby, 
  Smile, 
  Plus, 
  X, 
  Save, 
  ShieldAlert, 
  Volume2, 
  Palette,
  Heart
} from 'lucide-react';
import { ChildProfile } from '../../types';

interface ProfileViewProps {
  currentProfile: ChildProfile | null;
  onSave: (profile: ChildProfile) => void;
  triggerConfetti: () => void;
}

const INTEREST_PRESETS = ['Dinosaurs', 'Drawing', 'Puzzles', 'Blocks', 'Music', 'Sports', 'Outdoors', 'Reading', 'Space', 'Lego', 'Crafts', 'Superheroes'];
const ANIMAL_PRESETS = ['Rabbit', 'Bear', 'Fox', 'Lion', 'Puppy', 'Kitten', 'Dinosaur', 'Elephant', 'Monkey', 'Owl', 'Panda', 'Koala'];
const COLOR_PRESETS = ['Green', 'Blue', 'Yellow', 'Pink', 'Purple', 'Orange', 'Red', 'Turquoise'];
const ALLERGY_PRESETS = ['Peanuts', 'Tree Nuts', 'Gluten', 'Dairy', 'Soy', 'Eggs', 'Seafood', 'Shellfish'];
const LANGUAGE_PRESETS = ['English', 'Spanish', 'Hindi', 'French', 'Mandarin', 'German', 'Arabic'];

const DIET_OPTIONS = [
  { value: 'none', label: 'Standard Balanced (No preference)' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
  { value: 'allergy-friendly', label: 'Allergy-Safe Focus' }
];

export default function ProfileView({ currentProfile, onSave, triggerConfetti }: ProfileViewProps) {
  const [name, setName] = useState(currentProfile?.name || 'Pranooja');
  const [age, setAge] = useState<number>(currentProfile?.age || 2.7);
  const [gender, setGender] = useState(currentProfile?.gender || 'Girl');
  const [school, setSchool] = useState(currentProfile?.school || 'Sunshine Preschool');
  const [dietPreference, setDietPreference] = useState(currentProfile?.dietPreference || 'none');

  // Multi-select tags using state arrays
  const [interests, setInterests] = useState<string[]>(currentProfile?.interests || ['Drawing', 'Blocks', 'Animals']);
  const [favoriteAnimals, setFavoriteAnimals] = useState<string[]>(currentProfile?.favoriteAnimals || ['Puppy', 'Kitten']);
  const [favoriteColors, setFavoriteColors] = useState<string[]>(currentProfile?.favoriteColors || ['Pink', 'Yellow']);
  const [allergies, setAllergies] = useState<string[]>(currentProfile?.allergies || []);
  const [languages, setLanguages] = useState<string[]>(currentProfile?.languages || ['English']);

  // Dynamic tag entry handlers
  const [customInterest, setCustomInterest] = useState('');
  const [customAnimal, setCustomAnimal] = useState('');
  const [customAllergy, setCustomAllergy] = useState('');

  const toggleTag = (category: 'interests' | 'animals' | 'colors' | 'allergies' | 'languages', value: string) => {
    let list: string[] = [];
    let setList: React.Dispatch<React.SetStateAction<string[]>>;

    switch (category) {
      case 'interests': list = interests; setList = setInterests; break;
      case 'animals': list = favoriteAnimals; setList = setFavoriteAnimals; break;
      case 'colors': list = favoriteColors; setList = setFavoriteColors; break;
      case 'allergies': list = allergies; setList = setAllergies; break;
      case 'languages': list = languages; setList = setLanguages; break;
    }

    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const addCustomTag = (category: 'interests' | 'animals' | 'allergies', value: string, setter: React.Dispatch<React.SetStateAction<string>>, listSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (!value.trim()) return;
    listSetter(prev => {
      if (prev.includes(value.trim())) return prev;
      return [...prev, value.trim()];
    });
    setter('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProfile: ChildProfile = {
      name: name.trim() || 'My Child',
      age: Math.min(10, Math.max(0, age)),
      gender,
      interests,
      favoriteAnimals,
      favoriteColors,
      school: school.trim(),
      allergies,
      dietPreference,
      languages
    };

    onSave(finalProfile);
    triggerConfetti(); // Play confetti!
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans pb-24">
      {/* Header section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <Baby className="w-3.5 h-3.5" />
            <span>Profile Wizard</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
            Child Profile Setup
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure interests, favorites, and allergies to customize the AI generators.
          </p>
        </div>
        
        {/* Quick action save */}
        <button
          onClick={handleSubmit}
          className="mt-4 md:mt-0 px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-xl shadow-soft hover:shadow-glow transition-all flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Child Profile</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Core Demographics Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-premium space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-50">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Baby className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-lg text-slate-900">1. Basic Demographics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Child's First Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm transition-all"
                placeholder="e.g. Pranooja"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Age (Years: 0 - 10)
              </label>
              <input
                type="number"
                required
                min="0"
                max="10"
                step="0.1"
                value={age}
                onChange={(e) => setAge(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm transition-all"
                placeholder="e.g. 2.7"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Gender Label
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Boy', 'Girl', 'Other'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-3 text-sm font-semibold rounded-xl border text-center transition-all ${gender === g ? 'bg-primary border-primary text-white shadow-soft' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              School or Preschool Name (Optional)
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm transition-all"
              placeholder="e.g. Sunshine Preschool"
            />
          </div>
        </div>

        {/* 2. Interests & Favorites Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-premium space-y-8">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-50">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-secondary flex items-center justify-center">
              <Smile className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-lg text-slate-900">2. Play & Favorites</h2>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Favorite Play Interests (Click to select)
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_PRESETS.map((item) => {
                const selected = interests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleTag('interests', item)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${selected ? 'bg-primary/15 border-primary text-primary' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex max-w-sm">
              <input
                type="text"
                placeholder="Add custom interest..."
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                className="flex-grow px-3 py-2 text-xs bg-slate-50 border border-slate-100 rounded-l-xl focus:outline-none"
              />
              <button
                type="button"
                onClick={() => addCustomTag('interests', customInterest, setCustomInterest, setInterests)}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-r-xl"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Favorite Animals */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Favorite Animals
            </label>
            <div className="flex flex-wrap gap-2">
              {ANIMAL_PRESETS.map((item) => {
                const selected = favoriteAnimals.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleTag('animals', item)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${selected ? 'bg-primary/15 border-primary text-primary' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex max-w-sm">
              <input
                type="text"
                placeholder="Add custom animal..."
                value={customAnimal}
                onChange={(e) => setCustomAnimal(e.target.value)}
                className="flex-grow px-3 py-2 text-xs bg-slate-50 border border-slate-100 rounded-l-xl focus:outline-none"
              />
              <button
                type="button"
                onClick={() => addCustomTag('animals', customAnimal, setCustomAnimal, setFavoriteAnimals)}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-r-xl"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Favorite Colors */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Favorite Colors
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((item) => {
                const selected = favoriteColors.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleTag('colors', item)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${selected ? 'bg-primary/15 border-primary text-primary' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                  >
                    <span className="inline-flex items-center space-x-1.5">
                      <Palette className="w-3.5 h-3.5" />
                      <span>{item}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Nutrition & Allergies Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-premium space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-50">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-accent flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-lg text-slate-900">3. Nutrition & Allergies</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Diet Preference / Restrictions
              </label>
              <select
                value={dietPreference}
                onChange={(e) => setDietPreference(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary text-sm transition-all"
              >
                {DIET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Child Allergies (Exclude from Meals)
              </label>
              <div className="flex flex-wrap gap-2">
                {ALLERGY_PRESETS.map((item) => {
                  const selected = allergies.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleTag('allergies', item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${selected ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex max-w-sm">
                <input
                  type="text"
                  placeholder="Add custom allergy..."
                  value={customAllergy}
                  onChange={(e) => setCustomAllergy(e.target.value)}
                  className="flex-grow px-3 py-2 text-xs bg-slate-50 border border-slate-100 rounded-l-xl focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => addCustomTag('allergies', customAllergy, setCustomAllergy, setAllergies)}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-r-xl"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Language Settings Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-premium space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-50">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-500 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-lg text-slate-900">4. Language & Culture</h2>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Spoken/Taught Languages (For Bedtime Stories)
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_PRESETS.map((item) => {
                const selected = languages.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleTag('languages', item)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${selected ? 'bg-primary/15 border-primary text-primary' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button Group */}
        <div className="flex items-center justify-end space-x-4 border-t border-slate-100 pt-6">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-2xl shadow-premium hover:shadow-glow transition-all flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
          >
            <Save className="w-5 h-5" />
            <span>Save Profile & Celebrate</span>
          </button>
        </div>

      </form>
    </div>
  );
}
