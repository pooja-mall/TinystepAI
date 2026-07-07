import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Dribbble, 
  Languages, 
  Smile, 
  BookOpen,
  MousePointerClick,
  RefreshCw
} from 'lucide-react';
import { ChildProfile, LearningMilestoneItem } from '../../types';

interface LearningViewProps {
  childProfile: ChildProfile | null;
  triggerConfetti: () => void;
}

const MILESTONES_BY_AGE: Record<number, Record<string, string[]>> = {
  0: {
    physical: ['Holds head up steadily', 'Brings hands to mouth', 'Rolls from tummy to back', 'Sits with support'],
    language: ['Coos and gurgles', 'Turns head toward sounds', 'Babble chains', 'Responds to own name'],
    cognitive: ['Tracks moving objects with eyes', 'Explores things with hands & mouth', 'Finds hidden toys easily', 'Passes items hand to hand']
  },
  1: {
    physical: ['Pulls up to stand', 'Walks holding onto furniture', 'Stands alone briefly', 'Drinks from a cup'],
    language: ['Says "mama" or "dada"', 'Shakes head "no"', 'Tries to repeat simple words', 'Waves goodbye'],
    cognitive: ['Explores items by shaking & banging', 'Looks at correct picture when named', 'Follows simple 1-step requests', 'Puts objects into containers']
  },
  2: {
    physical: ['Kicks a ball forward', 'Runs easily without falling', 'Walks up and down stairs', 'Builds tower of 4+ blocks'],
    language: ['Says 2-4 word sentences', 'Points to things when named', 'Knows names of familiar people', 'Repeats words overheard'],
    cognitive: ['Finds things hidden under layers', 'Sorts shapes and primary colors', 'Plays simple make-believe games', 'Completes 3-4 piece puzzles']
  },
  3: {
    physical: ['Climbs well on playground', 'Pedals a tricycle', 'Walks up/down stairs with alternating feet', 'Copies a circle with crayon'],
    language: ['Follows instructions with 2-3 steps', 'Names most familiar things', 'Understands "in", "on", "under"', 'States first name & age'],
    cognitive: ['Works toys with moving buttons/levers', 'Plays puzzles with 3 or 4 pieces', 'Builds tower of 6+ blocks', 'Turns book pages one by one']
  },
  4: {
    physical: ['Hops on one foot', 'Catches a bounced ball most times', 'Pours, cuts, and mashes with guidance', 'Draws a person with 2-4 parts'],
    language: ['Speaks clearly in full sentences', 'Tells simple descriptive stories', 'Uses "he" and "she" correctly', 'Sings songs from memory'],
    cognitive: ['Names some colors and numbers', 'Understands the concept of counting', 'Starts to understand time guidelines', 'Predicts what comes next in books']
  },
  5: {
    physical: ['Stands on one foot for 10+ seconds', 'Uses a fork and spoon easily', 'Swings and climbs on playground', 'Writes some letters or numbers'],
    language: ['Speaks very clearly', 'Uses future tense sentences', 'Tells longer fantasy stories', 'States full home address'],
    cognitive: ['Counts 10 or more objects', 'Draws a person with 6+ body parts', 'Understands simple calendar concepts', 'Knows what kitchen items do']
  }
};

// Default fallbacks for age 6-10
const BIG_KIDS_MILESTONES: Record<string, string[]> = {
  physical: ['Ties own shoelaces', 'Rides a bicycle without training wheels', 'Shows advanced physical agility and balance', 'Cuts shapes carefully with children shears'],
  language: ['Reads simple chapter books', 'Follows complex 3-step tasks', 'Expresses deep thoughts and feelings verbally', 'Participates in collaborative table talks'],
  cognitive: ['Solves multi-stage puzzles or board games', 'Understands addition and subtraction', 'Applies basic logical reasoning to puzzles', 'Organizes own desk or backpack']
};

export default function LearningView({ childProfile, triggerConfetti }: LearningViewProps) {
  const childAge = childProfile?.age || 2.7;
  const childName = childProfile?.name || 'Pranooja';

  const [activeCategory, setActiveCategory] = useState<'physical' | 'language' | 'cognitive'>('cognitive');
  const [goals, setGoals] = useState<LearningMilestoneItem[]>([]);

  useEffect(() => {
    // Generate milestone goals list
    const roundedAge = Math.max(0, Math.min(5, Math.floor(childAge)));
    const sources = childAge <= 5 ? (MILESTONES_BY_AGE[roundedAge] || MILESTONES_BY_AGE[2]) : BIG_KIDS_MILESTONES;
    
    const formattedGoals: LearningMilestoneItem[] = [];
    
    // Physical
    sources.physical.forEach((text, i) => {
      formattedGoals.push({ id: `phys-${i}`, title: text, category: 'physical', completed: false });
    });
    // Language
    sources.language.forEach((text, i) => {
      formattedGoals.push({ id: `lang-${i}`, title: text, category: 'language', completed: false });
    });
    // Cognitive
    if (sources.cognitive) {
      sources.cognitive.forEach((text, i) => {
        formattedGoals.push({ id: `cog-${i}`, title: text, category: 'cognitive', completed: i % 3 === 0 }); // seed some completed ones for interactive look!
      });
    }

    setGoals(formattedGoals);
  }, [childAge]);

  const toggleGoal = (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        const nextState = !g.completed;
        return { ...g, completed: nextState };
      }
      return g;
    });

    setGoals(updated);

    // Check if category is completely done
    const categoryGoals = updated.filter(g => g.category === activeCategory);
    const allDone = categoryGoals.every(g => g.completed);
    
    if (allDone) {
      triggerConfetti(); // Celebrate when they check off everything in a category!
    }
  };

  const filteredGoals = goals.filter(g => g.category === activeCategory);
  const completedCount = filteredGoals.filter(g => g.completed).length;
  const progressPercent = filteredGoals.length > 0 ? Math.round((completedCount / filteredGoals.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans pb-24">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-500 text-xs font-semibold mb-3">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Milestone Roadmap</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          Learning Planner & Goals
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track age-appropriate developmental milestones for {childName} based on pediatric guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Skill Selection Buttons (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm h-fit space-y-4">
          <h3 className="font-display font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Award className="w-4 h-4 text-blue-400" />
            <span>Milestone Categories</span>
          </h3>

          <div className="space-y-2">
            {[
              { id: 'cognitive', label: '🧠 Cognitive & Logic', bg: 'bg-indigo-50 border-indigo-100 text-indigo-600', activeBg: 'bg-primary border-primary text-white' },
              { id: 'language', label: '🗣️ Speech & Language', bg: 'bg-amber-50 border-amber-100 text-secondary', activeBg: 'bg-secondary border-secondary text-slate-900 font-bold' },
              { id: 'physical', label: '🏃 Motor & Physical', bg: 'bg-emerald-50 border-emerald-100 text-accent', activeBg: 'bg-accent border-accent text-slate-900 font-bold' }
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              const count = goals.filter(g => g.category === cat.id).length;
              const completed = goals.filter(g => g.category === cat.id && g.completed).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${isActive ? cat.activeBg + ' shadow-soft' : 'bg-slate-50 border-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  <div>
                    <span className="text-xs font-bold block">{cat.label}</span>
                    <span className={`text-[10px] mt-0.5 block ${isActive ? 'opacity-80' : 'text-slate-400 font-medium'}`}>
                      {completed} of {count} checked off
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Milestone Checklist Bento (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-100 shadow-sm rounded-[2rem] p-6 sm:p-8 space-y-6">
          
          {/* Progress summary block */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base capitalize">
                {activeCategory} Skills Mastery
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Complete milestones to spark child development and unlock digital trophies.
              </p>
            </div>

            {/* Circular or linear progress meter */}
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 flex items-center justify-center relative overflow-hidden">
                <span className="text-[10px] font-bold text-slate-800">{progressPercent}%</span>
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Category Progress</span>
                <span className="text-xs font-bold text-slate-700">{completedCount} Checked</span>
              </div>
            </div>
          </div>

          {/* Checklist list */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>Interactive Checklist (Tap to toggle)</span>
            </h4>

            {filteredGoals.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleGoal(item.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start space-x-4 ${item.completed ? 'bg-emerald-50/40 border-emerald-100' : 'bg-slate-50/50 border-slate-50 hover:bg-slate-50 hover:border-slate-100'}`}
              >
                <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center mt-0.5 transition-all ${item.completed ? 'bg-accent border-accent text-slate-950' : 'border-slate-300 bg-white'}`}>
                  {item.completed && <CheckCircle2 className="w-4 h-4 fill-current text-white bg-emerald-500 rounded-full" />}
                </div>
                <div>
                  <h5 className={`text-xs font-semibold ${item.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                    {item.title}
                  </h5>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block mt-1">Age {childAge} guideline</span>
                </div>
              </button>
            ))}
          </div>

          {/* Trophy card if 100% complete */}
          {progressPercent === 100 && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-900 rounded-2xl border border-amber-300 text-center space-y-2 shadow-soft"
            >
              <Award className="w-8 h-8 mx-auto animate-bounce text-white drop-shadow" />
              <h4 className="font-display font-extrabold text-sm">Category Complete! 🏆</h4>
              <p className="text-[11px] font-medium leading-relaxed opacity-90 max-w-sm mx-auto">
                Amazing work! You've successfully supported {childName} in checking off all targeted {activeCategory} milestones. Let's celebrate!
              </p>
            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
}
const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
