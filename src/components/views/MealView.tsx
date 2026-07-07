import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat, 
  Plus, 
  X, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Inbox, 
  Apple, 
  Sun, 
  Moon, 
  Coffee, 
  Cookie,
  ArrowRight,
  ClipboardCheck
} from 'lucide-react';
import { MealPlan, ChildProfile } from '../../types';
import { createMeal } from '../../services/ai';

interface MealViewProps {
  childProfile: ChildProfile | null;
  onAddHistory: (type: 'activity' | 'meal' | 'story' | 'weekly-plan', id: string, title: string) => void;
}

const COMMON_INGREDIENTS = ['Oats', 'Milk', 'Bananas', 'Eggs', 'Pasta', 'Cheese', 'Avocado', 'Apples', 'Carrots', 'Chicken', 'Rice', 'Broccoli', 'Spinach', 'Sweet Potato', 'Yogurt'];

export default function MealView({ childProfile, onAddHistory }: MealViewProps) {
  const [ingredients, setIngredients] = useState<string[]>(['Oats', 'Bananas', 'Milk']);
  const [customIngredient, setCustomIngredient] = useState('');
  const [diet, setDiet] = useState(childProfile?.dietPreference || 'vegetarian');
  const [mealType, setMealType] = useState('Daily Plan');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MealPlan | null>(null);
  const [copied, setCopied] = useState(false);

  // Load child allergies to exclude list
  const allergiesList = childProfile?.allergies || [];

  const handleTogglePreset = (item: string) => {
    if (ingredients.includes(item)) {
      setIngredients(ingredients.filter(i => i !== item));
    } else {
      setIngredients([...ingredients, item]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customIngredient.trim()) return;
    if (!ingredients.includes(customIngredient.trim())) {
      setIngredients([...ingredients, customIngredient.trim()]);
    }
    setCustomIngredient('');
  };

  const handleRemove = (item: string) => {
    setIngredients(ingredients.filter(i => i !== item));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const mealPlan = await createMeal(ingredients, diet, mealType);
      setResult(mealPlan);
      onAddHistory('meal', mealPlan.id, `Healthy Meal: ${mealPlan.breakfast}`);
    } catch (e) {
      console.error('Error creating meal', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `
🍎 TinySteps AI Children Nutrition Meal Plan 🍎
Diet Type: ${result.dietType} | Ingredients Utilized: ${result.ingredientsUsed.join(', ')}

🍳 Breakfast:
${result.breakfast}

🥗 Lunch:
${result.lunch}

🍪 Snack:
${result.snack}

🍲 Dinner:
${result.dinner}

💡 Nutrition & Safety Tips:
${result.nutritionTips.map(t => `- ${t}`).join('\n')}
    `;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans pb-24">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-secondary text-xs font-semibold mb-3">
          <ChefHat className="w-3.5 h-3.5" />
          <span>AI Nutrition</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">
          AI Kid Meal Planner
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Combine ingredients in your kitchen to generate delicious, well-balanced breakfasts, lunches, snacks, and dinners.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-fit space-y-6">
          <h2 className="font-display font-bold text-lg text-slate-900 flex items-center space-x-2">
            <Apple className="w-5 h-5 text-secondary" />
            <span>Meal Settings</span>
          </h2>

          {/* Preset ingredient selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Choose Available Ingredients
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
              {COMMON_INGREDIENTS.map((item) => {
                const selected = ingredients.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleTogglePreset(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${selected ? 'bg-secondary/15 border-secondary text-secondary font-bold' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Ingredient Input */}
          <form onSubmit={handleAddCustom}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Add Other Ingredients
            </label>
            <div className="flex">
              <input
                type="text"
                placeholder="e.g. Strawberry, Eggplant..."
                value={customIngredient}
                onChange={(e) => setCustomIngredient(e.target.value)}
                className="flex-grow px-4 py-2.5 text-xs bg-slate-50 border border-slate-100 rounded-l-xl focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-secondary text-slate-900 font-bold text-xs rounded-r-xl"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Selected items tray */}
          {ingredients.length > 0 && (
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Ingredients Selected ({ingredients.length})
              </span>
              <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50/50 rounded-2xl border border-slate-100 max-h-28 overflow-y-auto">
                {ingredients.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white text-slate-600 text-xs font-semibold rounded-lg border border-slate-100"
                  >
                    <span>{item}</span>
                    <button type="button" onClick={() => handleRemove(item)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Diet select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Diet Focus Preference
            </label>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/10 text-sm"
            >
              <option value="none">Standard Balanced</option>
              <option value="vegetarian">Vegetarian Plan</option>
              <option value="vegan">Vegan Plan</option>
              <option value="allergy-friendly">Allergy-Safe Focus</option>
            </select>
          </div>

          {/* Allergies Notice */}
          {allergiesList.length > 0 && (
            <div className="p-3 bg-rose-50/50 rounded-2xl border border-rose-100 flex items-start space-x-2 text-rose-500">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="text-[10px] leading-relaxed">
                <strong className="block font-bold">Safety Exclusion</strong>
                Meals will automatically omit allergens listed in profile: {allergiesList.join(', ')}.
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || ingredients.length === 0}
            className="w-full py-4 px-4 bg-secondary hover:bg-secondary/95 text-slate-900 font-bold text-sm rounded-xl shadow-soft hover:shadow-glow flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>Generate Healthy Diet</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* RIGHT COLUMN: Output display (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-start">
          
          <AnimatePresence mode="wait">
            {loading && (
              /* Loader */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center py-20 space-y-6"
              >
                <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h3 className="font-display font-bold text-lg text-slate-800 animate-pulse">Formulating baby meal ratios...</h3>
                <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
                  TinySteps is calculating balanced dietary fibers, vitamins, and minerals.
                </p>
                <div className="space-y-2 max-w-sm mx-auto pt-6 opacity-35">
                  <div className="h-4 bg-slate-100 rounded w-2/3 mx-auto shimmer" />
                  <div className="h-3 bg-slate-100 rounded w-1/2 mx-auto shimmer" />
                </div>
              </motion.div>
            )}

            {!loading && !result && (
              /* Empty state */
              /* Empty state */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center py-24 flex flex-col items-center justify-center h-full"
              >
                <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center mb-4 border border-slate-100">
                  <ChefHat className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-slate-700 text-lg mb-2">No Meal Plan Compiled Yet</h3>
                <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                  Select some fresh ingredients from the setting panel, then click "Generate Healthy Diet" to review children breakfast, lunch, and dinner.
                </p>
              </motion.div>
            )}

            {!loading && result && (
              /* Output results card */
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Result header */}
                <div className="bg-gradient-to-tr from-secondary to-orange-400 p-6 text-slate-900">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-800 bg-white/20 px-2.5 py-1 rounded-full border border-white/10">
                    Diet focus: {result.dietType}
                  </span>
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl mt-3 tracking-tight">
                    Healthy Kids Daily Meal Plan
                  </h3>
                  <span className="text-xs text-slate-700 block mt-1">
                    Ingredients utilized: {result.ingredientsUsed.join(', ')}
                  </span>
                </div>

                {/* Result Dishes list */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Breakfast */}
                  <div className="flex items-start space-x-4">
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-secondary flex items-center justify-center flex-shrink-0">
                      <Coffee className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Breakfast</h4>
                      <p className="text-sm font-semibold text-slate-800">{result.breakfast}</p>
                    </div>
                  </div>

                  {/* Lunch */}
                  <div className="flex items-start space-x-4">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-secondary flex items-center justify-center flex-shrink-0">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Lunch</h4>
                      <p className="text-sm font-semibold text-slate-800">{result.lunch}</p>
                    </div>
                  </div>

                  {/* Snack */}
                  <div className="flex items-start space-x-4">
                    <div className="w-9 h-9 rounded-xl bg-yellow-50 text-secondary flex items-center justify-center flex-shrink-0">
                      <Cookie className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Snack</h4>
                      <p className="text-sm font-semibold text-slate-800">{result.snack}</p>
                    </div>
                  </div>

                  {/* Dinner */}
                  <div className="flex items-start space-x-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">Dinner</h4>
                      <p className="text-sm font-semibold text-slate-800">{result.dinner}</p>
                    </div>
                  </div>

                  {/* Nutrition tips */}
                  <div className="border-t border-slate-50 pt-5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Pediatric Nutrition Advice
                    </h4>
                    <ul className="space-y-2">
                      {result.nutritionTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5">
                          <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-600 leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Card footer copy */}
                <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">Created via TinySteps AI Companion</span>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-secondary rounded-lg text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-all"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied Recipe!' : 'Copy Recipe'}</span>
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
