import React, { useState } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ReviewSubmitModalProps {
  product: Product;
  onClose: () => void;
}

export const ReviewSubmitModal: React.FC<ReviewSubmitModalProps> = ({ product, onClose }) => {
  const { showToast, refreshProducts, currentUser } = useShop();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState(currentUser?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Veuillez rédiger un court avis.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: name.trim() || 'Client NovaShop',
          rating,
          comment
        })
      });

      if (res.ok) {
        showToast('Merci ! Votre avis certifié a été publié. ⭐');
        await refreshProducts();
        onClose();
      } else {
        showToast('Erreur lors de la publication de l\'avis.');
      }
    } catch {
      showToast('Erreur de connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Donner mon avis</h3>
              <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Star selector */}
          <div className="text-center space-y-1.5 py-1">
            <label className="text-[11px] font-bold text-slate-300">Votre note globale :</label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRating(s)}
                  className="p-1 transition-transform active:scale-125"
                >
                  <Star
                    className={`w-7 h-7 ${
                      s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-[10px] text-amber-300 font-bold">
              {rating === 5 ? 'Excellent !' : rating === 4 ? 'Très bien' : rating === 3 ? 'Moyen' : 'Décevant'}
            </span>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Votre nom / ville :</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Eric N. (Douala)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Votre avis détaillé :</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience sur la qualité, la conformité, et la livraison..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Publication...' : 'Publier mon avis certifié'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
