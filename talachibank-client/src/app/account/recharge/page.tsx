"use client";

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { BanknotesIcon, ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import ToastNotification, { showSuccess, showError } from '@/components/ui/ToastNotification';

export default function RechargePage() {
    const { user, recharge } = useAuth();
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            showError("Please enter a valid positive amount.");
            return;
        }

        setIsSubmitting(true);
        try {
            await recharge(numAmount);
            showSuccess(`Successfully recharged €${numAmount.toLocaleString()}!`);
            setAmount('');
        } catch (err: any) {
            showError(err.message || "Failed to recharge balance.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <Sidebar />
            <ToastNotification />

            <main className="pl-64 pt-16">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium mb-2">
                                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                                Back to Dashboard
                            </Link>
                            <h1 className="text-3xl font-bold text-slate-900">Account Recharge</h1>
                            <p className="text-slate-500 mt-1">Add funds to your Talachi Bank account securely.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                                <div className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Amount to Recharge (EUR)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                    <BanknotesIcon className="h-6 w-6" />
                                                </div>
                                                <input
                                                    type="number"
                                                    required
                                                    step="0.01"
                                                    min="0.01"
                                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-50/50 outline-none text-xl font-bold transition-all"
                                                    placeholder="0.00"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                />
                                            </div>
                                            <p className="text-xs text-slate-400 mt-2">Maximum daily recharge limit: €50,000.00</p>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`w-full py-4 bg-primary-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-primary-800 transition-all flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                'Confirm Deposit'
                                            )}
                                        </button>
                                    </form>
                                </div>
                                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center text-xs text-slate-500">
                                    <ShieldCheckIcon className="w-4 h-4 mr-2 text-success-600" />
                                    This transaction is protected by atomic state updates and post-quantum logging.
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Account Summary</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-slate-500">Current Balance</p>
                                        <p className="text-2xl font-bold text-slate-900">€{user?.balance?.toLocaleString() || '0.00'}</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100">
                                        <p className="text-sm text-slate-500">Account Number</p>
                                        <p className="text-sm font-mono font-medium text-slate-900">{user?.accountNumber || '---'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary-900 p-6 rounded-2xl shadow-xl text-white">
                                <h3 className="text-sm font-bold text-primary-300 uppercase tracking-widest mb-3">Post-Quantum Note</h3>
                                <p className="text-sm text-primary-100 leading-relaxed">
                                    All balance updates are logged in the Talachi Bank immutable audit trail, secured against future quantum computing decryption.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
