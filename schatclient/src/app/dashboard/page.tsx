
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { PlusIcon, CheckBadgeIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DashboardPage() {
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

                    <div className="grid grid-cols-1 gap-8">
                        <div className="">
                            <RecentTransactions />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
