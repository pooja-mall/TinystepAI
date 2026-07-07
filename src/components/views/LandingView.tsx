import { motion } from 'motion/react';
import { 
  Sparkles, 
  Compass, 
  ChefHat, 
  BookOpen, 
  MessageSquare, 
  GraduationCap, 
  Calendar, 
  ArrowRight, 
  Heart,
  HelpCircle,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { useState } from 'react';

interface LandingViewProps {
  onStart: () => void;
  onLogin: () => void;
}

const features = [
  {
    icon: Compass,
    title: 'Daily Activities',
    desc: 'Fun, developmental play tailored for indoor or outdoor spaces, adapted to materials you already own.',
    color: 'from-purple-500/10 to-indigo-500/10',
    iconColor: 'text-primary'
  },
  {
    icon: ChefHat,
    title: 'Meal Planner',
    desc: 'Custom breakfast, lunch, snacks, and dinners with child-friendly nutrition tips based on your pantry.',
    color: 'from-amber-500/10 to-orange-500/10',
    iconColor: 'text-secondary'
  },
  {
    icon: BookOpen,
    title: 'Story Generator',
    desc: 'Personalized bedtime stories weaving your child as the hero, complete with morals and reflection questions.',
    color: 'from-emerald-500/10 to-teal-500/10',
    iconColor: 'text-accent'
  },
  {
    icon: MessageSquare,
    title: 'Parenting Coach',
    desc: 'Warm, expert guidance to handle tantrums, picky eating, and screen time adjustments with ease.',
    color: 'from-rose-500/10 to-pink-500/10',
    iconColor: 'text-rose-500'
  },
  {
    icon: GraduationCap,
    title: 'Learning Planner',
    desc: 'Bento-style developmental goals covering language, math, creativity, and essential motor skills.',
    color: 'from-blue-500/10 to-cyan-500/10',
    iconColor: 'text-blue-500'
  },
  {
    icon: Calendar,
    title: 'Weekly Planner',
    desc: 'A full calendar integrating daily routines, balanced meals, storytelling, and custom family quality moments.',
    color: 'from-violet-500/10 to-fuchsia-500/10',
    iconColor: 'text-violet-500'
  }
];

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Mother of Oliver (3)',
    text: 'TinySteps changed our bedtime struggle completely. The stardust story generated with Oliver and his stuffed puppy made him slide under the sheets in minutes!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
  },
  {
    name: 'Devon Patel',
    role: 'Father of Ananya (6)',
    text: 'As a single working dad, coming up with outdoor science projects on weekends used to be stressful. TinySteps crafts scavenger checklists in seconds. Best companion ever.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
  },
  {
    name: 'Elena Rostova',
    role: 'Mother of Leo (1) & Maya (4)',
    text: 'The picky eating solutions offered by the AI Coach worked like magic. No pressure, positive exposures, and now Maya helps me prep our avocado pinwheels.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120'
  }
];

const faqs = [
  {
    question: 'What age group is TinySteps AI built for?',
    answer: 'Our activities, meals, learning goals, and weekly planners are dynamically structured for children aged 0 to 10 years, adapting developmental recommendations to their specific yearly milestones.'
  },
  {
    question: 'How does the Story Generator personalize stories?',
    answer: 'TinySteps incorporates your child’s name, favorite color, favorite animal, and chosen moral/adventure theme. It then compiles custom paragraphs and displays an interactive, colorful vector illustration tailored to their profile.'
  },
  {
    question: 'Are the recipes allergy-safe?',
    answer: 'Yes! When you complete your child’s profile, you can list specific allergies (like peanuts, gluten, dairy) and choose dietary preferences (like vegetarian, vegan, or allergy-friendly). The AI adjusts meal planning outputs to exclude risk elements.'
  },
  {
    question: 'Can I save my generated activities and stories?',
    answer: 'Absolutely. You can favorite any activity, meal plan, or bedtime story to retrieve it instantly. They are safely synced with your browser’s local storage so they remain available whenever you log back in.'
  }
];

export default function LandingView({ onStart, onLogin }: LandingViewProps) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. Header Navigation */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-violet-400 flex items-center justify-center text-white shadow-soft">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-slate-900">
              TinySteps<span className="text-primary font-medium">.AI</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={onLogin}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary transition-all rounded-lg"
            >
              Sign In
            </button>
            <button 
              onClick={onStart}
              className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/95 transition-all rounded-xl shadow-soft flex items-center space-x-1"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-grow">
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
          {/* Ambient background decoration */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] aspect-square bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-[-10%] w-[40%] aspect-square bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 shadow-sm border border-primary/10"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Parenting Companion</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]"
            >
              Your AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">Parenting</span> Companion
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
            >
              Plan activities, meals, learning, and bedtime stories personalized for your child aged 0-10 years. All in one safe, premium space.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4"
            >
              <button
                onClick={onStart}
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-primary hover:bg-primary/95 transition-all rounded-2xl shadow-premium hover:shadow-glow transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all rounded-2xl border border-slate-200 shadow-soft text-center"
              >
                Learn More
              </a>
            </motion.div>

            {/* Simulated Desktop Preview Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16 sm:mt-24 max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-premium border border-slate-100 bg-white p-4"
            >
              <div className="rounded-2xl overflow-hidden border border-slate-50 bg-gradient-to-tr from-slate-50 to-slate-100 flex items-center justify-center aspect-[16/9] relative group">
                {/* SVG mock illustration representing happy family */}
                <svg viewBox="0 0 800 450" className="w-full h-full max-w-4xl" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#E0F2FE" />
                      <stop offset="100%" stopColor="#F3E8FF" />
                    </linearGradient>
                    <linearGradient id="hillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#7ED957" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#F8FAFC" />
                    </linearGradient>
                  </defs>
                  <rect width="800" height="450" fill="url(#skyGrad)" />
                  <path d="M 0 350 Q 250 280 500 360 T 800 320 L 800 450 L 0 450 Z" fill="url(#hillGrad)" />
                  <circle cx="150" cy="120" r="40" fill="#FFE082" opacity="0.8" />
                  
                  {/* Styled Kid Characters */}
                  <g transform="translate(320, 240)">
                    {/* Father Bear */}
                    <circle cx="50" cy="60" r="30" fill="#6C63FF" opacity="0.9" />
                    <circle cx="35" cy="40" r="10" fill="#6C63FF" />
                    <circle cx="65" cy="40" r="10" fill="#6C63FF" />
                    
                    {/* Baby Bear */}
                    <circle cx="110" cy="90" r="20" fill="#FFB84C" />
                    <circle cx="100" cy="76" r="7" fill="#FFB84C" />
                    <circle cx="120" cy="76" r="7" fill="#FFB84C" />
                  </g>
                  
                  {/* Decorative Elements */}
                  <g fill="#7ED957" opacity="0.6">
                    <polygon points="120,380 90,440 150,440" />
                    <polygon points="680,360 650,420 710,420" />
                  </g>
                  <text x="400" y="420" fontFamily="Outfit" fontSize="20" fontWeight="bold" fill="#475569" textAnchor="middle">
                    TinySteps AI • Sparking Joy in Daily Parenting
                  </text>
                </svg>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                Designed for the Joy of Parenting
              </h2>
              <p className="mt-4 text-lg text-slate-500 leading-relaxed">
                Everything you need to guide, teach, feed, and put your children to sleep, created instantly with advanced developmental science.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-premium transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-all`}>
                      <Icon className={`w-6 h-6 ${feat.iconColor}`} />
                    </div>
                    <h3 className="font-display font-bold text-xl text-slate-900 mb-3">{feat.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Testimonials Section */}
        <section className="py-20 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 py-1.5 rounded-full bg-rose-50 text-rose-500 text-xs font-semibold mb-3">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Loved by Parents</span>
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
                What Happy Parents Say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((test, idx) => (
                <div 
                  key={idx}
                  className="p-8 bg-white rounded-3xl border border-slate-100 shadow-soft flex flex-col justify-between"
                >
                  <p className="text-slate-600 text-sm leading-relaxed italic">
                    "{test.text}"
                  </p>
                  <div className="mt-6 flex items-center space-x-4 border-t border-slate-50 pt-4">
                    <img 
                      src={test.avatar} 
                      alt={test.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-sm">{test.name}</h4>
                      <p className="text-xs text-slate-400">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. FAQ Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 py-1.5 rounded-full bg-blue-50 text-blue-500 text-xs font-semibold mb-3">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Common Queries</span>
              </div>
              <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = faqOpen === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50"
                  >
                    <button
                      onClick={() => setFaqOpen(isOpen ? null : idx)}
                      className="w-full px-6 py-5 text-left font-display font-semibold text-slate-900 hover:bg-slate-50 flex justify-between items-center transition-all"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-all duration-300 ${isOpen ? 'transform rotate-180 text-primary' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed bg-white border-t border-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. CTA Banner */}
        <section className="py-16 sm:py-24 bg-gradient-to-tr from-primary to-indigo-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight mb-6">
              Start Making Every Day a Milestone
            </h2>
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of parents using TinySteps AI to raise confident, imaginative, and healthy children.
            </p>
            <button
              onClick={onStart}
              className="px-8 py-4 bg-white text-primary hover:bg-slate-50 transition-all font-bold text-base rounded-2xl shadow-premium flex items-center justify-center space-x-2 mx-auto transform hover:-translate-y-0.5"
            >
              <span>Get Started Now (Guest or Google)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-800 pb-8">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-display font-extrabold text-lg text-white">
                TinySteps<span className="text-primary font-medium">.AI</span>
              </span>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#features" className="hover:text-white transition-all">Features</a>
              <a href="#faq" className="hover:text-white transition-all">Support</a>
              <a href="#" className="hover:text-white transition-all">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-all">Terms of Use</a>
            </div>
          </div>
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-xs">
            <p>© 2026 TinySteps AI. All rights reserved.</p>
            <p className="mt-4 md:mt-0 flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>for happy parenting adventures</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
