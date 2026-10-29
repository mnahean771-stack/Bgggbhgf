import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  User,
  Order,
  RedeemCode,
  SiteConfig,
  DashboardTab,
  WalletTransaction,
  LiveRecentOrder,
  ProductCategory,
  ProductPackage
} from '../types';
import { DEFAULT_CONFIG, INITIAL_RECENT_ORDERS, PRODUCTS } from '../config/siteConfig';

export type AppView =
  | 'home'
  | 'product'
  | 'dashboard'
  | 'my-orders'
  | 'my-codes'
  | 'account'
  | 'add-money'
  | 'admin';

interface AppContextType {
  view: AppView;
  selectedProductId: string;
  config: SiteConfig;
  user: User;
  allUsers: User[];
  products: ProductCategory[];
  orders: Order[];
  codes: RedeemCode[];
  transactions: WalletTransaction[];
  liveRecentOrders: LiveRecentOrder[];
  dashboardTab: DashboardTab;
  toastMessage: string | null;
  isAuthOpen: boolean;
  authMode: 'login' | 'register';
  isGoogleAuthOpen: boolean;
  isNotificationOpen: boolean;
  isDrawerOpen: boolean;
  isFabOpen: boolean;
  isAdminUnlocked: boolean;
  setDashboardTab: (tab: DashboardTab) => void;
  navigateTo: (view: AppView, productId?: string, tab?: DashboardTab) => void;
  showToast: (msg: string) => void;
  openAuth: (mode?: 'login' | 'register') => void;
  closeAuth: () => void;
  openGoogleAuth: () => void;
  closeGoogleAuth: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleFab: () => void;
  closeFab: () => void;
  closeNotification: () => void;
  loginUser: (email: string, name?: string) => void;
  loginWithGoogle: (email: string, name?: string, avatar?: string) => void;
  linkGoogleAccount: (email: string) => void;
  registerUser: (name: string, phone: string, email: string) => void;
  logoutUser: () => void;
  updateBalance: (delta: number) => void;
  updateUserPhoto: (photoUrl: string) => void;
  updateUserName: (name: string) => void;
  removeUserPhoto: () => void;
  placeOrder: (
    productId: string,
    packageName: string,
    price: number,
    playerId: string,
    paymentMethod: string,
    transactionId?: string
  ) => boolean;
  addMoneyRequest: (amount: number, method: string, transactionId: string) => void;
  claimReferralBalance: (amount: number) => boolean;
  redeemCode: (code: string) => boolean;
  // --- Admin Methods ---
  setAdminUnlocked: (unlocked: boolean) => void;
  updateConfig: (patch: Partial<SiteConfig>) => void;
  updateProducts: (newProds: ProductCategory[]) => void;
  updatePackagePrice: (productId: string, packageId: string, newPrice: number) => void;
  addPackageToProduct: (productId: string, pkg: ProductPackage) => void;
  deletePackageFromProduct: (productId: string, packageId: string) => void;
  togglePackageStock: (productId: string, packageId: string) => void;
  toggleProductActive: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: 'Completed' | 'Pending' | 'Cancelled', refund?: boolean) => void;
  deleteOrder: (orderId: string) => void;
  addManualOrder: (order: Order) => void;
  approveDeposit: (transactionId: string) => boolean;
  rejectDeposit: (transactionId: string) => boolean;
  adjustUserBalance: (userId: string, delta: number, reason?: string) => void;
  updateUserRole: (userId: string, role: 'User' | 'Admin') => void;
  addRedeemCode: (code: RedeemCode) => void;
  deleteRedeemCode: (codeId: string) => void;
  addLiveOrder: (order: LiveRecentOrder) => void;
  clearLiveOrders: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: 'usr_nahean',
  name: 'Md Nahean',
  email: 'mnahean771@gmail.com',
  phone: '01983003336',
  avatar: '/main-logo.jpg',
  balance: 0,
  supportPin: 'X638J',
  verified: true,
  loggedIn: true,
  role: 'Admin',
  referralCode: 'X638J',
  referralEarnings: 0,
  totalReferrals: 0,
  createdAt: '2026-01-15',
  googleLinked: true,
  authProvider: 'google'
};

const INITIAL_USERS: User[] = [
  DEFAULT_USER,
  {
    id: 'usr_rakib',
    name: 'Rakibul Hasan',
    email: 'rakib.ff@gmail.com',
    phone: '01712345678',
    avatar: '/main-logo.jpg',
    balance: 150,
    supportPin: 'R928K',
    verified: true,
    loggedIn: false,
    role: 'User',
    referralCode: 'R928K',
    referralEarnings: 45,
    totalReferrals: 2,
    createdAt: '2026-02-10'
  },
  {
    id: 'usr_tanvir',
    name: 'Tanvir Ahmed',
    email: 'tanvir99@yahoo.com',
    phone: '01899887766',
    avatar: '/main-logo.jpg',
    balance: 550,
    supportPin: 'T471P',
    verified: true,
    loggedIn: false,
    role: 'User',
    referralCode: 'T471P',
    referralEarnings: 120,
    totalReferrals: 5,
    createdAt: '2026-03-01'
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<AppView>('home');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('wallet');
  const [selectedProductId, setSelectedProductId] = useState<string>('uid-topup');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(true);

  // Site Configuration Persistence
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('ff_react_config');
      if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_CONFIG;
  });

  // Products Persistence
  const [products, setProducts] = useState<ProductCategory[]>(() => {
    try {
      const saved = localStorage.getItem('ff_react_products');
      if (saved) return JSON.parse(saved);
    } catch {}
    return PRODUCTS;
  });

  // All Users Persistence
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('ff_react_all_users');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_USERS;
  });

  // Current Logged-in User Persistence
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('ff_react_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_USER;
  });

  // Orders Persistence
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ff_react_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'NT-894102',
        status: 'Completed',
        date: '28/10/2026 11:20 AM',
        updated: '28/10/2026 11:21 AM',
        package: '115 Diamond',
        price: 79,
        playerId: '2847291048',
        paymentMethod: 'bKash',
        productName: 'UID Topup (BD)',
        transactionId: 'BK9X8401L2',
        customerName: 'Md Nahean',
        customerEmail: 'mnahean771@gmail.com'
      },
      {
        id: 'NT-893988',
        status: 'Pending',
        date: '28/10/2026 11:32 AM',
        updated: '28/10/2026 11:32 AM',
        package: 'WEEKLY',
        price: 158,
        playerId: '1948201948',
        paymentMethod: 'Nagad',
        productName: 'Weekly/Monthly',
        transactionId: 'NG77Y092P4',
        customerName: 'Tanvir Ahmed',
        customerEmail: 'tanvir99@yahoo.com'
      }
    ];
  });

  // Wallet Transactions Persistence
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('ff_react_transactions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'TXN-902411',
        type: 'deposit',
        amount: 200,
        method: 'bKash',
        transactionId: 'BK20984920',
        status: 'Completed',
        date: '28/10/2026 10:45 AM',
        description: 'bKash Add Money Deposit',
        userEmail: 'mnahean771@gmail.com'
      },
      {
        id: 'TXN-903120',
        type: 'deposit',
        amount: 500,
        method: 'Nagad',
        transactionId: 'NG66129841',
        status: 'Pending',
        date: '28/10/2026 11:30 AM',
        description: 'Nagad Add Money Deposit (Pending Verification)',
        userEmail: 'tanvir99@yahoo.com'
      }
    ];
  });

  // Redeem Codes Persistence
  const [codes, setCodes] = useState<RedeemCode[]>(() => {
    try {
      const saved = localStorage.getItem('ff_react_codes');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'cd_welcome',
        title: 'New User Welcome Gift',
        code: 'NEWTOPUP25',
        date: '28/10/2026',
        value: 25,
        claimedBy: [],
        maxUses: 100
      },
      {
        id: 'cd_booyah',
        title: 'Booyah Special Bonus',
        code: 'BOOYAH50',
        date: '28/10/2026',
        value: 50,
        claimedBy: [],
        maxUses: 50
      }
    ];
  });

  // Live recent orders feed
  const [liveRecentOrders, setLiveRecentOrders] = useState<LiveRecentOrder[]>(INITIAL_RECENT_ORDERS);

  // Periodic simulation of subtle live community orders
  useEffect(() => {
    if (config.liveOrdersActive === false) return;

    const dummyNames = [
      'Tanvir Ahmed', 'Rakibul Hasan', 'Al-Amin', 'Sabbir Hossain',
      'Fahim Chowdhury', 'Kazi Nayem', 'Arafat Rahman', 'Shakil Khan'
    ];
    const dummyItems = [
      '25 Diamond 💎', '50 Diamond 💎', '115 Diamond 💎',
      'Weekly 1x', 'Weekly lite 1x', 'Monthly 💳', '240 Diamond 💎'
    ];
    const bgColors = ['bg-[#0284c7]', 'bg-[#7c3aed]', 'bg-[#059669]', 'bg-[#d97706]', 'bg-[#e11d48]'];

    const interval = setInterval(() => {
      const randomName = dummyNames[Math.floor(Math.random() * dummyNames.length)];
      const randomItem = dummyItems[Math.floor(Math.random() * dummyItems.length)];
      const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

      const newLiveOrder: LiveRecentOrder = {
        id: `live_${Date.now()}`,
        customerName: randomName,
        avatarLetter: randomName[0],
        avatarBg: randomBg,
        itemName: randomItem,
        status: 'Done',
        timeAgo: 'মাত্র কয়েক সেকেন্ড আগে'
      };

      setLiveRecentOrders((prev) => [newLiveOrder, ...prev.slice(0, 11)]);
    }, 28000);

    return () => clearInterval(interval);
  }, [config.liveOrdersActive]);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ff_react_config', JSON.stringify(config));
    } catch {}
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('ff_react_products', JSON.stringify(products));
    } catch {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('ff_react_all_users', JSON.stringify(allUsers));
    } catch {}
  }, [allUsers]);

  useEffect(() => {
    try {
      localStorage.setItem('ff_react_user', JSON.stringify(user));
      if (user.loggedIn) {
        localStorage.setItem('ff_logged', '1');
      } else {
        localStorage.removeItem('ff_logged');
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('ff_react_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('ff_react_transactions', JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('ff_react_codes', JSON.stringify(codes));
    } catch {}
  }, [codes]);

  // Handle URL hash / search sync
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      const search = new URLSearchParams(window.location.search);
      const tabParam = search.get('tab') as DashboardTab | null;

      if (!hash) {
        if (tabParam && ['orders', 'wallet', 'referrals', 'profile'].includes(tabParam)) {
          setDashboardTab(tabParam);
          setView('dashboard');
          return;
        }
        setView('home');
        return;
      }

      if (hash === 'admin') {
        setView('admin');
      } else if (hash === 'dashboard' || hash.startsWith('dashboard')) {
        if (tabParam && ['orders', 'wallet', 'referrals', 'profile'].includes(tabParam)) {
          setDashboardTab(tabParam);
        }
        setView('dashboard');
      } else if (hash === 'my-orders' || hash === 'orders') {
        setDashboardTab('orders');
        setView('dashboard');
      } else if (hash === 'wallet') {
        setDashboardTab('wallet');
        setView('dashboard');
      } else if (hash === 'referrals') {
        setDashboardTab('referrals');
        setView('dashboard');
      } else if (hash === 'account' || hash === 'profile') {
        setDashboardTab('profile');
        setView('dashboard');
      } else if (hash === 'my-codes') {
        setView('my-codes');
      } else if (hash === 'add-money') {
        setView('add-money');
      } else {
        const found = products.find((p) => p.id === hash);
        if (found) {
          setSelectedProductId(hash);
          setView('product');
        } else {
          setView('home');
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [products]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  }, []);

  const navigateTo = (newView: AppView, productId?: string, tab?: DashboardTab) => {
    setIsDrawerOpen(false);
    setIsFabOpen(false);

    if (tab) {
      setDashboardTab(tab);
    }

    if (newView === 'home') {
      window.location.hash = '';
      setView('home');
    } else if (newView === 'admin') {
      window.location.hash = 'admin';
      setView('admin');
    } else if (newView === 'dashboard') {
      const activeTab = tab || dashboardTab;
      window.location.hash = `dashboard?tab=${activeTab}`;
      setView('dashboard');
    } else if (newView === 'my-orders') {
      setDashboardTab('orders');
      window.location.hash = 'dashboard?tab=orders';
      setView('dashboard');
    } else if (newView === 'account') {
      setDashboardTab('profile');
      window.location.hash = 'dashboard?tab=profile';
      setView('dashboard');
    } else if (newView === 'product') {
      const id = productId || selectedProductId;
      setSelectedProductId(id);
      window.location.hash = id;
      setView('product');
    } else {
      window.location.hash = newView;
      setView(newView);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
    setIsGoogleAuthOpen(false);
    setIsDrawerOpen(false);
  };

  const closeAuth = () => setIsAuthOpen(false);
  const openGoogleAuth = () => {
    setIsGoogleAuthOpen(true);
    setIsAuthOpen(false);
    setIsDrawerOpen(false);
  };
  const closeGoogleAuth = () => setIsGoogleAuthOpen(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleFab = () => setIsFabOpen((prev) => !prev);
  const closeFab = () => setIsFabOpen(false);
  const closeNotification = () => setIsNotificationOpen(false);

  const loginWithGoogle = (email: string, name?: string, avatar?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      const updatedUser: User = {
        ...existing,
        loggedIn: true,
        verified: true,
        googleLinked: true,
        authProvider: 'google',
        name: name || existing.name,
        avatar: avatar || existing.avatar
      };
      setUser(updatedUser);
      setAllUsers((users) => users.map((u) => (u.id === existing.id ? updatedUser : u)));
    } else {
      const newUser: User = {
        id: `usr_g_${Date.now()}`,
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '01983003336',
        avatar: avatar || '/main-logo.jpg',
        balance: 0,
        supportPin: 'X638J',
        verified: true,
        loggedIn: true,
        role: cleanEmail.includes('admin') || cleanEmail === 'mnahean771@gmail.com' ? 'Admin' : 'User',
        referralCode: 'NT' + Math.floor(100 + Math.random() * 900),
        referralEarnings: 0,
        totalReferrals: 0,
        createdAt: new Date().toISOString().split('T')[0],
        googleLinked: true,
        authProvider: 'google'
      };
      setAllUsers((prev) => [...prev, newUser]);
      setUser(newUser);
    }
    setIsGoogleAuthOpen(false);
    setIsAuthOpen(false);
    showToast(`Google একাউন্টে (${cleanEmail}) সফলভাবে লগইন হয়েছে!`);
  };

  const linkGoogleAccount = (email: string) => {
    const clean = email.trim().toLowerCase();
    setUser((prev) => {
      const updated: User = { ...prev, googleLinked: true, email: clean || prev.email };
      setAllUsers((users) => users.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
    showToast(`Google একাউন্ট (${clean}) সফলভাবে লিঙ্ক হয়েছে!`);
  };

  const loginUser = (email: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setUser({ ...existing, loggedIn: true });
    } else {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '01700000000',
        avatar: '/main-logo.jpg',
        balance: 0,
        supportPin: Math.floor(1000 + Math.random() * 9000).toString(),
        verified: true,
        loggedIn: true,
        role: 'User',
        referralCode: 'NT' + Math.floor(100 + Math.random() * 900),
        referralEarnings: 0,
        totalReferrals: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAllUsers((prev) => [...prev, newUser]);
      setUser(newUser);
    }
    setIsAuthOpen(false);
    showToast(`স্বাগতম! আপনি সফলভাবে লগইন করেছেন`);
  };

  const registerUser = (name: string, phone: string, email: string) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone,
      avatar: '/main-logo.jpg',
      balance: 0,
      supportPin: Math.floor(1000 + Math.random() * 9000).toString(),
      verified: true,
      loggedIn: true,
      role: 'User',
      referralCode: 'NT' + Math.floor(100 + Math.random() * 900),
      referralEarnings: 0,
      totalReferrals: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAllUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    setIsAuthOpen(false);
    showToast(`অ্যাকাউন্ট রেজিস্ট্রেশন সম্পন্ন হয়েছে!`);
  };

  const logoutUser = () => {
    setUser((prev) => ({ ...prev, loggedIn: false }));
    showToast('আপনি লগআউট হয়েছেন');
    navigateTo('home');
  };

  const updateBalance = (delta: number) => {
    setUser((prev) => {
      const newBal = +(prev.balance + delta).toFixed(2);
      const updated = { ...prev, balance: Math.max(0, newBal) };
      // Also update in allUsers
      setAllUsers((users) => users.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
  };

  // --- Profile Photo & Name Update Methods ---
  const updateUserPhoto = (photoUrl: string) => {
    setUser((prev) => {
      const updated = { ...prev, avatar: photoUrl };
      setAllUsers((users) => users.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
    showToast('প্রোফাইল ছবি সফলভাবে পরিবর্তন করা হয়েছে!');
  };

  const updateUserName = (newName: string) => {
    const clean = newName.trim();
    if (!clean) return;
    setUser((prev) => {
      const updated = { ...prev, name: clean };
      setAllUsers((users) => users.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
    showToast('আপনার নাম সফলভাবে আপডেট হয়েছে!');
  };

  const removeUserPhoto = () => {
    setUser((prev) => {
      const updated = { ...prev, avatar: '/main-logo.jpg' };
      setAllUsers((users) => users.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
    showToast('প্রোফাইল ছবি রিমুভ করা হয়েছে!');
  };

  const placeOrder = (
    productId: string,
    packageName: string,
    price: number,
    playerId: string,
    paymentMethod: string,
    transactionId?: string
  ): boolean => {
    if (paymentMethod === 'Wallet Pay' && user.balance < price) {
      showToast('ওয়ালেটে পর্যাপ্ত টাকা নেই! Add Money করুন');
      return false;
    }

    const orderId = `NT-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-US');
    const prod = products.find((p) => p.id === productId);
    const prodTitle = prod?.name || 'UID Topup';

    if (paymentMethod === 'Wallet Pay') {
      updateBalance(-price);

      const newTx: WalletTransaction = {
        id: `TXN${Date.now().toString().slice(-6)}`,
        type: 'purchase',
        amount: price,
        method: 'Wallet Pay',
        status: 'Completed',
        date: formattedDate,
        description: `Order #${orderId} - ${packageName}`,
        userEmail: user.email
      };
      setTransactions((prev) => [newTx, ...prev]);
    } else {
      const newTx: WalletTransaction = {
        id: transactionId || `TXN${Date.now().toString().slice(-6)}`,
        type: 'purchase',
        amount: price,
        method: paymentMethod,
        transactionId: transactionId,
        status: 'Completed',
        date: formattedDate,
        description: `Direct Payment #${orderId} - ${packageName}`,
        userEmail: user.email
      };
      setTransactions((prev) => [newTx, ...prev]);
    }

    const newOrder: Order = {
      id: orderId,
      status: 'Pending',
      date: formattedDate,
      updated: formattedDate,
      package: packageName,
      price,
      playerId,
      paymentMethod,
      productName: prodTitle,
      transactionId: transactionId || undefined,
      customerName: user.name || 'Customer',
      customerEmail: user.email || 'customer@gmail.com'
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Prepend to Live Recent Orders
    const liveItem: LiveRecentOrder = {
      id: `live_${orderId}`,
      customerName: user.name || 'Customer',
      avatarLetter: (user.name || 'C')[0].toUpperCase(),
      avatarBg: 'bg-[#0284c7]',
      itemName: packageName,
      status: 'Done',
      timeAgo: 'এখনই'
    };
    setLiveRecentOrders((prev) => [liveItem, ...prev.slice(0, 11)]);

    showToast(`অর্ডার সাবমিট হয়েছে (#${orderId})! দ্রুত ডেলিভারি সম্পন্ন হবে`);

    return true;
  };

  const addMoneyRequest = (amount: number, method: string, transactionId: string) => {
    updateBalance(amount);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-US');

    const newTx: WalletTransaction = {
      id: transactionId || `TXN${Date.now().toString().slice(-6)}`,
      type: 'deposit',
      amount,
      method,
      transactionId,
      status: 'Completed',
      date: formattedDate,
      description: `${method} Add Money Deposit`,
      userEmail: user.email
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(`আপনার ৳${amount} জমার অনুরোধ ভেরিফাই হয়েছে! ব্যালেন্সে যোগ করা হয়েছে (${method})`);
    setDashboardTab('wallet');
    navigateTo('dashboard', undefined, 'wallet');
  };

  const claimReferralBalance = (amount: number): boolean => {
    const available = user.referralEarnings || 0;
    if (amount < 100) {
      showToast('সর্বনিম্ন ১০০৳ রেফারেল ব্যালেন্স ক্লেইম করা যাবে');
      return false;
    }
    if (amount > available) {
      showToast('ক্লেইম করার জন্য পর্যাপ্ত রেফারেল ব্যালেন্স নেই');
      return false;
    }

    setUser((prev) => ({
      ...prev,
      balance: +(prev.balance + amount).toFixed(2),
      referralEarnings: Math.max(0, +((prev.referralEarnings || 0) - amount).toFixed(2))
    }));

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-US');

    const newTx: WalletTransaction = {
      id: `REF${Date.now().toString().slice(-6)}`,
      type: 'referral',
      amount,
      method: 'Referral Commission',
      status: 'Completed',
      date: formattedDate,
      description: 'Claimed referral reward to wallet',
      userEmail: user.email
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(`৳${amount} রেফারেল কমিশন সফলভাবে আপনার ওয়ালেটে যোগ হয়েছে!`);
    return true;
  };

  const redeemCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return false;

    // Check if code exists in stored codes
    const existing = codes.find((c) => c.code.toUpperCase() === cleanCode);
    let addedValue = 0;

    if (existing && existing.value) {
      addedValue = existing.value;
      updateBalance(addedValue);
      // Mark claimed
      setCodes((prev) =>
        prev.map((c) =>
          c.id === existing.id
            ? { ...c, claimedBy: [...(c.claimedBy || []), user.email] }
            : c
        )
      );
    } else if (cleanCode.includes('FF') || cleanCode.includes('DIAMOND') || cleanCode.includes('FREE')) {
      addedValue = 25;
      updateBalance(addedValue);
    }

    const newCode: RedeemCode = {
      id: `cd_${Date.now()}`,
      title: 'Free Fire Reward Voucher',
      code: cleanCode,
      date: new Date().toLocaleDateString('en-GB'),
      value: addedValue || undefined
    };

    setCodes((prev) => [newCode, ...prev.filter((c) => c.code !== cleanCode)]);

    if (addedValue > 0) {
      showToast(`কোড রিডিম সফল! ওয়ালেটে ৳${addedValue} বোনাস যোগ হয়েছে`);
    } else {
      showToast('কোড সেভ হয়েছে! গ্যারেনা রিওয়ার্ড পেজে গিয়ে রিডিম করুন');
    }
    return true;
  };

  // ==========================================
  // --- ADMIN METHODS FOR A-Z SITE CONTROL ---
  // ==========================================

  const updateConfig = (patch: Partial<SiteConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...patch };
      return updated;
    });
    showToast('সাইট সেটিংস সফলভাবে আপডেট ও সেভ হয়েছে!');
  };

  const updateProducts = (newProds: ProductCategory[]) => {
    setProducts(newProds);
    showToast('প্রোডাক্ট ক্যাটালগ সফলভাবে আপডেট হয়েছে!');
  };

  const updatePackagePrice = (productId: string, packageId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        return {
          ...prod,
          packages: prod.packages.map((pkg) =>
            pkg.id === packageId ? { ...pkg, price: newPrice } : pkg
          )
        };
      })
    );
    showToast('প্যাকেজ রেট সফলভাবে পরিবর্তন করা হয়েছে!');
  };

  const addPackageToProduct = (productId: string, pkg: ProductPackage) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        return {
          ...prod,
          packages: [...prod.packages, pkg]
        };
      })
    );
    showToast(`নতুন প্যাকেজ "${pkg.name}" সফলভাবে যুক্ত হয়েছে!`);
  };

  const deletePackageFromProduct = (productId: string, packageId: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        return {
          ...prod,
          packages: prod.packages.filter((p) => p.id !== packageId)
        };
      })
    );
    showToast('প্যাকেজ ডিলিট করা হয়েছে!');
  };

  const togglePackageStock = (productId: string, packageId: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        return {
          ...prod,
          packages: prod.packages.map((pkg) =>
            pkg.id === packageId ? { ...pkg, inStock: pkg.inStock === false ? true : false } : pkg
          )
        };
      })
    );
    showToast('স্টক স্ট্যাটাস পরিবর্তন হয়েছে!');
  };

  const toggleProductActive = (productId: string) => {
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === productId ? { ...prod, active: prod.active === false ? true : false } : prod
      )
    );
    showToast('প্রোডাক্ট অ্যাক্টিভ স্ট্যাটাস আপডেট হয়েছে!');
  };

  const updateOrderStatus = (
    orderId: string,
    status: 'Completed' | 'Pending' | 'Cancelled',
    refund: boolean = false
  ) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    if (refund && status === 'Cancelled' && targetOrder.status !== 'Cancelled') {
      updateBalance(targetOrder.price);
      showToast(`অর্ডার বাতিল এবং ৳${targetOrder.price} ইউজারের ওয়ালেটে ফেরত দেওয়া হয়েছে!`);
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status, updated: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US') }
          : o
      )
    );
    showToast(`অর্ডার #${orderId} স্ট্যাটাস পরিবর্তন হয়েছে: ${status}`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`অর্ডার #${orderId} মুছে ফেলা হয়েছে!`);
  };

  const addManualOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    showToast(`নতুন ম্যানুয়াল অর্ডার #${order.id} তৈরি হয়েছে!`);
  };

  const approveDeposit = (transactionId: string): boolean => {
    const tx = transactions.find((t) => t.id === transactionId || t.transactionId === transactionId);
    if (!tx) {
      showToast('ট্রানজ্যাকশন খুঁজে পাওয়া যায়নি');
      return false;
    }

    // Add balance to user
    updateBalance(tx.amount);

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === tx.id ? { ...t, status: 'Completed' as const } : t
      )
    );

    showToast(`ডিপোজিট অ্যাপ্রুভ সম্পন্ন! ৳${tx.amount} যোগ করা হয়েছে`);
    return true;
  };

  const rejectDeposit = (transactionId: string): boolean => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId || t.transactionId === transactionId
          ? { ...t, status: 'Cancelled' as const }
          : t
      )
    );
    showToast('ডিপোজিট রিকোয়েস্ট বাতিল করা হয়েছে');
    return true;
  };

  const adjustUserBalance = (userId: string, delta: number, reason: string = 'Admin Adjustment') => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-US');

    setAllUsers((users) =>
      users.map((u) => {
        if (u.id === userId) {
          const newBal = +(u.balance + delta).toFixed(2);
          return { ...u, balance: Math.max(0, newBal) };
        }
        return u;
      })
    );

    if (user.id === userId) {
      setUser((prev) => ({
        ...prev,
        balance: Math.max(0, +(prev.balance + delta).toFixed(2))
      }));
    }

    const newTx: WalletTransaction = {
      id: `ADM${Date.now().toString().slice(-6)}`,
      type: delta >= 0 ? 'deposit' : 'purchase',
      amount: Math.abs(delta),
      method: 'Admin Balance Adjustment',
      status: 'Completed',
      date: formattedDate,
      description: `${reason} (${delta >= 0 ? '+' : '-'}৳${Math.abs(delta)})`
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(`ইউজারের ব্যালেন্স ${delta >= 0 ? '+' : ''}${delta}৳ সফলভাবে সমন্বয় করা হয়েছে!`);
  };

  const updateUserRole = (userId: string, role: 'User' | 'Admin') => {
    setAllUsers((users) =>
      users.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    if (user.id === userId) {
      setUser((prev) => ({ ...prev, role }));
    }
    showToast(`ইউজার রোল পরিবর্তন করা হয়েছে: ${role}`);
  };

  const addRedeemCode = (code: RedeemCode) => {
    setCodes((prev) => [code, ...prev]);
    showToast(`নতুন রিডিম কোড "${code.code}" তৈরি হয়েছে!`);
  };

  const deleteRedeemCode = (codeId: string) => {
    setCodes((prev) => prev.filter((c) => c.id !== codeId));
    showToast('রিডিম কোড মুছে ফেলা হয়েছে');
  };

  const addLiveOrder = (order: LiveRecentOrder) => {
    setLiveRecentOrders((prev) => [order, ...prev.slice(0, 14)]);
    showToast('লাইভ ফিডে নতুন অর্ডার সম্প্রচার করা হয়েছে!');
  };

  const clearLiveOrders = () => {
    setLiveRecentOrders([]);
    showToast('লাইভ অর্ডার ফিড খালি করা হয়েছে');
  };

  return (
    <AppContext.Provider
      value={{
        view,
        selectedProductId,
        config,
        user,
        allUsers,
        products,
        orders,
        codes,
        transactions,
        liveRecentOrders,
        dashboardTab,
        toastMessage,
        isAuthOpen,
        authMode,
        isGoogleAuthOpen,
        isNotificationOpen,
        isDrawerOpen,
        isFabOpen,
        isAdminUnlocked,
        setDashboardTab,
        navigateTo,
        showToast,
        openAuth,
        closeAuth,
        openGoogleAuth,
        closeGoogleAuth,
        openDrawer,
        closeDrawer,
        toggleFab,
        closeFab,
        closeNotification,
        loginUser,
        loginWithGoogle,
        linkGoogleAccount,
        registerUser,
        logoutUser,
        updateBalance,
        updateUserPhoto,
        updateUserName,
        removeUserPhoto,
        placeOrder,
        addMoneyRequest,
        claimReferralBalance,
        redeemCode,
        setAdminUnlocked: setIsAdminUnlocked,
        updateConfig,
        updateProducts,
        updatePackagePrice,
        addPackageToProduct,
        deletePackageFromProduct,
        togglePackageStock,
        toggleProductActive,
        updateOrderStatus,
        deleteOrder,
        addManualOrder,
        approveDeposit,
        rejectDeposit,
        adjustUserBalance,
        updateUserRole,
        addRedeemCode,
        deleteRedeemCode,
        addLiveOrder,
        clearLiveOrders
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
