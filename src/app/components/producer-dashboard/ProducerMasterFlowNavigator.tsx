import React, { useState } from 'react';
import {
  Sprout,
  BookOpen,
  ShoppingCart,
  Truck,
  MapPin,
  Gavel,
  FlaskConical,
  Scale,
  LayoutDashboard,
  CheckCircle,
  Circle,
  ChevronRight,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { BeautifulButton, ButtonGroup } from '../ui/beautiful-buttons';
import { Progress } from '../ui/progress';
import { cn } from '../ui/utils';

// Import individual screen components
import CropSelectionWithAI from './CropSelectionWithAI';
import CropJournalingTokenization from './CropJournalingTokenization';
import HarvestCommodityListing from './HarvestCommodityListing';
import TransportBooking from './TransportBooking';
import DestinationReceiving from './DestinationReceiving';
import MarketDisplayAuction from './MarketDisplayAuction';
import SamplingQualityCheck from './SamplingQualityCheck';
import WeighingConfirmation from './WeighingConfirmation';
import { ProducerAIDashboardComplete } from '../ProducerAIDashboardComplete';

// ==================== INTERFACES ====================

type FlowStage = 
  | 'dashboard'
  | 'crop-selection'
  | 'crop-journaling'
  | 'harvest-listing'
  | 'transport-booking'
  | 'destination-receiving'
  | 'market-auction'
  | 'sampling-quality'
  | 'weighing-confirmation'
  | 'complete';

interface FlowStep {
  id: FlowStage;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  completed: boolean;
}

interface ProducerData {
  producerId: string;
  name: string;
  cropSelection?: any;
  journalData?: any;
  commodityListing?: any;
  transportBooking?: any;
  receivingConfirmation?: any;
  auctionData?: any;
  qualityCheck?: any;
  weighingData?: any;
}

// ==================== MAIN COMPONENT ====================

const ProducerMasterFlowNavigator: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<FlowStage>('dashboard');
  const [completedStages, setCompletedStages] = useState<FlowStage[]>([]);
  const [producerData, setProducerData] = useState<ProducerData>({
    producerId: 'PROD-2025-001',
    name: 'Rajesh Kumar'
  });

  // Flow steps definition
  const flowSteps: FlowStep[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Overview & AI Insights',
      icon: LayoutDashboard,
      color: 'from-blue-600 to-cyan-600',
      completed: completedStages.includes('dashboard')
    },
    {
      id: 'crop-selection',
      title: 'Crop Selection',
      description: 'AI-powered crop recommendations',
      icon: Sprout,
      color: 'from-green-600 to-emerald-600',
      completed: completedStages.includes('crop-selection')
    },
    {
      id: 'crop-journaling',
      title: 'Crop Journaling',
      description: 'Track lifecycle & tokenization',
      icon: BookOpen,
      color: 'from-purple-600 to-pink-600',
      completed: completedStages.includes('crop-journaling')
    },
    {
      id: 'harvest-listing',
      title: 'Harvest & Listing',
      description: 'Create commodity lots',
      icon: ShoppingCart,
      color: 'from-orange-600 to-amber-600',
      completed: completedStages.includes('harvest-listing')
    },
    {
      id: 'transport-booking',
      title: 'Transport Booking',
      description: 'Arrange logistics',
      icon: Truck,
      color: 'from-indigo-600 to-purple-600',
      completed: completedStages.includes('transport-booking')
    },
    {
      id: 'destination-receiving',
      title: 'Destination Receiving',
      description: 'OTP confirmation at destination',
      icon: MapPin,
      color: 'from-teal-600 to-cyan-600',
      completed: completedStages.includes('destination-receiving')
    },
    {
      id: 'market-auction',
      title: 'Market & Auction',
      description: 'Live bidding & price discovery',
      icon: Gavel,
      color: 'from-red-600 to-pink-600',
      completed: completedStages.includes('market-auction')
    },
    {
      id: 'sampling-quality',
      title: 'Sampling & Quality',
      description: 'Quality verification',
      icon: FlaskConical,
      color: 'from-yellow-600 to-orange-600',
      completed: completedStages.includes('sampling-quality')
    },
    {
      id: 'weighing-confirmation',
      title: 'Weighing & Settlement',
      description: 'Final confirmation & payment',
      icon: Scale,
      color: 'from-green-600 to-teal-600',
      completed: completedStages.includes('weighing-confirmation')
    }
  ];

  // Calculate progress
  const progress = (completedStages.length / (flowSteps.length - 1)) * 100;

  // Navigation handlers
  const handleStageComplete = (stage: FlowStage, data?: any) => {
    if (!completedStages.includes(stage)) {
      setCompletedStages([...completedStages, stage]);
    }
    
    // Update producer data
    setProducerData({
      ...producerData,
      ...data
    });

    // Move to next stage
    const currentIndex = flowSteps.findIndex(s => s.id === currentStage);
    if (currentIndex < flowSteps.length - 1) {
      setCurrentStage(flowSteps[currentIndex + 1].id);
    } else {
      setCurrentStage('complete');
    }
  };

  const handleBack = () => {
    const currentIndex = flowSteps.findIndex(s => s.id === currentStage);
    if (currentIndex > 0) {
      setCurrentStage(flowSteps[currentIndex - 1].id);
    }
  };

  const handleNavigateToStage = (stage: FlowStage) => {
    setCurrentStage(stage);
  };

  // Render stage content
  const renderStageContent = () => {
    switch (currentStage) {
      case 'dashboard':
        return (
          <ProducerAIDashboardComplete
            producerName={producerData.name}
            onNavigateToFlow={(flow) => {
              if (flow === 'crop-selection') setCurrentStage('crop-selection');
              if (flow === 'create-lot') setCurrentStage('harvest-listing');
            }}
          />
        );

      case 'crop-selection':
        return (
          <CropSelectionWithAI
            producerId={producerData.producerId}
            onComplete={(data) => handleStageComplete('crop-selection', { cropSelection: data })}
            onBack={handleBack}
          />
        );

      case 'crop-journaling':
        return (
          <CropJournalingTokenization
            producerId={producerData.producerId}
            cropData={producerData.cropSelection}
            onComplete={(data) => handleStageComplete('crop-journaling', { journalData: data })}
            onBack={handleBack}
          />
        );

      case 'harvest-listing':
        return (
          <HarvestCommodityListing
            producerId={producerData.producerId}
            journalData={producerData.journalData}
            onComplete={(data) => handleStageComplete('harvest-listing', { commodityListing: data })}
            onBack={handleBack}
          />
        );

      case 'transport-booking':
        return (
          <TransportBooking
            producerId={producerData.producerId}
            commodityData={producerData.commodityListing}
            onComplete={(data) => handleStageComplete('transport-booking', { transportBooking: data })}
            onBack={handleBack}
          />
        );

      case 'destination-receiving':
        return (
          <DestinationReceiving
            producerId={producerData.producerId}
            transportData={producerData.transportBooking}
            onComplete={(data) => handleStageComplete('destination-receiving', { receivingConfirmation: data })}
            onBack={handleBack}
          />
        );

      case 'market-auction':
        return (
          <MarketDisplayAuction
            producerId={producerData.producerId}
            commodityData={producerData.commodityListing}
            onComplete={(data) => handleStageComplete('market-auction', { auctionData: data })}
            onBack={handleBack}
          />
        );

      case 'sampling-quality':
        return (
          <SamplingQualityCheck
            producerId={producerData.producerId}
            auctionData={producerData.auctionData}
            onComplete={(data) => handleStageComplete('sampling-quality', { qualityCheck: data })}
            onBack={handleBack}
          />
        );

      case 'weighing-confirmation':
        return (
          <WeighingConfirmation
            producerId={producerData.producerId}
            qualityData={producerData.qualityCheck}
            onComplete={(data) => handleStageComplete('weighing-confirmation', { weighingData: data })}
            onBack={handleBack}
          />
        );

      case 'complete':
        return (
          <CompletionScreen
            producerData={producerData}
            onReturnToDashboard={() => setCurrentStage('dashboard')}
          />
        );

      default:
        return null;
    }
  };

  // Show progress sidebar or full stage
  const showSidebar = currentStage !== 'dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex">
        
        {/* Progress Sidebar */}
        {showSidebar && (
          <div className="w-80 bg-white border-r border-gray-200 min-h-screen p-6 space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BeautifulButton
                  variant="primary"
                  size="sm"
                  icon={Home}
                  onClick={() => setCurrentStage('dashboard')}
                >
                  Dashboard
                </BeautifulButton>
              </div>
              
              <h2 className="text-xl font-bold mb-2">Producer Flow</h2>
              <p className="text-sm text-gray-600 mb-4">
                {producerData.name} • {producerData.producerId}
              </p>

              {/* Progress */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Progress</span>
                  <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <p className="text-xs text-gray-600">
                {completedStages.length} of {flowSteps.length - 1} stages completed
              </p>
            </div>

            {/* Flow Steps */}
            <div className="space-y-2">
              {flowSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStage === step.id;
                const isCompleted = step.completed;
                const isAccessible = index === 0 || flowSteps[index - 1].completed;

                return (
                  <button
                    key={step.id}
                    onClick={() => isAccessible && handleNavigateToStage(step.id)}
                    disabled={!isAccessible}
                    className={cn(
                      'w-full text-left p-4 rounded-xl transition-all',
                      'border-2',
                      isActive && 'bg-gradient-to-r ' + step.color + ' text-white border-transparent shadow-lg',
                      !isActive && isCompleted && 'bg-green-50 border-green-200 hover:bg-green-100',
                      !isActive && !isCompleted && isAccessible && 'bg-gray-50 border-gray-200 hover:bg-gray-100',
                      !isAccessible && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'p-2 rounded-lg',
                        isActive && 'bg-white/20',
                        !isActive && isCompleted && 'bg-green-100',
                        !isActive && !isCompleted && 'bg-gray-200'
                      )}>
                        {isCompleted ? (
                          <CheckCircle className={cn(
                            'w-5 h-5',
                            isActive ? 'text-white' : 'text-green-600'
                          )} />
                        ) : (
                          <Icon className={cn(
                            'w-5 h-5',
                            isActive ? 'text-white' : 'text-gray-600'
                          )} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={cn(
                            'font-semibold text-sm',
                            !isActive && !isCompleted && 'text-gray-700'
                          )}>
                            {step.title}
                          </h4>
                          {isActive && <ChevronRight className="w-4 h-4" />}
                        </div>
                        <p className={cn(
                          'text-xs',
                          isActive ? 'text-white/90' : 'text-gray-600'
                        )}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Stats */}
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
              <h4 className="font-semibold mb-3">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Lots</span>
                  <Badge className="bg-blue-600">3</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">In Transit</span>
                  <Badge className="bg-orange-600">1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">At Auction</span>
                  <Badge className="bg-green-600">2</Badge>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1">
          {renderStageContent()}
        </div>
      </div>
    </div>
  );
};

// ==================== COMPLETION SCREEN ====================

interface CompletionScreenProps {
  producerData: ProducerData;
  onReturnToDashboard: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  producerData,
  onReturnToDashboard
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-8 text-center">
        
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">
          🎉 Transaction Complete!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your commodity has been successfully sold and payment settlement is in progress.
        </p>

        {/* Summary */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-green-50 to-emerald-50">
          <h3 className="font-semibold mb-4">Transaction Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-600">Producer</p>
              <p className="font-semibold">{producerData.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ID</p>
              <p className="font-semibold">{producerData.producerId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Commodity</p>
              <p className="font-semibold">
                {producerData.commodityListing?.commodity || 'Wheat Grade A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Quantity</p>
              <p className="font-semibold">
                {producerData.weighingData?.totalWeight || '100'} quintals
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Final Price</p>
              <p className="font-semibold text-green-600 text-xl">
                ₹{producerData.weighingData?.finalAmount?.toLocaleString() || '2,40,000'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <Badge className="bg-green-600">Processing</Badge>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <ButtonGroup orientation="horizontal" className="justify-center">
          <BeautifulButton
            variant="gradient"
            size="lg"
            icon={LayoutDashboard}
            onClick={onReturnToDashboard}
          >
            Return to Dashboard
          </BeautifulButton>
          
          <BeautifulButton
            variant="success"
            size="lg"
            icon={Sprout}
            onClick={() => window.location.reload()}
          >
            Start New Cycle
          </BeautifulButton>
        </ButtonGroup>

        {/* Next Steps */}
        <div className="mt-8 text-left">
          <h4 className="font-semibold mb-3">Next Steps</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Payment will be credited within 24-48 hours
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Commission deducted automatically
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Transaction receipt sent to your email
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Quality tokens updated in your profile
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default ProducerMasterFlowNavigator;
