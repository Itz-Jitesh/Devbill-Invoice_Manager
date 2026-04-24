'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/ui/StatCard';
import InvoiceTable from '@/components/dashboard/InvoiceTable';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

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

  useEffect(() => {
    const shouldShowToast = sessionStorage.getItem('showWelcomeToast');
    if (shouldShowToast) {
      showToast('Welcome back! You have successfully logged in.', 'success');
      sessionStorage.removeItem('showWelcomeToast');
    }
  }, [showToast]);

  const dashboardStats = [
    { title: 'Total Earned', value: `$${stats.totalRevenue.toLocaleString()}`, trendValue: 'Income', trendColor: 'text-[var(--color-success)]', bgColor: 'bg-[var(--color-success)]/10' },
    { title: 'Invoices Sent', value: stats.totalProjects.toString(), trendValue: 'Total', trendColor: 'text-[var(--color-accent)]', bgColor: 'bg-[var(--color-accent)]/10' },
    { title: 'Pending Amount', value: `$${stats.pendingAmount.toLocaleString()}`, trendValue: 'Due', trendColor: 'text-[var(--color-warning)]', bgColor: 'bg-[var(--color-warning)]/10' },
    { title: 'Due Payments', value: stats.duePaymentsCount.toString(), trendValue: 'Action needed', trendColor: 'text-[var(--color-error)]', bgColor: 'bg-[var(--color-error)]/10' },
  ];

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 20 }
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="space-y-12 max-w-7xl mx-auto"
    >
      {/* Greeting */}
      <motion.section variants={itemVariants}>
        <h2 className="text-[var(--color-on-surface-variant)]xl font-headline font-semibold text-[var(--color-on-surface)] tracking-tight mb-2">
          {greeting}, {displayName}
        </h2>
        <p className="text-[var(--color-on-surface-variant)] text-lg max-w-2xl">
          {loading.invoices ? (
            'Loading your business performance...'
          ) : (
            `You have ${stats.duePaymentsCount} pending invoice${stats.duePaymentsCount !== 1 ? 's' : ''} that need attention.`
          )}
        </p>
      </motion.section>

      {/* Stats Grid */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </motion.section>

      {/* Search & Results Section */}
      <motion.section variants={itemVariants} className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
          <div>
            <h3 className="text-2xl font-headline font-semibold text-[var(--color-on-surface)] tracking-tight">
              {searchTerm ? 'Search Results' : 'Recent Activity'}
            </h3>
            <p className="text-[var(--color-on-surface-variant)] text-sm mt-1">
              {searchTerm ? `Found ${searchResults.recentInvoices.length} invoices and ${searchResults.matchedClients.length} clients.` : 'Manage your latest billing activities.'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Icon name="search" size="md" className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search invoices or clients..."
                className="input-base pl-9 min-w-[280px]"
              />
            </div>
            <Button
              variant="primary"
              onClick={() => router.push('/invoices/new')}
            >
              <Icon name="add" size="sm" className="mr-2" />
              Create
            </Button>
          </div>
        </div>

        {/* Matched Clients */}
        {searchTerm && searchResults.matchedClients.length > 0 && (
          <motion.div variants={itemVariants}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-4">Matching Clients</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {searchResults.matchedClients.map(client => (
                <div 
                  key={client._id} 
                  onClick={() => router.push('/clients')}
                  className="surface-card p-4 rounded-xl cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-[var(--color-surface-hover)] flex items-center justify-center text-[var(--color-on-surface)] font-medium text-sm border border-[var(--color-surface-border)]">
                      {client.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[var(--color-on-surface)] font-medium text-sm">{client.name}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{client.company || 'Private Entity'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        <motion.div variants={itemVariants}>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-4">
            {searchTerm ? 'Matching Invoices' : 'Recent Invoices'}
          </h4>
          <InvoiceTable invoices={searchResults.recentInvoices} />
        </motion.div>

        {searchTerm && searchResults.recentInvoices.length === 0 && searchResults.matchedClients.length === 0 && (
          <motion.div variants={itemVariants} className="text-[var(--color-on-surface-variant)]enter py-16 surface-card rounded-xl">
            <Icon name="search_off" size="xl" className="text-[var(--color-on-surface-variant)] mb-4" />
            <p className="text-[var(--color-on-surface)] text-lg font-medium mb-1">No matches found</p>
            <p className="text-[var(--color-on-surface-variant)] text-sm">Try adjusting your search term.</p>
          </motion.div>
        )}
      </motion.section>
    </motion.div>
  );
}
