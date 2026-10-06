import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  ProductCategory, 
  OrderStatus, 
  DeliveryZone, 
  PaymentGatewayConfig, 
  SupportConversation, 
  ChatMessage, 
  SavedAddress,
  CurrencyCode,
  User 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_DELIVERY_ZONES, 
  INITIAL_PAYMENT_GATEWAYS,
  INITIAL_USER 
} from '../data/mockData';

interface ShopContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  currentUser: User | null;
  activeTab: 'home' | 'shop' | 'cart' | 'orders' | 'account';
  selectedProduct: Product | null;
  searchQuery: string;
  selectedCategory: ProductCategory | 'all';
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  couponCode: string;
  couponDiscount: number;
  isSupportChatOpen: boolean;
  isAIAssistantOpen: boolean;
  isCheckoutOpen: boolean;
  isAdminOpen: boolean;
  isWorkspaceOpen: boolean;
  isApkModalOpen: boolean;
  setIsApkModalOpen: (open: boolean) => void;
  workspaceMode: 'tasks' | 'meet' | 'contacts';
  unreadNotificationsCount: number;
  toastMessage: string | null;

  // Comparison
  compareProductIds: string[];
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;

  // Recently Viewed
  recentlyViewedIds: string[];
  recordRecentlyViewed: (id: string) => void;

  // Loyalty & Address
  loyaltyPoints: number;
  isLoyaltyOpen: boolean;
  setIsLoyaltyOpen: (open: boolean) => void;
  isAddressManagerOpen: boolean;
  setIsAddressManagerOpen: (open: boolean) => void;
  savedAddresses: SavedAddress[];
  addSavedAddress: (addr: Omit<SavedAddress, 'id'>) => void;
  deleteSavedAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Invoice & Returns & Modals
  activeInvoiceOrder: Order | null;
  setActiveInvoiceOrder: (order: Order | null) => void;
  activeReturnOrder: Order | null;
  setActiveReturnOrder: (order: Order | null) => void;
  activeRestockProduct: Product | null;
  setActiveRestockProduct: (product: Product | null) => void;
  activeReviewProduct: Product | null;
  setActiveReviewProduct: (product: Product | null) => void;
  shareWishlist: () => void;
  showToast: (msg: string) => void;

  // Delivery & Payment
  deliveryZones: DeliveryZone[];
  selectedZone: DeliveryZone;
  setSelectedZone: (zone: DeliveryZone) => void;
  paymentGateways: PaymentGatewayConfig[];

  // Support
  conversations: SupportConversation[];
  activeConversation: SupportConversation | null;
  sendSupportMessage: (text: string, attachedOrderId?: string, attachedProduct?: Product, imageUrl?: string) => Promise<void>;

  // Actions
  setActiveTab: (tab: 'home' | 'shop' | 'cart' | 'orders' | 'account') => void;
  setSelectedProduct: (prod: Product | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: ProductCategory | 'all') => void;
  formatPrice: (amountInFCFA: number) => string;
  addToCart: (product: Product, quantity?: number, variations?: Record<string, string>) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Modals & Panels
  setIsSupportChatOpen: (open: boolean) => void;
  setIsAIAssistantOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsAdminOpen: (open: boolean) => void;
  setIsWorkspaceOpen: (open: boolean) => void;
  setWorkspaceMode: (mode: 'tasks' | 'meet' | 'contacts') => void;

  // User & Orders
  handleGoogleLogin: () => void;
  handleLogout: () => void;
  placeOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, adminNotes?: string) => Promise<void>;
  markNotificationsAsRead: () => void;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;

  subtotal: number;
  deliveryFee: number;
  total: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(INITIAL_DELIVERY_ZONES);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(INITIAL_DELIVERY_ZONES[0]);
  const [paymentGateways] = useState<PaymentGatewayConfig[]>(INITIAL_PAYMENT_GATEWAYS);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('novashop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('novashop_wishlist');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-4'];
    } catch {
      return ['prod-1', 'prod-4'];
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USER);
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'cart' | 'orders' | 'account'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(2);

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [currency, setCurrency] = useState<CurrencyCode>('FCFA');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Comparison & Recently Viewed
  const [compareProductIds, setCompareProductIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('novashop_recent');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-2', 'prod-4'];
    } catch {
      return ['prod-1', 'prod-2', 'prod-4'];
    }
  });

  // Loyalty & Address
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(380);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [isAddressManagerOpen, setIsAddressManagerOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    return INITIAL_USER.savedAddresses || [];
  });

  // Feature Modals
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [activeReturnOrder, setActiveReturnOrder] = useState<Order | null>(null);
  const [activeRestockProduct, setActiveRestockProduct] = useState<Product | null>(null);
  const [activeReviewProduct, setActiveReviewProduct] = useState<Product | null>(null);

  // App Overlays
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<'tasks' | 'meet' | 'contacts'>('tasks');

  // Support Conversations
  const [conversations, setConversations] = useState<SupportConversation[]>([
    {
      id: 'conv-1',
      customerId: 'usr-1',
      customerName: 'Christian Eboa',
      customerPhone: '+237 671 23 45 67',
      status: 'open',
      channel: 'in_app',
      lastMessage: 'Bonjour ! Avez-vous la variante 256GB en stock à Douala ?',
      lastUpdated: '2026-10-04T11:00:00Z',
      messages: [
        {
          id: 'msg-1',
          sender: 'agent',
          senderName: 'Support NovaShop',
          text: 'Bonjour M. Eboa ! Bienvenue sur le service client NovaShop Cameroun. En quoi pouvons-nous vous assister aujourd\'hui ?',
          timestamp: '10:55'
        },
        {
          id: 'msg-2',
          sender: 'user',
          senderName: 'Christian Eboa',
          text: 'Bonjour ! Avez-vous la variante 256GB du NovaPhone 5G en stock à Douala ?',
          timestamp: '11:00'
        },
        {
          id: 'msg-3',
          sender: 'agent',
          senderName: 'Support NovaShop',
          text: 'Oui tout à fait ! Elle est disponible immédiatement au hub de Bonanjo avec livraison en 2h chrono.',
          timestamp: '11:02'
        }
      ]
    }
  ]);
  const [activeConversation, setActiveConversation] = useState<SupportConversation | null>(conversations[0]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('novashop_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('novashop_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('novashop_recent', JSON.stringify(recentlyViewedIds));
  }, [recentlyViewedIds]);

  // Fetch initial data from backend
  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.warn('Backend fetch products fallback', e);
    }
  };

  const refreshOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.warn('Backend fetch orders fallback', e);
    }
  };

  useEffect(() => {
    refreshProducts();
    refreshOrders();
  }, []);

  // Multi-Currency Converter
  const formatPrice = (amountInFCFA: number) => {
    if (isNaN(amountInFCFA)) return '0 FCFA';
    if (currency === 'EUR') {
      const eur = amountInFCFA / 655.957;
      return `${eur.toFixed(2).replace('.', ',')} €`;
    }
    if (currency === 'USD') {
      const usd = amountInFCFA / 610;
      return `$${usd.toFixed(2)}`;
    }
    if (currency === 'NGN') {
      const ngn = amountInFCFA * 2.38;
      return `₦${Math.round(ngn).toLocaleString('en-US')}`;
    }
    return `${Math.round(amountInFCFA).toLocaleString('fr-FR')} FCFA`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Product Comparison
  const addToCompare = (product: Product) => {
    if (compareProductIds.includes(product.id)) {
      showToast(`${product.name} est déjà dans le comparateur`);
      setIsCompareOpen(true);
      return;
    }
    if (compareProductIds.length >= 3) {
      showToast('Vous pouvez comparer jusqu\'à 3 produits simultanément.');
      setIsCompareOpen(true);
      return;
    }
    setCompareProductIds(prev => [...prev, product.id]);
    showToast(`${product.name} ajouté au comparateur ! ⚖️`);
  };

  const removeFromCompare = (productId: string) => {
    setCompareProductIds(prev => prev.filter(id => id !== productId));
  };

  const clearCompare = () => {
    setCompareProductIds([]);
  };

  const recordRecentlyViewed = (id: string) => {
    setRecentlyViewedIds(prev => {
      const filtered = prev.filter(item => item !== id);
      return [id, ...filtered].slice(0, 10);
    });
  };

  // Saved Addresses
  const addSavedAddress = (addr: Omit<SavedAddress, 'id'>) => {
    const newAddr: SavedAddress = {
      ...addr,
      id: `addr-${Date.now()}`
    };
    if (newAddr.isDefault) {
      setSavedAddresses(prev => [...prev.map(a => ({ ...a, isDefault: false })), newAddr]);
    } else {
      setSavedAddresses(prev => [...prev, newAddr]);
    }
    showToast('Nouvelle adresse enregistrée ! 📍');
  };

  const deleteSavedAddress = (id: string) => {
    setSavedAddresses(prev => prev.filter(a => a.id !== id));
    showToast('Adresse supprimée');
  };

  const setDefaultAddress = (id: string) => {
    setSavedAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
    showToast('Adresse principale mise à jour');
  };

  // Wishlist sharing
  const shareWishlist = () => {
    const wished = products.filter(p => wishlist.includes(p.id));
    if (wished.length === 0) {
      showToast('Votre liste d\'envies est vide pour le moment.');
      return;
    }
    const itemsText = wished.map(p => `• ${p.name} - ${formatPrice(p.discountPrice || p.price)}`).join('\n');
    const msg = `🛒 *Ma Wishlist NovaShop Cameroun*:\n\n${itemsText}\n\n👉 Retrouvez ces articles sur NovaShop Douala & Yaoundé.`;

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      navigator.share({ title: 'Ma Wishlist NovaShop', text: msg }).catch(() => {});
    } else {
      if (typeof navigator !== 'undefined' && 'clipboard' in navigator && (navigator as any).clipboard?.writeText) {
        (navigator as any).clipboard.writeText(msg).catch(() => {});
      }
      showToast('Wishlist copiée dans le presse-papier ! 📋');
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1, variations: Record<string, string> = {}) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }

    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id);
      if (existingIdx !== -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity, selectedVariations: variations }];
    });

    showToast(`${product.name} ajouté au panier ! 🛍️`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Article retiré du panier');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const isPresent = prev.includes(productId);
      if (isPresent) {
        showToast('Retiré des favoris');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Ajouté aux favoris ! ❤️');
        return [...prev, productId];
      }
    });
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setCouponDiscount(0);
  };

  const applyCoupon = async (code: string) => {
    try {
      const currentSubtotal = cart.reduce((acc, item) => {
        const p = item.product.discountPrice || item.product.price;
        return acc + p * item.quantity;
      }, 0);

      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, amount: currentSubtotal })
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setCouponCode(data.code);
        setCouponDiscount(data.discountAmount);
        showToast(data.message || 'Code promo appliqué ! 🎉');
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Code promo invalide.' };
    } catch {
      return { success: false, message: 'Erreur lors de la validation du code promo.' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    showToast('Code promo retiré');
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => {
    const p = item.product.discountPrice || item.product.price;
    return acc + p * item.quantity;
  }, 0);

  const deliveryFee = subtotal >= selectedZone.freeDeliveryThreshold || subtotal === 0 ? 0 : selectedZone.fee;
  const total = Math.max(0, subtotal + deliveryFee - couponDiscount);

  // Support messages
  const sendSupportMessage = async (text: string, attachedOrderId?: string, attachedProduct?: Product, imageUrl?: string) => {
    if (!activeConversation) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: currentUser?.name || 'Moi',
      text,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      attachedOrderId,
      attachedProduct,
      imageUrl
    };

    const updatedConv: SupportConversation = {
      ...activeConversation,
      lastMessage: text,
      lastUpdated: new Date().toISOString(),
      messages: [...activeConversation.messages, newMsg]
    };

    setActiveConversation(updatedConv);
    setConversations(prev => prev.map(c => c.id === updatedConv.id ? updatedConv : c));

    // Simulated agent auto-reply
    setTimeout(() => {
      const agentReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'agent',
        senderName: 'Conseiller NovaShop',
        text: 'Message bien reçu ! Un agent logistique dédié traite votre demande avec priorité.',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };

      const finalConv: SupportConversation = {
        ...updatedConv,
        lastMessage: agentReply.text,
        lastUpdated: new Date().toISOString(),
        messages: [...updatedConv.messages, agentReply]
      };

      setActiveConversation(finalConv);
      setConversations(prev => prev.map(c => c.id === finalConv.id ? finalConv : c));
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setCurrentUser(INITIAL_USER);
    showToast('Connecté avec succès !');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Déconnecté.');
  };

  const placeOrder = async (orderData: Partial<Order>): Promise<Order> => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          items: cart.map(i => ({
            productId: i.product.id,
            productName: i.product.name,
            price: i.product.discountPrice || i.product.price,
            quantity: i.quantity,
            image: i.product.images[0],
            selectedVariations: i.selectedVariations
          })),
          subtotal,
          deliveryFee,
          discount: couponDiscount,
          total,
          currency: 'FCFA',
          appliedCoupon: couponCode || undefined,
          loyaltyPointsEarned: Math.round(total / 1000)
        })
      });

      if (!res.ok) throw new Error('Order creation failed');
      const createdOrder: Order = await res.json();
      
      setOrders(prev => [createdOrder, ...prev]);
      setLoyaltyPoints(prev => prev + Math.round(total / 1000));
      clearCart();
      refreshProducts();
      showToast(`Commande ${createdOrder.id} confirmée ! 📦`);
      return createdOrder;
    } catch (e) {
      console.warn('Backend order placement fallback', e);
      const fallbackOrder: Order = {
        id: `NS-2026-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        customerId: currentUser?.id || 'guest',
        customerName: orderData.customerName || currentUser?.name || 'Client NovaShop',
        customerEmail: orderData.customerEmail || currentUser?.email || 'client@novashop.cm',
        customerPhone: orderData.customerPhone || currentUser?.phone || '+237 671 23 45 67',
        items: cart.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          price: i.product.discountPrice || i.product.price,
          quantity: i.quantity,
          image: i.product.images[0]
        })),
        subtotal,
        deliveryFee,
        discount: couponDiscount,
        total,
        currency: 'FCFA',
        status: 'pending',
        paymentStatus: 'successful',
        paymentMethod: orderData.paymentMethod || 'mtn_momo',
        deliveryMethod: orderData.deliveryMethod || 'standard',
        deliveryAddress: orderData.deliveryAddress || {
          fullName: 'Client NovaShop',
          phone: '+237 671 23 45 67',
          city: 'Douala',
          street: 'Akwa'
        },
        trackingTimeline: [
          { status: 'pending', label: 'Commande Passée', description: 'Enregistrée', completed: true, current: true }
        ]
      };
      setOrders(prev => [fallbackOrder, ...prev]);
      clearCart();
      return fallbackOrder;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, adminNotes?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      }
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  const markNotificationsAsRead = () => {
    setUnreadNotificationsCount(0);
    showToast('Notifications marquées comme lues');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        orders,
        cart,
        wishlist,
        currentUser,
        activeTab,
        selectedProduct,
        searchQuery,
        selectedCategory,
        currency,
        setCurrency,
        couponCode,
        couponDiscount,
        isSupportChatOpen,
        isAIAssistantOpen,
        isCheckoutOpen,
        isAdminOpen,
        isWorkspaceOpen,
        workspaceMode,
        unreadNotificationsCount,
        toastMessage,

        compareProductIds,
        isCompareOpen,
        setIsCompareOpen,
        addToCompare,
        removeFromCompare,
        clearCompare,

        recentlyViewedIds,
        recordRecentlyViewed,

        loyaltyPoints,
        isLoyaltyOpen,
        setIsLoyaltyOpen,
        isAddressManagerOpen,
        setIsAddressManagerOpen,
        savedAddresses,
        addSavedAddress,
        deleteSavedAddress,
        setDefaultAddress,

        activeInvoiceOrder,
        setActiveInvoiceOrder,
        activeReturnOrder,
        setActiveReturnOrder,
        activeRestockProduct,
        setActiveRestockProduct,
        activeReviewProduct,
        setActiveReviewProduct,
        shareWishlist,
        showToast,

        deliveryZones,
        selectedZone,
        setSelectedZone,
        paymentGateways,

        conversations,
        activeConversation,
        sendSupportMessage,

        setActiveTab,
        setSelectedProduct,
        setSearchQuery,
        setSelectedCategory,
        formatPrice,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        clearCart,
        applyCoupon,
        removeCoupon,

        setIsSupportChatOpen,
        setIsAIAssistantOpen,
        setIsCheckoutOpen,
        setIsAdminOpen,
        setIsWorkspaceOpen,
        isApkModalOpen,
        setIsApkModalOpen,
        setWorkspaceMode,

        handleGoogleLogin,
        handleLogout,
        placeOrder,
        updateOrderStatus,
        markNotificationsAsRead,
        refreshProducts,
        refreshOrders,

        subtotal,
        deliveryFee,
        total
      }}
    >
      {children}
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-blue-600 text-white font-semibold text-xs shadow-2xl shadow-blue-500/50 border border-blue-400/40 animate-fade-in flex items-center gap-2">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
