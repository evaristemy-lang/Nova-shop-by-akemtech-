import React, { useState } from 'react';
import { X, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Order } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ReturnRequestModalProps {
  order: Order;
  onClose: () => void;
}

export const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({ order, onClose }) => {
  const { formatPrice, showToast, refreshOrders } = useShop();
  const [reason, setReason] = useState('Produit défectueux ou endommagé');
  const [details, setDetails] = useState('');
  const [refundMethod, setRefundMethod] = useState<'momo' | 'om' | 'credit'>('momo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const returnReasons = [
    'Produit défectueux ou endommagé',
    'Article non conforme à la description',
    'Mauvaise taille ou couleur reçue',
    'Accessoire manquant dans la boîte',
    'Changement d\'avis (garantie 7 jours)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/orders/${order.id}/return-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          details,
          refundMethod
        })
      });

      if (res.ok) {
        showToast('Demande de retour enregistrée ! Notre équipe vous contactera sous 24h.');
        await refreshOrders();
        onClose();
      } else {
        showToast('Erreur lors de l\'enregistrement de la demande.');
      }
    } catch {
      showToast('Erreur de connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Demande de Retour / Échange</h3>
              <p className="text-[10px] text-slate-400 font-mono">Commande #{order.id}</p>
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
          <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/20 flex items-start gap-2.5 text-blue-200">
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Garantie NovaShop Cameroun : retour et échange sans frais sous 7 jours ouvrés après réception.
            </p>
          </div>

          {/* Reason Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Motif principal du retour *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {returnReasons.map((r, idx) => (
                <option key={idx} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Details / Explanation */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Précisions supplémentaires</label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Décrivez brièvement le problème constaté avec le produit..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600 resize-none"
            />
          </div>

          {/* Refund Method Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300">Mode de remboursement souhaité</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRefundMethod('momo')}
                className={`p-2.5 rounded-xl border text-center font-bold text-[10px] transition-all ${
                  refundMethod === 'momo'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                MTN MoMo
              </button>
              <button
                type="button"
                onClick={() => setRefundMethod('om')}
                className={`p-2.5 rounded-xl border text-center font-bold text-[10px] transition-all ${
                  refundMethod === 'om'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Orange Money
              </button>
              <button
                type="button"
                onClick={() => setRefundMethod('credit')}
                className={`p-2.5 rounded-xl border text-center font-bold text-[10px] transition-all ${
                  refundMethod === 'credit'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                Avoir NovaShop
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isSubmitting ? 'Traitement en cours...' : 'Envoyer la demande de retour'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
