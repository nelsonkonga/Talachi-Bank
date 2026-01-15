'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { ShieldCheckIcon, MagnifyingGlassIcon, CheckBadgeIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import ToastNotification, { showError, showSuccess } from '@/components/ui/ToastNotification';
import { apiClient } from '@/lib/api/client';

export default function VerifyTransactionPage() {
    const [txId, setTxId] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleVerify = async () => {
        if (!txId) return;

        setVerifying(true);
        setResult(null);
        try {
            const response = await apiClient.getClient().get(`/api/transactions/${txId}/verify`);
            setResult({
                isValid: response.data,
                timestamp: new Date().toLocaleString(),
                txId: txId
            });
            if (response.data) {
                showSuccess("Post-quantum signature verified!");
            } else {
                showError("Invalid signature detected!");
            }
        } catch (err: any) {
            showError("Transaction ID not found or server error.");
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <Sidebar />
            <ToastNotification />

            <main className="pl-64 pt-16">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900">Signature Verification</h1>
                        <p className="text-slate-500 mt-2">Validate the authenticity of any transaction using its post-quantum signature.</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
                        <div className="flex space-x-4">
                            <div className="flex-1 relative">
                                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-50/50 outline-none transition-all"
                                    placeholder="Enter Full Transaction UUID..."
                                    value={txId}
                                    onChange={(e) => setTxId(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleVerify}
                                disabled={!txId || verifying}
                                className="px-8 py-4 bg-primary-900 text-white rounded-xl font-bold hover:bg-primary-800 disabled:opacity-50 transition-all flex items-center shadow-lg"
                            >
                                {verifying ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                ) : (
                                    <ShieldCheckIcon className="w-5 h-5 mr-3" />
                                )}
                                Verify Transaction
                            </button>
                        </div>
                    </div>

                    {result && (
                        <div className={`rounded-2xl shadow-xl border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 ${result.isValid ? 'border-emerald-200' : 'border-red-200'}`}>
                            <div className={`${result.isValid ? 'bg-emerald-600' : 'bg-red-600'} px-8 py-6 flex items-center justify-between`}>
                                <div className="flex items-center text-white">
                                    {result.isValid ? <CheckBadgeIcon className="w-8 h-8 mr-3" /> : <XCircleIcon className="w-8 h-8 mr-3" />}
                                    <div>
                                        <span className="font-bold text-xl block">{result.isValid ? 'Signature Authenticated' : 'Verification Failed'}</span>
                                        <span className="text-xs opacity-75 uppercase font-bold tracking-widest">{result.isValid ? 'Post-Quantum Secure' : 'Integrity Compromised'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-white">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Transaction Identifier</p>
                                        <p className="text-slate-900 font-mono text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">{result.txId}</p>
                                    </div>
                                    <div className="flex items-center text-sm text-slate-500 italic">
                                        <ClockIcon className="w-4 h-4 mr-2" />
                                        Verified at {result.timestamp}
                                    </div>
                                    <div className="pt-6 border-t border-slate-100 text-center">
                                        <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                                            {result.isValid
                                                ? "The transaction signature has been successfully validated against the Talachi Bank post-quantum identity provider using SDitH v1.1 protocol."
                                                : "The provided signature does not match the transaction data or has been tampered with. Do not proceed with this transaction."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
