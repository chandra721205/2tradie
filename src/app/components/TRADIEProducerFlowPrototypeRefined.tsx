import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Mic, Home, Truck, DollarSign, ShoppingCart, Bell, ChevronRight,
  Camera, Upload, Check, X, QrCode, TrendingUp,
  Coins, Award, Star, Leaf, Sprout, Package,
  Users, CheckCircle, Zap, Sparkles,
  Search, Lock, TrendingDown,
  RefreshCw, Send, MessageCircle, Plus,
  Download, Share2, ArrowRight, CreditCard,
  Activity, Layers, Settings,
  ThumbsUp, Calendar, BarChart2, HelpCircle,
  MapPin, FileText, Shield, Building2, Percent,
  ChevronLeft, ChevronDown, AlertCircle, Landmark,
  Warehouse, BookOpen, ClipboardList,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── DESIGN TOKENS ────────────────────────────────────────
const T = {
  gold: '#F4D03F', goldDark: '#F39C12', blue: '#003E6D', blueLight: '#0066B3',
  green: '#27AE60', red: '#E74C3C', purple: '#8B5CF6', white: '#FFFFFF',
  grayDark: '#4A4A4A', grayMid: '#9CA3AF', grayLight: '#E5E7EB', grayBg: '#F5F5F5',
  gradientBg: 'linear-gradient(to bottom, #F7FAFC, #D9F2FF)',
  gradientGold: 'linear-gradient(135deg, #F4D03F 0%, #F39C12 100%)',
  gradientBlue: 'linear-gradient(135deg, #003E6D 0%, #0066B3 100%)',
  gradientGreen: 'linear-gradient(135deg, #27AE60 0%, #2ECC71 100%)',
  shadow: { sm: '0 2px 8px rgba(0,0,0,0.06)', md: '0 4px 16px rgba(0,0,0,0.10)', lg: '0 8px 32px rgba(0,0,0,0.14)' },
  heading: 'Playfair Display, Georgia, serif',
  TOTAL: 34,
};

// ─── NAVIGATION MAP (screen numbers) ──────────────────────
const SCREENS = {
  language: 1, role: 2, welcome: 3, dashboard: 4,
  crop: 5, farm: 6, calendar: 7, activity: 8,
  inputs: 9, equipment: 10, financial: 11, services: 12,
  media: 13, aiQuality: 14, harvest: 15, lot: 16,
  qrDocs: 17, sampling: 18, storage: 19, warehouse: 20,
  sellMethod: 21, marketplace: 22, negotiate: 23, saleConfirm: 24,
  agent: 25, transport: 26, delivery: 27, buyerAccept: 28,
  settlement: 29, ledger: 30, reports: 31, notifications: 32,
  profile: 33, help: 34,
};

// ─── LANGUAGES ────────────────────────────────────────────
const LANGUAGES: Record<string, { name: string; flag: string; nativeName: string }> = {
  EN: { name: 'English', flag: '🇬🇧', nativeName: 'English' },
  HI: { name: 'Hindi', flag: '🇮🇳', nativeName: 'हिंदी' },
  TE: { name: 'Telugu', flag: '🇮🇳', nativeName: 'తెలుగు' },
  TM: { name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
  KN: { name: 'Kannada', flag: '🇮🇳', nativeName: 'ಕನ್ನಡ' },
  BN: { name: 'Bengali', flag: '🇮🇳', nativeName: 'বাংলা' },
  MR: { name: 'Marathi', flag: '🇮🇳', nativeName: 'मराठी' },
};

// ─── COMMODITIES ──────────────────────────────────────────
const COMMODITIES = [
  { category: 'Cereals', commodity: 'Wheat', variety: 'HD2967' },
  { category: 'Cereals', commodity: 'Rice', variety: 'Basmati 1121' },
  { category: 'Cereals', commodity: 'Maize', variety: 'HQPM1' },
  { category: 'Pulses', commodity: 'Arhar', variety: 'Pusa 992' },
  { category: 'Pulses', commodity: 'Moong', variety: 'SML 668' },
  { category: 'Pulses', commodity: 'Chana', variety: 'JG 11' },
  { category: 'Oilseeds', commodity: 'Mustard', variety: 'Pusa Bold' },
  { category: 'Oilseeds', commodity: 'Groundnut', variety: 'JL 24' },
  { category: 'Oilseeds', commodity: 'Soybean', variety: 'JS 335' },
  { category: 'Spices', commodity: 'Turmeric', variety: 'Erode Local' },
  { category: 'Spices', commodity: 'Chilli', variety: 'Teja' },
  { category: 'Fruits', commodity: 'Mango', variety: 'Alphonso' },
  { category: 'Fruits', commodity: 'Banana', variety: 'Grand Naine' },
  { category: 'Vegetables', commodity: 'Potato', variety: 'Kufri Jyoti' },
  { category: 'Vegetables', commodity: 'Onion', variety: 'Bhima Kiran' },
  { category: 'Vegetables', commodity: 'Tomato', variety: 'Arka Rakshak' },
  { category: 'Mushrooms', commodity: 'Oyster', variety: 'Grey Oyster' },
].map(c => ({ ...c, fullName: `${c.commodity} - ${c.variety}`, key: `${c.category}-${c.commodity}-${c.variety}`.toLowerCase().replace(/\s/g, '') }));

const aiPrice = (name: string) => {
  const h = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return `₹${((h % 6800) + 1200).toLocaleString('en-IN')}/qtl`;
};

// ─── ACTIVITY TYPES ────────────────────────────────────────
const ACTIVITIES = [
  { id: 'sowing', label: 'Sowing', icon: '🌱', color: '#27AE60' },
  { id: 'transplanting', label: 'Transplanting', icon: '🌿', color: '#16A085' },
  { id: 'irrigation', label: 'Irrigation', icon: '💧', color: '#0066B3' },
  { id: 'fertilizer', label: 'Fertilizer', icon: '🧪', color: '#8E44AD' },
  { id: 'organic', label: 'Organic Input', icon: '🍃', color: '#27AE60' },
  { id: 'pesticide', label: 'Pesticide', icon: '🐛', color: '#E74C3C' },
  { id: 'micronutrient', label: 'Micronutrients', icon: '⚗️', color: '#F39C12' },
  { id: 'growth', label: 'Growth Reg.', icon: '📈', color: '#2980B9' },
  { id: 'harvest', label: 'Harvest', icon: '🌾', color: '#F39C12' },
  { id: 'sorting', label: 'Sorting', icon: '📦', color: '#7F8C8D' },
  { id: 'packing', label: 'Packing', icon: '📫', color: '#95A5A6' },
  { id: 'storage', label: 'Storage', icon: '🏭', color: '#003E6D' },
  { id: 'transport', label: 'Transport', icon: '🚛', color: '#E67E22' },
  { id: 'quality', label: 'Quality Check', icon: '✅', color: '#27AE60' },
  { id: 'custom', label: 'Custom', icon: '➕', color: '#BDC3C7' },
];

// ─── INPUT CATEGORIES ──────────────────────────────────────
const INPUT_CATS = [
  { id: 'seeds', label: 'Seeds', icon: '🌱', items: ['Hybrid Seeds', 'Open-Pollinated', 'Certified Seeds'] },
  { id: 'seedlings', label: 'Seedlings', icon: '🌿', items: ['Vegetable Seedlings', 'Fruit Saplings'] },
  { id: 'fertilizers', label: 'Fertilizers', icon: '🧪', items: ['Urea', 'DAP', 'MOP', 'NPK Complex'] },
  { id: 'organic', label: 'Organic', icon: '🍃', items: ['Vermicompost', 'FYM', 'Neem Cake'] },
  { id: 'bio', label: 'Bio Inputs', icon: '🦠', items: ['Rhizobium', 'PSB', 'Azospirillum'] },
  { id: 'pesticides', label: 'Pesticides', icon: '🐛', items: ['Insecticide', 'Fungicide', 'Herbicide'] },
  { id: 'micronutrients', label: 'Micronutrients', icon: '⚗️', items: ['Zinc Sulphate', 'Boron', 'Iron'] },
  { id: 'irrigation', label: 'Irrigation', icon: '💧', items: ['Drip Kit', 'Sprinkler', 'Pipes'] },
  { id: 'packaging', label: 'Packaging', icon: '📦', items: ['PP Bags', 'Jute Bags', 'HDPE Bags'] },
  { id: 'lab', label: 'Lab Testing', icon: '🔬', items: ['Soil Test', 'Water Test', 'Residue Test'] },
];

// ─── SERVICE CATEGORIES ────────────────────────────────────
const SVC_CATS = [
  { id: 'landprep', label: 'Land Prep', icon: '🚜', services: ['Ploughing', 'Rotavator', 'Levelling'] },
  { id: 'spraying', label: 'Spraying', icon: '💦', services: ['Tractor Spray', 'Drone Spray', 'Manual'] },
  { id: 'harvesting', label: 'Harvesting', icon: '🌾', services: ['Combine Harvester', 'Thresher', 'Manual'] },
  { id: 'lab_svc', label: 'Lab Testing', icon: '🔬', services: ['NABL Lab', 'Govt. Lab', 'Private Lab'] },
  { id: 'transport_svc', label: 'Transport', icon: '🚛', services: ['Truck Hire', 'Mini Truck', 'Tempo'] },
  { id: 'storage_svc', label: 'Cold Storage', icon: '🏭', services: ['Govt. Warehouse', 'Private Cold Store'] },
  { id: 'financial', label: 'Finance', icon: '🏦', services: ['Crop Loan', 'KCC', 'Warehouse Loan'] },
  { id: 'advisory', label: 'AI Advisory', icon: '🤖', services: ['Crop Planning', 'Market Advisory'] },
];

// ─── SELL METHODS ──────────────────────────────────────────
const SELL_METHODS = [
  { id: 'location', icon: '📍', label: 'Farm Gate Sale', desc: 'Buyer picks up from your farm.', badge: null },
  { id: 'agent', icon: '🤝', label: 'Commission Agent', desc: 'Agent arranges buyer. 2–4% commission.', badge: 'Popular' },
  { id: 'warehouse', icon: '🏭', label: 'At Warehouse', desc: 'Transport to certified warehouse.', badge: null },
  { id: 'auction', icon: '🔨', label: 'Open Auction', desc: 'Multiple buyers bid simultaneously.', badge: 'Best Price' },
  { id: 'registered', icon: '✅', label: 'Registered Buyer', desc: 'Pre-verified institutional buyer.', badge: null },
  { id: 'direct', icon: '💬', label: 'Direct Negotiation', desc: 'One-on-one chat + counter-offer.', badge: null },
];

// ─── REWARDS ──────────────────────────────────────────────
const R = {
  signup: 50, login: 5, crop: 5, activity: 3, input: 2, service: 2,
  media: 3, quality: 10, harvest: 5, tokenize: 10, sampling: 10,
  trade: 20, logistics: 5, delivery: 5, payment: 15,
};

// ─── TYPES ─────────────────────────────────────────────────
interface Tx { id: string; type: 'earned' | 'spent'; amount: number; reason: string; screen: string; }
interface Wallet { balance: number; transactions: Tx[]; }

// ─── ANIMATION PRESETS ─────────────────────────────────────
const A = {
  slideUp: { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -18 }, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.22 } },
  tap: { whileHover: { scale: 1.02 }, whileTap: { scale: 0.96 }, transition: { duration: 0.12 } },
  burst: { initial: { scale: 0 }, animate: { scale: [0, 1.4, 1] }, transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] as any } },
};

// ─── SHARED UI COMPONENTS ──────────────────────────────────
const Wrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen pb-24" style={{ background: T.gradientBg }}>{children}</div>
);

const Hdr: React.FC<{ title: string; n: number; onBack: () => void; sub?: string; onDraft?: () => void }> = ({ title, n, onBack, sub, onDraft }) => (
  <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm" style={{ boxShadow: T.shadow.sm }}>
    <div className="flex items-center gap-3 px-4 py-3 max-w-sm mx-auto">
      <motion.button {...A.tap} onClick={onBack} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0" style={{ minWidth: 40, minHeight: 40 }}>
        <ChevronRight className="w-5 h-5 text-gray-500 rotate-180" />
      </motion.button>
      <div className="flex-1 min-w-0">
        <h2 className="font-bold text-sm truncate" style={{ color: T.blue, fontFamily: T.heading }}>{title}</h2>
        {sub && <p className="text-xs text-gray-400 truncate">{sub}</p>}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {onDraft && (
          <motion.button {...A.tap} onClick={onDraft} className="text-xs px-2.5 py-1.5 rounded-lg border font-medium" style={{ borderColor: T.grayLight, color: T.grayMid, minHeight: 32 }}>
            Draft
          </motion.button>
        )}
        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${T.gold}25`, color: T.goldDark, border: `1px solid ${T.gold}40` }}>
          {n}/{T.TOTAL}
        </span>
      </div>
    </div>
    <div className="px-4 pb-2 max-w-sm mx-auto">
      <div className="bg-gray-100 rounded-full h-1.5">
        <motion.div className="h-1.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${(n / T.TOTAL) * 100}%` }} transition={{ duration: 0.5 }} style={{ background: T.gradientGold }} />
      </div>
    </div>
  </div>
);

const GoldBtn: React.FC<{ children: React.ReactNode; onClick: () => void; disabled?: boolean; outline?: boolean }> = ({ children, onClick, disabled, outline }) => (
  <motion.button {...A.tap} onClick={onClick} disabled={disabled}
    className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
    style={{ background: outline ? 'transparent' : disabled ? '#D1D5DB' : T.gradientGold, color: outline ? T.blue : disabled ? '#9CA3AF' : T.blue, border: outline ? `2px solid ${T.blue}` : 'none', boxShadow: !outline && !disabled ? '0 8px 24px rgba(244,208,63,0.38)' : 'none', minHeight: 52, fontSize: 15 }}>
    {children}
  </motion.button>
);

const GhostBtn: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
  <motion.button {...A.tap} onClick={onClick}
    className="w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
    style={{ backgroundColor: 'rgba(0,0,0,0.04)', color: T.grayDark, minHeight: 44 }}>
    {children}
  </motion.button>
);

const InfoBox: React.FC<{ icon?: string; text: string; accent?: string }> = ({ icon, text, accent = T.gold }) => (
  <div className="flex items-start gap-2.5 p-3.5 rounded-2xl" style={{ background: `${accent}10`, border: `1px solid ${accent}25` }}>
    {icon && <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>}
    <p className="text-xs text-gray-600 leading-relaxed">{text}</p>
  </div>
);

const Chip: React.FC<{ amount: number }> = ({ amount }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${T.gold}22`, color: T.goldDark, border: `1px solid ${T.gold}40` }}>
    <Coins className="w-3 h-3" />+{amount}
  </span>
);

const WCard: React.FC<{ wallet: Wallet; onTap?: () => void }> = ({ wallet, onTap }) => (
  <motion.div {...A.tap} onClick={onTap} className="relative overflow-hidden rounded-2xl p-5 cursor-pointer" style={{ background: T.gradientGold, boxShadow: '0 8px 32px rgba(244,208,63,0.35)' }}>
    <motion.div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)' }}
      animate={{ x: ['-100%', '200%'] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }} />
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <p className="text-white/70 text-xs mb-0.5 font-medium tracking-wider uppercase">Tradie Tokens</p>
        <p className="text-white text-4xl font-black">{wallet.balance}</p>
        <p className="text-white/60 text-xs mt-1">{wallet.transactions.length} transactions</p>
      </div>
      <motion.div animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
        <Coins className="w-14 h-14 text-white/85" />
      </motion.div>
    </div>
  </motion.div>
);

// ─── BOTTOM NAV ────────────────────────────────────────────
const BNav: React.FC<{ active: string; onNav: (id: string, n: number) => void; onNotif: () => void }> = ({ active, onNav, onNotif }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home', n: SCREENS.dashboard },
    { id: 'crops', icon: Sprout, label: 'Crops', n: SCREENS.crop },
    { id: 'trade', icon: TrendingUp, label: 'Trade', n: SCREENS.marketplace },
    { id: 'wallet', icon: Coins, label: 'Wallet', n: SCREENS.ledger },
    { id: 'profile', icon: Users, label: 'Profile', n: SCREENS.profile },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around px-1 py-2 z-20" style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.07)' }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onNav(tab.id, tab.n)}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all"
          style={{ minWidth: 52, minHeight: 48, backgroundColor: active === tab.id ? `${T.gold}15` : 'transparent' }}>
          <tab.icon className="w-5 h-5" style={{ color: active === tab.id ? T.goldDark : '#9CA3AF' }} />
          <span style={{ color: active === tab.id ? T.goldDark : '#9CA3AF', fontSize: 10, fontWeight: active === tab.id ? 700 : 400 }}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════
interface Props { onClose?: () => void; }

export const TRADIEProducerFlowPrototypeRefined: React.FC<Props> = ({ onClose }) => {
  const [screen, setScreen] = useState(1);
  const [lang, setLang] = useState('EN');
  const [role, setRole] = useState('');
  const [activeNav, setActiveNav] = useState('home');
  const [showTokAnim, setShowTokAnim] = useState(false);
  const screenToksRef = useRef<Set<number>>(new Set());

  const [wallet, setWallet] = useState<Wallet>({ balance: 0, transactions: [] });
  const [form, setForm] = useState<any>({
    commodity: null, acres: '', soil: '', water: '', surveyNo: '',
    activities: [] as any[], inputs: [] as any[], services: [] as any[],
    mediaUploaded: false, qualityScore: 0, quantity: '', harvestDate: '',
    grade: 'A', lot: '', nft: '', samplingDone: false,
    storageDecision: '', sellMethod: '', buyer: '', saleAmount: 0,
    agentName: '', transport: null, paymentDone: false,
    calendarEvents: [] as any[], equipment: [] as any[], financialApp: '',
  });

  const addToks = useCallback((amount: number, reason: string, src: string) => {
    const tx: Tx = { id: Date.now().toString(), type: 'earned', amount, reason, screen: src };
    setWallet(p => ({ ...p, balance: p.balance + amount, transactions: [tx, ...p.transactions] }));
    setShowTokAnim(true);
    setTimeout(() => setShowTokAnim(false), 1800);
  }, []);

  // One-time screen token awards — runs in parent to prevent inner useEffect loops
  useEffect(() => {
    if (screen === SCREENS.welcome && !screenToksRef.current.has(SCREENS.welcome)) {
      screenToksRef.current.add(SCREENS.welcome);
      addToks(R.signup, 'Welcome Bonus', 'Screen 3');
    }
    if (screen === SCREENS.dashboard && !screenToksRef.current.has(SCREENS.dashboard)) {
      screenToksRef.current.add(SCREENS.dashboard);
      addToks(R.login, 'Daily Login', 'Screen 4');
    }
  }, [screen, addToks]);

  const go = (n: number, toks?: { amt: number; why: string }) => {
    if (toks) addToks(toks.amt, toks.why, `Screen ${n}`);
    setScreen(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const nav = (id: string, n: number) => { setActiveNav(id); go(n); };
  const upd = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  // ── S1: LANGUAGE ──────────────────────────────────────
  const S1 = () => (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg,#FFFDE7,#FFF9C4,#FFF3E0)' }}>
      <motion.div {...A.slideUp} className="max-w-sm mx-auto">
        <div className="text-center mb-8 pt-8">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', duration: 0.8 }}
            className="w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: T.gradientGold, boxShadow: '0 16px 48px rgba(244,208,63,0.5)' }}>
            <Leaf className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="font-black mb-2" style={{ fontSize: 36, color: '#2C3E50', fontFamily: T.heading }}>TRADIE</h1>
          <p className="text-gray-500 text-sm">Enterprise Commodity Trading Platform</p>
          <p className="text-gray-400 text-xs mt-1">Choose Your Language / भाषा चुनें</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {Object.entries(LANGUAGES).map(([code, { flag, nativeName }], i) => (
            <motion.button key={code} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
              {...A.tap} onClick={() => { setLang(code); setTimeout(() => go(SCREENS.role), 220); }}
              className="p-4 rounded-2xl border-2 bg-white"
              style={{ borderColor: lang === code ? T.gold : '#E5E7EB', boxShadow: T.shadow.sm, minHeight: 80 }}>
              <div className="text-4xl mb-1">{flag}</div>
              <div className="font-bold text-sm text-gray-700">{nativeName}</div>
            </motion.button>
          ))}
        </div>
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl" style={{ boxShadow: T.shadow.sm }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${T.gold}20` }}>
              <Mic className="w-4 h-4" style={{ color: T.goldDark }} />
            </div>
            <span className="text-sm font-semibold text-gray-700">Voice Input Available</span>
          </div>
          <span className="text-xs text-gray-400">All screens</span>
        </div>
      </motion.div>
    </div>
  );

  // ── S2: ROLE ──────────────────────────────────────────
  const S2 = () => {
    const roles = [
      { id: 'producer', icon: '🌾', label: 'Producer', sub: 'AI Lifecycle', color: T.green },
      { id: 'agent', icon: '📦', label: 'Agent', sub: 'Commission', color: T.goldDark },
      { id: 'buyer', icon: '🛒', label: 'Buyer', sub: 'Purchase', color: T.blueLight },
      { id: 'transporter', icon: '🚛', label: 'Transport', sub: 'Logistics', color: T.purple },
      { id: 'storage', icon: '🏭', label: 'Storage', sub: 'Warehouse', color: '#EC4899' },
      { id: 'financial', icon: '🏦', label: 'Finance', sub: 'Loans & FPO', color: T.red },
      { id: 'lab', icon: '🔬', label: 'Quality Lab', sub: 'Testing', color: '#06B6D4' },
      { id: 'admin', icon: '⚙️', label: 'Admin', sub: 'System', color: '#6B7280' },
    ];
    return (
      <div className="min-h-screen p-6" style={{ background: T.gradientBg }}>
        <motion.div {...A.fade} className="max-w-sm mx-auto">
          <div className="flex items-center justify-between mb-6 pt-4">
            <motion.button {...A.tap} onClick={() => go(SCREENS.language)} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center" style={{ boxShadow: T.shadow.sm, minWidth: 40, minHeight: 40 }}>
              <ChevronRight className="w-5 h-5 text-gray-500 rotate-180" />
            </motion.button>
            <span className="text-sm font-bold" style={{ color: T.blue }}>{LANGUAGES[lang]?.flag} {LANGUAGES[lang]?.nativeName}</span>
          </div>
          <div className="text-center mb-6">
            <h1 className="font-black mb-1" style={{ fontSize: 26, color: T.blue, fontFamily: T.heading }}>Select Your Role</h1>
            <p className="text-gray-400 text-xs">Multi-role · Change anytime in Settings</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {roles.map((r, i) => (
              <motion.button key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                {...A.tap} onClick={() => { setRole(r.id); setTimeout(() => go(SCREENS.welcome), 220); }}
                className="p-4 rounded-2xl bg-white border-2 flex flex-col items-center text-center"
                style={{ borderColor: role === r.id ? r.color : 'transparent', boxShadow: T.shadow.sm, minHeight: 110 }}>
                <span className="text-4xl mb-2">{r.icon}</span>
                <div className="font-bold text-sm text-gray-800">{r.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{r.sub}</div>
              </motion.button>
            ))}
          </div>
          <InfoBox icon="🌾" text="Select Producer to begin the complete AI-powered crop trading journey." />
        </motion.div>
      </div>
    );
  };

  // ── S3: WELCOME BONUS ─────────────────────────────────
  const S3 = () => (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: T.gradientGold }}>
      <motion.div className="text-center max-w-sm w-full">
        <motion.div {...A.burst} className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#FFD700,#F39C12)', boxShadow: '0 20px 60px rgba(244,208,63,0.6)' }}>
          <Coins className="w-16 h-16 text-white" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h1 className="text-white font-black mb-1" style={{ fontSize: 30, fontFamily: T.heading }}>Welcome to TRADIE!</h1>
          <p className="text-white text-2xl font-bold mb-1">+{R.signup} Tradie Tokens 🎉</p>
          <p className="text-white/70 text-sm mb-6">Signup Bonus · Earn at every step</p>
          <WCard wallet={wallet} />
          <div className="grid grid-cols-3 gap-3 mt-4 mb-6">
            {[{ l: 'Activity', t: `+${R.activity}` }, { l: 'Quality', t: `+${R.quality}` }, { l: 'Trade', t: `+${R.trade}` }].map(x => (
              <div key={x.l} className="bg-white/20 rounded-2xl p-3 text-center">
                <div className="text-white font-bold">{x.t}</div>
                <div className="text-white/70 text-xs">{x.l}</div>
              </div>
            ))}
          </div>
          <GoldBtn onClick={() => go(SCREENS.dashboard)}>Open Dashboard <ArrowRight className="w-5 h-5" /></GoldBtn>
        </motion.div>
      </motion.div>
    </div>
  );

  // ── S4: DASHBOARD ─────────────────────────────────────
  const S4 = () => {
    const stats = [
      { l: 'Lots', v: '3', icon: Package, color: T.gold },
      { l: 'Orders', v: '1', icon: ShoppingCart, color: T.green },
      { l: 'Revenue', v: '₹2.4L', icon: DollarSign, color: T.blue },
    ];
    const qa = [
      { l: 'New Crop', icon: Sprout, n: SCREENS.crop, color: T.green },
      { l: 'Activities', icon: Activity, n: SCREENS.activity, color: T.goldDark },
      { l: 'Inputs', icon: Layers, n: SCREENS.inputs, color: T.blue },
      { l: 'Services', icon: Settings, n: SCREENS.services, color: T.purple },
    ];
    return (
      <Wrap>
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-4 py-3" style={{ boxShadow: T.shadow.sm }}>
          <div className="flex items-center justify-between max-w-sm mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: T.gradientGold }}>
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-black text-sm" style={{ color: T.blue, fontFamily: T.heading }}>TRADIE</h1>
                <p className="text-xs text-gray-400">🌾 {role || 'Producer'} Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => go(SCREENS.notifications)} className="relative p-2 rounded-xl bg-gray-50 w-9 h-9 flex items-center justify-center">
                <Bell className="w-4 h-4 text-gray-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button onClick={() => go(SCREENS.profile)} className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: T.gradientBlue }}>RK</button>
            </div>
          </div>
        </div>
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <motion.div {...A.slideUp} className="p-4 rounded-2xl text-white" style={{ background: T.gradientBlue }}>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-yellow-300 font-semibold uppercase tracking-wider mb-0.5">Grok AI Insight</p>
                <p className="text-sm font-bold">Wheat prices ↑8% in Punjab this week</p>
                <p className="text-xs text-blue-200 mt-0.5">Best listing window: next 5 days →</p>
              </div>
            </div>
          </motion.div>
          <WCard wallet={wallet} onTap={() => go(SCREENS.ledger)} />
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s, i) => (
              <motion.div key={s.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-3 text-center" style={{ boxShadow: T.shadow.sm }}>
                <s.icon className="w-5 h-5 mx-auto mb-1" style={{ color: s.color }} />
                <div className="font-black text-base" style={{ color: T.blue }}>{s.v}</div>
                <div className="text-xs text-gray-400">{s.l}</div>
              </motion.div>
            ))}
          </div>
          <div>
            <h2 className="text-sm font-bold mb-3" style={{ color: T.blue, fontFamily: T.heading }}>Quick Actions</h2>
            <div className="grid grid-cols-4 gap-2">
              {qa.map((a, i) => (
                <motion.button key={a.l} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
                  {...A.tap} onClick={() => { setActiveNav('crops'); go(a.n); }}
                  className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl" style={{ boxShadow: T.shadow.sm, minHeight: 72 }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${a.color}18` }}>
                    <a.icon className="w-5 h-5" style={{ color: a.color }} />
                  </div>
                  <span style={{ fontSize: 10, color: '#6B7280' }}>{a.l}</span>
                </motion.button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold" style={{ color: T.blue, fontFamily: T.heading }}>Recent Activity</h2>
              <button onClick={() => go(SCREENS.reports)} className="text-xs" style={{ color: T.blueLight }}>View All</button>
            </div>
            {[
              { icon: '🌾', text: 'Wheat Lot #L4521 listed', time: '2h ago', toks: 5 },
              { icon: '✅', text: 'Quality check passed — Grade A', time: '1d ago', toks: 10 },
              { icon: '💰', text: 'Payment ₹45,000 received', time: '2d ago', toks: 20 },
            ].map((a, i) => (
              <div key={i} className="bg-white rounded-xl p-3 flex items-center gap-3 mb-2" style={{ boxShadow: T.shadow.sm }}>
                <span className="text-xl">{a.icon}</span>
                <div className="flex-1 min-w-0"><p className="text-xs font-medium text-gray-700 truncate">{a.text}</p><p className="text-xs text-gray-400">{a.time}</p></div>
                <Chip amount={a.toks} />
              </div>
            ))}
          </div>
          <GoldBtn onClick={() => { setActiveNav('crops'); go(SCREENS.crop); }}>
            <Sprout className="w-5 h-5" /> Start New Crop Season <ArrowRight className="w-5 h-5" />
          </GoldBtn>
        </div>
        <BNav active={activeNav} onNav={nav} onNotif={() => go(SCREENS.notifications)} />
      </Wrap>
    );
  };

  // ── S5: CROP SELECTION ────────────────────────────────
  const S5 = () => {
    const [q, setQ] = useState('');
    const [cat, setCat] = useState('Cereals');
    const cats = [...new Set(COMMODITIES.map(c => c.category))];
    const items = q ? COMMODITIES.filter(c => c.fullName.toLowerCase().includes(q.toLowerCase())).slice(0, 15) : COMMODITIES.filter(c => c.category === cat);
    return (
      <Wrap>
        <Hdr title="Select Your Crop" n={SCREENS.crop} onBack={() => go(SCREENS.dashboard)} sub="AI-powered price prediction" />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="✨" text={`Grok AI: ${cat} prices trending up. Recommended for this season.`} />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search 200+ commodities..."
              className="w-full pl-9 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none" style={{ minHeight: 48 }} />
          </div>
          {!q && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap font-medium flex-shrink-0"
                  style={{ backgroundColor: cat === c ? T.gold : '#F3F4F6', color: cat === c ? T.blue : '#6B7280', minHeight: 32 }}>
                  {c}
                </button>
              ))}
            </div>
          )}
          <div className="space-y-2">
            {items.map((item) => (
              <motion.button key={item.key} {...A.tap}
                onClick={() => { upd('commodity', item); go(SCREENS.farm, { amt: R.crop, why: `Crop: ${item.commodity}` }); }}
                className="w-full p-4 rounded-2xl bg-white flex items-center justify-between"
                style={{ boxShadow: form.commodity?.key === item.key ? `0 4px 16px ${T.gold}40` : T.shadow.sm, border: `2px solid ${form.commodity?.key === item.key ? T.gold : 'transparent'}`, minHeight: 60 }}>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">{item.commodity}</p>
                  <p className="text-xs text-gray-400">{item.variety} · {item.category}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-xs font-bold" style={{ color: T.green }}>{aiPrice(item.fullName)}</p>
                  <p className="text-xs text-gray-400">AI Price</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </Wrap>
    );
  };

  // ── S6: FARM & LAND DETAILS ───────────────────────────
  const S6 = () => {
    const soils = ['Black (Regur)', 'Red Laterite', 'Alluvial', 'Sandy Loam', 'Clay', 'Loam'];
    const waters = ['Borewell', 'Canal', 'Rainwater', 'Drip Irrigation', 'Sprinkler', 'River'];
    return (
      <Wrap>
        <Hdr title="Farm & Land Details" n={SCREENS.farm} onBack={() => go(SCREENS.crop)} sub={form.commodity?.commodity} onDraft={() => {}} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="📍" text="Register your land for blockchain provenance tracking and AI yield predictions." accent={T.blue} />
          <div className="bg-white rounded-2xl p-4 space-y-4" style={{ boxShadow: T.shadow.sm }}>
            <h3 className="font-bold text-sm" style={{ color: T.blue, fontFamily: T.heading }}>Land Registration</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Area (Acres)</label>
                <input value={form.acres} onChange={e => upd('acres', e.target.value)} placeholder="e.g. 5.5" type="number"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" style={{ minHeight: 44 }} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Survey / Khasra No.</label>
                <input value={form.surveyNo} onChange={e => upd('surveyNo', e.target.value)} placeholder="123/4A"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" style={{ minHeight: 44 }} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-2">Soil Type</label>
              <div className="flex flex-wrap gap-2">
                {soils.map(s => (
                  <button key={s} onClick={() => upd('soil', s)}
                    className="px-3 py-1.5 rounded-full text-xs"
                    style={{ backgroundColor: form.soil === s ? T.gold : '#F3F4F6', color: form.soil === s ? T.blue : '#6B7280', minHeight: 32 }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-2">Water Source</label>
              <div className="flex flex-wrap gap-2">
                {waters.map(w => (
                  <button key={w} onClick={() => upd('water', w)}
                    className="px-3 py-1.5 rounded-full text-xs"
                    style={{ backgroundColor: form.water === w ? T.gold : '#F3F4F6', color: form.water === w ? T.blue : '#6B7280', minHeight: 32 }}>
                    {w}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Village / Location</label>
              <div className="flex gap-2">
                <input placeholder="Village name" className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" style={{ minHeight: 44 }} />
                <button className="px-3 rounded-xl border border-gray-200 flex items-center justify-center" style={{ minHeight: 44 }}>
                  <MapPin className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Upload Land Records (Khatauni)</label>
              <button className="w-full p-3 border-2 border-dashed rounded-xl flex items-center gap-2 justify-center" style={{ borderColor: '#D1D5DB', minHeight: 44 }}>
                <Upload className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">Upload PDF / Photo</span>
              </button>
            </div>
          </div>
          <GoldBtn onClick={() => go(SCREENS.calendar)} disabled={!form.acres}>Next: Crop Calendar <ArrowRight className="w-5 h-5" /></GoldBtn>
          <GhostBtn onClick={() => go(SCREENS.crop)}>← Back to Crop Selection</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── S7: CROP CALENDAR (NEW) ───────────────────────────
  const S7 = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [selMonth, setSelMonth] = useState(new Date().getMonth());
    const [events, setEvents] = useState<any[]>(form.calendarEvents || []);
    const phases = [
      { icon: '🌱', label: 'Sowing', color: T.green, month: 10 },
      { icon: '💧', label: 'Irrigation', color: T.blueLight, month: 11 },
      { icon: '🧪', label: 'Fertilization', color: '#8E44AD', month: 0 },
      { icon: '🌾', label: 'Harvest', color: T.goldDark, month: 3 },
    ];
    const aiRec = [
      { text: 'Best sowing window: Oct 15–Nov 5', icon: '🌱' },
      { text: 'Irrigation: every 21 days after sowing', icon: '💧' },
      { text: 'First dose of DAP at 30 DAS', icon: '🧪' },
      { text: 'Expected harvest: March 20–April 10', icon: '🌾' },
    ];
    return (
      <Wrap>
        <Hdr title="Crop Calendar" n={SCREENS.calendar} onBack={() => go(SCREENS.farm)} sub="AI-planned season schedule" onDraft={() => {}} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="📅" text="Grok AI generates your personalised crop calendar based on variety, location, and weather forecast." accent={T.blue} />
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
            <h3 className="font-bold text-sm mb-3" style={{ color: T.blue, fontFamily: T.heading }}>Season Timeline</h3>
            <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4">
              {months.map((m, i) => (
                <button key={m} onClick={() => setSelMonth(i)}
                  className="flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-medium"
                  style={{ backgroundColor: selMonth === i ? T.gold : '#F3F4F6', color: selMonth === i ? T.blue : '#9CA3AF', minHeight: 32, minWidth: 36 }}>
                  {m}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 mb-3">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={`${d}-${i}`} className="text-center text-xs text-gray-400">{d}</div>
              ))}
              {Array.from({ length: 30 }, (_, d) => {
                const hasEvent = phases.some(p => p.month === selMonth && (d + 1 === 5 || d + 1 === 15 || d + 1 === 25));
                return (
                  <button key={d} className="aspect-square rounded-lg flex items-center justify-center text-xs"
                    style={{ backgroundColor: hasEvent ? `${T.gold}30` : 'transparent', color: hasEvent ? T.goldDark : '#374151', fontWeight: hasEvent ? 700 : 400, minHeight: 28 }}>
                    {d + 1}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              {phases.map(p => (
                <div key={p.label} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: `${p.color}10` }}>
                  <span className="text-base">{p.icon}</span>
                  <span className="text-xs font-medium text-gray-700">{p.label}</span>
                  <span className="ml-auto text-xs text-gray-400">{months[p.month]}</span>
                  {p.month === selMonth && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${p.color}20`, color: p.color }}>This Month</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4" style={{ color: T.goldDark }} />
              <h3 className="font-bold text-sm" style={{ color: T.blue, fontFamily: T.heading }}>Grok AI Recommendations</h3>
            </div>
            {aiRec.map((r, i) => (
              <div key={i} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
                <span className="text-base">{r.icon}</span>
                <p className="text-xs text-gray-600">{r.text}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <motion.button {...A.tap} onClick={() => {}}
              className="flex-1 py-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-2"
              style={{ borderColor: T.blue, color: T.blue, minHeight: 44 }}>
              <Download className="w-4 h-4" /> Export PDF
            </motion.button>
            <motion.button {...A.tap} onClick={() => {}}
              className="flex-1 py-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-2"
              style={{ borderColor: T.goldDark, color: T.goldDark, minHeight: 44 }}>
              <Share2 className="w-4 h-4" /> Share
            </motion.button>
          </div>
          <GoldBtn onClick={() => go(SCREENS.activity)}>Start Activity Log <ArrowRight className="w-5 h-5" /></GoldBtn>
          <GhostBtn onClick={() => go(SCREENS.farm)}>← Back to Farm Details</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── S8: ACTIVITY LOG ──────────────────────────────────
  const S8 = () => {
    const [selType, setSelType] = useState<string | null>(null);
    const [entry, setEntry] = useState({ date: '', notes: '', cost: '', qty: '', supplier: '' });
    const [added, setAdded] = useState<any[]>(form.activities || []);
    const addAct = () => {
      if (!selType) return;
      const newA = [...added, { type: selType, ...entry, id: Date.now() }];
      setAdded(newA); upd('activities', newA);
      setSelType(null); setEntry({ date: '', notes: '', cost: '', qty: '', supplier: '' });
      addToks(R.activity, `Activity: ${ACTIVITIES.find(a => a.id === selType)?.label}`, 'Screen 8');
    };
    return (
      <Wrap>
        <Hdr title="Activity Log" n={SCREENS.activity} onBack={() => go(SCREENS.calendar)} sub="Record all farm operations" onDraft={() => {}} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="📋" text="Log every operation for AI insights, provenance and government subsidy eligibility." />
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
            <h3 className="font-bold text-sm mb-3" style={{ color: T.blue, fontFamily: T.heading }}>Select Activity Type</h3>
            <div className="grid grid-cols-3 gap-2">
              {ACTIVITIES.map(a => (
                <button key={a.id} onClick={() => setSelType(a.id)}
                  className="p-3 rounded-xl border-2 flex flex-col items-center text-center"
                  style={{ borderColor: selType === a.id ? a.color : '#E5E7EB', backgroundColor: selType === a.id ? `${a.color}10` : '#FAFAFA', minHeight: 72 }}>
                  <span className="text-2xl mb-1">{a.icon}</span>
                  <span className="text-xs" style={{ color: selType === a.id ? a.color : '#6B7280', fontSize: 10 }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
          {selType && (
            <motion.div {...A.slideUp} className="bg-white rounded-2xl p-4 space-y-3" style={{ boxShadow: T.shadow.sm }}>
              <h3 className="font-bold text-sm" style={{ color: T.blue, fontFamily: T.heading }}>
                {ACTIVITIES.find(a => a.id === selType)?.icon} {ACTIVITIES.find(a => a.id === selType)?.label} Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[['date', 'Date', 'date'], ['cost', 'Cost (₹)', 'number'], ['qty', 'Quantity', 'text'], ['supplier', 'Supplier', 'text']].map(([k, l, t]) => (
                  <div key={k}>
                    <label className="text-xs text-gray-500 block mb-1">{l}</label>
                    <input type={t} value={(entry as any)[k]} onChange={e => setEntry(p => ({ ...p, [k]: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none" style={{ minHeight: 40 }} />
                  </div>
                ))}
              </div>
              <textarea value={entry.notes} onChange={e => setEntry(p => ({ ...p, notes: e.target.value }))}
                placeholder="Notes / AI will analyze for recommendations..." rows={2}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none" />
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl border-2 border-dashed text-xs font-medium flex items-center justify-center gap-2" style={{ borderColor: '#D1D5DB', color: '#6B7280', minHeight: 40 }}>
                  <Camera className="w-4 h-4" /> Add Photo
                </button>
                <button className="flex-1 py-2.5 rounded-xl border-2 border-dashed text-xs font-medium flex items-center justify-center gap-2" style={{ borderColor: '#D1D5DB', color: '#6B7280', minHeight: 40 }}>
                  <QrCode className="w-4 h-4" /> QR Scan
                </button>
              </div>
              <motion.button {...A.tap} onClick={addAct}
                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{ background: T.gradientGold, color: T.blue, minHeight: 44 }}>
                <Plus className="w-4 h-4" /> Add Activity <Chip amount={R.activity} />
              </motion.button>
            </motion.div>
          )}
          {added.length > 0 && (
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: T.blue, fontFamily: T.heading }}>Logged ({added.length})</h3>
              {added.map((a, i) => {
                const type = ACTIVITIES.find(t => t.id === a.type);
                return (
                  <div key={a.id || i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xl">{type?.icon}</span>
                    <div className="flex-1"><p className="text-xs font-semibold text-gray-700">{type?.label}</p><p className="text-xs text-gray-400">{a.date || 'No date'}{a.cost ? ` · ₹${a.cost}` : ''}</p></div>
                    <CheckCircle className="w-4 h-4" style={{ color: T.green }} />
                  </div>
                );
              })}
            </div>
          )}
          <GoldBtn onClick={() => go(SCREENS.inputs)} disabled={added.length === 0}>Proceed to Input Purchase <ArrowRight className="w-5 h-5" /></GoldBtn>
          <GhostBtn onClick={() => go(SCREENS.inputs)}>Skip for Now →</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── S9: INPUTS PURCHASE ───────────────────────────────
  const S9 = () => {
    const [selCat, setSelCat] = useState<string | null>(null);
    const [selItem, setSelItem] = useState('');
    const [inp, setInp] = useState({ supplier: '', brand: '', qty: '', price: '', gst: '', invoice: '', batch: '' });
    const [purchases, setPurchases] = useState<any[]>(form.inputs || []);
    const cat = INPUT_CATS.find(c => c.id === selCat);
    const addInp = () => {
      if (!selCat || !selItem) return;
      const newI = [...purchases, { category: selCat, item: selItem, ...inp, id: Date.now() }];
      setPurchases(newI); upd('inputs', newI);
      setSelCat(null); setSelItem(''); setInp({ supplier: '', brand: '', qty: '', price: '', gst: '', invoice: '', batch: '' });
      addToks(R.input, `Input: ${selItem}`, 'Screen 9');
    };
    return (
      <Wrap>
        <Hdr title="Input Purchase" n={SCREENS.inputs} onBack={() => go(SCREENS.activity)} sub="Seeds, fertilizers, pesticides" onDraft={() => {}} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="🧪" text="Record all inputs for cost tracking, subsidy claims, and supply chain transparency." accent={T.green} />
          {!selCat ? (
            <div className="grid grid-cols-3 gap-3">
              {INPUT_CATS.map((c, i) => (
                <motion.button key={c.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                  {...A.tap} onClick={() => setSelCat(c.id)}
                  className="p-3 rounded-2xl bg-white flex flex-col items-center text-center" style={{ boxShadow: T.shadow.sm, minHeight: 88 }}>
                  <span className="text-3xl mb-1">{c.icon}</span>
                  <span className="text-xs font-medium text-gray-600" style={{ fontSize: 10 }}>{c.label}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.div {...A.slideUp} className="space-y-4">
              <button onClick={() => setSelCat(null)} className="flex items-center gap-2 text-xs font-semibold" style={{ color: T.blue }}>
                <ChevronLeft className="w-4 h-4" /> {cat?.icon} {cat?.label}
              </button>
              <div className="bg-white rounded-2xl p-4 space-y-3" style={{ boxShadow: T.shadow.sm }}>
                <div>
                  <label className="text-xs text-gray-500 block mb-2">Select Item</label>
                  <div className="flex flex-wrap gap-2">
                    {cat?.items.map(item => (
                      <button key={item} onClick={() => setSelItem(item)}
                        className="px-3 py-1.5 rounded-full text-xs"
                        style={{ backgroundColor: selItem === item ? T.green : '#F3F4F6', color: selItem === item ? T.white : '#6B7280', minHeight: 32 }}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
                {selItem && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {[['supplier', 'Supplier'], ['brand', 'Brand'], ['qty', 'Quantity'], ['price', 'Price (₹)'], ['gst', 'GST %'], ['batch', 'Batch No.']].map(([k, l]) => (
                        <div key={k}>
                          <label className="text-xs text-gray-500 block mb-1">{l}</label>
                          <input value={(inp as any)[k]} onChange={e => setInp(p => ({ ...p, [k]: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none" style={{ minHeight: 40 }} />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={inp.invoice} onChange={e => setInp(p => ({ ...p, invoice: e.target.value }))} placeholder="Invoice Number"
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none" style={{ minHeight: 40 }} />
                      <button className="px-3 py-2 rounded-xl border border-gray-200" style={{ minHeight: 40 }}><Camera className="w-4 h-4 text-gray-400" /></button>
                    </div>
                    <motion.button {...A.tap} onClick={addInp}
                      className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                      style={{ background: T.gradientGold, color: T.blue, minHeight: 44 }}>
                      <Plus className="w-4 h-4" /> Record Input <Chip amount={R.input} />
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          )}
          {purchases.length > 0 && (
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
              <h3 className="font-bold text-sm mb-2" style={{ color: T.blue, fontFamily: T.heading }}>Recorded ({purchases.length})</h3>
              {purchases.map((p, i) => {
                const c = INPUT_CATS.find(x => x.id === p.category);
                return (
                  <div key={p.id || i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-lg">{c?.icon}</span>
                    <div className="flex-1"><p className="text-xs font-semibold text-gray-700">{p.item}</p><p className="text-xs text-gray-400">{p.supplier || '—'}{p.price ? ` · ₹${p.price}` : ''}</p></div>
                  </div>
                );
              })}
            </div>
          )}
          <GoldBtn onClick={() => go(SCREENS.equipment)}>Proceed to Equipment & Rental <ArrowRight className="w-5 h-5" /></GoldBtn>
          <GhostBtn onClick={() => go(SCREENS.equipment)}>Skip for Now →</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── S10: EQUIPMENT RENTAL (NEW) ───────────────────────
  const S10 = () => {
    const [selEq, setSelEq] = useState<any | null>(null);
    const [booked, setBooked] = useState<any[]>(form.equipment || []);
    const equip = [
      { id: 'tractor', icon: '🚜', label: 'Tractor', rate: '₹1,200/hr', providers: ['Agri Rental Co.', 'Punjab Farm Eq.'], hp: '35HP / 50HP / 75HP' },
      { id: 'harvester', icon: '🌾', label: 'Combine Harvester', rate: '₹2,800/hr', providers: ['HarvestPro', 'KisanMachinery'], hp: '100HP / 140HP' },
      { id: 'thresher', icon: '⚙️', label: 'Thresher', rate: '₹800/hr', providers: ['AgroTech', 'LocalRental'], hp: '5HP / 10HP' },
      { id: 'rotavator', icon: '🔄', label: 'Rotavator', rate: '₹900/hr', providers: ['FarmEquip', 'PunjabAgri'], hp: '45HP / 60HP' },
      { id: 'sprayer', icon: '💦', label: 'Power Sprayer', rate: '₹400/hr', providers: ['SprayTech', 'KisanSeva'], hp: 'Engine / Battery' },
      { id: 'drone', icon: '🚁', label: 'Drone Spraying', rate: '₹550/acre', providers: ['DroneAgri', 'SkyKisan'], hp: '10L / 16L payload' },
    ];
    const bookEq = () => {
      if (!selEq) return;
      const newE = [...booked, { ...selEq, id: Date.now() }];
      setBooked(newE); upd('equipment', newE); setSelEq(null);
      addToks(2, `Equipment: ${selEq.label}`, 'Screen 10');
    };
    return (
      <Wrap>
        <Hdr title="Equipment Rental" n={SCREENS.equipment} onBack={() => go(SCREENS.inputs)} sub="Hire farm machinery" onDraft={() => {}} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="🚜" text="TRADIE-verified equipment providers. GPS-tracked, insured, digital receipt included." accent={T.purple} />
          <div className="grid grid-cols-2 gap-3">
            {equip.map((e, i) => (
              <motion.button key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                {...A.tap} onClick={() => setSelEq(selEq?.id === e.id ? null : e)}
                className="p-4 rounded-2xl bg-white border-2 text-left"
                style={{ borderColor: selEq?.id === e.id ? T.gold : 'transparent', boxShadow: T.shadow.sm, minHeight: 100 }}>
                <span className="text-3xl block mb-1">{e.icon}</span>
                <p className="text-xs font-bold text-gray-800">{e.label}</p>
                <p className="text-xs font-bold mt-1" style={{ color: T.green }}>{e.rate}</p>
                <p className="text-xs text-gray-400">{e.hp}</p>
              </motion.button>
            ))}
          </div>
          {selEq && (
            <motion.div {...A.slideUp} className="bg-white rounded-2xl p-4 space-y-3" style={{ boxShadow: T.shadow.sm }}>
              <h3 className="font-bold text-sm" style={{ color: T.blue, fontFamily: T.heading }}>{selEq.icon} {selEq.label} Booking</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500 block mb-1">Date</label>
                  <input type="date" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none" style={{ minHeight: 40 }} /></div>
                <div><label className="text-xs text-gray-500 block mb-1">Duration (hrs)</label>
                  <input type="number" placeholder="e.g. 4" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none" style={{ minHeight: 40 }} /></div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-2">Select Provider</label>
                {selEq.providers.map((p: string) => (
                  <button key={p} className="w-full p-2.5 rounded-lg border text-left text-xs font-medium mb-1.5" style={{ borderColor: '#E5E7EB', minHeight: 40 }}>
                    {p} <span className="float-right text-gray-400">4.7★</span>
                  </button>
                ))}
              </div>
              <GoldBtn onClick={bookEq}>Book {selEq.label}</GoldBtn>
            </motion.div>
          )}
          {booked.length > 0 && (
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
              <h3 className="font-bold text-sm mb-2" style={{ color: T.blue }}>Booked Equipment ({booked.length})</h3>
              {booked.map((b, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-lg">{b.icon}</span>
                  <div className="flex-1"><p className="text-xs font-semibold text-gray-700">{b.label}</p><p className="text-xs text-gray-400">{b.rate}</p></div>
                  <CheckCircle className="w-4 h-4" style={{ color: T.green }} />
                </div>
              ))}
            </div>
          )}
          <GoldBtn onClick={() => go(SCREENS.financial)}>Proceed to Financial Services <ArrowRight className="w-5 h-5" /></GoldBtn>
          <GhostBtn onClick={() => go(SCREENS.financial)}>Skip for Now →</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── S11: FINANCIAL SERVICES (NEW) ─────────────────────
  const S11 = () => {
    const [selSvc, setSelSvc] = useState<string | null>(null);
    const [applied, setApplied] = useState(false);
    const svcs = [
      { id: 'kcc', icon: '💳', label: 'Kisan Credit Card (KCC)', limit: 'Up to ₹3 Lakh', rate: '7% p.a.', badge: 'Govt', color: T.blue },
      { id: 'crop_loan', icon: '🌾', label: 'Crop Loan', limit: 'Up to ₹5 Lakh', rate: '9% p.a.', badge: null, color: T.green },
      { id: 'wrl', icon: '🏭', label: 'Warehouse Receipt Loan', limit: 'Up to 70% of value', rate: '10% p.a.', badge: 'New', color: T.purple },
      { id: 'pmkisan', icon: '🇮🇳', label: 'PM-KISAN Benefit', limit: '₹6,000/year', rate: 'Free', badge: 'Govt', color: T.goldDark },
      { id: 'pmfby', icon: '🛡️', label: 'PMFBY Insurance', limit: 'Full crop coverage', rate: '2% premium', badge: 'Govt', color: '#EC4899' },
      { id: 'subsidy', icon: '📋', label: 'Input Subsidy', limit: 'Seed/Fertilizer subsidy', rate: 'Free', badge: 'Govt', color: T.red },
    ];
    return (
      <Wrap>
        <Hdr title="Financial Services" n={SCREENS.financial} onBack={() => go(SCREENS.equipment)} sub="Loans, insurance & government schemes" onDraft={() => {}} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="🏦" text="Access government schemes, crop loans, and insurance directly. KYC-verified application in minutes." accent={T.gold} />
          <div className="space-y-3">
            {svcs.map((s, i) => (
              <motion.button key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                {...A.tap} onClick={() => setSelSvc(selSvc === s.id ? null : s.id)}
                className="w-full p-4 rounded-2xl bg-white border-2 text-left"
                style={{ borderColor: selSvc === s.id ? s.color : 'transparent', boxShadow: T.shadow.sm, minHeight: 72 }}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{s.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-gray-800">{s.label}</p>
                      {s.badge && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${s.color}20`, color: s.color }}>{s.badge}</span>}
                    </div>
                    <p className="text-xs text-gray-500">{s.limit}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-black" style={{ color: s.color }}>{s.rate}</p>
                  </div>
                </div>
                {selSvc === s.id && (
                  <motion.div {...A.slideUp} className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {[['Aadhaar', 'XXXX-XXXX-4521'], ['PAN', 'XXXXX1234X'], ['Bank A/C', '•••• 4521'], ['Land Records', 'Uploaded']].map(([l, v]) => (
                        <div key={l} className="p-2 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
                          <p className="text-xs text-gray-400">{l}</p>
                          <p className="text-xs font-semibold text-gray-700">{v}</p>
                        </div>
                      ))}
                    </div>
                    {!applied ? (
                      <motion.button {...A.tap} onClick={() => setApplied(true)}
                        className="w-full py-2.5 rounded-xl text-xs font-bold"
                        style={{ background: T.gradientGold, color: T.blue, minHeight: 40 }}>
                        Apply Now — 2 Minutes
                      </motion.button>
                    ) : (
                      <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: `${T.green}15` }}>
                        <CheckCircle className="w-4 h-4" style={{ color: T.green }} />
                        <p className="text-xs font-semibold" style={{ color: T.green }}>Application submitted! Ref: TRD{Date.now().toString().slice(-6)}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
          <GoldBtn onClick={() => go(SCREENS.services)}>Proceed to Services <ArrowRight className="w-5 h-5" /></GoldBtn>
          <GhostBtn onClick={() => go(SCREENS.services)}>Skip for Now →</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── S12: SERVICES BOOKING ─────────────────────────────
  const S12 = () => {
    const [selSvc, setSelSvc] = useState<string | null>(null);
    const [svcData, setSvcData] = useState({ date: '', time: '', qty: '' });
    const [booked, setBooked] = useState<any[]>(form.services || []);
    const svcCat = SVC_CATS.find(s => s.id === selSvc);
    const book = (svc: string) => {
      const newS = [...booked, { category: selSvc, service: svc, ...svcData, id: Date.now() }];
      setBooked(newS); upd('services', newS); setSelSvc(null);
      setSvcData({ date: '', time: '', qty: '' });
      addToks(R.service, `Service: ${svc}`, 'Screen 12');
    };
    return (
      <Wrap>
        <Hdr title="Services Booking" n={SCREENS.services} onBack={() => go(SCREENS.financial)} sub="Book farm services & advisory" onDraft={() => {}} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="🛠️" text="TRADIE-verified service providers. GPS-tracked, insured, digital invoice." accent={T.purple} />
          {!selSvc ? (
            <div className="grid grid-cols-2 gap-3">
              {SVC_CATS.map((s, i) => (
                <motion.button key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  {...A.tap} onClick={() => setSelSvc(s.id)}
                  className="p-4 rounded-2xl bg-white flex flex-col items-start gap-2" style={{ boxShadow: T.shadow.sm, minHeight: 88 }}>
                  <span className="text-3xl">{s.icon}</span>
                  <div><p className="text-xs font-bold text-gray-700">{s.label}</p><p className="text-xs text-gray-400">{s.services.length} options</p></div>
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.div {...A.slideUp} className="space-y-4">
              <button onClick={() => setSelSvc(null)} className="flex items-center gap-2 text-xs font-semibold" style={{ color: T.blue }}>
                <ChevronLeft className="w-4 h-4" /> {svcCat?.icon} {svcCat?.label}
              </button>
              <div className="bg-white rounded-2xl p-4 space-y-3" style={{ boxShadow: T.shadow.sm }}>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 block mb-1">Date</label>
                    <input type="date" value={svcData.date} onChange={e => setSvcData(p => ({ ...p, date: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none" style={{ minHeight: 40 }} /></div>
                  <div><label className="text-xs text-gray-500 block mb-1">Area</label>
                    <input value={svcData.qty} onChange={e => setSvcData(p => ({ ...p, qty: e.target.value }))} placeholder="e.g. 5 acres"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none" style={{ minHeight: 40 }} /></div>
                </div>
                <div className="space-y-2">
                  {svcCat?.services.map(svc => (
                    <motion.button key={svc} {...A.tap} onClick={() => book(svc)}
                      className="w-full p-3 rounded-xl border text-left flex items-center justify-between" style={{ borderColor: '#E5E7EB', minHeight: 44 }}>
                      <span className="text-sm text-gray-700">{svc}</span>
                      <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ backgroundColor: `${T.green}15`, color: T.green }}>Book</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          {booked.length > 0 && (
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
              <h3 className="font-bold text-sm mb-2" style={{ color: T.blue }}>Booked ({booked.length})</h3>
              {booked.map((b, i) => {
                const c = SVC_CATS.find(x => x.id === b.category);
                return (
                  <div key={b.id || i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-lg">{c?.icon}</span>
                    <div className="flex-1"><p className="text-xs font-semibold text-gray-700">{b.service}</p><p className="text-xs text-gray-400">{b.date || 'Date TBD'}</p></div>
                    <CheckCircle className="w-4 h-4" style={{ color: T.green }} />
                  </div>
                );
              })}
            </div>
          )}
          <GoldBtn onClick={() => go(SCREENS.media)}>Proceed to Media Capture <ArrowRight className="w-5 h-5" /></GoldBtn>
          <GhostBtn onClick={() => go(SCREENS.media)}>Skip for Now →</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── S13: MEDIA & JOURNAL ──────────────────────────────
  const S13 = () => {
    const [done, setDone] = useState(form.mediaUploaded);
    const [analyzing, setAnalyzing] = useState(false);
    const run = () => {
      setAnalyzing(true);
      setTimeout(() => { setAnalyzing(false); setDone(true); upd('mediaUploaded', true); }, 2500);
    };
    return (
      <Wrap>
        <Hdr title="Media Capture & Journal" n={SCREENS.media} onBack={() => go(SCREENS.services)} sub="AI-powered crop analysis" onDraft={() => {}} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="📸" text="Upload photos/videos for Grok AI to analyze crop health, detect pests, and predict quality grade." accent={T.blue} />
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[{ icon: Camera, label: 'Photo', color: T.blue }, { icon: Upload, label: 'Video', color: T.green }, { icon: QrCode, label: 'QR Scan', color: T.purple }].map(m => (
                <motion.button key={m.label} {...A.tap} onClick={run}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed"
                  style={{ borderColor: `${m.color}40`, backgroundColor: `${m.color}08`, minHeight: 80 }}>
                  <m.icon className="w-6 h-6" style={{ color: m.color }} />
                  <span className="text-xs text-gray-500">{m.label}</span>
                </motion.button>
              ))}
            </div>
            {analyzing ? (
              <div className="text-center py-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <RefreshCw className="w-8 h-8 mx-auto mb-2" style={{ color: T.goldDark }} />
                </motion.div>
                <p className="text-sm font-bold" style={{ color: T.blue }}>Grok AI Analyzing...</p>
              </div>
            ) : done ? (
              <motion.div {...A.slideUp} className="space-y-2">
                {[{ l: 'Crop Health', v: '87%', c: T.green }, { l: 'Pest Risk', v: 'Low', c: T.green }, { l: 'Growth Stage', v: 'Tillering', c: T.goldDark }].map(x => (
                  <div key={x.l} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-500">{x.l}</span>
                    <span className="text-xs font-bold" style={{ color: x.c }}>{x.v}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle className="w-4 h-4" style={{ color: T.green }} />
                  <span className="text-xs font-semibold" style={{ color: T.green }}>Analysis Complete</span>
                  <Chip amount={R.media} />
                </div>
              </motion.div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Tap above to capture or upload</p>
              </div>
            )}
          </div>
          <GoldBtn onClick={() => go(SCREENS.aiQuality, { amt: R.media, why: 'Media Captured' })} disabled={!done}>Continue to AI Quality Check <ArrowRight className="w-5 h-5" /></GoldBtn>
          <GhostBtn onClick={() => go(SCREENS.aiQuality)}>Skip for Now →</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── S14: AI QUALITY ASSESSMENT ────────────────────────
  const S14 = () => {
    const [scanning, setScanning] = useState(false);
    const [done, setDone] = useState(false);
    const run = () => { setScanning(true); setTimeout(() => { setScanning(false); setDone(true); upd('qualityScore', 87); }, 3000); };
    const params = [
      { l: 'Moisture', v: '12.5%', target: '<14%', ok: true },
      { l: 'Protein', v: '11.8%', target: '>11%', ok: true },
      { l: 'Foreign Matter', v: '0.3%', target: '<1%', ok: true },
      { l: 'Damaged Kernels', v: '1.2%', target: '<2%', ok: true },
      { l: 'Aflatoxin', v: '2 ppb', target: '<4 ppb', ok: true },
    ];
    return (
      <Wrap>
        <Hdr title="AI Quality Assessment" n={SCREENS.aiQuality} onBack={() => go(SCREENS.media)} sub="Grok AI real-time analysis" />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="🤖" text="Grok AI tests your crop against FSSAI, AGMARK, and international quality standards." accent={T.blue} />
          <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: T.shadow.sm }}>
            {done ? (
              <motion.div {...A.slideUp}>
                <div className="w-32 h-32 mx-auto rounded-full flex flex-col items-center justify-center mb-3"
                  style={{ background: `${T.green}18`, border: `4px solid ${T.green}` }}>
                  <p className="text-3xl font-black" style={{ color: T.green }}>87</p>
                  <p className="text-xs font-bold" style={{ color: T.green }}>/100</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-5 h-5" style={{ color: T.goldDark }} />
                  <span className="font-black" style={{ color: T.blue }}>Grade A — Excellent</span>
                  <Chip amount={R.quality} />
                </div>
              </motion.div>
            ) : scanning ? (
              <div className="py-4">
                <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                  <div className="w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-3" style={{ border: `3px solid ${T.blue}`, background: `${T.blue}08` }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                      <RefreshCw className="w-10 h-10" style={{ color: T.blue }} />
                    </motion.div>
                  </div>
                </motion.div>
                <p className="text-sm font-bold" style={{ color: T.blue }}>Analyzing with Grok AI...</p>
              </div>
            ) : (
              <>
                <Zap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-500 mb-4">Run AI quality scan on your crop</p>
                <GoldBtn onClick={run}>Start AI Quality Scan <Sparkles className="w-5 h-5" /></GoldBtn>
              </>
            )}
          </div>
          {done && (
            <motion.div {...A.slideUp} className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: T.blue, fontFamily: T.heading }}>Quality Parameters</h3>
              {params.map(p => (
                <div key={p.l} className="flex items-center py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1"><p className="text-xs font-medium text-gray-700">{p.l}</p><p className="text-xs text-gray-400">Target: {p.target}</p></div>
                  <span className="text-xs font-bold mr-2" style={{ color: T.green }}>{p.v}</span>
                  <CheckCircle className="w-4 h-4" style={{ color: T.green }} />
                </div>
              ))}
            </motion.div>
          )}
          {done
            ? <GoldBtn onClick={() => go(SCREENS.harvest, { amt: R.quality, why: 'Quality Check Passed' })}>Proceed to Harvest Listing <ArrowRight className="w-5 h-5" /></GoldBtn>
            : <GoldBtn onClick={run}>Start AI Quality Scan <Sparkles className="w-5 h-5" /></GoldBtn>}
          {done
            ? <GhostBtn onClick={() => { setScanning(false); setDone(false); }}>Re-run Analysis</GhostBtn>
            : <GhostBtn onClick={() => go(SCREENS.harvest)}>Skip Quality Check →</GhostBtn>}
        </div>
      </Wrap>
    );
  };

  // ── S15: HARVEST LISTING ──────────────────────────────
  const S15 = () => {
    const grades = ['A (Premium)', 'B (Standard)', 'C (Below Average)'];
    const packs = ['Jute 50kg', 'PP 50kg', 'HDPE 40kg', 'Loose (Bulk)'];
    return (
      <Wrap>
        <Hdr title="Harvest Listing" n={SCREENS.harvest} onBack={() => go(SCREENS.aiQuality)} sub="Enter harvest details" onDraft={() => {}} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="🌾" text="On-chain harvest record for transparent provenance and fair market pricing." accent={T.green} />
          <div className="bg-white rounded-2xl p-4 space-y-4" style={{ boxShadow: T.shadow.sm }}>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-500 block mb-1">Quantity (Qtl)</label>
                <input value={form.quantity} onChange={e => upd('quantity', e.target.value)} placeholder="e.g. 120" type="number"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" style={{ minHeight: 44 }} /></div>
              <div><label className="text-xs text-gray-500 block mb-1">Harvest Date</label>
                <input type="date" value={form.harvestDate} onChange={e => upd('harvestDate', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" style={{ minHeight: 44 }} /></div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-2">Quality Grade</label>
              {grades.map(g => (
                <button key={g} onClick={() => upd('grade', g)}
                  className="flex items-center gap-3 p-3 rounded-xl border-2 w-full text-left mb-2"
                  style={{ borderColor: form.grade === g ? T.gold : '#E5E7EB', backgroundColor: form.grade === g ? `${T.gold}08` : '#FAFAFA', minHeight: 44 }}>
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: form.grade === g ? T.goldDark : '#D1D5DB' }}>
                    {form.grade === g && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: T.goldDark }} />}
                  </div>
                  <span className="text-sm text-gray-700">{g}</span>
                </button>
              ))}
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-2">Packaging</label>
              <div className="grid grid-cols-2 gap-2">
                {packs.map(p => (
                  <button key={p} onClick={() => upd('packaging', p)}
                    className="px-3 py-2.5 rounded-xl text-xs border-2"
                    style={{ borderColor: form.packaging === p ? T.gold : '#E5E7EB', backgroundColor: form.packaging === p ? `${T.gold}08` : '#FAFAFA', minHeight: 40 }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            {form.commodity && (
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${T.blue}08` }}>
                <p className="text-xs text-gray-500">AI Market Price — {form.commodity.commodity}</p>
                <p className="text-base font-black mt-0.5" style={{ color: T.green }}>{aiPrice(form.commodity.fullName)}</p>
              </div>
            )}
          </div>
          <GoldBtn onClick={() => go(SCREENS.lot, { amt: R.harvest, why: 'Harvest Listed' })} disabled={!form.quantity}>Create Lot & Tokenize <ArrowRight className="w-5 h-5" /></GoldBtn>
          {!form.quantity && <GhostBtn onClick={() => go(SCREENS.lot)}>Skip — Enter Later →</GhostBtn>}
          <GhostBtn onClick={() => go(SCREENS.aiQuality)}>← Back to Quality Check</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── S16: LOT CREATION & TOKENIZE ─────────────────────
  const S16 = () => {
    const [minting, setMinting] = useState(false);
    const [minted, setMinted] = useState(!!form.lot);
    const lotId = form.lot || `L${Date.now().toString().slice(-6)}`;
    const nftHash = form.nft || `0x${Math.random().toString(16).slice(2, 18).toUpperCase()}`;
    const mint = () => {
      setMinting(true);
      setTimeout(() => { setMinting(false); setMinted(true); upd('lot', lotId); upd('nft', nftHash); addToks(R.tokenize, 'Lot Tokenized', 'Screen 16'); }, 3000);
    };
    return (
      <Wrap>
        <Hdr title="Lot Creation & Tokenize" n={SCREENS.lot} onBack={() => go(SCREENS.harvest)} sub="NFT-backed crop provenance" />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="🔗" text="Your crop lot becomes a tamper-proof NFT on blockchain — enabling transparent trade." accent={T.purple} />
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
            <h3 className="font-bold text-sm mb-3" style={{ color: T.blue, fontFamily: T.heading }}>Lot Summary</h3>
            {[
              { l: 'Commodity', v: form.commodity?.commodity || 'Wheat' },
              { l: 'Variety', v: form.commodity?.variety || 'HD2967' },
              { l: 'Quantity', v: `${form.quantity || '120'} Qtl` },
              { l: 'Grade', v: form.grade || 'A (Premium)' },
              { l: 'AI Quality Score', v: `${form.qualityScore || 87}/100` },
              { l: 'Activities Logged', v: `${form.activities?.length || 0} entries` },
              { l: 'Inputs Recorded', v: `${form.inputs?.length || 0} entries` },
            ].map(x => (
              <div key={x.l} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-400">{x.l}</span>
                <span className="text-xs font-semibold text-gray-700">{x.v}</span>
              </div>
            ))}
          </div>
          {!minted ? (
            <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: T.shadow.sm }}>
              {minting ? (
                <>
                  <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} transition={{ duration: 2, repeat: Infinity }}>
                    <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3" style={{ background: 'linear-gradient(135deg,#8B5CF6,#EC4899)' }}>
                      <Lock className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>
                  <p className="font-bold text-sm" style={{ color: T.blue }}>Minting NFT on Blockchain...</p>
                </>
              ) : (
                <>
                  <QrCode className="w-16 h-16 mx-auto mb-3 text-purple-400" />
                  <p className="text-sm font-bold mb-1" style={{ color: T.blue }}>Mint NFT Token</p>
                  <p className="text-xs text-gray-400 mb-4">Blockchain-backed, tamper-proof lot record</p>
                  <GoldBtn onClick={mint}><Lock className="w-5 h-5" /> Mint NFT Token <Chip amount={R.tokenize} /></GoldBtn>
                </>
              )}
            </div>
          ) : (
            <motion.div {...A.slideUp} className="bg-white rounded-2xl p-5 text-center" style={{ boxShadow: T.shadow.sm }}>
              <CheckCircle className="w-12 h-12 mx-auto mb-2" style={{ color: T.green }} />
              <h3 className="font-bold mb-1" style={{ color: T.blue }}>NFT Token Minted! 🎉</h3>
              <div className="space-y-2 text-left mt-3">
                <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#8B5CF615' }}>
                  <span className="text-xs text-gray-500">Lot ID</span>
                  <span className="text-xs font-mono font-bold text-purple-600 ml-auto">{lotId}</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#8B5CF615' }}>
                  <span className="text-xs text-gray-500">NFT Hash</span>
                  <span className="text-xs font-mono text-purple-500 ml-auto truncate">{nftHash}</span>
                </div>
              </div>
              <div className="mt-3 mx-auto w-20 h-20 bg-gray-900 rounded-xl flex items-center justify-center">
                <QrCode className="w-14 h-14 text-white" />
              </div>
            </motion.div>
          )}
          {minted
            ? <GoldBtn onClick={() => go(SCREENS.qrDocs)}>Manage QR & Documents <ArrowRight className="w-5 h-5" /></GoldBtn>
            : <GhostBtn onClick={() => go(SCREENS.qrDocs)}>Skip Minting — Continue →</GhostBtn>}
        </div>
      </Wrap>
    );
  };

  // ── S17: QR CODE & DOCUMENTS (NEW) ───────────────────
  const S17 = () => {
    const [activeTab, setActiveTab] = useState<'qr' | 'docs'>('qr');
    const docs = [
      { name: 'Khatauni / Land Record', status: 'uploaded', icon: '📄' },
      { name: 'Aadhaar Card', status: 'uploaded', icon: '🪪' },
      { name: 'Bank Passbook', status: 'uploaded', icon: '🏦' },
      { name: 'Quality Certificate (NABL)', status: 'pending', icon: '🔬' },
      { name: 'FSSAI Certificate', status: 'missing', icon: '🛡️' },
      { name: 'Warehouse Receipt', status: 'missing', icon: '🏭' },
    ];
    return (
      <Wrap>
        <Hdr title="QR Code & Documents" n={SCREENS.qrDocs} onBack={() => go(SCREENS.lot)} sub="Provenance tracking & records" />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <div className="flex gap-2 bg-white rounded-2xl p-1.5" style={{ boxShadow: T.shadow.sm }}>
            {(['qr', 'docs'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className="flex-1 py-2 rounded-xl text-xs font-bold capitalize"
                style={{ backgroundColor: activeTab === t ? T.gold : 'transparent', color: activeTab === t ? T.blue : '#9CA3AF', minHeight: 36 }}>
                {t === 'qr' ? '📱 QR Codes' : '📁 Documents'}
              </button>
            ))}
          </div>
          {activeTab === 'qr' ? (
            <motion.div {...A.fade} className="space-y-4">
              <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: T.shadow.sm }}>
                <h3 className="font-bold text-sm mb-2" style={{ color: T.blue, fontFamily: T.heading }}>Lot QR Code</h3>
                <div className="mx-auto w-36 h-36 bg-gray-900 rounded-2xl flex items-center justify-center mb-3">
                  <QrCode className="w-28 h-28 text-white" />
                </div>
                <p className="text-xs font-mono font-bold text-purple-600">{form.lot || 'L491823'}</p>
                <p className="text-xs text-gray-400 mt-1">Scan to verify provenance & ownership</p>
                <div className="flex gap-3 mt-4">
                  <motion.button {...A.tap} onClick={() => {}} className="flex-1 py-2.5 rounded-xl text-xs font-bold border-2" style={{ borderColor: T.blue, color: T.blue, minHeight: 40 }}>
                    <Download className="w-4 h-4 inline mr-1" /> Download
                  </motion.button>
                  <motion.button {...A.tap} onClick={() => {}} className="flex-1 py-2.5 rounded-xl text-xs font-bold border-2" style={{ borderColor: T.goldDark, color: T.goldDark, minHeight: 40 }}>
                    <Share2 className="w-4 h-4 inline mr-1" /> Share
                  </motion.button>
                </div>
              </div>
              <InfoBox icon="🔗" text="This QR encodes your complete lot provenance: farm → crop → quality → chain-of-custody." accent={T.purple} />
            </motion.div>
          ) : (
            <motion.div {...A.fade} className="space-y-3">
              {docs.map((d, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: T.shadow.sm }}>
                  <span className="text-2xl">{d.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-800">{d.name}</p>
                    <p className="text-xs" style={{ color: d.status === 'uploaded' ? T.green : d.status === 'pending' ? T.goldDark : T.red }}>
                      {d.status === 'uploaded' ? '✓ Uploaded' : d.status === 'pending' ? '⏳ Under review' : '⚠ Missing'}
                    </p>
                  </div>
                  {d.status !== 'uploaded' && (
                    <motion.button {...A.tap} onClick={() => {}}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold"
                      style={{ backgroundColor: `${T.gold}20`, color: T.goldDark, minHeight: 32 }}>
                      Upload
                    </motion.button>
                  )}
                </div>
              ))}
            </motion.div>
          )}
          <GoldBtn onClick={() => go(SCREENS.sampling)}>Proceed to Quality Sampling <ArrowRight className="w-5 h-5" /></GoldBtn>
        </div>
      </Wrap>
    );
  };

  // ── S18: SAMPLING & QUALITY CHECK ────────────────────
  const S18 = () => {
    const [requested, setRequested] = useState(form.samplingDone);
    const labs = [
      { name: 'NABL Certified Lab, Ludhiana', rating: '4.8★', price: '₹850', eta: '2 days' },
      { name: 'Govt. Quality Centre, Chandigarh', rating: '4.5★', price: '₹600', eta: '3 days' },
      { name: 'AgriTest Private, Delhi', rating: '4.7★', price: '₹1,100', eta: '1 day' },
    ];
    const [selLab, setSelLab] = useState(0);
    return (
      <Wrap>
        <Hdr title="Quality Sampling" n={SCREENS.sampling} onBack={() => go(SCREENS.qrDocs)} sub="Third-party lab certification" onDraft={() => {}} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="🔬" text="Third-party certificates boost buyer confidence and can raise prices by 5–15%." accent={T.green} />
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
            <h3 className="font-bold text-sm mb-3" style={{ color: T.blue, fontFamily: T.heading }}>Select Lab</h3>
            {labs.map((lab, i) => (
              <motion.button key={lab.name} {...A.tap} onClick={() => setSelLab(i)}
                className="w-full p-3 rounded-xl border-2 text-left mb-2"
                style={{ borderColor: selLab === i ? T.gold : '#E5E7EB', backgroundColor: selLab === i ? `${T.gold}08` : '#FAFAFA', minHeight: 64 }}>
                <div className="flex justify-between">
                  <div><p className="text-xs font-semibold text-gray-800">{lab.name}</p><p className="text-xs text-gray-400">{lab.rating} · {lab.eta}</p></div>
                  <span className="text-sm font-bold ml-2" style={{ color: T.blue }}>{lab.price}</span>
                </div>
              </motion.button>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
            <h3 className="font-bold text-sm mb-2" style={{ color: T.blue }}>Upload Existing Certificate</h3>
            <button className="w-full p-4 border-2 border-dashed rounded-xl flex items-center gap-3" style={{ borderColor: '#D1D5DB', minHeight: 56 }}>
              <Upload className="w-5 h-5 text-gray-400" />
              <div><p className="text-xs font-medium text-gray-600">PDF/JPG Certificate</p><p className="text-xs text-gray-400">NABL · AGMARK · FSSAI accepted</p></div>
            </button>
          </div>
          {requested && (
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: `${T.green}15` }}>
              <CheckCircle className="w-5 h-5" style={{ color: T.green }} />
              <p className="text-sm font-semibold" style={{ color: T.green }}>Request sent! Lab contacts you in 4 hours.</p>
            </div>
          )}
          {!requested ? (
            <>
              <GoldBtn onClick={() => { setRequested(true); upd('samplingDone', true); addToks(R.sampling, 'Sampling Requested', 'Screen 18'); }}>
                Request Lab Sampling <Chip amount={R.sampling} />
              </GoldBtn>
              <GhostBtn onClick={() => go(SCREENS.storage)}>Skip Sampling — Choose Storage →</GhostBtn>
            </>
          ) : (
            <GoldBtn onClick={() => go(SCREENS.storage)}>Choose Storage or Sell <ArrowRight className="w-5 h-5" /></GoldBtn>
          )}
        </div>
      </Wrap>
    );
  };

  // ── S19: STORAGE DECISION ─────────────────────────────
  const S19 = () => {
    const [dec, setDec] = useState(form.storageDecision || '');
    return (
      <Wrap>
        <Hdr title="Storage Decision" n={SCREENS.storage} onBack={() => go(SCREENS.sampling)} sub="Store now or proceed to sell?" onDraft={() => {}} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <motion.div className="p-4 rounded-2xl text-white" style={{ background: T.gradientBlue }}>
            <div className="flex items-center gap-2 mb-1"><Sparkles className="w-4 h-4 text-yellow-400" /><span className="text-xs font-semibold text-yellow-300 uppercase tracking-wider">Grok AI Recommendation</span></div>
            <p className="text-sm font-bold">📦 Store for 30–45 days</p>
            <p className="text-xs text-blue-200 mt-1">Prices expected to rise 12% post-season. Est. gain: ₹15,000+</p>
          </motion.div>
          <div className="space-y-3">
            {[{
              id: 'store', icon: '🏭', label: 'Store Now — Sell Later',
              desc: 'Secure govt. or private warehouse with full insurance. Sell at optimal price window.',
              pros: ['Better price potential', 'Insurance covered', 'Grade maintained'],
              color: T.blue, est: '₹2,40,000 est. (30 days)', badge: 'Recommended',
            }, {
              id: 'sell', icon: '💰', label: 'Sell Now',
              desc: 'Proceed to marketplace immediately. Quick cash, zero storage cost.',
              pros: ['Immediate payment', 'No storage cost', 'Zero waiting'],
              color: T.green, est: '₹2,12,500 current market', badge: null,
            }].map(opt => (
              <motion.button key={opt.id} {...A.tap} onClick={() => { setDec(opt.id); upd('storageDecision', opt.id); }}
                className="w-full p-4 rounded-2xl bg-white border-2 text-left"
                style={{ borderColor: dec === opt.id ? opt.color : 'transparent', boxShadow: T.shadow.sm }}>
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-3xl">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-sm" style={{ color: opt.color }}>{opt.label}</h3>
                      {opt.badge && <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${T.gold}30`, color: T.goldDark }}>{opt.badge}</span>}
                    </div>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-1">{opt.pros.map(p => <span key={p} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${opt.color}12`, color: opt.color }}>✓ {p}</span>)}</div>
                <p className="text-xs font-bold" style={{ color: opt.color }}>{opt.est}</p>
              </motion.button>
            ))}
          </div>
          <GoldBtn onClick={() => go(dec === 'store' ? SCREENS.warehouse : SCREENS.sellMethod)} disabled={!dec}>
            {dec === 'store' ? 'Book Warehouse Storage' : 'Choose Selling Method'} <ArrowRight className="w-5 h-5" />
          </GoldBtn>
          <GhostBtn onClick={() => go(SCREENS.sampling)}>← Back to Sampling</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── S20: WAREHOUSE FLOW (NEW) ─────────────────────────
  const S20 = () => {
    const [selWh, setSelWh] = useState<number | null>(null);
    const [booked, setBooked] = useState(false);
    const warehouses = [
      { name: 'CWC Warehouse, Ludhiana', type: 'Govt.', cap: '5,000 MT', rate: '₹18/qtl/month', temp: 'Ambient', insured: true },
      { name: 'Punjab Agro Cold Store', type: 'Private', cap: '2,000 MT', rate: '₹35/qtl/month', temp: '4°C', insured: true },
      { name: 'NAFED Warehouse, Amritsar', type: 'Govt.', cap: '8,000 MT', rate: '₹14/qtl/month', temp: 'Ambient', insured: true },
    ];
    const qty = parseInt(form.quantity || '120');
    const wh = selWh !== null ? warehouses[selWh] : null;
    const monthly = wh ? parseInt(wh.rate.replace(/[₹,/qtl\/month]/g, '')) * qty : 0;
    return (
      <Wrap>
        <Hdr title="Warehouse Storage" n={SCREENS.warehouse} onBack={() => go(SCREENS.storage)} sub="Select storage facility" onDraft={() => {}} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="🏭" text="Store with a TRADIE-verified warehouse. Your lot earns a Warehouse Receipt — pledge it for an instant loan." accent={T.blue} />
          <div className="space-y-3">
            {warehouses.map((w, i) => (
              <motion.button key={w.name} {...A.tap} onClick={() => setSelWh(i)}
                className="w-full p-4 rounded-2xl bg-white border-2 text-left"
                style={{ borderColor: selWh === i ? T.blue : 'transparent', boxShadow: T.shadow.sm }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-800">{w.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${T.blue}15`, color: T.blue }}>{w.type}</span>
                    </div>
                    <p className="text-xs text-gray-400">Cap: {w.cap} · Temp: {w.temp}</p>
                  </div>
                  <p className="text-sm font-black ml-2" style={{ color: T.green }}>{w.rate}</p>
                </div>
                <div className="flex gap-2">
                  {['📍 GPS', w.insured ? '🛡️ Insured' : '', '📄 Receipt'].filter(Boolean).map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${T.green}12`, color: T.green }}>{t}</span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
          {selWh !== null && (
            <motion.div {...A.slideUp} className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
              <h3 className="font-bold text-sm mb-3" style={{ color: T.blue, fontFamily: T.heading }}>Storage Cost Estimate</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${T.blue}08` }}>
                  <p className="text-base font-black" style={{ color: T.blue }}>₹{monthly.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-400">per month</p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${T.gold}10` }}>
                  <p className="text-base font-black" style={{ color: T.goldDark }}>₹{(monthly * 1.5).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-400">45 days</p>
                </div>
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${T.green}10` }}>
                  <p className="text-base font-black" style={{ color: T.green }}>+12%</p>
                  <p className="text-xs text-gray-400">expected gain</p>
                </div>
              </div>
              <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: `${T.purple}10` }}>
                <p className="text-xs font-semibold" style={{ color: T.purple }}>💡 Pledge option: Get ₹{Math.round(parseInt(form.quantity || '120') * 2100 * 0.7).toLocaleString('en-IN')} loan against this receipt</p>
              </div>
            </motion.div>
          )}
          {!booked ? (
            <GoldBtn onClick={() => { setBooked(true); setTimeout(() => go(SCREENS.sellMethod), 1200); }} disabled={selWh === null}>
              <Warehouse className="w-5 h-5" /> Book Warehouse Storage
            </GoldBtn>
          ) : (
            <motion.div {...A.slideUp} className="space-y-3">
              <div className="flex items-center gap-2 p-4 rounded-xl" style={{ backgroundColor: `${T.green}15` }}>
                <CheckCircle className="w-5 h-5" style={{ color: T.green }} />
                <span className="text-sm font-bold" style={{ color: T.green }}>Booked! Warehouse Receipt being generated...</span>
              </div>
              <GoldBtn onClick={() => go(SCREENS.sellMethod)}>
                Choose Selling Method <ArrowRight className="w-5 h-5" />
              </GoldBtn>
            </motion.div>
          )}
          <GhostBtn onClick={() => go(SCREENS.storage)}>← Back to Decision</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── S21: SELL METHOD ──────────────────────────────────
  const S21 = () => {
    const [sel, setSel] = useState(form.sellMethod || '');
    return (
      <Wrap>
        <Hdr title="Choose Selling Method" n={SCREENS.sellMethod} onBack={() => go(form.storageDecision === 'store' ? SCREENS.warehouse : SCREENS.storage)} sub="6 ways to sell your produce" onDraft={() => {}} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-3">
          <InfoBox icon="💡" text="Each method suits a different goal. Auction gives best price; Farm Gate gives fastest payment." />
          {SELL_METHODS.map((m, i) => (
            <motion.button key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              {...A.tap} onClick={() => { setSel(m.id); upd('sellMethod', m.id); }}
              className="w-full p-4 rounded-2xl bg-white border-2 text-left"
              style={{ borderColor: sel === m.id ? T.gold : 'transparent', boxShadow: T.shadow.sm, minHeight: 72 }}>
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0">{m.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-gray-800">{m.label}</p>
                    {m.badge && <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${T.gold}20`, color: T.goldDark }}>{m.badge}</span>}
                  </div>
                  <p className="text-xs text-gray-500">{m.desc}</p>
                </div>
                {sel === m.id && <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: T.gold }} />}
              </div>
            </motion.button>
          ))}
          <GoldBtn onClick={() => go(SCREENS.marketplace)} disabled={!sel}>Proceed to Marketplace <ArrowRight className="w-5 h-5" /></GoldBtn>
          <GhostBtn onClick={() => go(SCREENS.storage)}>← Back to Storage Decision</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── S22: MARKETPLACE & AUCTION ────────────────────────
  const S22 = () => {
    const [activeBid, setActiveBid] = useState<number | null>(null);
    const bids = [
      { buyer: 'Agri Foods Pvt Ltd', rating: '4.8★', offer: '₹2,150/qtl', qty: 80, verified: true, loc: 'Ludhiana' },
      { buyer: 'GreenCrop Traders', rating: '4.5★', offer: '₹2,100/qtl', qty: 120, verified: true, loc: 'Amritsar' },
      { buyer: 'FoodPro Exports', rating: '4.7★', offer: '₹2,180/qtl', qty: 50, verified: false, loc: 'Delhi' },
    ];
    return (
      <Wrap>
        <Hdr title="Marketplace & Auction" n={SCREENS.marketplace} onBack={() => go(SCREENS.sellMethod)} sub="Live buyer bids for your lot" />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4" style={{ boxShadow: T.shadow.sm }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${T.blue}15` }}>
              <Package className="w-6 h-6" style={{ color: T.blue }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: T.blue }}>{form.lot || 'L491823'}</p>
              <p className="text-xs text-gray-400">{form.commodity?.commodity || 'Wheat'} · {form.quantity || '120'} Qtl · Grade {(form.grade || 'A').charAt(0)}</p>
            </div>
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: T.green }} />
            </motion.div>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold" style={{ color: T.blue, fontFamily: T.heading }}>Live Buyer Bids</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: `${T.green}20`, color: T.green }}>{bids.length} active</span>
          </div>
          {bids.map((bid, i) => (
            <motion.div key={bid.buyer} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-4 border-2"
              style={{ borderColor: activeBid === i ? T.gold : 'transparent', boxShadow: T.shadow.sm }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-gray-800">{bid.buyer}</p>
                    {bid.verified && <CheckCircle className="w-3.5 h-3.5" style={{ color: T.blue }} />}
                  </div>
                  <p className="text-xs text-gray-400">{bid.rating} · {bid.loc}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-black" style={{ color: T.green }}>{bid.offer}</p>
                  <p className="text-xs text-gray-400">{bid.qty} Qtl needed</p>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button {...A.tap} onClick={() => { setActiveBid(i); upd('buyer', bid.buyer); upd('saleAmount', parseInt(bid.offer.replace(/[^0-9]/g, '')) * parseInt(form.quantity || '120')); }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold" style={{ background: T.gradientGold, color: T.blue, minHeight: 40 }}>Accept</motion.button>
                <motion.button {...A.tap} onClick={() => go(SCREENS.negotiate)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-gray-200" style={{ color: T.blue, minHeight: 40, backgroundColor: '#F9FAFB' }}>Negotiate</motion.button>
                <motion.button {...A.tap} className="px-3 py-2.5 rounded-xl border border-gray-200" style={{ minHeight: 40, backgroundColor: '#F9FAFB' }}>
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
            </motion.div>
          ))}
          {activeBid !== null && <GoldBtn onClick={() => go(SCREENS.negotiate)}>Confirm Sale with {bids[activeBid].buyer} <ArrowRight className="w-5 h-5" /></GoldBtn>}
          <GhostBtn onClick={() => go(SCREENS.negotiate)}>Open Negotiation Chat</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── S23: NEGOTIATION ──────────────────────────────────
  const S23 = () => {
    const [msgs, setMsgs] = useState([
      { from: 'buyer', text: `Hi! I can offer ₹2,100/qtl for your ${form.commodity?.commodity || 'Wheat'} lot.`, time: '10:01 AM' },
      { from: 'you', text: 'Grade A, AI score 87/100. Minimum ₹2,200/qtl.', time: '10:03 AM' },
      { from: 'buyer', text: 'I can go up to ₹2,150/qtl. Final offer.', time: '10:05 AM' },
    ]);
    const [msg, setMsg] = useState('');
    const [counter, setCounter] = useState('');
    const send = () => {
      if (!msg.trim()) return;
      setMsgs(p => [...p, { from: 'you', text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setMsg('');
    };
    const accept = () => { upd('buyer', 'GreenCrop Traders'); upd('saleAmount', 2150 * parseInt(form.quantity || '120')); go(SCREENS.saleConfirm); };
    return (
      <Wrap>
        <Hdr title="Negotiation" n={SCREENS.negotiate} onBack={() => go(SCREENS.marketplace)} sub="Counter-offer & live chat" />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: T.shadow.sm }}>
            <div className="p-3 border-b border-gray-100 flex items-center gap-3" style={{ backgroundColor: `${T.blue}06` }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: T.gradientBlue }}>GC</div>
              <div><p className="text-xs font-bold text-gray-800">GreenCrop Traders</p><p className="text-xs text-gray-400">4.5★ · Verified Buyer</p></div>
              <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${T.green}20`, color: T.green }}>Online</span>
            </div>
            <div className="p-4 space-y-3" style={{ maxHeight: 250, overflowY: 'auto' }}>
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[78%] p-3 rounded-2xl"
                    style={{ backgroundColor: m.from === 'you' ? T.gold : '#F3F4F6', borderRadius: m.from === 'you' ? '16px 16px 4px 16px' : '16px 16px 16px 4px' }}>
                    <p className="text-xs" style={{ color: m.from === 'you' ? T.blue : T.grayDark }}>{m.text}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9CA3AF', fontSize: 10 }}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-100 flex gap-2">
              <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Type message..." className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none" style={{ minHeight: 40 }} />
              <motion.button {...A.tap} onClick={send} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: T.gradientGold, minWidth: 40 }}>
                <Send className="w-4 h-4" style={{ color: T.blue }} />
              </motion.button>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
            <h3 className="font-bold text-sm mb-3" style={{ color: T.blue, fontFamily: T.heading }}>Counter Offer</h3>
            <div className="flex gap-2 mb-3">
              <input value={counter} onChange={e => setCounter(e.target.value)} type="number" placeholder="Your price (₹/qtl)"
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" style={{ minHeight: 44 }} />
              <motion.button {...A.tap} disabled={!counter}
                onClick={() => { setMsgs(p => [...p, { from: 'you', text: `Counter: ₹${counter}/qtl for ${form.quantity || '120'} qtl`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]); setCounter(''); }}
                className="px-4 rounded-xl text-xs font-bold self-end mb-0.5"
                style={{ background: counter ? T.gradientGold : '#E5E7EB', color: counter ? T.blue : '#9CA3AF', minHeight: 44 }}>
                Send
              </motion.button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: `${T.green}10` }}>
              <div><p className="text-xs text-gray-500">Best Offer</p><p className="text-base font-black" style={{ color: T.green }}>₹2,150/qtl</p></div>
              <motion.button {...A.tap} onClick={accept} className="px-4 py-2 rounded-xl text-xs font-bold" style={{ background: T.gradientGreen, color: T.white, minHeight: 40 }}>Accept</motion.button>
            </div>
          </div>
          <GoldBtn onClick={accept}>Proceed to Sale Confirmation <ArrowRight className="w-5 h-5" /></GoldBtn>
        </div>
      </Wrap>
    );
  };

  // ── S24: SALE CONFIRMATION & OTP ─────────────────────
  const S24 = () => {
    const [otp, setOtp] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [sent, setSent] = useState(false);
    const [done, setDone] = useState(false);
    const gross = form.saleAmount || 258000;
    const comm = Math.round(gross * 0.02);
    const plat = Math.round(gross * 0.005);
    const net = gross - comm - plat;
    return (
      <Wrap>
        <Hdr title="Sale Confirmation" n={SCREENS.saleConfirm} onBack={() => go(SCREENS.negotiate)} sub="OTP-secured transaction" />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
            <h3 className="font-bold text-sm mb-3" style={{ color: T.blue, fontFamily: T.heading }}>Order Summary</h3>
            {[
              { l: 'Commodity', v: form.commodity?.commodity || 'Wheat' },
              { l: 'Buyer', v: form.buyer || 'GreenCrop Traders' },
              { l: 'Gross Amount', v: `₹${gross.toLocaleString('en-IN')}`, c: T.green },
              { l: 'Commission (2%)', v: `-₹${comm.toLocaleString('en-IN')}`, c: T.red },
              { l: 'Platform Fee (0.5%)', v: `-₹${plat.toLocaleString('en-IN')}`, c: T.red },
            ].map(x => (
              <div key={x.l} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-400">{x.l}</span>
                <span className="text-xs font-semibold" style={{ color: (x as any).c || T.grayDark }}>{x.v}</span>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t-2 border-gray-100 flex justify-between">
              <span className="text-sm font-bold" style={{ color: T.blue }}>Net Payout</span>
              <span className="text-lg font-black" style={{ color: T.green }}>₹{net.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
            <h3 className="font-bold text-sm mb-2" style={{ color: T.blue }}>OTP Verification</h3>
            <p className="text-xs text-gray-400 mb-3">Sent to +91 98765 XXXXX</p>
            {!sent ? (
              <motion.button {...A.tap} onClick={() => setSent(true)} className="w-full py-3 rounded-xl text-sm font-bold border-2 mb-3" style={{ borderColor: T.gold, color: T.goldDark, minHeight: 44 }}>Send OTP</motion.button>
            ) : (
              <div className="flex gap-2 mb-3">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <input key={i} maxLength={1} value={otp[i] || ''} onChange={e => { const v = otp.split(''); v[i] = e.target.value; setOtp(v.join('')); }}
                    className="w-10 h-12 text-center rounded-xl border-2 text-base font-bold focus:outline-none"
                    style={{ borderColor: otp[i] ? T.gold : '#E5E7EB', color: T.blue }} />
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setAgreed(!agreed)} className="flex items-start gap-3 p-3 rounded-xl bg-white w-full text-left" style={{ boxShadow: T.shadow.sm, minHeight: 56 }}>
            <div className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ borderColor: agreed ? T.gold : '#D1D5DB', backgroundColor: agreed ? T.gold : 'white' }}>
              {agreed && <Check className="w-3 h-3 text-white" />}
            </div>
            <p className="text-xs text-gray-500">I agree to TRADIE Trade Terms & confirm sale details are correct.</p>
          </button>
          {!done ? (
            <>
              <GoldBtn onClick={() => { setDone(true); addToks(R.trade, 'Sale Confirmed', 'Screen 24'); setTimeout(() => go(SCREENS.agent), 900); }}
                disabled={!agreed}>
                <Lock className="w-5 h-5" /> Confirm Sale
              </GoldBtn>
              {!agreed && <p className="text-center text-xs text-gray-400">Please accept the terms above to confirm</p>}
            </>
          ) : (
            <motion.div {...A.slideUp} className="space-y-3">
              <div className="flex items-center gap-2 p-4 rounded-xl" style={{ backgroundColor: `${T.green}15` }}>
                <CheckCircle className="w-5 h-5" style={{ color: T.green }} />
                <span className="text-sm font-bold" style={{ color: T.green }}>Sale Confirmed! Setting up agent...</span>
              </div>
              <GoldBtn onClick={() => go(SCREENS.agent)}>
                Continue to Agent Setup <ArrowRight className="w-5 h-5" />
              </GoldBtn>
            </motion.div>
          )}
        </div>
      </Wrap>
    );
  };

  // ── S25: COMMISSION AGENT ─────────────────────────────
  const S25 = () => {
    const agents = [
      { name: 'Ramesh Kumar Arya', market: 'Ludhiana Mandi', rating: '4.8★', trades: '340+', comm: '2%' },
      { name: 'Suresh Agri Commission', market: 'Amritsar APMC', rating: '4.6★', trades: '220+', comm: '2.5%' },
      { name: 'Punjab Commodities', market: 'Patiala Market', rating: '4.7★', trades: '410+', comm: '1.8%' },
    ];
    const [sel, setSel] = useState(0);
    return (
      <Wrap>
        <Hdr title="Commission Agent" n={SCREENS.agent} onBack={() => go(SCREENS.saleConfirm)} sub="Agent handles documentation & payment" onDraft={() => {}} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="🤝" text="Choose a registered TRADIE agent to manage weighbridge, documentation, and payment coordination." accent={T.goldDark} />
          <div className="space-y-3">
            {agents.map((a, i) => (
              <motion.button key={a.name} {...A.tap} onClick={() => { setSel(i); upd('agentName', a.name); }}
                className="w-full p-4 rounded-2xl bg-white border-2 text-left"
                style={{ borderColor: sel === i ? T.gold : 'transparent', boxShadow: T.shadow.sm, minHeight: 84 }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2"><p className="text-sm font-bold text-gray-800">{a.name}</p><CheckCircle className="w-3.5 h-3.5" style={{ color: T.blue }} /></div>
                    <p className="text-xs text-gray-400">{a.market} · {a.rating} · {a.trades} trades</p>
                  </div>
                  <span className="text-sm font-black" style={{ color: T.blue }}>{a.comm}</span>
                </div>
                {sel === i && <div className="mt-2 flex gap-2">{['Licensed', 'Insured', 'GPS'].map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${T.blue}12`, color: T.blue }}>{t}</span>)}</div>}
              </motion.button>
            ))}
          </div>
          <GoldBtn onClick={() => go(SCREENS.transport)}>Confirm Agent & Arrange Transport <ArrowRight className="w-5 h-5" /></GoldBtn>
          <GhostBtn onClick={() => go(SCREENS.transport)}>Skip — Self Transport</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── S26: LOGISTICS & TRANSPORT ────────────────────────
  const S26 = () => {
    const [sel, setSel] = useState<number | null>(null);
    const [booked, setBooked] = useState(false);
    const opts = [
      { provider: 'RapidAgri Logistics', vehicle: '10T Truck', price: '₹8,500', eta: 'Tomorrow 8 AM', rating: '4.7★' },
      { provider: 'FreshLink Transport', vehicle: '5T Mini Truck', price: '₹5,200', eta: 'Today 6 PM', rating: '4.5★' },
      { provider: 'ColdChain Pro', vehicle: 'Refrigerated 8T', price: '₹14,000', eta: 'Tomorrow 10 AM', rating: '4.8★' },
    ];
    return (
      <Wrap>
        <Hdr title="Logistics & Transport" n={SCREENS.transport} onBack={() => go(SCREENS.agent)} sub="Farm to buyer logistics" onDraft={() => {}} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="🚛" text="TRADIE-verified transporters. GPS-tracked, insured, digital e-waybill included." accent={T.green} />
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: T.green }} />
                <div className="w-0.5 h-8 bg-gray-200 my-1" />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: T.blue }} />
              </div>
              <div className="flex flex-col gap-5">
                <div><p className="text-xs font-bold text-gray-700">From: Your Farm</p><p className="text-xs text-gray-400">Village Alipur, Punjab</p></div>
                <div><p className="text-xs font-bold text-gray-700">To: {form.buyer || 'GreenCrop Traders'}</p><p className="text-xs text-gray-400">Amritsar</p></div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {opts.map((opt, i) => (
              <motion.button key={opt.provider} {...A.tap} onClick={() => setSel(i)}
                className="w-full p-4 rounded-2xl bg-white border-2 text-left"
                style={{ borderColor: sel === i ? T.gold : 'transparent', boxShadow: T.shadow.sm, minHeight: 80 }}>
                <div className="flex justify-between mb-1">
                  <div><p className="text-sm font-bold text-gray-800">{opt.provider}</p><p className="text-xs text-gray-400">{opt.rating} · {opt.vehicle}</p></div>
                  <div className="text-right"><p className="text-sm font-black" style={{ color: T.blue }}>{opt.price}</p><p className="text-xs text-gray-400">{opt.eta}</p></div>
                </div>
                <div className="flex gap-2">{['📍 GPS', '🛡️ Insured', '📄 e-Waybill'].map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${T.green}12`, color: T.green }}>{t}</span>)}</div>
              </motion.button>
            ))}
          </div>
          {!booked ? (
            <>
              <GoldBtn onClick={() => { setBooked(true); upd('transport', sel !== null ? opts[sel] : null); setTimeout(() => go(SCREENS.delivery, { amt: R.logistics, why: 'Transport Booked' }), 900); }} disabled={sel === null}>
                <Truck className="w-5 h-5" /> Book Transport
              </GoldBtn>
              {sel === null && <GhostBtn onClick={() => go(SCREENS.delivery)}>Skip — Arrange Separately →</GhostBtn>}
            </>
          ) : (
            <motion.div {...A.slideUp} className="space-y-3">
              <div className="flex items-center gap-2 p-4 rounded-xl" style={{ backgroundColor: `${T.green}15` }}>
                <CheckCircle className="w-5 h-5" style={{ color: T.green }} />
                <span className="text-sm font-bold" style={{ color: T.green }}>Transport booked! Tracking active.</span>
              </div>
              <GoldBtn onClick={() => go(SCREENS.delivery, { amt: R.logistics, why: 'Transport Booked' })}>
                <Truck className="w-5 h-5" /> Track Delivery <ArrowRight className="w-5 h-5" />
              </GoldBtn>
            </motion.div>
          )}
        </div>
      </Wrap>
    );
  };

  // ── S27: DELIVERY & GPS ───────────────────────────────
  const S27 = () => {
    const steps = [
      { label: 'Loaded at Farm', done: true, time: 'Today 7:30 AM' },
      { label: 'In Transit', done: true, time: 'Today 9:00 AM', active: true },
      { label: 'Arrived at Destination', done: false, time: 'Est. 11:30 AM' },
      { label: 'Buyer Inspection', done: false, time: 'Pending' },
      { label: 'Quality Confirmed', done: false, time: 'Pending' },
    ];
    return (
      <Wrap>
        <Hdr title="Delivery Tracking" n={SCREENS.delivery} onBack={() => go(SCREENS.transport)} sub="Real-time GPS shipment status" />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <motion.div className="p-4 rounded-2xl text-white" style={{ background: T.gradientBlue }}>
            <div className="flex items-center gap-3">
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Truck className="w-8 h-8 text-yellow-400" />
              </motion.div>
              <div><p className="text-xs text-blue-200 uppercase tracking-wider">Live Status</p><p className="text-sm font-bold">In Transit — 23 km to destination</p><p className="text-xs text-blue-200">ETA: 11:30 AM today</p></div>
            </div>
          </motion.div>
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
            <h3 className="font-bold text-sm mb-4" style={{ color: T.blue, fontFamily: T.heading }}>Shipment Timeline</h3>
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-start gap-3 mb-3 last:mb-0">
                <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: step.done ? T.green : (step as any).active ? T.gold : '#E5E7EB' }}>
                    {step.done ? <Check className="w-3 h-3 text-white" /> :
                      (step as any).active ? <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 rounded-full bg-white" /> :
                        <div className="w-2 h-2 rounded-full bg-gray-300" />}
                  </div>
                  {i < steps.length - 1 && <div className="w-0.5 h-4 mt-1" style={{ backgroundColor: step.done ? T.green : '#E5E7EB' }} />}
                </div>
                <div><p className="text-xs font-semibold" style={{ color: step.done ? T.green : (step as any).active ? T.goldDark : '#9CA3AF' }}>{step.label}</p><p className="text-xs text-gray-400">{step.time}</p></div>
              </div>
            ))}
          </div>
          <GoldBtn onClick={() => go(SCREENS.buyerAccept, { amt: R.delivery, why: 'Delivery Tracked' })}>Confirm Delivery & Buyer Acceptance <ArrowRight className="w-5 h-5" /></GoldBtn>
        </div>
      </Wrap>
    );
  };

  // ── S28: BUYER ACCEPTANCE ─────────────────────────────
  const S28 = () => {
    const [scanned, setScanned] = useState(false);
    const [accepted, setAccepted] = useState(false);
    return (
      <Wrap>
        <Hdr title="Buyer Acceptance" n={SCREENS.buyerAccept} onBack={() => go(SCREENS.delivery)} sub="QR-verified delivery confirmation" />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="✅" text="Buyer scans your lot QR to confirm receipt. This triggers payment release from TRADIE Escrow." accent={T.green} />
          <div className="bg-white rounded-2xl p-6 text-center" style={{ boxShadow: T.shadow.sm }}>
            <div className="mx-auto w-28 h-28 bg-gray-900 rounded-2xl flex items-center justify-center mb-3"><QrCode className="w-20 h-20 text-white" /></div>
            <p className="text-xs text-gray-400">Lot ID: {form.lot || 'L491823'}</p>
          </div>
          {!scanned ? (
            <GoldBtn onClick={() => setScanned(true)}>Simulate Buyer QR Scan</GoldBtn>
          ) : !accepted ? (
            <motion.div {...A.slideUp} className="space-y-4">
              <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
                <h3 className="font-bold text-sm mb-3" style={{ color: T.blue }}>Weighbridge Confirmation</h3>
                {[['Actual Weight', `${form.quantity || '120'} Qtl`], ['Grade', form.grade || 'A (Premium)'], ['Moisture', '12.5%'], ['Condition', 'Acceptable ✅']].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-400">{l}</span>
                    <span className="text-xs font-semibold text-gray-700">{v}</span>
                  </div>
                ))}
              </div>
              <GoldBtn onClick={() => { setAccepted(true); setTimeout(() => go(SCREENS.settlement), 800); }}>
                <CheckCircle className="w-5 h-5" /> Confirm Acceptance & Release Payment
              </GoldBtn>
            </motion.div>
          ) : (
            <motion.div {...A.slideUp} className="space-y-3">
              <div className="flex items-center gap-2 p-4 rounded-xl" style={{ backgroundColor: `${T.green}15` }}>
                <CheckCircle className="w-5 h-5" style={{ color: T.green }} />
                <span className="text-sm font-bold" style={{ color: T.green }}>Accepted! Processing Escrow payment...</span>
              </div>
              <GoldBtn onClick={() => go(SCREENS.settlement)}>
                <CreditCard className="w-5 h-5" /> Proceed to Settlement <ArrowRight className="w-5 h-5" />
              </GoldBtn>
            </motion.div>
          )}
        </div>
      </Wrap>
    );
  };

  // ── S29: SETTLEMENT & PAYMENT ─────────────────────────
  const S29 = () => {
    const [done, setDone] = useState(form.paymentDone);
    const gross = form.saleAmount || 258000;
    const comm = Math.round(gross * 0.02);
    const plat = Math.round(gross * 0.005);
    const transport = 8500;
    const net = gross - comm - plat - transport;
    return (
      <Wrap>
        <Hdr title="Settlement & Payment" n={SCREENS.settlement} onBack={() => go(SCREENS.buyerAccept)} sub="TRADIE Escrow release" />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <InfoBox icon="🏦" text="TRADIE Escrow securely releases payment after buyer acceptance and quality confirmation." accent={T.green} />
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
            <h3 className="font-bold text-sm mb-3" style={{ color: T.blue, fontFamily: T.heading }}>Payment Breakdown</h3>
            {[{ l: 'Gross Sale', v: `₹${gross.toLocaleString('en-IN')}`, c: T.green }, { l: 'Commission (2%)', v: `-₹${comm.toLocaleString('en-IN')}`, c: T.red }, { l: 'Platform Fee (0.5%)', v: `-₹${plat.toLocaleString('en-IN')}`, c: T.red }, { l: 'Transport', v: `-₹${transport.toLocaleString('en-IN')}`, c: T.red }].map(x => (
              <div key={x.l} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-500">{x.l}</span>
                <span className="text-xs font-bold" style={{ color: x.c }}>{x.v}</span>
              </div>
            ))}
            <div className="mt-4 p-4 rounded-2xl text-center" style={{ background: `${T.green}12`, border: `1px solid ${T.green}30` }}>
              <p className="text-xs text-gray-500 mb-1">Net Payout to Your Bank</p>
              <p className="text-3xl font-black" style={{ color: T.green }}>₹{net.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-400 mt-1">Direct IMPS · 2–4 hours</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
            {[['Account Name', 'Rajesh Kumar'], ['Account No.', '•••• •••• 4521'], ['IFSC', 'SBI0001234'], ['Bank', 'SBI, Ludhiana']].map(([l, v]) => (
              <div key={l} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-400">{l}</span>
                <span className="text-xs font-semibold text-gray-700">{v}</span>
              </div>
            ))}
          </div>
          {!done ? (
            <GoldBtn onClick={() => { setDone(true); upd('paymentDone', true); addToks(R.payment, 'Payment Received', 'Screen 29'); setTimeout(() => go(SCREENS.ledger), 1000); }}>
              <CreditCard className="w-5 h-5" /> Confirm & Receive Payment <Chip amount={R.payment} />
            </GoldBtn>
          ) : (
            <motion.div {...A.slideUp} className="space-y-3">
              <div className="text-center p-4 rounded-xl" style={{ backgroundColor: `${T.green}15` }}>
                <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: T.green }} />
                <p className="text-sm font-bold" style={{ color: T.green }}>Payment processing! Arrives in 2–4 hours.</p>
              </div>
              <GoldBtn onClick={() => go(SCREENS.ledger)}>
                <BookOpen className="w-5 h-5" /> View Ledger & Reports <ArrowRight className="w-5 h-5" />
              </GoldBtn>
            </motion.div>
          )}
        </div>
      </Wrap>
    );
  };

  // ── S30: PRODUCER LEDGER ──────────────────────────────
  const S30 = () => {
    const entries = [
      { date: '04 Aug', desc: 'Sale Proceeds — Wheat Lot L491823', cr: (form.saleAmount || 258000) - Math.round((form.saleAmount || 258000) * 0.025) - 8500, dr: null },
      { date: '02 Aug', desc: 'AgriTest Lab — Quality Sampling', cr: null, dr: 850 },
      { date: '30 Jul', desc: 'RapidAgri Transport', cr: null, dr: 8500 },
      { date: '28 Jul', desc: 'Fertilizer — DAP 50kg', cr: null, dr: 1400 },
      { date: '25 Jul', desc: 'Pesticide — Chlorpyrifos', cr: null, dr: 780 },
      { date: '20 Jul', desc: 'Irrigation Service', cr: null, dr: 2200 },
      { date: '15 Jul', desc: 'Seed Purchase — HD2967', cr: null, dr: 1800 },
    ];
    const totalCr = entries.reduce((s, e) => s + (e.cr || 0), 0);
    const totalDr = entries.reduce((s, e) => s + (e.dr || 0), 0);
    return (
      <Wrap>
        <Hdr title="Producer Ledger" n={SCREENS.ledger} onBack={() => go(SCREENS.settlement)} sub="Season financial record" />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: T.shadow.sm }}>
              <TrendingUp className="w-5 h-5 mx-auto mb-1" style={{ color: T.green }} />
              <p className="text-xs text-gray-400">Total Income</p>
              <p className="text-lg font-black" style={{ color: T.green }}>₹{totalCr.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center" style={{ boxShadow: T.shadow.sm }}>
              <TrendingDown className="w-5 h-5 mx-auto mb-1" style={{ color: T.red }} />
              <p className="text-xs text-gray-400">Total Expenses</p>
              <p className="text-lg font-black" style={{ color: T.red }}>₹{totalDr.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm, border: `2px solid ${T.green}30` }}>
            <p className="text-xs text-gray-400 mb-1">Net Profit This Season</p>
            <p className="text-2xl font-black" style={{ color: T.green }}>₹{(totalCr - totalDr).toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-400 mt-1">{form.quantity || '120'} Qtl {form.commodity?.commodity || 'Wheat'}</p>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: T.shadow.sm }}>
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-sm" style={{ color: T.blue, fontFamily: T.heading }}>Transactions</h3>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${T.green}15`, color: T.green }}>CR</span>
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${T.red}15`, color: T.red }}>DR</span>
              </div>
            </div>
            {entries.map((e, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
                <div className="text-xs text-gray-400 flex-shrink-0 w-12">{e.date}</div>
                <p className="text-xs text-gray-600 flex-1">{e.desc}</p>
                <span className="text-xs font-bold flex-shrink-0" style={{ color: e.cr ? T.green : T.red }}>
                  {e.cr ? `+₹${e.cr.toLocaleString('en-IN')}` : `-₹${e.dr?.toLocaleString('en-IN')}`}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <motion.button {...A.tap} onClick={() => {}} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold" style={{ borderColor: T.blue, color: T.blue, minHeight: 48 }}>
              <Download className="w-4 h-4" /> PDF
            </motion.button>
            <motion.button {...A.tap} onClick={() => {}} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-bold" style={{ borderColor: T.goldDark, color: T.goldDark, minHeight: 48 }}>
              <Share2 className="w-4 h-4" /> Share
            </motion.button>
          </div>
          <GoldBtn onClick={() => go(SCREENS.reports)}>View Reports & Analytics <ArrowRight className="w-5 h-5" /></GoldBtn>
        </div>
      </Wrap>
    );
  };

  // ── S31: REPORTS & ANALYTICS (NEW) ───────────────────
  const S31 = () => {
    const [tab, setTab] = useState<'reports' | 'history' | 'feedback'>('reports');
    const [rating, setRating] = useState(0);
    const [fbText, setFbText] = useState('');
    const [submitted, setSubmitted] = useState(false);
    return (
      <Wrap>
        <Hdr title="Reports & Analytics" n={SCREENS.reports} onBack={() => go(SCREENS.ledger)} sub="Season summary & insights" />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <WCard wallet={wallet} onTap={() => {}} />
          <div className="flex gap-2 bg-white rounded-2xl p-1.5" style={{ boxShadow: T.shadow.sm }}>
            {(['reports', 'history', 'feedback'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-2 rounded-xl text-xs font-bold capitalize"
                style={{ backgroundColor: tab === t ? T.gold : 'transparent', color: tab === t ? T.blue : '#9CA3AF', minHeight: 36 }}>
                {t === 'reports' ? '📊 Reports' : t === 'history' ? '📋 History' : '⭐ Feedback'}
              </button>
            ))}
          </div>
          {tab === 'reports' && (
            <motion.div {...A.fade} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[{ l: 'Revenue', v: `₹${(form.saleAmount || 258000).toLocaleString('en-IN')}`, icon: DollarSign, color: T.green }, { l: 'Net Profit', v: `₹${((form.saleAmount || 258000) - 13330).toLocaleString('en-IN')}`, icon: TrendingUp, color: T.blue }, { l: 'Qty Sold', v: `${form.quantity || 120} Qtl`, icon: Package, color: T.goldDark }, { l: 'Tokens', v: `${wallet.balance} TT`, icon: Coins, color: T.purple }].map(x => (
                  <div key={x.l} className="bg-white rounded-2xl p-3 text-center" style={{ boxShadow: T.shadow.sm }}>
                    <x.icon className="w-5 h-5 mx-auto mb-1" style={{ color: x.color }} />
                    <p className="text-base font-black" style={{ color: T.blue }}>{x.v}</p>
                    <p className="text-xs text-gray-400">{x.l}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm" style={{ color: T.blue, fontFamily: T.heading }}>Cost Breakdown</h3>
                  <BarChart2 className="w-4 h-4" style={{ color: T.grayMid }} />
                </div>
                {[{ l: 'Seeds & Inputs', v: 3980, pct: 24 }, { l: 'Services', v: 2200, pct: 13 }, { l: 'Transport', v: 8500, pct: 51 }, { l: 'Lab & Testing', v: 850, pct: 5 }, { l: 'Commission', v: 5160, pct: 31 }].map(x => (
                  <div key={x.l} className="mb-2">
                    <div className="flex justify-between mb-0.5"><span className="text-xs text-gray-500">{x.l}</span><span className="text-xs font-semibold text-gray-700">₹{x.v.toLocaleString('en-IN')}</span></div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${x.pct}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ background: T.gradientGold }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
                <h3 className="font-bold text-sm mb-3" style={{ color: T.blue, fontFamily: T.heading }}>Achievements</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[{ icon: '🌾', l: 'First Crop' }, { icon: '🔗', l: 'Chain Pioneer' }, { icon: '💰', l: 'Trade Master' }, { icon: '⭐', l: 'Quality Star' }].map(a => (
                    <div key={a.l} className="p-3 rounded-xl text-center" style={{ backgroundColor: `${T.gold}12` }}>
                      <span className="text-2xl">{a.icon}</span>
                      <p className="text-xs font-bold mt-1 text-gray-700">{a.l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <GoldBtn onClick={() => {}}><Download className="w-5 h-5" /> Download Full Report</GoldBtn>
            </motion.div>
          )}
          {tab === 'history' && (
            <motion.div {...A.fade} className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: T.shadow.sm }}>
              <div className="px-4 py-3 border-b border-gray-100"><h3 className="font-bold text-sm" style={{ color: T.blue }}>Token History ({wallet.transactions.length})</h3></div>
              {wallet.transactions.length === 0 ? (
                <div className="p-8 text-center"><Coins className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-xs text-gray-400">No transactions yet.</p></div>
              ) : wallet.transactions.slice(0, 12).map((tx, i) => (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${T.green}20` }}>
                    <TrendingUp className="w-4 h-4" style={{ color: T.green }} />
                  </div>
                  <div className="flex-1 min-w-0"><p className="text-xs font-medium text-gray-700 truncate">{tx.reason}</p><p className="text-xs text-gray-400">{tx.screen}</p></div>
                  <span className="text-xs font-black" style={{ color: T.green }}>+{tx.amount}</span>
                </div>
              ))}
            </motion.div>
          )}
          {tab === 'feedback' && (
            <motion.div {...A.fade} className="space-y-4">
              {!submitted ? (
                <>
                  <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
                    <h3 className="font-bold text-sm mb-3" style={{ color: T.blue, fontFamily: T.heading }}>Rate This Season</h3>
                    <div className="flex gap-2 justify-center mb-4">
                      {[1, 2, 3, 4, 5].map(n => (
                        <motion.button key={n} {...A.tap} onClick={() => setRating(n)} className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: n <= rating ? T.gold : '#F3F4F6', minWidth: 48 }}>
                          <Star className="w-6 h-6" style={{ color: n <= rating ? T.goldDark : '#D1D5DB', fill: n <= rating ? T.goldDark : 'none' }} />
                        </motion.button>
                      ))}
                    </div>
                    <textarea value={fbText} onChange={e => setFbText(e.target.value)} placeholder="Share your experience..."
                      className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none" style={{ minHeight: 96 }} />
                  </div>
                  <GoldBtn onClick={() => setSubmitted(true)} disabled={rating === 0}><ThumbsUp className="w-5 h-5" /> Submit Feedback</GoldBtn>
                </>
              ) : (
                <motion.div {...A.slideUp} className="text-center p-6 bg-white rounded-2xl" style={{ boxShadow: T.shadow.sm }}>
                  <div className="text-4xl mb-3">🙏</div>
                  <h3 className="font-bold" style={{ color: T.blue }}>Thank You!</h3>
                  <p className="text-xs text-gray-400 mt-1">Your feedback helps TRADIE improve for every farmer.</p>
                </motion.div>
              )}
            </motion.div>
          )}
          <div className="space-y-3">
            <GoldBtn onClick={() => go(SCREENS.crop)}><Sprout className="w-5 h-5" /> Start Next Crop Season</GoldBtn>
            <GhostBtn onClick={() => { setActiveNav('home'); go(SCREENS.dashboard); }}>← Return to Dashboard</GhostBtn>
          </div>
        </div>
        <BNav active={activeNav} onNav={nav} onNotif={() => go(SCREENS.notifications)} />
      </Wrap>
    );
  };

  // ── S32: NOTIFICATIONS (NEW) ──────────────────────────
  const S32 = () => {
    const notifs = [
      { icon: '💰', title: 'Payment Received', desc: '₹2,41,500 credited to your account', time: '2 min ago', type: 'success', unread: true },
      { icon: '📈', title: 'Price Alert', desc: 'Wheat prices up 5% in Ludhiana Mandi', time: '1 hr ago', type: 'info', unread: true },
      { icon: '✅', title: 'Quality Certificate', desc: 'Your NABL certificate is ready for download', time: '3 hr ago', type: 'success', unread: true },
      { icon: '🚛', title: 'Transport Update', desc: 'Your shipment arrived at destination', time: '5 hr ago', type: 'info', unread: false },
      { icon: '🏦', title: 'KCC Application', desc: 'Kisan Credit Card application approved', time: '1 day ago', type: 'success', unread: false },
      { icon: '🌧️', title: 'Weather Alert', desc: 'Heavy rain expected in next 48 hours', time: '2 days ago', type: 'warning', unread: false },
      { icon: '🇮🇳', title: 'PM-KISAN Benefit', desc: '₹2,000 credited to your Aadhaar-linked account', time: '3 days ago', type: 'success', unread: false },
    ];
    const colors: Record<string, string> = { success: T.green, info: T.blue, warning: T.goldDark };
    return (
      <Wrap>
        <Hdr title="Notifications" n={SCREENS.notifications} onBack={() => go(SCREENS.dashboard)} sub={`${notifs.filter(n => n.unread).length} unread`} />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{notifs.filter(n => n.unread).length} unread notifications</span>
            <button className="text-xs font-semibold" style={{ color: T.blueLight }}>Mark all read</button>
          </div>
          {notifs.map((n, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-4 flex items-start gap-3"
              style={{ boxShadow: T.shadow.sm, borderLeft: n.unread ? `3px solid ${colors[n.type] || T.blue}` : 'none' }}>
              <span className="text-2xl flex-shrink-0">{n.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-gray-800">{n.title}</p>
                  {n.unread && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors[n.type] || T.blue }} />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
            </motion.div>
          ))}
          <GhostBtn onClick={() => go(SCREENS.dashboard)}>← Back to Dashboard</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── S33: PROFILE & SETTINGS (NEW) ────────────────────
  const S33 = () => {
    const [editLang, setEditLang] = useState(false);
    const sections = [
      { title: 'Personal Information', items: [{ l: 'Full Name', v: 'Rajesh Kumar' }, { l: 'Mobile', v: '+91 98765 43210' }, { l: 'Email', v: 'rajesh@example.com' }, { l: 'Village', v: 'Alipur, Punjab' }] },
      { title: 'KYC & Documents', items: [{ l: 'Aadhaar', v: 'XXXX-XXXX-4521 ✅' }, { l: 'PAN', v: 'XXXXX1234X ✅' }, { l: 'Bank Account', v: 'SBI •••• 4521 ✅' }, { l: 'Land Records', v: '2 docs uploaded ✅' }] },
      { title: 'Farm Details', items: [{ l: 'Total Land', v: `${form.acres || '5.5'} Acres` }, { l: 'Soil Type', v: form.soil || 'Alluvial' }, { l: 'Water Source', v: form.water || 'Borewell' }, { l: 'Survey No.', v: form.surveyNo || '123/4A' }] },
    ];
    const prefs = [
      { l: 'Language', v: LANGUAGES[lang]?.nativeName || 'English', action: () => setEditLang(!editLang) },
      { l: 'Notifications', v: 'Enabled', action: () => {} },
      { l: 'Dark Mode', v: 'Off', action: () => {} },
      { l: 'Privacy Mode', v: 'Off', action: () => {} },
    ];
    return (
      <Wrap>
        <Hdr title="Profile & Settings" n={SCREENS.profile} onBack={() => go(SCREENS.dashboard)} sub="Account & preferences" />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <div className="bg-white rounded-2xl p-5 text-center" style={{ boxShadow: T.shadow.sm }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-black" style={{ background: T.gradientBlue }}>RK</div>
            <h2 className="font-black" style={{ color: T.blue, fontFamily: T.heading }}>Rajesh Kumar</h2>
            <p className="text-xs text-gray-400 mt-1">🌾 Producer · Alipur, Punjab</p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="text-center"><p className="text-base font-black" style={{ color: T.blue }}>{wallet.balance}</p><p className="text-xs text-gray-400">Tokens</p></div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center"><p className="text-base font-black" style={{ color: T.green }}>3</p><p className="text-xs text-gray-400">Seasons</p></div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center"><p className="text-base font-black" style={{ color: T.goldDark }}>4.8★</p><p className="text-xs text-gray-400">Rating</p></div>
            </div>
          </div>
          {sections.map(sec => (
            <div key={sec.title} className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: T.shadow.sm }}>
              <div className="px-4 py-3 border-b border-gray-100"><h3 className="font-bold text-xs uppercase tracking-wider" style={{ color: T.grayMid }}>{sec.title}</h3></div>
              {sec.items.map(item => (
                <div key={item.l} className="flex justify-between px-4 py-3 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500">{item.l}</span>
                  <span className="text-xs font-semibold text-gray-700">{item.v}</span>
                </div>
              ))}
            </div>
          ))}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: T.shadow.sm }}>
            <div className="px-4 py-3 border-b border-gray-100"><h3 className="font-bold text-xs uppercase tracking-wider" style={{ color: T.grayMid }}>Preferences</h3></div>
            {prefs.map(p => (
              <button key={p.l} onClick={p.action} className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-50 last:border-0 text-left" style={{ minHeight: 48 }}>
                <span className="text-xs text-gray-500">{p.l}</span>
                <div className="flex items-center gap-2"><span className="text-xs font-semibold text-gray-700">{p.v}</span><ChevronRight className="w-3.5 h-3.5 text-gray-300" /></div>
              </button>
            ))}
          </div>
          {editLang && (
            <motion.div {...A.slideUp} className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.md }}>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(LANGUAGES).map(([code, { flag, nativeName }]) => (
                  <button key={code} onClick={() => { setLang(code); setEditLang(false); }}
                    className="p-3 rounded-xl border-2 text-left"
                    style={{ borderColor: lang === code ? T.gold : '#E5E7EB', minHeight: 52 }}>
                    <span className="text-xl mr-2">{flag}</span>
                    <span className="text-xs font-medium text-gray-700">{nativeName}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          <div className="space-y-2">
            <button onClick={() => go(SCREENS.help)} className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl" style={{ boxShadow: T.shadow.sm, minHeight: 52 }}>
              <HelpCircle className="w-5 h-5" style={{ color: T.blue }} />
              <span className="text-sm font-semibold text-gray-700">Help & Support</span>
              <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-white rounded-2xl" style={{ boxShadow: T.shadow.sm, minHeight: 52 }}>
              <Share2 className="w-5 h-5" style={{ color: T.goldDark }} />
              <span className="text-sm font-semibold text-gray-700">Refer & Earn</span>
              <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
            </button>
          </div>
          <GhostBtn onClick={() => { setActiveNav('home'); go(SCREENS.dashboard); }}>← Back to Dashboard</GhostBtn>
        </div>
        <BNav active="profile" onNav={nav} onNotif={() => go(SCREENS.notifications)} />
      </Wrap>
    );
  };

  // ── S34: HELP & SUPPORT (NEW) ─────────────────────────
  const S34 = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const faqs = [
      { q: 'How do I tokenize my crop lot?', a: 'Go to Lot Creation (Screen 16) after completing harvest listing. Tap "Mint NFT Token" — your lot gets a unique blockchain ID within 30 seconds.' },
      { q: 'What is TRADIE Escrow?', a: 'TRADIE Escrow holds buyer payment until you confirm delivery and the buyer accepts. Payment is released automatically after QR scan confirmation.' },
      { q: 'How are Tradie Tokens earned?', a: 'Earn tokens at every step: login (+5), crop selection (+5), activity logs (+3), quality check (+10), sale confirmation (+20), payment receipt (+15).' },
      { q: 'Can I switch selling methods?', a: 'Yes. On the Sell Method screen you can choose from 6 options: Farm Gate, Commission Agent, Warehouse, Auction, Registered Buyer, or Direct Negotiation.' },
      { q: 'How do I apply for a Crop Loan?', a: 'Navigate to Financial Services (Screen 11). Select "Crop Loan" or "KCC" and tap Apply — your KYC and land records auto-fill. Approval in 2 minutes.' },
    ];
    return (
      <Wrap>
        <Hdr title="Help & Support" n={SCREENS.help} onBack={() => go(SCREENS.profile)} sub="24/7 assistance for producers" />
        <div className="px-4 py-4 max-w-sm mx-auto space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[{ icon: '📞', l: 'Call Support', sub: '1800-TRADIE', color: T.green }, { icon: '💬', l: 'Live Chat', sub: 'Avg. 2 min reply', color: T.blue }, { icon: '📧', l: 'Email Us', sub: 'help@tradie.in', color: T.purple }, { icon: '🎥', l: 'Video Tutorials', sub: '20+ videos', color: T.goldDark }].map(s => (
              <motion.button key={s.l} {...A.tap} onClick={() => {}}
                className="p-4 rounded-2xl bg-white flex flex-col items-start gap-2 text-left" style={{ boxShadow: T.shadow.sm, minHeight: 88 }}>
                <span className="text-3xl">{s.icon}</span>
                <div><p className="text-xs font-bold text-gray-800">{s.l}</p><p className="text-xs" style={{ color: s.color }}>{s.sub}</p></div>
              </motion.button>
            ))}
          </div>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: T.shadow.sm }}>
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-bold text-sm" style={{ color: T.blue, fontFamily: T.heading }}>Frequently Asked Questions</h3>
            </div>
            {faqs.map((f, i) => (
              <div key={i} className="border-b border-gray-50 last:border-0">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left" style={{ minHeight: 52 }}>
                  <p className="text-xs font-semibold text-gray-700 flex-1 pr-2">{f.q}</p>
                  <ChevronDown className="w-4 h-4 flex-shrink-0 text-gray-300 transition-transform" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none' }} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <p className="text-xs text-gray-500 px-4 pb-4 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-4" style={{ boxShadow: T.shadow.sm }}>
            <h3 className="font-bold text-sm mb-2" style={{ color: T.blue }}>Report an Issue</h3>
            <textarea placeholder="Describe the issue you're facing..." rows={3}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none mb-3" />
            <GoldBtn onClick={() => {}}>Submit Report</GoldBtn>
          </div>
          <GhostBtn onClick={() => go(SCREENS.profile)}>← Back to Profile</GhostBtn>
        </div>
      </Wrap>
    );
  };

  // ── SCREEN MAP & RENDER ───────────────────────────────
  const screenMap: Record<number, React.ReactNode> = {
    1: <S1 />, 2: <S2 />, 3: <S3 />, 4: <S4 />, 5: <S5 />,
    6: <S6 />, 7: <S7 />, 8: <S8 />, 9: <S9 />, 10: <S10 />,
    11: <S11 />, 12: <S12 />, 13: <S13 />, 14: <S14 />, 15: <S15 />,
    16: <S16 />, 17: <S17 />, 18: <S18 />, 19: <S19 />, 20: <S20 />,
    21: <S21 />, 22: <S22 />, 23: <S23 />, 24: <S24 />, 25: <S25 />,
    26: <S26 />, 27: <S27 />, 28: <S28 />, 29: <S29 />, 30: <S30 />,
    31: <S31 />, 32: <S32 />, 33: <S33 />, 34: <S34 />,
  };

  return (
    <div className="relative max-w-sm mx-auto" style={{ minHeight: '100dvh' }}>
      <AnimatePresence>
        {showTokAnim && (
          <motion.div {...A.fade} className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div {...A.burst} className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: T.gradientGold, boxShadow: '0 8px 32px rgba(244,208,63,0.55)' }}>
              <Coins className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div key={screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {screenMap[screen] ?? <S4 />}
        </motion.div>
      </AnimatePresence>
      {onClose && screen === 1 && (
        <motion.button {...A.tap} onClick={onClose}
          className="fixed top-4 right-4 z-50 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center">
          <X className="w-5 h-5 text-gray-500" />
        </motion.button>
      )}
    </div>
  );
};

export default TRADIEProducerFlowPrototypeRefined;
