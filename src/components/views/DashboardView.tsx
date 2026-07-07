import { motion } from 'motion/react';
import { 
  Compass, 
  ChefHat, 
  BookOpen, 
  MessageSquare, 
  GraduationCap, 
  Calendar,
  Sparkles,
  ChevronRight,
  Heart,
  History,
  AlertCircle,
  Baby,
  Activity
} from 'lucide-react';
import { AppState, ChildProfile } from '../../types';

interface DashboardViewProps {
  appState: AppState;
  onNavigate: (tab: string) => void;
}

export default function DashboardView({ appState, onNavigate }: DashboardViewProps) {
  const parentName = appState.user?.name || 'Parent';
  const child = appState.childProfile;

  // Render a friendly empty state if child profile doesn't exist yet
  if (!child) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-6">
          <Baby className="w-8 h-8" />
        </div>
        <h2 className="font-display font-extrabold text-2xl text-slate-900 mb-2">Create Your Child’s Profile First</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">
          TinySteps needs a child profile to generate custom daily routines, age-appropriate play, healthy recipes, and bedtime stories!
        </p>
        <button
          onClick={() => onNavigate('profile')}
          className="px-6 py-3 bg-primary text-white font-bold text-sm rounded-xl shadow-soft hover:shadow-glow transition-all"
        >
          Setup Child Profile
        </button>
      </div>
    );
  }

  // Quick actions config
  const quickActions = [
    { label: 'Generate Activity', icon: Compass, tab: 'activity', color: 'bg-primary text-white hover:bg-primary/95 shadow-soft' },
    { label: 'Meal Planner', icon: ChefHat, tab: 'meals', color: 'bg-amber-400 text-slate-900 hover:bg-amber-500 shadow-soft font-bold' },
    { label: 'Create Story', icon: BookOpen, tab: 'stories', color: 'bg-emerald-400 text-slate-900 hover:bg-emerald-500 shadow-soft font-bold' },
    { label: 'Ask Parent AI', icon: MessageSquare, tab: 'coach', color: 'bg-rose-400 text-slate-900 hover:bg-rose-500 shadow-soft font-bold' },
    { label: 'Weekly Schedule', icon: Calendar, tab: 'weekly', color: 'bg-indigo-400 text-white hover:bg-indigo-500 shadow-soft' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans pb-24">
      
      {/* 1. Header & Greeting */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight flex items-center">
            <span>Good Morning, {parentName}</span>
            <span className="ml-2">👋</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here is your personalized roadmap to make today magical for {child.name}.
          </p>
        </div>

        {/* Quick streak indicator */}
        <div className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-soft">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Daily Streak: <span className="text-primary font-extrabold">5 Days</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* A. Child Bento Card (Sleek Theme solid background style) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-[#6C63FF] rounded-[2rem] text-white shadow-xl shadow-indigo-100 flex flex-col sm:flex-row justify-between items-start sm:items-center relative overflow-hidden"
          >
            {/* Visual background sparkles */}
            <div className="absolute right-[-5%] top-[-5%] text-white/10 select-none">
              <Sparkles className="w-32 h-32" />
            </div>

            <div className="z-10">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl shadow-sm">
                  🦖
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-xl text-white">{child.name}</h2>
                  <p className="text-xs text-white/80 font-semibold">{child.age} Years • {child.gender}</p>
                </div>
              </div>

              {/* Tag previews */}
              <div className="mt-4 flex flex-wrap gap-1.5 max-w-md">
                {child.interests.slice(0, 3).map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
                    {tag}
                  </span>
                ))}
                {child.favoriteAnimals.slice(0, 2).map((animal, i) => (
                  <span key={i} className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
                    🐾 {animal}
                  </span>
                ))}
                {child.favoriteColors.slice(0, 1).map((col, i) => (
                  <span key={i} className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">
                    🎨 {col}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate('profile')}
              className="mt-4 sm:mt-0 z-10 px-4 py-2.5 bg-white text-[#6C63FF] hover:bg-slate-50 transition-all font-bold text-xs rounded-xl shadow-sm"
            >
              Update Profile
            </button>
          </motion.div>

          {/* B. Today's Plan Cards */}
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Today’s Recommended Plan</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1: Activity of the Day */}
              <button
                onClick={() => onNavigate('activity')}
                className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-soft hover:shadow-premium hover:-translate-y-0.5 transition-all text-left flex items-start space-x-4 group"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1 block">Activity of the Day</span>
                  <h4 className="font-display font-bold text-slate-900 text-sm group-hover:text-primary transition-all line-clamp-1">
                    The {child.interests[0] || 'Sensory'} Exploration Safari
                  </h4>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                    Crafting, sorting, and storytelling centered around {child.name}’s top interests.
                  </p>
                </div>
              </button>

              {/* Card 2: Meal Suggestion */}
              <button
                onClick={() => onNavigate('meals')}
                className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-soft hover:shadow-premium hover:-translate-y-0.5 transition-all text-left flex items-start space-x-4 group"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary mb-1 block">Daily Meal Idea</span>
                  <h4 className="font-display font-bold text-slate-900 text-sm group-hover:text-secondary transition-all line-clamp-1">
                    Sweet Banana Oatmeal Smile
                  </h4>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                    Nutritious child-friendly recipe formulated to align with your {child.dietPreference} preferences.
                  </p>
                </div>
              </button>

              {/* Card 3: Learning Goal */}
              <button
                onClick={() => onNavigate('learning')}
                className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-soft hover:shadow-premium hover:-translate-y-0.5 transition-all text-left flex items-start space-x-4 group"
              >
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-1 block">Learning Milestone</span>
                  <h4 className="font-display font-bold text-slate-900 text-sm group-hover:text-blue-500 transition-all line-clamp-1">
                    Phonetic sound matching games
                  </h4>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                    Bento-style goal to expand {child.name}’s vocabulary and structural language patterns.
                  </p>
                </div>
              </button>

              {/* Card 4: Parenting Tip */}
              <button
                onClick={() => onNavigate('coach')}
                className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-soft hover:shadow-premium hover:-translate-y-0.5 transition-all text-left flex items-start space-x-4 group"
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1 block">Parenting Guidance</span>
                  <h4 className="font-display font-bold text-slate-900 text-sm group-hover:text-rose-500 transition-all line-clamp-1">
                    Handling pickiness with positive exposure
                  </h4>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                    Expert tactical strategies to ease transitions without triggers or power struggles.
                  </p>
                </div>
              </button>

              {/* Card 5: Bedtime Story */}
              <button
                onClick={() => onNavigate('stories')}
                className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-soft hover:shadow-premium hover:-translate-y-0.5 transition-all text-left flex items-start space-x-4 group sm:col-span-2"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent mb-1 block">Soothe to Sleep</span>
                  <h4 className="font-display font-bold text-slate-900 text-sm group-hover:text-accent transition-all line-clamp-1">
                    The Starry Search: {child.name} & the Cosmic {child.favoriteAnimals[0] || 'Bunny'}
                  </h4>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                    Weaves {child.name} as the key hero to quiet active minds, ending with questions to reflect on together.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 self-center group-hover:translate-x-1 transition-all" />
              </button>

            </div>
          </div>

          {/* C. Quick Action console */}
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-4">Quick AI Generators</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {quickActions.map((act, i) => {
                const Icon = act.icon;
                return (
                  <button
                    key={i}
                    onClick={() => onNavigate(act.tab)}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:scale-105 ${act.color}`}
                  >
                    <Icon className="w-5 h-5 mb-2" />
                    <span className="text-xs font-semibold leading-tight">{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (1/3 width on desktop) - History & Favorites */}
        <div className="space-y-8">
          
          {/* A. Favorites Dashboard Quick link */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-base flex items-center space-x-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Saved Favorites</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => onNavigate('favorites')}
                className="w-full px-4 py-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between text-left"
              >
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Favorite Play Activities</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{appState.favoritedActivities.length} Items Saved</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('favorites')}
                className="w-full px-4 py-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between text-left"
              >
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Saved Bedtime Stories</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{appState.favoritedStories.length} Tales Saved</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* B. Recent History panel */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-900 text-base flex items-center space-x-2">
              <History className="w-5 h-5 text-primary" />
              <span>Recent AI Generation History</span>
            </h3>

            {appState.recentHistory.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                <span>No generation logs yet. Start an activity, meal, or story to compile history.</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {appState.recentHistory.map((item, idx) => {
                  let Icon = Compass;
                  let badgeColor = 'bg-purple-50 text-primary';
                  if (item.type === 'meal') { Icon = ChefHat; badgeColor = 'bg-amber-50 text-secondary'; }
                  if (item.type === 'story') { Icon = BookOpen; badgeColor = 'bg-emerald-50 text-accent'; }
                  if (item.type === 'weekly-plan') { Icon = Calendar; badgeColor = 'bg-indigo-50 text-indigo-500'; }

                  return (
                    <button
                      key={idx}
                      onClick={() => onNavigate(item.type === 'weekly-plan' ? 'weekly' : `${item.type}s`)} // navigates back to respective tab!
                      className="w-full p-3 rounded-xl border border-slate-50 hover:border-slate-100 hover:bg-slate-50/50 transition-all flex items-center space-x-3 text-left"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${badgeColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wide block mt-0.5">{item.type}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
