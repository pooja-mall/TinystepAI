import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Compass, 
  BookOpen, 
  Clock, 
  Trash2, 
  ChevronRight, 
  X, 
  Printer, 
  Copy,
  AlertTriangle,
  GraduationCap
} from 'lucide-react';
import { ActivityItem, BedtimeStory } from '../../types';

interface FavoritesViewProps {
  favoritedActivities: ActivityItem[];
  favoritedStories: BedtimeStory[];
  onRemoveActivity: (activity: ActivityItem) => void;
  onRemoveStory: (story: BedtimeStory) => void;
}

export default function FavoritesView({ 
  favoritedActivities, 
  favoritedStories, 
  onRemoveActivity, 
  onRemoveStory 
}: FavoritesViewProps) {
  const [activeTab, setActiveTab] = useState<'activities' | 'stories'>('activities');
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [selectedStory, setSelectedStory] = useState<BedtimeStory | null>(null);

  const [copied, setCopied] = useState(false);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans pb-24">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-500 text-xs font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Parent Library</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          Saved Library Favorites
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Review, print, or reread your saved personalized play activities and bedtime stories anytime.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex space-x-2 border-b border-slate-100 pb-3 mb-6">
        <button
          onClick={() => { setActiveTab('activities'); setSelectedActivity(null); setSelectedStory(null); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 ${activeTab === 'activities' ? 'bg-primary border-primary text-white shadow-soft' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
        >
          <Compass className="w-4 h-4" />
          <span>Activities ({favoritedActivities.length})</span>
        </button>
        <button
          onClick={() => { setActiveTab('stories'); setSelectedActivity(null); setSelectedStory(null); }}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 ${activeTab === 'stories' ? 'bg-emerald-500 border-emerald-500 text-white shadow-soft' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bedtime Stories ({favoritedStories.length})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: List pane (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          
          {activeTab === 'activities' ? (
            /* Activities list */
            favoritedActivities.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-premium text-center py-16 text-slate-400 text-xs">
                <Heart className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <span>No saved activities yet. Click the star on any activity sheet to add.</span>
              </div>
            ) : (
              favoritedActivities.map((item) => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-left relative ${selectedActivity?.id === item.id ? 'bg-primary/5 border-primary/20' : 'bg-white border-slate-100 hover:border-slate-200 shadow-soft'}`}
                >
                  <button
                    onClick={() => { setSelectedActivity(item); setSelectedStory(null); }}
                    className="flex-grow min-w-0 pr-4"
                  >
                    <h3 className="text-xs font-bold text-slate-800 truncate">{item.title}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">{item.estimatedTime} • {item.ageRange}</span>
                  </button>
                  <button
                    onClick={() => onRemoveActivity(item)}
                    className="text-slate-300 hover:text-rose-500 transition-all p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )
          ) : (
            /* Stories list */
            favoritedStories.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-premium text-center py-16 text-slate-400 text-xs">
                <Heart className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <span>No saved bedtime stories yet. Click the star on any story to save.</span>
              </div>
            ) : (
              favoritedStories.map((item) => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-left relative ${selectedStory?.id === item.id ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-100 hover:border-slate-200 shadow-soft'}`}
                >
                  <button
                    onClick={() => { setSelectedStory(item); setSelectedActivity(null); }}
                    className="flex-grow min-w-0 pr-4"
                  >
                    <h3 className="text-xs font-bold text-slate-800 truncate">{item.title}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">Companion: {item.favoriteAnimal}</span>
                  </button>
                  <button
                    onClick={() => onRemoveStory(item)}
                    className="text-slate-300 hover:text-rose-500 transition-all p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )
          )}

        </div>

        {/* RIGHT COLUMN: Expended Detail View (7 cols) */}
        <div className="md:col-span-7">
          
          <AnimatePresence mode="wait">
            {/* 1. Expended Activity Sheet */}
            {selectedActivity && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden"
              >
                <div className="bg-primary p-5 text-white flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary-foreground/80 bg-white/10 px-2.5 py-1 rounded-full">
                      {selectedActivity.ageRange} Range
                    </span>
                    <h3 className="font-display font-extrabold text-base mt-2">{selectedActivity.title}</h3>
                  </div>
                  <button onClick={() => setSelectedActivity(null)} className="text-white/60 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Materials</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedActivity.materialsNeeded.map((m, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg border border-slate-100">{m}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Instructions</h4>
                    <ol className="space-y-3">
                      {selectedActivity.instructions.map((step, i) => (
                        <li key={i} className="flex items-start space-x-2.5">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                          <span className="text-xs text-slate-600 leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start space-x-2.5">
                    <GraduationCap className="w-4 h-4 text-accent mt-0.5" />
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedActivity.learningOutcome}</p>
                  </div>

                  <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100 flex items-start space-x-2.5">
                    <AlertTriangle className="w-4 h-4 text-secondary mt-0.5" />
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedActivity.safetyTips}</p>
                  </div>
                </div>

                <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleCopyText(selectedActivity.title + '\n' + selectedActivity.instructions.join('\n'))}
                    className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold flex items-center space-x-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy instructions'}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. Expended Bedtime Story */}
            {selectedStory && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden"
              >
                <div className="bg-slate-900 p-5 text-white flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                      Bedtime Tale
                    </span>
                    <h3 className="font-display font-extrabold text-base mt-2">{selectedStory.title}</h3>
                  </div>
                  <button onClick={() => setSelectedStory(null)} className="text-white/60 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Inline SVG Illustration plate inside favorites! */}
                {selectedStory.illustrationUrl && (
                  <div 
                    className="w-full aspect-[16/10] bg-slate-900 overflow-hidden flex items-center justify-center relative border-b border-slate-800"
                    dangerouslySetInnerHTML={{ __html: selectedStory.illustrationUrl }}
                  />
                )}

                <div className="p-6 space-y-5">
                  <div className="space-y-3.5 text-slate-700 text-xs leading-relaxed max-h-72 overflow-y-auto pr-1">
                    {selectedStory.storyText.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Story Moral</span>
                    <p className="text-xs text-slate-600 leading-relaxed italic">"{selectedStory.moral}"</p>
                  </div>
                </div>

                <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleCopyText(selectedStory.title + '\n' + selectedStory.storyText.join('\n'))}
                    className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold flex items-center space-x-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Copy Story'}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. Empty pane placeholder */}
            {!selectedActivity && !selectedStory && (
              <div className="bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 h-[360px] flex flex-col items-center justify-center text-center p-6">
                <Heart className="w-10 h-10 text-slate-300 mb-2" />
                <h4 className="font-display font-bold text-slate-700 text-sm">Review Panel</h4>
                <p className="text-slate-400 text-[11px] max-w-xs mt-1 leading-relaxed">
                  Select any favorited play recipe or sleepy-time fable from the left sidebar list to expand detailed instructions.
                </p>
              </div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
