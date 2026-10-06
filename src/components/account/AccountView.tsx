import React from 'react';
import { 
  User as UserIcon, Shield, MapPin, Heart, Headphones, 
  Share2, Award, Sparkles, ExternalLink, LogOut, 
  LogIn, ChevronRight, Settings, Phone, Mail, Globe, Lock,
  Smartphone, Download, Archive
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CurrencyCode } from '../../types';

export const AccountView: React.FC = () => {
  const { 
    currentUser, 
    handleGoogleLogin, 
    handleLogout, 
    setIsAdminOpen, 
    setIsSupportChatOpen,
    setIsLoyaltyOpen,
    setIsAddressManagerOpen,
    setIsApkModalOpen,
    loyaltyPoints,
    wishlist,
    shareWishlist,
    currency,
    setCurrency,
    savedAddresses,
    setIsWorkspaceOpen,
    formatPrice
  } = useShop();

  return (
    <div className="pb-28 text-slate-100 space-y-4">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-blue-400" />
          <h2 className="font-black text-base text-white tracking-tight">Mon Compte</h2>
        </div>
        {currentUser && (
          <button
            onClick={handleLogout}
            className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        )}
      </header>

      <div className="px-4 space-y-4">
        {/* User Profile Card */}
        {currentUser ? (
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/30">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-white truncate">{currentUser.name}</h3>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Client Vérifié
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
              <p className="text-[11px] text-slate-300 font-mono">{currentUser.phone}</p>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Connexion Client NovaShop</h3>
              <p className="text-xs text-slate-400">Accédez à vos commandes, adresses et avantages fidélité.</p>
            </div>
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Se connecter</span>
            </button>
          </div>
        )}

        {/* NovaClub VIP Banner */}
        <div
          onClick={() => setIsLoyaltyOpen(true)}
          className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/40 border border-amber-500/30 flex items-center justify-between cursor-pointer hover:border-amber-400/60 transition-all shadow-md group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-xs text-white">NovaClub VIP Rewards</h4>
                <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded">
                  {loyaltyPoints} PTS
                </span>
              </div>
              <p className="text-[10px] text-amber-200/80">
                1 pt = 10 FCFA • Profitez de vos remises exclusives
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Addresses & Wishlist quick actions */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setIsAddressManagerOpen(true)}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-left hover:border-slate-700 transition-all space-y-1.5 active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-bold text-slate-400">{savedAddresses.length}</span>
            </div>
            <div>
              <h5 className="font-bold text-xs text-white">Adresses</h5>
              <p className="text-[10px] text-slate-400">Gérer mes lieux de livraison</p>
            </div>
          </button>

          <button
            onClick={shareWishlist}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-left hover:border-slate-700 transition-all space-y-1.5 active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-white">Favoris ({wishlist.length})</h5>
              <p className="text-[10px] text-slate-400">Partager ma liste d&apos;envies</p>
            </div>
          </button>
        </div>

        {/* Settings & Currency */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
          <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Préférences & Devise</h4>
          
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-300 font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Devise du magasin :</span>
            </span>
            <div className="flex items-center gap-1">
              {(['FCFA', 'EUR', 'USD', 'NGN'] as CurrencyCode[]).map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 rounded-lg font-black text-[10px] transition-all ${
                    currency === c
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Support & Assistance */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
          <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Aide & Contact</h4>
          
          <button
            onClick={() => setIsApkModalOpen(true)}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-950 hover:bg-slate-800 border border-emerald-500/30 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="font-bold text-slate-100 flex items-center gap-1.5">
                  Installer l&apos;App Android (APK)
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950">
                    1.58 Mo
                  </span>
                </span>
                <span className="text-[10px] text-slate-400">Téléchargement direct sans Play Store</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-emerald-400" />
          </button>

          <a
            href="/api/download/project"
            download="novashop-complete-project.zip"
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-blue-950/60 to-slate-950 hover:bg-slate-800 border border-blue-500/30 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Archive className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="font-bold text-slate-100 flex items-center gap-1.5">
                  Projet Source Android (.ZIP)
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-blue-500 text-white">
                    DEV KIT
                  </span>
                </span>
                <span className="text-[10px] text-slate-400">Pour Android Studio, Gradle & Capacitor</span>
              </div>
            </div>
            <Download className="w-4 h-4 text-blue-400" />
          </a>

          <button
            onClick={() => setIsSupportChatOpen(true)}
            className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Headphones className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-slate-200">Service Client & Messagerie SAV</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => setIsWorkspaceOpen(true)}
            className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-slate-200">Google Workspace (Tasks / Calendar)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Administration Section */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-blue-500/30 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-white">Espace Gestion Entreprise</h4>
                <p className="text-[10px] text-slate-400">Admin Panel, Stocks & Commandes</p>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
            Gérez en temps réel le catalogue de produits, les transporteurs, les niveaux de stock, les transactions de paiement et les demandes de retour.
          </p>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="w-full mt-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
          >
            <Shield className="w-4 h-4" />
            <span>Ouvrir l&apos;Admin Panel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
