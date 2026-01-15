"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import {
    ShieldCheckIcon,
    LockClosedIcon,
    FingerPrintIcon,
    ArrowRightIcon,
    BanknotesIcon,
    CreditCardIcon,
    PlusIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';
import ToastNotification, { showSuccess, showError } from '@/components/ui/ToastNotification';
import { transactionApi, Transaction } from '@/lib/api/transaction';
import { useAuth } from '@/hooks/useAuth';

export default function SignTransactionPage() {
    const { user, refreshBalance } = useAuth();
    const [step, setStep] = useState<'form' | 'sign' | 'hashing' | 'signing' | 'executing' | 'complete'>('form');
    const [progress, setProgress] = useState(0);
    const [tx, setTx] = useState<Transaction | null>(null);
    const [keys, setKeys] = useState<any[]>([]);
    const [selectedKeyId, setSelectedKeyId] = useState<number | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        toAccountNumber: '',
        amount: '',
        description: '',
        beneficiaryName: '',
        transactionType: 'WIRE_TRANSFER',
        currency: 'EUR'
    });

    useEffect(() => {
        const fetchKeys = async () => {
            try {
                const data = await transactionApi.getKeys();
                setKeys(data);
                if (data.length > 0) setSelectedKeyId(data[0].id);
            } catch (err) {
                console.error("Failed to fetch keys:", err);
            }
        };
        fetchKeys();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const amount = parseFloat(formData.amount);
            if (isNaN(amount) || amount <= 0) {
                showError("Please enter a valid amount.");
                return;
            }
            if (amount > (user?.balance || 0)) {
                showError("Insufficient funds.");
                return;
            }

            const newTx = await transactionApi.create({
                ...formData,
                amount
            });
            setTx(newTx);
            setStep('sign');
            showSuccess("Transaction prepared. Ready for SDitH signature.");
        } catch (err: any) {
            showError(err.response?.data?.message || "Failed to create transaction.");
        }
    };

    const handleSign = async () => {
        if (!tx || !selectedKeyId) return;

        setStep('hashing');
        setProgress(20);
        await new Promise(r => setTimeout(r, 800));

        try {
            setStep('signing');
            setProgress(50);

            // Call real signing API
            const signedTx = await transactionApi.sign(tx.transactionId, selectedKeyId);
            setTx(signedTx);
            setProgress(100);

            showSuccess("SDitH-128 Proof Generated successfully!");
            setStep('executing');

            // Auto-execute after signing
            await new Promise(r => setTimeout(r, 1000));
            const executedTx = await transactionApi.execute(tx.transactionId);
            setTx(executedTx);

            setStep('complete');
            showSuccess("Transaction Executed! Funds transferred.");
            refreshBalance();
        } catch (err: any) {
            setStep('sign');
            showError(err.response?.data?.message || "Signing/Execution failed.");
        }
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
                                {step === 'form' ? 'New Secure Transfer' : 'Post-Quantum Authorization'}
                            </h1>
                            <p className="text-primary-200 text-sm mt-1">
                                {step === 'form' ? 'Enter transaction details to begin.' : 'Review and sign using your SDitH private key.'}
                            </p>
                        </div>

                        <div className="p-8">
                            {step === 'form' && (
                                <form onSubmit={handleCreate} className="space-y-6">
                                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 grid grid-cols-2 gap-6">
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Beneficiary Name</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                                                placeholder="e.g. ACME Corp"
                                                value={formData.beneficiaryName}
                                                onChange={(e) => setFormData({ ...formData, beneficiaryName: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">To Account Number</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                                                placeholder="TAL-XXXXXXXXXX"
                                                value={formData.toAccountNumber}
                                                onChange={(e) => setFormData({ ...formData, toAccountNumber: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amount (EUR)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                                    <BanknotesIcon className="h-5 w-5" />
                                                </div>
                                                <input
                                                    type="number"
                                                    required
                                                    step="0.01"
                                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                                                    placeholder="0.00"
                                                    value={formData.amount}
                                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-1">Available: €{user?.balance?.toLocaleString()}</p>
                                        </div>
                                        <div className="col-span-2 sm:col-span-1">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Reference</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                                                placeholder="Payment for..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center px-6 py-3 bg-primary-900 text-white rounded-xl font-bold hover:bg-primary-800 transition-all shadow-lg"
                                        >
                                            Prepare Transaction
                                            <ArrowRightIcon className="w-5 h-5 ml-2" />
                                        </button>
                                    </div>
                                </form>
                            )}

                            {step === 'sign' && tx && (
                                <div className="space-y-8">
                                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Verification Needed</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-sm text-slate-500">Beneficiary</p>
                                                <p className="text-lg font-semibold text-slate-900">{tx.beneficiaryName}</p>
                                                <p className="text-xs text-slate-400 leading-tight">{tx.toAccountNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500">Amount</p>
                                                <p className="text-lg font-bold text-primary-700">€{tx.amount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
                                        <label className="block text-xs font-bold text-primary-700 uppercase tracking-wider mb-3">Select SDitH Secret Key</label>
                                        <div className="space-y-2">
                                            {keys.map(key => (
                                                <div
                                                    key={key.id}
                                                    onClick={() => setSelectedKeyId(key.id)}
                                                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${selectedKeyId === key.id ? 'bg-white border-primary-500 shadow-md ring-2 ring-primary-200' : 'bg-primary-100/50 border-primary-200 hover:bg-white'}`}
                                                >
                                                    <CreditCardIcon className={`w-6 h-6 mr-3 ${selectedKeyId === key.id ? 'text-primary-600' : 'text-primary-400'}`} />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-slate-900">SDitH-L{key.securityLevel === 128 ? '1' : key.securityLevel === 192 ? '3' : '5'} Protocol</p>
                                                        <p className="text-[10px] text-slate-500">Key ID: {key.id} • Usage Count: {key.usageCount}</p>
                                                    </div>
                                                    {selectedKeyId === key.id && <ShieldCheckIcon className="w-5 h-5 text-primary-600" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <button
                                            onClick={handleSign}
                                            className="inline-flex items-center px-10 py-5 bg-primary-900 text-white rounded-2xl font-bold hover:bg-primary-800 transition-all shadow-xl hover:-translate-y-1"
                                        >
                                            <FingerPrintIcon className="w-6 h-6 mr-2" />
                                            Authorize with Post-Quantum Proof
                                        </button>
                                        <p className="text-xs text-slate-400 mt-4">This operation performs heavy MPC-in-the-head computations to ensure security.</p>
                                    </div>
                                </div>
                            )}

                            {(step === 'hashing' || step === 'signing' || step === 'executing') && (
                                <div className="text-center py-12">
                                    <div className="mb-8 relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-primary-600 transition-all duration-500 ease-out"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-6 animate-pulse">
                                            {step === 'hashing' && <LockClosedIcon className="w-8 h-8" />}
                                            {step === 'signing' && <ShieldCheckIcon className="w-8 h-8" />}
                                            {step === 'executing' && <FingerPrintIcon className="w-8 h-8" />}
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                            {step === 'hashing' && 'Generating SHA3-256 Digest...'}
                                            {step === 'signing' && 'Computing SDitH Signature...'}
                                            {step === 'executing' && 'Executing Atomic Transfer...'}
                                        </h2>
                                        <p className="text-slate-500 max-w-sm mx-auto">
                                            Verified by Talachi Bank Quantum-Resistant Network.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {step === 'complete' && tx && (
                                <div className="text-center py-12">
                                    <div className="mb-8 flex justify-center">
                                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-lg shadow-green-100">
                                            <CheckBadgeIcon className="w-12 h-12" />
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Transfer Successful!</h2>
                                    <p className="text-slate-500 mb-10">€{tx.amount.toLocaleString()} has been securely sent to {tx.beneficiaryName}.</p>

                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-10 text-left max-w-md mx-auto">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-xs text-slate-500 uppercase">Transaction ID</span>
                                            <span className="text-xs font-mono text-slate-900">{tx.transactionId}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-xs text-slate-500 uppercase">Status</span>
                                            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">{tx.status}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => window.location.href = '/dashboard'}
                                        className="inline-flex items-center px-8 py-3 bg-white border-2 border-primary-900 text-primary-900 rounded-xl font-bold hover:bg-primary-50 transition-all"
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}



