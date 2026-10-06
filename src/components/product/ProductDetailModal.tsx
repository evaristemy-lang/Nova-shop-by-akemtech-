import React, { useState, useEffect } from 'react';
import { 
  X, Heart, Star, ShoppingBag, Zap, ShieldCheck, Truck, 
  RotateCcw, Sparkles, Check, ChevronRight, Play, MapPin, 
  MessageSquare, Scale, Bell, Plus, Share2 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    wishlist, 
    toggleWishlist, 
    formatPrice, 
    setIsCheckoutOpen,
    setIsAIAssistantOpen,
    products,
    addToCompare,
    compareProductIds,
    recordRecentlyViewed,
    setActiveRestockProduct,
    setActiveReviewProduct,
    showToast
  } = useShop();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  useEffect(() => {
    if (selectedProduct) {
      recordRecentlyViewed(selectedProduct.id);
      setSelectedImageIdx(0);
      setIsVideoPlaying(false);
      setQuantity(1);
    }
  }, [selectedProduct?.id]);

  if (!selectedProduct) return null;

  const isWishlisted = wishlist.includes(selectedProduct.id);
  const isCompared = compareProductIds.includes(selectedProduct.id);
  
  let variantPriceModifier = 0;
  selectedProduct.variations.forEach(v => {
    if (selectedVariations[v.type] === v.name && v.priceModifier) {
      variantPriceModifier += v.priceModifier;
    }
  });

  const basePrice = (selectedProduct.discountPrice || selectedProduct.price) + variantPriceModifier;
  const regularPrice = selectedProduct.price + variantPriceModifier;
  const discountPercent = selectedProduct.discountPrice 
    ? Math.round(((selectedProduct.price - selectedProduct.discountPrice) / selectedProduct.price) * 100)
    : 0;

  const handleSelectVariation = (type: string, value: string) => {
    setSelectedVariations(prev => ({ ...prev, [type]: value }));
  };

  const handleAddToCart = () => {
    if (!selectedProduct.inStock) {
      setActiveRestockProduct(selectedProduct);
      return;
    }
    addToCart(selectedProduct, quantity, selectedVariations);
  };

  const handleBuyNow = () => {
    if (!selectedProduct.inStock) {
      setActiveRestockProduct(selectedProduct);
      return;
    }
    addToCart(selectedProduct, quantity, selectedVariations);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleOrderViaWhatsApp = () => {
    const varText = Object.entries(selectedVariations).map(([k, v]) => `${k}: ${v}`).join(', ');
    const msg = `Bonjour NovaShop Cameroun! Je souhaite commander directement :\n\n*${selectedProduct.name}*\nRéf: ${selectedProduct.id}\nPrix: ${formatPrice(basePrice)}\n${varText ? `Variantes: ${varText}\n` : ''}Quantité: ${quantity}\n\nMerci de me confirmer la disponibilité et la livraison express.`;
    
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(msg).catch(() => {});
    }
    showToast('Message de commande WhatsApp copié dans le presse-papier ! 📲');
  };

  const relatedProducts = products
    .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md max-h-[94vh] sm:max-h-[85vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="sticky top-0 z-10 px-4 py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-blue-400">
              {selectedProduct.category}
            </span>
            {selectedProduct.brand && (
              <span className="text-[10px] text-slate-400 font-semibold">• {selectedProduct.brand}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addToCompare(selectedProduct)}
              className="p-2 rounded-full text-slate-400 hover:text-blue-400 bg-slate-800/80 transition-colors"
              title="Comparer"
            >
              <Scale className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleWishlist(selectedProduct.id)}
              className="p-2 rounded-full text-slate-400 hover:text-rose-400 bg-slate-800/80 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => setSelectedProduct(null)}
              className="p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Main Media Showcase */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[4/3]">
            {isVideoPlaying && selectedProduct.videoUrl ? (
              <video
                src={selectedProduct.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={selectedProduct.images[selectedImageIdx] || selectedProduct.images[0]}
                alt={selectedProduct.name}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover transition-all duration-300"
              />
            )}

            {selectedProduct.videoUrl && !isVideoPlaying && (
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold hover:bg-blue-600 transition-colors border border-white/20 shadow-lg"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Vidéo démo
              </button>
            )}

            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discountPercent > 0 && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-md">
                  PROMO -{discountPercent}%
                </span>
              )}
              {selectedProduct.isBestSeller && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-md">
                  TOP VENTE
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails Row */}
          {selectedProduct.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImageIdx(idx);
                    setIsVideoPlaying(false);
                  }}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIdx === idx && !isVideoPlaying
                      ? 'border-blue-500 scale-105'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Product Title & Ratings */}
          <div className="space-y-1">
            <h2 className="text-base font-black text-white leading-snug">{selectedProduct.name}</h2>
            <div className="flex items-center gap-2 text-slate-400">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{selectedProduct.rating}</span>
              </div>
              <span>•</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="hover:underline text-blue-400"
              >
                {selectedProduct.reviewsCount} avis clients
              </button>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">
                {selectedProduct.inStock ? `En stock (${selectedProduct.stockCount})` : 'Rupture de stock'}
              </span>
            </div>
          </div>

          {/* Pricing & Stock status */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-blue-400 font-mono">
                  {formatPrice(basePrice)}
                </span>
                {selectedProduct.discountPrice && (
                  <span className="text-xs text-slate-500 line-through">
                    {formatPrice(regularPrice)}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">Prix TTC en FCFA (TVA incluse)</p>
            </div>

            <div className="text-right">
              {selectedProduct.inStock ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  Livraison 2h à Douala
                </span>
              ) : (
                <button
                  onClick={() => setActiveRestockProduct(selectedProduct)}
                  className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-[10px] flex items-center gap-1 border border-amber-500/30"
                >
                  <Bell className="w-3 h-3" />
                  M&apos;alerter
                </button>
              )}
            </div>
          </div>

          {/* Variations selector */}
          {selectedProduct.variations.length > 0 && (
            <div className="space-y-2">
              <label className="font-bold text-slate-300 text-xs">Options & Variantes :</label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.variations.map(v => {
                  const isSelected = selectedVariations[v.type] === v.name;
                  return (
                    <button
                      key={v.id}
                      onClick={() => handleSelectVariation(v.type, v.name)}
                      className={`px-3 py-1.5 rounded-xl border font-semibold text-xs transition-all ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {v.name}
                      {v.priceModifier ? ` (+${formatPrice(v.priceModifier)})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab Navigation (Details / Specs / Reviews) */}
          <div className="flex border-b border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-2 font-bold border-b-2 transition-colors ${
                activeTab === 'details' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`flex-1 py-2 font-bold border-b-2 transition-colors ${
                activeTab === 'specs' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'
              }`}
            >
              Fiche Technique
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-2 font-bold border-b-2 transition-colors ${
                activeTab === 'reviews' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400'
              }`}
            >
              Avis ({selectedProduct.reviewsCount})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <div className="space-y-3 leading-relaxed text-slate-300">
              <p>{selectedProduct.description}</p>
              {selectedProduct.warranty && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-[11px]">{selectedProduct.warranty}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 divide-y divide-slate-800/60">
              {selectedProduct.specifications.map((spec, idx) => (
                <div key={idx} className="flex justify-between px-3 py-2 text-[11px]">
                  <span className="text-slate-400">{spec.name}</span>
                  <span className="text-white font-medium text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Avis Clients Certifiés</span>
                <button
                  onClick={() => setActiveReviewProduct(selectedProduct)}
                  className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold"
                >
                  + Rédiger un avis
                </button>
              </div>

              {selectedProduct.reviews.length === 0 ? (
                <p className="text-slate-500 text-center py-4">Soyez le premier à donner votre avis sur ce produit.</p>
              ) : (
                <div className="space-y-2">
                  {selectedProduct.reviews.map(rev => (
                    <div key={rev.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-[11px]">{rev.userName}</span>
                        <span className="text-amber-400 text-[10px]">{'★'.repeat(rev.rating)}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{rev.comment}</p>
                      <p className="text-[9px] text-slate-500">{rev.date} • Achat vérifié</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="font-bold text-slate-400 uppercase text-[10px]">Produits similaires recommandés</h4>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {relatedProducts.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => setSelectedProduct(rel)}
                    className="w-28 p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer shrink-0"
                  >
                    <img src={rel.images[0]} alt={rel.name} className="w-full h-20 object-cover rounded-lg mb-1" />
                    <p className="text-[10px] font-bold text-white truncate">{rel.name}</p>
                    <p className="text-[10px] font-mono text-blue-400">{formatPrice(rel.discountPrice || rel.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Mobile Purchase Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          {/* Quantity Selector */}
          <div className="flex items-center border border-slate-800 rounded-xl bg-slate-900 px-2 py-1 shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-slate-400 hover:text-white px-1.5 font-bold text-sm"
            >
              -
            </button>
            <span className="px-2 font-bold text-xs">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(selectedProduct.stockCount, quantity + 1))}
              className="text-slate-400 hover:text-white px-1.5 font-bold text-sm"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Ajouter</span>
          </button>

          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4" />
            <span>Acheter</span>
          </button>

          {/* WhatsApp Direct Order Button */}
          <button
            onClick={handleOrderViaWhatsApp}
            className="p-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
            title="Copier le message de commande WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
