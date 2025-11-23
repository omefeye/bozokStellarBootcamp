'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Zap,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  Upload,
  TrendingUp,
  Shield,
  Users,
  Wallet,
  Lock
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function ListChargerPage() {
  const { isConnected, connect, checkConnection } = useWalletStore();

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);
  const [formData, setFormData] = useState({
    chargerName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    chargerType: '',
    powerOutput: '',
    numberOfPorts: '',
    pricePerKwh: '',
    availability: '',
    description: '',
    expectedRevenue: '',
    fundingGoal: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Charger listing submitted for review!');
  };

  const handleConnect = async () => {
    try {
      await connect();
      toast.success('Wallet connected successfully');
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  // If wallet not connected, show connect screen
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-8">
            <div className="text-center space-y-4 max-w-2xl">
              <div className="bg-teal-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="h-12 w-12 text-teal-400" />
              </div>
              <h1 className="text-4xl font-bold text-white">
                Connect Your Wallet
              </h1>
              <p className="text-xl text-gray-300">
                You need to connect your Stellar wallet to list a charging station on VoltStellar
              </p>
            </div>
            
            <Button 
              onClick={handleConnect}
              className="px-8 py-6 text-lg bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Wallet className="h-5 w-5 mr-2" />
              Connect Wallet
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-8">
              <Card className="bg-slate-800/50 border-slate-700 text-center">
                <CardHeader>
                  <Shield className="h-12 w-12 mx-auto text-teal-400" />
                  <CardTitle className="text-lg text-white">Secure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    Your wallet stays in your control. We never access your private keys.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700 text-center">
                <CardHeader>
                  <Zap className="h-12 w-12 mx-auto text-yellow-400" />
                  <CardTitle className="text-lg text-white">Fast Setup</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    Connect in seconds using Freighter or any Stellar wallet.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700 text-center">
                <CardHeader>
                  <DollarSign className="h-12 w-12 mx-auto text-green-400" />
                  <CardTitle className="text-lg text-white">Earn Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">
                    Start earning passive income from your charging station.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            List Your Charging Station
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Share your EV charger with the community and earn passive income through the VoltStellar network
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Charger Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Provide details about your charging station to list it on our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-teal-400" />
                      Location Details
                    </h3>
                    
                    <div>
                      <Label htmlFor="chargerName" className="text-gray-300">Charger Name</Label>
                      <Input
                        id="chargerName"
                        placeholder="e.g., Downtown Fast Charger"
                        value={formData.chargerName}
                        onChange={(e) => handleInputChange('chargerName', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-gray-300">Street Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-gray-300">City</Label>
                        <Input
                          id="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-gray-300">State</Label>
                        <Input
                          id="state"
                          placeholder="State"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode" className="text-gray-300">Zip Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="12345"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Charger Specifications */}
                  <div className="space-y-4 pt-6 border-t border-slate-700">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-teal-400" />
                      Charger Specifications
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="chargerType" className="text-gray-300">Charger Type</Label>
                        <Select value={formData.chargerType} onValueChange={(value) => handleInputChange('chargerType', value)}>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="fast">DC Fast Charge</SelectItem>
                            <SelectItem value="level2">Level 2 AC</SelectItem>
                            <SelectItem value="level1">Level 1 AC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="powerOutput" className="text-gray-300">Power Output</Label>
                        <Select value={formData.powerOutput} onValueChange={(value) => handleInputChange('powerOutput', value)}>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                            <SelectValue placeholder="Select power" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="250">250 kW</SelectItem>
                            <SelectItem value="150">150 kW</SelectItem>
                            <SelectItem value="50">50 kW</SelectItem>
                            <SelectItem value="22">22 kW</SelectItem>
                            <SelectItem value="11">11 kW</SelectItem>
                            <SelectItem value="7">7 kW</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="numberOfPorts" className="text-gray-300">Number of Ports</Label>
                        <Input
                          id="numberOfPorts"
                          type="number"
                          placeholder="1"
                          value={formData.numberOfPorts}
                          onChange={(e) => handleInputChange('numberOfPorts', e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="pricePerKwh" className="text-gray-300">Price per kWh (XLM)</Label>
                        <Input
                          id="pricePerKwh"
                          type="number"
                          step="0.01"
                          placeholder="3.5"
                          value={formData.pricePerKwh}
                          onChange={(e) => handleInputChange('pricePerKwh', e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="availability" className="text-gray-300">Availability</Label>
                      <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="24/7">24/7</SelectItem>
                          <SelectItem value="business">Business Hours</SelectItem>
                          <SelectItem value="custom">Custom Schedule</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4 pt-6 border-t border-slate-700">
                    <h3 className="text-lg font-semibold text-white">Additional Information</h3>
                    
                    <div>
                      <Label htmlFor="description" className="text-gray-300">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your charger location, accessibility, nearby amenities..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500 min-h-24"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300">Upload Photos</Label>
                      <div className="mt-2 border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-teal-500 transition-colors cursor-pointer">
                        <Upload className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
                        <p className="text-gray-500 text-xs mt-1">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Funding Options */}
                  <div className="space-y-4 pt-6 border-t border-slate-700">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-teal-400" />
                      Community Funding (Optional)
                    </h3>
                    
                    <p className="text-gray-400 text-sm">
                      Allow the community to invest in your charger and share revenue
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expectedRevenue" className="text-gray-300">Expected Monthly Revenue (XLM)</Label>
                        <Input
                          id="expectedRevenue"
                          type="number"
                          placeholder="1000"
                          value={formData.expectedRevenue}
                          onChange={(e) => handleInputChange('expectedRevenue', e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="fundingGoal" className="text-gray-300">Funding Goal (XLM)</Label>
                        <Input
                          id="fundingGoal"
                          type="number"
                          placeholder="50000"
                          value={formData.fundingGoal}
                          onChange={(e) => handleInputChange('fundingGoal', e.target.value)}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white py-6 text-lg">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Submit for Review
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Why List Your Charger?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="bg-teal-500/20 p-2 rounded-lg h-fit">
                    <DollarSign className="h-5 w-5 text-teal-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Earn Passive Income</h4>
                    <p className="text-gray-400 text-xs mt-1">
                      Generate revenue from every charging session
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg h-fit">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Community Support</h4>
                    <p className="text-gray-400 text-xs mt-1">
                      Get funding from investors who believe in clean energy
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-green-500/20 p-2 rounded-lg h-fit">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Growing Market</h4>
                    <p className="text-gray-400 text-xs mt-1">
                      EV adoption is accelerating rapidly
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-purple-500/20 p-2 rounded-lg h-fit">
                    <Shield className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">Blockchain Security</h4>
                    <p className="text-gray-400 text-xs mt-1">
                      Transparent and secure transactions on Stellar
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-gradient-to-br from-teal-500/20 to-blue-500/20 border-teal-500/30">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">8,500 XLM</div>
                  <div className="text-sm text-gray-300">Average Monthly Revenue</div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">120+</div>
                    <div className="text-xs text-gray-300">Listed Chargers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">98%</div>
                    <div className="text-xs text-gray-300">Owner Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Our team is here to help you get started with listing your charger.
                </p>
                <Button variant="outline" className="w-full bg-slate-700/50 text-white border-slate-600 hover:bg-slate-700">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
