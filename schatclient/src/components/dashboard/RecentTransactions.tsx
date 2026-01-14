import { EllipsisHorizontalIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

const transactions = [
    {
        id: 'TX-4F2A5B8C',
        type: 'Wire Transfer',
        from: '**** 1234',
        to: 'ACME Inc.',
        amount: '€250,000.00',
        status: 'Signed',
        date: '2 min ago',
        risk: 68,
    },
    {
        id: 'TX-9E1D2C3B',
        type: 'SWIFT',
        from: '**** 5678',
        to: 'Globex Corp',
        amount: '€1,200,000.00',
        status: 'Pending',
        date: '15 min ago',
        risk: 85,
    },
    {
        id: 'TX-7A8B9C0D',
        type: 'Internal',
        from: '**** 9012',
        to: 'Ops Account',
        amount: '€5,000.00',
        status: 'Executed',
        date: '1 hour ago',
        risk: 12,
    },
    {
        id: 'TX-3E4F5G6H',
        type: 'Loan',
        from: '**** 3456',
        to: 'John Doe',
        amount: '€45,000.00',
        status: 'Rejected',
        date: '3 hours ago',
        risk: 92,
    },
    {
        id: 'TX-1A2B3C4D',
        type: 'Wire Transfer',
        from: '**** 1234',
        to: 'TechSolutions',
        amount: '€12,500.00',
        status: 'Signed',
        date: '5 hours ago',
        risk: 25,
    },
];

const statusStyles = {
    Signed: 'bg-blue-100 text-blue-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Executed: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
};

const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
        case 'Signed': return <CheckCircleIcon className="w-4 h-4 mr-1.5" />;
        case 'Pending': return <ClockIcon className="w-4 h-4 mr-1.5" />;
        case 'Executed': return <CheckCircleIcon className="w-4 h-4 mr-1.5" />;
        case 'Rejected': return <XCircleIcon className="w-4 h-4 mr-1.5" />;
        default: return null;
    }
};

export default function RecentTransactions() {
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
                            <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-600 text-xs">{tx.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-medium">{tx.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-600">{tx.to}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-slate-900">{tx.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[tx.status as keyof typeof statusStyles]}`}>
                                        <StatusIcon status={tx.status} />
                                        {tx.status}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center">
                                        <div className="w-16 bg-slate-200 rounded-full h-1.5 mr-2">
                                            <div className={`h-1.5 rounded-full ${tx.risk < 30 ? 'bg-green-500' : tx.risk < 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${tx.risk}%` }}></div>
                                        </div>
                                        <span className="text-xs text-slate-500">{tx.risk}</span>
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
