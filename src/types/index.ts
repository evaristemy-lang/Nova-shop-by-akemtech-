export type ProductCategory = 
  | 'smartphones' 
  | 'electronics' 
  | 'student' 
  | 'fashion' 
  | 'home' 
  | 'beauty'
  | 'all';

export type CurrencyCode = 'FCFA' | 'EUR' | 'USD' | 'NGN';

export interface ProductVariation {
  id: string;
  name: string;
  type: 'color' | 'storage' | 'size';
  value: string;
  priceModifier?: number;
  inStock?: boolean;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: ProductCategory;
  subcategory?: string;
  brand: string;
  price: number;
  discountPrice?: number;
  costPrice?: number;
  images: string[];
  videoUrl?: string;
  inStock: boolean;
  stockCount: number;
  reservedStock?: number;
  lowStockThreshold?: number;
  rating: number;
  reviewsCount: number;
  reviews: ProductReview[];
  specifications: ProductSpecification[];
  variations: ProductVariation[];
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  visibility?: 'published' | 'draft' | 'archived';
  warranty?: string;
  createdAt: string;
  updatedAt?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'cancelled' | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  selectedVariations?: Record<string, string>;
}

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
  actor?: string;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  city: string;
  neighborhood?: string;
  street: string;
  postalCode?: string;
  notes?: string;
}

export interface ReturnRequest {
  id: string;
  requestedAt: string;
  reason: string;
  details?: string;
  status: 'pending' | 'approved' | 'rejected';
  refundMethod: 'momo' | 'om' | 'credit';
  refundAmount?: number;
  processedAt?: string;
  adminDecisionNote?: string;
}

export interface Order {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'orange_money' | 'mtn_momo' | 'card' | 'cod';
  paymentReference?: string;
  deliveryMethod: 'standard' | 'express' | 'pickup';
  deliveryAddress: DeliveryAddress;
  deliveryAgent?: {
    name: string;
    phone: string;
  };
  trackingTimeline: TrackingStep[];
  returnRequest?: ReturnRequest;
  notes?: string;
  cancellationReason?: string;
  carrierName?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  adminNotes?: string;
  invoiceNumber?: string;
  appliedCoupon?: string;
  loyaltyPointsEarned?: number;
  loyaltyPointsRedeemed?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariations?: Record<string, string>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'courier';
  avatar?: string;
  loyaltyPoints?: number;
  addresses?: DeliveryAddress[];
  savedAddresses?: SavedAddress[];
}

export interface SavedAddress extends DeliveryAddress {
  id: string;
  label: string;
  isDefault?: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  city: string;
  fee: number;
  freeDeliveryThreshold: number;
  estimatedHours: string;
  active: boolean;
}

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  provider: 'mtn' | 'orange' | 'stripe' | 'cash';
  enabled: boolean;
  merchantNumber?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system' | 'ai';
  senderName: string;
  text: string;
  timestamp: string;
  attachedOrderId?: string;
  attachedProduct?: Product;
  imageUrl?: string;
}

export interface SupportConversation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  status: 'open' | 'pending_admin' | 'resolved';
  channel: 'in_app' | 'whatsapp';
  lastMessage: string;
  lastUpdated: string;
  messages: ChatMessage[];
  escalatedToAI?: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  validUntil: string;
  active: boolean;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  difference: number;
  reason: 'sale' | 'restock' | 'adjustment' | 'return_restock' | 'damage';
  performedBy: string;
  date: string;
  orderId?: string;
}
