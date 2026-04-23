'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useToast } from '@/context/ToastContext';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';

const DataContext = createContext();

/**
 * DataProvider — Manages global state for Invoices and Clients
 * @description Implements a single-fetch strategy with manual refresh triggers.
 */
// Inner component to use hooks that require ToastProvider/NotificationProvider
const DataProviderInner = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState({
    invoices: false,
    clients: false,
  });
  const [error, setError] = useState(null);

  // Use refs to track in-flight and completed requests without causing re-renders
  const fetchingInvoicesRef = useRef(false);
  const fetchingClientsRef = useRef(false);
  const fetchedInvoicesRef = useRef(false);
  const fetchedClientsRef = useRef(false);

  // Toast and notifications
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const { token, isAuthReady, user } = useAuth();
  


  // Helper to show toast and sync to notifications simultaneously
  const notify = useCallback((message, type = 'info') => {
    showToast(message, type);
    addNotification(message, type);
  }, [showToast, addNotification]);

  const fetchInvoices = useCallback(async (force = false) => {
    if (!isAuthReady) return;
    
    if (!token) {
      console.log('[DataContext] Skipping invoice fetch because there is no session token');
      fetchedInvoicesRef.current = false;
      return;
    }

    if (fetchingInvoicesRef.current && !force) return;
    if (fetchedInvoicesRef.current && !force) return;

    fetchingInvoicesRef.current = true;
    setLoading(prev => ({ ...prev, invoices: true }));
    setError(null);

    try {
      const res = await fetch('/api/invoices', {
        cache: 'no-store',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      console.log('[DataContext] Invoice fetch response', {
        status: res.status,
        count: Array.isArray(data) ? data.length : null,
        error: !res.ok ? data.error : null,
      });

      if (res.ok) {
        setInvoices(data);
        fetchedInvoicesRef.current = true;
      } else {
        throw new Error(data.error || 'Failed to fetch invoices');
      }
    } catch (err) {
      console.error('[DataContext] Invoice fetch failed', err);
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, invoices: false }));
      fetchingInvoicesRef.current = false;
    }
  }, [isAuthReady, token]);

  const fetchClients = useCallback(async (force = false) => {
    if (!isAuthReady) return;
    
    if (!token) {
      console.log('[DataContext] Skipping client fetch because there is no session token');
      fetchedClientsRef.current = false;
      return;
    }

    if (fetchingClientsRef.current && !force) return;
    if (fetchedClientsRef.current && !force) return;

    fetchingClientsRef.current = true;
    setLoading(prev => ({ ...prev, clients: true }));
    setError(null);

    try {
      const res = await fetch('/api/clients', {
        cache: 'no-store',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      console.log('[DataContext] Client fetch response', {
        status: res.status,
        count: Array.isArray(data) ? data.length : null,
        error: !res.ok ? data.error : null,
      });

      if (res.ok) {
        setClients(data);
        fetchedClientsRef.current = true;
      } else {
        throw new Error(data.error || 'Failed to fetch clients');
      }
    } catch (err) {
      console.error('[DataContext] Client fetch failed', err);
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, clients: false }));
      fetchingClientsRef.current = false;
    }
  }, [isAuthReady, token]);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    if (!token || !user?.id) {
      console.log('[DataContext] Clearing cached data because auth session is unavailable');
      fetchedInvoicesRef.current = false;
      fetchedClientsRef.current = false;
      setInvoices([]);
      setClients([]);
      return;
    }

    console.log('[DataContext] Authenticated user ready for data fetch', {
      userId: user.id,
    });
  }, [token, isAuthReady, user?.id]);

  useEffect(() => {
    if (isAuthReady && token) {
      if (!fetchedInvoicesRef.current || !fetchedClientsRef.current) {
        console.log('[DataContext] Auth ready with token, triggering initial fetch');
        fetchInvoices();
        fetchClients();
      }
    }
  }, [isAuthReady, token, fetchInvoices, fetchClients]);

  // Refresh methods for specific events (add/updated/delete)
  const refreshInvoices = useCallback(() => fetchInvoices(true), [fetchInvoices]);
  const refreshClients = useCallback(() => fetchClients(true), [fetchClients]);

  /**
   * Mutations: update local state directly for "Instant UI"
   */

  const addInvoice = useCallback(async (invoiceData) => {
    try {
      console.log('[DataContext] Creating invoice', {
        clientId: invoiceData.clientId,
        title: invoiceData.title,
        amount: invoiceData.amount,
      });

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(invoiceData),
      });
      const newInvoice = await res.json();

      console.log('[DataContext] Create invoice response', {
        status: res.status,
        invoiceId: newInvoice?._id ?? null,
        error: !res.ok ? newInvoice.error : null,
      });

      if (!res.ok) throw new Error(newInvoice.error || 'Failed to add invoice');

      setInvoices(prev => [newInvoice, ...prev]);
      fetchedInvoicesRef.current = true;
      notify('Invoice created successfully', 'success');

      return { success: true, data: newInvoice };
    } catch (err) {
      console.error('[DataContext] Create invoice failed', err);
      notify('Failed to create invoice', 'error');
      return { success: false, error: err.message };
    }
  }, [notify, token]);

  const updateInvoice = useCallback(async (id, updatedData) => {
    try {
      const idString = String(id);
      const res = await fetch(`/api/invoices/${idString}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
      });
      const updatedInvoice = await res.json();

      console.log('[DataContext] Update invoice response', {
        status: res.status,
        invoiceId: updatedInvoice?._id ?? idString,
        error: !res.ok ? updatedInvoice.error : null,
      });

      if (!res.ok) throw new Error(updatedInvoice.error || 'Failed to update invoice');

      setInvoices(prev => prev.map(inv => {
        const invId = inv._id ? String(inv._id) : String(inv.id);
        return invId === idString ? updatedInvoice : inv;
      }));
      notify('Invoice updated successfully', 'success');

      return { success: true, data: updatedInvoice };
    } catch (err) {
      console.error('[DataContext] Update invoice failed', err);
      notify('Failed to update invoice', 'error');
      return { success: false, error: err.message };
    }
  }, [notify, token]);

  const deleteInvoice = useCallback(async (id) => {
    try {
      const idString = String(id);
      const res = await fetch(`/api/invoices/${idString}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      console.log('[DataContext] Delete invoice response', {
        status: res.status,
        invoiceId: idString,
        error: !res.ok ? (data.error || data.message || null) : null,
      });

      if (!res.ok) {
        const message = data.error || data.message || 'Failed to delete invoice';
        const isAlreadyGone = res.status === 404 && /not found|already/i.test(message);

        if (!isAlreadyGone) {
          throw new Error(message);
        }
      }

      setInvoices(prev => prev.filter(inv => {
        const invId = inv._id ? String(inv._id) : String(inv.id);
        return invId !== idString;
      }));
      notify('Invoice deleted successfully', 'success');

      return { success: true };
    } catch (err) {
      console.error('[DataContext] Delete invoice failed', err);
      notify('Failed to delete invoice', 'error');
      return { success: false, error: err.message };
    }
  }, [notify, token]);

  const markPaid = useCallback(async (id) => {
    try {
      const idString = String(id);
      const res = await fetch(`/api/invoices/${idString}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'paid', paidAt: new Date().toISOString() }),
      });
      const updatedInvoice = await res.json();

      console.log('[DataContext] Mark invoice paid response', {
        status: res.status,
        invoiceId: updatedInvoice?._id ?? idString,
        error: !res.ok ? updatedInvoice.error : null,
      });

      if (!res.ok) throw new Error(updatedInvoice.error || 'Failed to mark invoice as paid');

      setInvoices(prev => prev.map(inv => {
        const invId = inv._id ? String(inv._id) : String(inv.id);
        return invId === idString ? updatedInvoice : inv;
      }));
      notify('Invoice marked as paid', 'success');

      return { success: true, data: updatedInvoice };
    } catch (err) {
      console.error('[DataContext] Mark invoice paid failed', err);
      notify('Failed to mark invoice as paid', 'error');
      return { success: false, error: err.message };
    }
  }, [notify, token]);

  const addClient = useCallback(async (clientData) => {
    try {
      console.log('[DataContext] Creating client', {
        name: clientData.name,
        email: clientData.email ?? null,
      });

      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clientData),
      });
      const newClient = await res.json();

      console.log('[DataContext] Create client response', {
        status: res.status,
        clientId: newClient?._id ?? null,
        error: !res.ok ? newClient.error : null,
      });

      if (!res.ok) throw new Error(newClient.error || 'Failed to add client');

      setClients(prev => [newClient, ...prev]);
      fetchedClientsRef.current = true;
      notify('Client created successfully', 'success');

      return { success: true, data: newClient };
    } catch (err) {
      console.error('[DataContext] Create client failed', err);
      notify('Failed to create client', 'error');
      return { success: false, error: err.message };
    }
  }, [notify, token]);

  const updateClient = useCallback(async (id, updatedData) => {
    try {
      const idString = String(id);
      const res = await fetch(`/api/clients/${idString}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
      });
      const updatedClient = await res.json();

      console.log('[DataContext] Update client response', {
        status: res.status,
        clientId: updatedClient?._id ?? idString,
        error: !res.ok ? updatedClient.error : null,
      });

      if (!res.ok) throw new Error(updatedClient.error || 'Failed to update client');

      setClients(prev => prev.map(client => {
        const clientRecordId = client._id ? String(client._id) : String(client.id);
        return clientRecordId === idString ? updatedClient : client;
      }));
      notify('Client updated successfully', 'success');

      return { success: true, data: updatedClient };
    } catch (err) {
      console.error('[DataContext] Update client failed', err);
      notify('Failed to update client', 'error');
      return { success: false, error: err.message };
    }
  }, [notify, token]);

  const deleteClient = useCallback(async (id) => {
    try {
      const idString = String(id);
      const res = await fetch(`/api/clients/${idString}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      console.log('[DataContext] Delete client response', {
        status: res.status,
        clientId: idString,
        error: !res.ok ? (data.error || data.message || null) : null,
      });

      if (!res.ok) {
        const message = data.error || data.message || 'Failed to delete client';
        const isAlreadyGone = res.status === 404 && /not found|already/i.test(message);

        if (!isAlreadyGone) {
          throw new Error(message);
        }
      }

      setClients(prev => prev.filter(client => {
        const clientRecordId = client._id ? String(client._id) : String(client.id);
        return clientRecordId !== idString;
      }));
      notify('Client deleted successfully', 'success');

      return { success: true };
    } catch (err) {
      console.error('[DataContext] Delete client failed', err);
      notify('Failed to delete client', 'error');
      return { success: false, error: err.message };
    }
  }, [notify, token]);

  // Computed stats for Dashboard
  const stats = useMemo(() => ({
    totalRevenue: invoices
      .filter(inv => inv.status?.toLowerCase() === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0),
    pendingAmount: invoices
      .filter(inv => inv.status?.toLowerCase() === 'pending' || inv.status?.toLowerCase() === 'sent')
      .reduce((sum, inv) => sum + inv.amount, 0),
    totalProjects: invoices.length,
    duePaymentsCount: invoices.filter(inv => inv.status?.toLowerCase() === 'pending' || inv.status?.toLowerCase() === 'sent').length,
  }), [invoices]);


  const value = useMemo(() => ({
    invoices,
    clients,
    loading,
    error,
    stats,
    fetchInvoices,
    fetchClients,
    refreshInvoices,
    refreshClients,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    markPaid,
    addClient,
    updateClient,
    deleteClient,
  }), [
    invoices,
    clients,
    loading,
    error,
    stats,
    fetchInvoices,
    fetchClients,
    refreshInvoices,
    refreshClients,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    markPaid,
    addClient,
    updateClient,
    deleteClient,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Outer wrapper that ensures proper context hierarchy
export const DataProvider = ({ children }) => {
  return (
    <DataProviderInner>
      {children}
    </DataProviderInner>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
