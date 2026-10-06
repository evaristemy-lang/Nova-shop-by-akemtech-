import React from 'react';
import { X, Scale, Star, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ProductCompareModalProps {
  productIds: string[];
  onClose: () => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({ productIds, onClose }) => {
  const { products, formatPrice, addToCart, removeFromCompare, clearCompare, setSelectedProduct } = useShop();

  const comparedProducts = products.filter(p => productIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Comparateur de Produits</h3>
              <p className="text-[10px] text-slate-400">{comparedProducts.length} article(s) sélectionné(s) (Max 3)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {comparedProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-[11px] text-rose-400 hover:underline px-2 py-1"
              >
                Vider
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 text-xs">
          {comparedProducts.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <Scale className="w-10 h-10 mx-auto text-slate-600 stroke-[1.5]" />
              <p className="font-bold text-sm text-slate-400">Aucun produit à comparer</p>
              <p className="text-xs">Ajoutez des produits en cliquant sur l&apos;icône balance ⚖️ dans le catalogue.</p>
            </div>
          ) : (
            <div className="grid grid-flow-col auto-cols-[minmax(180px,1fr)] gap-3 min-w-full">
              {comparedProducts.map(p => {
                const effPrice = p.discountPrice || p.price;
                return (
                  <div key={p.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="relative rounded-xl overflow-hidden aspect-square bg-slate-900">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-950/80 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                          title="Retirer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <span className="text-[9px] uppercase font-bold text-blue-400">{p.category}</span>
                        <h4
                          onClick={() => {
                            setSelectedProduct(p);
                            onClose();
                          }}
                          className="font-bold text-xs text-white truncate cursor-pointer hover:underline"
                        >
                          {p.name}
                        </h4>
                        <div className="flex items-center gap-1 text-amber-400 text-[10px] mt-0.5">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-bold">{p.rating}</span>
                          <span className="text-slate-500">({p.reviewsCount} avis)</span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <span className="text-sm font-black text-blue-400">{formatPrice(effPrice)}</span>
                        {p.discountPrice && (
                          <span className="text-[10px] text-slate-500 line-through ml-1.5">{formatPrice(p.price)}</span>
                        )}
                      </div>

                      {/* Specs Matrix */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[10px]">
                        <p className="font-bold text-slate-400 uppercase text-[9px]">Spécifications :</p>
                        {p.specifications.slice(0, 4).map((spec, sIdx) => (
                          <div key={sIdx} className="flex justify-between py-0.5 border-b border-slate-900">
                            <span className="text-slate-400">{spec.name}:</span>
                            <span className="text-slate-200 font-medium text-right max-w-[100px] truncate">{spec.value}</span>
                          </div>
                        ))}
                        <div className="flex justify-between py-0.5">
                          <span className="text-slate-400">Garantie:</span>
                          <span className="text-emerald-400 font-medium text-right">{p.warranty || '12 mois'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(p, 1)}
                      disabled={!p.inStock}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{p.inStock ? 'Ajouter' : 'Rupture'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
