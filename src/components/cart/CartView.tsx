import React, { useState } from 'react';
import { 
  ShoppingBag, Trash2, ArrowRight, ShieldCheck, 
  Truck, Tag, Sparkles, MessageSquare, AlertCircle, 
  MapPin, Check 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const CartView: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    formatPrice, 
    subtotal, 
    deliveryFee, 
    total, 
    applyCoupon, 
    removeCoupon,
    couponCode, 
    couponDiscount,
    deliveryZones,
    selectedZone,
    setSelectedZone,
    setIsCheckoutOpen,
    setActiveTab,
    showToast
  } = useShop();

  const [inputCoupon, setInputCoupon] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;

    setIsApplyingCoupon(true);
    await applyCoupon(inputCoupon.trim());
    setIsApplyingCoupon(false);
    setInputCoupon('');
  };

  const handleQuickWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const itemsList = cart.map(i => `• ${i.product.name} (Qté: ${i.quantity}) - ${formatPrice((i.product.discountPrice || i.product.price) * i.quantity)}`).join('\n');
    const msg = `Bonjour NovaShop Cameroun! Je souhaite passer commande directement via WhatsApp:\n\n${itemsList}\n\n*Total*: ${formatPrice(total)}\n*Zone*: ${selectedZone.name}\n\nMerci de me contacter pour la livraison!`;
    
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(msg).catch(() => {});
    }
    showToast('Détails de commande copiés dans le presse-papier !');
  };

  const amountNeededForFreeDelivery = Math.max(0, selectedZone.freeDeliveryThreshold - subtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / selectedZone.freeDeliveryThreshold) * 100));

  if (cart.length === 0) {
    return (
      <div className="pb-28 text-slate-100 flex flex-col items-center justify-center min-h-[70vh] p-6 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="space-y-1">
          <h3 className="font-extrabold text-base text-white">Votre panier est vide</h3>
          <p className="text-xs text-slate-400 max-w-xs">
            Découvrez nos smartphones, équipements solaires et nouveautés avec livraison express au Cameroun.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('shop')}
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-95"
        >
          <span>Commencer mes achats</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="pb-32 text-slate-100 space-y-4">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-blue-400" />
          <h2 className="font-black text-base text-white tracking-tight">Mon Panier</h2>
          <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
            {cart.reduce((a, b) => a + b.quantity, 0)} articles
          </span>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Vider</span>
        </button>
      </header>

      <div className="px-4 space-y-4">
        {/* Free delivery threshold progress bar */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              {amountNeededForFreeDelivery === 0 ? (
                <span className="text-emerald-400 font-bold">Félicitations ! Livraison Gratuite activée 🎉</span>
              ) : (
                <span>Ajoutez <strong className="text-white">{formatPrice(amountNeededForFreeDelivery)}</strong> pour la livraison offerte</span>
              )}
            </span>
            <span className="font-mono text-[10px] text-slate-400">{freeDeliveryPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/60">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${freeDeliveryPercent}%` }}
            />
          </div>
        </div>

        {/* Cart items list */}
        <div className="space-y-2.5">
          {cart.map((item, idx) => {
            const effPrice = item.product.discountPrice || item.product.price;
            return (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800/90 flex gap-3 items-center"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-950 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-bold text-xs text-white truncate">{item.product.name}</h4>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] font-black text-blue-400 font-mono">
                    {formatPrice(effPrice)}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-800 rounded-xl bg-slate-950 px-2 py-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="text-slate-400 hover:text-white px-1.5 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-bold text-xs text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="text-slate-400 hover:text-white px-1.5 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-[11px] font-bold text-slate-300 font-mono">
                      {formatPrice(effPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Promo code form */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          {couponCode ? (
            <div className="flex items-center justify-between text-xs bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-300">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Code <strong>{couponCode}</strong> (-{formatPrice(couponDiscount)})</span>
              </div>
              <button onClick={removeCoupon} className="text-rose-400 hover:underline font-bold">
                Retirer
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value)}
                placeholder="Code Promo (ex: WELCOME10, NOVA2026)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 uppercase focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={isApplyingCoupon}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shrink-0 transition-colors"
              >
                {isApplyingCoupon ? '...' : 'Appliquer'}
              </button>
            </form>
          )}
        </div>

        {/* Delivery zone selection */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
          <label className="font-bold text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>Zone de livraison Cameroun :</span>
          </label>
          <select
            value={selectedZone.id}
            onChange={(e) => {
              const zone = deliveryZones.find(z => z.id === e.target.value);
              if (zone) setSelectedZone(zone);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {deliveryZones.map(z => (
              <option key={z.id} value={z.id}>
                {z.name} ({z.fee === 0 ? 'Gratuit' : `${z.fee.toLocaleString('fr-FR')} FCFA`} • {z.estimatedHours})
              </option>
            ))}
          </select>
        </div>

        {/* Pricing breakdown */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Sous-total articles :</span>
            <span className="font-mono text-slate-200">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-slate-400">
            <span>Frais de livraison ({selectedZone.city}) :</span>
            <span className="font-mono text-slate-200">
              {deliveryFee === 0 ? <strong className="text-emerald-400">Gratuit</strong> : formatPrice(deliveryFee)}
            </span>
          </div>

          {couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-400">
              <span>Remise promo ({couponCode}) :</span>
              <span className="font-mono">-{formatPrice(couponDiscount)}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-black text-sm">
            <span className="text-white">Total à régler :</span>
            <span className="text-blue-400 font-mono text-lg">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Primary Checkout CTA */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30 transition-all active:scale-[0.98]"
          >
            <span>Passer à la caisse</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleQuickWhatsAppOrder}
            className="w-full py-2.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Copier le récapitulatif pour commande WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
