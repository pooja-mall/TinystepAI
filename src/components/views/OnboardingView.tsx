import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Compass, ChefHat, BookOpen, Check } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Compass,
    iconBg: 'bg-primary/10 text-primary border-primary/10',
    title: 'Developmental Activities',
    desc: 'Never run out of ideas! Get quick sensory, physical, and cognitive game prompts tailored exactly for your child’s current age and favorite toys.',
    image: `
      <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="400" height="240" rx="20" fill="#F8FAFC"/>
        <circle cx="200" cy="110" r="45" fill="#6C63FF" opacity="0.1"/>
        <g stroke="#6C63FF" stroke-width="3" fill="none" stroke-linecap="round">
          <circle cx="200" cy="110" r="30"/>
          <line x1="200" y1="65" x2="200" y2="80"/>
          <line x1="200" y1="140" x2="200" y2="155"/>
          <line x1="155" y1="110" x2="170" y2="110"/>
          <line x1="230" y1="110" x2="245" y2="110"/>
        </g>
        <circle cx="200" cy="110" r="5" fill="#6C63FF"/>
      </svg>
    `
  },
  {
    icon: ChefHat,
    iconBg: 'bg-secondary/10 text-secondary border-secondary/10',
    title: 'Balanced Kid-Friendly Meals',
    desc: 'Enter what ingredients are available in your kitchen, select diet preferences (such as allergy-safe or vegetarian), and obtain delicious recipes packed with pediatric nutrition tips.',
    image: `
      <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="400" height="240" rx="20" fill="#F8FAFC"/>
        <circle cx="200" cy="110" r="45" fill="#FFB84C" opacity="0.1"/>
        <path d="M 160 130 C 160 100 240 100 240 130 Z" fill="#FFB84C" opacity="0.8"/>
        <rect x="175" y="130" width="50" height="15" rx="5" fill="#E2E8F0"/>
        <line x1="180" y1="115" x2="180" y2="90" stroke="#FFB84C" stroke-width="3" stroke-linecap="round"/>
        <line x1="200" y1="110" x2="200" y2="85" stroke="#FFB84C" stroke-width="3" stroke-linecap="round"/>
        <line x1="220" y1="115" x2="220" y2="90" stroke="#FFB84C" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `
  },
  {
    icon: BookOpen,
    iconBg: 'bg-accent/10 text-accent border-accent/10',
    title: 'Custom Bedtime Stories',
    desc: 'Soothe your child to sleep with unique fairy tales featuring them as the core character alongside their favorite animal! Every story carries a moral and family discussion questions.',
    image: `
      <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <rect width="400" height="240" rx="20" fill="#F8FAFC"/>
        <circle cx="200" cy="110" r="45" fill="#7ED957" opacity="0.1"/>
        <path d="M 160 100 H 240 Q 240 150 200 150 Q 160 150 160 100" fill="none" stroke="#7ED957" stroke-width="3" stroke-linecap="round"/>
        <line x1="200" y1="100" x2="200" y2="150" stroke="#7ED957" stroke-width="2"/>
        <circle cx="270" cy="70" r="3" fill="#FFD54F"/>
        <circle cx="130" cy="80" r="2.5" fill="#FFD54F"/>
      </svg>
    `
  }
];

export default function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete();
    }
  };

  const currentSlide = slides[current];
  const IconComponent = currentSlide.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background patterns */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden flex flex-col justify-between p-6 sm:p-10 z-10"
      >
        {/* Header Indicator */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Slide {current + 1} of {slides.length}
          </span>
          <button
            onClick={onComplete}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-all uppercase tracking-wider"
          >
            Skip
          </button>
        </div>

        {/* Dynamic Slide Content */}
        <div className="flex-grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* Graphic container */}
              <div 
                className="w-full aspect-[16/10] rounded-2xl overflow-hidden mb-8 border border-slate-50 shadow-soft"
                dangerouslySetInnerHTML={{ __html: currentSlide.image }}
              />

              {/* Icon / Title */}
              <div className="inline-flex items-center justify-center p-3.5 rounded-2xl mb-4 border border-slate-100 bg-slate-50">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>

              <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight mb-3">
                {currentSlide.title}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto">
                {currentSlide.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        <div className="mt-10 border-t border-slate-50 pt-6 flex items-center justify-between">
          {/* Progress dots */}
          <div className="flex space-x-2">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-primary' : 'w-1.5 bg-slate-200'}`}
              />
            ))}
          </div>

          {/* Action button */}
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-xl shadow-soft flex items-center space-x-1 transition-all"
          >
            {current === slides.length - 1 ? (
              <>
                <span>Let's Begin</span>
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
