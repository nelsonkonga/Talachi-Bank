'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { ShieldCheckIcon, LockClosedIcon, FingerPrintIcon } from '@heroicons/react/24/outline';
import ToastNotification, { showSuccess, showError } from '@/components/ui/ToastNotification';

export default function SignTransactionPage() {
    const [status, setStatus] = useState<'idle' | 'hashing' | 'signing' | 'complete'>('idle');
    const [progress, setProgress] = useState(0);

    const handleSign = async () => {
        setStatus('hashing');
        setProgress(20);
        await new Promise(r => setTimeout(r, 600));

        setStatus('signing');
        setProgress(50);
        // Simulate SDitH signature generation (heavy compute)
        for (let i = 50; i <= 100; i += 10) {
            setProgress(i);
            await new Promise(r => setTimeout(r, 200));
        }

        setStatus('complete');
        showSuccess("Transaction signed successfully with SDitH-128!");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <Sidebar />
            <ToastNotification />

            <main className="pl-64 pt-16">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                        <div className="bg-primary-900 px-8 py-6 text-white">
                            <h1 className="text-2xl font-bold flex items-center">
                                <LockClosedIcon className="w-7 h-7 mr-3 text-primary-300" />
                                Secure Transaction Signing
                            </h1>
                            <p className="text-primary-200 text-sm mt-1">
                                Review and authorize your transaction using Post-Quantum Cryptography.
                            </p>
                        </div>

                        <div className="p-8">
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Transaction Details</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-slate-500">Beneficiary</p>
                                        <p className="text-lg font-semibold text-slate-900">ACME Industries SA</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Amount</p>
                                        <p className="text-lg font-bold text-primary-700">€250,045.00</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-slate-500">Reference</p>
                                        <p className="text-sm font-mono text-slate-700 bg-white p-2 rounded border border-slate-200 mt-1">
                                            TX-4F2A-5B8C-9D3E-4F7A
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {status === 'idle' ? (
                                <div className="text-center py-8">
                                    <div className="mb-6 flex justify-center">
                                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 animate-pulse">
                                            <FingerPrintIcon className="w-10 h-10" />
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-2">Ready to Sign</h2>
                                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                        By clicking sign, you authorize this transaction and generate a post-quantum proof using your private key.
                                    </p>
                                    <button
                                        onClick={handleSign}
                                        className="inline-flex items-center px-8 py-4 bg-primary-900 text-white rounded-xl font-bold hover:bg-primary-800 transition-all shadow-lg hover:shadow-primary-900/20"
                                    >
                                        <ShieldCheckIcon className="w-5 h-5 mr-2" />
                                        Authorize & Sign Transaction
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="mb-6 relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-primary-600 transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                                        {status === 'hashing' && 'Computing SHA3-256 Hash...'}
                                        {status === 'signing' && 'Generating SDitH-128 Proof...'}
                                        {status === 'complete' && 'Transaction Authorized!'}
                                    </h2>
                                    <p className="text-slate-500">
                                        {status !== 'complete' ? 'Please do not close this window.' : 'Redirecting to transaction details...'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
