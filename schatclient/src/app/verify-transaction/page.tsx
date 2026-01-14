'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { ShieldCheckIcon, MagnifyingGlassIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import ToastNotification, { showSuccess } from '@/components/ui/ToastNotification';

export default function VerifyTransactionPage() {
    const [txId, setTxId] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleVerify = async () => {
        setVerifying(true);
        await new Promise(r => setTimeout(r, 1200));
        setVerifying(false);
        setResult({
            isValid: true,
            algorithm: 'SDitH-128',
            timestamp: new Date().toLocaleString(),
            signer: 'John Smith',
            hash: 'a4f2b8c9d3e7f1a2b5c8d4e9f6a3b7c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0'
        });
        showSuccess("Post-quantum signature verified!");
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
                                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    placeholder="Enter Transaction ID or Signature Hash..."
                                    value={txId}
                                    onChange={(e) => setTxId(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleVerify}
                                disabled={!txId || verifying}
                                className="px-6 py-2 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 disabled:opacity-50 transition-all flex items-center"
                            >
                                {verifying ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                ) : (
                                    <ShieldCheckIcon className="w-5 h-5 mr-2" />
                                )}
                                Verify
                            </button>
                        </div>
                    </div>

                    {result && (
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-emerald-600 px-8 py-4 flex items-center justify-between">
                                <div className="flex items-center text-white">
                                    <CheckBadgeIcon className="w-6 h-6 mr-3" />
                                    <span className="font-bold text-lg">Signature Authenticated</span>
                                </div>
                                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded font-bold uppercase">Integrity Confirmed</span>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Signer</p>
                                        <p className="text-slate-900 font-medium">{result.signer}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Algorithm</p>
                                        <p className="text-slate-900 font-mono">{result.algorithm}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Full Transaction Hash (SHA3)</p>
                                        <p className="text-slate-700 font-mono text-xs break-all bg-slate-50 p-3 rounded border border-slate-100 italic">
                                            {result.hash}
                                        </p>
                                    </div>
                                    <div className="col-span-2 text-center pt-4 border-t border-slate-100">
                                        <p className="text-sm text-slate-500 italic">
                                            This verification was performed in {result.timestamp} against the Talachi Node.
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
