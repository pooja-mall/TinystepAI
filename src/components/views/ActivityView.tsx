import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Clock, 
  AlertTriangle, 
  GraduationCap, 
  CheckCircle2, 
  Star, 
  Copy, 
  Share2, 
  ArrowRight,
  Sparkles,
  Inbox
} from 'lucide-react';
import { ActivityItem, ChildProfile } from '../../types';
import { createActivity } from '../../services/ai';

interface ActivityViewProps {
  childProfile: ChildProfile | null;
  favoritedList: ActivityItem[];
  onToggleFavorite: (activity: ActivityItem) => void;
  onAddHistory: (type: 'activity' | 'meal' | 'story' | 'weekly-plan', id: string, title: string) => void;
}

export default function ActivityView({ childProfile, favoritedList, onToggleFavorite, onAddHistory }: ActivityViewProps) {
  const [age, setAge] = useState<number>(childProfile?.age || 4);
  const [selectedInterest, setSelectedInterest] = useState<string>('');
  const [time, setTime] = useState<number>(30);
  const [location, setLocation] = useState<'indoor' | 'outdoor' | 'both'>('indoor');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'creative'>('medium');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActivityItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Load profile interest as default
  useEffect(() => {
    if (childProfile && childProfile.interests.length > 0) {
      setSelectedInterest(childProfile.interests[0]);
    } else {
      setSelectedInterest('Puzzles');
    }
  }, [childProfile]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const activity = await createActivity(
        age,
        selectedInterest ? [selectedInterest] : ['Exploration'],
        time,
        location,
        difficulty
      );
      setResult(activity);
      onAddHistory('activity', activity.id, activity.title);
    } catch (error) {
      console.error('Error generating activity', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `
🌟 TinySteps AI Daily Play Activity Recommended 🌟
Title: ${result.title}
Estimated Time: ${result.estimatedTime} | Age Range: ${result.ageRange}

📋 Materials Needed:
${result.materialsNeeded.map(m => `- ${m}`).join('\n')}

📝 Step-by-Step Instructions:
${result.instructions.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

🎓 Developmental Learning Outcome:
${result.learningOutcome}

⚠️ Crucial Safety Tips:
${result.safetyTips}
    `;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  const isFavorited = result ? favoritedList.some(fav => fav.id === result.id) : false;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans pb-24">
      {/* 1. View Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>AI Generator</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          Play Activity Planner
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Generate custom, science-backed developmental games based on your child's age and materials you already have.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Controls Form (5 cols on large screens) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-fit">
          <h2 className="font-display font-bold text-lg text-slate-900 mb-4 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Activity Settings</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-5">
            
            {/* Age field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Child Age Focus (Years)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-sm"
              />
            </div>

            {/* Interest selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Core Interest / Toy Theme
              </label>
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 text-sm transition-all"
              >
                {childProfile?.interests.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
                {!childProfile?.interests.includes(selectedInterest) && selectedInterest && (
                  <option value={selectedInterest}>{selectedInterest}</option>
                )}
                <option value="Blocks">Blocks / Lego</option>
                <option value="Drawing">Drawing / Painting</option>
                <option value="Space">Space Exploration</option>
                <option value="Dinosaurs">Dinosaur Dig</option>
                <option value="Nature">Nature Scavenger</option>
                <option value="Puzzles">Puzzles & Logic</option>
              </select>
            </div>

            {/* Time slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Play Time
                </label>
                <span className="text-xs font-bold text-primary">{time} Minutes</span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                step="5"
                value={time}
                onChange={(e) => setTime(parseInt(e.target.value))}
                className="w-full accent-primary h-1.5 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            {/* Location selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Location Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['indoor', 'outdoor', 'both'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc as any)}
                    className={`py-2 text-xs font-semibold rounded-xl border text-center capitalize transition-all ${location === loc ? 'bg-primary border-primary text-white' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Style Focus
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['easy', 'medium', 'creative'].map((dif) => (
                  <button
                    key={dif}
                    type="button"
                    onClick={() => setDifficulty(dif as any)}
                    className={`py-2 text-xs font-semibold rounded-xl border text-center capitalize transition-all ${difficulty === dif ? 'bg-primary border-primary text-white' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}`}
                  >
                    {dif}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 px-4 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-xl shadow-soft hover:shadow-glow flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Compile Play Routine</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        </div>

        {/* RIGHT COLUMN: Output Result (7 cols on large screens) */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          
          <AnimatePresence mode="wait">
            {loading && (
              /* Loading Skeletons with reassuring messages */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6 text-center py-16"
              >
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg text-slate-800 animate-pulse">Designing early learning milestones...</h3>
                <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
                  TinySteps is organizing age-appropriate fine motor guides, safety boundaries, and sensory outputs. Just a moment!
                </p>
                {/* Simulated skeleton bones */}
                <div className="space-y-2 max-w-sm mx-auto pt-6 opacity-35">
                  <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto shimmer" />
                  <div className="h-3 bg-slate-100 rounded w-1/2 mx-auto shimmer" />
                  <div className="h-3 bg-slate-100 rounded w-5/6 mx-auto shimmer" />
                </div>
              </motion.div>
            )}

            {!loading && !result && (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center py-20 flex flex-col items-center justify-center h-full"
              >
                <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mb-4 border border-slate-100">
                  <Inbox className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-slate-700 text-lg mb-2">No Play Routine Compiled Yet</h3>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  Configure age preferences, choose your available materials, and tap "Compile Play Routine" to generate customized guides.
                </p>
              </motion.div>
            )}

            {!loading && result && (
              /* Result Card */
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Result header */}
                <div className="bg-gradient-to-tr from-primary to-indigo-600 p-6 text-white relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-100 bg-white/10 px-2.5 py-1 rounded-full border border-white/5">
                        {result.ageRange} • {result.difficulty} Style
                      </span>
                      <h3 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight mt-3">
                        {result.title}
                      </h3>
                    </div>
                    {/* Favorite Button */}
                    <button
                      onClick={() => onToggleFavorite(result)}
                      className={`p-3 rounded-2xl transition-all shadow-md ${isFavorited ? 'bg-rose-500 text-white' : 'bg-white text-slate-400 hover:text-rose-500'}`}
                    >
                      <Star className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center space-x-4 text-xs text-indigo-100">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{result.estimatedTime}</span>
                    </span>
                    <span className="capitalize px-2 py-0.5 rounded bg-white/15">
                      {result.indoorOutdoor} focus
                    </span>
                  </div>
                </div>

                {/* Result body */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* 1. Materials needed */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                      Materials Needed
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.materialsNeeded.map((mat, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-100">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 2. Step by Step instructions */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Step-by-Step Instructions
                    </h4>
                    <ol className="space-y-4">
                      {result.instructions.map((step, idx) => (
                        <li key={idx} className="flex items-start space-x-3.5">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-xs text-slate-600 leading-relaxed">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* 3. Learning outcome */}
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 flex items-start space-x-3">
                    <GraduationCap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-xs font-bold text-slate-800 mb-0.5">Developmental Outcome</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">{result.learningOutcome}</p>
                    </div>
                  </div>

                  {/* 4. Safety tips */}
                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-xs font-bold text-slate-800 mb-0.5">Safety Boundaries</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">{result.safetyTips}</p>
                    </div>
                  </div>

                </div>

                {/* Card footer details / share */}
                <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">Created via TinySteps AI Companion</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-primary rounded-lg text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-primary rounded-lg text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{shared ? 'Shared Link!' : 'Share'}</span>
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
