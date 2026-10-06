import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { 
  Product, 
  Order, 
  DeliveryZone, 
  PaymentGatewayConfig, 
  Coupon, 
  InventoryTransaction,
  OrderStatus 
} from './src/types/index';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_DELIVERY_ZONES, 
  INITIAL_PAYMENT_GATEWAYS, 
  INITIAL_COUPONS 
} from './src/data/mockData';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// In-memory Live Database
let products: Product[] = [...INITIAL_PRODUCTS];
let orders: Order[] = [...INITIAL_ORDERS];
let deliveryZones: DeliveryZone[] = [...INITIAL_DELIVERY_ZONES];
let paymentGateways: PaymentGatewayConfig[] = [...INITIAL_PAYMENT_GATEWAYS];
let coupons: Coupon[] = [...INITIAL_COUPONS];
let inventoryTransactions: InventoryTransaction[] = [
  {
    id: 'tx-1',
    productId: 'prod-1',
    productName: 'NovaPhone 5G Apex',
    previousStock: 20,
    newStock: 18,
    difference: -2,
    reason: 'sale',
    performedBy: 'System (Commande NS-2026-000108)',
    date: '2026-10-04T10:15:00Z',
    orderId: 'NS-2026-000108'
  }
];

// Initialize Gemini Client if API key is present
const geminiApiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey: geminiApiKey });
  } catch (err) {
    console.warn('Failed to init GoogleGenAI client:', err);
  }
}

// -------------------------------------------------------------
// 1. ADMIN AUTHENTICATION
// -------------------------------------------------------------
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  
  if (!identifier || !password) {
    return res.status(400).json({ success: false, error: 'Identifiants requis' });
  }

  const cleanId = String(identifier).trim().toLowerCase();
  const cleanPass = String(password).trim();

  // Allow admin login: admin@novashop.cm / admin2026 or evaristemy@gmail.com / admin2026
  if (
    (cleanId === 'admin@novashop.cm' || cleanId === 'evaristemy@gmail.com' || cleanId === 'admin') &&
    (cleanPass === 'admin2026' || cleanPass === 'novashop2026' || cleanPass === 'password')
  ) {
    return res.json({
      success: true,
      user: {
        id: 'adm-1',
        name: 'Administrateur Principal',
        email: 'admin@novashop.cm',
        phone: '+237 671 23 45 67',
        role: 'admin'
      }
    });
  }

  // Generic secure error response
  return res.status(401).json({
    success: false,
    error: 'Identifiants incorrects ou rôle administrateur non attribué.'
  });
});

// -------------------------------------------------------------
// 2. PRODUCTS & INVENTORY
// -------------------------------------------------------------
app.get('/api/products', (_req: Request, res: Response) => {
  res.json(products);
});

app.post('/api/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    ...req.body,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    rating: req.body.rating || 5.0,
    reviewsCount: req.body.reviewsCount || 0,
    reviews: req.body.reviews || [],
    specifications: req.body.specifications || [],
    variations: req.body.variations || [],
    tags: req.body.tags || [],
    images: req.body.images && req.body.images.length > 0 
      ? req.body.images 
      : ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80']
  };

  products.unshift(newProduct);

  // Log inventory creation transaction
  inventoryTransactions.unshift({
    id: `tx-${Date.now()}`,
    productId: newProduct.id,
    productName: newProduct.name,
    previousStock: 0,
    newStock: newProduct.stockCount,
    difference: newProduct.stockCount,
    reason: 'restock',
    performedBy: 'Admin',
    date: new Date().toISOString()
  });

  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Produit non trouvé' });
  }

  const oldProduct = products[idx];
  const updatedProduct = {
    ...oldProduct,
    ...req.body,
    id,
    updatedAt: new Date().toISOString()
  };

  // Check if stock changed to record inventory transaction
  if (oldProduct.stockCount !== updatedProduct.stockCount) {
    const diff = updatedProduct.stockCount - oldProduct.stockCount;
    inventoryTransactions.unshift({
      id: `tx-${Date.now()}`,
      productId: updatedProduct.id,
      productName: updatedProduct.name,
      previousStock: oldProduct.stockCount,
      newStock: updatedProduct.stockCount,
      difference: diff,
      reason: diff > 0 ? 'restock' : 'adjustment',
      performedBy: 'Admin',
      date: new Date().toISOString()
    });
  }

  products[idx] = updatedProduct;
  res.json(updatedProduct);
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Produit non trouvé' });
  }

  const hasOrders = orders.some(o => o.items.some(i => i.productId === id));
  if (hasOrders) {
    // Soft archive rather than destructive delete
    products[idx].visibility = 'archived';
    products[idx].inStock = false;
    return res.json({ 
      success: true, 
      action: 'archived', 
      message: 'Le produit a des commandes historiques; il a été archivé pour préserver l\'intégrité des rapports.' 
    });
  }

  products.splice(idx, 1);
  res.json({ success: true, action: 'deleted' });
});

// Image Upload Endpoint with validation & mock storage processing
app.post('/api/products/upload-image', (req: Request, res: Response) => {
  const { base64, fileName, mimeType } = req.body;
  if (!base64) {
    return res.status(400).json({ error: 'Fichier image manquant' });
  }

  // Validate allowed extensions
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (mimeType && !allowed.includes(mimeType)) {
    return res.status(400).json({ error: 'Format non supporté. Formats acceptés : JPG, JPEG, PNG, WEBP.' });
  }

  // In production, save to bucket / storage. In this environment, return standard asset URL or data URI
  const fileId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const storageUrl = base64.startsWith('data:') ? base64 : `data:${mimeType || 'image/jpeg'};base64,${base64}`;

  return res.json({
    fileId,
    url: storageUrl,
    thumbnailUrl: storageUrl,
    size: base64.length,
    uploadedAt: new Date().toISOString()
  });
});

// Product Reviews
app.post('/api/products/:id/reviews', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userName, rating, comment } = req.body;
  const prod = products.find(p => p.id === id);
  if (!prod) return res.status(404).json({ error: 'Produit non trouvé' });

  const newReview = {
    id: `rev-${Date.now()}`,
    userId: `user-${Date.now()}`,
    userName: userName || 'Client NovaShop',
    rating: Number(rating) || 5,
    comment: comment || 'Très satisfait du produit et de la livraison rapide.',
    date: new Date().toISOString().split('T')[0],
    verifiedPurchase: true
  };

  prod.reviews.unshift(newReview);
  prod.reviewsCount = prod.reviews.length;
  prod.rating = Number((prod.reviews.reduce((acc, r) => acc + r.rating, 0) / prod.reviews.length).toFixed(1));

  res.status(201).json(prod);
});

// Restock Alert Subscription
app.post('/api/products/:id/restock-alert', (req: Request, res: Response) => {
  const { id } = req.params;
  const { contact } = req.body;
  console.log(`[RESTOCK ALERT] Inscription pour le produit ${id} par: ${contact}`);
  res.json({ success: true, message: 'Votre alerte de réapprovisionnement a été enregistrée avec succès.' });
});

// -------------------------------------------------------------
// 3. ORDERS MANAGEMENT
// -------------------------------------------------------------
app.get('/api/orders', (_req: Request, res: Response) => {
  res.json(orders);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const orderData = req.body;
  const orderId = `NS-2026-${String(orders.length + 109).padStart(6, '0')}`;
  
  // Deduct inventory for ordered items
  if (Array.isArray(orderData.items)) {
    orderData.items.forEach((item: any) => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        const prev = prod.stockCount;
        prod.stockCount = Math.max(0, prod.stockCount - (item.quantity || 1));
        if (prod.stockCount === 0) prod.inStock = false;

        inventoryTransactions.unshift({
          id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          productId: prod.id,
          productName: prod.name,
          previousStock: prev,
          newStock: prod.stockCount,
          difference: -(item.quantity || 1),
          reason: 'sale',
          performedBy: 'Client Checkout',
          date: new Date().toISOString(),
          orderId
        });
      }
    });
  }

  const newOrder: Order = {
    ...orderData,
    id: orderId,
    date: new Date().toISOString(),
    status: 'pending',
    paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'successful',
    invoiceNumber: `INV-${orderId}`,
    trackingTimeline: [
      {
        status: 'pending',
        label: 'Commande Passée',
        description: 'Votre commande a été reçue et enregistrée dans le système.',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: true,
        actor: 'Client'
      },
      {
        status: 'confirmed',
        label: 'Validation & Paiement',
        description: 'Vérification du règlement et transmission au service logistique.',
        completed: false,
        current: false
      },
      {
        status: 'processing',
        label: 'Préparation en Entrepôt',
        description: 'Colis soigneusement emballé et vérifié.',
        completed: false,
        current: false
      },
      {
        status: 'shipped',
        label: 'En Cours de Livraison',
        description: 'Remis au coursier pour livraison à votre adresse.',
        completed: false,
        current: false
      },
      {
        status: 'delivered',
        label: 'Livraison Effectuée',
        description: 'Remis en main propre au destinataire.',
        completed: false,
        current: false
      }
    ]
  };

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

// Update Order Status
app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminName = 'Admin', reason } = req.body as { status: OrderStatus; adminName?: string; reason?: string };

  const order = orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: 'Commande non trouvée' });

  const oldStatus = order.status;
  order.status = status;

  if (status === 'delivered') {
    order.paymentStatus = 'successful';
  } else if (status === 'cancelled') {
    order.cancellationReason = reason || 'Annulée par l\'administration';
    
    // Release inventory on cancellation
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        const prev = prod.stockCount;
        prod.stockCount += item.quantity;
        prod.inStock = true;
        inventoryTransactions.unshift({
          id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          productId: prod.id,
          productName: prod.name,
          previousStock: prev,
          newStock: prod.stockCount,
          difference: item.quantity,
          reason: 'adjustment',
          performedBy: adminName,
          date: new Date().toISOString(),
          orderId: order.id
        });
      }
    });
  }

  // Update timeline step
  const nowStr = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const stepIdx = order.trackingTimeline.findIndex(t => t.status === status);
  if (stepIdx !== -1) {
    order.trackingTimeline[stepIdx].completed = true;
    order.trackingTimeline[stepIdx].current = true;
    order.trackingTimeline[stepIdx].timestamp = nowStr;
    order.trackingTimeline[stepIdx].actor = adminName;
    for (let i = 0; i < stepIdx; i++) {
      order.trackingTimeline[i].completed = true;
      order.trackingTimeline[i].current = false;
    }
  } else {
    order.trackingTimeline.push({
      status,
      label: `Statut : ${status.toUpperCase()}`,
      description: `Mis à jour par ${adminName}${reason ? ` (${reason})` : ''}`,
      timestamp: nowStr,
      completed: true,
      current: true,
      actor: adminName
    });
  }

  res.json(order);
});

// Assign Courier / Carrier & Tracking
app.put('/api/orders/:id/assign', (req: Request, res: Response) => {
  const { id } = req.params;
  const { courierName, courierPhone, carrierName, trackingNumber, estimatedDeliveryDate, adminName = 'Admin' } = req.body;

  const order = orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: 'Commande non trouvée' });

  if (courierName || courierPhone) {
    order.deliveryAgent = {
      name: courierName || order.deliveryAgent?.name || 'Coursier Express',
      phone: courierPhone || order.deliveryAgent?.phone || '+237 671 22 33 44'
    };
  }

  if (carrierName) order.carrierName = carrierName;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (estimatedDeliveryDate) order.estimatedDeliveryDate = estimatedDeliveryDate;

  // Add timeline note
  order.trackingTimeline.push({
    status: order.status,
    label: 'Affectation Logistique',
    description: `Transporteur : ${order.carrierName || 'NovaExpress'} • Livreur : ${order.deliveryAgent?.name || 'Coursier'}`,
    timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    completed: true,
    current: false,
    actor: adminName
  });

  res.json(order);
});

// Update Internal Admin Notes
app.put('/api/orders/:id/notes', (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;
  const order = orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: 'Commande non trouvée' });

  order.adminNotes = notes;
  res.json(order);
});

// Customer Return Request
app.post('/api/orders/:id/return-request', (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason, details, refundMethod } = req.body;
  const order = orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: 'Commande non trouvée' });

  order.returnRequest = {
    id: `ret-${Date.now()}`,
    requestedAt: new Date().toISOString(),
    reason: reason || 'Non conforme',
    details: details || '',
    status: 'pending',
    refundMethod: refundMethod || 'momo'
  };

  res.json(order);
});

// Admin Approve/Reject Return Request
app.put('/api/orders/:id/return-status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminDecisionNote, restock = true } = req.body;
  const order = orders.find(o => o.id === id);
  if (!order || !order.returnRequest) return res.status(404).json({ error: 'Demande de retour non trouvée' });

  order.returnRequest.status = status;
  order.returnRequest.processedAt = new Date().toISOString();
  order.returnRequest.adminDecisionNote = adminDecisionNote || '';

  if (status === 'approved') {
    order.status = 'returned';
    order.paymentStatus = 'refunded';

    if (restock) {
      order.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const prev = prod.stockCount;
          prod.stockCount += item.quantity;
          prod.inStock = true;
          inventoryTransactions.unshift({
            id: `tx-${Date.now()}`,
            productId: prod.id,
            productName: prod.name,
            previousStock: prev,
            newStock: prod.stockCount,
            difference: item.quantity,
            reason: 'return_restock',
            performedBy: 'Admin (Retour Approuvé)',
            date: new Date().toISOString(),
            orderId: order.id
          });
        }
      });
    }
  }

  res.json(order);
});

// Bulk Status Updates
app.post('/api/orders/bulk-status', (req: Request, res: Response) => {
  const { orderIds, status, adminName = 'Admin' } = req.body;
  if (!Array.isArray(orderIds)) return res.status(400).json({ error: 'orderIds array requis' });

  const updatedOrders: Order[] = [];
  orderIds.forEach(id => {
    const o = orders.find(ord => ord.id === id);
    if (o) {
      o.status = status;
      if (status === 'delivered') o.paymentStatus = 'successful';
      updatedOrders.push(o);
    }
  });

  res.json({ success: true, updatedCount: updatedOrders.length, orders: updatedOrders });
});

// -------------------------------------------------------------
// 4. COUPONS, ZONES & INVENTORY LOGS
// -------------------------------------------------------------
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, amount } = req.body;
  const cleanCode = String(code || '').trim().toUpperCase();
  const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode && c.active);

  if (!coupon) {
    return res.status(404).json({ valid: false, message: 'Code promo invalide ou expiré.' });
  }

  if (coupon.minPurchase && amount < coupon.minPurchase) {
    return res.status(400).json({ 
      valid: false, 
      message: `Ce code nécessite un panier minimum de ${coupon.minPurchase.toLocaleString('fr-FR')} FCFA.` 
    });
  }

  const discountAmount = coupon.discountType === 'percentage' 
    ? Math.round((amount * coupon.discountValue) / 100) 
    : coupon.discountValue;

  res.json({
    valid: true,
    code: coupon.code,
    discountAmount,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    message: `Code ${coupon.code} appliqué avec succès!`
  });
});

app.get('/api/delivery-zones', (_req: Request, res: Response) => {
  res.json(deliveryZones);
});

app.get('/api/payment-gateways', (_req: Request, res: Response) => {
  res.json(paymentGateways);
});

app.get('/api/inventory/transactions', (_req: Request, res: Response) => {
  res.json(inventoryTransactions);
});

// -------------------------------------------------------------
// 5. GEMINI AI SHOPPING ASSISTANT (SERVER PROXY)
// -------------------------------------------------------------
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { prompt, catalog } = req.body;
  const userPrompt = String(prompt || '').trim();

  if (!userPrompt) {
    return res.status(400).json({ error: 'Prompt requis' });
  }

  const catalogContext = (catalog || products).map((p: Product) => 
    `- ${p.name} [ID: ${p.id}]: ${p.price} FCFA${p.discountPrice ? ` (Promo: ${p.discountPrice} FCFA)` : ''}, Catégorie: ${p.category}, Stock: ${p.stockCount}, Caractéristiques: ${p.shortDescription || p.description.substring(0, 100)}`
  ).join('\n');

  const systemInstruction = `Tu es l'assistant d'achat expert NovaShop Cameroun.
Tu conseilles les clients sur les smartphones, l'informatique, les équipements solaires, la mode et les cosmétiques au Cameroun.
Les prix sont en FCFA (Francs CFA BEAC).
Sois chaleureux, concis, orienté client et précis.
IMPORTANT : Quand tu recommandes un produit, mentionne son nom et son prix en FCFA, et liste les ID des produits recommandés à la fin dans un bloc JSON comme ceci :
RECOMMENDATIONS: ["prod-1", "prod-2"]

Catalogue disponible :
${catalogContext}`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nQuestion de l'acheteur : ${userPrompt}` }] }
        ]
      });

      const fullText = response.text || '';
      let recommendedProductIds: string[] = [];
      const match = fullText.match(/RECOMMENDATIONS:\s*(\[[^\]]+\])/);
      if (match) {
        try {
          recommendedProductIds = JSON.parse(match[1]);
        } catch (e) {}
      }

      const cleanText = fullText.replace(/RECOMMENDATIONS:\s*\[[^\]]+\]/g, '').trim();

      return res.json({
        text: cleanText,
        recommendedProductIds
      });
    } catch (err) {
      console.warn('Gemini API call failed, using intelligent fallback:', err);
    }
  }

  // Smart grounded fallback if Gemini API key is missing or errored
  const lower = userPrompt.toLowerCase();
  let reply = "Je suis l'assistant NovaShop Cameroun. ";
  const recs: string[] = [];

  if (lower.includes('phone') || lower.includes('téléphone') || lower.includes('5g') || lower.includes('smartphone')) {
    reply += "Pour un excellent smartphone 5G avec appareil photo 108MP et charge ultra-rapide 68W, je vous conseille le NovaPhone 5G Apex à 165 000 FCFA.";
    recs.push('prod-1');
  } else if (lower.includes('etudiant') || lower.includes('tablette') || lower.includes('cours')) {
    reply += "La Tablette ScholarPro 10.4\" (119 000 FCFA) est idéale avec son stylet et son clavier inclus pour les études à l'université.";
    recs.push('prod-2', 'prod-6');
  } else if (lower.includes('solaire') || lower.includes('eneo') || lower.includes('coupure') || lower.includes('courant')) {
    reply += "Le Kit Solaire Domestique NovaSun 150W (85 000 FCFA) est la solution parfaite anti-délestage pour éclairer 4 pièces et recharger les téléphones.";
    recs.push('prod-4');
  } else {
    reply += "Tous nos produits bénéficient de garanties officielles de 12 à 24 mois et sont livrés en 2 à 4h à Douala et 24h à Yaoundé !";
    recs.push('prod-1', 'prod-4');
  }

  res.json({
    text: reply,
    recommendedProductIds: recs
  });
});

// -------------------------------------------------------------
// DIRECT ANDROID APK & PROJECT ZIP DOWNLOAD ROUTES
// -------------------------------------------------------------
app.get('/api/download/apk', (_req: Request, res: Response) => {
  const apkPath = path.resolve('public', 'novashop-release.apk');
  const fileName = 'NovaShop-v1.0.0.apk';

  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  
  if (fs.existsSync(apkPath)) {
    res.sendFile(apkPath);
  } else {
    res.status(404).json({ error: 'Fichier APK non disponible' });
  }
});

app.get(['/api/download/project', '/api/download/source', '/api/download/zip'], (_req: Request, res: Response) => {
  const zipPath = path.resolve('public', 'novashop-complete-project.zip');
  const rootZipPath = path.resolve('novashop-complete-project.zip');
  const targetPath = fs.existsSync(zipPath) ? zipPath : rootZipPath;

  if (fs.existsSync(targetPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="novashop-complete-project.zip"');
    res.sendFile(targetPath);
  } else {
    res.status(404).json({ error: 'Archive ZIP du projet non encore générée' });
  }
});

app.get('/api/app/info', (_req: Request, res: Response) => {
  res.json({
    appName: 'NovaShop Cameroun',
    packageName: 'cm.novashop.app',
    version: '1.0.0',
    versionCode: 100,
    size: '1.58 MB',
    releaseDate: '2026-10-06',
    downloadUrl: '/api/download/apk',
    minAndroid: 'Android 8.0 (Oreo) ou version supérieure',
    features: [
      'Catalogue complet et prix en FCFA',
      'Paiement sécurisé MTN MoMo et Orange Money',
      'Notifications de suivi de commande en temps réel',
      'Assistant shopping IA Gemini',
      'Mode hors-ligne et chargement ultra-rapide'
    ]
  });
});

// -------------------------------------------------------------
// VITE DEV / PRODUCTION MIDDLEWARE
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: 'custom'
    });
    app.use(vite.middlewares);

    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        const fs = await import('fs');
        let template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  }

  app.listen(PORT, () => {
    console.log(`NovaShop server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
