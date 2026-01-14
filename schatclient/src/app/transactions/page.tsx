'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import {
    FunnelIcon,
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    EllipsisVerticalIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const transactions = [
    { id: 'TX-4F2A5B8C', date: '2026-01-14 14:23', type: 'Wire Transfer', from: '**** 1234', to: 'ACME Inc.', amount: '250,000.00', currency: '€', status: 'Signed', risk: 68 },
    { id: 'TX-9E1D2C3B', date: '2026-01-14 10:15', type: 'SWIFT', from: '**** 5678', to: 'Globex Corp', amount: '1,200,000.00', currency: '€', status: 'Pending', risk: 85 },
    { id: 'TX-7A8B9C0D', date: '2026-01-13 16:45', type: 'Internal', from: '**** 9012', to: 'Ops Account', amount: '5,000.00', currency: '€', status: 'Executed', risk: 12 },
    { id: 'TX-3E4F5G6H', date: '2026-01-13 09:30', type: 'Loan', from: '**** 3456', to: 'John Doe', amount: '45,000.00', currency: '€', status: 'Rejected', risk: 92 },
    { id: 'TX-1A2B3C4D', date: '2026-01-12 11:20', type: 'Wire Transfer', from: '**** 1234', to: 'TechSolutions', amount: '12,500.00', currency: '€', status: 'Signed', risk: 25 },
    { id: 'TX-5H6I7J8K', date: '2026-01-11 15:55', type: 'SWIFT', from: '**** 7890', to: 'MegaCorp', amount: '500,000.00', currency: '$', status: 'Approved', risk: 45 },
];

const statusStyles = {
    Signed: 'bg-blue-100 text-blue-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Executed: 'bg-green-100 text-green-800',
    Approved: 'bg-indigo-100 text-indigo-800',
    Rejected: 'bg-red-100 text-red-800',
};

export default function TransactionsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <Sidebar />

            <main className="pl-64 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="md:flex md:items-center md:justify-between mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">Transaction History</h1>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <button className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-slate-500" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow border border-slate-200 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full rounded-md border-slate-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2"
                                    placeholder="Search ID, Account..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <select className="block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm">
                                <option>All Statuses</option>
                                <option>Pending</option>
                                <option>Signed</option>
                                <option>Approved</option>
                                <option>Executed</option>
                                <option>Rejected</option>
                            </select>

                            <select className="block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm">
                                <option>All Types</option>
                                <option>Wire Transfer</option>
                                <option>SWIFT</option>
                                <option>Internal</option>
                            </select>

                            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                                <FunnelIcon className="-ml-1 mr-2 h-5 w-5" />
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Transaction ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Beneficiary
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Risk
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                                            <Link href={`/transactions/1`}>{tx.id}</Link>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {tx.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                            {tx.type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {tx.to}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-900">
                                            {tx.currency}{tx.amount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[tx.status as keyof typeof statusStyles]}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center">
                                                <div className={`h-2.5 w-2.5 rounded-full mr-2 ${tx.risk > 70 ? 'bg-red-500' : tx.risk > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                                <span className="text-sm text-slate-500">{tx.risk}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-slate-400 hover:text-slate-600">
                                                <EllipsisVerticalIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200 sm:px-6">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-slate-700">
                                        Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">247</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">Previous</button>
                                        <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">1</button>
                                        <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">2</button>
                                        <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">3</button>
                                        <span className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-slate-50 text-sm font-medium text-slate-700">...</span>
                                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">Next</button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
