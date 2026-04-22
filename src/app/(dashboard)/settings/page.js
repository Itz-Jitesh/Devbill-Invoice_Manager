'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/Icon';

/**
 * Settings Page
 * @description User settings and application configuration.
 * Design: Luminous Editorial - glassmorphism, editorial typography, tonal layering.
 */
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
      <section className="mb-16">
        <h2 className="font-headline text-5xl font-bold tracking-tight text-on-surface mb-3">
          Settings
        </h2>
        <p className="text-on-surface-variant max-w-md opacity-70 font-body leading-relaxed">
          Customize your workspace experience and view performance summaries.
        </p>
      </section>

      <div className="space-y-10 max-w-5xl">

        {/* Account Information Section */}
        <section className="glass-panel rounded-2xl p-10">
          <h3 className="font-headline text-2xl mb-6 text-on-surface">Account Information</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-[0.2em] text-on-surface-variant/60">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={displayName}
                placeholder="Enter your name"
                className="w-full bg-surface-container-high border border-white/10 rounded-xl px-5 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/40 focus:bg-surface-container-highest transition-all font-body"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-[0.2em] text-on-surface-variant/60">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={user?.email || ''}
                placeholder="Enter your email"
                className="w-full bg-surface-container-high border border-white/10 rounded-xl px-5 py-4 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/40 focus:bg-surface-container-highest transition-all font-body"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="button" className="px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-semibold rounded-xl hover:opacity-90 transition-opacity font-label text-sm uppercase tracking-wider">
              Save Changes
            </button>
          </div>
        </section>

        {/* Earnings Overview Section */}
        <section className="glass-panel rounded-2xl p-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="font-headline text-2xl mb-1 text-on-surface">Earnings Overview</h3>
              <p className="text-on-surface-variant text-sm font-body">Monthly performance snapshot</p>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-label tracking-widest text-on-surface-variant uppercase">
              Auto-Updated
            </span>
          </div>

          {/* Bar Chart */}
          <div className="h-48 flex items-end gap-3 w-full px-2">
            {earningsData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  className={`w-full rounded-lg transition-all duration-500 relative ${
                    data.highlight
                      ? 'bg-primary/40 border border-primary/20 group-hover:bg-primary/50'
                      : 'bg-white/5 hover:bg-primary/20'
                  }`}
                  style={{ height: data.height }}
                >
                  {data.highlight && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-surface-container-highest px-3 py-1.5 rounded-lg text-xs font-bold border border-primary/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {data.amount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-between mt-6 px-2 text-[10px] font-label tracking-[0.2em] opacity-40 uppercase text-on-surface-variant">
            {earningsData.map((data) => (
              <span key={data.month}>{data.month}</span>
            ))}
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="glass-panel rounded-2xl p-10">
          <h3 className="font-headline text-2xl mb-6 text-on-surface">Notifications</h3>
          <div className="space-y-6">
            {[
              { label: 'Invoice Reminders', desc: 'Get notified when invoices are due', enabled: true },
              { label: 'Payment Confirmations', desc: 'Receive alerts for successful payments', enabled: true },
              { label: 'Client Activity', desc: 'Updates when clients view invoices', enabled: false },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-on-surface font-medium font-body">{item.label}</p>
                  <p className="text-sm text-on-surface-variant/60 font-body">{item.desc}</p>
                </div>
                <button
                  type="button"
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${
                    item.enabled ? 'bg-primary/30' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${
                      item.enabled
                        ? 'right-1 bg-primary'
                        : 'left-1 bg-on-surface-variant/50'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-2xl p-10 border border-error/20 bg-error/5">
          <h3 className="font-headline text-2xl mb-6 text-error">Danger Zone</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface font-medium font-body">Delete Account</p>
              <p className="text-sm text-on-surface-variant/60 font-body">Permanently remove your account and all data</p>
            </div>
            <button type="button" className="px-6 py-3 border border-error/30 text-error rounded-xl hover:bg-error/10 transition-colors font-label text-sm uppercase tracking-wider">
              Delete
            </button>
          </div>
        </section>
      </div>

      {/* Background Glow */}
      <div className="fixed top-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10 animate-pulse" />
    </div>
  );
}
