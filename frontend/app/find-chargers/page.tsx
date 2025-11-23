'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Navigation,
  Filter,
  Clock,
  DollarSign,
  CheckCircle
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
  address: string;
  power: string;
  available: number;
  total: number;
  image: string;
}

export default function FindChargersPage() {
  const searchParams = useSearchParams();
  const [location, setLocation] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<ChargerStation | null>(null);
  const [showStationDialog, setShowStationDialog] = useState(false);

  // Get location from URL query parameter
  useEffect(() => {
    const locationParam = searchParams.get('location');
    if (locationParam) {
      setLocation(locationParam);
      setSearchQuery(locationParam);
    }
  }, [searchParams]);

  const handleSearch = () => {
    setSearchQuery(location);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStationClick = (station: ChargerStation) => {
    setSelectedStation(station);
    setShowStationDialog(true);
  };

  const handleGetDirections = () => {
    toast.success('Navigation feature coming soon!', {
      description: 'Google Maps integration will be available in the next update.'
    });
  };

  const chargerStations: ChargerStation[] = [
    {
      id: 1,
      name: 'Downtown EV Hub',
      distance: '0.3 mi',
      rating: 4.8,
      type: 'Fast Charge',
      status: 'Available Now',
      price: '3.5 XLM/kWh',
      address: '123 Main Street, Downtown',
      power: '150 kW',
      available: 3,
      total: 4,
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
      address: '456 Oak Avenue, Green Valley',
      power: '7 kW',
      available: 1,
      total: 1,
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
      address: '789 Innovation Drive, Tech Park',
      power: '250 kW',
      available: 0,
      total: 6,
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
      address: '321 River Road, Riverside',
      power: '22 kW',
      available: 2,
      total: 2,
      image: '/charger4.jpg'
    },
    {
      id: 5,
      name: 'Airport Fast Charge Hub',
      distance: '3.5 mi',
      rating: 4.9,
      type: 'Fast Charge',
      status: 'Available Now',
      price: '3.8 XLM/kWh',
      address: '555 Airport Boulevard',
      power: '150 kW',
      available: 8,
      total: 10,
      image: '/charger1.jpg'
    },
    {
      id: 6,
      name: 'Shopping Center Chargers',
      distance: '4.2 mi',
      rating: 4.5,
      type: 'Standard',
      status: 'Available Now',
      price: '3.0 XLM/kWh',
      address: '888 Mall Drive, Shopping District',
      power: '11 kW',
      available: 4,
      total: 8,
      image: '/charger2.jpg'
    }
  ];

  const filters = ['All', 'Fast Charge', 'Home Charger', 'Standard', 'Available Now'];

  const filteredStations = chargerStations.filter(station => {
    // Filter by selected category
    let matchesFilter = true;
    if (selectedFilter !== 'All') {
      if (selectedFilter === 'Available Now') {
        matchesFilter = station.status === 'Available Now';
      } else {
        matchesFilter = station.type === selectedFilter;
      }
    }

    // Filter by search query
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      matchesSearch = 
        station.name.toLowerCase().includes(query) ||
        station.address.toLowerCase().includes(query) ||
        station.type.toLowerCase().includes(query);
    }

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Find Charging Stations</h1>
          <p className="text-gray-300 text-lg mb-6">
            Discover EV charging stations near you and start charging instantly
          </p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter your location or address..."
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
              Search
            </Button>
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg">
              <p className="text-teal-400 text-sm">
                Showing results for: <span className="font-semibold">"{searchQuery}"</span>
              </p>
            </div>
          )}

          {/* Filters */}
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={
                    selectedFilter === filter
                      ? 'bg-teal-500/20 text-teal-400 border-teal-500/30 hover:bg-teal-500/30'
                      : 'bg-slate-800/50 text-gray-300 border-slate-700 hover:bg-slate-700'
                  }
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-400">
            Found <span className="text-white font-semibold">{filteredStations.length}</span> charging stations
          </p>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <Card key={station.id} className="bg-slate-800/50 border-slate-700 hover:border-teal-500/50 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-white text-xl">{station.name}</CardTitle>
                  <Badge className={station.status === 'Available Now' ? 'bg-green-500' : 'bg-gray-600'}>
                    {station.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Navigation className="h-4 w-4" />
                  <span>{station.distance}</span>
                  <span>•</span>
                  <span className="text-yellow-400">★ {station.rating}</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">{station.address}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <Zap className="h-3 w-3" />
                      <span>Power</span>
                    </div>
                    <div className="text-white font-semibold">{station.power}</div>
                  </div>
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      <DollarSign className="h-3 w-3" />
                      <span>Price</span>
                    </div>
                    <div className="text-white font-semibold">{station.price}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-gray-400 text-sm">Available</span>
                  <span className="text-white font-semibold">
                    {station.available}/{station.total} ports
                  </span>
                </div>

                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-teal-500/20 text-teal-400 border-teal-500/30">
                    {station.type}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleGetDirections}
                    className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                  <Button 
                    onClick={() => handleStationClick(station)}
                    variant="outline" 
                    className="flex-1 bg-slate-700/50 text-white border-slate-600 hover:bg-slate-700"
                  >
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map Placeholder */}
        <Card className="mt-8 bg-slate-800/30 border-slate-700">
          <CardContent className="p-8">
            <div className="flex items-center justify-center h-64 bg-slate-700/50 rounded-lg">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Map View Coming Soon</p>
                <p className="text-sm text-gray-500 mt-2">Interactive map will show all charging stations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

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

            {/* Address */}
            <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
              <div className="flex items-start gap-2 text-gray-300">
                <MapPin className="h-5 w-5 text-teal-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-400 mb-1">Address</div>
                  <div className="text-white">{selectedStation?.address}</div>
                </div>
              </div>
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
                  <DollarSign className="h-4 w-4" />
                  <span>Price</span>
                </div>
                <div className="text-lg font-bold text-teal-400">{selectedStation?.price}</div>
              </div>

              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <Zap className="h-4 w-4" />
                  <span>Power Output</span>
                </div>
                <div className="text-lg font-bold text-white">{selectedStation?.power}</div>
              </div>

              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Available Ports</span>
                </div>
                <div className="text-lg font-bold text-green-400">{selectedStation?.available}/{selectedStation?.total}</div>
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
