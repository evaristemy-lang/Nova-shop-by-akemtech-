/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { DeviceFrameWrapper } from './components/common/DeviceFrameWrapper';
import { AndroidBottomNav } from './components/common/AndroidBottomNav';
import { HomeView } from './components/home/HomeView';
import { CatalogView } from './components/shop/CatalogView';
import { CartView } from './components/cart/CartView';
import { OrdersView } from './components/orders/OrdersView';
import { AccountView } from './components/account/AccountView';
import { FloatingAIAssistant } from './components/ai/FloatingAIAssistant';
import { SupportChatModal } from './components/chat/SupportChatModal';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { WorkspaceModal } from './components/workspace/WorkspaceModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { InvoiceModal } from './components/orders/InvoiceModal';
import { ReturnRequestModal } from './components/orders/ReturnRequestModal';
import { ProductCompareModal } from './components/shop/ProductCompareModal';
import { LoyaltyClubModal } from './components/account/LoyaltyClubModal';
import { AddressManagerModal } from './components/account/AddressManagerModal';
import { ReviewSubmitModal } from './components/product/ReviewSubmitModal';
import { RestockAlertModal } from './components/product/RestockAlertModal';
import { ApkDownloadModal } from './components/common/ApkDownloadModal';

const AppContent: React.FC = () => {
  const { 
    activeTab,
    activeInvoiceOrder,
    setActiveInvoiceOrder,
    activeReturnOrder,
    setActiveReturnOrder,
    isCompareOpen,
    setIsCompareOpen,
    compareProductIds,
    isLoyaltyOpen,
    setIsLoyaltyOpen,
    isAddressManagerOpen,
    setIsAddressManagerOpen,
    activeReviewProduct,
    setActiveReviewProduct,
    activeRestockProduct,
    setActiveRestockProduct
  } = useShop();

  return (
    <DeviceFrameWrapper>
      {/* Scrollable Active Tab View with bottom padding for navigation */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'shop' && <CatalogView />}
        {activeTab === 'cart' && <CartView />}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'account' && <AccountView />}
      </main>

      {/* Persistent Mobile Bottom Navigation */}
      <AndroidBottomNav />

      {/* Global Modals & Overlays */}
      <FloatingAIAssistant />
      <SupportChatModal />
      <ProductDetailModal />
      <CheckoutModal />
      <WorkspaceModal />
      <AdminDashboard />
      <ApkDownloadModal />

      {/* Feature Modals */}
      {activeInvoiceOrder && (
        <InvoiceModal order={activeInvoiceOrder} onClose={() => setActiveInvoiceOrder(null)} />
      )}
      {activeReturnOrder && (
        <ReturnRequestModal order={activeReturnOrder} onClose={() => setActiveReturnOrder(null)} />
      )}
      {isCompareOpen && (
        <ProductCompareModal productIds={compareProductIds} onClose={() => setIsCompareOpen(false)} />
      )}
      {isLoyaltyOpen && (
        <LoyaltyClubModal onClose={() => setIsLoyaltyOpen(false)} />
      )}
      {isAddressManagerOpen && (
        <AddressManagerModal onClose={() => setIsAddressManagerOpen(false)} />
      )}
      {activeReviewProduct && (
        <ReviewSubmitModal product={activeReviewProduct} onClose={() => setActiveReviewProduct(null)} />
      )}
      {activeRestockProduct && (
        <RestockAlertModal product={activeRestockProduct} onClose={() => setActiveRestockProduct(null)} />
      )}
    </DeviceFrameWrapper>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
