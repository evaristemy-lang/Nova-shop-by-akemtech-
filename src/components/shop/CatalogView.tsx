import React, { useState, useMemo } from 'react';
import { 
  Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, 
  List, X, Check, Filter, Sparkles, Scale 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCategory, Product } from '../../types';
import { ProductCard } from '../common/ProductCard';

export const CatalogView: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    compareProductIds,
    setIsCompareOpen
  } = useShop();

  const [layoutMode, setLayoutMode] = useState<'grid' | 'horizontal'>('grid');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(200000);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const categories = [
    { id: 'all' as const, label: 'Tous' },
    { id: 'smartphones' as const, label: 'Smartphones' },
    { id: 'electronics' as const, label: 'Électronique' },
    { id: 'student' as const, label: 'Étudiants' },
    { id: 'home' as const, label: 'Solaire & Maison' },
    { id: 'fashion' as const, label: 'Mode' },
    { id: 'beauty' as const, label: 'Beauté Bio' }
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Filter out drafts / archives from normal customer catalog
        if (p.visibility === 'draft' || p.visibility === 'archived') return false;

        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchTags = p.tags.some(t => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchBrand && !matchTags) return false;
        }

        // In Stock filter
        if (onlyInStock && (!p.inStock || p.stockCount <= 0)) return false;

        // Max price filter
        const effPrice = p.discountPrice || p.price;
        if (effPrice > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, onlyInStock, maxPrice, sortBy]);

  return (
    <div className="pb-28 text-slate-100 space-y-4">
      {/* Sticky Header with Search & Layout Toggle */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-base text-white tracking-tight">Catalogue Produits</h2>
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                layoutMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Grille"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('horizontal')}
              className={`p-1.5 rounded-lg transition-colors ${
                layoutMode === 'horizontal' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Liste"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par mot-clé, marque..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFiltersModal(true)}
            className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold shrink-0 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span>Filtres</span>
          </button>
        </div>

        {/* Categories Chip Scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all ${
                selectedCategory === c.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Products Listing */}
      <div className="px-4">
        {/* Active Results Summary & Sort Dropdown */}
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
          <span>{filteredProducts.length} produit(s) trouvé(s)</span>
          <div className="flex items-center gap-1 text-[11px]">
            <ArrowUpDown className="w-3 h-3 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-slate-900">En vedette</option>
              <option value="price-asc" className="bg-slate-900">Prix croissant</option>
              <option value="price-desc" className="bg-slate-900">Prix décroissant</option>
              <option value="rating" className="bg-slate-900">Mieux notés</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Filter className="w-12 h-12 text-slate-700 mx-auto" />
            <h3 className="font-bold text-sm text-slate-300">Aucun produit ne correspond à ces critères</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Essayez de modifier votre recherche ou d&apos;ajuster vos filtres de prix.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlyInStock(false);
                setMaxPrice(200000);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : layoutMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} layout="grid" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} layout="horizontal" />
            ))}
          </div>
        )}
      </div>

      {/* Slide-over Filter Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                <span>Filtrer les produits</span>
              </h3>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* In stock toggle */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <span className="font-semibold text-slate-300">Uniquement les produits en stock</span>
              <button
                onClick={() => setOnlyInStock(!onlyInStock)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  onlyInStock ? 'bg-blue-600' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    onlyInStock ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Max Price Slider */}
            <div className="space-y-2 py-2 border-b border-slate-800">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Prix maximum :</span>
                <span className="text-blue-400 font-mono font-bold">{maxPrice.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <input
                type="range"
                min={10000}
                max={250000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10 000 FCFA</span>
                <span>250 000 FCFA</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setOnlyInStock(false);
                  setMaxPrice(200000);
                  setShowFiltersModal(false);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="flex-1 py-2.5 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-md shadow-blue-500/20"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Comparison Drawer Trigger */}
      {compareProductIds.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 max-w-sm w-[92%] px-4 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-2xl flex items-center justify-between border border-blue-400/40 animate-fade-in">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4" />
            <span>{compareProductIds.length} article(s) à comparer</span>
          </div>
          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-3 py-1 rounded-xl bg-white text-blue-700 font-extrabold text-[11px] shadow hover:bg-blue-50 transition-colors"
          >
            Comparer &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
