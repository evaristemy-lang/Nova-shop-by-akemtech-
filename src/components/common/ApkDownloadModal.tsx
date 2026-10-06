import React, { useState, useEffect } from 'react';
import { 
  Download, Smartphone, CheckCircle2, ShieldCheck, 
  ExternalLink, Sparkles, X, ChevronRight, AlertCircle, 
  HelpCircle, Zap, RefreshCw, Archive, FileCode, Terminal, Laptop
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const ApkDownloadModal: React.FC = () => {
  const { isApkModalOpen, setIsApkModalOpen, showToast } = useShop();
  const [downloadStep, setDownloadStep] = useState<'ready' | 'downloading' | 'completed'>('ready');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'apk' | 'pwa' | 'source'>('apk');
  const [canInstallPwa, setCanInstallPwa] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (!isApkModalOpen) return null;

  const handleStartApkDownload = () => {
    setDownloadStep('downloading');
    setDownloadProgress(15);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 180);

    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);
      setDownloadStep('completed');

      // Trigger browser download via direct link
      const link = document.createElement('a');
      link.href = '/api/download/apk';
      link.setAttribute('download', 'NovaShop-v1.0.0.apk');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Téléchargement de NovaShop-v1.0.0.apk lancé ! 📲');
    }, 900);
  };

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('Application NovaShop installée sur votre écran d\'accueil ! 🚀');
        setIsApkModalOpen(false);
      }
      setDeferredPrompt(null);
    } else {
      showToast('Pour installer : ouvrez le menu du navigateur (⋮ ou Partager) et touchez "Ajouter à l\'écran d\'accueil" 📲');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md max-h-[92vh] sm:max-h-[85vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-black text-white text-base shadow-lg shadow-emerald-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-white">Télécharger NovaShop Android</h3>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  APK DIRECT
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Installation directe sur votre smartphone</p>
            </div>
          </div>
          <button
            onClick={() => setIsApkModalOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch between APK, PWA, and Project ZIP */}
        <div className="p-2 bg-slate-950/60 border-b border-slate-800 flex gap-1">
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'apk'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Download className="w-3 h-3" />
            <span>APK Direct</span>
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'pwa'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3 h-3 text-amber-300" />
            <span>Web App (PWA)</span>
          </button>
          <button
            onClick={() => setActiveTab('source')}
            className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeTab === 'source'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Archive className="w-3 h-3 text-emerald-300" />
            <span>Projet Dev (ZIP)</span>
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs no-scrollbar">
          
          {activeTab === 'apk' ? (
            <>
              {/* App Badge Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                  <span className="font-black text-2xl text-white">N</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-sm text-white truncate">NovaShop Mobile</h4>
                  <p className="text-[11px] text-slate-400">Package: cm.novashop.app • v1.0.0</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px]">
                    <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Vérifié sans virus
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">Taille: 1.58 Mo</span>
                  </div>
                </div>
              </div>

              {/* Download Action Area */}
              {downloadStep === 'ready' && (
                <div className="space-y-3">
                  <button
                    onClick={handleStartApkDownload}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98]"
                  >
                    <Download className="w-5 h-5" />
                    <span>Télécharger l&apos;APK Directement</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    Compatible avec tous les téléphones Android (Samsung, Tecno, Infinix, Xiaomi, etc.)
                  </p>
                </div>
              )}

              {downloadStep === 'downloading' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-center">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                      Téléchargement en cours...
                    </span>
                    <span className="font-mono text-blue-400 font-extrabold">{downloadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300 rounded-full"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Préparation du paquet d&apos;installation signé...</p>
                </div>
              )}

              {downloadStep === 'completed' && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-3 text-center animate-fade-in">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <div>
                    <h5 className="font-black text-sm text-emerald-300">Fichier APK prêt et téléchargé !</h5>
                    <p className="text-[11px] text-slate-300 mt-0.5">Le fichier se trouve dans le dossier Téléchargements de votre téléphone.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleStartApkDownload}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                    >
                      Télécharger à nouveau
                    </button>
                    <a
                      href="/api/download/apk"
                      download="NovaShop-v1.0.0.apk"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1"
                    >
                      <span>Lien direct</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Installation Guide for Android */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
                <h5 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  Comment installer le fichier APK sur Android :
                </h5>
                <ol className="space-y-2 text-[11px] text-slate-400 list-decimal list-inside pl-1">
                  <li>
                    Touchez <strong className="text-slate-200">Télécharger l&apos;APK</strong> ci-dessus.
                  </li>
                  <li>
                    Ouvrez le fichier <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">NovaShop-v1.0.0.apk</code> depuis votre barre de notifications ou votre gestionnaire de fichiers.
                  </li>
                  <li>
                    Si votre téléphone demande l&apos;autorisation, activez <strong className="text-slate-200">&quot;Autoriser cette source&quot;</strong> ou &quot;Sources inconnues&quot;.
                  </li>
                  <li>
                    Appuyez sur <strong className="text-emerald-400">Installer</strong> puis lancez NovaShop !
                  </li>
                </ol>
              </div>
            </>
          ) : activeTab === 'pwa' ? (
            <>
              {/* PWA 1-Click Install option */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-800/40 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">Installation Immédiate en 1 Clic</h4>
                    <p className="text-[11px] text-slate-400">Pas besoin d&apos;activer les sources inconnues</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Ajoutez NovaShop directement sur votre écran d&apos;accueil Android ou iPhone comme une application native.
                </p>
                <button
                  onClick={handleInstallPwa}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Ajouter à l&apos;écran d&apos;accueil</span>
                </button>
              </div>

              {/* Benefits of App */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <h5 className="font-bold text-slate-300 text-xs">Avantages de l&apos;application :</h5>
                <ul className="space-y-1.5 text-[11px] text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Ouverture instantanée en plein écran sans barre d&apos;adresse</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Fonctionne même avec une connexion internet lente ou instable</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Consommation de données mobiles ultra-réduite</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Accès rapide à votre panier et au suivi de vos livraisons</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Project Source Code & Android Build Kit */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-900/40 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0">
                    <Archive className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-white">Projet Complet NovaShop (ZIP)</h4>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        DEV KIT
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Prêt pour Android Studio, Gradle & Capacitor</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 space-y-1.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Contenu autonome inclus à 100% :
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-slate-400">
                    <li>Code source complet Frontend (React 19, TypeScript, Tailwind)</li>
                    <li>Serveur Backend complet (Express, REST API, Gemini AI)</li>
                    <li>Configuration Android Capacitor (<code className="text-emerald-400">capacitor.config.json</code>)</li>
                    <li>Guide de build pas-à-pas (<code className="text-emerald-400">ANDROID_BUILD_GUIDE.md</code>)</li>
                    <li>Tous les assets graphiques HD, icônes PWA et APK précompilé</li>
                  </ul>
                </div>

                <a
                  href="/api/download/project"
                  download="novashop-complete-project.zip"
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger le Projet Complet (.ZIP)</span>
                </a>
              </div>

              {/* Instructions for Android Developers */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h5 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Commandes rapides pour le développeur Android :
                </h5>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-[10px] text-emerald-400 space-y-1 overflow-x-auto">
                  <p className="text-slate-500"># 1. Décompresser et installer</p>
                  <p>unzip novashop-complete-project.zip</p>
                  <p>npm install</p>
                  <p className="text-slate-500 mt-2"># 2. Compiler pour Android avec Capacitor</p>
                  <p>npm run build</p>
                  <p>npm install @capacitor/core @capacitor/cli @capacitor/android</p>
                  <p>npx cap add android</p>
                  <p className="text-slate-500 mt-2"># 3. Ouvrir dans Android Studio ou compiler l&apos;APK</p>
                  <p>npx cap open android</p>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>NovaShop Cameroun Ltd</span>
          <span className="text-slate-500">v1.0.0 • 2026</span>
        </div>

      </div>
    </div>
  );
};
