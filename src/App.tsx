import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { QuickLinks } from './components/QuickLinks';
import { ProductGrid } from './components/ProductGrid';
import { RecentOrdersFeed } from './components/RecentOrdersFeed';
import { DashboardView } from './components/DashboardView';
import { ProductDetailView } from './components/ProductDetailView';
import { MyCodesView } from './components/MyCodesView';
import { AddMoneyView } from './components/AddMoneyView';
import { AccountDrawer } from './components/AccountDrawer';
import { AuthModal } from './components/AuthModal';
import { GoogleSignInModal } from './components/GoogleSignInModal';
import { NotificationModal } from './components/NotificationModal';
import { BottomNav } from './components/BottomNav';
import { FloatingSupport } from './components/FloatingSupport';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';

export const AppContent: React.FC = () => {
  const { view, toastMessage } = useApp();

  return (
    <div className="min-h-screen bg-[#f5f8ff] text-[#0f172a] font-sans antialiased relative selection:bg-[#0284c7] selection:text-white">
      {/* Background ambient gradient glow */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(600px 400px at 90% -5%, rgba(2,132,199,0.12), transparent 70%), radial-gradient(500px 500px at -10% 45%, rgba(14,165,233,0.12), transparent 70%)'
        }}
      />

      {/* Global Header - shown on views that don't have their own specialized header */}
      {view !== 'dashboard' && view !== 'my-orders' && view !== 'account' && view !== 'admin' && <Header />}

      {/* Main View Router */}
      <main className={view === 'admin' ? 'min-h-screen' : 'min-h-[calc(100vh-68px)]'}>
        {view === 'home' && (
          <div className="max-w-[740px] mx-auto px-3.5">
            <HeroBanner />
            <QuickLinks />
            <ProductGrid />
            <RecentOrdersFeed />
            <Footer />
          </div>
        )}

        {view === 'product' && <ProductDetailView />}
        {(view === 'dashboard' || view === 'my-orders' || view === 'account') && <DashboardView />}
        {view === 'add-money' && <AddMoneyView />}
        {view === 'my-codes' && <MyCodesView />}
        {view === 'admin' && <AdminPanel />}
      </main>

      {/* Floating Elements & Navigation */}
      {view !== 'admin' && (
        <>
          <FloatingSupport />
          <BottomNav />
        </>
      )}
      <AccountDrawer />
      <AuthModal />
      <NotificationModal />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed left-1/2 bottom-[104px] -translate-x-1/2 z-50 max-w-[calc(100%-40px)] px-5 py-3 rounded-2xl bg-[#0f172a] text-white text-[13.5px] font-bold text-center shadow-2xl border border-slate-700/60 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
