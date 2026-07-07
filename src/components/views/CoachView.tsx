import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  User, 
  Heart, 
  Copy, 
  Share2, 
  Info,
  ChevronRight,
  BrainCircuit
} from 'lucide-react';
import { CoachMessage, ChildProfile } from '../../types';
import { askParentCoach } from '../../services/ai';

interface CoachViewProps {
  childProfile: ChildProfile | null;
}

const SAMPLE_QUESTIONS = [
  'How do I handle bedroom bedtime tantrums?',
  'Tips for introducing veggies to a picker toddler?',
  'How do I manage playground sharing conflicts?',
  'Interactive screen-time alternative play ideas?'
];

export default function CoachView({ childProfile }: CoachViewProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Hello! I am your TinySteps Parenting Coach. Ask me any question about tantrums, pediatric nutrition, sleep routines, cognitive habits, or transition boundaries tailored for your little child. How can I guide you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (query: string) => {
    if (!query.trim()) return;

    // 1. Add parent message
    const userMsg: CoachMessage = {
      id: Math.random().toString(),
      sender: 'parent',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      // 2. Query Mock Coach AI
      const aiMsg = await askParentCoach(query, updatedMessages, childProfile);
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error talking to parenting coach', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans pb-24">
      
      {/* View Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-500 text-xs font-semibold mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Parent Coach</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          AI Parenting Coach
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Get supportive, evidence-based pediatric tips, boundary setting, and routine advice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL: Sample Queries and tips (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Sample questions */}
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-3.5">
            <h3 className="font-display font-bold text-slate-900 text-sm flex items-center space-x-2">
              <BrainCircuit className="w-4 h-4 text-rose-400" />
              <span>Recommended Inquiries</span>
            </h3>

            <div className="space-y-2">
              {SAMPLE_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-50 hover:bg-slate-100/70 hover:border-slate-100 transition-all text-xs font-medium text-slate-600 leading-normal flex justify-between items-center group disabled:opacity-50"
                >
                  <span className="group-hover:text-rose-500 transition-all">{q}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Core coach notes */}
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 flex items-start space-x-3 text-amber-800">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
            <div className="text-[10px] leading-relaxed">
              <strong className="block font-bold">Privacy First Safehouse</strong>
              Conversations are executed entirely server-side. No parenting logs are shared with external marketing boards.
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: Chat Sandbox Container (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-100 shadow-sm rounded-[2rem] h-[560px] flex flex-col justify-between overflow-hidden">
          
          {/* Top chat header */}
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center font-display font-bold text-sm">
                TS
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">TinySteps Coach</h3>
                <span className="text-[9px] text-emerald-500 font-semibold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                  Online Companion
                </span>
              </div>
            </div>
          </div>

          {/* Bubbles log */}
          <div className="flex-grow p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div key={msg.id} className={`flex items-start ${isAi ? 'justify-start' : 'justify-end'}`}>
                  {isAi && (
                    <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mr-2.5 mt-1 font-display">
                      TS
                    </div>
                  )}

                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${isAi ? 'bg-slate-50 text-slate-700 rounded-tl-sm border border-slate-50' : 'bg-primary text-white rounded-tr-sm shadow-soft'}`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    
                    {/* Tiny action ribbon inside bubble */}
                    {isAi && (
                      <div className="mt-2.5 flex justify-end space-x-2 border-t border-slate-100/50 pt-2 text-[9px] text-slate-400">
                        <button onClick={() => handleCopyMessage(msg.text)} className="hover:text-primary transition-all flex items-center space-x-0.5">
                          <Copy className="w-3 h-3" />
                          <span>Copy Guidelines</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Bouncing Dots Loading */}
            {loading && (
              <div className="flex items-start">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mr-2.5 mt-1">
                  TS
                </div>
                <div className="bg-slate-50 border border-slate-50 px-4 py-3.5 rounded-2xl rounded-tl-sm flex space-x-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form input console */}
          <div className="p-4 bg-slate-50 border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputText);
              }}
              className="flex space-x-2"
            >
              <input
                type="text"
                placeholder="Ask something (e.g. bed routine, screen boundaries...)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
                className="flex-grow px-4 py-3 bg-white border border-slate-200 focus:border-rose-400 focus:outline-none rounded-xl text-xs transition-all"
              />
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="p-3 bg-primary hover:bg-primary/95 text-white rounded-xl shadow-soft transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
