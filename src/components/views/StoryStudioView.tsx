import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Bookmark,
  Copy,
  Share2,
  Download,
  Moon,
  ChevronLeft,
  ChevronRight,
  Sun,
  Maximize2,
  Minimize2,
  Info,
  Sliders,
  Award,
  Calendar,
  CloudLightning,
  Music,
  Plus,
  Compass,
  ArrowRight,
  Heart,
  Undo2
} from 'lucide-react';
import { ChildProfile, StoryStudioBook, StoryScene } from '../../types';
import { storyService } from '../../services/storyService';
import { ttsService } from '../../services/ttsService';

interface StoryStudioViewProps {
  childProfile: ChildProfile | null;
  favoritedStories: any[];
  onToggleFavorite: (story: any) => void;
  onAddHistory: (type: 'activity' | 'meal' | 'story' | 'weekly-plan', id: string, title: string) => void;
}

const STORY_THEMES = [
  { value: 'Space Exploration', label: '🚀 Space Exploration', desc: 'Sailing through stars and galaxies' },
  { value: 'Magic Whispering Forest', label: '🌲 Magic Forest', desc: 'Talking trees and glowing fireflies' },
  { value: 'Friendship & Sharing', label: '🤝 Friendship', desc: 'Cozy stories about caring for others' },
  { value: 'Animals Safari', label: '🦁 Animals Safari', desc: 'Jungle friends on sleepy trails' },
  { value: 'Deep Secret Ocean', label: '🐙 Deep Ocean', desc: 'Submarines, reefs, and sea turtles' },
  { value: 'Princess & Clouds', label: '👑 Princess Castle', desc: 'Pastel clouds and cloud-top palaces' },
  { value: 'Dinosaur Sleepover', label: '🦖 Dinosaurs Valley', desc: 'Prehistoric friends finding nightcaps' },
  { value: 'Superhero City Watch', label: '⚡ Superhero Watch', desc: 'Protecting sleep and calming the city' }
];

const BEDTIME_MOODS = [
  { value: 'Calm', label: '🌙 Calm', desc: 'Slow, peaceful vocabulary to induce sleep' },
  { value: 'Funny', label: '😄 Funny', desc: 'Wholesome giggles and cute silly situations' },
  { value: 'Educational', label: '🧠 Educational', desc: 'Gentle science or counting notes mixed in' },
  { value: 'Exciting', label: '✨ Exciting', desc: 'Wholesome adventures before cozy rest' }
];

const NARRATORS = [
  { value: 'Mom', label: '👩 Mom', desc: 'Standard sweet and reassuring voice' },
  { value: 'Dad', label: '👨 Dad', desc: 'Deeper comforting tone' },
  { value: 'Grandma', label: '👵 Grandma', desc: 'Slow, gentle, storybook-style narration' },
  { value: 'Fairy', label: '🧚 Fairy', desc: 'Magical, airy, and high-pitched tone' },
  { value: 'Robot', label: '🤖 Robot', desc: 'Playful mechanical speech synthesizer' },
  { value: 'Lion', label: '🦁 Lion', desc: 'Deep, sleepy, rumbling growls' }
];

const BACKGROUND_SOUNDS = [
  { id: 'rain', label: '🌧️ Gentle Rain' },
  { id: 'ocean', label: '🌊 Ocean Waves' },
  { id: 'lullaby', label: '🎵 Music Box Lullaby' },
  { id: 'soft piano', label: '🎹 Soft Piano' },
  { id: 'forest', label: '🦗 Night Crickets' }
];

export default function StoryStudioView({
  childProfile,
  favoritedStories,
  onToggleFavorite,
  onAddHistory
}: StoryStudioViewProps) {
  // 1. App state setup
  const [activeViewTab, setActiveViewTab] = useState<'generate' | 'library' | 'recent'>('generate');
  const [selectedTheme, setSelectedTheme] = useState('Space Exploration');
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [selectedLength, setSelectedLength] = useState<'2 min' | '5 min' | '10 min'>('5 min');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Telugu'>('English');
  const [selectedNarrator, setSelectedNarrator] = useState('Mom');

  // Story generation & book state
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [activeBook, setActiveBook] = useState<StoryStudioBook | null>(null);
  const [savedBooks, setSavedBooks] = useState<StoryStudioBook[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Read Mode settings
  const [readDarkMode, setReadDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<'base' | 'lg' | 'xl' | '2xl'>('lg');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);

  // Listen Mode / Audio states
  const [isListenMode, setIsListenMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [narrationProgress, setNarrationProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [narrationVolume, setNarrationVolume] = useState<number>(0.8);
  const [musicVolume, setMusicVolume] = useState<number>(0.3);
  const [bgSound, setBgSound] = useState<string | null>(null);
  const [voiceErrorMessage, setVoiceErrorMessage] = useState<string | null>(null);

  // Bedtime Mode State
  const [isBedtimeMode, setIsBedtimeMode] = useState(false);

  // Print references
  const printRef = useRef<HTMLDivElement | null>(null);

  // Load saved studio books on mount
  useEffect(() => {
    const local = localStorage.getItem('tinysteps_story_studio_books');
    if (local) {
      try {
        setSavedBooks(JSON.parse(local));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Sync volume controls with ttsService
  useEffect(() => {
    ttsService.setNarrationVolume(narrationVolume);
  }, [narrationVolume]);

  useEffect(() => {
    ttsService.setMusicVolume(musicVolume);
  }, [musicVolume]);

  // Handle ambient background sounds
  useEffect(() => {
    if (bgSound) {
      ttsService.playBackgroundSound(bgSound);
    } else {
      ttsService.stopBackgroundSound();
    }
    return () => {
      ttsService.stopBackgroundSound();
    };
  }, [bgSound]);

  // Clean stop of TTS on unmount or tab switch
  useEffect(() => {
    return () => {
      ttsService.stop();
    };
  }, []);

  // Auto-sync story page turning with TTS progress in Bedtime Mode
  const speakCurrentPage = (pageIndex: number) => {
    if (!activeBook) return;
    const scene = activeBook.scenes[pageIndex];
    if (!scene) return;

    setIsPlaying(true);
    setNarrationProgress(0);
    setVoiceErrorMessage(null);

    ttsService.speak(scene.paragraph, activeBook.narrator, playbackSpeed, activeBook.language, {
      onStart: () => {
        setIsPlaying(true);
        setVoiceErrorMessage(null);
      },
      onProgress: (prog) => {
        setNarrationProgress(prog);
      },
      onEnd: () => {
        // If there's a next page and Bedtime Mode is active, automatically flip and speak!
        if (pageIndex < activeBook.scenes.length - 1) {
          setTimeout(() => {
            setCurrentPageIndex(pageIndex + 1);
            speakCurrentPage(pageIndex + 1);
          }, 1500); // Wait 1.5s between pages for deep relaxing silence
        } else {
          // Reached the end! Fade background music and say good night
          setIsPlaying(false);
          setNarrationProgress(100);
          // Gradually reduce music volume
          let vol = musicVolume;
          const interval = setInterval(() => {
            vol -= 0.05;
            if (vol <= 0) {
              clearInterval(interval);
              setBgSound(null);
            } else {
              ttsService.setMusicVolume(vol);
            }
          }, 300);
        }
      },
      onError: (err) => {
        console.warn(err);
        setIsPlaying(false);
        if (typeof err === 'string') {
          setVoiceErrorMessage(err);
        } else if (err && err.message) {
          setVoiceErrorMessage(err.message);
        } else {
          setVoiceErrorMessage('Narrating failed on this device.');
        }
      }
    });
  };

  // 2. Play/Pause Narration toggles
  const handlePlayPause = () => {
    if (!activeBook) return;

    if (isPlaying) {
      ttsService.stop();
      setIsPlaying(false);
    } else {
      speakCurrentPage(currentPageIndex);
    }
  };

  const handleReplay = () => {
    speakCurrentPage(currentPageIndex);
  };

  // Helper trigger to handle manual page swaps safely
  const handlePageSwap = (newIndex: number) => {
    if (!activeBook) return;
    if (newIndex >= 0 && newIndex < activeBook.scenes.length) {
      ttsService.stop();
      setIsPlaying(false);
      setNarrationProgress(0);
      setVoiceErrorMessage(null);
      setCurrentPageIndex(newIndex);
      
      // If narration was playing, resume speaking the new page
      if (isPlaying || isBedtimeMode) {
        setTimeout(() => {
          speakCurrentPage(newIndex);
        }, 300);
      }
    }
  };

  // Trigger Story generation
  const handleGenerateStory = async () => {
    setLoading(true);
    ttsService.stop();
    setIsPlaying(false);
    
    const phases = [
      'Stitching stardust and night clouds...',
      'Whispering bedtime secrets to the moon...',
      'Crafting custom high-contrast illustrations...',
      'Tuning narration frequencies for relaxing sleep...',
      'Completing personalized Bedtime Storybook!'
    ];

    let phaseIdx = 0;
    setLoadingPhase(phases[0]);
    const phaseInterval = setInterval(() => {
      phaseIdx++;
      if (phaseIdx < phases.length) {
        setLoadingPhase(phases[phaseIdx]);
      }
    }, 450);

    try {
      const book = await storyService.generateStoryBook(
        childProfile,
        selectedTheme,
        selectedMood,
        selectedLength,
        selectedLanguage,
        selectedNarrator
      );

      // Save to recent list
      const updated = [book, ...savedBooks].slice(0, 20); // Keep last 20 books
      setSavedBooks(updated);
      localStorage.setItem('tinysteps_story_studio_books', JSON.stringify(updated));

      setActiveBook(book);
      setCurrentPageIndex(0);
      setNarrationProgress(0);
      setIsListenMode(false);
      setIsPlaying(false);
      
      // Add item to global recent history
      onAddHistory('story', book.id, `✨ Story Studio: ${book.title}`);

    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(phaseInterval);
      setLoading(false);
    }
  };

  // Copy book text helper
  const handleCopyBook = () => {
    if (!activeBook) return;
    const allText = activeBook.scenes.map(s => `Page ${s.pageNumber}: ${s.paragraph}`).join('\n\n');
    const copiedText = `✨ Story Studio: ${activeBook.title} ✨\n\n${allText}\n\n Moral: ${activeBook.moral}`;
    navigator.clipboard.writeText(copiedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Download narration WAV file
  const handleDownloadAudio = () => {
    if (!activeBook) return;
    const { blobUrl, filename } = ttsService.downloadNarrationAudio(activeBook.title);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print PDF of book
  const handlePrintPDF = () => {
    window.print();
  };

  // Toggle Bookmark
  const handleToggleBookmark = (id: string) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(i => i !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  // Activate Bedtime Mode!
  const triggerBedtimeMode = (activate: boolean) => {
    setIsBedtimeMode(activate);
    if (activate) {
      setReadDarkMode(true);
      setBgSound('lullaby');
      // Automatically begin speaking page 1
      setTimeout(() => {
        speakCurrentPage(currentPageIndex);
      }, 1000);
    } else {
      ttsService.stop();
      setIsPlaying(false);
      setBgSound(null);
    }
  };

  return (
    <div className={`p-4 md:p-8 max-w-7xl mx-auto pb-24 relative ${readDarkMode ? 'dark bg-slate-950 text-slate-100' : 'text-slate-800 bg-[#F8FAFC]'}`}>
      
      {/* 1. Header with Title & Sparkle branding */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-white bg-indigo-600 rounded-full uppercase">Premium flagship</span>
            <div className="flex items-center text-amber-500 font-bold text-xs gap-1">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Story Studio</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            ✨ Bedtime Story Studio
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-1.5">
            Generate, read, and listen to immersive, fully personalized stories tailored specifically for {childProfile?.name || 'Pranooja'}. Let the moon and stars guide them into a tranquil rest.
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl shadow-soft">
          <button
            onClick={() => { setActiveViewTab('generate'); setActiveBook(null); }}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${activeViewTab === 'generate' && !activeBook ? 'bg-[#6C63FF] text-white shadow-soft' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Create Magic
          </button>
          <button
            onClick={() => { setActiveViewTab('recent'); }}
            className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all ${activeViewTab === 'recent' ? 'bg-[#6C63FF] text-white shadow-soft' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Story History
          </button>
        </div>
      </div>

      {/* 2. Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md"
          >
            <div className="relative w-32 h-32 mb-8">
              {/* Spinning star portal */}
              <div className="absolute inset-0 border-4 border-dashed border-indigo-500 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
              <div className="absolute inset-2 border-4 border-dashed border-purple-500 rounded-full animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
              <div className="absolute inset-4 border-4 border-dashed border-pink-500 rounded-full animate-spin" style={{ animationDuration: '4s' }} />
              
              {/* Center magic book */}
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <BookOpen className="w-12 h-12 animate-pulse text-amber-300" />
              </div>
            </div>
            
            <motion.h2
              key={loadingPhase}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              className="text-xl md:text-2xl font-bold font-display text-white max-w-md tracking-tight"
            >
              {loadingPhase}
            </motion.h2>
            <p className="text-xs text-slate-400 mt-3 animate-pulse">
              Fusing child's favorite colors & animals into a multi-page bedtime scene...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Dashboard layout split */}
      {!activeBook && activeViewTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
          
          {/* Generation form (7 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-premium">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950 rounded-2xl flex items-center justify-center text-[#6C63FF]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">AI Bedtime Customizer</h3>
                <p className="text-xs text-slate-400">Configure parameters for {childProfile?.name || 'Pranooja'}'s adventure</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Automatic Profile Load card */}
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-tr from-[#6C63FF] to-indigo-400 rounded-xl flex items-center justify-center font-bold text-white text-sm">
                    {childProfile?.name ? childProfile.name.slice(0, 2).toUpperCase() : 'PR'}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6C63FF] block leading-none mb-1">AUTOMATIC PROFILE</span>
                    <span className="font-extrabold text-sm text-slate-800 dark:text-white">
                      {childProfile?.name || 'Pranooja'} ({childProfile?.age || '2.7'} Yrs, {childProfile?.gender || 'Girl'})
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400 hidden sm:block">
                  <p>Fav Animal: <span className="font-bold text-slate-700 dark:text-slate-300">{childProfile?.favoriteAnimals?.[0] || 'Kitten'}</span></p>
                  <p>Fav Color: <span className="font-bold text-slate-700 dark:text-slate-300">{childProfile?.favoriteColors?.[0] || 'Yellow'}</span></p>
                </div>
              </div>

              {/* Theme Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2.5">
                  Story Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STORY_THEMES.map((theme) => {
                    const selected = selectedTheme === theme.value;
                    return (
                      <button
                        key={theme.value}
                        onClick={() => setSelectedTheme(theme.value)}
                        className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between h-24 ${selected ? 'border-[#6C63FF] bg-indigo-50/20 dark:bg-indigo-950/20 ring-2 ring-[#6C63FF]/30' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50/50'}`}
                      >
                        <span className="text-sm font-bold block truncate">{theme.label}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-2 leading-snug">{theme.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bedtime Mood */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2.5">
                    Bedtime Mood
                  </label>
                  <div className="space-y-2">
                    {BEDTIME_MOODS.map((mood) => {
                      const selected = selectedMood === mood.value;
                      return (
                        <button
                          key={mood.value}
                          onClick={() => setSelectedMood(mood.value)}
                          className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${selected ? 'border-[#6C63FF] bg-indigo-50/20 dark:bg-indigo-950/20' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50/50'}`}
                        >
                          <div>
                            <span className="text-sm font-bold block leading-none mb-1">{mood.label}</span>
                            <span className="text-[10px] text-slate-400">{mood.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Narrator Style */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2.5">
                    Narrator Voice Voice
                  </label>
                  <div className="space-y-2">
                    {NARRATORS.map((nar) => {
                      const selected = selectedNarrator === nar.value;
                      return (
                        <button
                          key={nar.value}
                          onClick={() => setSelectedNarrator(nar.value)}
                          className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${selected ? 'border-[#6C63FF] bg-indigo-50/20 dark:bg-indigo-950/20' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50/50'}`}
                        >
                          <div>
                            <span className="text-sm font-bold block leading-none mb-1">{nar.label}</span>
                            <span className="text-[10px] text-slate-400">{nar.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                {/* Length Selector */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2.5">
                    Reading Length
                  </label>
                  <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    {['2 min', '5 min', '10 min'].map((len) => (
                      <button
                        key={len}
                        onClick={() => setSelectedLength(len as any)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${selectedLength === len ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-soft' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Selector */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2.5">
                    Story Language
                  </label>
                  <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    {['English', 'Hindi', 'Telugu'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang as any)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${selectedLanguage === lang ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-soft' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Help Indicator */}
                <div className="flex flex-col justify-end">
                  <div className="bg-[#6C63FF]/5 text-[#6C63FF] border border-[#6C63FF]/10 rounded-2xl p-3 flex items-start gap-2 text-[10px] leading-relaxed">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Using standard speechSynthesis for native web voice output. Synchronized highlighting will activate!</span>
                  </div>
                </div>
              </div>

              {/* Generate Trigger */}
              <button
                onClick={handleGenerateStory}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 via-[#6C63FF] to-[#6C63FF] text-white rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:shadow-glow hover:scale-[1.01] transition-all cursor-pointer mt-4"
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>Generate Sleepy Storybook 🌙</span>
              </button>
            </div>
          </div>

          {/* Prompt/Info Guide (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-premium">
              {/* Star trail background */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-full" />
              
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-4">
                <Moon className="w-4 h-4 fill-current" />
                <span>Bedtime Guide</span>
              </div>
              <h4 className="text-xl font-bold font-display tracking-tight mb-2">How to build peaceful evenings</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                TinySteps Story Studio is optimized to trigger natural melatonin production. Set the mood by using our filtered background sounds and enable Bedtime Mode to dim the blue light.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-slate-800 rounded-lg flex items-center justify-center text-xs text-indigo-400">1</div>
                  <span className="text-xs text-slate-300">Set room lighting to a warm yellow hue</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-slate-800 rounded-lg flex items-center justify-center text-xs text-indigo-400">2</div>
                  <span className="text-xs text-slate-300">Play "Gentle Rain" or "Lullaby" in background</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-slate-800 rounded-lg flex items-center justify-center text-xs text-indigo-400">3</div>
                  <span className="text-xs text-slate-300">Activate Bedtime fullscreen mode</span>
                </div>
              </div>
            </div>

            {/* Quick stats / saved count */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
              <h5 className="font-extrabold text-sm text-slate-800 dark:text-white mb-4">Your Sleeping Stats</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold">STORIES CREATED</span>
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{savedBooks.length}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-bold">NARRATORS LOADED</span>
                  <span className="text-xl font-black text-amber-500">6 Voices</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Stories library view / History tab */}
      {activeViewTab === 'recent' && !activeBook && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-premium no-print">
          <h3 className="font-extrabold text-xl text-slate-800 dark:text-white mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <span>Storybook History</span>
          </h3>
          <p className="text-xs text-slate-400 mb-6">Continue reading from previously generated studio masterpieces</p>

          {savedBooks.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No stories generated yet</p>
              <p className="text-xs text-slate-400 mt-1 mb-6">Personalize your child profile and trigger your very first bedtime book!</p>
              <button
                onClick={() => setActiveViewTab('generate')}
                className="px-6 py-2.5 bg-[#6C63FF] text-white rounded-xl text-xs font-bold hover:shadow-glow transition-all"
              >
                Go to Creator Form
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedBooks.map((book) => (
                <div
                  key={book.id}
                  className="border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-5 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all flex flex-col h-[320px] justify-between relative group"
                >
                  <div className="absolute top-4 right-4 z-10 flex gap-1">
                    <button
                      onClick={() => handleToggleBookmark(book.id)}
                      className="p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full shadow-soft transition-all"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(book.id) ? 'text-amber-500 fill-current' : 'text-slate-400'}`} />
                    </button>
                  </div>

                  <div>
                    {/* Tiny visual representation card */}
                    <div className="h-28 bg-white dark:bg-slate-900 rounded-xl mb-4 border border-slate-100 dark:border-slate-800 overflow-hidden flex items-center justify-center p-2 relative">
                      <div className="absolute inset-0 opacity-40 scale-105" dangerouslySetInnerHTML={{ __html: book.coverSvg }} />
                      <div className="relative text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-950 shadow-soft">
                        {book.theme}
                      </div>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-800 dark:text-white line-clamp-1 mb-1">{book.title}</h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span>Mood: <strong className="text-slate-600 dark:text-slate-300">{book.mood}</strong></span>
                      <span>•</span>
                      <span>Length: <strong className="text-slate-600 dark:text-slate-300">{book.length}</strong></span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                    <span className="text-[10px] text-slate-400">{new Date(book.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => { setActiveBook(book); setCurrentPageIndex(0); }}
                      className="px-4 py-2 bg-[#6C63FF] hover:bg-indigo-600 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-soft hover:shadow-glow transition-all"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. ACTIVE STORY READING PORTAL */}
      {activeBook && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative no-print">
          
          {/* Main Book Reader Panel (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-premium flex flex-col justify-between min-h-[550px]">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveBook(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Creator Studio</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Font Size controls */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setFontSize('base')}
                    className={`px-2 py-1 text-xs font-bold rounded-md ${fontSize === 'base' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white' : 'text-slate-400'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('lg')}
                    className={`px-2 py-1 text-sm font-bold rounded-md ${fontSize === 'lg' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white' : 'text-slate-400'}`}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize('xl')}
                    className={`px-2 py-1 text-base font-bold rounded-md ${fontSize === 'xl' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white' : 'text-slate-400'}`}
                  >
                    A++
                  </button>
                </div>

                {/* Local dark mode toggle */}
                <button
                  onClick={() => setReadDarkMode(!readDarkMode)}
                  className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl transition-all"
                >
                  {readDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Storybook Body Frame with custom page flips */}
            <div className="flex-grow flex flex-col justify-center py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPageIndex}
                  initial={{ opacity: 0, scale: 0.98, rotateY: 10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 1.02, rotateY: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                  {/* Dynamic Inline Vector Illustration (left col) */}
                  <div className="aspect-video md:aspect-[4/3] bg-slate-100 dark:bg-slate-950/40 rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-slate-100 dark:border-slate-800/80 shadow-inner relative group min-h-[220px]">
                    <div 
                      className="w-full h-full object-contain" 
                      dangerouslySetInnerHTML={{ __html: activeBook.scenes[currentPageIndex].illustrationSvg }} 
                    />
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-soft backdrop-blur-sm">
                      Scene {currentPageIndex + 1} of {activeBook.scenes.length}
                    </div>
                  </div>

                  {/* Narration Text Content Frame (right col) */}
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 mb-3 text-amber-500">
                      <Sparkles className="w-4 h-4 animate-pulse fill-current" />
                      <span className="text-[10px] font-extrabold uppercase tracking-widest">{activeBook.theme}</span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-black font-display text-slate-800 dark:text-white mb-4 leading-tight">
                      {activeBook.title}
                    </h2>

                    {/* Speech highlights container */}
                    <p className={`leading-relaxed tracking-tight select-none transition-all ${
                      fontSize === 'base' ? 'text-sm' :
                      fontSize === 'lg' ? 'text-base' :
                      fontSize === 'xl' ? 'text-lg' : 'text-xl'
                    } ${
                      isPlaying 
                        ? 'text-indigo-600 dark:text-indigo-300 font-medium scale-[1.005]' 
                        : 'text-slate-600 dark:text-slate-300'
                    }`}>
                      {activeBook.scenes[currentPageIndex].paragraph}
                    </p>

                    {/* Progress tracking indicator */}
                    {isPlaying && (
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-6 border border-slate-100 dark:border-slate-850">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-[#6C63FF] h-full rounded-full transition-all"
                          style={{ width: `${narrationProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Custom Interactive Navigation Row */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6 mt-8">
              <button
                disabled={currentPageIndex === 0}
                onClick={() => handlePageSwap(currentPageIndex - 1)}
                className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl transition-all border border-slate-100 dark:border-slate-800"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>

              {/* Progress markers */}
              <div className="flex gap-1.5">
                {activeBook.scenes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageSwap(idx)}
                    className={`h-2.5 rounded-full transition-all ${currentPageIndex === idx ? 'w-8 bg-[#6C63FF]' : 'w-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}
                  />
                ))}
              </div>

              <button
                disabled={currentPageIndex === activeBook.scenes.length - 1}
                onClick={() => handlePageSwap(currentPageIndex + 1)}
                className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl transition-all border border-slate-100 dark:border-slate-800"
              >
                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>

          </div>

          {/* Interactive Player Controls Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Interactive listen panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black uppercase tracking-wider text-[#6C63FF]">🎙 Narration Station</span>
                <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                  Narrator: {activeBook.narrator}
                </span>
              </div>

              <div className="flex flex-col items-center py-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850 mb-4">
                {voiceErrorMessage ? (
                  <div className="px-4 py-3 mx-4 mb-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 rounded-xl text-center text-xs font-bold leading-relaxed flex items-center justify-center gap-2">
                    <span className="animate-bounce">⚠️</span>
                    <span>{voiceErrorMessage}</span>
                  </div>
                ) : (
                  /* Visualizer wave pulse */
                  <div className="flex items-end justify-center gap-1.5 h-10 mb-4 px-6 w-full">
                    {[...Array(9)].map((_, i) => {
                      const active = isPlaying;
                      return (
                        <div
                          key={i}
                          className={`w-1.5 bg-[#6C63FF] rounded-full transition-all ${active ? 'animate-pulse' : 'h-2 opacity-50'}`}
                          style={{
                            height: active ? `${Math.sin(i * 1.5) * 20 + 24}px` : '6px',
                            animationDelay: `${i * 0.15}s`,
                            animationDuration: '1.2s'
                          }}
                        />
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReplay}
                    className="p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full shadow-soft transition-all"
                    title="Replay page"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handlePlayPause}
                    className="p-5 bg-[#6C63FF] hover:bg-indigo-600 text-white rounded-full shadow-md hover:shadow-glow transition-all"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current translate-x-0.5" />}
                  </button>

                  <button
                    disabled={currentPageIndex === activeBook.scenes.length - 1}
                    onClick={() => handlePageSwap(currentPageIndex + 1)}
                    className="p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-40 rounded-full shadow-soft transition-all"
                    title="Skip Page"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Narrator Speed adjustment */}
                <div className="flex items-center gap-2 mt-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-3 py-1 rounded-xl shadow-soft">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Speed:</span>
                  {[0.8, 1.0, 1.2].map((sp) => (
                    <button
                      key={sp}
                      onClick={() => setPlaybackSpeed(sp)}
                      className={`px-1.5 py-0.5 text-[10px] font-black rounded ${playbackSpeed === sp ? 'bg-[#6C63FF] text-white' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {sp}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume sliders & controls */}
              <div className="space-y-4 py-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-[#6C63FF]" />
                      <span>Narration Volume</span>
                    </span>
                    <span className="text-[10px] font-extrabold text-[#6C63FF]">{Math.floor(narrationVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={narrationVolume}
                    onChange={(e) => setNarrationVolume(parseFloat(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Music className="w-3 h-3 text-amber-500" />
                      <span>Background Ambient Volume</span>
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-500">{Math.floor(musicVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={musicVolume}
                    disabled={!bgSound}
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 disabled:opacity-30"
                  />
                </div>
              </div>

              {/* Background ambient noise mixer buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Ambient Mixer</span>
                <div className="flex flex-wrap gap-1.5">
                  {BACKGROUND_SOUNDS.map((sound) => {
                    const active = bgSound === sound.id;
                    return (
                      <button
                        key={sound.id}
                        onClick={() => setBgSound(active ? null : sound.id)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition-all border ${active ? 'bg-amber-500 border-amber-600 text-white shadow-soft' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-850 text-slate-500 hover:border-slate-300'}`}
                      >
                        {sound.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Download Narration triggers */}
              <button
                onClick={handleDownloadAudio}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-extrabold flex items-center justify-center gap-1.5 shadow-soft transition-all mt-4 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Audio Narration (WAV)</span>
              </button>
            </div>

            {/* Premium Bedtime Launcher Banner */}
            <div className="bg-gradient-to-tr from-indigo-900 to-slate-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-premium">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#6C63FF]/20 rounded-full blur-xl" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-pink-500/10 rounded-full blur-xl" />
              
              <div className="relative">
                <div className="flex items-center gap-1 text-indigo-300 font-bold text-[10px] uppercase tracking-wider mb-2">
                  <Moon className="w-3.5 h-3.5 fill-current text-amber-300" />
                  <span>Signature Experience</span>
                </div>
                <h4 className="text-lg font-bold font-display tracking-tight mb-1.5">Launch Bedtime Mode</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                  Transform TinySteps into a starry, stardust-dusted night canopy. Automatically reads pages, flips scenes, and plays relaxing lullabies.
                </p>

                <button
                  onClick={() => triggerBedtimeMode(true)}
                  className="w-full py-3 bg-[#6C63FF] hover:bg-indigo-600 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md hover:shadow-glow transition-all"
                >
                  <Moon className="w-4 h-4 fill-current" />
                  <span>Enter Bedtime Mode 🌙</span>
                </button>
              </div>
            </div>

            {/* Read mode functional tool belt */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-premium">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-3">Reader Toolbox</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleToggleBookmark(activeBook.id)}
                  className="p-3 bg-slate-50 dark:bg-slate-950 text-xs font-bold rounded-xl border border-slate-100 dark:border-slate-850 hover:border-indigo-100 transition-all flex items-center justify-center gap-1.5"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(activeBook.id) ? 'text-amber-500 fill-current' : ''}`} />
                  <span>{bookmarkedIds.includes(activeBook.id) ? 'Bookmarked' : 'Bookmark'}</span>
                </button>

                <button
                  onClick={handleCopyBook}
                  className="p-3 bg-slate-50 dark:bg-slate-950 text-xs font-bold rounded-xl border border-slate-100 dark:border-slate-850 hover:border-indigo-100 transition-all flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isCopied ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsShared(true);
                    setTimeout(() => setIsShared(false), 2000);
                  }}
                  className="p-3 bg-slate-50 dark:bg-slate-950 text-xs font-bold rounded-xl border border-slate-100 dark:border-slate-850 hover:border-indigo-100 transition-all flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isShared ? 'Link Copied!' : 'Share Story'}</span>
                </button>

                <button
                  onClick={handlePrintPDF}
                  className="p-3 bg-slate-50 dark:bg-slate-950 text-xs font-bold rounded-xl border border-slate-100 dark:border-slate-850 hover:border-indigo-100 transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

          </div>

          {/* Section 8: DISCUSSION QUESTIONS & Section 9: OFFLINE ACTIVITIES (Rendered in single row at bottom) */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 border-t border-slate-200 dark:border-slate-800 pt-8">
            {/* Discussions */}
            <div className="bg-amber-50/20 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-3xl p-6 shadow-premium">
              <h4 className="font-extrabold text-lg text-slate-800 dark:text-white mb-1.5 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                <span>Discussion Starters</span>
              </h4>
              <p className="text-xs text-slate-400 mb-4">Engage {childProfile?.name || 'Pranooja'} with these cognitive reflection prompts:</p>
              <ul className="space-y-3">
                {activeBook.discussionQuestions.map((q, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-sm text-slate-600 dark:text-slate-300">
                    <span className="w-5 h-5 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activities */}
            <div className="bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/30 rounded-3xl p-6 shadow-premium">
              <h4 className="font-extrabold text-lg text-slate-800 dark:text-white mb-1.5 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                <span>Offline Sleepy Activities</span>
              </h4>
              <p className="text-xs text-slate-400 mb-4">Calming tactile activities to reinforce the story moral:</p>
              <ul className="space-y-3">
                {activeBook.offlineActivities.map((act, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-sm text-slate-600 dark:text-slate-300">
                    <span className="w-5 h-5 bg-indigo-500/10 text-[#6C63FF] rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* =========================================
          SECTION 7: BEDTIME MODE PORTAL OVERLAY
          ========================================= */}
      <AnimatePresence>
        {isBedtimeMode && activeBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-b from-[#060814] via-[#0D132D] to-[#131B4B] text-white flex flex-col justify-between overflow-hidden"
          >
            {/* Stars background canopy */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute top-28 right-32 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDuration: '4s' }} />
              <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '5s' }} />
              <div className="absolute top-1/2 right-12 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDuration: '6s' }} />
              <div className="absolute bottom-20 left-16 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute bottom-36 right-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '4s' }} />
            </div>

            {/* Drifting Clouds canopy */}
            <div className="absolute inset-x-0 bottom-0 pointer-events-none opacity-10 h-1/3 bg-gradient-to-t from-white to-transparent" />

            {/* Moon Graphic (slowly rotating/floating) */}
            <div className="absolute top-10 right-10 md:top-16 md:right-16 pointer-events-none opacity-40 animate-pulse">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-yellow-200/20 rounded-full blur-md absolute inset-0" />
              <div className="w-16 h-16 md:w-24 md:h-24 bg-yellow-100 rounded-full flex items-center justify-center font-bold text-slate-800 text-lg relative">
                🌙
              </div>
            </div>

            {/* Top Close bar */}
            <div className="flex items-center justify-between p-6 z-10">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
                <span className="text-xs font-black tracking-widest text-amber-200 uppercase">Bedtime Sanctuary</span>
              </div>

              <button
                onClick={() => triggerBedtimeMode(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-xs font-bold text-white transition-all flex items-center gap-1.5 backdrop-blur-sm shadow-soft cursor-pointer"
              >
                <Undo2 className="w-4 h-4" />
                <span>Exit Sanctuary</span>
              </button>
            </div>

            {/* Book & Core Content Canopy (Center) */}
            <div className="flex-grow flex flex-col justify-center items-center px-6 md:px-12 z-10 max-w-4xl mx-auto w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPageIndex}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="w-full flex flex-col items-center text-center"
                >
                  {/* Scene SVG Illustration Frame (glowing circular mask) */}
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-amber-300/30 shadow-glow relative mb-8 flex items-center justify-center p-2 bg-slate-900/60 backdrop-blur-sm">
                    <div 
                      className="w-full h-full object-contain" 
                      dangerouslySetInnerHTML={{ __html: activeBook.scenes[currentPageIndex].illustrationSvg }} 
                    />
                  </div>

                  <span className="text-[10px] font-black tracking-widest uppercase text-amber-300 mb-2">
                    Scene {currentPageIndex + 1} of {activeBook.scenes.length}
                  </span>

                  <h3 className="text-2xl md:text-3xl font-black font-display text-white max-w-2xl mb-6 leading-tight">
                    {activeBook.title}
                  </h3>

                  {/* Paragraph highlight - premium fade */}
                  <p className="text-base md:text-xl text-indigo-100 max-w-3xl leading-relaxed font-sans px-4">
                    {activeBook.scenes[currentPageIndex].paragraph}
                  </p>

                  {/* Highlight bar synced with spoken timeline */}
                  <div className="w-48 bg-white/10 h-1 rounded-full overflow-hidden mt-8 border border-white/5">
                    <div 
                      className="bg-amber-400 h-full rounded-full transition-all"
                      style={{ width: `${narrationProgress}%` }}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Controls / Sleeping Blessing */}
            <div className="p-8 z-10 flex flex-col items-center gap-4 bg-gradient-to-t from-slate-950/80 to-transparent pt-12 w-full">
              
              <div className="flex items-center gap-4">
                <button
                  disabled={currentPageIndex === 0}
                  onClick={() => handlePageSwap(currentPageIndex - 1)}
                  className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-2xl transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="p-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-full shadow-lg hover:shadow-glow transition-all"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
                </button>

                <button
                  disabled={currentPageIndex === activeBook.scenes.length - 1}
                  onClick={() => handlePageSwap(currentPageIndex + 1)}
                  className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-2xl transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Sleeping Quote */}
              <p className="text-xs font-medium text-slate-400 italic font-display mt-2 max-w-md text-center">
                {activeBook.quote}
              </p>

              {/* End of story full canopy screen */}
              {currentPageIndex === activeBook.scenes.length - 1 && narrationProgress >= 99 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-slate-950/98 z-20 flex flex-col items-center justify-center text-center p-6"
                >
                  <span className="text-6xl mb-6">🌙</span>
                  <h3 className="text-3xl font-black font-display text-amber-300 mb-2 animate-pulse">Good Night, {childProfile?.name || 'Pranooja'}</h3>
                  <p className="text-base text-indigo-100 max-w-md mb-8 leading-relaxed">
                    Sweet Dreams. See you tomorrow for another adventure.
                  </p>
                  <button
                    onClick={() => triggerBedtimeMode(false)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-xs font-bold text-white transition-all shadow-soft"
                  >
                    Wake Sanctuary
                  </button>
                </motion.div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
