'use client';

import { useState, useEffect, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import ClientGrid from '@/components/clients/ClientGrid';
import InsightRail from '@/components/clients/InsightRail';
import Button from '@/components/ui/Button';

/**
 * Clients page
 * "use client" required: useData, useEffect.
 */
export default function ClientsPage() {
  const { clients, stats, loading, error, fetchClients, fetchInvoices, addClient } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', company: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
    fetchInvoices();
  }, [fetchClients, fetchInvoices]);

  // Filter clients by name, email, or company (case-insensitive)
  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clients;
    const term = searchTerm.toLowerCase();
    return clients.filter(client =>
      client.name?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term) ||
      client.company?.toLowerCase().includes(term)
    );
  }, [clients, searchTerm]);

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!newClient.name) return;
    
    const { success, error } = await addClient(newClient);
    if (success) {
      setIsModalOpen(false);
      setNewClient({ name: '', email: '', company: '' });
    } else {
      alert('Error: ' + error);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="flex">
        <section className="flex-1 pr-80">
          {/* Page Header */}
          <header className="flex items-end justify-between mb-20">
            <div>
              <h2 className="font-headline text-5xl font-light text-on-surface tracking-tight">Clients</h2>
              <div className="h-1 w-12 bg-indigo-400/30 mt-6 rounded-full" />
            </div>
            <Button
              variant="primary"
              className="flex items-center gap-2 px-8 py-4 uppercase tracking-widest text-xs shadow-[0_10px_30px_-10px_rgba(135,129,255,0.5)] hover:scale-105 transition-all"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add Client
            </Button>
          </header>

          {/* Data States */}
          {loading.clients ? (
            <div className="flex flex-col items-center justify-center py-40 animate-pulse text-on-surface-variant">
              <span className="material-symbols-outlined text-6xl mb-4 text-primary/50">hourglass_empty</span>
              <p className="font-body text-lg">Loading your clients...</p>
            </div>
          ) : error ? (
            <div className="glass-card p-12 text-center rounded-2xl border-error/20">
              <span className="material-symbols-outlined text-error text-6xl mb-4">error</span>
              <p className="text-on-surface font-body font-medium">{error}</p>
              <Button variant="outline" className="mt-6" onClick={() => fetchClients(true)}>Retry</Button>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl border-white/10">
              <span className="material-symbols-outlined text-on-surface-variant text-6xl mb-4">search_off</span>
              <p className="text-on-surface font-body font-medium mb-2">No clients found</p>
              <p className="text-on-surface-variant text-sm mb-4">Try adjusting your search terms</p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>Clear Search</Button>
              )}
            </div>
          ) : (
            <ClientGrid clients={filteredClients} onAddClient={() => setIsModalOpen(true)} />
          )}
        </section>

        {/* Fixed Right Insights Panel */}
        <InsightRail 
          activeProjects={stats.totalProjects.toString().padStart(2, '0')} 
          pendingInvoices={stats.duePaymentsCount.toString().padStart(2, '0')} 
        />
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-card rounded-3xl p-10 border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-headline text-white mb-2">New Client</h3>
            <p className="text-on-surface-variant mb-8">Add a new commercial contact to your manager.</p>
            
            <form onSubmit={handleAddClient} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant/60 ml-1">Full Name</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  placeholder="e.g. Lukas Sterling"
                  className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant/60 ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  placeholder="name@company.com"
                  className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant/60 ml-1">Company / Organization</label>
                <input 
                  type="text" 
                  value={newClient.company}
                  onChange={(e) => setNewClient({...newClient, company: e.target.value})}
                  placeholder="e.g. Nova Horizon Systems"
                  className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-body"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="flex-1 py-4"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1 py-4 shadow-lg shadow-primary/20"
                >
                  Create Client
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Search Bar */}
      <div className="fixed bottom-10 left-[calc(50%+144px)] -translate-x-1/2 w-full max-w-xl px-4 z-50">
        <div className="glass-card rounded-2xl flex items-center p-2 shadow-2xl backdrop-blur-3xl border-primary/20">
          <span className="material-symbols-outlined ml-4 text-on-surface-variant/60">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Quick search clients..."
            className="bg-transparent border-none focus:ring-0 text-sm font-body w-full placeholder:text-on-surface-variant/30 text-white"
          />
          <kbd className="hidden md:flex items-center gap-1 glass-card px-2 py-1 rounded-lg text-[10px] font-label text-on-surface-variant/40 mr-2 border-white/10">
            <span className="text-[14px]">⌘</span>K
          </kbd>
        </div>
      </div>
    </div>
  );
}
