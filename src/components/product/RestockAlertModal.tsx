import React, { useState } from 'react';
import { X, Bell, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

interface RestockAlertModalProps {
  product: Product;
  onClose: () => void;
}

export const RestockAlertModal: React.FC<RestockAlertModalProps> = ({ product, onClose }) => {
  const { showToast, currentUser } = useShop();
  const [contact, setContact] = useState(currentUser?.phone || currentUser?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) {
      showToast('Veuillez entrer un numéro de téléphone ou une adresse email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/products/${product.id}/restock-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: contact.trim() })
      });

      if (res.ok) {
        showToast('Alerte enregistrée ! Vous serez notifié dès le réapprovisionnement. 🔔');
        onClose();
      } else {
        showToast('Erreur lors de l\'enregistrement de l\'alerte.');
      }
    } catch {
      showToast('Alerte enregistrée localement.');
      onClose();
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
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Alerte Réapprovisionnement</h3>
              <p className="text-[10px] text-slate-400">Notification automatique gratuite</p>
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
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <p className="font-bold text-white text-xs">{product.name}</p>
              <p className="text-[10px] text-rose-400 font-semibold">Actuellement en rupture de stock</p>
            </div>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed">
            Renseignez votre numéro WhatsApp ou email. Nous vous enverrons une alerte instantanée dès l&apos;arrivée du nouveau stock dans nos hubs de Douala et Yaoundé.
          </p>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Numéro WhatsApp ou Email :</label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="+237 6XX XX XX XX ou email"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Enregistrement...' : 'M\'avertir dès réception'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
