'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletStore } from '@/stores/wallet';
import { investInProject } from '@/lib/contract';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Search,
  Zap,
  CheckCircle,
  Clock,
  Navigation,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface ChargerStation {
  id: number;
  name: string;
  distance: string;
  rating: number;
  type: 'Fast Charge' | 'Home Charger' | 'Standard';
  status: 'Available Now' | 'In Use';
  price: string;
  image: string;
}

interface FundingProject {
  id: number;
  name: string;
  location: string;
  status: 'Active' | 'New';
  fundingProgress: number;
  currentAmount: number;
  goalAmount: number;
  investors: number;
  estimatedAPY: number;
}

export default function HomePage() {
  const router = useRouter();
  const { isConnected, address, network, checkConnection, refreshBalance } = useWalletStore();
  const [location, setLocation] = useState('');
  const [selectedProject, setSelectedProject] = useState<FundingProject | null>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);
  const [showInvestDialog, setShowInvestDialog] = useState(false);
  const [selectedStation, setSelectedStation] = useState<ChargerStation | null>(null);
  const [showStationDialog, setShowStationDialog] = useState(false);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const handleSearch = () => {
    // Navigate to find-chargers page with location query parameter
    if (location.trim()) {
      router.push(`/find-chargers?location=${encodeURIComponent(location)}`);
    } else {
      router.push('/find-chargers');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInvestClick = (project: FundingProject) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    setSelectedProject(project);
    setInvestAmount('500');
    setShowInvestDialog(true);
  };

  const handleStationClick = (station: ChargerStation) => {
    setSelectedStation(station);
    setShowStationDialog(true);
  };

  const handleGetDirections = () => {
    toast.success('Navigation feature coming soon!', {
      description: 'Google Maps integration will be available in the next update.'
    });
    setShowStationDialog(false);
  };

  const handleInvestConfirm = async () => {
    if (!selectedProject || !address) return;

    const amount = parseFloat(investAmount);
    
    if (isNaN(amount) || amount < 100) {
      toast.error('Minimum investment is 100 XLM');
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
  
  const chargerStations: ChargerStation[] = [
    {
      id: 1,
      name: 'Downtown EV Hub',
      distance: '1.2 mi',
      rating: 4.8,
      type: 'Fast Charge',
      status: 'Available Now',
      price: '3.5 XLM/kWh',
      image: '/charger1.jpg'
    },
    {
      id: 2,
      name: 'Green Valley Home Charger',
      distance: '1.2 mi',
      rating: 4.9,
      type: 'Home Charger',
      status: 'Available Now',
      price: '2.8 XLM/kWh',
      image: '/charger2.jpg'
    },
    {
      id: 3,
      name: 'Tech Park SuperCharger',
      distance: '2.1 mi',
      rating: 4.7,
      type: 'Fast Charge',
      status: 'In Use',
      price: '4.2 XLM/kWh',
      image: '/charger3.jpg'
    },
    {
      id: 4,
      name: 'Riverside Charging Point',
      distance: '2.8 mi',
      rating: 4.6,
      type: 'Standard',
      status: 'Available Now',
      price: '2.5 XLM/kWh',
      image: '/charger4.jpg'
    }
  ];

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
      estimatedAPY: 8.5
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
      estimatedAPY: 7.2
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
      estimatedAPY: 9.1
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900">
      <Header />
      
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-6 mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
            Charge Anywhere,
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold text-teal-400">
            Earn Passive Income
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl">
            Join the decentralized electric vehicle charging network. Find chargers near you or 
            invest in charging infrastructure on the Stellar blockchain.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mt-8">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter your location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 pr-4 py-6 text-lg bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-400 rounded-xl"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="px-8 py-6 text-lg bg-teal-500 hover:bg-teal-600 text-white rounded-xl"
              >
                <Search className="h-5 w-5 mr-2" />
                Find Chargers
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>500+ Active Chargers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span>Built on Stellar</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="h-5 w-5 text-blue-400" />
              <span>Real-Time Payments</span>
            </div>
          </div>
        </div>

        {/* Charging Stations Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Charging Stations Near You</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-teal-500/20 text-teal-400 border-teal-500/30 hover:bg-teal-500/30">
                All
              </Button>
              <Button variant="outline" size="sm" className="bg-slate-800/50 text-gray-300 border-slate-700 hover:bg-slate-700">
                Fast Charge
              </Button>
              <Button variant="outline" size="sm" className="bg-slate-800/50 text-gray-300 border-slate-700 hover:bg-slate-700">
                Home Charger
              </Button>
              <Button variant="outline" size="sm" className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
                Verified
              </Button>
              <Button variant="outline" size="sm" className="bg-slate-800/50 text-gray-300 border-slate-700 hover:bg-slate-700">
                Available Now
              </Button>
            </div>
          </div>

          <p className="text-gray-400 mb-8">
            Browse available charging stations and start charging instantly
          </p>

          {/* Charger Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {chargerStations.map((station) => (
              <Card key={station.id} className="bg-slate-800/50 border-slate-700 overflow-hidden hover:border-teal-500/50 transition-all">
                <div className="relative h-48 bg-slate-700 overflow-hidden">
                  {/* Background Image */}
                  <img 
                    src={station.image} 
                    alt={station.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Status Badge */}
                  {station.status === 'Available Now' && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-green-500 hover:bg-green-600 text-white">
                        {station.status}
                      </Badge>
                    </div>
                  )}
                  {station.status === 'In Use' && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gray-600 hover:bg-gray-700 text-white">
                        {station.status}
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">{station.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Navigation className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">{station.distance}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-yellow-400">★ {station.rating}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                      {station.type}
                    </Badge>
                    <span className="text-white font-semibold">{station.price}</span>
                  </div>
                  <Button 
                    onClick={() => handleStationClick(station)}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Funding Section */}
        <div className="mt-32">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Community Funding</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Invest in charging infrastructure and earn passive income through fractional 
              ownership tokens on Stellar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {fundingProjects.map((project) => (
              <Card key={project.id} className="bg-slate-800/50 border-slate-700 hover:border-teal-500/50 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-white text-xl">{project.name}</CardTitle>
                    <Badge className={project.status === 'Active' ? 'bg-green-500' : 'bg-teal-500'}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{project.location}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                    <div>
                      <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Investors</span>
                      </div>
                      <div className="text-white text-2xl font-bold">{project.investors}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>Est. APY</span>
                      </div>
                      <div className="text-green-400 text-2xl font-bold">{project.estimatedAPY}%</div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleInvestClick(project)}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Invest XLM
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How it Works */}
          <Card className="bg-slate-800/30 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center">How it Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-gray-300 space-y-2">
                <p className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">•</span>
                  <span>Invest in charging infrastructure projects and receive fractional ownership tokens</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">•</span>
                  <span>Earn passive income from charging fees collected by the station</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-teal-400 font-bold">•</span>
                  <span>All transactions are secured on the Stellar blockchain with transparent revenue sharing</span>
                </p>
              </div>
              <div className="mt-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <p className="text-xs text-gray-400 italic">
                  <span className="font-semibold text-yellow-400">Note:</span> This is a demonstration. Real investments would involve proper tokenization, legal compliance, and risk disclosures.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Investment Dialog */}
      <Dialog open={showInvestDialog} onOpenChange={setShowInvestDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">Invest in {selectedProject?.name}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedProject?.location}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Project Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-700/50 rounded-lg">
              <div>
                <div className="text-xs text-gray-400 mb-1">Current Funding</div>
                <div className="text-lg font-bold text-teal-400">
                  {selectedProject?.currentAmount.toLocaleString()} XLM
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Goal Amount</div>
                <div className="text-lg font-bold">
                  {selectedProject?.goalAmount.toLocaleString()} XLM
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Est. APY</div>
                <div className="text-lg font-bold text-green-400">
                  {selectedProject?.estimatedAPY}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Investors</div>
                <div className="text-lg font-bold">{selectedProject?.investors}</div>
              </div>
            </div>

            {/* Investment Amount */}
            <div className="space-y-2">
              <Label htmlFor="invest-amount" className="text-gray-300">
                Investment Amount (XLM)
              </Label>
              <Input
                id="invest-amount"
                type="number"
                placeholder="Enter amount in XLM"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                min="100"
              />
              <p className="text-xs text-gray-400">Minimum investment: 100 XLM</p>
            </div>

            {/* Expected Returns */}
            {investAmount && parseFloat(investAmount) >= 100 && (
              <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Your Investment</span>
                  <span className="font-bold">{parseFloat(investAmount).toLocaleString()} XLM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Est. Annual Return</span>
                  <span className="font-bold text-green-400">
                    {((parseFloat(investAmount) * (selectedProject?.estimatedAPY || 0)) / 100).toFixed(2)} XLM
                  </span>
                </div>
              </div>
            )}

            {/* Wallet Info */}
            {isConnected && (
              <div className="text-xs text-gray-400">
                <div>Connected wallet: {address?.substring(0, 10)}...{address?.substring(address.length - 4)}</div>
                <div>Network: {network}</div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowInvestDialog(false)}
              disabled={isInvesting}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvestConfirm}
              disabled={isInvesting || !investAmount || parseFloat(investAmount) < 100}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              {isInvesting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Confirm Investment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Station Details Dialog */}
      <Dialog open={showStationDialog} onOpenChange={setShowStationDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedStation?.name}</DialogTitle>
            <DialogDescription className="text-gray-400 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {selectedStation?.distance} away • ★ {selectedStation?.rating}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Station Image */}
            <div className="relative h-64 bg-slate-700 rounded-lg overflow-hidden">
              <img 
                src={selectedStation?.image} 
                alt={selectedStation?.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {selectedStation?.status === 'Available Now' && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-500 text-white">
                    {selectedStation?.status}
                  </Badge>
                </div>
              )}
              {selectedStation?.status === 'In Use' && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gray-600 text-white">
                    {selectedStation?.status}
                  </Badge>
                </div>
              )}
            </div>

            {/* Station Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Zap className="h-4 w-4" />
                  <span>Charger Type</span>
                </div>
                <div className="text-lg font-bold text-white">{selectedStation?.type}</div>
              </div>
              
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Price</span>
                </div>
                <div className="text-lg font-bold text-teal-400">{selectedStation?.price}</div>
              </div>

              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Navigation className="h-4 w-4" />
                  <span>Distance</span>
                </div>
                <div className="text-lg font-bold text-white">{selectedStation?.distance}</div>
              </div>

              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Rating</span>
                </div>
                <div className="text-lg font-bold text-yellow-400">★ {selectedStation?.rating}</div>
              </div>
            </div>

            {/* Features */}
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
              <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>24/7 Available</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Real-time Status</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>XLM Payment</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-sm text-gray-400">
              <p>Pay with Stellar (XLM) for instant, low-cost transactions. Simply connect your wallet and start charging.</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStationDialog(false)}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              Close
            </Button>
            <Button
              onClick={handleGetDirections}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
