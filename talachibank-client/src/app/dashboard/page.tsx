"use client";

import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BalanceCard from '@/components/dashboard/BalanceCard';
import { PlusIcon, CheckBadgeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { transactionApi, Transaction } from '@/lib/api/transaction';

export default function DashboardPage() {
    const { user, refreshBalance } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await transactionApi.getMyTransactions();
                setTransactions(data);
            } catch (err) {
                console.error("Failed to fetch transactions:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
        refreshBalance();
    }, [refreshBalance]);
    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <Sidebar />

            <main className="pl-64 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                        <div className="flex space-x-3">
                            <button className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                <DocumentArrowDownIcon className="-ml-1 mr-2 h-5 w-5 text-slate-500" />
                                Export Audit Log
                            </button>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                <CheckBadgeIcon className="-ml-1 mr-2 h-5 w-5" />
                                Sign Pending
                            </button>
                            <Link href="/sign-transaction" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                                New Wire Transfer
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <BalanceCard
                                balance={user?.balance || 0}
                                accountNumber={user?.accountNumber || ''}
                            />
                            <RecentTransactions
                                transactions={transactions}
                                isLoading={isLoading}
                            />
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link href="/sign-transaction" className="flex items-center w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                        <PlusIcon className="w-5 h-5 mr-3" />
                                        <span className="font-medium">New Transaction</span>
                                    </Link>
                                    <button className="flex items-center w-full px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                                        <CheckBadgeIcon className="w-5 h-5 mr-3 text-primary-500" />
                                        <span className="font-medium">Verify Signature</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
