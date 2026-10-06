import React, { useState, useMemo } from 'react';
import { 
  X, LayoutDashboard, Package, ShoppingCart, Users, 
  BarChart3, Settings, Plus, Edit, Trash2, CheckCircle2, 
  AlertTriangle, ArrowUpRight, Search, Filter, ShieldCheck, 
  FileText, RotateCcw, Truck, Phone, MessageSquare, ExternalLink, 
  MapPin, Eye, Lock, LogIn, Upload, Image as ImageIcon, Save, Check,
  Download, Smartphone, Archive
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { authService } from '../../services/authService';
import { Product, Order, OrderStatus, ProductCategory, InventoryTransaction } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    products, 
    orders, 
    formatPrice, 
    refreshProducts, 
    refreshOrders,
    setActiveInvoiceOrder,
    showToast 
  } = useShop();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@novashop.cm');
  const [adminPassword, setAdminPassword] = useState('admin2026');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tabs
  const [adminTab, setAdminTab] = useState<'dashboard' | 'orders' | 'products' | 'inventory' | 'returns'>('dashboard');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Selected Order for Details View Modal
  const [selectedOrderForView, setSelectedOrderForView] = useState<Order | null>(null);

  // Product Create/Edit Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: 'smartphones',
    brand: '',
    description: '',
    shortDescription: '',
    price: 10000,
    discountPrice: undefined,
    costPrice: 8000,
    stockCount: 10,
    lowStockThreshold: 3,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'],
    inStock: true,
    tags: []
  });

  // Carrier / Assignment Form inside Order Details
  const [courierName, setCourierName] = useState('');
  const [courierPhone, setCourierPhone] = useState('');
  const [carrierName, setCarrierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);

  // Return Decision Form
  const [returnDecisionNote, setReturnDecisionNote] = useState('');
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<string | null>(null);

  // Image Upload Simulator
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isAdminOpen) return null;

  // -------------------------------------------------------------
  // STATS CALCULATIONS
  // -------------------------------------------------------------
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRevenue = orders
    .filter(o => o.date.startsWith(todayStr) && o.paymentStatus === 'successful')
    .reduce((acc, o) => acc + o.total, 0);

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'successful')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const activeDeliveries = orders.filter(o => o.status === 'shipped');
  const lowStockProducts = products.filter(p => p.stockCount > 0 && p.stockCount <= (p.lowStockThreshold || 5));
  const outOfStockProducts = products.filter(p => p.stockCount === 0 || !p.inStock);
  const pendingReturns = orders.filter(o => o.returnRequest && o.returnRequest.status === 'pending');

  // Filtered Orders for table
  const displayedOrders = orders.filter(o => {
    if (orderFilter !== 'all') {
      if (orderFilter === 'pending' && o.status !== 'pending') return false;
      if (orderFilter === 'shipped' && o.status !== 'shipped') return false;
      if (orderFilter === 'delivered' && o.status !== 'delivered') return false;
      if (orderFilter === 'returns' && !o.returnRequest && o.status !== 'returned') return false;
    }
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone) return false;
    }
    return true;
  });

  // -------------------------------------------------------------
  // AUTHENTICATION HANDLER
  // -------------------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const res = await authService.adminLogin(adminEmail, adminPassword);
    setIsLoggingIn(false);

    if (res.success) {
      setIsAuthenticated(true);
      showToast('Session Administrateur active ! 🛡️');
    } else {
      setLoginError(res.error || 'Identifiants administrateur non valides.');
    }
  };

  // -------------------------------------------------------------
  // ORDER ACTIONS
  // -------------------------------------------------------------
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminName: 'Admin Principal' })
      });
      if (res.ok) {
        showToast(`Statut de la commande #${orderId} mis à jour : ${newStatus.toUpperCase()}`);
        await refreshOrders();
        await refreshProducts();
        if (selectedOrderForView && selectedOrderForView.id === orderId) {
          const updated = await res.json();
          setSelectedOrderForView(updated);
        }
      }
    } catch {
      showToast('Erreur lors de la mise à jour du statut.');
    }
  };

  const handleSaveCarrierAssignment = async () => {
    if (!selectedOrderForView) return;
    setIsSavingAssignment(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrderForView.id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courierName,
          courierPhone,
          carrierName,
          trackingNumber,
          estimatedDeliveryDate,
          adminName: 'Admin Principal'
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedOrderForView(updated);
        await refreshOrders();
        showToast('Affectation du transporteur et du livreur enregistrée ! 🚚');
      }
    } catch {
      showToast('Erreur lors de l\'enregistrement de l\'affectation.');
    } finally {
      setIsSavingAssignment(false);
    }
  };

  const handleSaveInternalNotes = async () => {
    if (!selectedOrderForView) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrderForView.id}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: adminNotesInput })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedOrderForView(updated);
        await refreshOrders();
        showToast('Note interne enregistrée');
      }
    } catch {
      showToast('Erreur lors de la sauvegarde de la note.');
    }
  };

  const handleProcessReturn = async (decision: 'approved' | 'rejected') => {
    if (!selectedOrderForView) return;
    try {
      const res = await fetch(`/api/orders/${selectedOrderForView.id}/return-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: decision,
          adminDecisionNote: returnDecisionNote,
          restock: decision === 'approved'
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedOrderForView(updated);
        await refreshOrders();
        await refreshProducts();
        showToast(`Demande de retour ${decision === 'approved' ? 'Approuvée & Remboursée' : 'Refusée'} !`);
        setReturnDecisionNote('');
      }
    } catch {
      showToast('Erreur lors du traitement du retour.');
    }
  };

  // -------------------------------------------------------------
  // PRODUCT ACTIONS
  // -------------------------------------------------------------
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `PROD-${Date.now().toString().slice(-4)}`,
      category: 'smartphones',
      brand: '',
      description: '',
      shortDescription: '',
      price: 25000,
      discountPrice: undefined,
      costPrice: 15000,
      stockCount: 15,
      lowStockThreshold: 5,
      images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'],
      inStock: true,
      tags: []
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || formData.price <= 0) {
      showToast('Veuillez renseigner un nom et un prix valide en FCFA.');
      return;
    }

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const endpoint = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          inStock: (formData.stockCount || 0) > 0
        })
      });

      if (res.ok) {
        showToast(editingProduct ? 'Produit mis à jour avec succès !' : 'Nouveau produit créé !');
        await refreshProducts();
        setIsProductModalOpen(false);
      } else {
        showToast('Erreur lors de l\'enregistrement du produit.');
      }
    } catch {
      showToast('Erreur de connexion.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.action === 'archived' ? 'Produit archivé (commandes historiques conservées) !' : 'Produit supprimé !');
        await refreshProducts();
        setConfirmDeleteProductId(null);
      }
    } catch {
      showToast('Erreur lors de la suppression.');
    }
  };

  const handleSimulatedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('L\'image est trop volumineuse. Taille max autorisée : 10 Mo.');
      return;
    }

    setIsUploadingImage(true);
    setUploadProgress(25);

    const reader = new FileReader();
    reader.onload = async () => {
      setUploadProgress(60);
      try {
        const base64 = reader.result as string;
        const res = await fetch('/api/products/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64,
            fileName: file.name,
            mimeType: file.type
          })
        });

        setUploadProgress(100);
        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({
            ...prev,
            images: [data.url, ...(prev.images || [])]
          }));
          showToast('Image optimisée et ajoutée avec succès ! 📷');
        }
      } catch {
        showToast('Erreur lors de l\'optimisation de l\'image.');
      } finally {
        setIsUploadingImage(false);
        setUploadProgress(0);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl h-screen sm:h-[92vh] bg-slate-900 border border-slate-800 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Admin Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-sm shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-white">NovaShop Business Management System</h3>
                <span className="text-[9px] font-black bg-blue-600 text-white px-2 py-0.2 rounded-full">
                  ADMIN LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Plateforme de gestion opérationnelle centralisée</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Not Authenticated: Admin Login Screen */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-950">
            <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-black text-base text-white">Authentification Sécurisée</h4>
                <p className="text-xs text-slate-400">Connectez-vous pour administrer NovaShop Cameroun</p>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-400">Email ou Téléphone :</label>
                  <input
                    type="text"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@novashop.cm"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 mt-1"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-400">Mot de passe :</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 mt-1"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isLoggingIn ? 'Vérification...' : 'Se connecter au Dashboard'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Management */
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
            {/* Top Navigation Tabs */}
            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              {[
                { id: 'dashboard', label: 'Vue Générale', icon: LayoutDashboard },
                { id: 'orders', label: `Commandes (${orders.length})`, icon: ShoppingCart },
                { id: 'products', label: `Produits (${products.length})`, icon: Package },
                { id: 'inventory', label: `Stocks & Alertes`, icon: BarChart3 },
                { id: 'returns', label: `Retours & SAV (${pendingReturns.length})`, icon: RotateCcw }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = adminTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Dashboard Overview */}
            {adminTab === 'dashboard' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {/* Real Statistics Grid (Clickable Filters) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div
                    onClick={() => { setAdminTab('orders'); setOrderFilter('all'); }}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-blue-500/50 transition-all space-y-1"
                  >
                    <p className="text-[10px] uppercase font-bold text-slate-400">Chiffre d&apos;Affaires Réel</p>
                    <p className="text-base sm:text-lg font-black text-blue-400 font-mono">{formatPrice(totalRevenue)}</p>
                    <p className="text-[9px] text-emerald-400">Total des ventes enregistrées</p>
                  </div>

                  <div
                    onClick={() => { setAdminTab('orders'); setOrderFilter('pending'); }}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-amber-500/50 transition-all space-y-1"
                  >
                    <p className="text-[10px] uppercase font-bold text-slate-400">Commandes En Attente</p>
                    <p className="text-base sm:text-lg font-black text-amber-400 font-mono">{pendingOrders.length}</p>
                    <p className="text-[9px] text-amber-300">À préparer en entrepôt</p>
                  </div>

                  <div
                    onClick={() => { setAdminTab('orders'); setOrderFilter('shipped'); }}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-blue-500/50 transition-all space-y-1"
                  >
                    <p className="text-[10px] uppercase font-bold text-slate-400">En Cours de Livraison</p>
                    <p className="text-base sm:text-lg font-black text-indigo-400 font-mono">{activeDeliveries.length}</p>
                    <p className="text-[9px] text-indigo-300">Affectées aux coursiers</p>
                  </div>

                  <div
                    onClick={() => setAdminTab('inventory')}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-rose-500/50 transition-all space-y-1"
                  >
                    <p className="text-[10px] uppercase font-bold text-slate-400">Stock Faible / Épuisé</p>
                    <p className="text-base sm:text-lg font-black text-rose-400 font-mono">
                      {lowStockProducts.length + outOfStockProducts.length}
                    </p>
                    <p className="text-[9px] text-rose-300">Nécessite réapprovisionnement</p>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-sm text-white">Dernières Commandes Clients</h4>
                    <button
                      onClick={() => setAdminTab('orders')}
                      className="text-xs text-blue-400 font-bold hover:underline"
                    >
                      Voir toutes les commandes &rarr;
                    </button>
                  </div>

                  <div className="divide-y divide-slate-800">
                    {orders.slice(0, 5).map(o => (
                      <div
                        key={o.id}
                        onClick={() => {
                          setSelectedOrderForView(o);
                          setCourierName(o.deliveryAgent?.name || '');
                          setCourierPhone(o.deliveryAgent?.phone || '');
                          setCarrierName(o.carrierName || '');
                          setTrackingNumber(o.trackingNumber || '');
                          setEstimatedDeliveryDate(o.estimatedDeliveryDate || '');
                          setAdminNotesInput(o.adminNotes || '');
                        }}
                        className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
                      >
                        <div>
                          <p className="font-bold text-white text-xs font-mono">#{o.id} - {o.customerName}</p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(o.date).toLocaleDateString()} • {o.items.length} article(s) • {o.deliveryAddress.city}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-blue-400 font-mono text-xs">{formatPrice(o.total)}</p>
                          <span className="text-[9px] font-bold text-slate-300 uppercase">{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Android & Developer Project Distribution */}
                <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-white">Déploiement Android & Kit Développeur</h4>
                        <p className="text-[10px] text-slate-400">Package cm.novashop.app • v1.0.0</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      PRÊT ANDROID STUDIO
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <a
                      href="/api/download/apk"
                      download="NovaShop-v1.0.0.apk"
                      className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="font-bold text-slate-200 text-xs">Fichier APK Android</p>
                          <p className="text-[10px] text-slate-400">1.58 Mo • Installation directe</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                    </a>

                    <a
                      href="/api/download/project"
                      download="novashop-complete-project.zip"
                      className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-emerald-800/40 flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Archive className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="font-bold text-slate-200 text-xs">Projet Complet (ZIP)</p>
                          <p className="text-[10px] text-slate-400">Code source & Guide Capacitor</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Orders Management */}
            {adminTab === 'orders' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                {/* Search & Status Filters */}
                <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
                  <div className="w-full sm:w-72 relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder="Rechercher par ID, client ou tél..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
                    {[
                      { id: 'all', label: 'Toutes' },
                      { id: 'pending', label: 'En attente' },
                      { id: 'shipped', label: 'En transit' },
                      { id: 'delivered', label: 'Livrées' },
                      { id: 'returns', label: 'Retours' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setOrderFilter(f.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] whitespace-nowrap transition-colors ${
                          orderFilter === f.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders Data Table */}
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900">
                  <div className="divide-y divide-slate-800">
                    {displayedOrders.map(order => (
                      <div
                        key={order.id}
                        onClick={() => {
                          setSelectedOrderForView(order);
                          setCourierName(order.deliveryAgent?.name || '');
                          setCourierPhone(order.deliveryAgent?.phone || '');
                          setCarrierName(order.carrierName || '');
                          setTrackingNumber(order.trackingNumber || '');
                          setEstimatedDeliveryDate(order.estimatedDeliveryDate || '');
                          setAdminNotesInput(order.adminNotes || '');
                        }}
                        className="p-3.5 hover:bg-slate-800/40 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-mono text-xs">#{order.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-300' :
                              order.status === 'cancelled' ? 'bg-rose-500/20 text-rose-300' :
                              order.status === 'shipped' ? 'bg-amber-500/20 text-amber-300' :
                              order.status === 'returned' ? 'bg-purple-500/20 text-purple-300' :
                              'bg-blue-500/20 text-blue-300'
                            }`}>
                              {order.status.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-slate-300 text-[11px]">
                            {order.customerName} • <span className="font-mono text-slate-400">{order.customerPhone}</span>
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {order.deliveryAddress.street}, {order.deliveryAddress.city}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                          <div className="text-right">
                            <p className="font-black text-blue-400 font-mono text-sm">{formatPrice(order.total)}</p>
                            <p className="text-[9px] text-slate-400 font-mono">
                              {order.paymentMethod.replace('_', ' ').toUpperCase()} ({order.paymentStatus})
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveInvoiceOrder(order);
                            }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400"
                            title="Voir facture"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Products Management */}
            {adminTab === 'products' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-400">{products.length} produit(s) au catalogue</span>
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Ajouter un produit</span>
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900 divide-y divide-slate-800">
                  {products.map(p => (
                    <div key={p.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-800/30">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-slate-950 shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-xs truncate">{p.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku || p.id} • {p.category}</p>
                          <div className="flex items-center gap-2 pt-0.5">
                            <span className="font-black text-blue-400 font-mono text-xs">{formatPrice(p.price)}</span>
                            <span className={`text-[9px] font-bold ${
                              p.stockCount <= (p.lowStockThreshold || 5) ? 'text-amber-400' : 'text-emerald-400'
                            }`}>
                              Stock: {p.stockCount}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
                          title="Modifier"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteProductId(p.id)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-rose-400"
                          title="Supprimer / Archiver"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Inventory Alerts */}
            {adminTab === 'inventory' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1">
                    <p className="font-bold text-xs">Articles en Stock Faible</p>
                    <p className="text-xl font-black font-mono">{lowStockProducts.length}</p>
                    <p className="text-[10px] text-amber-400/80">Sous le seuil d&apos;alerte configuré</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-1">
                    <p className="font-bold text-xs">Articles Épuisés</p>
                    <p className="text-xl font-black font-mono">{outOfStockProducts.length}</p>
                    <p className="text-[10px] text-rose-400/80">Commandes bloquées / En attente d&apos;arrivage</p>
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">État des Stocks par Produit</h4>
                  <div className="divide-y divide-slate-800">
                    {products.map(p => (
                      <div key={p.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white text-xs">{p.name}</p>
                          <p className="text-[10px] text-slate-400">Seuil alerte: {p.lowStockThreshold || 5} unités</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-mono font-black text-xs ${
                            p.stockCount === 0 ? 'text-rose-500' : p.stockCount <= 5 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {p.stockCount} en stock
                          </span>
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px]"
                          >
                            Ajuster
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Returns & Refunds */}
            {adminTab === 'returns' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                <h4 className="font-bold text-sm text-white">Demandes de Retour & Remboursements SAV</h4>
                <div className="space-y-3">
                  {orders.filter(o => o.returnRequest || o.status === 'returned').length === 0 ? (
                    <div className="py-16 text-center text-slate-500">Aucune demande de retour enregistrée.</div>
                  ) : (
                    orders
                      .filter(o => o.returnRequest || o.status === 'returned')
                      .map(o => (
                        <div key={o.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-black text-white text-xs">Commande #{o.id} - {o.customerName}</p>
                              <p className="text-[10px] text-slate-400">Tél: {o.customerPhone}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              o.returnRequest?.status === 'approved' ? 'bg-purple-500/20 text-purple-300' :
                              o.returnRequest?.status === 'rejected' ? 'bg-rose-500/20 text-rose-300' :
                              'bg-amber-500/20 text-amber-300'
                            }`}>
                              {o.returnRequest?.status.toUpperCase() || 'RETOUR'}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                            <p><strong>Motif:</strong> {o.returnRequest?.reason || 'Non précisé'}</p>
                            {o.returnRequest?.details && <p className="italic text-slate-400">&quot;{o.returnRequest.details}&quot;</p>}
                            <p className="text-[10px] text-slate-500">
                              Mode de remboursement: {o.returnRequest?.refundMethod.toUpperCase()} • Montant: {formatPrice(o.total)}
                            </p>
                          </div>

                          {o.returnRequest?.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedOrderForView(o);
                                  handleProcessReturn('approved');
                                }}
                                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                              >
                                Approuver & Rembourser
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedOrderForView(o);
                                  handleProcessReturn('rejected');
                                }}
                                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                              >
                                Rejeter
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODAL: ORDER DETAILS & LOGISTICS MANAGEMENT                   */}
        {/* ------------------------------------------------------------- */}
        {selectedOrderForView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
              
              <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-white">Gestion Commande #{selectedOrderForView.id}</h4>
                  <p className="text-[10px] text-slate-400">Client: {selectedOrderForView.customerName}</p>
                </div>
                <button
                  onClick={() => setSelectedOrderForView(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                {/* Status Switcher Bar */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300">Modifier le Statut Opérationnel :</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map(st => (
                      <button
                        key={st}
                        onClick={() => handleUpdateOrderStatus(selectedOrderForView.id, st)}
                        className={`py-2 px-1 rounded-xl font-bold text-[10px] uppercase transition-all ${
                          selectedOrderForView.status === st
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Contact Card */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-white text-xs">{selectedOrderForView.customerName}</p>
                      <p className="text-[10px] text-slate-400">{selectedOrderForView.customerEmail}</p>
                      <p className="text-blue-400 font-mono font-bold text-[11px]">{selectedOrderForView.customerPhone}</p>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`tel:${selectedOrderForView.customerPhone}`}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Appeler</span>
                      </a>
                      <a
                        href={`https://wa.me/${selectedOrderForView.customerPhone.replace(/[^0-9]/g, '')}?text=Bonjour%20${selectedOrderForView.customerName}%2C%20votre%20commande%20NovaShop%20%23${selectedOrderForView.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-bold text-[10px] flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{selectedOrderForView.deliveryAddress.street}</p>
                      <p className="text-[10px] text-slate-400">{selectedOrderForView.deliveryAddress.neighborhood ? `${selectedOrderForView.deliveryAddress.neighborhood}, ` : ''}{selectedOrderForView.deliveryAddress.city}</p>
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${selectedOrderForView.deliveryAddress.street}, ${selectedOrderForView.deliveryAddress.city}, Cameroon`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline flex items-center gap-1 text-[10px]"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Google Maps</span>
                    </a>
                  </div>
                </div>

                {/* Logistics & Courier Assignment Form */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <h5 className="font-extrabold text-xs text-white flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-400" />
                    <span>Affectation Transporteur & Livreur</span>
                  </h5>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400">Nom du transporteur :</label>
                      <input
                        type="text"
                        value={carrierName}
                        onChange={(e) => setCarrierName(e.target.value)}
                        placeholder="Ex: NovaExpress Douala"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Numéro de suivi :</label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Ex: NX-DLA-8921"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400">Nom du livreur / coursier :</label>
                      <input
                        type="text"
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        placeholder="Ex: Alain Fotso"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Téléphone du coursier :</label>
                      <input
                        type="tel"
                        value={courierPhone}
                        onChange={(e) => setCourierPhone(e.target.value)}
                        placeholder="+237 6XX XX XX XX"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveCarrierAssignment}
                    disabled={isSavingAssignment}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Enregistrer l&apos;affectation logistique</span>
                  </button>
                </div>

                {/* Internal Admin Private Notes */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 text-[11px]">Notes internes confidentielles :</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={adminNotesInput}
                      onChange={(e) => setAdminNotesInput(e.target.value)}
                      placeholder="Note pour l'équipe (ex: client prioritaire, rappeler à 14h)..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <button
                      onClick={handleSaveInternalNotes}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                    >
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODAL: ADD / EDIT PRODUCT FORM                                */}
        {/* ------------------------------------------------------------- */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-lg max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
              
              <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-white">
                  {editingProduct ? 'Modifier le Produit' : 'Créer un Nouveau Produit'}
                </h4>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-5 space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-slate-400">Nom du produit *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: NovaPhone 5G Apex"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-400">Catégorie *</label>
                    <select
                      value={formData.category || 'smartphones'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                    >
                      <option value="smartphones">Smartphones</option>
                      <option value="electronics">Électronique</option>
                      <option value="student">Étudiants</option>
                      <option value="home">Solaire & Maison</option>
                      <option value="fashion">Mode</option>
                      <option value="beauty">Beauté Bio</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-400">Marque</label>
                    <input
                      type="text"
                      value={formData.brand || ''}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Ex: NovaTech"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-semibold text-slate-400">Prix normal (FCFA) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-400">Prix promo (FCFA)</label>
                    <input
                      type="number"
                      value={formData.discountPrice || ''}
                      onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-400">Quantité en stock</label>
                    <input
                      type="number"
                      required
                      value={formData.stockCount || ''}
                      onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-400">Description détaillée *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Détails du produit, caractéristiques techniques..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white resize-none"
                  />
                </div>

                {/* Image Upload Area */}
                <div className="space-y-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <label className="font-bold text-slate-300">Images du produit :</label>
                  <div className="flex gap-2 items-center">
                    <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingImage ? `Envoi (${uploadProgress}%)...` : 'Ajouter une image'}</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleSimulatedImageUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[10px] text-slate-500">JPG, PNG, WEBP (Max 10 Mo)</span>
                  </div>

                  {formData.images && formData.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pt-1 no-scrollbar">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, images: formData.images?.filter((_, i) => i !== idx) })}
                            className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/70 text-rose-400"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingProduct ? 'Enregistrer les modifications' : 'Créer et publier le produit'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* CONFIRM DELETE / ARCHIVE DIALOG                               */}
        {/* ------------------------------------------------------------- */}
        {confirmDeleteProductId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-3xl p-5 text-center space-y-3 shadow-2xl">
              <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
              <h4 className="font-bold text-sm text-white">Supprimer ce produit ?</h4>
              <p className="text-xs text-slate-400">
                Si ce produit possède déjà des commandes historiques, il sera archivé pour préserver les rapports comptables.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setConfirmDeleteProductId(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteProduct(confirmDeleteProductId)}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
