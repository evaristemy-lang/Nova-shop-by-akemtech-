import { Product, Order, DeliveryZone, PaymentGatewayConfig, Coupon, User } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'NP-5G-128-BLK',
    name: 'NovaPhone 5G Apex',
    description: 'Smartphone haut de gamme avec écran AMOLED 120Hz 6.67", processeur Dimensity 8200 5G, triple capteur photo 108MP OIS, et charge ultra-rapide 68W. Double SIM 4G/5G certifié pour les réseaux MTN et Orange Cameroun.',
    shortDescription: '108MP Triple Cam, 5G Dual SIM, Charge 68W (30 min)',
    category: 'smartphones',
    subcategory: 'Smartphones 5G',
    brand: 'NovaTech',
    price: 185000,
    discountPrice: 165000,
    costPrice: 125000,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    inStock: true,
    stockCount: 18,
    reservedStock: 2,
    lowStockThreshold: 5,
    rating: 4.9,
    reviewsCount: 42,
    reviews: [
      {
        id: 'rev-1',
        userId: 'u-1',
        userName: 'Christian Eboa (Douala)',
        rating: 5,
        comment: 'Livraison express à Bonanjo en 2h. Le téléphone est ultra fluide, l\'appareil photo de 108MP fait des merveilles.',
        date: '2026-10-01',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        userId: 'u-2',
        userName: 'Nadine Kamga (Yaoundé)',
        rating: 5,
        comment: 'Superbe autonomie avec les 5000mAh, tient plus de 24h avec la 4G activée sans coupure.',
        date: '2026-09-28',
        verifiedPurchase: true
      }
    ],
    specifications: [
      { name: 'Écran', value: '6.67" AMOLED 120Hz FHD+' },
      { name: 'Processeur', value: 'MediaTek Dimensity 8200 5G' },
      { name: 'RAM / Stockage', value: '8GB RAM + 128GB ROM' },
      { name: 'Appareil Photo', value: '108MP Principal + 8MP Ultra-wide + 16MP Selfie' },
      { name: 'Batterie', value: '5000 mAh avec charge 68W' },
      { name: 'Réseaux', value: '5G / 4G LTE MTN & Orange Cam' }
    ],
    variations: [
      { id: 'v-1', name: 'Noir Minéral', type: 'color', value: '#1e293b', inStock: true },
      { id: 'v-2', name: 'Bleu Océan', type: 'color', value: '#1d4ed8', inStock: true },
      { id: 'v-3', name: '256GB Stockage', type: 'storage', value: '256GB', priceModifier: 20000, inStock: true }
    ],
    tags: ['smartphone', '5g', '108mp', 'fastcharge', 'android'],
    isFeatured: true,
    isBestSeller: true,
    isNew: true,
    visibility: 'published',
    warranty: 'Garantie officielle 24 mois avec centre SAV à Douala & Yaoundé',
    createdAt: '2026-09-15'
  },
  {
    id: 'prod-2',
    sku: 'NOVA-TAB-10-STU',
    name: 'Tablette ScholarPro 10.4"',
    description: 'Tablette éducative et professionnelle idéale pour étudiants et professionnels au Cameroun. Écran 2K Eye-Care anti-lumière bleue, processeur octa-core, 6GB RAM, 128GB extensible via MicroSD. Clavier Bluetooth et stylet actif inclus dans le coffret.',
    shortDescription: 'Pack Étudiant Complet : Écran 2K, Clavier & Stylet Inclus',
    category: 'student',
    subcategory: 'Tablettes Éducatives',
    brand: 'NovaTech',
    price: 135000,
    discountPrice: 119000,
    costPrice: 85000,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 24,
    reservedStock: 1,
    lowStockThreshold: 6,
    rating: 4.8,
    reviewsCount: 31,
    reviews: [
      {
        id: 'rev-3',
        userId: 'u-3',
        userName: 'Brice Tchounkeu (Dschang)',
        rating: 5,
        comment: 'Indispensable pour mes études universitaires. Le stylet permet de prendre des notes directement sur les PDF.',
        date: '2026-09-20',
        verifiedPurchase: true
      }
    ],
    specifications: [
      { name: 'Écran', value: '10.4" 2K IPS (2000x1200)' },
      { name: 'Mémoire', value: '6GB RAM + 128GB ROM' },
      { name: 'Batterie', value: '7200 mAh (12h d\'autonomie)' },
      { name: 'Accessoires', value: 'Clavier Bluetooth + Housse + Stylet inclus' }
    ],
    variations: [
      { id: 'v-4', name: 'Gris Sidéral', type: 'color', value: '#475569', inStock: true },
      { id: 'v-5', name: 'Argent Lunaire', type: 'color', value: '#94a3b8', inStock: true }
    ],
    tags: ['tablette', 'etudiant', 'stylet', 'clavier', 'rentree'],
    isFeatured: true,
    isBestSeller: true,
    visibility: 'published',
    warranty: 'Garantie 12 mois constructeur',
    createdAt: '2026-09-10'
  },
  {
    id: 'prod-3',
    sku: 'PULSE-ANC-PRO',
    name: 'Casque Sans-Fil PulseANC Studio',
    description: 'Casque circum-auriculaire premium avec réduction active du bruit hybride (ANC jusqu\'à 38dB), Bluetooth 5.3 multipoint, coussinets à mémoire de forme aérés et autonomie colossale de 50 heures. Idéal pour le travail et les transports.',
    shortDescription: 'Réduction de Bruit Active 38dB, 50h d\'Autonomie',
    category: 'electronics',
    subcategory: 'Audio & Casques',
    brand: 'PulseAudio',
    price: 48000,
    discountPrice: 39000,
    costPrice: 22000,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 35,
    reservedStock: 3,
    lowStockThreshold: 8,
    rating: 4.7,
    reviewsCount: 19,
    reviews: [
      {
        id: 'rev-4',
        userId: 'u-4',
        userName: 'Samuel Mengue (Douala)',
        rating: 5,
        comment: 'Très bonne isolation dans les taxis et au bureau. Les basses sont profondes sans saturer.',
        date: '2026-09-25',
        verifiedPurchase: true
      }
    ],
    specifications: [
      { name: 'Autonomie', value: '50 heures (ANC désactivé) / 38 heures (ANC actif)' },
      { name: 'Connectivité', value: 'Bluetooth 5.3 + Prise Jack 3.5mm incluse' },
      { name: 'Charge', value: 'USB-C rapide (10 min = 4h d\'écoute)' }
    ],
    variations: [
      { id: 'v-6', name: 'Noir Mat', type: 'color', value: '#0f172a', inStock: true },
      { id: 'v-7', name: 'Blanc Ivoire', type: 'color', value: '#f8fafc', inStock: true }
    ],
    tags: ['audio', 'casque', 'anc', 'bluetooth', 'musique'],
    isFeatured: true,
    isBestSeller: false,
    visibility: 'published',
    warranty: 'Garantie 12 mois',
    createdAt: '2026-09-05'
  },
  {
    id: 'prod-4',
    sku: 'SOLAR-HOME-KIT-150',
    name: 'Kit Solaire Domestique NovaSun 150W',
    description: 'Système d\'énergie solaire anti-coupure de courant pour la maison ou le commerce. Comprend panneau photovoltaïque monocristallin 150W, batterie lithium LiFePO4 longue durée 12.8V 30Ah, 4 ampoules LED lumineuses, et centrale de recharge téléphone USB.',
    shortDescription: 'Kit Anti-Délestage : Panneau 150W + Batterie LiFePO4 + 4 Ampoules LED',
    category: 'home',
    subcategory: 'Énergie Solaire & Maison',
    brand: 'NovaSun',
    price: 95000,
    discountPrice: 85000,
    costPrice: 58000,
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 14,
    reservedStock: 1,
    lowStockThreshold: 4,
    rating: 4.9,
    reviewsCount: 27,
    reviews: [
      {
        id: 'rev-5',
        userId: 'u-5',
        userName: 'Papa Jean (Bafoussam)',
        rating: 5,
        comment: 'Très efficace lors des coupures d\'Eneo. Toute la maison reste éclairée et nous pouvons charger tous nos téléphones.',
        date: '2026-09-18',
        verifiedPurchase: true
      }
    ],
    specifications: [
      { name: 'Panneau', value: '150W Monocristallin Haute Efficacité' },
      { name: 'Batterie', value: 'LiFePO4 3000 cycles (durée de vie 8 ans)' },
      { name: 'Sorties', value: '4x DC 12V + 4x Ports USB 5V 2.4A' },
      { name: 'Inclus', value: 'Câbles 5m, 4 interrupteurs indépendants' }
    ],
    variations: [
      { id: 'v-8', name: 'Pack Standard 150W', type: 'size', value: '150W', inStock: true },
      { id: 'v-9', name: 'Pack Pro 250W', type: 'size', value: '250W', priceModifier: 45000, inStock: true }
    ],
    tags: ['solaire', 'kit', 'eneo', 'batterie', 'energie'],
    isFeatured: true,
    isBestSeller: true,
    isNew: true,
    visibility: 'published',
    warranty: 'Garantie 24 mois',
    createdAt: '2026-09-01'
  },
  {
    id: 'prod-5',
    sku: 'SMART-WATCH-PRO-4',
    name: 'Montre Connectée PulseWatch Ultra',
    description: 'Montre intelligente sportive avec boîtier en titane renforcé, écran AMOLED Always-On 1.43", GPS intégré, suivi cardiaque 24/7, SpO2, appel Bluetooth et autonomie jusqu\'à 14 jours.',
    shortDescription: 'Boîtier Titane, Appels Bluetooth & GPS Intégré',
    category: 'electronics',
    subcategory: 'Montres Connectées',
    brand: 'PulseAudio',
    price: 36000,
    discountPrice: 29500,
    costPrice: 18000,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 42,
    reservedStock: 2,
    lowStockThreshold: 10,
    rating: 4.6,
    reviewsCount: 15,
    reviews: [],
    specifications: [
      { name: 'Écran', value: '1.43" AMOLED 466x466' },
      { name: 'Étanchéité', value: 'IP68 5ATM (natation)' },
      { name: 'Autonomie', value: '14 jours en usage normal' }
    ],
    variations: [
      { id: 'v-10', name: 'Bracelet Silicone Noir', type: 'color', value: '#0f172a', inStock: true },
      { id: 'v-11', name: 'Bracelet Orange Sport', type: 'color', value: '#ea580c', inStock: true }
    ],
    tags: ['montre', 'smartwatch', 'sport', 'gps', 'sante'],
    isFeatured: false,
    isBestSeller: true,
    visibility: 'published',
    warranty: 'Garantie 12 mois',
    createdAt: '2026-09-12'
  },
  {
    id: 'prod-6',
    sku: 'BACKPACK-HYDRO-SHIELD',
    name: 'Sac à Dos Étanche NovaShield Anti-Vol',
    description: 'Sac à dos ultra-résistant pour étudiant ou professionnel. Toile Oxford imperméable face aux pluies tropicales de Douala, compartiment matelassé pour ordinateur jusqu\'à 16", cadenas TSA intégré et port de charge USB externe.',
    shortDescription: '100% Imperméable, Anti-Vol TSA & Port USB Externe',
    category: 'student',
    subcategory: 'Sacs & Bagagerie',
    brand: 'NovaTech',
    price: 24000,
    discountPrice: 19500,
    costPrice: 11000,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 50,
    reservedStock: 0,
    lowStockThreshold: 10,
    rating: 4.8,
    reviewsCount: 22,
    reviews: [],
    specifications: [
      { name: 'Capacité', value: '28 Litres (PC jusqu\'à 16 pouces)' },
      { name: 'Matière', value: 'Oxford 900D déperlant haute densité' },
      { name: 'Sécurité', value: 'Fermetures éclair cachées et cadenas TSA' }
    ],
    variations: [
      { id: 'v-12', name: 'Noir Carbone', type: 'color', value: '#18181b', inStock: true },
      { id: 'v-13', name: 'Gris Métallisé', type: 'color', value: '#64748b', inStock: true }
    ],
    tags: ['sac', 'etanche', 'pc', 'etudiant', 'antivol'],
    isFeatured: false,
    isBestSeller: true,
    isNew: true,
    visibility: 'published',
    warranty: 'Garantie 6 mois',
    createdAt: '2026-09-08'
  },
  {
    id: 'prod-7',
    sku: 'SHEA-GLOW-CARE-BIO',
    name: 'Coffret Soin Naturel Beurre de Karité & Huile de Baobab',
    description: 'Soin corporel et capillaire 100% naturel certifié d\'origine Cameroun. Formulé avec du beurre de karité bio du Nord et de l\'huile vierge de baobab pressée à froid. Nourrit en profondeur et protège la peau contre la déshydratation.',
    shortDescription: '100% Bio & Artisanal Cameroun : Corps & Cheveux',
    category: 'beauty',
    subcategory: 'Soins Naturels & Beauté',
    brand: 'NovaPure',
    price: 15000,
    discountPrice: 12500,
    costPrice: 6500,
    images: [
      'https://images.unsplash.com/photo-1608248597359-561358cb6cb4?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 60,
    reservedStock: 0,
    lowStockThreshold: 15,
    rating: 4.9,
    reviewsCount: 18,
    reviews: [],
    specifications: [
      { name: 'Ingrédients', value: 'Beurre de Karité Bio, Huile de Baobab, Vitamine E' },
      { name: 'Contenance', value: 'Pot 250ml + Flacon 100ml' },
      { name: 'Origine', value: 'Garoua / Maroua (Cameroun)' }
    ],
    variations: [],
    tags: ['bio', 'beaute', 'karite', 'naturel', 'cameroun'],
    isFeatured: false,
    isBestSeller: false,
    visibility: 'published',
    warranty: 'Garantie fraîcheur et authenticité',
    createdAt: '2026-09-02'
  },
  {
    id: 'prod-8',
    sku: 'POLO-AFRO-STYLE-26',
    name: 'Polo Élégant Wax Touch Nova',
    description: 'Polo col raffiné avec finitions en tissu wax authentique sur le col et les manches. Confectionné en coton piqué 100% respirant pour le climat tropical.',
    shortDescription: 'Coton Piqué Respirant avec Finitions Wax Élégantes',
    category: 'fashion',
    subcategory: 'Vêtements Homme & Femme',
    brand: 'NovaStyle',
    price: 18000,
    discountPrice: 14500,
    costPrice: 7500,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 30,
    reservedStock: 1,
    lowStockThreshold: 8,
    rating: 4.7,
    reviewsCount: 14,
    reviews: [],
    specifications: [
      { name: 'Matière', value: '100% Coton Piqué peigné' },
      { name: 'Coupe', value: 'Coupe Regular moderne' }
    ],
    variations: [
      { id: 'v-14', name: 'Taille M', type: 'size', value: 'M', inStock: true },
      { id: 'v-15', name: 'Taille L', type: 'size', value: 'L', inStock: true },
      { id: 'v-16', name: 'Taille XL', type: 'size', value: 'XL', inStock: true }
    ],
    tags: ['mode', 'wax', 'polo', 'vetement', 'coton'],
    isFeatured: false,
    isBestSeller: false,
    visibility: 'published',
    warranty: 'Garantie échange de taille gratuit 7 jours',
    createdAt: '2026-08-25'
  },
  {
    id: 'prod-9',
    sku: 'POWER-BANK-20000-PD',
    name: 'Power Bank Ultra-Fast 20 000 mAh NovaPower',
    description: 'Batterie externe 20 000 mAh avec charge ultra-rapide Power Delivery 30W et Quick Charge 3.0. Permet de recharger un smartphone 4 à 5 fois et même un ordinateur portable léger en urgence. Écran LED affichant le pourcentage exact.',
    shortDescription: '20 000 mAh, Charge 30W PD, Écran LED Numérique',
    category: 'electronics',
    subcategory: 'Batteries & Chargeurs',
    brand: 'NovaTech',
    price: 22000,
    discountPrice: 17500,
    costPrice: 9500,
    images: [
      'https://images.unsplash.com/photo-1609592424367-9324a9a089d7?auto=format&fit=crop&w=800&q=80'
    ],
    inStock: true,
    stockCount: 45,
    reservedStock: 2,
    lowStockThreshold: 10,
    rating: 4.8,
    reviewsCount: 38,
    reviews: [],
    specifications: [
      { name: 'Capacité', value: '20 000 mAh (74Wh)' },
      { name: 'Entrées', value: 'USB-C 20W + Micro-USB' },
      { name: 'Sorties', value: '1x USB-C PD 30W + 2x USB-A QC 18W' }
    ],
    variations: [
      { id: 'v-17', name: 'Noir Mat', type: 'color', value: '#18181b', inStock: true },
      { id: 'v-18', name: 'Blanc Nacré', type: 'color', value: '#f1f5f9', inStock: true }
    ],
    tags: ['powerbank', 'batterie', 'chargeur', 'eneo', 'secours'],
    isFeatured: true,
    isBestSeller: true,
    isNew: true,
    visibility: 'published',
    warranty: 'Garantie 12 mois',
    createdAt: '2026-09-22'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'NS-2026-000108',
    date: '2026-10-04T10:15:00Z',
    customerId: 'cust-101',
    customerName: 'Jean-Paul Kamdem',
    customerEmail: 'jp.kamdem@gmail.com',
    customerPhone: '+237 677 88 99 00',
    items: [
      {
        productId: 'prod-1',
        productName: 'NovaPhone 5G Apex',
        price: 165000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80',
        selectedVariations: { color: 'Noir Minéral' }
      }
    ],
    subtotal: 165000,
    deliveryFee: 1500,
    discount: 5000,
    total: 161500,
    currency: 'FCFA',
    status: 'shipped',
    paymentStatus: 'successful',
    paymentMethod: 'mtn_momo',
    paymentReference: 'MOMO-CMR-9847291',
    deliveryMethod: 'express',
    deliveryAddress: {
      fullName: 'Jean-Paul Kamdem',
      phone: '+237 677 88 99 00',
      city: 'Douala',
      neighborhood: 'Bonapriso',
      street: 'Rue des Palmiers, Immeuble Horizon 3e étage',
      notes: 'Sonner à l\'interphone Kamdem'
    },
    carrierName: 'NovaExpress Douala Fleet',
    trackingNumber: 'NX-DLA-83921',
    estimatedDeliveryDate: '2026-10-04 (14h00 - 16h00)',
    deliveryAgent: {
      name: 'Alain Fotso (Livreur Zone Bonapriso)',
      phone: '+237 671 22 33 44'
    },
    trackingTimeline: [
      { status: 'pending', label: 'Commande Passée', description: 'Reçue sur NovaShop et paiement MTN MoMo vérifié', timestamp: '10:15', completed: true, current: false, actor: 'Client' },
      { status: 'confirmed', label: 'Commande Confirmée', description: 'Validée par le service logistique Douala Hub', timestamp: '10:20', completed: true, current: false, actor: 'Système' },
      { status: 'processing', label: 'Préparation en Entrepôt', description: 'Articles scellés et contrôlés par l\'équipe', timestamp: '10:45', completed: true, current: false, actor: 'Hub Douala' },
      { status: 'shipped', label: 'En Cours de Livraison', description: 'Remis au coursier Alain Fotso en direction de Bonapriso', timestamp: '11:30', completed: true, current: true, actor: 'Coursier Alain' },
      { status: 'delivered', label: 'Livraison au Client', description: 'Signature du bon de livraison et inspection du colis', completed: false, current: false }
    ],
    adminNotes: 'Client VIP. Livraison prioritaire avant 15h confirmée par SMS.',
    invoiceNumber: 'INV-2026-000108',
    appliedCoupon: 'NOVA2026',
    loyaltyPointsEarned: 161
  },
  {
    id: 'NS-2026-000107',
    date: '2026-10-03T15:40:00Z',
    customerId: 'cust-102',
    customerName: 'Clarisse Ngo Bell',
    customerEmail: 'clarisse.bell@yahoo.fr',
    customerPhone: '+237 699 11 22 33',
    items: [
      {
        productId: 'prod-2',
        productName: 'Tablette ScholarPro 10.4"',
        price: 119000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80',
        selectedVariations: { color: 'Gris Sidéral' }
      },
      {
        productId: 'prod-6',
        productName: 'Sac à Dos Étanche NovaShield Anti-Vol',
        price: 19500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80'
      }
    ],
    subtotal: 138500,
    deliveryFee: 2500,
    discount: 0,
    total: 141000,
    currency: 'FCFA',
    status: 'delivered',
    paymentStatus: 'successful',
    paymentMethod: 'orange_money',
    paymentReference: 'OM-CMR-482019',
    deliveryMethod: 'standard',
    deliveryAddress: {
      fullName: 'Clarisse Ngo Bell',
      phone: '+237 699 11 22 33',
      city: 'Yaoundé',
      neighborhood: 'Bastos',
      street: 'Carrefour Ambassade, Villa 12',
      notes: 'Laisser au gardien si absent'
    },
    carrierName: 'NovaExpress InterCity (Douala - Yaoundé)',
    trackingNumber: 'NX-YDE-92014',
    trackingTimeline: [
      { status: 'pending', label: 'Commande Passée', description: 'Paiement Orange Money validé', timestamp: '15:40 (03/10)', completed: true, current: false },
      { status: 'processing', label: 'Expédiée depuis Douala Hub', description: 'Véhicule de transit Douala-Yaoundé', timestamp: '18:00 (03/10)', completed: true, current: false },
      { status: 'shipped', label: 'En Livraison Yaoundé', description: 'Prise en charge par le hub Bastos', timestamp: '09:00 (04/10)', completed: true, current: false },
      { status: 'delivered', label: 'Colis Reçu avec Succès', description: 'Reçu par Mme Clarisse Ngo Bell', timestamp: '11:15 (04/10)', completed: true, current: false }
    ],
    invoiceNumber: 'INV-2026-000107',
    loyaltyPointsEarned: 141
  },
  {
    id: 'NS-2026-000106',
    date: '2026-10-02T09:30:00Z',
    customerId: 'cust-103',
    customerName: 'Marc Essomba',
    customerEmail: 'marc.essomba@hotmail.com',
    customerPhone: '+237 655 44 33 22',
    items: [
      {
        productId: 'prod-4',
        productName: 'Kit Solaire Domestique NovaSun 150W',
        price: 85000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80'
      }
    ],
    subtotal: 85000,
    deliveryFee: 0,
    discount: 0,
    total: 85000,
    currency: 'FCFA',
    status: 'delivered',
    paymentStatus: 'successful',
    paymentMethod: 'card',
    paymentReference: 'VISA-9921',
    deliveryMethod: 'standard',
    deliveryAddress: {
      fullName: 'Marc Essomba',
      phone: '+237 655 44 33 22',
      city: 'Douala',
      neighborhood: 'Akwa',
      street: 'Boulevard de la Liberté',
      notes: ''
    },
    trackingTimeline: [
      { status: 'pending', label: 'Passée', description: 'Reçue', timestamp: '09:30 (02/10)', completed: true, current: false },
      { status: 'delivered', label: 'Livrée', description: 'Remise en main propre', timestamp: '16:00 (02/10)', completed: true, current: false }
    ],
    invoiceNumber: 'INV-2026-000106',
    loyaltyPointsEarned: 85
  }
];

export const INITIAL_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone-dla-express',
    name: 'Douala Express (Akwa, Bonanjo, Bonapriso, Bali, Deido)',
    city: 'Douala',
    fee: 1500,
    freeDeliveryThreshold: 50000,
    estimatedHours: '2 à 4 heures',
    active: true
  },
  {
    id: 'zone-dla-standard',
    name: 'Douala Périphérie (Makepe, Kotto, Bonamoussadi, Logbessou, Yassa)',
    city: 'Douala',
    fee: 2000,
    freeDeliveryThreshold: 60000,
    estimatedHours: '4 à 8 heures',
    active: true
  },
  {
    id: 'zone-yde',
    name: 'Yaoundé Centre & Bastos (Bastos, Omnisports, Tsinga, Centre-Ville)',
    city: 'Yaoundé',
    fee: 2500,
    freeDeliveryThreshold: 80000,
    estimatedHours: '24 heures (J+1)',
    active: true
  },
  {
    id: 'zone-regions',
    name: 'Régions (Bafoussam, Kribi, Limbe, Bamenda, Buea)',
    city: 'Régions',
    fee: 4000,
    freeDeliveryThreshold: 120000,
    estimatedHours: '24 à 48 heures',
    active: true
  }
];

export const INITIAL_PAYMENT_GATEWAYS: PaymentGatewayConfig[] = [
  { id: 'gate-momo', name: 'MTN Mobile Money Cameroun (*126#)', provider: 'mtn', enabled: true, merchantNumber: '677000111' },
  { id: 'gate-om', name: 'Orange Money Cameroun (*150#)', provider: 'orange', enabled: true, merchantNumber: '699000222' },
  { id: 'gate-card', name: 'Carte Bancaire Visa / Mastercard / UBA', provider: 'stripe', enabled: true },
  { id: 'gate-cod', name: 'Paiement à la Livraison (Cash on Delivery Douala & Yaoundé)', provider: 'cash', enabled: true }
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minPurchase: 20000, validUntil: '2026-12-31', active: true },
  { code: 'NOVA2026', discountType: 'fixed', discountValue: 5000, minPurchase: 50000, validUntil: '2026-12-31', active: true },
  { code: 'VIP50', discountType: 'percentage', discountValue: 50, minPurchase: 10000, validUntil: '2026-12-31', active: true }
];

export const INITIAL_USER: User = {
  id: 'usr-1',
  name: 'Christian Eboa',
  email: 'evaristemy@gmail.com',
  phone: '+237 671 23 45 67',
  role: 'customer',
  loyaltyPoints: 380,
  savedAddresses: [
    {
      id: 'addr-1',
      label: 'Domicile (Bonanjo)',
      fullName: 'Christian Eboa',
      phone: '+237 671 23 45 67',
      city: 'Douala',
      neighborhood: 'Bonanjo',
      street: 'Rue Joss, Résidence Les Palmiers',
      isDefault: true,
      notes: 'Appartement 4B, sonner à l\'entrée'
    },
    {
      id: 'addr-2',
      label: 'Bureau (Akwa)',
      fullName: 'Christian Eboa',
      phone: '+237 671 23 45 67',
      city: 'Douala',
      neighborhood: 'Akwa',
      street: 'Boulevard de la Liberté, Tour Nova 2e étage',
      isDefault: false,
      notes: 'Réception générale entre 8h et 17h'
    }
  ]
};
