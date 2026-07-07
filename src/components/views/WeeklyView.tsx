import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Sparkles, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  ChefHat, 
  GraduationCap, 
  BookOpen, 
  Check,
  Inbox,
  ArrowRight
} from 'lucide-react';
import { WeeklyPlannerData, ChildProfile } from '../../types';
import { createWeeklyPlan } from '../../services/ai';

interface WeeklyViewProps {
  childProfile: ChildProfile | null;
  onAddHistory: (type: 'activity' | 'meal' | 'story' | 'weekly-plan', id: string, title: string) => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WeeklyView({ childProfile, onAddHistory }: WeeklyViewProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WeeklyPlannerData | null>(null);
  const [activeDay, setActiveDay] = useState('Monday');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate default weekly plan if child profile exists
    if (childProfile) {
      handleGenerate();
    }
  }, [childProfile]);

  const handleGenerate = async () => {
    if (!childProfile) return;
    setLoading(true);
    setResult(null);

    try {
      const weeklyPlan = await createWeeklyPlan(childProfile);
      setResult(weeklyPlan);
      onAddHistory('weekly-plan', weeklyPlan.id, `${childProfile?.name || 'Child'}’s Weekly Routine`);
    } catch (err) {
      console.error('Error generating weekly planner', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!result) return;
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans pb-24">
      
      {/* Print-only CSS block */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #weekly-print-area, #weekly-print-area * {
            visibility: visible;
          }
          #weekly-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between no-print">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-500 text-xs font-semibold mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>AI Weekly Routine</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
            Weekly Play & Meal Planner
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            A cohesive 7-day developmental schedule balancing cognitive games, pediatric snacks, and storytelling.
          </p>
        </div>

        {/* Quick action buttons */}
        {result && (
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-semibold shadow-soft flex items-center space-x-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Fridge Planner</span>
            </button>
            <button
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-primary text-white hover:bg-primary/95 rounded-xl text-xs font-bold shadow-soft hover:shadow-glow flex items-center space-x-1.5 transition-all"
            >
              <span>Refresh Schedule</span>
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          /* Loading animation block */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white p-12 rounded-3xl border border-slate-100 shadow-premium text-center space-y-6"
          >
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-slate-800 animate-pulse font-sans">Compiling 7-day children calendar...</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
              TinySteps is sequencing age-appropriate learning landmarks, physical motor playtime, and story titles for the entire week.
            </p>
          </motion.div>
        )}

        {!loading && !result && (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-premium text-center py-24 flex flex-col items-center justify-center no-print"
          >
            <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mb-4 border border-slate-100">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-slate-700 text-lg mb-2">No Weekly Routine Compiled</h3>
            <p className="text-slate-400 text-xs max-w-xs leading-relaxed mb-6">
              Create a child profile, and compile custom 7-day balanced schedules in seconds.
            </p>
            <button
              onClick={handleGenerate}
              className="px-6 py-3 bg-primary text-white font-bold text-sm rounded-xl shadow-soft flex items-center space-x-2"
            >
              <span>Compile Weekly Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {!loading && result && (
          /* Main Interactive Planner Block */
          <motion.div
            id="weekly-print-area"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Day Selector Buttons (Desktop: 7-columns, Mobile: list scroll) no-print */}
            <div className="flex space-x-1.5 overflow-x-auto pb-2 pr-2 no-print">
              {DAYS_OF_WEEK.map((day) => {
                const isActive = activeDay === day;
                const data = result.schedule[day] || { activity: 'Routine' };
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`px-4 py-3 rounded-2xl text-xs font-bold border flex-shrink-0 transition-all ${isActive ? 'bg-primary border-primary text-white shadow-soft' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                  >
                    <span>{day}</span>
                  </button>
                );
              })}
            </div>

            {/* Print Header (Visible ONLY during paper printing!) */}
            <div className="hidden print:block text-center pb-6 border-b border-slate-200">
              <h2 className="font-display font-extrabold text-2xl text-slate-900">
                {childProfile?.name || 'My Child’s'} Weekly Planner Roadmap
              </h2>
              <p className="text-slate-500 text-xs mt-1">Generated by TinySteps AI Companion</p>
            </div>

            {/* 7-Day Calendar Bento Layout (Combines responsive tab view on screen, full block view on print!) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Box 1: Morning Activity */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-primary flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Morning Play</span>
                    <h4 className="text-xs font-bold text-slate-800">Sensory & Cognition</h4>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="font-display font-extrabold text-slate-900 text-sm mb-1 capitalize">
                    {result.schedule[activeDay]?.activity || 'Outdoor Play'}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Personalized developmental activity aligning with your child's favorite themes and materials.
                  </p>
                </div>
              </div>

              {/* Box 2: Mid-day Snack */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-secondary flex items-center justify-center">
                    <ChefHat className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Lunch / Snack</span>
                    <h4 className="text-xs font-bold text-slate-800">Healthy Kids Bites</h4>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="font-display font-extrabold text-slate-900 text-sm mb-1 capitalize">
                    {result.schedule[activeDay]?.snack || 'Peanut Butter Sliders'}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Pediatric allergy-safe nutritional recipe formulated for your selected dietary preference.
                  </p>
                </div>
              </div>

              {/* Box 3: Afternoon Milestone */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Developmental Goal</span>
                    <h4 className="text-xs font-bold text-slate-800">Milestone Check</h4>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="font-display font-extrabold text-slate-900 text-sm mb-1 capitalize">
                    {result.schedule[activeDay]?.milestone || 'Phonetic Sound Matches'}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Micro learning blocks that help your kid master key fine motor or linguistic abilities.
                  </p>
                </div>
              </div>

              {/* Box 4: Evening bedtime story */}
              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-accent flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Evening Sleep</span>
                    <h4 className="text-xs font-bold text-slate-800">Bedtime Story</h4>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="font-display font-extrabold text-slate-900 text-sm mb-1 capitalize">
                    {result.schedule[activeDay]?.storyTheme || 'The Starry Cosmic Search'}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Quiet bedtime stories featuring your child as the core character to ease them to sleep.
                  </p>
                </div>
              </div>

            </div>

            {/* Print-Only entire Weekly list overview (Visible ONLY during actual paper printing!) */}
            <div className="hidden print:block mt-8">
              <table className="w-full border-collapse border border-slate-200 text-xs text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold">
                    <th className="p-3 border border-slate-200">Day</th>
                    <th className="p-3 border border-slate-200">Play Activity (Morning)</th>
                    <th className="p-3 border border-slate-200">Pediatric Snack</th>
                    <th className="p-3 border border-slate-200">Learning Milestone</th>
                    <th className="p-3 border border-slate-200">Fairy Story Theme</th>
                  </tr>
                </thead>
                <tbody>
                  {DAYS_OF_WEEK.map((day) => {
                    const row = result.schedule[day] || { activity: 'Routine' };
                    return (
                      <tr key={day} className="text-slate-700">
                        <td className="p-3 border border-slate-200 font-bold">{day}</td>
                        <td className="p-3 border border-slate-200">{row.activity}</td>
                        <td className="p-3 border border-slate-200">{row.snack}</td>
                        <td className="p-3 border border-slate-200">{row.milestone}</td>
                        <td className="p-3 border border-slate-200">{row.storyTheme}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
