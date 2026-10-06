import React from 'react';
import { Star, Heart, ShoppingBag, Sparkles, Scale, Bell } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'horizontal' | 'compact';
  onQuickAskAi?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = 'grid',
  onQuickAskAi
}) => {
  const {
    setSelectedProduct,
    addToCart,
    wishlist,
    toggleWishlist,
    formatPrice,
    setIsAIAssistantOpen,
    addToCompare,
    setActiveRestockProduct
  } = useShop();

  const isWish = wishlist.includes(product.id);
  const effPrice = product.discountPrice || product.price;
  const hasDiscount = Boolean(product.discountPrice && product.discountPrice < product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.discountPrice as number)) / product.price) * 100)
    : 0;

  const handleCardClick = () => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) {
      setActiveRestockProduct(product);
      return;
    }
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleAskAi = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickAskAi) {
      onQuickAskAi(product);
    } else {
      setSelectedProduct(product);
      setIsAIAssistantOpen(true);
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCompare(product);
  };

  const renderStockBadge = () => {
    if (!product.inStock || product.stockCount <= 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Rupture de stock
        </span>
      );
    }
    if (product.stockCount <= 5) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          Plus que {product.stockCount} en stock!
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        En stock ({product.stockCount})
      </span>
    );
  };

  if (layout === 'horizontal') {
    return (
      <div
        onClick={handleCardClick}
        className="w-full p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 active:border-blue-500/60 transition-all flex gap-3 cursor-pointer group shadow-sm"
      >
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-950 shrink-0">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {hasDiscount && (
            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-black shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 truncate">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCompare}
                  className="p-1 rounded-full text-slate-400 hover:text-blue-400"
                  title="Comparer"
                >
                  <Scale className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className="p-1 rounded-full text-slate-400 hover:text-rose-400"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
            </div>

            <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">
              {product.name}
            </h4>

            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex items-center gap-0.5 text-amber-400 text-[10px]">
                <Star className="w-3 h-3 fill-current" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-slate-500">({product.reviewsCount})</span>
              </div>
              <span className="text-slate-600">•</span>
              {renderStockBadge()}
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/60">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-black text-blue-400">
                {formatPrice(effPrice)}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-slate-500 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-sm"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>{product.inStock ? 'Ajouter' : 'Alerte'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div
        onClick={handleCardClick}
        className="w-40 shrink-0 rounded-2xl bg-slate-900 border border-slate-800/90 p-2.5 cursor-pointer hover:border-slate-700 active:border-blue-500 transition-all group flex flex-col justify-between"
      >
        <div>
          <div className="relative rounded-xl overflow-hidden aspect-square bg-slate-950 mb-1.5">
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {hasDiscount && (
              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-black bg-rose-600 text-white">
                -{discountPercent}%
              </span>
            )}
            <button
              onClick={handleToggleWishlist}
              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-slate-300 hover:text-rose-400 transition-colors"
            >
              <Heart className={`w-3 h-3 ${isWish ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          <h5 className="text-[11px] font-bold text-white truncate group-hover:text-blue-400 transition-colors">
            {product.name}
          </h5>

          <div className="flex items-center gap-1 mt-0.5 text-amber-400 text-[10px]">
            <Star className="w-2.5 h-2.5 fill-current" />
            <span className="font-bold">{product.rating}</span>
            <span className="text-slate-500">({product.reviewsCount})</span>
          </div>
        </div>

        <div className="mt-2 pt-1 border-t border-slate-800/60 flex items-center justify-between">
          <span className="text-xs font-black text-blue-400">
            {formatPrice(effPrice)}
          </span>
          <button
            onClick={handleAddToCart}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white transition-colors"
            title={product.inStock ? 'Ajouter au panier' : 'M\'alerter du réapprovisionnement'}
          >
            {product.inStock ? <ShoppingBag className="w-3 h-3" /> : <Bell className="w-3 h-3 text-amber-400" />}
          </button>
        </div>
      </div>
    );
  }

  // Default Grid layout
  return (
    <div
      onClick={handleCardClick}
      className="rounded-3xl bg-slate-900/95 border border-slate-800/80 p-2.5 flex flex-col justify-between hover:border-slate-700 active:border-blue-500/70 transition-all group cursor-pointer shadow-sm relative"
    >
      <div>
        <div className="relative rounded-2xl overflow-hidden aspect-square bg-slate-950 mb-2">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <span className="px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[9px] font-black tracking-wide shadow-md">
                -{discountPercent}%
              </span>
            )}
            {product.isNew && (
              <span className="px-2 py-0.5 rounded-lg bg-blue-600 text-white text-[9px] font-extrabold shadow-md">
                NOUVEAU
              </span>
            )}
          </div>

          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <button
              onClick={handleToggleWishlist}
              className="p-2 rounded-full bg-slate-950/70 backdrop-blur-md text-slate-300 hover:text-rose-400 active:scale-90 transition-all border border-white/10"
              aria-label="Ajouter aux favoris"
            >
              <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={handleCompare}
              className="p-2 rounded-full bg-slate-950/70 backdrop-blur-md text-slate-300 hover:text-blue-400 active:scale-90 transition-all border border-white/10"
              title="Comparer"
            >
              <Scale className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAskAi}
            className="absolute bottom-2 right-2 px-2 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[9px] font-bold text-amber-300 border border-amber-500/30 hover:border-amber-400 flex items-center gap-1 shadow-sm opacity-90 hover:opacity-100 transition-opacity"
            title="Poser une question à l'IA"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>IA</span>
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-extrabold">{product.rating}</span>
              <span className="text-slate-400">({product.reviewsCount})</span>
            </div>
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider truncate max-w-[80px]">
              {product.brand || product.category}
            </span>
          </div>

          <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors pt-0.5 min-h-[32px]">
            {product.name}
          </h4>

          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-xs sm:text-sm font-black text-blue-400">
              {formatPrice(effPrice)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="pt-0.5">
            {renderStockBadge()}
          </div>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className={`mt-2.5 w-full min-h-[40px] py-2 rounded-2xl font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98] shadow-sm ${
          product.inStock
            ? 'bg-slate-800/90 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700/60'
            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
        }`}
      >
        {product.inStock ? (
          <>
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Ajouter au panier</span>
          </>
        ) : (
          <>
            <Bell className="w-3.5 h-3.5" />
            <span>M&apos;alerter en stock</span>
          </>
        )}
      </button>
    </div>
  );
};
