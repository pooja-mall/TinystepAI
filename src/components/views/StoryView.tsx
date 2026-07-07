import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  Printer, 
  Copy, 
  Share2, 
  Star, 
  HelpCircle, 
  ArrowRight,
  Smile,
  CheckCircle,
  Inbox
} from 'lucide-react';
import { BedtimeStory, ChildProfile } from '../../types';
import { createStory } from '../../services/ai';

interface StoryViewProps {
  childProfile: ChildProfile | null;
  favoritedStories: BedtimeStory[];
  onToggleFavorite: (story: BedtimeStory) => void;
  onAddHistory: (type: 'activity' | 'meal' | 'story' | 'weekly-plan', id: string, title: string) => void;
}

const STORY_THEMES = [
  { value: 'Space Exploration', label: '🚀 Cosmic Galaxy' },
  { value: 'Magic Whispering Forest', label: '🌲 Whispering Forest' },
  { value: 'Cozy Bedroom Sleepy cloud', label: '☁️ Sleepy Clouds' },
  { value: 'Deep Secret Ocean', label: '🐙 Ocean Adventure' }
];

export default function StoryView({ childProfile, favoritedStories, onToggleFavorite, onAddHistory }: StoryViewProps) {
  const [name, setName] = useState(childProfile?.name || 'Pranooja');
  const [animal, setAnimal] = useState('');
  const [theme, setTheme] = useState('Space Exploration');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BedtimeStory | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const printAreaRef = useRef<HTMLDivElement | null>(null);

  // Default parameters from profile
  useEffect(() => {
    if (childProfile) {
      setName(childProfile.name);
      if (childProfile.favoriteAnimals.length > 0) {
        setAnimal(childProfile.favoriteAnimals[0]);
      } else {
        setAnimal('Rabbit');
      }
    } else {
      setAnimal('Rabbit');
    }
  }, [childProfile]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const story = await createStory(name, animal, theme, length);
      setResult(story);
      onAddHistory('story', story.id, `Bedtime Story: ${story.title}`);
    } catch (err) {
      console.error('Error generating story', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `
📖 TinySteps AI Bedtime Story: ${result.title} 📖
Hero: ${result.characterName} | Helper: ${result.favoriteAnimal} | Theme: ${result.theme}

${result.storyText.join('\n\n')}

✨ Story Moral:
${result.moral}

❓ Family Discussion Questions:
${result.discussionQuestions.map((q, idx) => `${idx + 1}. ${q}`).join('\n')}
    `;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  const handlePrint = () => {
    if (!result) return;
    window.print();
  };

  const isFav = result ? favoritedStories.some(s => s.id === result.id) : false;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans pb-24">
      
      {/* Print-only CSS block */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-story-area, #printable-story-area * {
            visibility: visible;
          }
          #printable-story-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* Header */}
      <div className="mb-8 no-print">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-accent text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>AI Storyteller</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          Bedtime Story Generator
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Weave enchanting bedtime fairy tales featuring your child as the main character alongside their favorite animal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
        
        {/* LEFT COLUMN: Controls Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-fit space-y-5">
          <h2 className="font-display font-bold text-lg text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Story Settings</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* Child Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Main Character Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/10 text-sm"
                placeholder="Child's name"
              />
            </div>

            {/* Favorite Animal */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Magical Animal Companion
              </label>
              <input
                type="text"
                required
                value={animal}
                onChange={(e) => setAnimal(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/10 text-sm"
                placeholder="e.g. Fox, Bear, Rabbit..."
              />
            </div>

            {/* Themes Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Adventure Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STORY_THEMES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTheme(t.value)}
                    className={`py-3 px-2 text-xs font-semibold rounded-xl border text-left transition-all ${theme === t.value ? 'bg-accent/15 border-accent text-slate-800 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Story Length */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Story Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['short', 'medium', 'long'].map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setLength(len as any)}
                    className={`py-2.5 text-xs font-semibold rounded-xl border capitalize text-center transition-all ${length === len ? 'bg-accent border-accent text-slate-900 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 px-4 bg-accent hover:bg-accent/95 text-slate-900 font-bold text-sm rounded-xl shadow-soft hover:shadow-glow flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Draft Bedtime Story</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        </div>

        {/* RIGHT COLUMN: Output Result (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          
          <AnimatePresence mode="wait">
            {loading && (
              /* Animated Loading Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center py-20 space-y-6"
              >
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg text-slate-800 animate-pulse">Drafting fantasy worlds...</h3>
                <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
                  TinySteps is writing chapters, creating moral dialogues, and drawing vector illustrations of {name} and the {animal}!
                </p>
                <div className="space-y-2 max-w-sm mx-auto pt-6 opacity-35">
                  <div className="h-4 bg-slate-100 rounded w-5/6 mx-auto shimmer" />
                  <div className="h-3 bg-slate-100 rounded w-1/2 mx-auto shimmer" />
                </div>
              </motion.div>
            )}

            {!loading && !result && (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center py-24 flex flex-col items-center justify-center h-full"
              >
                <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mb-4 border border-slate-100">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-slate-700 text-lg mb-2">No Bedtime Story Drafted</h3>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  Provide your child's favorite characters and setting, then click "Draft Bedtime Story" to render stories and custom illustrations.
                </p>
              </motion.div>
            )}

            {!loading && result && (
              /* Printable Output story card */
              <motion.div
                id="printable-story-area"
                ref={printAreaRef}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Result header banner */}
                <div className="bg-slate-900 p-6 text-white flex justify-between items-start border-b border-slate-800">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2.5 py-1 rounded-full border border-accent/10">
                      Sleepy Time Companion • {result.length} length
                    </span>
                    <h3 className="font-display font-extrabold text-xl sm:text-2xl mt-3 tracking-tight">
                      {result.title}
                    </h3>
                  </div>
                  {/* Favorite Button */}
                  <button
                    onClick={() => onToggleFavorite(result)}
                    className={`p-3 rounded-2xl transition-all shadow-md no-print ${isFav ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-rose-500'}`}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* 1. ILLUSTRATED STORY CARD PANEL */}
                {result.illustrationUrl && (
                  <div 
                    className="w-full aspect-[16/10] bg-slate-900 border-b border-slate-800 overflow-hidden flex items-center justify-center relative"
                    dangerouslySetInnerHTML={{ __html: result.illustrationUrl }}
                  />
                )}

                {/* 2. STORY PARAGRAPHS TEXT */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Readable story body */}
                  <div className="space-y-4 text-slate-700 text-sm leading-relaxed font-sans font-normal max-w-2xl mx-auto">
                    {result.storyText.map((paragraph, index) => (
                      <p key={index} className="first-letter:text-3xl first-letter:font-bold first-letter:text-primary first-letter:font-display first-letter:mr-1 first-letter:float-left">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* 3. Story Moral */}
                  <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 flex items-start space-x-3.5 max-w-2xl mx-auto">
                    <Smile className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-xs font-bold text-slate-800 mb-0.5">The Story Moral</strong>
                      <p className="text-xs text-slate-600 leading-relaxed italic">"{result.moral}"</p>
                    </div>
                  </div>

                  {/* 4. Discussion questions */}
                  <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-start space-x-3.5 max-w-2xl mx-auto">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-2.5 w-full">
                      <strong className="block text-xs font-bold text-slate-800">Family Reflection Questions</strong>
                      <ol className="space-y-2 text-xs text-slate-600 leading-relaxed">
                        {result.discussionQuestions.map((q, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="font-bold text-primary mr-1">{i + 1}.</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                </div>

                {/* Card footer copy */}
                <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-slate-100 no-print">
                  <span className="text-[10px] text-slate-400">Printed via TinySteps AI Companion</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePrint}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Download PDF / Print</span>
                    </button>
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-primary rounded-lg text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied Story!' : 'Copy Text'}</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
