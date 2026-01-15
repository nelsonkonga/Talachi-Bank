import { EllipsisHorizontalIcon, CheckCircleIcon, ClockIcon, XCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

import { Transaction } from '@/lib/api/transaction';

interface RecentTransactionsProps {
    transactions: Transaction[];
    isLoading?: boolean;
}

const statusStyles = {
    SIGNED: 'bg-blue-100 text-blue-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    EXECUTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    FAILED: 'bg-red-100 text-red-800',
};

const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'SIGNED': return <CheckCircleIcon className="w-4 h-4 mr-1.5" />;
        case 'PENDING': return <ClockIcon className="w-4 h-4 mr-1.5" />;
        case 'EXECUTED': return <CheckCircleIcon className="w-4 h-4 mr-1.5" />;
        case 'REJECTED':
        case 'FAILED': return <XCircleIcon className="w-4 h-4 mr-1.5" />;
        default: return null;
    }
};

export default function RecentTransactions({ transactions, isLoading }: RecentTransactionsProps) {
    if (isLoading) {
        return (
            <div className="bg-white shadow rounded-lg border border-slate-100 p-8 text-center text-slate-500">
                Loading transactions...
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="bg-white shadow rounded-lg border border-slate-100 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClockIcon className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No Transactions Yet</h3>
                <p className="text-slate-500 max-w-xs mx-auto">Your recent activity will appear here once you start making transfers.</p>
                <Link href="/sign-transaction" className="mt-6 inline-flex items-center text-primary-600 font-bold hover:text-primary-700">
                    Create your first transaction
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
            </div>
        );
    }
    return (
        <div className="bg-white shadow rounded-lg border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-base font-semibold leading-6 text-slate-900">Recent Transactions</h3>
                <button className="text-sm font-medium text-primary-600 hover:text-primary-500">View all</button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left font-medium text-slate-500 uppercase tracking-wider">Beneficiary</th>
                            <th className="px-6 py-3 text-right font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-center font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-center font-medium text-slate-500 uppercase tracking-wider">Risk</th>
                            <th className="px-6 py-3 text-right font-medium text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {transactions.map((tx) => (
                            <tr key={tx.transactionId} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-600 text-xs">{tx.transactionId.substring(0, 8)}...</td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-medium">{tx.transactionType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-600">{tx.beneficiaryName} <br /><span className="text-[10px] text-slate-400">{tx.toAccountNumber}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-slate-900">{tx.currency} {tx.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[tx.status as keyof typeof statusStyles]}`}>
                                        <StatusIcon status={tx.status} />
                                        {tx.status}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center">
                                        <div className="w-16 bg-slate-200 rounded-full h-1.5 mr-2">
                                            <div className={`h-1.5 rounded-full ${tx.riskScore < 30 ? 'bg-green-500' : tx.riskScore < 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${tx.riskScore || 0}%` }}></div>
                                        </div>
                                        <span className="text-xs text-slate-500">{tx.riskScore || 0}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <EllipsisHorizontalIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
