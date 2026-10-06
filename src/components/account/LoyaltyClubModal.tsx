import React from 'react';
import { X, Award, Sparkles, Gift, CheckCircle2, ChevronRight, Crown } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface LoyaltyClubModalProps {
  onClose: () => void;
}

export const LoyaltyClubModal: React.FC<LoyaltyClubModalProps> = ({ onClose }) => {
  const { loyaltyPoints, formatPrice } = useShop();

  const getTier = (points: number) => {
    if (points >= 1000) return { name: 'Nova Black Diamond', badge: 'VIP Prestige', color: 'from-amber-400 via-rose-500 to-purple-600', nextTier: null, needed: 0, perk: '15% de remise + Livraison offerte 24/7' };
    if (points >= 500) return { name: 'Nova Gold Club', badge: 'VIP Gold', color: 'from-amber-500 to-yellow-600', nextTier: 'Nova Black Diamond', needed: 1000 - points, perk: '10% de remise sur chaque commande' };
    if (points >= 200) return { name: 'Nova Silver', badge: 'Membre Privilège', color: 'from-slate-400 to-slate-200 text-slate-900', nextTier: 'Nova Gold Club', needed: 500 - points, perk: '5% de remise + Cadeau anniversaire' };
    return { name: 'Nova Bronze', badge: 'Nouveau Membre', color: 'from-amber-700 to-amber-900', nextTier: 'Nova Silver', needed: 200 - points, perk: 'Points cumulables à chaque achat' };
  };

  const currentTier = getTier(loyaltyPoints);
  const discountEquivalent = loyaltyPoints * 10; // 1 pt = 10 FCFA

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">NovaClub VIP Rewards</h3>
              <p className="text-[10px] text-slate-400">Programme de fidélité Cameroun</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto">
          {/* VIP Card */}
          <div className={`p-5 rounded-3xl bg-gradient-to-br ${currentTier.color} text-white shadow-xl space-y-3 relative overflow-hidden`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest bg-black/30 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/20">
                  {currentTier.badge}
                </span>
                <h4 className="text-lg font-black tracking-tight mt-1">{currentTier.name}</h4>
              </div>
              <Sparkles className="w-6 h-6 text-amber-200 animate-pulse" />
            </div>

            <div className="pt-2">
              <p className="text-[10px] uppercase font-bold text-white/80">Solde de Points Actuel :</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight">{loyaltyPoints}</span>
                <span className="text-xs font-bold text-white/90">Points Nova</span>
              </div>
              <p className="text-[11px] font-medium text-white/90 mt-0.5">
                Équivalent à <span className="font-black underline">{formatPrice(discountEquivalent)}</span> de réduction immédiate !
              </p>
            </div>
          </div>

          {/* Progress bar to next tier */}
          {currentTier.nextTier && (
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 font-semibold">Progression vers {currentTier.nextTier}</span>
                <span className="font-bold text-amber-400 font-mono">+{currentTier.needed} pts</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (loyaltyPoints / (loyaltyPoints + currentTier.needed)) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Perks list */}
          <div className="space-y-2">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Vos Privilèges Membre</h5>
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">{currentTier.perk}</p>
                  <p className="text-[10px] text-slate-400">Appliqué automatiquement lors du paiement</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white text-xs">Cumul automatique à chaque achat</p>
                  <p className="text-[10px] text-slate-400">1 000 FCFA dépensés = 1 Point Nova gagné</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
