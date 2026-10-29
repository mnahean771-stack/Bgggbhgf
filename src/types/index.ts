export interface ProductPackage {
  id: string;
  name: string;
  price: number;
  subtitle?: string;
  inStock?: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  image: string;
  badge: string;
  packages: ProductPackage[];
  inputLabel: string;
  inputPlaceholder: string;
  rules: string[];
  tag?: string;
  active?: boolean;
}

export type DashboardTab = 'orders' | 'wallet' | 'referrals' | 'profile';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  balance: number;
  supportPin: string;
  verified: boolean;
  loggedIn: boolean;
  role?: 'User' | 'Admin';
  referralCode?: string;
  referralEarnings?: number;
  totalReferrals?: number;
  createdAt?: string;
  googleLinked?: boolean;
  authProvider?: 'google' | 'email' | 'phone';
}

export interface Order {
  id: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  date: string;
  updated: string;
  package: string;
  price: number;
  playerId: string;
  paymentMethod: string;
  productName: string;
  transactionId?: string;
  customerName?: string;
  customerEmail?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'purchase' | 'refund' | 'referral';
  amount: number;
  method: string;
  transactionId?: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  date: string;
  description: string;
  userEmail?: string;
}

export interface RedeemCode {
  id: string;
  title: string;
  code: string;
  date: string;
  value?: number;
  claimedBy?: string[];
  maxUses?: number;
}

export interface ReferralMember {
  id: string;
  name: string;
  date: string;
  earnings: number;
  ordersCount: number;
}

export interface LiveRecentOrder {
  id: string;
  customerName: string;
  avatarBg?: string;
  avatarLetter?: string;
  avatarImg?: string;
  itemName: string;
  status: 'Done' | 'Processing';
  timeAgo: string;
}

export interface SiteConfig {
  websiteName: string;
  telegramChannel: string;
  telegramGroup: string;
  whatsappChannel?: string;
  youtubeChannel: string;
  notificationText: string;
  phoneNumbers: {
    bKash: string;
    Nagad: string;
    Rocket: string;
  };
  adminPasscode?: string;
  noticeActive?: boolean;
  liveOrdersActive?: boolean;
}
