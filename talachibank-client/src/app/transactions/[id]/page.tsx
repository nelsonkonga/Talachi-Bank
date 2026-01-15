'use client';

import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import Link from 'next/link';
import {
    ArrowLeftIcon,
    PrinterIcon,
    DocumentArrowDownIcon,
    FlagIcon,
    CheckBadgeIcon,
    ClockIcon,
    GlobeAltIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    LockClosedIcon,
    UserIcon
} from '@heroicons/react/24/outline';

export default function TransactionDetailsPage({ params }: { params: { id: string } }) {
    // Mock data - in real app fetch based on params.id
    const tx = {
        id: 'TX-4F2A5B8C-9D3E-4F7A-8B2C',
        status: 'Signed',
        type: 'SWIFT International Transfer',
        date: 'Jan 14, 2026 14:23:45 UTC',
        initiatedBy: 'John Smith (ID: EMP-1234)',
        department: 'Treasury Operations',
        from: '**** **** **** 1234',
        fromName: 'EUR Business Account',
        to: 'BE71 0961 2345 6769',
        toName: 'ACME Industries SA',
        toLocation: 'Brussels, Belgium',
        amount: '€250,000.00',
        fee: '€45.00',
        total: '€250,045.00',
        ref: 'INV-2025-0042',
        description: 'Q4 2024 Services Invoice and Consulting Fees',
        riskScore: 68,
        signature: {
            status: 'Valid',
            level: 'Level 3 (192-bit)',
            algorithm: 'SDitH v1.1',
            size: '12,847 bytes',
            time: '463ms',
            hash: 'a4f2b8c9d3e7f1a2b5c8d4e9f6a3b7c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0'
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <Sidebar />

            <main className="pl-64 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <Link href="/transactions" className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                                <ArrowLeftIcon className="w-5 h-5" />
                            </Link>
                            <div>
                                <div className="flex items-center space-x-3">
                                    <h1 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{tx.id}</h1>
                                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {tx.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">Created on {tx.date}</p>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                                <PrinterIcon className="-ml-1 mr-2 h-5 w-5 text-slate-500" />
                                Print
                            </button>
                            <button className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                                <DocumentArrowDownIcon className="-ml-1 mr-2 h-5 w-5 text-slate-500" />
                                Download Audit
                            </button>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200">
                                <FlagIcon className="-ml-1 mr-2 h-5 w-5" />
                                Report Issue
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column - Info */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Basic Details */}
                            <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-3 mb-4">Transaction Information</h3>
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-500">Transaction Type</dt>
                                            <dd className="mt-1 text-sm text-slate-900 flex items-center">
                                                <GlobeAltIcon className="w-4 h-4 mr-1 text-slate-400" />
                                                {tx.type}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-500">Initiated By</dt>
                                            <dd className="mt-1 text-sm text-slate-900">{tx.initiatedBy}</dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-slate-500">Description</dt>
                                            <dd className="mt-1 text-sm text-slate-900 bg-slate-50 p-3 rounded">{tx.description}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {/* Financial Details */}
                            <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-3 mb-4">Financial Details</h3>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div className="bg-slate-50 p-4 rounded-lg">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">From Account</p>
                                            <p className="text-lg font-mono font-medium text-slate-900">{tx.from}</p>
                                            <p className="text-sm text-slate-600 mt-1">{tx.fromName}</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-lg">
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">To Beneficiary</p>
                                            <p className="text-lg font-mono font-medium text-slate-900">{tx.to}</p>
                                            <p className="text-sm text-slate-600 mt-1">{tx.toName}</p>
                                            <p className="text-xs text-slate-400">{tx.toLocation}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 border-t border-slate-100 pt-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-slate-500">Amount</span>
                                            <span className="text-slate-900 font-medium">{tx.amount}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-slate-500">Processing Fee</span>
                                            <span className="text-slate-900">{tx.fee}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-2">
                                            <span className="text-slate-900 font-bold">Total Debit</span>
                                            <span className="text-primary-700 font-bold text-xl">{tx.total}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Compliance */}
                            <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-3 mb-4">Risk & Compliance</h3>
                                    <div className="flex items-center mb-6">
                                        <div className="w-16 h-16 rounded-full border-4 border-yellow-400 flex items-center justify-center text-xl font-bold text-yellow-600 mr-4">
                                            {tx.riskScore}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Medium-High Risk</p>
                                            <p className="text-sm text-slate-500">Requires dual approval (>€100k)</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center text-green-700 bg-green-50 p-3 rounded-md">
                                            <CheckBadgeIcon className="w-5 h-5 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium">AML Screening Passed</p>
                                                <p className="text-xs opacity-80">Checked against OFAC, EU sanctions lists</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-green-700 bg-green-50 p-3 rounded-md">
                                            <CheckBadgeIcon className="w-5 h-5 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium">Sanctions Screening Clear</p>
                                                <p className="text-xs opacity-80">No matches found in global watchlists</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-amber-700 bg-amber-50 p-3 rounded-md">
                                            <ExclamationTriangleIcon className="w-5 h-5 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium">Pending Dual Approval</p>
                                                <p className="text-xs opacity-80">Waiting for CFO authorization</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Column - Workflow */}
                        <div className="space-y-8">

                            {/* Signature Card */}
                            <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-primary-900 to-primary-700 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center text-white">
                                        <LockClosedIcon className="w-5 h-5 mr-2" />
                                        <span className="font-medium">Post-Quantum Signature</span>
                                    </div>
                                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">VALID</span>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Algorithm</span>
                                        <span className="font-mono text-slate-900">{tx.signature.algorithm}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Security Level</span>
                                        <span className="text-emerald-600 font-medium">{tx.signature.level}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Size</span>
                                        <span className="font-mono text-slate-900">{tx.signature.size}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Generation Time</span>
                                        <span className="font-mono text-slate-900">{tx.signature.time}</span>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <p className="text-xs text-slate-500 mb-1">Transaction Hash (SHA3-256)</p>
                                        <p className="text-xs font-mono text-slate-400 break-all bg-slate-50 p-2 rounded">{tx.signature.hash}</p>
                                    </div>

                                    <button className="w-full mt-2 flex justify-center items-center px-4 py-2 border border-primary-200 shadow-sm text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100">
                                        <ShieldCheckIcon className="w-4 h-4 mr-2" />
                                        Verify Signature
                                    </button>
                                </div>
                            </div>

                            {/* Approval Workflow */}
                            <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-slate-900 mb-4">Approval Status</h3>

                                    <div className="relative">
                                        <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-slate-200" aria-hidden="true"></div>
                                        <ul className="space-y-6 relative">

                                            <li className="flex items-start">
                                                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-green-500 ring-8 ring-white">
                                                    <CheckBadgeIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                                </span>
                                                <div className="ml-4 min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-slate-900">John Smith</div>
                                                    <p className="text-xs text-slate-500">Initiated & Signed • Jan 14, 14:24</p>
                                                </div>
                                            </li>

                                            <li className="flex items-start">
                                                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 ring-8 ring-white border-2 border-yellow-400">
                                                    <ClockIcon className="h-5 w-5 text-yellow-600" aria-hidden="true" />
                                                </span>
                                                <div className="ml-4 min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-slate-900">Sarah Johnson (CFO)</div>
                                                    <p className="text-xs text-slate-500">Pending Approval • Notified</p>
                                                </div>
                                            </li>

                                        </ul>
                                    </div>

                                    <div className="mt-6 bg-slate-50 p-4 rounded border border-slate-200 text-center">
                                        <p className="text-sm text-slate-600 mb-3">You are NOT Sarah Johnson.</p>
                                        <button disabled className="w-full px-4 py-2 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-slate-400 cursor-not-allowed">
                                            Approve Transaction
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
