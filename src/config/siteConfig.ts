import { ProductCategory, SiteConfig, LiveRecentOrder } from '../types';

export const DEFAULT_CONFIG: SiteConfig = {
  websiteName: 'New TopUp',
  telegramChannel: 'https://t.me/ffgamecoin',
  telegramGroup: 'https://t.me/FF_Gamecoin',
  whatsappChannel: 'https://whatsapp.com/channel/0029Vb2Jg9m2UPBPWkF1qD1s',
  youtubeChannel: 'https://youtube.com/@ffgamecoin',
  notificationText: `সবথেকে কম দামে টপআপ করার জন্য সেরা ওয়েবসাইট
১০০% বিশ্বস্ত ও দ্রুত ডেলিভারিতে
অর্ডার করুন নিশ্চিন্তে ♥️`,
  phoneNumbers: {
    bKash: '01983003336',
    Nagad: '01983003336',
    Rocket: '01983003336'
  }
};

export const STANDARD_RULES = [
  'সঠিক প্লেয়ার আইডি দিয়ে অর্ডার করুন। ভুল আইডিতে টপআপ হয়ে গেলে কর্তৃপক্ষ দায়ী থাকবে না।',
  'অর্ডার করার আগে আইডির নাম চেক করে নিন।',
  'টপআপ সম্পন্ন হতে সাধারণত ২ সেকেন্ড থেকে কয়েক মিনিট সময় লাগতে পারে।',
  'একবার অর্ডার সাবমিট করার পর বাতিল বা রিফান্ড করা হয় না।',
  'যেকোনো সমস্যায় অর্ডারের স্ক্রিনশট সহ টেলিগ্রামে যোগাযোগ করুন।'
];

export const ROBLOX_RULES = [
  'সঠিক Roblox ইউজারনেম দিয়ে অর্ডার করুন।',
  'কোনো প্রকার পাসওয়ার্ড দেওয়ার প্রয়োজন নেই।',
  'অর্ডার সাবমিট করার পর দ্রুততম সময়ে Robux আপনার অ্যাকাউন্টে জমা হবে।',
  'যেকোনো সমস্যায় অর্ডারের স্ক্রিনশট সহ টেলিগ্রামে যোগাযোগ করুন।'
];

export const COC_RULES = [
  'Clash of Clans এর সঠিক প্লেয়ার ট্যাগ (যেমন: #9V8Y2UQQP) দিয়ে অর্ডার করুন।',
  'কোনো লগইন ডিটেইলস বা পাসওয়ার্ড প্রয়োজন নেই।',
  'দ্রুততম সময়ে Gems বা Gold Pass ডেলিভারি দেওয়া হয়।',
  'যেকোনো সমস্যায় অর্ডারের স্ক্রিনশট সহ টেলিগ্রামে যোগাযোগ করুন।'
];

export const PRODUCTS: ProductCategory[] = [
  {
    id: 'ff-likes',
    name: 'FF Likes',
    image: '/ff-likes.jpg',
    badge: '২ সেকেন্ডে টপআপ',
    tag: 'freefire',
    inputLabel: 'প্লেয়ার আইডি বসান',
    inputPlaceholder: 'প্লেয়ার আইডি বসান',
    rules: STANDARD_RULES,
    packages: [
      { id: 'like-1', name: '200 FF LIKE', subtitle: 'প্রতিদিন ১ আইডিতে ১বার', price: 30 },
      { id: 'like-2', name: '3000 FF LIKE', subtitle: '15 দিন এ পাবেন', price: 450 },
      { id: 'like-3', name: '6000 FF LIKE', subtitle: '30 দিন এ পাবেন', price: 900 },
      { id: 'like-4', name: '12000 FF LIKE', subtitle: '60 দিন এ পাবেন', price: 1800 }
    ]
  },
  {
    id: 'uid-topup',
    name: 'UID Topup (BD)',
    image: '/uid-topup-bd.jpg',
    badge: '২ সেকেন্ডে টপআপ',
    tag: 'freefire',
    inputLabel: 'এখানে গেমের আইডি কোড দিন',
    inputPlaceholder: 'এখানে গেমের আইডি কোড দিন',
    rules: STANDARD_RULES,
    packages: [
      { id: 'uid-1', name: 'WEEKLY', price: 158 },
      { id: 'uid-2', name: 'MONTHLY', price: 790 },
      { id: 'uid-3', name: '25 Diamond', price: 22 },
      { id: 'uid-4', name: '50 Diamond', price: 36 },
      { id: 'uid-5', name: '115 Diamond', price: 79 },
      { id: 'uid-6', name: '240 Diamond', price: 158 },
      { id: 'uid-7', name: '355 Diamond', price: 237 },
      { id: 'uid-8', name: '480 Diamond', price: 316 },
      { id: 'uid-9', name: '610 Diamond', price: 400 },
      { id: 'uid-10', name: '850 Diamond', price: 558 },
      { id: 'uid-11', name: '1240 Diamond', price: 800 },
      { id: 'uid-12', name: '2530 Diamond', price: 1610 },
      { id: 'uid-13', name: '5060 Diamond', price: 3220 },
      { id: 'uid-14', name: '10120 Diamond', price: 6440 }
    ]
  },
  {
    id: 'weekly-monthly',
    name: 'Weekly/Monthly',
    image: '/weekly-monthly.jpg',
    badge: '২ সেকেন্ডে টপআপ',
    tag: 'freefire',
    inputLabel: 'এখানে গেমের আইডি কোড দিন',
    inputPlaceholder: 'এখানে গেমের আইডি কোড দিন',
    rules: STANDARD_RULES,
    packages: [
      { id: 'wm-1', name: 'WEEKLY', price: 155 },
      { id: 'wm-2', name: '2X WEEKLY', price: 310 },
      { id: 'wm-3', name: '3X WEEKLY', price: 465 },
      { id: 'wm-4', name: 'MONTHLY', price: 770 },
      { id: 'wm-5', name: '2X MONTHLY', price: 1540 },
      { id: 'wm-6', name: '1X WEEKLY+1X MONTHLY', price: 925 },
      { id: 'wm-7', name: '3X WEEKLY+1X MONTHLY', price: 1235 }
    ]
  },
  {
    id: 'weekly-lite',
    name: 'Weekly Lite',
    image: '/weekly-lite.jpg',
    badge: '২ সেকেন্ডে টপআপ',
    tag: 'freefire',
    inputLabel: 'এখানে গেমের আইডি কোড দিন',
    inputPlaceholder: 'এখানে গেমের আইডি কোড দিন',
    rules: STANDARD_RULES,
    packages: [
      { id: 'wl-1', name: '1X Weekly Lite', price: 40 },
      { id: 'wl-2', name: '2X Weekly Lite', price: 80 },
      { id: 'wl-3', name: '3X Weekly Lite', price: 120 },
      { id: 'wl-4', name: '5X Weekly Lite', price: 200 }
    ]
  },
  {
    id: 'level-up-pass',
    name: 'Level Up Pass',
    image: '/level-up-pass.jpg',
    badge: '২ সেকেন্ডে টপআপ',
    tag: 'freefire',
    inputLabel: 'এখানে গেমের আইডি কোড দিন',
    inputPlaceholder: 'এখানে গেমের আইডি কোড দিন',
    rules: STANDARD_RULES,
    packages: [
      { id: 'lu-1', name: 'Level Up Package - Level 6', price: 43 },
      { id: 'lu-2', name: 'Level Up Package - Level 10', price: 75 },
      { id: 'lu-3', name: 'Level Up Package - Level 15', price: 75 },
      { id: 'lu-4', name: 'Level Up Package - Level 20', price: 75 },
      { id: 'lu-5', name: 'Level Up Package - Level 25', price: 75 },
      { id: 'lu-6', name: 'Level Up Package - Level 30', price: 105 },
      { id: 'lu-7', name: 'Full Level Up (1270 Diamond)', price: 448 }
    ]
  },
  {
    id: 'indonesia-server',
    name: 'Indonesia Server',
    image: '/indonesia-server.jpg',
    badge: '২ সেকেন্ডে টপআপ',
    tag: 'freefire',
    inputLabel: 'এখানে গেমের আইডি কোড দিন',
    inputPlaceholder: 'এখানে গেমের আইডি কোড দিন',
    rules: STANDARD_RULES,
    packages: [
      { id: 'in-1', name: '50 Diamond (Indo)', price: 65 },
      { id: 'in-2', name: '70 Diamond (Indo)', price: 90 },
      { id: 'in-3', name: '100 Diamond (Indo)', price: 130 },
      { id: 'in-4', name: '140 Diamond (Indo)', price: 180 },
      { id: 'in-5', name: '355 Diamond (Indo)', price: 445 },
      { id: 'in-6', name: '720 Diamond (Indo)', price: 890 },
      { id: 'in-7', name: '7290 Diamond (Indo)', price: 8800 },
      { id: 'in-8', name: 'Weekly (Indo)', price: 255 },
      { id: 'in-9', name: 'Monthly (Indo)', price: 800 }
    ]
  },
  {
    id: 'special-friday-offer',
    name: 'Friday Offer',
    image: '/assets/aistudio/20261028_111452_0000_f73578f1.png',
    badge: '২৪ ঘণ্টার স্পেশাল অফার',
    tag: 'special',
    inputLabel: 'এখানে গেমের আইডি কোড দিন',
    inputPlaceholder: 'এখানে গেমের আইডি কোড দিন',
    rules: STANDARD_RULES,
    packages: [
      { id: 'fri-1', name: '115 Diamond (Friday)', price: 75 },
      { id: 'fri-2', name: '240 Diamond (Friday)', price: 149 },
      { id: 'fri-3', name: 'Weekly Pass (Friday)', price: 149 },
      { id: 'fri-4', name: '610 Diamond (Friday)', price: 380 },
      { id: 'fri-5', name: 'Monthly Pass (Friday)', price: 749 },
      { id: 'fri-6', name: '1240 Diamond (Friday)', price: 760 },
      { id: 'fri-7', name: '2530 Diamond (Friday)', price: 1520 },
      { id: 'fri-8', name: '5060 Diamond (Friday)', price: 3050 }
    ]
  },
  {
    id: 'roblox',
    name: 'Roblox',
    image: '/assets/aistudio/20261028_094811_0000_266f3d31.png',
    badge: 'ইনস্ট্যান্ট Robux ডেলিভারি',
    tag: 'other',
    inputLabel: 'Roblox ইউজারনেম দিন',
    inputPlaceholder: 'Roblox Username দিন',
    rules: ROBLOX_RULES,
    packages: [
      { id: 'rob-1', name: '80 Robux', price: 110 },
      { id: 'rob-2', name: '160 Robux', price: 220 },
      { id: 'rob-3', name: '400 Robux', price: 490 },
      { id: 'rob-4', name: '800 Robux', price: 950 },
      { id: 'rob-5', name: '1000 Robux', price: 1180 },
      { id: 'rob-6', name: '2000 Robux', price: 2350 },
      { id: 'rob-7', name: '4500 Robux', price: 5100 }
    ]
  },
  {
    id: 'clash-of-clans',
    name: 'Clash of Clans',
    image: '/assets/aistudio/20261028_093830_0000_690cf23b.png',
    badge: 'সুপারসেল প্লেয়ার ট্যাগ টপআপ',
    tag: 'other',
    inputLabel: 'প্লেয়ার ট্যাগ (Player Tag) দিন (#XXXXXX)',
    inputPlaceholder: 'যেমন: #9V8Y2UQQP',
    rules: COC_RULES,
    packages: [
      { id: 'coc-1', name: '80 Gems', price: 95 },
      { id: 'coc-2', name: '500 Gems', price: 480 },
      { id: 'coc-3', name: '1200 Gems', price: 960 },
      { id: 'coc-4', name: '2500 Gems', price: 1950 },
      { id: 'coc-5', name: '6500 Gems', price: 4850 },
      { id: 'coc-6', name: 'Gold Pass', price: 650 },
      { id: 'coc-7', name: 'Event Pass', price: 450 }
    ]
  }
];

export const INITIAL_RECENT_ORDERS: LiveRecentOrder[] = [
  { id: 'ro-1', customerName: 'Shah alam', avatarBg: 'bg-[#0284c7]', avatarLetter: 'S', itemName: '25 Diamond 💎', status: 'Done', timeAgo: '১ মিনিট আগে' },
  { id: 'ro-2', customerName: 'RDX SHIHAB', avatarBg: 'bg-[#7c3aed]', avatarLetter: 'R', itemName: 'Monthly 💳', status: 'Done', timeAgo: '২ মিনিট আগে' },
  { id: 'ro-3', customerName: 'Shah alam', avatarBg: 'bg-[#0284c7]', avatarLetter: 'S', itemName: '25 Level 200💎 +3x Voucher', status: 'Done', timeAgo: '৩ মিনিট আগে' },
  { id: 'ro-4', customerName: 'Anisur Rahman', avatarBg: 'bg-[#059669]', avatarLetter: 'A', itemName: 'Weekly lite 1x', status: 'Done', timeAgo: '৪ মিনিট আগে' },
  { id: 'ro-5', customerName: 'Shah alam', avatarBg: 'bg-[#0284c7]', avatarLetter: 'S', itemName: '20 Level 200💎 +3x Voucher', status: 'Done', timeAgo: '৫ মিনিট আগে' },
  { id: 'ro-6', customerName: 'Shah alam', avatarBg: 'bg-[#0284c7]', avatarLetter: 'S', itemName: '10 Level 200💎 +3x Voucher', status: 'Done', timeAgo: '৭ মিনিট আগে' },
  { id: 'ro-7', customerName: 'Md Mizan Mhamud', avatarBg: 'bg-[#d97706]', avatarLetter: 'M', itemName: '100 Diamond 💎', status: 'Done', timeAgo: '৯ মিনিট আগে' },
  { id: 'ro-8', customerName: 'Md Mizan Mhamud', avatarBg: 'bg-[#d97706]', avatarLetter: 'M', itemName: '100 Diamond 💎', status: 'Done', timeAgo: '১১ মিনিট আগে' },
  { id: 'ro-9', customerName: 'Md Mizan Mhamud', avatarBg: 'bg-[#d97706]', avatarLetter: 'M', itemName: '100 Diamond 💎', status: 'Done', timeAgo: '১২ মিনিট আগে' },
  { id: 'ro-10', customerName: 'RkISh', avatarBg: 'bg-[#475569]', avatarLetter: 'R', itemName: 'Weekly 1x', status: 'Done', timeAgo: '১৫ মিনিট আগে' }
];

export const PAYMENT_STEPS: Record<string, string[]> = {
  bKash: [
    '*247# ডায়াল করে আপনার bKash মোবাইল মেনুতে যান অথবা bKash অ্যাপ খুলুন।',
    'Send Money -এ ক্লিক করুন।',
    'উপরের নম্বরে টাকা পাঠান।',
    'টাকার পরিমাণ: {amt}',
    'নিশ্চিত করে এখন আপনার bKash PIN লিখুন।',
    'টাকা পাঠান এবং ট্রানজ্যাকশন আইডি কপি করুন।',
    'ট্রানজ্যাকশন আইডি লিখে ভেরিফাই চাপুন।'
  ],
  Nagad: [
    '*167# ডায়াল করে আপনার Nagad মোবাইল মেনুতে যান অথবা Nagad অ্যাপ খুলুন।',
    'Send Money -এ ক্লিক করুন।',
    'উপরের নম্বরে টাকা পাঠান।',
    'টাকার পরিমাণ: {amt}',
    'নিশ্চিত করে এখন আপনার Nagad PIN লিখুন।',
    'টাকা পাঠান এবং ট্রানজ্যাকশন আইডি কপি করুন।',
    'ট্রানজ্যাকশন আইডি লিখে ভেরিফাই চাপুন।'
  ],
  Rocket: [
    '*322# ডায়াল করে আপনার Rocket মোবাইল মেনুতে যান অথবা Rocket অ্যাপ খুলুন।',
    'Send Money -এ ক্লিক করুন।',
    'উপরের নম্বরে টাকা পাঠান।',
    'টাকার পরিমাণ: {amt}',
    'নিশ্চিত করে এখন আপনার Rocket PIN লিখুন।',
    'টাকা পাঠান এবং ট্রানজ্যাকশন আইডি কপি করুন।',
    'ট্রানজ্যাকশন আইডি লিখে ভেরিফাই চাপুন।'
  ]
};
