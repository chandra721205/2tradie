import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { ScrollArea } from "./components/ui/scroll-area";
import { countries, languages } from "./components/CountryLanguageData";
import { getTranslation } from "./components/Translations";
import { SignUpScreen } from "./components/SignUpScreen";
import { SignInScreen } from "./components/SignInScreen";
import { TwoStepVerificationScreen } from "./components/TwoStepVerificationScreen";
import { OTPVerificationScreen } from "./components/OTPVerificationScreen";
import { WelcomeBonusScreen } from "./components/WelcomeBonusScreen";
import { ReferEarnScreen } from "./components/ReferEarnScreen";
import { RoleSelectionScreen } from "./components/RoleSelectionScreen";
import { KYCFlow } from "./components/KYCFlow";
import { ProducerConfirmation } from "./components/ProducerConfirmation";
import { ProducerDocumentVerification } from "./components/ProducerDocumentVerification";
import { ExtendedProducerIdentityVerification } from "./components/ExtendedProducerIdentityVerification";
import { DashboardScreenEnhanced } from "./components/DashboardScreenEnhanced";
import { WebDashboardScreen } from "./components/WebDashboardScreen";
import { OnboardingWireframe } from "./components/OnboardingWireframe";
import { EntityOnboardingWireframe } from "./components/EntityOnboardingWireframe";
import { FullKYCOnboardingWireframe } from "./components/FullKYCOnboardingWireframe";
import { TradingRoleSelectionScreen } from "./components/TradingRoleSelectionScreen";
import { EntityOnboardingComplete } from "./components/EntityOnboardingComplete";
import { EntityKYCWireframeLowFi } from "./components/EntityKYCWireframeLowFi";
import { KYCSystemDocumentation } from "./components/KYCSystemDocumentation";
import { KYCStatusDemo } from "./components/KYCStatusDemo";
import { UserManagementFlow } from "./components/UserManagementFlow";
import { ResponsiveUserManagementWireframe } from "./components/ResponsiveUserManagementWireframe";
import { MultiPlatformUserManagement } from "./components/MultiPlatformUserManagement";
import { ProducerLoginScreen } from "./components/ProducerLoginScreen";
import { ProducerDashboardScreen } from "./components/ProducerDashboardScreen";
import { ChatGPTIntegrationDemo } from "./components/ChatGPTIntegrationDemo";
import { ProducerAIDashboard } from "./components/ProducerAIDashboard";
import { ProducerAIDashboardWireframe } from "./components/ProducerAIDashboardWireframe";
import { InputCostDemo } from "./components/InputCostDemo";
import QualityTokenDemo from "./components/QualityTokenDemo";
import SimplifiedQualityCheckForm from "./components/producer-dashboard/SimplifiedQualityCheckForm";
import QRCodeManager from "./components/QRCodeManager";
import ProvenanceTracker from "./components/producer-dashboard/ProvenanceTracker";
import LotCreationTokenizationWorkflow from "./components/producer-dashboard/LotCreationTokenizationWorkflow";
import LotTokenizationFlowDiagram from "./components/producer-dashboard/LotTokenizationFlowDiagram";
import LotTokenizationGuide from "./components/producer-dashboard/LotTokenizationGuide";
import { LotManagementWireframes } from "./components/producer-dashboard/LotManagementWireframes";
import { PostTokenizationFlowWireframes } from "./components/producer-dashboard/PostTokenizationFlowWireframes";
import { CompleteMediaCaptureExample } from "./components/producer-dashboard/CompleteMediaCaptureExample";
import { SimpleMediaCaptureFlow } from "./components/producer-dashboard/SimpleWrappers";
import { FigmaJSONExporter } from "./components/producer-dashboard/FigmaJSONExporter";
import { EnhancedQualityCheckWithAI } from "./components/producer-dashboard/EnhancedQualityCheckWithAI";
import TRADIEProducerFlowPrototype from "./components/TRADIEProducerFlowPrototype";
import { TRADIEProducerFlowPrototypeRefined } from "./components/TRADIEProducerFlowPrototypeRefined";
import { CameraPermissionTest } from "./components/producer-dashboard/CameraPermissionTest";
import { ComprehensiveKYCSystem } from "./components/kyc/ComprehensiveKYCSystem";
import { EntityTypeSelection } from "./components/kyc/EntityTypeSelection";
import { RegionalDocumentRequirements } from "./components/kyc/RegionalDocumentRequirements";
import { AIDocumentVerification } from "./components/kyc/AIDocumentVerification";
import { TeamMemberManagement } from "./components/kyc/TeamMemberManagement";
import { StorageAndSellDashboard } from "./components/producer-dashboard/StorageAndSellDashboard";
import ProducerMasterFlowNavigator from "./components/producer-dashboard/ProducerMasterFlowNavigator";
import Producer12ScreenPresentation from "./components/producer-dashboard/Producer12ScreenPresentation";
import ProducerCompleteFlow from "./components/producer-dashboard/ProducerCompleteFlow";
import { Toaster } from "./components/ui/sonner";
import { useIsMobile } from "./components/ui/use-mobile";
import { DSButton, designTokens } from "./design-system";
import tradieLogo from "figma:asset/f956260347dc5e875bfaa9ef290c3ac5a8e7e3d9.png";
import ScreenExportPlugin from "./components/ScreenExportPlugin";
import WireframeBatchExporter from "./components/WireframeBatchExporter";
import ExportPluginShowcase from "./components/ExportPluginShowcase";
import WireframeNavigator from "./components/wireframes/WireframeNavigator";

type Screen =
  | "welcome"
  | "demo"
  | "tradie-producer-prototype"
  | "tradie-producer-prototype-v1"
  | "signin"
  | "two-step-verification"
  | "signup"
  | "otp"
  | "welcome-bonus"
  | "refer-earn"
  | "role-selection"
  | "trading-role-selection"
  | "kyc"
  | "entity-onboarding"
  | "kyc-status"
  | "entity-kyc-wireframe-low-fi"
  | "kyc-documentation"
  | "producer-confirmation"
  | "producer-documents"
  | "producer-identity"
  | "extended-producer-identity"
  | "wireframe"
  | "entity-wireframe"
  | "full-kyc-wireframe"
  | "dashboard"
  | "user-management"
  | "role-based-login"
  | "responsive-wireframe"
  | "multi-platform"
  | "producer-login"
  | "producer-dashboard"
  | "chatgpt-demo"
  | "producer-ai-dashboard"
  | "input-cost-demo"
  | "quality-check"
  | "quality-check-simple"
  | "qr-code-manager"
  | "provenance-tracker"
  | "lot-tokenization"
  | "lot-flow-diagram"
  | "lot-guide"
  | "lot-wireframes"
  | "post-tokenization-flow"
  | "ai-media-capture"
  | "simple-media-capture"
  | "figma-json-exporter"
  | "enhanced-quality-check"
  | "camera-permission-test"
  | "comprehensive-kyc"
  | "kyc-entity-selection"
  | "kyc-regional-docs"
  | "kyc-ai-verification"
  | "kyc-team-management"
  | "storage-sell-dashboard"
  | "producer-flow-navigator"
  | "producer-12-screen-presentation"
  | "producer-complete-flow"
  | "export-plugin-showcase"
  | "lowfi-wireframes";

const { colors, typography, spacing, radius, shadows } = designTokens;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [selectedCountry, setSelectedCountry] = useState<string>("IN");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [userRole, setUserRole] = useState<string>("");

  const isMobile = useIsMobile();

  const getTranslatedText = (key: string): string => {
    return getTranslation(selectedLanguage, key);
  };

  const handleSignUp = (data: any) => {
    console.log("Sign up data:", data);
    setCurrentScreen("otp");
  };

  const handleOTPVerified = () => {
    setCurrentScreen("welcome-bonus");
  };

  const handleBonusComplete = () => {
    setCurrentScreen("refer-earn");
  };

  const handleReferComplete = () => {
    setCurrentScreen("role-selection");
  };

  const handleRoleSelected = (role: string) => {
    setUserRole(role);
    if (role === "producer") {
      setCurrentScreen("producer-confirmation");
    } else {
      setCurrentScreen("trading-role-selection");
    }
  };

  const handleTradingRoleConfirmed = () => {
    setCurrentScreen("entity-onboarding");
  };

  const handleEntityOnboardingComplete = () => {
    setCurrentScreen("kyc-status");
  };

  const handleKYCComplete = () => {
    setCurrentScreen("dashboard");
  };

  // ─── SPLASH / WELCOME ──────────────────────────────────
  if (currentScreen === "welcome") {
    const languages_sel = [
      { code: 'EN', flag: '🇬🇧', label: 'EN' }, { code: 'HI', flag: '🇮🇳', label: 'हि' },
      { code: 'TE', flag: '🇮🇳', label: 'తె' }, { code: 'TM', flag: '🇮🇳', label: 'த' },
      { code: 'KN', flag: '🇮🇳', label: 'ಕ' }, { code: 'BN', flag: '🇮🇳', label: 'ব' },
      { code: 'MR', flag: '🇮🇳', label: 'म' },
    ];
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #F7FAFC 0%, #D9F2FF 50%, #E8F4FD 100%)' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #F4D03F, transparent)' }} />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #003E6D, transparent)' }} />
        </div>

        <div className="relative z-10 w-full max-w-sm mx-auto px-6 py-12 flex flex-col items-center min-h-screen justify-between">
          {/* Top — Language chips */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 justify-center pt-4 w-full">
            {languages_sel.map(l => (
              <motion.button key={l.code} whileTap={{ scale: 0.92 }}
                onClick={() => setSelectedLanguage(l.code.toLowerCase())}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                style={{
                  backgroundColor: selectedLanguage === l.code.toLowerCase() ? '#F4D03F' : 'rgba(255,255,255,0.7)',
                  borderColor: selectedLanguage === l.code.toLowerCase() ? '#F39C12' : '#E5E7EB',
                  color: selectedLanguage === l.code.toLowerCase() ? '#003E6D' : '#6B7280',
                  minHeight: '32px',
                }}>
                {l.flag} {l.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Center — Hero */}
          <div className="flex flex-col items-center text-center">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
              className="relative mb-6">
              <div className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #F4D03F 0%, #F39C12 100%)', boxShadow: '0 20px 60px rgba(244,208,63,0.45)' }}>
                <img src={tradieLogo} alt="TRADIE" className="w-20 h-20 object-contain" />
              </div>
              <motion.div className="absolute inset-0 rounded-3xl"
                animate={{ boxShadow: ['0 0 0px rgba(244,208,63,0)', '0 0 50px rgba(244,208,63,0.5)', '0 0 0px rgba(244,208,63,0)'] }}
                transition={{ duration: 2.5, repeat: Infinity }} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <h1 className="font-black mb-2 tracking-tight"
                style={{ fontSize: '48px', color: '#003E6D', fontFamily: 'Playfair Display, Georgia, serif', lineHeight: 1.1 }}>
                TRADIE
              </h1>
              <p className="text-base font-semibold mb-1" style={{ color: '#0066B3' }}>
                Commodity Trading Platform
              </p>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
                AI-powered · Blockchain-secured · 200+ Commodities
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {['🌾 Producer Flow', '🤖 Grok AI', '🔗 NFT Lots', '💰 Tradie Tokens', '✅ KYC'].map(f => (
                  <span key={f} className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{ backgroundColor: 'rgba(0,62,109,0.08)', color: '#003E6D' }}>{f}</span>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="w-full space-y-3">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentScreen("tradie-producer-prototype")}
                className="w-full py-4 rounded-2xl text-base font-black flex items-center justify-center gap-3"
                style={{ background: 'linear-gradient(135deg, #F4D03F 0%, #F39C12 100%)', color: '#003E6D', boxShadow: '0 10px 32px rgba(244,208,63,0.4)', minHeight: '56px' }}>
                <span>🌾</span>
                Get Started — Producer Journey
                <span>→</span>
              </motion.button>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentScreen("signin")}
                className="w-full py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3 border-2"
                style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: '#003E6D', color: '#003E6D', minHeight: '52px' }}>
                Sign In to Existing Account
              </motion.button>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setCurrentScreen("signup")}
                className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{ backgroundColor: 'transparent', color: '#0066B3', minHeight: '44px' }}>
                New here? Create Free Account
              </motion.button>
            </motion.div>
          </div>

          {/* Bottom — Demo mode link */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="text-center pb-4">
            <button onClick={() => setCurrentScreen("demo")}
              className="text-xs underline" style={{ color: '#9CA3AF', minHeight: '32px' }}>
              Developer Demo Mode — All Screens
            </button>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
              TRADIE v2.0 • EN/HI/TE/TM/KN/BN/MR • 14 Roles
            </p>
          </motion.div>
        </div>
        <Toaster />
      </div>
    );
  }

  // ─── DEMO MODE (legacy button grid, preserved) ──────────
  if (currentScreen === "demo") {
    return (
      <div className="min-h-screen flex items-start justify-center p-4"
        style={{ background: `linear-gradient(to bottom right, ${colors.gradient.start}, ${colors.gradient.middle}, ${colors.gradient.end})` }}>
        <div className="w-full max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-center mb-8 pt-6">
            <div className="flex items-center justify-between mb-4">
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentScreen("welcome")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white font-semibold text-sm"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', color: colors.blue.primary }}>
                ← Back to App
              </motion.button>
              <span className="text-xs px-3 py-1.5 rounded-full font-bold"
                style={{ backgroundColor: '#F4D03F30', color: '#F39C12', border: '1px solid #F4D03F60' }}>
                Developer Mode
              </span>
            </div>
            <img src={tradieLogo} alt="TRADIE" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl mb-2"
              style={{ fontFamily: typography.fonts.heading, color: colors.blue.primary, fontWeight: typography.weights.bold }}>
              TRADIE — All Screens
            </h1>
            <p className="text-sm mb-2" style={{ color: `${colors.blue.primary}90` }}>
              Complete Cross-Platform Commodity Trading System
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <DSButton onClick={() => setCurrentScreen("export-plugin-showcase")} style={{ backgroundColor: '#8B5CF6', color: 'white' }}>
                📄 Export Plugin Demo
              </DSButton>
              <ScreenExportPlugin fileName={`TRADIE-Screen-${new Date().toISOString().split('T')[0]}`} buttonVariant="outline" />
              <WireframeBatchExporter />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-6 shadow-lg border-2" style={{ borderColor: `${colors.accent.gold}30` }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: colors.blue.primary }}>🔐 Authentication</h3>
              <div className="space-y-2">
                <DSButton onClick={() => setCurrentScreen("signin")} size="sm" fullWidth>Sign In</DSButton>
                <DSButton onClick={() => setCurrentScreen("signup")} size="sm" fullWidth variant="outline">Sign Up</DSButton>
                <DSButton onClick={() => setCurrentScreen("two-step-verification")} size="sm" fullWidth variant="outline">2-Step Verification</DSButton>
                <DSButton onClick={() => setCurrentScreen("otp")} size="sm" fullWidth variant="outline">OTP Verification</DSButton>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border-2" style={{ borderColor: `${colors.accent.gold}30` }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: colors.blue.primary }}>👋 Onboarding</h3>
              <div className="space-y-2">
                <DSButton onClick={() => setCurrentScreen("welcome-bonus")} size="sm" fullWidth variant="outline">Welcome Bonus</DSButton>
                <DSButton onClick={() => setCurrentScreen("refer-earn")} size="sm" fullWidth variant="outline">Refer & Earn</DSButton>
                <DSButton onClick={() => setCurrentScreen("role-selection")} size="sm" fullWidth variant="outline">Role Selection</DSButton>
                <DSButton onClick={() => setCurrentScreen("trading-role-selection")} size="sm" fullWidth variant="outline">Trading Role</DSButton>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border-2" style={{ borderColor: `${colors.accent.gold}30` }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: colors.blue.primary }}>🌾 Producer Flow</h3>
              <div className="space-y-2">
                <DSButton onClick={() => setCurrentScreen("tradie-producer-prototype")} size="sm" fullWidth
                  style={{ background: 'linear-gradient(135deg, #F4D03F, #F39C12)', color: '#fff', fontWeight: 'bold', border: '2px solid #FFD700' }}>
                  ✨ TRADIE v2 REFINED (18 Screens) ⭐
                </DSButton>
                <DSButton onClick={() => setCurrentScreen("producer-complete-flow")} size="sm" fullWidth style={{ backgroundColor: '#8B5CF6', color: 'white', fontWeight: 'bold' }}>
                  🚀 END-TO-END TRADING FLOW (11 Steps)
                </DSButton>
                <DSButton onClick={() => setCurrentScreen("producer-12-screen-presentation")} size="sm" fullWidth style={{ backgroundColor: '#FF6B00', color: 'white' }}>
                  🎯 12-Screen Figma Presentation
                </DSButton>
                <DSButton onClick={() => setCurrentScreen("producer-flow-navigator")} size="sm" fullWidth style={{ backgroundColor: '#10B981', color: 'white' }}>
                  🌾 Complete Producer Flow
                </DSButton>
                <DSButton onClick={() => setCurrentScreen("producer-login")} size="sm" fullWidth>Producer Login</DSButton>
                <DSButton onClick={() => setCurrentScreen("producer-dashboard")} size="sm" fullWidth>Producer Dashboard</DSButton>
                <DSButton onClick={() => setCurrentScreen("input-cost-demo")} size="sm" fullWidth>💰 Cost Tracking</DSButton>
                <DSButton onClick={() => setCurrentScreen("quality-check")} size="sm" fullWidth>🎯 Quality Check (Token Demo)</DSButton>
                <DSButton onClick={() => setCurrentScreen("quality-check-simple")} size="sm" fullWidth>📋 Dynamic Quality Form</DSButton>
                <DSButton onClick={() => setCurrentScreen("qr-code-manager")} size="sm" fullWidth>📱 QR Code Manager</DSButton>
                <DSButton onClick={() => setCurrentScreen("provenance-tracker")} size="sm" fullWidth>🔗 Provenance Tracker (NFT/QR)</DSButton>
                <DSButton onClick={() => setCurrentScreen("lot-tokenization")} size="sm" fullWidth>🏷️ Lot & Tokenization</DSButton>
                <DSButton onClick={() => setCurrentScreen("lot-flow-diagram")} size="sm" fullWidth>📊 Flow Diagram</DSButton>
                <DSButton onClick={() => setCurrentScreen("lot-guide")} size="sm" fullWidth>📚 Complete Guide & Tutorial</DSButton>
                <DSButton onClick={() => setCurrentScreen("lot-wireframes")} size="sm" fullWidth>🖼️ 6-Screen Wireframes</DSButton>
                <DSButton onClick={() => setCurrentScreen("post-tokenization-flow")} size="sm" fullWidth>🏪 Storage/Sell Flow (8 Screens)</DSButton>
                <DSButton onClick={() => setCurrentScreen("ai-media-capture")} size="sm" fullWidth>📸 AI Media Capture Demo</DSButton>
                <DSButton onClick={() => setCurrentScreen("simple-media-capture")} size="sm" fullWidth>📸 Simple Media Capture</DSButton>
                <DSButton onClick={() => setCurrentScreen("figma-json-exporter")} size="sm" fullWidth>🎨 Figma JSON Exporter</DSButton>
                <DSButton onClick={() => setCurrentScreen("enhanced-quality-check")} size="sm" fullWidth>✨ Complete AI Quality Check</DSButton>
                <DSButton onClick={() => setCurrentScreen("storage-sell-dashboard")} size="sm" fullWidth style={{ backgroundColor: '#FFD700', color: '#003E6D' }}>
                  🚀 Storage & Sell Dashboard
                </DSButton>
                <DSButton onClick={() => setCurrentScreen("camera-permission-test")} size="sm" fullWidth style={{ backgroundColor: '#EF4444', color: 'white' }}>
                  🔴 TEST: Camera Permission Error
                </DSButton>
                <DSButton onClick={() => setCurrentScreen("producer-confirmation")} size="sm" fullWidth variant="outline">Confirmation</DSButton>
                <DSButton onClick={() => setCurrentScreen("producer-documents")} size="sm" fullWidth variant="outline">Documents</DSButton>
                <DSButton onClick={() => setCurrentScreen("extended-producer-identity")} size="sm" fullWidth variant="outline">Extended Identity</DSButton>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border-2" style={{ borderColor: `${colors.accent.gold}30` }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: colors.blue.primary }}>✅ KYC System</h3>
              <div className="space-y-2">
                <DSButton onClick={() => setCurrentScreen("comprehensive-kyc")} size="sm" fullWidth style={{ backgroundColor: colors.accent.gold, color: colors.blue.primary }}>
                  🚀 Comprehensive KYC
                </DSButton>
                <DSButton onClick={() => setCurrentScreen("kyc-entity-selection")} size="sm" fullWidth>Entity Type Selection</DSButton>
                <DSButton onClick={() => setCurrentScreen("kyc-regional-docs")} size="sm" fullWidth>Regional Documents</DSButton>
                <DSButton onClick={() => setCurrentScreen("kyc-ai-verification")} size="sm" fullWidth>AI Document Verification</DSButton>
                <DSButton onClick={() => setCurrentScreen("kyc-team-management")} size="sm" fullWidth>Team Management (30 Members)</DSButton>
                <DSButton onClick={() => setCurrentScreen("kyc")} size="sm" fullWidth variant="outline">Basic KYC Flow</DSButton>
                <DSButton onClick={() => setCurrentScreen("entity-onboarding")} size="sm" fullWidth variant="outline">Entity Onboarding</DSButton>
                <DSButton onClick={() => setCurrentScreen("kyc-status")} size="sm" fullWidth variant="outline">KYC Status Demo</DSButton>
                <DSButton onClick={() => setCurrentScreen("kyc-documentation")} size="sm" fullWidth variant="outline">Documentation</DSButton>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border-2" style={{ borderColor: `${colors.accent.gold}30` }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: colors.blue.primary }}>📐 Wireframes</h3>
              <div className="space-y-2">
                <DSButton onClick={() => setCurrentScreen("lowfi-wireframes")} size="sm" fullWidth style={{ backgroundColor: '#10B981', color: 'white', fontWeight: 'bold' }}>
                  🎨 LOW-FI WIREFRAMES (36 Screens)
                </DSButton>
                <DSButton onClick={() => setCurrentScreen("wireframe")} size="sm" fullWidth variant="outline">Onboarding</DSButton>
                <DSButton onClick={() => setCurrentScreen("entity-wireframe")} size="sm" fullWidth variant="outline">Entity Wireframe</DSButton>
                <DSButton onClick={() => setCurrentScreen("full-kyc-wireframe")} size="sm" fullWidth variant="outline">Full KYC</DSButton>
                <DSButton onClick={() => setCurrentScreen("entity-kyc-wireframe-low-fi")} size="sm" fullWidth variant="outline">Entity KYC Low-Fi</DSButton>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border-2" style={{ borderColor: `${colors.accent.gold}30` }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: colors.blue.primary }}>👥 User Management</h3>
              <div className="space-y-2">
                <DSButton onClick={() => setCurrentScreen("user-management")} size="sm" fullWidth variant="outline">User Management</DSButton>
                <DSButton onClick={() => setCurrentScreen("responsive-wireframe")} size="sm" fullWidth variant="outline">Responsive</DSButton>
                <DSButton onClick={() => setCurrentScreen("multi-platform")} size="sm" fullWidth variant="outline">Multi-Platform</DSButton>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border-2" style={{ borderColor: `${colors.accent.gold}30` }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: colors.blue.primary }}>📊 Dashboards</h3>
              <div className="space-y-2">
                <DSButton onClick={() => setCurrentScreen("dashboard")} size="sm" fullWidth variant="outline">Enhanced Dashboard</DSButton>
                <DSButton onClick={() => setCurrentScreen("producer-ai-dashboard")} size="sm" fullWidth>Producer AI Dashboard</DSButton>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border-2" style={{ borderColor: `${colors.accent.gold}30` }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: colors.blue.primary }}>✨ AI Features</h3>
              <div className="space-y-2">
                <DSButton onClick={() => setCurrentScreen("chatgpt-demo")} size="sm" fullWidth>ChatGPT Assistant</DSButton>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: colors.blue.primary }}>🌍 Country:</span>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {countries.slice(0, 10).map((country, index) => (
                    <SelectItem key={`country-${index}-${country.name}`} value={country.code}>
                      {country.flag} {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: colors.blue.primary }}>🗣️ Language:</span>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {languages.slice(0, 10).map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  // Render screens
  return (
    <>
      {currentScreen === "signin" && (
        <SignInScreen
          onSignInSuccess={() => setCurrentScreen("two-step-verification")}
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "two-step-verification" && (
        <TwoStepVerificationScreen 
          onVerifySuccess={() => setCurrentScreen("dashboard")}
          onChangeContact={() => setCurrentScreen("signin")}
          onBack={() => setCurrentScreen("signin")}
          contactInfo="+91 98765 43210"
          contactType="phone"
        />
      )}

      {currentScreen === "signup" && (
        <SignUpScreen
          onGetOTP={handleSignUp}
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "otp" && (
        <OTPVerificationScreen 
          onVerifySuccess={handleOTPVerified}
          onBackToSignUp={() => setCurrentScreen("signup")}
          mobile="234 567 8900"
          countryCode="+1"
        />
      )}

      {currentScreen === "welcome-bonus" && (
        <WelcomeBonusScreen 
          onContinue={handleBonusComplete}
          onBack={() => setCurrentScreen("otp")}
        />
      )}

      {currentScreen === "refer-earn" && (
        <ReferEarnScreen 
          onContinue={handleReferComplete}
          onBack={() => setCurrentScreen("welcome-bonus")}
        />
      )}

      {currentScreen === "role-selection" && (
        <RoleSelectionScreen 
          onRoleSelected={handleRoleSelected}
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "trading-role-selection" && (
        <TradingRoleSelectionScreen 
          onContinue={handleTradingRoleConfirmed}
          onBack={() => setCurrentScreen("role-selection")}
        />
      )}

      {currentScreen === "kyc" && (
        <KYCFlow 
          onComplete={handleKYCComplete}
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "entity-onboarding" && (
        <EntityOnboardingComplete 
          onComplete={handleEntityOnboardingComplete}
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "kyc-status" && (
        <KYCStatusDemo 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "entity-kyc-wireframe-low-fi" && (
        <EntityKYCWireframeLowFi 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "kyc-documentation" && (
        <KYCSystemDocumentation 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "producer-confirmation" && (
        <ProducerConfirmation 
          onConfirm={() => setCurrentScreen("producer-documents")}
          onDecline={() => setCurrentScreen("role-selection")}
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "producer-documents" && (
        <ProducerDocumentVerification 
          onComplete={() => setCurrentScreen("extended-producer-identity")}
          onBack={() => setCurrentScreen("producer-confirmation")}
        />
      )}

      {currentScreen === "extended-producer-identity" && (
        <ExtendedProducerIdentityVerification 
          onComplete={() => setCurrentScreen("dashboard")}
          onBack={() => setCurrentScreen("producer-documents")}
        />
      )}

      {currentScreen === "wireframe" && (
        <OnboardingWireframe 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "entity-wireframe" && (
        <EntityOnboardingWireframe 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "full-kyc-wireframe" && (
        <FullKYCOnboardingWireframe 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "dashboard" && (
        <DashboardScreenEnhanced 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "user-management" && (
        <UserManagementFlow 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "responsive-wireframe" && (
        <ResponsiveUserManagementWireframe 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "multi-platform" && (
        <MultiPlatformUserManagement 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "tradie-producer-prototype" && (
        <TRADIEProducerFlowPrototypeRefined 
          onClose={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "tradie-producer-prototype-v1" && (
        <TRADIEProducerFlowPrototype 
          onClose={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "producer-login" && (
        <ProducerLoginScreen 
          onLoginSuccess={() => setCurrentScreen("producer-dashboard")}
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "producer-dashboard" && (
        <ProducerDashboardScreen 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "chatgpt-demo" && (
        <ChatGPTIntegrationDemo 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "producer-ai-dashboard" && (
        <ProducerAIDashboard 
          producerName="Producer"
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "input-cost-demo" && (
        <InputCostDemo 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "quality-check" && (
        <QualityTokenDemo 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "quality-check-simple" && (
        <SimplifiedQualityCheckForm 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "qr-code-manager" && (
        <QRCodeManager 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "provenance-tracker" && (
        <ProvenanceTracker 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "lot-tokenization" && (
        <LotCreationTokenizationWorkflow 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "lot-flow-diagram" && (
        <LotTokenizationFlowDiagram 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "lot-guide" && (
        <LotTokenizationGuide 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "lot-wireframes" && (
        <LotManagementWireframes 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "post-tokenization-flow" && (
        <PostTokenizationFlowWireframes 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "ai-media-capture" && (
        <CompleteMediaCaptureExample 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "simple-media-capture" && (
        <SimpleMediaCaptureFlow 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "figma-json-exporter" && (
        <FigmaJSONExporter 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "enhanced-quality-check" && (
        <EnhancedQualityCheckWithAI 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "camera-permission-test" && (
        <CameraPermissionTest 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "comprehensive-kyc" && (
        <ComprehensiveKYCSystem 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "kyc-entity-selection" && (
        <EntityTypeSelection 
          onSelect={(type) => {
            console.log('Selected entity type:', type);
            // You can navigate to next screen or store the selection
            setCurrentScreen("welcome");
          }}
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "kyc-regional-docs" && (
        <RegionalDocumentRequirements 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "kyc-ai-verification" && (
        <AIDocumentVerification 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "kyc-team-management" && (
        <TeamMemberManagement 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "storage-sell-dashboard" && (
        <StorageAndSellDashboard 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "producer-flow-navigator" && (
        <ProducerMasterFlowNavigator 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "producer-12-screen-presentation" && (
        <Producer12ScreenPresentation 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "producer-complete-flow" && (
        <ProducerCompleteFlow 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "export-plugin-showcase" && (
        <ExportPluginShowcase 
          onBack={() => setCurrentScreen("welcome")}
        />
      )}

      {currentScreen === "lowfi-wireframes" && (
        <WireframeNavigator onBack={() => setCurrentScreen("welcome")} />
      )}

      <Toaster />
    </>
  );
}
