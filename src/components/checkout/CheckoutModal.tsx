import React, { useState } from 'react';
import { 
  X, Check, ShieldCheck, MapPin, Phone, 
  CreditCard, Smartphone, DollarSign, Truck, AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../../context/ShopContext';
import { workspaceService } from '../../services/workspaceService';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    subtotal, 
    deliveryFee, 
    total, 
    selectedZone, 
    currentUser, 
    formatPrice, 
    placeOrder, 
    setActiveTab, 
    savedAddresses,
    showToast 
  } = useShop();

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [city, setCity] = useState(selectedZone.city);
  const [neighborhood, setNeighborhood] = useState('');
  const [street, setStreet] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mtn_momo' | 'orange_money' | 'card' | 'cod'>('mtn_momo');
  const [momoNumber, setMomoNumber] = useState(currentUser?.phone || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [momoPromptOpen, setMomoPromptOpen] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleSelectSavedAddress = (addrId: string) => {
    const found = savedAddresses.find(a => a.id === addrId);
    if (found) {
      setFullName(found.fullName);
      setPhone(found.phone);
      setCity(found.city);
      setNeighborhood(found.neighborhood || '');
      setStreet(found.street);
      setNotes(found.notes || '');
      showToast('Adresse pré-remplie ! 📍');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street) {
      showToast('Veuillez remplir les informations obligatoires de livraison.');
      return;
    }

    // If mobile money, simulate the interactive USSD confirmation prompt
    if (paymentMethod === 'mtn_momo' || paymentMethod === 'orange_money') {
      setMomoPromptOpen(true);
      return;
    }

    await finalizeOrder();
  };

  const finalizeOrder = async () => {
    setIsProcessing(true);
    setMomoPromptOpen(false);

    try {
      const order = await placeOrder({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'successful',
        paymentReference: paymentMethod === 'mtn_momo' 
          ? `MOMO-${Math.floor(100000 + Math.random() * 900000)}` 
          : paymentMethod === 'orange_money' 
          ? `OM-${Math.floor(100000 + Math.random() * 900000)}` 
          : 'COD-CONFIRMED',
        deliveryMethod: 'standard',
        deliveryAddress: {
          fullName,
          phone,
          city,
          neighborhood,
          street,
          notes
        }
      });

      // Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Google Calendar delivery event scheduling
      try {
        await workspaceService.scheduleDeliveryCalendarEvent(order.id, 'Aujourd\'hui 16h00', fullName);
      } catch {}

      setIsCheckoutOpen(false);
      setActiveTab('orders');
    } catch {
      showToast('Une erreur est survenue lors du paiement.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md max-h-[95vh] sm:max-h-[90vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Finaliser la Commande</h3>
              <p className="text-[10px] text-slate-400">{cart.length} article(s) • Total : {formatPrice(total)}</p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          
          {/* Saved addresses selector if available */}
          {savedAddresses.length > 0 && (
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 text-[11px]">Utiliser une adresse enregistrée :</label>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {savedAddresses.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => handleSelectSavedAddress(a.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 text-slate-300 text-[11px] font-semibold shrink-0"
                  >
                    📍 {a.label} ({a.city})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Coordinates */}
          <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Adresse de Livraison au Cameroun</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Alain Mbida"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400">Téléphone (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+237 6XX XX XX XX"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Ville</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                >
                  <option value="Douala">Douala</option>
                  <option value="Yaoundé">Yaoundé</option>
                  <option value="Bafoussam">Bafoussam</option>
                  <option value="Kribi">Kribi</option>
                  <option value="Limbe">Limbe</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400">Quartier</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Akwa, Bastos..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400">Rue / Immeuble / Repère exact *</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Ex: Face station Total, Immeuble Rose 2e étage"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Moyen de Paiement Sécurisé</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('mtn_momo')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'mtn_momo'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-amber-300">MTN MoMo</span>
                  <Smartphone className="w-4 h-4" />
                </div>
                <span className="text-[10px] mt-1 text-slate-300">*126# Push Direct</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('orange_money')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'orange_money'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-200 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-orange-300">Orange Money</span>
                  <Smartphone className="w-4 h-4" />
                </div>
                <span className="text-[10px] mt-1 text-slate-300">*150# Push Direct</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-emerald-300">À la livraison</span>
                  <DollarSign className="w-4 h-4" />
                </div>
                <span className="text-[10px] mt-1 text-slate-300">Cash à Douala/Ydé</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-200 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs text-blue-300">Carte Bancaire</span>
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-[10px] mt-1 text-slate-300">Visa / Mastercard</span>
              </button>
            </div>

            {/* Mobile money phone number confirmation input */}
            {(paymentMethod === 'mtn_momo' || paymentMethod === 'orange_money') && (
              <div className="pt-2">
                <label className="text-[10px] font-semibold text-slate-400">
                  Numéro de débit {paymentMethod === 'mtn_momo' ? 'MTN' : 'Orange'} :
                </label>
                <input
                  type="tel"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  placeholder="+237 6XX XX XX XX"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1"
                />
              </div>
            )}
          </div>

          {/* Pricing recap */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Articles :</span>
              <span className="font-mono text-slate-200">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Livraison ({city}) :</span>
              <span className="font-mono text-slate-200">{deliveryFee === 0 ? 'Gratuit' : formatPrice(deliveryFee)}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-800 flex justify-between font-black text-sm">
              <span className="text-white">Total TTC :</span>
              <span className="text-blue-400 font-mono text-base">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? 'Traitement en cours...' : `Confirmer et Régler ${formatPrice(total)}`}</span>
          </button>
        </form>

        {/* Interactive USSD Push Simulation Dialog */}
        {momoPromptOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-xs bg-slate-900 border border-amber-500/50 rounded-3xl p-5 text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto animate-pulse">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-sm text-white">Validation USSD en cours</h4>
                <p className="text-xs text-slate-300">
                  Une invite de paiement <strong className="text-amber-300">{formatPrice(total)}</strong> a été envoyée sur votre téléphone {momoNumber || phone}.
                </p>
                <p className="text-[10px] text-slate-500 font-mono pt-1">
                  Veuillez composer votre code secret PIN {paymentMethod === 'mtn_momo' ? '*126#' : '*150#'}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={finalizeOrder}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
                >
                  J&apos;ai confirmé sur mon téléphone ✓
                </button>
                <button
                  type="button"
                  onClick={() => setMomoPromptOpen(false)}
                  className="text-xs text-slate-400 hover:underline"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
