'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { investInProject } from '@/lib/contract';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  MapPin,
  Zap,
  TrendingUp,
  CheckCircle,
  Users,
  DollarSign,
  Calendar,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface FundingProject {
  id: number;
  name: string;
  location: string;
  status: 'Active' | 'New' | 'Coming Soon';
  fundingProgress: number;
  currentAmount: number;
  goalAmount: number;
  investors: number;
  estimatedAPY: number;
  minInvestment: number;
  duration: string;
  description: string;
  chargerType: string;
  powerOutput: string;
}

export default function InvestPage() {
  const { isConnected, address, network, checkConnection, refreshBalance } = useWalletStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<FundingProject | null>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);
  const [showInvestDialog, setShowInvestDialog] = useState(false);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const handleInvestClick = (project: FundingProject) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    setSelectedProject(project);
    setInvestAmount(project.minInvestment.toString());
    setShowInvestDialog(true);
  };

  const handleInvestConfirm = async () => {
    if (!selectedProject || !address) return;

    const amount = parseFloat(investAmount);
    
    if (isNaN(amount) || amount < selectedProject.minInvestment) {
      toast.error(`Minimum investment is ${selectedProject.minInvestment} XLM`);
      return;
    }

    setIsInvesting(true);

    try {
      const result = await investInProject(
        selectedProject.id,
        address,
        amount,
        network
      );

      if (result.success) {
        toast.success(
          `Successfully invested ${amount} XLM in ${selectedProject.name}!`,
          {
            description: `Transaction: ${result.txHash?.substring(0, 20)}...`
          }
        );
        
        // Refresh balance from blockchain
        await refreshBalance();
        
        setShowInvestDialog(false);
        setInvestAmount('');
        setSelectedProject(null);
      } else {
        toast.error(`Investment failed: ${result.error}`);
      }
    } catch (error) {
      toast.error('Investment transaction failed');
      console.error('Investment error:', error);
    } finally {
      setIsInvesting(false);
    }
  };

  const fundingProjects: FundingProject[] = [
    {
      id: 1,
      name: 'Downtown Supercharger #4',
      location: 'Central Business District',
      status: 'Active',
      fundingProgress: 65,
      currentAmount: 32500,
      goalAmount: 50000,
      investors: 234,
      estimatedAPY: 8.5,
      minInvestment: 100,
      duration: '24 months',
      description: 'High-traffic location with guaranteed daily usage from office workers and residents.',
      chargerType: 'DC Fast Charger',
      powerOutput: '150 kW'
    },
    {
      id: 2,
      name: 'Highway Rest Stop Charger',
      location: 'I-95 North, Exit 42',
      status: 'Active',
      fundingProgress: 80,
      currentAmount: 28000,
      goalAmount: 35000,
      investors: 156,
      estimatedAPY: 7.2,
      minInvestment: 100,
      duration: '18 months',
      description: 'Strategic highway location serving long-distance EV travelers.',
      chargerType: 'DC Fast Charger',
      powerOutput: '250 kW'
    },
    {
      id: 3,
      name: 'Shopping Mall Charging Hub',
      location: 'Green Valley Mall',
      status: 'New',
      fundingProgress: 27,
      currentAmount: 12000,
      goalAmount: 45000,
      investors: 89,
      estimatedAPY: 9.1,
      minInvestment: 100,
      duration: '30 months',
      description: 'Premium shopping destination with high foot traffic and long parking durations.',
      chargerType: 'Level 2 AC Charger',
      powerOutput: '22 kW'
    },
    {
      id: 4,
      name: 'Airport Parking Lot Network',
      location: 'International Airport Terminal',
      status: 'Active',
      fundingProgress: 45,
      currentAmount: 36000,
      goalAmount: 80000,
      investors: 312,
      estimatedAPY: 8.8,
      minInvestment: 250,
      duration: '36 months',
      description: 'Multi-charger installation serving airport visitors and employees.',
      chargerType: 'Mixed (DC + AC)',
      powerOutput: '150 kW / 22 kW'
    },
    {
      id: 5,
      name: 'University Campus Charging',
      location: 'State University Main Campus',
      status: 'New',
      fundingProgress: 15,
      currentAmount: 6000,
      goalAmount: 40000,
      investors: 45,
      estimatedAPY: 7.5,
      minInvestment: 50,
      duration: '24 months',
      description: 'Student and faculty parking area with growing EV adoption.',
      chargerType: 'Level 2 AC Charger',
      powerOutput: '11 kW'
    },
    {
      id: 6,
      name: 'Residential Complex Network',
      location: 'Lakeview Apartments',
      status: 'Coming Soon',
      fundingProgress: 0,
      currentAmount: 0,
      goalAmount: 30000,
      investors: 0,
      estimatedAPY: 6.8,
      minInvestment: 100,
      duration: '24 months',
      description: 'Exclusive charging access for 200+ unit residential building.',
      chargerType: 'Level 2 AC Charger',
      powerOutput: '7 kW'
    }
  ];

  const categories = ['All', 'Active', 'New', 'Coming Soon'];

  const filteredProjects = fundingProjects.filter(project => {
    if (selectedCategory === 'All') return true;
    return project.status === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Invest in EV Infrastructure
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Earn passive income by investing in charging stations through fractional ownership tokens on Stellar
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-teal-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">$2.5M+</div>
                <div className="text-sm text-gray-400">Total Invested</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">1,200+</div>
                <div className="text-sm text-gray-400">Active Investors</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">45</div>
                <div className="text-sm text-gray-400">Funded Stations</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white">7.8%</div>
                <div className="text-sm text-gray-400">Avg. APY</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-gray-400 font-medium">Filter by:</span>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? 'bg-teal-500/20 text-teal-400 border-teal-500/30 hover:bg-teal-500/30'
                    : 'bg-slate-800/50 text-gray-300 border-slate-700 hover:bg-slate-700'
                }
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="ml-auto text-gray-400">
            <span className="text-white font-semibold">{filteredProjects.length}</span> projects
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="bg-slate-800/50 border-slate-700 hover:border-teal-500/50 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-white text-2xl">{project.name}</CardTitle>
                  <Badge className={
                    project.status === 'Active' ? 'bg-green-500' :
                    project.status === 'New' ? 'bg-teal-500' :
                    'bg-gray-600'
                  }>
                    {project.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{project.location}</span>
                </div>
                <p className="text-gray-300 text-sm mt-3">{project.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Funding Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Funding Progress</span>
                    <span className="text-white font-semibold">{project.fundingProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-teal-500 h-full rounded-full transition-all"
                      style={{ width: `${project.fundingProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-teal-400 font-semibold">
                      {project.currentAmount.toLocaleString()} XLM
                    </span>
                    <span className="text-gray-400">
                      of {project.goalAmount.toLocaleString()} XLM
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Charger Type</div>
                    <div className="text-white text-sm font-semibold">{project.chargerType}</div>
                  </div>
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Power Output</div>
                    <div className="text-white text-sm font-semibold">{project.powerOutput}</div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <Users className="h-3 w-3" />
                      <span>Investors</span>
                    </div>
                    <div className="text-white text-xl font-bold">{project.investors}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Est. APY</span>
                    </div>
                    <div className="text-green-400 text-xl font-bold">{project.estimatedAPY}%</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                      <Calendar className="h-3 w-3" />
                      <span>Duration</span>
                    </div>
                    <div className="text-white text-sm font-bold">{project.duration}</div>
                  </div>
                </div>

                <div className="bg-slate-700/30 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Min. Investment</span>
                    <span className="text-white font-semibold">{project.minInvestment} XLM</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                  disabled={project.status === 'Coming Soon'}
                  onClick={() => handleInvestClick(project)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {project.status === 'Coming Soon' ? 'Coming Soon' : 'Invest Now'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Investment Dialog */}
        <Dialog open={showInvestDialog} onOpenChange={setShowInvestDialog}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl">Invest in {selectedProject?.name}</DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter the amount of XLM you want to invest in this charging station project
              </DialogDescription>
            </DialogHeader>
            
            {selectedProject && (
              <div className="space-y-4 py-4">
                <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Location</span>
                    <span className="text-white">{selectedProject.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated APY</span>
                    <span className="text-green-400 font-semibold">{selectedProject.estimatedAPY}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">{selectedProject.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Min. Investment</span>
                    <span className="text-white">{selectedProject.minInvestment} XLM</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invest-amount">Investment Amount (XLM)</Label>
                  <Input
                    id="invest-amount"
                    type="number"
                    min={selectedProject.minInvestment}
                    step="10"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white text-lg"
                    placeholder={`Min. ${selectedProject.minInvestment} XLM`}
                  />
                  <p className="text-xs text-gray-400">
                    You will receive fractional ownership tokens proportional to your investment
                  </p>
                </div>

                <div className="bg-teal-500/10 border border-teal-500/30 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1 text-sm">
                      <p className="text-white font-semibold">What you'll get:</p>
                      <ul className="text-gray-300 space-y-1">
                        <li>• Fractional ownership tokens on Stellar blockchain</li>
                        <li>• Passive income from charging fees</li>
                        <li>• Transparent revenue sharing via smart contract</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowInvestDialog(false)}
                disabled={isInvesting}
                className="bg-slate-700/50 text-white border-slate-600 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInvestConfirm}
                disabled={isInvesting || !investAmount || parseFloat(investAmount) < (selectedProject?.minInvestment || 0)}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                {isInvesting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Confirm Investment
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* How it Works */}
        <Card className="mt-12 bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">How Investment Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-teal-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-teal-400">1</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Choose a Project</h3>
                <p className="text-gray-400 text-sm">
                  Browse available charging infrastructure projects and select one that matches your investment goals
                </p>
              </div>
              <div className="text-center">
                <div className="bg-teal-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-teal-400">2</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Invest XLM</h3>
                <p className="text-gray-400 text-sm">
                  Invest your desired amount in XLM and receive fractional ownership tokens on Stellar blockchain
                </p>
              </div>
              <div className="text-center">
                <div className="bg-teal-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-teal-400">3</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Earn Returns</h3>
                <p className="text-gray-400 text-sm">
                  Receive passive income from charging fees proportional to your token ownership
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <p className="text-xs text-gray-400 italic">
                <span className="font-semibold text-yellow-400">Note:</span> This is a demonstration. Real investments would involve proper tokenization, legal compliance, KYC requirements, and comprehensive risk disclosures.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
