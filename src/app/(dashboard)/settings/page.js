'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const { user } = useAuth();
  const displayName = user?.name || user?.username || '';

  // Mock earnings data for visualization
  const earningsData = [
    { month: 'Jan', height: '40%', amount: '$8,200' },
    { month: 'Feb', height: '65%', amount: '$10,400' },
    { month: 'Mar', height: '45%', amount: '$8,900' },
    { month: 'Apr', height: '85%', amount: '$12,400', highlight: true },
    { month: 'May', height: '55%', amount: '$9,600' },
    { month: 'Jun', height: '75%', amount: '$11,200' },
    { month: 'Jul', height: '60%', amount: '$9,800' },
    { month: 'Aug', height: '90%', amount: '$13,100' },
  ];

  return (
    <div className="relative min-h-screen pb-24">
      {/* Page Header */}
      <section className="mb-10">
        <h2 className="font-headline text-[var(--color-on-surface-variant)]xl font-bold tracking-tight text-[var(--color-on-surface)] mb-2">
          Settings
        </h2>
        <p className="text-[var(--color-on-surface-variant)] max-w-md font-body">
          Customize your workspace experience and view performance summaries.
        </p>
      </section>

      <div className="space-y-8 max-w-4xl">

        {/* Account Information Section */}
        <section className="surface-card rounded-xl p-8 border border-[var(--color-surface-border)]">
          <h3 className="font-headline text-xl mb-6 text-[var(--color-on-surface)] font-bold">Account Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={displayName}
                placeholder="Enter your name"
                className="w-full bg-[var(--color-background)] border border-[var(--color-surface-border)] rounded-md px-4 py-3 text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all font-body text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface)]">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={user?.email || ''}
                placeholder="Enter your email"
                className="w-full bg-[var(--color-background)] border border-[var(--color-surface-border)] rounded-md px-4 py-3 text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all font-body text-sm"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="primary">
              Save Changes
            </Button>
          </div>
        </section>

        {/* Earnings Overview Section */}
        <section className="surface-card rounded-xl p-8 border border-[var(--color-surface-border)]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-headline text-xl mb-1 text-[var(--color-on-surface)] font-bold">Earnings Overview</h3>
              <p className="text-[var(--color-on-surface-variant)] text-sm font-body">Monthly performance snapshot</p>
            </div>
            <span className="px-3 py-1 rounded bg-[var(--color-surface-hover)] border border-[var(--color-surface-border)] text-[10px] font-semibold text-[var(--color-on-surface-variant)] uppercase">
              Auto-Updated
            </span>
          </div>

          {/* Bar Chart */}
          <div className="h-48 flex items-end gap-3 w-full px-1">
            {earningsData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  className={`w-full rounded-t-sm transition-all duration-300 relative ${
                    data.highlight
                      ? 'bg-[var(--color-primary)]'
                      : 'bg-[var(--color-surface-border)] hover:bg-[var(--color-primary)]/40'
                  }`}
                  style={{ height: data.height }}
                >
                  {data.highlight && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[var(--color-surface)] shadow-lg px-2 py-1 rounded text-xs font-bold border border-[var(--color-surface-border)] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-on-surface)]">
                      {data.amount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-between mt-4 px-1 text-[10px] font-semibold opacity-60 uppercase text-[var(--color-on-surface-variant)]">
            {earningsData.map((data) => (
              <span key={data.month}>{data.month}</span>
            ))}
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="surface-card rounded-xl p-8 border border-[var(--color-surface-border)]">
          <h3 className="font-headline text-xl mb-6 text-[var(--color-on-surface)] font-bold">Notifications</h3>
          <div className="space-y-4">
            {[
              { label: 'Invoice Reminders', desc: 'Get notified when invoices are due', enabled: true },
              { label: 'Payment Confirmations', desc: 'Receive alerts for successful payments', enabled: true },
              { label: 'Client Activity', desc: 'Updates when clients view invoices', enabled: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[var(--color-on-surface)] font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{item.desc}</p>
                </div>
                <button
                  type="button"
                  className={`w-10 h-5 rounded-full relative transition-all duration-300 ${
                    item.enabled ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface-border)]'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                      item.enabled ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="surface-card rounded-xl p-8 border border-[var(--color-error)]/20 bg-[var(--color-error)]/5">
          <h3 className="font-headline text-xl mb-4 text-[var(--color-error)] font-bold">Danger Zone</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--color-on-surface)] font-semibold text-sm">Delete Account</p>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">Permanently remove your account and all data</p>
            </div>
            <Button variant="outline" className="border-[var(--color-error)] text-[var(--color-error)] hover:bg-[var(--color-error)]/10">
              Delete Account
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
