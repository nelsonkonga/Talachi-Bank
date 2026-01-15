import { CurrencyEuroIcon, CreditCardIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface BalanceCardProps {
    balance: number;
    accountNumber: string;
}

export default function BalanceCard({ balance, accountNumber }: BalanceCardProps) {
    return (
        <div className="bg-primary-900 rounded-2xl shadow-xl overflow-hidden text-white mb-8">
            <div className="px-8 py-8 relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <CurrencyEuroIcon className="w-32 h-32" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center space-x-2 text-primary-300 mb-2">
                        <CreditCardIcon className="w-5 h-5" />
                        <span className="text-sm font-medium tracking-wider uppercase">Main Savings Account</span>
                    </div>

                    <div className="flex items-baseline space-x-3 mb-6">
                        <h2 className="text-4xl font-bold">€{balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                        <span className="text-primary-400 text-sm font-medium uppercase">EUR</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-primary-400 uppercase tracking-widest mb-1">Account Number</p>
                            <p className="text-lg font-mono tracking-widest">{accountNumber || 'TAL-0000000000'}</p>
                        </div>

                        <div className="bg-primary-800/50 rounded-xl px-4 py-2 border border-primary-700">
                            <div className="flex items-center space-x-2 text-green-400">
                                <ArrowTrendingUpIcon className="w-4 h-4" />
                                <span className="text-sm font-bold">+2.5%</span>
                            </div>
                            <p className="text-[10px] text-primary-400 mt-0.5">Annual Yield</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-primary-800 px-8 py-3 flex justify-between items-center text-xs text-primary-300">
                <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Post-Quantum Protected
                </span>
                <span>Last updated: Just now</span>
            </div>
        </div>
    );
}
