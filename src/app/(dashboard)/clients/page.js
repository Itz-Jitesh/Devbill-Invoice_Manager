'use client';

import { useState, useEffect, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import ClientGrid from '@/components/clients/ClientGrid';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';

export default function ClientsPage() {
  const { clients, stats, loading, error, fetchClients, fetchInvoices, addClient } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', company: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClients();
    fetchInvoices();
  }, [fetchClients, fetchInvoices]);

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
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="font-headline text-[var(--color-on-surface-variant)]xl font-bold text-[var(--color-on-surface)] tracking-tight mb-2">
              Clients
            </h2>
            <p className="text-[var(--color-on-surface-variant)] text-lg font-body max-w-lg">
              Manage your commercial contacts and organization relationships.
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Icon name="person_add" size="sm" />
            Add Client
          </Button>
        </header>

        {/* Data States */}
        {loading.clients ? (
          <div className="flex flex-col items-center justify-center py-40 text-[var(--color-on-surface-variant)]">
            <div className="h-12 w-12 rounded-full border-4 border-[var(--color-surface-border)] border-t-[var(--color-primary)] animate-spin mb-6" />
            <p className="font-semibold text-sm">Synchronizing Client Records...</p>
          </div>
        ) : error ? (
          <div className="surface-card rounded-xl p-12 text-[var(--color-on-surface-variant)]enter border-[var(--color-error)] mb-12 bg-[var(--color-error)]/5">
            <div className="h-16 w-16 bg-[var(--color-error)]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--color-error)]/20">
              <Icon name="sync_problem" size="lg" className="text-[var(--color-error)]" />
            </div>
            <h3 className="text-xl font-headline font-bold text-[var(--color-on-surface)] mb-2">Systems Out of Sync</h3>
            <p className="text-[var(--color-on-surface-variant)] font-body mb-8 max-w-md mx-auto">{error}</p>
            <Button variant="outline" onClick={() => fetchClients(true)}>Retry Connection</Button>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="surface-card rounded-xl p-16 text-[var(--color-on-surface-variant)]enter">
            <div className="h-16 w-16 bg-[var(--color-surface-hover)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="search_off" size="xl" className="text-[var(--color-on-surface-variant)]" />
            </div>
            <p className="text-[var(--color-on-surface)] font-headline text-xl font-bold mb-2">No results found</p>
            <p className="text-[var(--color-on-surface-variant)] text-sm mb-8">Refine your search term or add a new client.</p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm('')}>Clear Filters</Button>
            )}
          </div>
        ) : (
          <ClientGrid clients={filteredClients} onAddClient={() => setIsModalOpen(true)} />
        )}
      </main>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg surface-card rounded-xl p-8 border border-[var(--color-surface-border)] shadow-xl">
            <h3 className="text-2xl font-headline text-[var(--color-on-surface)] mb-1 font-bold">New Client</h3>
            <p className="text-[var(--color-on-surface-variant)] mb-6 text-sm">Add a new commercial contact to your manager.</p>
            
            <form onSubmit={handleAddClient} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]">Full Name</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  placeholder="e.g. Lukas Sterling"
                  className="bg-[var(--color-surface)] border border-[var(--color-surface-border)] rounded-md px-4 py-3 text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all font-body"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]">Email Address</label>
                <input 
                  type="email" 
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  placeholder="name@company.com"
                  className="bg-[var(--color-surface)] border border-[var(--color-surface-border)] rounded-md px-4 py-3 text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all font-body"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]">Company / Organization</label>
                <input 
                  type="text" 
                  value={newClient.company}
                  onChange={(e) => setNewClient({...newClient, company: e.target.value})}
                  placeholder="e.g. Nova Horizon Systems"
                  className="bg-[var(--color-surface)] border border-[var(--color-surface-border)] rounded-md px-4 py-3 text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all font-body"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1"
                >
                  Create Client
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Search Bar */}
      <div className="fixed bottom-8 left-[calc(50%+128px)] -translate-x-1/2 w-full max-w-xl px-4 z-50">
        <div className="surface-card rounded-full flex items-center p-2 shadow-lg border border-[var(--color-surface-border)] focus-within:border-[var(--color-primary)] transition-all">
          <Icon name="search" size="md" className="ml-3 text-[var(--color-on-surface-variant)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="bg-transparent border-none focus:ring-0 text-sm font-body w-full px-3 placeholder:text-[var(--color-on-surface-variant)] text-[var(--color-on-surface)] focus:outline-none"
          />
          <kbd className="hidden md:flex items-center gap-1 bg-[var(--color-surface-hover)] px-2 py-1 rounded-md text-xs font-medium text-[var(--color-on-surface-variant)] mr-1">
            <span>⌘</span>K
          </kbd>
        </div>
      </div>
    </div>
  );
}
