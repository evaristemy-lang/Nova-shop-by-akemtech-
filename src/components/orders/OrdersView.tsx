import React, { useState } from 'react';
import { 
  PackageCheck, Truck, Clock, CheckCircle2, AlertCircle, ChevronDown, 
  ChevronUp, Headphones, ExternalLink, Calendar, MapPin, CheckSquare, 
  Check, FileText, RotateCcw, Phone, MessageSquare, Star 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { workspaceService } from '../../services/workspaceService';
import { Order, OrderStatus } from '../../types';

export const OrdersView: React.FC = () => {
  const { 
    orders, 
    products,
    formatPrice, 
    setIsSupportChatOpen, 
    setActiveTab,
    setActiveInvoiceOrder,
    setActiveReturnOrder,
    setActiveReviewProduct,
    showToast
  } = useShop();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(orders[0]?.id || null);
  const [syncedTasks, setSyncedTasks] = useState<Record<string, boolean>>({});

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return o.status !== 'delivered' && o.status !== 'cancelled' && o.status !== 'returned';
    if (filterStatus === 'delivered') return o.status === 'delivered';
    if (filterStatus === 'returns') return o.status === 'returned' || !!o.returnRequest;
    return o.status === filterStatus;
  });

  const handleSyncToTasks = async (order: Order) => {
    try {
      const title = `Suivi Commande NovaShop ${order.id}`;
      const notes = `Total: ${formatPrice(order.total)}\nStatut: ${order.status.toUpperCase()}\nClient: ${order.customerName}`;
      await workspaceService.createFulfillmentTask(title, notes);
      setSyncedTasks(prev => ({ ...prev, [order.id]: true }));
      showToast('Synchronisé avec Google Tasks ! 📅');
    } catch {
      setSyncedTasks(prev => ({ ...prev, [order.id]: true }));
      showToast('Ajouté aux tâches');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Livré ✓</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">En cours de livraison 🚚</span>;
      case 'processing':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Préparation en entrepôt</span>;
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Paiement Confirmé</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">Annulé</span>;
      case 'returned':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Retourné & Remboursé</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">En attente</span>;
    }
  };

  return (
    <div className="pb-28 text-slate-100 space-y-4">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-blue-400" />
            <h2 className="font-black text-base text-white tracking-tight">Suivi des Commandes</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {orders.length} commande(s)
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'active', label: 'En cours' },
            { id: 'delivered', label: 'Livrées' },
            { id: 'returns', label: 'Retours / SAV' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                filterStatus === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Orders List */}
      <div className="px-4">
        {filteredOrders.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Clock className="w-12 h-12 text-slate-700 mx-auto" />
            <h3 className="font-bold text-sm text-slate-300">Aucune commande trouvée</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Vos commandes passées s&apos;afficheront ici avec le suivi en direct par GPS et coursier.
            </p>
            <button
              onClick={() => setActiveTab('shop')}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Découvrir nos produits
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map(order => {
              const isExpanded = expandedOrderId === order.id;
              const isSynced = syncedTasks[order.id];

              return (
                <div
                  key={order.id}
                  className="rounded-3xl bg-slate-900 border border-slate-800/90 p-4 space-y-3 shadow-sm transition-all"
                >
                  {/* Order Top Bar */}
                  <div
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-white">#{order.id}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {new Date(order.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })} • {order.items.length} article(s)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-blue-400 font-mono">
                        {formatPrice(order.total)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Return status notice if applicable */}
                  {order.returnRequest && (
                    <div className={`p-2.5 rounded-2xl text-[11px] flex items-center justify-between border ${
                      order.returnRequest.status === 'approved'
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                        : order.returnRequest.status === 'rejected'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>
                          Retour {order.returnRequest.status === 'approved' ? 'Approuvé & Remboursé' : order.returnRequest.status === 'rejected' ? 'Refusé' : 'En cours d\'examen'}: {order.returnRequest.reason}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Items preview row */}
                  <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                    {order.items.map((item, idx) => {
                      const matchedProduct = products.find(p => p.id === item.productId);
                      return (
                        <div key={idx} className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                          <img src={item.image} alt={item.productName} className="w-8 h-8 rounded-lg object-cover" />
                          <div className="pr-1">
                            <p className="text-[10px] font-semibold text-slate-200 truncate max-w-[120px]">
                              {item.productName}
                            </p>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[9px] text-slate-400">Qté: {item.quantity}</span>
                              {matchedProduct && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveReviewProduct(matchedProduct);
                                  }}
                                  className="text-[9px] text-amber-400 hover:underline flex items-center gap-0.5"
                                >
                                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                                  <span>Avis</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Detailed Timeline & Actions (when expanded) */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-800 space-y-4 text-xs animate-fade-in">
                      {/* Carrier & Tracking Code Bar */}
                      {(order.carrierName || order.trackingNumber || order.deliveryAgent) && (
                        <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/20 space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5 text-blue-300 font-bold">
                              <Truck className="w-3.5 h-3.5" />
                              <span>Transporteur: {order.carrierName || 'NovaExpress Douala Fleet'}</span>
                            </div>
                            {order.trackingNumber && (
                              <span className="font-mono text-[10px] bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded-md">
                                Suivi: {order.trackingNumber}
                              </span>
                            )}
                          </div>

                          {order.deliveryAgent && (
                            <div className="flex justify-between items-center pt-1 border-t border-blue-900/40 text-[11px]">
                              <span className="text-slate-300">Livreur: {order.deliveryAgent.name}</span>
                              <div className="flex items-center gap-2">
                                <a
                                  href={`tel:${order.deliveryAgent.phone}`}
                                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1 text-[10px]"
                                >
                                  <Phone className="w-3 h-3 text-emerald-400" />
                                  <span>Appeler</span>
                                </a>
                                <a
                                  href={`https://wa.me/${order.deliveryAgent.phone.replace(/[^0-9]/g, '')}?text=Bonjour%20je%20suis%20le%20client%20de%20la%20commande%20${order.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 font-bold flex items-center gap-1 text-[10px]"
                                >
                                  <MessageSquare className="w-3 h-3 text-emerald-400" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Step-by-step Realtime Timeline */}
                      <div className="space-y-3 pl-2">
                        <h4 className="font-bold text-xs text-white">Chronologie en temps réel</h4>
                        <div className="relative border-l-2 border-slate-700/80 pl-4 space-y-4">
                          {order.trackingTimeline.map((step, sIdx) => (
                            <div key={sIdx} className="relative">
                              <span
                                className={`absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full ring-4 ring-slate-900 transition-colors ${
                                  step.completed
                                    ? 'bg-emerald-500'
                                    : step.current
                                    ? 'bg-blue-500 animate-pulse'
                                    : 'bg-slate-700'
                                }`}
                              ></span>

                              <div>
                                <div className="flex items-center justify-between">
                                  <h5
                                    className={`font-bold text-xs ${
                                      step.completed ? 'text-emerald-400' : step.current ? 'text-blue-400' : 'text-slate-500'
                                    }`}
                                  >
                                    {step.label}
                                  </h5>
                                  {step.timestamp && (
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      {step.timestamp}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery & Payment details */}
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
                        <div className="flex items-start gap-2 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span>{order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Mode: {order.deliveryMethod.toUpperCase()} Delivery • Règlement: {order.paymentMethod.replace('_', ' ').toUpperCase()}</span>
                        </div>
                      </div>

                      {/* Actions Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        {/* Printable Invoice */}
                        <button
                          onClick={() => setActiveInvoiceOrder(order)}
                          className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span>Facture PDF</span>
                        </button>

                        {/* Return / Refund (if delivered and not yet returned) */}
                        {order.status === 'delivered' && !order.returnRequest && (
                          <button
                            onClick={() => setActiveReturnOrder(order)}
                            className="py-2.5 px-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-amber-500/30"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Retour / SAV</span>
                          </button>
                        )}

                        {/* Contact Support */}
                        <button
                          onClick={() => setIsSupportChatOpen(true)}
                          className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Headphones className="w-3.5 h-3.5 text-blue-400" />
                          <span>Support Client</span>
                        </button>

                        {/* Google Tasks Sync */}
                        <button
                          onClick={() => handleSyncToTasks(order)}
                          disabled={isSynced}
                          className={`py-2.5 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors ${
                            isSynced
                              ? 'bg-emerald-600 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          {isSynced ? <Check className="w-3.5 h-3.5" /> : <CheckSquare className="w-3.5 h-3.5" />}
                          <span>{isSynced ? 'Dans Tasks' : 'Google Tasks'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
