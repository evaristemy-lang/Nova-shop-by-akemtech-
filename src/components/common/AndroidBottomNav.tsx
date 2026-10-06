import React from 'react';
import { Home, Grid, ShoppingBag, PackageCheck, User as UserIcon, LucideIcon } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface NavItem {
  id: 'home' | 'shop' | 'cart' | 'orders' | 'account';
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export const AndroidBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cart, orders } = useShop();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled' && o.status !== 'returned').length;

  const navItems: NavItem[] = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'shop', label: 'Boutique', icon: Grid },
    { id: 'cart', label: 'Panier', icon: ShoppingBag, badge: totalCartCount },
    { id: 'orders', label: 'Suivi', icon: PackageCheck, badge: activeOrdersCount },
    { id: 'account', label: 'Compte', icon: UserIcon }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md sm:max-w-lg lg:max-w-xl mx-auto h-16 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 flex items-center justify-around z-40 select-none">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all duration-200 relative group active:scale-95 ${
              isActive ? 'text-blue-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-blue-600/20 text-blue-400 scale-110 shadow-sm' : ''
                }`}
              >
                <Icon className="w-5 h-5 transition-transform" />
              </div>
              {item.badge !== undefined && item.badge > 0 ? (
                <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white min-w-[16px] text-center shadow-md animate-pulse">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
