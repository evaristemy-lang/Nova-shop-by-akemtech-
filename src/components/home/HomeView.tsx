import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, Search, Bell, ShieldCheck, Truck, RotateCcw, 
  ArrowRight, Star, Heart, ShoppingBag, 
  Smartphone, Headphones, GraduationCap, Shirt, Sun, 
  ChevronRight, Percent, HeadphonesIcon, Clock, Zap, CheckCircle2,
  Mic, Scale, Award, Flame, Eye, Download
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCategory, Product, CurrencyCode } from '../../types';
import { ProductCard } from '../common/ProductCard';

export const HomeView: React.FC = () => {
  const { 
    products, 
    setSelectedCategory, 
    setActiveTab, 
    setSelectedProduct, 
    formatPrice, 
    currentUser, 
    unreadNotificationsCount, 
    markNotificationsAsRead,
    setIsAIAssistantOpen,
    setIsSupportChatOpen,
    setIsApkModalOpen,
    currency,
    setCurrency,
    compareProductIds,
    setIsCompareOpen,
    recentlyViewedIds,
    showToast,
    setSearchQuery
  } = useShop();

  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const [flashTime, setFlashTime] = useState({ h: 5, m: 34, s: 18 });
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  // Live countdown ticker for Flash Deals
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: 59, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return { h: 6, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'fr-FR';
        recognition.start();
        setIsListeningVoice(true);
        showToast('Parlez maintenant... 🎙️');
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          setActiveTab('shop');
          setIsListeningVoice(false);
        };
        recognition.onerror = () => {
          setIsListeningVoice(false);
          showToast('Recherche vocale: dites votre besoin');
        };
        recognition.onend = () => setIsListeningVoice(false);
      } catch {
        showToast('Recherche vocale non disponible');
      }
    } else {
      showToast('Recherche vocale : ouvrez le catalogue');
      setActiveTab('shop');
    }
  };

  const promoBanners = [
    {
      title: 'Grand Déstockage Rentrée & High-Tech',
      subtitle: 'Tablettes ScholarPro, Laptops & Sacs étanches jusqu\'à -25% à Douala et Yaoundé',
      badge: 'PROMO RENTRÉE',
      action: 'student' as ProductCategory,
      bg: 'from-blue-600 via-indigo-600 to-purple-700'
    },
    {
      title: 'NovaPhone 5G Apex Flagship',
      subtitle: 'Capteur 108MP, Charge 68W & Garantie 2 ans disponible en stock immédiat',
      badge: 'TOP VENTES',
      action: 'smartphones' as ProductCategory,
      bg: 'from-amber-600 via-rose-600 to-purple-700'
    },
    {
      title: 'Kit Solaire Domestique Anti-Délestage',
      subtitle: 'Éclairage 4 pièces + Station de charge téléphone sécurisée',
      badge: 'ÉNERGIE PROPRE',
      action: 'home' as ProductCategory,
      bg: 'from-emerald-600 via-teal-600 to-cyan-700'
    }
  ];

  const categories = [
    { id: 'all' as const, label: 'Tous' },
    { id: 'smartphones' as const, label: 'Smartphones' },
    { id: 'electronics' as const, label: 'Électronique' },
    { id: 'student' as const, label: 'Étudiants' },
    { id: 'home' as const, label: 'Solaire & Maison' },
    { id: 'fashion' as const, label: 'Mode' },
    { id: 'beauty' as const, label: 'Beauté Bio' }
  ];

  const featured = useMemo(() => products.filter(p => p.isFeatured), [products]);
  const bestSellers = useMemo(() => products.filter(p => p.isBestSeller), [products]);
  const newArrivals = useMemo(() => products.filter(p => p.isNew), [products]);
  const specialOffers = useMemo(() => products.filter(p => p.discountPrice && p.discountPrice < p.price), [products]);

  const handleCategoryClick = (catId: ProductCategory | 'all') => {
    setSelectedCategory(catId);
    setActiveTab('shop');
  };

  return (
    <div className="pb-28 text-slate-100 space-y-5">
      {/* Top Mobile Header */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/30">
              N
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-sm tracking-tight text-white">NovaShop</h1>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CAMEROUN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                {currentUser ? `Bienvenue, ${currentUser.name.split(' ')[0]}!` : 'E-Commerce Douala & Yaoundé'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 rounded-2xl bg-gradient-to-r from-blue-600/30 via-indigo-600/30 to-purple-600/30 border border-indigo-500/40 text-blue-300 hover:text-white transition-all active:scale-95 shadow-sm"
              aria-label="Ouvrir l'assistant IA"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask AI</span>
            </button>

            <button
              onClick={markNotificationsAsRead}
              className="relative p-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse"></span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Shortcut with Natural Language prompt & Voice Search */}
        <div className="mt-3 flex items-center gap-2">
          <div
            onClick={() => setActiveTab('shop')}
            className="flex-1 flex items-center bg-slate-900 border border-slate-800/90 rounded-2xl px-3.5 py-2.5 text-xs text-slate-400 cursor-pointer hover:border-slate-700 transition-colors shadow-inner"
          >
            <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
            <span className="flex-1 truncate">Rechercher: &quot;moins de 50 000 FCFA&quot;, &quot;téléphone 5G&quot;...</span>
            <span className="flex items-center gap-1 text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-300" /> Smart Search
            </span>
          </div>

          <button
            onClick={handleVoiceSearch}
            title="Recherche Vocale"
            className={`p-2.5 rounded-2xl border transition-all ${
              isListeningVoice
                ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-blue-400'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        {/* Currency Switcher Bar */}
        <div className="flex items-center justify-between pt-2.5 border-t border-slate-900 mt-2.5 text-[10px]">
          <span className="text-slate-400 font-bold uppercase tracking-wider">Devise d&apos;affichage:</span>
          <div className="flex items-center gap-1">
            {(['FCFA', 'EUR', 'USD', 'NGN'] as CurrencyCode[]).map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2 py-0.5 rounded-lg font-black transition-all ${
                  currency === c
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {c === 'EUR' ? 'EUR (€)' : c === 'USD' ? 'USD ($)' : c === 'NGN' ? 'NGN (₦)' : 'FCFA'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="px-4 space-y-6">
        {/* Direct APK Download Banner */}
        <section aria-label="Téléchargement APK" className="p-3.5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/30 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 shadow-inner">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-white">Application NovaShop Android</span>
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950">
                  APK
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Installez directement sur votre téléphone (1.58 Mo)</p>
            </div>
          </div>
          <button
            onClick={() => setIsApkModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all active:scale-95 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger</span>
          </button>
        </section>

        {/* Promotional Carousel */}
        <section aria-label="Bannières promotionnelles" className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div
            className={`p-5 bg-gradient-to-br ${promoBanners[activePromoIndex].bg} text-white space-y-2.5 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black bg-black/30 backdrop-blur-sm tracking-wider uppercase border border-white/20">
                {promoBanners[activePromoIndex].badge}
              </span>
              <span className="text-[10px] text-white/80 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Offre Limitée
              </span>
            </div>

            <h2 className="text-lg font-black tracking-tight leading-tight">
              {promoBanners[activePromoIndex].title}
            </h2>
            <p className="text-xs text-white/90 font-medium">
              {promoBanners[activePromoIndex].subtitle}
            </p>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => handleCategoryClick(promoBanners[activePromoIndex].action)}
                className="px-4 py-2 rounded-2xl bg-white text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg hover:bg-slate-100 transition-all active:scale-95"
              >
                <span>Découvrir l&apos;offre</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1.5">
                {promoBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePromoIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activePromoIndex === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* AI Shopping Assistant Card */}
        <section
          onClick={() => setIsAIAssistantOpen(true)}
          className="p-3.5 rounded-3xl bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-purple-950/80 border border-indigo-500/30 flex items-center justify-between cursor-pointer hover:border-indigo-400 transition-all shadow-md group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-amber-300 shadow-inner group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-xs text-white">Assistant IA Shopping NovaShop</h3>
                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">LIVE</span>
              </div>
              <p className="text-[10px] text-slate-300">
                &quot;Quel smartphone recommandes-tu à moins de 200 000 FCFA ?&quot;
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </section>

        {/* Categories Bar */}
        <section aria-label="Catégories de produits">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-400">
              Catégories Produits
            </h3>
            <button
              onClick={() => handleCategoryClick('all')}
              className="text-xs text-blue-400 font-semibold hover:underline"
            >
              Voir tout
            </button>
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex flex-col items-center p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all shrink-0 w-24 text-center group active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-1.5">
                  {cat.id === 'smartphones' && <Smartphone className="w-5 h-5" />}
                  {cat.id === 'electronics' && <Headphones className="w-5 h-5" />}
                  {cat.id === 'student' && <GraduationCap className="w-5 h-5" />}
                  {cat.id === 'fashion' && <Shirt className="w-5 h-5" />}
                  {cat.id === 'home' && <Sun className="w-5 h-5" />}
                  {cat.id === 'beauty' && <Heart className="w-5 h-5" />}
                  {cat.id === 'all' && <Sparkles className="w-5 h-5" />}
                </div>
                <span className="text-[11px] font-semibold text-slate-200 truncate w-full">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Flash Sales & Countdown Deals */}
        {specialOffers.length > 0 && (
          <section aria-label="Ventes Flash & Bons Plans" className="p-4 rounded-3xl bg-gradient-to-br from-rose-950/60 via-slate-900 to-amber-950/40 border border-rose-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600/30 text-rose-400 flex items-center justify-center font-black">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">Ventes Flash du Jour</h3>
                  <p className="text-[10px] text-rose-300">Offres limitées avec stock en direct</p>
                </div>
              </div>

              <div className="flex items-center gap-1 font-mono text-xs font-black text-white bg-slate-950/80 px-2.5 py-1 rounded-xl border border-rose-500/40 shadow-inner">
                <span className="bg-rose-600/40 px-1 py-0.5 rounded text-rose-200">{String(flashTime.h).padStart(2, '0')}h</span>
                <span>:</span>
                <span className="bg-rose-600/40 px-1 py-0.5 rounded text-rose-200">{String(flashTime.m).padStart(2, '0')}m</span>
                <span>:</span>
                <span className="bg-rose-600/40 px-1 py-0.5 rounded text-rose-200">{String(flashTime.s).padStart(2, '0')}s</span>
              </div>
            </div>

            <div className="flex items-stretch gap-3 overflow-x-auto pb-1 no-scrollbar">
              {specialOffers.map(p => (
                <ProductCard key={`flash-${p.id}`} product={p} layout="compact" />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed Products */}
        {recentlyViewedIds.length > 0 && (
          <section aria-label="Articles vus récemment">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-400" />
                <h3 className="font-black text-sm text-white">Vu Récemment</h3>
              </div>
              <span className="text-[10px] text-slate-500">Reprenez votre visite</span>
            </div>
            <div className="flex items-stretch gap-3 overflow-x-auto pb-2 no-scrollbar">
              {products
                .filter(p => recentlyViewedIds.includes(p.id))
                .slice(0, 6)
                .map(p => (
                  <ProductCard key={`recent-${p.id}`} product={p} layout="compact" />
                ))}
            </div>
          </section>
        )}

        {/* Featured Products Grid */}
        <section aria-label="Produits vedettes">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <h3 className="font-black text-sm text-white tracking-tight">Produits Vedettes</h3>
              <p className="text-[11px] text-slate-400">Sélection certifiée avec garantie constructeur officielle</p>
            </div>
            <button
              onClick={() => handleCategoryClick('all')}
              className="text-xs text-blue-400 font-semibold"
            >
              Plus &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {featured.slice(0, 4).map(p => (
              <ProductCard key={`feat-${p.id}`} product={p} layout="grid" />
            ))}
          </div>
        </section>

        {/* Best Sellers Row */}
        <section aria-label="Meilleures ventes">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 text-sm">★</span>
              <h3 className="font-black text-sm text-white">Meilleures Ventes</h3>
            </div>
            <button
              onClick={() => handleCategoryClick('all')}
              className="text-xs text-blue-400 font-semibold"
            >
              Voir tout
            </button>
          </div>

          <div className="flex items-stretch gap-3 overflow-x-auto pb-2 no-scrollbar">
            {bestSellers.map(p => (
              <ProductCard key={`best-${p.id}`} product={p} layout="compact" />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section aria-label="Nouveautés">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <h3 className="font-black text-sm text-white">Nouveautés Récemment Ajoutées</h3>
                <p className="text-[11px] text-slate-400">Derniers arrivages vérifiés au Cameroun</p>
              </div>
              <button
                onClick={() => handleCategoryClick('all')}
                className="text-xs text-blue-400 font-semibold"
              >
                Voir tout
              </button>
            </div>

            <div className="flex items-stretch gap-3 overflow-x-auto pb-2 no-scrollbar">
              {newArrivals.map(p => (
                <ProductCard key={`new-${p.id}`} product={p} layout="compact" />
              ))}
            </div>
          </section>
        )}

        {/* Cameroon Trust Pillars */}
        <section aria-label="Garanties et services" className="grid grid-cols-2 gap-2 pt-2">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1">
            <Truck className="w-5 h-5 text-blue-400" />
            <h4 className="font-bold text-xs text-white">Livraison Express Douala & Yaoundé</h4>
            <p className="text-[10px] text-slate-400">En 2 à 4h à Douala et 24h à Yaoundé.</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-xs text-white">Garantie 100% Authentique</h4>
            <p className="text-[10px] text-slate-400">12 à 24 mois avec facture certifiée.</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1">
            <RotateCcw className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-xs text-white">Retour Gratuit 7 Jours</h4>
            <p className="text-[10px] text-slate-400">Remplacement immédiat ou remboursement garanti.</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1">
            <Percent className="w-5 h-5 text-purple-400" />
            <h4 className="font-bold text-xs text-white">MTN MoMo & Orange Money</h4>
            <p className="text-[10px] text-slate-400">Paiement Mobile Money instantané ou Cash à la livraison.</p>
          </div>
        </section>

        {/* Customer Reviews & Testimonials */}
        <section aria-label="Avis clients" className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="font-black text-xs uppercase tracking-wider text-slate-400">
            Avis de nos clients au Cameroun
          </h3>
          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-200">Christian Eboa (Douala, Bonanjo)</span>
                <span className="text-[10px] text-amber-400">★★★★★</span>
              </div>
              <p className="text-[11px] text-slate-300">
                &quot;J&apos;ai commandé le NovaPhone Apex 5G à 10h, livré à 13h à Bonanjo avec facture officielle et garantie scellée. Service irréprochable.&quot;
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-200">Nadine Kamga (Yaoundé, Bastos)</span>
                <span className="text-[10px] text-amber-400">★★★★★</span>
              </div>
              <p className="text-[11px] text-slate-300">
                &quot;La tablette ScholarPro est super pour l&apos;université. Le stylet actif et le clavier inclus dans la boîte marchent à merveille.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* Customer Support Banner */}
        <section aria-label="Support client" className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <HeadphonesIcon className="w-8 h-8 text-blue-400 mx-auto" />
          <div>
            <h4 className="font-black text-sm text-white">Besoin d&apos;aide pour commander ?</h4>
            <p className="text-xs text-slate-400">Notre équipe de support client est basée au Cameroun et vous assiste 6j/7.</p>
          </div>
          <button
            onClick={() => setIsSupportChatOpen(true)}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
          >
            <span>Discuter avec le service client</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </section>
      </div>

      {/* Floating Comparison Drawer Trigger */}
      {compareProductIds.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 max-w-sm w-[92%] px-4 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-2xl flex items-center justify-between border border-blue-400/40 animate-fade-in">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4" />
            <span>{compareProductIds.length} article(s) à comparer</span>
          </div>
          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-3 py-1 rounded-xl bg-white text-blue-700 font-extrabold text-[11px] shadow hover:bg-blue-50 transition-colors"
          >
            Comparer &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
