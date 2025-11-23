'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useWalletStore } from '@/stores/wallet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Wallet, 
  Network, 
  Settings, 
  LogOut,
  ExternalLink,
  Copy,
  ChevronDown 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { truncateAddress, getExplorerUrl } from '@/lib/stellar';
import { toast } from 'sonner';

export function Header() {
  const {
    isConnected,
    address,
    balance,
    network,
    isLoading,
    connect,
    disconnect,
    switchNetwork,
    checkConnection
  } = useWalletStore();

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const handleConnect = async () => {
    try {
      await connect();
      toast.success('Wallet connected successfully');
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info('Wallet disconnected');
  };

  const handleNetworkSwitch = async (newNetwork: 'testnet' | 'mainnet') => {
    if (newNetwork === network) return;
    
    try {
      await switchNetwork(newNetwork);
      toast.success(`Switched to ${newNetwork}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to switch to ${newNetwork}`;
      
      // Check if this is a manual switch required error
      if (errorMessage.includes('Please switch to')) {
        toast.error(errorMessage, {
          duration: 6000, // Show longer for important instructions
        });
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  const openInExplorer = () => {
    if (address) {
      window.open(getExplorerUrl(address, 'account', network), '_blank');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-full">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-teal-500 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">VoltStellar</h1>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/find-chargers" 
              className="text-sm font-medium text-gray-300 transition-colors hover:text-teal-400"
            >
              Find Chargers
            </Link>
            <Link 
              href="/invest" 
              className="text-sm font-medium text-gray-300 transition-colors hover:text-teal-400"
            >
              Invest
            </Link>
            <Link 
              href="/list-charger" 
              className="text-sm font-medium text-gray-300 transition-colors hover:text-teal-400"
            >
              List Your Charger
            </Link>
          </nav>
        </div>

        {/* Wallet Section */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Network Selector */}
          {isConnected && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Network className="h-4 w-4" />
                  <Badge variant={network === 'testnet' ? 'secondary' : 'default'}>
                    {network}
                  </Badge>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleNetworkSwitch('testnet')}
                  className={network === 'testnet' ? 'bg-muted' : ''}
                >
                  <Network className="h-4 w-4 mr-2" />
                  Testnet
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleNetworkSwitch('mainnet')}
                  className={network === 'mainnet' ? 'bg-muted' : ''}
                >
                  <Network className="h-4 w-4 mr-2" />
                  Mainnet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Wallet Connection */}
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 max-w-48 bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                  <Wallet className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-mono text-sm">
                      {truncateAddress(address || '')}
                    </div>
                    <div className="text-xs text-gray-400">
                      {parseFloat(balance).toFixed(2)} XLM
                    </div>
                  </div>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
                <div className="px-2 py-1.5">
                  <div className="text-sm font-medium text-white">Connected Wallet</div>
                  <div className="font-mono text-xs text-gray-400 break-all">
                    {address}
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem onClick={copyAddress} className="text-gray-300 hover:text-white hover:bg-slate-700">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openInExplorer} className="text-gray-300 hover:text-white hover:bg-slate-700">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View in Explorer
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem onClick={handleDisconnect} className="text-red-400 hover:text-red-300 hover:bg-slate-700">
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={handleConnect} 
              disabled={isLoading}
              className="gap-2 bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Wallet className="h-4 w-4" />
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
} 