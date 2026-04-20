'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useToast } from '@/context/ToastContext';
import { useNotifications } from '@/context/NotificationContext';

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

  // Helper to show toast and sync to notifications
  const notify = useCallback((message, type = 'info') => {
    showToast(message, type);
    // Add to notifications after toast animation (4s)
    setTimeout(() => {
      addNotification(message, type);
    }, 4000);
  }, [showToast, addNotification]);

  const fetchInvoices = useCallback(async (force = false) => {
    // Prevent concurrent fetches using ref
    if (fetchingInvoicesRef.current && !force) return;
    if (fetchedInvoicesRef.current && !force) return;

    fetchingInvoicesRef.current = true;
    setLoading(prev => ({ ...prev, invoices: true }));
    setError(null);
    try {
      const res = await fetch('/api/invoices');
      const data = await res.json();
      if (res.ok) {
        setInvoices(data);
        fetchedInvoicesRef.current = true;
      } else {
        throw new Error(data.error || 'Failed to fetch invoices');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, invoices: false }));
      fetchingInvoicesRef.current = false;
    }
  }, []);

  const fetchClients = useCallback(async (force = false) => {
    // Prevent concurrent fetches using ref
    if (fetchingClientsRef.current && !force) return;
    if (fetchedClientsRef.current && !force) return;

    fetchingClientsRef.current = true;
    setLoading(prev => ({ ...prev, clients: true }));
    setError(null);
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      if (res.ok) {
        setClients(data);
        fetchedClientsRef.current = true;
      } else {
        throw new Error(data.error || 'Failed to fetch clients');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(prev => ({ ...prev, clients: false }));
      fetchingClientsRef.current = false;
    }
  }, []);

  // Refresh methods for specific events (add/updated/delete)
  const refreshInvoices = useCallback(() => fetchInvoices(true), [fetchInvoices]);
  const refreshClients = useCallback(() => fetchClients(true), [fetchClients]);

  /**
   * Mutations: update local state directly for "Instant UI"
   */

  const addInvoice = useCallback(async (invoiceData) => {
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });
      const newInvoice = await res.json();
      if (!res.ok) throw new Error(newInvoice.error || 'Failed to add invoice');

      // Update local state: add to the beginning of the list
      setInvoices(prev => [newInvoice, ...prev]);
      fetchedInvoicesRef.current = true;

      // Show toast + notification
      notify('Invoice created successfully', 'success');

      return { success: true, data: newInvoice };
    } catch (err) {
      setError(err.message);
      notify('Failed to create invoice', 'error');
      return { success: false, error: err.message };
    }
  }, [notify]);

  const updateInvoice = useCallback(async (id, updatedData) => {
    try {
      // Ensure id is a string
      const idString = String(id);
      const res = await fetch(`/api/invoices/${idString}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const updatedInvoice = await res.json();
      if (!res.ok) throw new Error(updatedInvoice.error || 'Failed to update invoice');

      // Update local state - convert both to strings for comparison
      setInvoices(prev => prev.map(inv => {
        const invId = inv._id ? String(inv._id) : null;
        return invId === idString ? updatedInvoice : inv;
      }));

      // Show toast + notification
      notify('Invoice updated successfully', 'success');

      return { success: true, data: updatedInvoice };
    } catch (err) {
      setError(err.message);
      notify('Failed to update invoice', 'error');
      return { success: false, error: err.message };
    }
  }, [notify]);

  const deleteInvoice = useCallback(async (id) => {
    try {
      // Ensure id is a string
      const idString = String(id);
      const res = await fetch(`/api/invoices/${idString}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete invoice');

      // Update local state - convert both to strings for comparison
      setInvoices(prev => prev.filter(inv => {
        const invId = inv._id ? String(inv._id) : null;
        return invId !== idString;
      }));

      // Show toast + notification
      notify('Invoice deleted successfully', 'success');

      return { success: true };
    } catch (err) {
      setError(err.message);
      notify('Failed to delete invoice', 'error');
      return { success: false, error: err.message };
    }
  }, [notify]);

  const markPaid = useCallback(async (id) => {
    try {
      const idString = String(id);
      const res = await fetch(`/api/invoices/${idString}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid', paidAt: new Date().toISOString() }),
      });
      const updatedInvoice = await res.json();
      if (!res.ok) throw new Error(updatedInvoice.error || 'Failed to mark invoice as paid');

      // Update local state
      setInvoices(prev => prev.map(inv => {
        const invId = inv._id ? String(inv._id) : null;
        return invId === idString ? updatedInvoice : inv;
      }));

      // Show toast + notification
      notify('Invoice marked as paid', 'success');

      return { success: true, data: updatedInvoice };
    } catch (err) {
      setError(err.message);
      notify('Failed to mark invoice as paid', 'error');
      return { success: false, error: err.message };
    }
  }, [notify]);

  const addClient = useCallback(async (clientData) => {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      const newClient = await res.json();
      if (!res.ok) throw new Error(newClient.error || 'Failed to add client');

      // Update local state
      setClients(prev => [newClient, ...prev]);
      fetchedClientsRef.current = true;

      // Show toast + notification
      notify('Client created successfully', 'success');

      return { success: true, data: newClient };
    } catch (err) {
      setError(err.message);
      notify('Failed to create client', 'error');
      return { success: false, error: err.message };
    }
  }, [notify]);

  const updateClient = useCallback(async (id, updatedData) => {
    try {
      // Ensure id is a string
      const idString = String(id);
      const res = await fetch(`/api/clients/${idString}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const updatedClient = await res.json();
      if (!res.ok) throw new Error(updatedClient.error || 'Failed to update client');

      // Update local state - convert both to strings for comparison
      setClients(prev => prev.map(client => {
        const clientId = client._id ? String(client._id) : null;
        return clientId === idString ? updatedClient : client;
      }));

      // Show toast + notification
      notify('Client updated successfully', 'success');

      return { success: true, data: updatedClient };
    } catch (err) {
      setError(err.message);
      notify('Failed to update client', 'error');
      return { success: false, error: err.message };
    }
  }, [notify]);

  const deleteClient = useCallback(async (id) => {
    try {
      // Ensure id is a string
      const idString = String(id);
      const res = await fetch(`/api/clients/${idString}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete client');

      // Update local state - convert both to strings for comparison
      setClients(prev => prev.filter(client => {
        const clientId = client._id ? String(client._id) : null;
        return clientId !== idString;
      }));

      // Show toast + notification
      notify('Client deleted successfully', 'success');

      return { success: true };
    } catch (err) {
      setError(err.message);
      notify('Failed to delete client', 'error');
      return { success: false, error: err.message };
    }
  }, [notify]);

  // Computed stats for Dashboard
  const stats = useMemo(() => ({
    totalRevenue: invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0),
    pendingAmount: invoices
      .filter(inv => inv.status === 'pending' || inv.status === 'sent')
      .reduce((sum, inv) => sum + inv.amount, 0),
    totalProjects: invoices.length,
    duePaymentsCount: invoices.filter(inv => inv.status === 'pending' || inv.status === 'sent').length,
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
