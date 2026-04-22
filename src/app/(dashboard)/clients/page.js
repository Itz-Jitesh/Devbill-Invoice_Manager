'use client';

import { useState, useEffect, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import ClientGrid from '@/components/clients/ClientGrid';
import Icon from '@/components/ui/Icon';
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
      <main className="max-w-[1400px] mx-auto pt-8 pb-24">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-20 animate-in slide-in-from-top-4 duration-1000">
          <div>
            <h2 className="font-headline text-7xl font-bold text-white tracking-tighter mb-4 leading-tight text-shadow-glow">
              Clients
            </h2>
            <p className="text-on-surface-variant text-xl font-body leading-relaxed max-w-lg opacity-60">
              Manage your commercial contacts and organization relationships.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/10 px-10 py-5 rounded-2xl font-label font-bold text-sm tracking-[0.2em] uppercase transition-all hover:scale-105 active:scale-95 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative z-10 flex items-center gap-3">
              <Icon name="person_add" size="sm" />
              Add Client
            </span>
          </button>
        </header>

        {/* Data States */}
        {loading.clients ? (
          <div className="flex flex-col items-center justify-center py-40 animate-pulse text-on-surface-variant/40">
            <div className="h-20 w-20 rounded-full border-4 border-white/5 border-t-primary/40 animate-spin mb-8" />
            <p className="font-label uppercase tracking-[0.3em] text-xs font-bold">Synchronizing Client Records...</p>
          </div>
        ) : error ? (
          <div className="glass-panel rounded-3xl p-20 text-center border-error/10 mb-12 shadow-2xl bg-error/[0.02] backdrop-blur-3xl">
            <div className="h-20 w-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-error/20">
              <Icon name="sync_problem" size="lg" className="text-error" />
            </div>
            <h3 className="text-3xl font-headline font-bold text-white mb-3 tracking-tight">Systems Out of Sync</h3>
            <p className="text-on-surface-variant font-body mb-10 max-w-md mx-auto opacity-70 leading-relaxed">{error}</p>
            <Button variant="outline" className="px-10 py-5 rounded-2xl" onClick={() => fetchClients(true)}>Retry Connection</Button>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="glass-panel rounded-[40px] p-24 text-center border-white/5 shadow-2xl">
            <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <Icon name="search_off" size="xl" className="text-white/20" />
            </div>
            <p className="text-white font-headline text-2xl font-bold mb-3">No results found</p>
            <p className="text-on-surface-variant text-sm mb-10 opacity-60">Refine your search term or add a new client.</p>
            {searchTerm && (
              <Button variant="outline" className="rounded-2xl" onClick={() => setSearchTerm('')}>Clear Filters</Button>
            )}
          </div>
        ) : (
          <div className="stagger-load">
            <ClientGrid clients={filteredClients} onAddClient={() => setIsModalOpen(true)} />
          </div>
        )}
      </main>

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
