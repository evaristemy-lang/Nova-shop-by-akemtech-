import React, { useState } from 'react';
import { 
  Sparkles, X, Send, Bot, User as UserIcon, 
  ShoppingBag, ArrowRight, Zap 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { geminiService } from '../../services/geminiService';
import { Product } from '../../types';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  recommendedProducts?: Product[];
}

export const FloatingAIAssistant: React.FC = () => {
  const { 
    isAIAssistantOpen, 
    setIsAIAssistantOpen, 
    products, 
    formatPrice, 
    addToCart, 
    setSelectedProduct 
  } = useShop();

  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Bonjour ! Je suis l\'assistant d\'achat IA de NovaShop Cameroun. Que recherchez-vous aujourd\'hui ?',
      recommendedProducts: [products[0], products[3]]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAIAssistantOpen) return null;

  const quickPrompts = [
    'Smartphones 5G avec bonne caméra',
    'Kit solaire anti-coupure de courant',
    'Pack tablette étudiant avec clavier',
    'Casque audio avec réduction de bruit'
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt) return;

    setInputPrompt('');
    setMessages(prev => [...prev, { role: 'user', text: prompt }]);
    setIsLoading(true);

    try {
      const result = await geminiService.askShoppingAssistant(prompt, products);
      
      const recProducts = (result.recommendedProductIds || [])
        .map(id => products.find(p => p.id === id))
        .filter((p): p is Product => Boolean(p));

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: result.text,
          recommendedProducts: recProducts.length > 0 ? recProducts : undefined
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Je vous conseille de regarder notre catalogue de smartphones 5G et nos kits solaires anti-délestage !'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md h-[92vh] sm:h-[82vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white">Assistant IA Shopping</h3>
                <span className="text-[8px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded">
                  GEMINI
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Recommandations en temps réel • Catalogue Cameroun</p>
            </div>
          </div>
          <button
            onClick={() => setIsAIAssistantOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-950/40">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm shadow'
                    : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700/60 shadow-inner'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>

                {/* Embedded Recommendation Cards */}
                {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-700/60">
                    <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wide">
                      Articles suggérés :
                    </p>
                    {m.recommendedProducts.map(prod => (
                      <div
                        key={prod.id}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between gap-2"
                      >
                        <div
                          onClick={() => {
                            setSelectedProduct(prod);
                            setIsAIAssistantOpen(false);
                          }}
                          className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                        >
                          <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <p className="font-bold text-white text-[11px] truncate">{prod.name}</p>
                            <p className="text-[10px] font-mono text-blue-400 font-black">
                              {formatPrice(prod.discountPrice || prod.price)}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(prod, 1)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center gap-1 shrink-0 shadow-sm"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Ajouter</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>L&apos;IA analyse les meilleurs produits pour vous...</span>
            </div>
          )}
        </div>

        {/* Quick prompt chips */}
        <div className="px-3 pt-2 bg-slate-950 border-t border-slate-800 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {quickPrompts.map((qp, qIdx) => (
            <button
              key={qIdx}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 whitespace-nowrap"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-slate-950 flex gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ex: quel téléphone me conseilles-tu ?"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white transition-all disabled:opacity-40 shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
