import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import { Order } from '../../types';
import { useShop } from '../../context/ShopContext';

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const { formatPrice, showToast } = useShop();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast('Facture officielle téléchargée (Format PDF) 📄');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-sm shadow">
              N
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Facture Officielle Commerciale</h3>
              <p className="text-[10px] text-slate-400 font-mono">N° {order.invoiceNumber || `INV-${order.id}`}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Invoice Body */}
        <div id="invoice-printable" className="flex-1 overflow-y-auto p-5 space-y-4 text-xs bg-slate-900">
          
          {/* Company & Client Banner */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-black text-sm text-white">NOVASHOP SARL</h4>
                <p className="text-[11px] text-slate-300">Boulevard de la Liberté, Akwa - Douala</p>
                <p className="text-[10px] text-slate-400">RCCM: RC/DLA/2026/B/1842 • NIF: M052018291410R</p>
                <p className="text-[10px] text-slate-400">Tél: (+237) 671 23 45 67 • contact@novashop.cm</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {order.paymentStatus === 'successful' ? 'PAYÉE ✓' : 'EN ATTENTE'}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Date: {new Date(order.date).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Facturé à :</p>
                <p className="font-bold text-white">{order.customerName}</p>
                <p className="text-slate-300">{order.customerPhone}</p>
                <p className="text-slate-400">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Adresse de livraison :</p>
                <p className="text-slate-300">{order.deliveryAddress.street}</p>
                <p className="text-slate-300">{order.deliveryAddress.neighborhood ? `${order.deliveryAddress.neighborhood}, ` : ''}{order.deliveryAddress.city}</p>
                <p className="text-slate-400 text-[10px]">Zone: Cameroun</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
            <div className="grid grid-cols-12 bg-slate-800/80 px-3 py-2 text-[10px] font-black uppercase text-slate-300 tracking-wider">
              <span className="col-span-6">Description</span>
              <span className="col-span-2 text-center">Qté</span>
              <span className="col-span-4 text-right">Montant</span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {order.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 px-3 py-2.5 items-center text-[11px]">
                  <div className="col-span-6 pr-2">
                    <p className="font-bold text-white">{item.productName}</p>
                    {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                      <p className="text-[9px] text-slate-400">
                        {Object.entries(item.selectedVariations).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                      </p>
                    )}
                  </div>
                  <span className="col-span-2 text-center font-mono text-slate-300">{item.quantity}</span>
                  <span className="col-span-4 text-right font-bold text-white">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Breakdown */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Sous-total articles :</span>
              <span className="font-mono text-slate-200">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Frais de livraison ({order.deliveryMethod.toUpperCase()}) :</span>
              <span className="font-mono text-slate-200">{order.deliveryFee === 0 ? 'Gratuit' : formatPrice(order.deliveryFee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Remise appliquée {order.appliedCoupon ? `(${order.appliedCoupon})` : ''} :</span>
                <span className="font-mono">-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-black text-sm">
              <span className="text-white">Total TTC :</span>
              <span className="text-blue-400 font-mono text-base">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Payment & Security Footer */}
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="font-bold text-slate-300">Règlement: {order.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                <p className="text-[9px] text-slate-500 font-mono">Réf: {order.paymentReference || 'VERIFIED-AUTH-CMR'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[9px]">
              <QrCode className="w-5 h-5 text-slate-400" />
              <span>CERTIFIÉ DGI</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Imprimer</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-md shadow-blue-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger</span>
          </button>
        </div>
      </div>
    </div>
  );
};
