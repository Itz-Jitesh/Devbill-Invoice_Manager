'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/ui/StatCard';
import InvoiceTable from '@/components/dashboard/InvoiceTable';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

/**
 * Dashboard page
 */
export default function DashboardPage() {
  const router = useRouter();
  const { invoices, clients, stats, loading, fetchInvoices } = useData();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const displayName = user?.name || user?.username || 'Alex';
  
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Show welcome toast after login redirect
  useEffect(() => {
    const shouldShowToast = sessionStorage.getItem('showWelcomeToast');
    if (shouldShowToast) {
      showToast('Welcome back! You have successfully logged in.', 'success');
      sessionStorage.removeItem('showWelcomeToast');
    }
  }, [showToast]);

  const dashboardStats = [
    { title: 'Total Earned', value: `$${stats.totalRevenue.toLocaleString()}`, trendValue: 'Income', trendColor: 'text-[#34D399]', bgColor: 'bg-[#34D399]/10' },
    { title: 'Invoices Sent', value: stats.totalProjects.toString(), trendValue: 'Total', trendColor: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Pending Amount', value: `$${stats.pendingAmount.toLocaleString()}`, trendValue: 'Due', trendColor: 'text-[#FBBF24]', bgColor: 'bg-[#FBBF24]/10' },
    { title: 'Due Payments', value: stats.duePaymentsCount.toString(), trendValue: 'Action needed', trendColor: 'text-teal-400', bgColor: 'bg-teal-400/10' },
  ];

  // Global Search: Filter both invoices and clients
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return { recentInvoices: invoices.slice(0, 5), matchedClients: [] };
    
    const term = searchTerm.toLowerCase();
    
    const matchedInvoices = invoices.filter(inv =>
      inv.title?.toLowerCase().includes(term) ||
      inv.clientId?.name?.toLowerCase().includes(term) ||
      inv.invoiceNumber?.toLowerCase().includes(term)
    ).slice(0, 5);

    const matchedClients = clients.filter(client =>
      client.name?.toLowerCase().includes(term) ||
      client.company?.toLowerCase().includes(term)
    ).slice(0, 4);

    return { recentInvoices: matchedInvoices, matchedClients };
  }, [invoices, clients, searchTerm]);

  return (
    <div className="space-y-16 py-8">
      {/* Greeting */}
      <section className="animate-in fade-in slide-in-from-top-4 duration-1000">
        <h2 className="text-7xl font-headline font-bold tracking-tighter text-on-surface mb-4 leading-tight text-shadow-glow">
          {greeting}, {displayName}
        </h2>

        <p className="text-on-surface-variant text-xl max-w-2xl font-body leading-relaxed opacity-60">
          {loading.invoices ? (
            'Loading your business performance...'
          ) : (
            `You have ${stats.duePaymentsCount} pending invoice${stats.duePaymentsCount !== 1 ? 's' : ''} that need attention.`
          )}
        </p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-load">
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </section>

      {/* Search & Results Section */}
      <section className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12">
          <div>
            <h3 className="text-3xl font-headline font-bold text-on-surface tracking-tight">
              {searchTerm ? 'Search Results' : 'Recent Activity'}
            </h3>
            <p className="text-on-surface-variant text-sm mt-2 font-body opacity-60">
              {searchTerm ? `Found ${searchResults.recentInvoices.length} invoices and ${searchResults.matchedClients.length} clients.` : 'Manage your latest billing activities and statuses.'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="glass-panel px-5 py-3 rounded-2xl flex items-center min-w-[320px] focus-within:border-primary/50 transition-all border border-white/10 group bg-white/[0.02]">
              <Icon name="search" size="lg" className="text-primary/40 group-focus-within:text-primary transition-colors mr-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search invoices or clients..."
                className="bg-transparent border-none focus:ring-0 text-sm font-body w-full placeholder:text-on-surface-variant/30 text-white"
              />
            </div>
            <Button
              variant="primary"
              className="flex items-center gap-3 px-8 shadow-2xl"
              onClick={() => router.push('/invoices/new')}
            >
              <Icon name="add" size="sm" />
              Create
            </Button>
          </div>
        </div>

        {/* Matched Clients (Only if searching) */}
        {searchTerm && searchResults.matchedClients.length > 0 && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500 mb-12">
            <h4 className="text-[10px] font-label uppercase tracking-[0.3em] text-on-surface-variant font-bold mb-6 opacity-40">Matching Clients</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {searchResults.matchedClients.map(client => (
                <div 
                  key={client._id} 
                  onClick={() => router.push('/clients')}
                  className="glass-panel p-6 rounded-2xl border-white/5 hover:border-primary/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase group-hover:scale-110 transition-transform">
                      {client.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-body font-bold text-sm tracking-tight">{client.name}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-label opacity-40">{client.company || 'Private Entity'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="stagger-load">
          <h4 className="text-[10px] font-label uppercase tracking-[0.3em] text-on-surface-variant font-bold mb-6 opacity-40">
            {searchTerm ? 'Matching Invoices' : 'Recent Invoices'}
          </h4>
          <InvoiceTable invoices={searchResults.recentInvoices} />
        </div>

        {searchTerm && searchResults.recentInvoices.length === 0 && searchResults.matchedClients.length === 0 && (
          <div className="text-center py-24 glass-panel rounded-[40px] border-white/5 shadow-inner bg-white/[0.01]">
            <Icon name="search_off" size="xl" className="text-on-surface-variant/10 mb-6 scale-150" />
            <p className="text-on-surface-variant font-headline text-2xl font-bold mb-2">No global matches found</p>
            <p className="text-on-surface-variant/40 font-body text-sm">Refine your term or browse all records manually.</p>
          </div>
        )}
      </section>
    </div>
  );
}


