import React, { useState } from 'react';
import { 
  X, Send, Paperclip, Headphones, ShieldCheck, 
  Package, Image as ImageIcon, CheckCircle2 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const SupportChatModal: React.FC = () => {
  const { 
    isSupportChatOpen, 
    setIsSupportChatOpen, 
    activeConversation, 
    sendSupportMessage,
    orders,
    formatPrice
  } = useShop();

  const [messageText, setMessageText] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [showOrderPicker, setShowOrderPicker] = useState(false);

  if (!isSupportChatOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const text = messageText.trim();
    const orderId = selectedOrderId || undefined;
    setMessageText('');
    setSelectedOrderId('');
    setShowOrderPicker(false);

    await sendSupportMessage(text, orderId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md h-[92vh] sm:h-[80vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white">Support Client NovaShop</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-slate-400">Équipe basée à Douala • Réponse rapide 7j/7</p>
            </div>
          </div>
          <button
            onClick={() => setIsSupportChatOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-950/40">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
            <p className="font-bold text-white text-[11px]">Bienvenue sur l&apos;assistance en direct !</p>
            <p className="text-[10px] text-slate-400">
              Posez toutes vos questions sur vos livraisons, garanties constructeur ou paiements Mobile Money.
            </p>
          </div>

          {activeConversation?.messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <span className="text-[9px] text-slate-500 font-medium px-1">
                  {msg.senderName} • {msg.timestamp}
                </span>

                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700/60'
                  }`}
                >
                  {msg.attachedOrderId && (
                    <div className="mb-2 p-2 rounded-xl bg-black/20 border border-white/10 text-[10px] flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-blue-200" />
                      <span>Réf. Commande: #{msg.attachedOrderId}</span>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Attachment Picker dropdown if opened */}
        {showOrderPicker && (
          <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
              <span>Sélectionner une commande à joindre au message :</span>
              <button onClick={() => setShowOrderPicker(false)} className="text-slate-400 hover:text-white">Fermer</button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {orders.map(o => (
                <button
                  key={o.id}
                  onClick={() => {
                    setSelectedOrderId(o.id);
                    setShowOrderPicker(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-[10px] font-mono shrink-0 transition-colors ${
                    selectedOrderId === o.id
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  #{o.id} ({formatPrice(o.total)})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
          {selectedOrderId && (
            <div className="flex items-center justify-between bg-blue-600/20 border border-blue-500/30 px-3 py-1.5 rounded-xl text-[10px] text-blue-200">
              <span>Commande jointe: #{selectedOrderId}</span>
              <button onClick={() => setSelectedOrderId('')} className="text-slate-400 hover:text-white">×</button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOrderPicker(!showOrderPicker)}
              className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
              title="Joindre une commande"
            >
              <Package className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={!messageText.trim()}
              className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-40 disabled:hover:bg-blue-600 active:scale-95 shadow-md shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
