import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Home, 
  Compass, 
  ChefHat, 
  BookOpen, 
  MessageSquare, 
  GraduationCap, 
  Calendar, 
  Heart, 
  Settings, 
  Baby,
  Menu,
  X,
  User
} from 'lucide-react';

// Hooks & state managers
import { useAppState } from './hooks/useAppState';

// Visual components
import Confetti from './components/Confetti';

// Core Application views
import LandingView from './components/views/LandingView';
import AuthView from './components/views/AuthView';
import OnboardingView from './components/views/OnboardingView';
import ProfileView from './components/views/ProfileView';
import DashboardView from './components/views/DashboardView';
import ActivityView from './components/views/ActivityView';
import MealView from './components/views/MealView';
import StoryView from './components/views/StoryView';
import CoachView from './components/views/CoachView';
import LearningView from './components/views/LearningView';
import WeeklyView from './components/views/WeeklyView';
import FavoritesView from './components/views/FavoritesView';
import SettingsView from './components/views/SettingsView';

export default function App() {
  const {
    state,
    darkMode,
    setDarkMode,
    login,
    logout,
    saveProfile: saveChildProfile,
    toggleFavoriteActivity,
    toggleFavoriteStory,
    addToHistory: addHistoryItem
  } = useAppState();

  const { user, childProfile, recentHistory, favoritedActivities, favoritedStories } = state;
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Simple handlers to remove favorites directly inside list toggle mappings
  const removeActivityFavorite = toggleFavoriteActivity;
  const removeStoryFavorite = toggleFavoriteStory;

  // Navigation routes: landing, login, onboarding, active (active matches tabs)
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'login' | 'onboarding' | 'active'>('landing');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Confetti trigger state
  const [confettiActive, setConfettiActive] = useState(false);

  // Auto-route to active if user is logged in
  useEffect(() => {
    if (user?.isLoggedIn) {
      if (!childProfile) {
        // If logged in but no child profile, route to profile wizard
        setCurrentScreen('active');
        setActiveTab('profile');
      } else {
        setCurrentScreen('active');
        setActiveTab('dashboard');
      }
    } else {
      setCurrentScreen('landing');
    }
  }, [user]);

  // Sync dark mode class with html node
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLoginSuccess = (name: string, email: string, isGuest: boolean) => {
    login(name, email, isGuest);
    // Route to onboarding slide deck for first-time premium feel!
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('active');
    setActiveTab('profile'); // Send them to configure child details first!
  };

  const handleLogoutSuccess = () => {
    logout();
    setCurrentScreen('landing');
    setActiveTab('dashboard');
  };

  const fireConfetti = () => {
    setConfettiActive(true);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'activity', label: 'Play Activity', icon: Compass },
    { id: 'meals', label: 'Meal Plan', icon: ChefHat },
    { id: 'stories', label: 'Storyteller', icon: BookOpen },
    { id: 'coach', label: 'Parent Coach', icon: MessageSquare },
    { id: 'learning', label: 'Milestones', icon: GraduationCap },
    { id: 'weekly', label: 'Weekly Plan', icon: Calendar },
    { id: 'favorites', label: 'Saved Library', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 relative`}>
      
      {/* 1. Confetti Canvas layer */}
      <Confetti active={confettiActive} onComplete={() => setConfettiActive(false)} />

      <AnimatePresence mode="wait">
        
        {/* Landing Screen */}
        {currentScreen === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingView 
              onStart={() => setCurrentScreen('login')} 
              onLogin={() => setCurrentScreen('login')}
            />
          </motion.div>
        )}

        {/* Login Screen */}
        {currentScreen === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AuthView 
              onLoginSuccess={handleLoginSuccess} 
              onBack={() => setCurrentScreen('landing')}
            />
          </motion.div>
        )}

        {/* Onboarding Presentation */}
        {currentScreen === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OnboardingView onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {/* Active Application (authenticated dashboard + views) */}
        {currentScreen === 'active' && user && (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans"
          >
            {/* Desktop Left Sidebar (Sleek Interface Style) */}
            <aside className="hidden lg:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col p-6 flex-shrink-0 sticky top-0 h-screen overflow-y-auto no-print">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 bg-[#6C63FF] rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 text-white flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-white block leading-none truncate">TinySteps AI</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1 block">Parent Companion</span>
                </div>
              </div>

              <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full p-3 rounded-2xl flex items-center gap-3 font-semibold text-sm transition-all ${
                        active 
                          ? 'bg-indigo-50 text-primary dark:bg-primary/20 dark:text-primary-foreground' 
                          : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-6">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="w-full flex items-center gap-3 px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {childProfile ? `${childProfile.name} • ${childProfile.age} Yrs` : 'Setup Child'}
                    </p>
                  </div>
                </button>
              </div>
            </aside>

            {/* Right Main Content Panel */}
            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
              
              {/* Header / Sticky Top Navigation */}
              <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 h-16 lg:h-20 flex items-center px-4 sm:px-6 lg:px-8">
                <div className="w-full flex items-center justify-between">
                  
                  {/* Left greeting on desktop / Brand logo on mobile */}
                  <div>
                    <div className="hidden lg:block">
                      <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white leading-tight">
                        Good Morning, {user.name} 👋
                      </h1>
                      <p className="text-xs lg:text-sm text-slate-500">
                        {childProfile ? `Here is the personalized plan for ${childProfile.name} today.` : 'Configure your child profile to receive recommendations.'}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="lg:hidden flex items-center space-x-2 text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-soft">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-display font-extrabold text-slate-900 dark:text-white tracking-tight block text-sm leading-none">TinySteps AI</span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5 block">Parent Companion</span>
                      </div>
                    </button>
                  </div>

                  {/* Right side controls */}
                  <div className="flex items-center space-x-3">
                    
                    {/* Quick Action Button matching the design mock */}
                    <button
                      onClick={() => setActiveTab('activity')}
                      className="px-4 py-2 bg-[#6C63FF] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-100 hover:shadow-glow transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Quick Action</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('profile')}
                      className="flex items-center space-x-2 text-left bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 transition-all"
                    >
                      <div className="w-6 h-6 rounded-lg bg-primary/20 text-primary dark:text-primary-foreground flex items-center justify-center">
                        <Baby className="w-3.5 h-3.5" />
                      </div>
                      <span className="hidden sm:inline text-xs font-extrabold text-slate-700 dark:text-slate-300">
                        {childProfile ? childProfile.name : 'Child Wizard'}
                      </span>
                    </button>

                    {/* Mobile Menu Toggle button */}
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                    >
                      {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                  </div>

                </div>
              </header>

            {/* Mobile Drawer Overlay */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="lg:hidden fixed inset-x-0 top-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-premium z-30 p-4"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const active = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                          className={`p-3 text-xs font-bold rounded-xl transition-all flex items-center space-x-2.5 ${active ? 'bg-primary text-white shadow-soft' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MAIN PORTAL AREA */}
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  
                  {activeTab === 'dashboard' && (
                    <DashboardView 
                      appState={{ user, childProfile, recentHistory, favoritedActivities, favoritedStories, darkMode }}
                      onNavigate={(tab) => setActiveTab(tab)}
                    />
                  )}

                  {activeTab === 'activity' && (
                    <ActivityView
                      childProfile={childProfile}
                      favoritedList={favoritedActivities}
                      onToggleFavorite={toggleFavoriteActivity}
                      onAddHistory={addHistoryItem}
                    />
                  )}

                  {activeTab === 'meals' && (
                    <MealView
                      childProfile={childProfile}
                      onAddHistory={addHistoryItem}
                    />
                  )}

                  {activeTab === 'stories' && (
                    <StoryView
                      childProfile={childProfile}
                      favoritedStories={favoritedStories}
                      onToggleFavorite={toggleFavoriteStory}
                      onAddHistory={addHistoryItem}
                    />
                  )}

                  {activeTab === 'coach' && (
                    <CoachView childProfile={childProfile} />
                  )}

                  {activeTab === 'learning' && (
                    <LearningView childProfile={childProfile} triggerConfetti={fireConfetti} />
                  )}

                  {activeTab === 'weekly' && (
                    <WeeklyView childProfile={childProfile} onAddHistory={addHistoryItem} />
                  )}

                  {activeTab === 'profile' && (
                    <ProfileView
                      currentProfile={childProfile}
                      onSave={saveChildProfile}
                      triggerConfetti={fireConfetti}
                    />
                  )}

                  {activeTab === 'favorites' && (
                    <FavoritesView
                      favoritedActivities={favoritedActivities}
                      favoritedStories={favoritedStories}
                      onRemoveActivity={removeActivityFavorite}
                      onRemoveStory={removeStoryFavorite}
                    />
                  )}

                  {activeTab === 'settings' && (
                    <SettingsView
                      appState={{ user, childProfile, recentHistory, favoritedActivities, favoritedStories, darkMode }}
                      onLogout={handleLogoutSuccess}
                      onToggleDarkMode={toggleDarkMode}
                      triggerConfetti={fireConfetti}
                    />
                  )}

                </motion.div>
              </AnimatePresence>
            </main>

             {/* Mobile Bottom Bar Navigation (Home, Play, Recipes, Stories) */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-2 flex justify-around items-center z-20 shadow-premium no-print">
              {[
                { id: 'dashboard', label: 'Home', icon: Home },
                { id: 'activity', label: 'Play', icon: Compass },
                { id: 'meals', label: 'Meals', icon: ChefHat },
                { id: 'stories', label: 'Stories', icon: BookOpen },
                { id: 'learning', label: 'Milestones', icon: GraduationCap },
              ].map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center justify-center p-2 text-slate-500 dark:text-slate-400 ${active ? 'text-primary dark:text-primary-foreground font-bold' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] mt-1">{item.label}</span>
                  </button>
                );
              })}
            </div>

            </div> {/* Close Right Main Content Panel */}

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
