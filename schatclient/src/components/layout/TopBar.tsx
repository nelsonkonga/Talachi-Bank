import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function TopBar() {
    return (
        <header className="bg-white shadow-sm h-16 fixed w-full top-0 z-10 flex items-center justify-between px-6 lg:px-8 border-b border-slate-200">
            <div className="flex items-center lg:w-64">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-900 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md mr-3">
                    TB
                </div>
                <span className="text-xl font-bold text-primary-900 tracking-tight">Talachi Bank</span>
            </div>

            <div className="flex-1 px-8 flex justify-between items-center">
                <div className="w-full max-w-md">
                    <div className="relative text-slate-500 focus-within:text-primary-600">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                            placeholder="Search transactions, accounts, or IDs..."
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 relative">
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    </button>

                    <div className="border-l border-slate-200 h-6 mx-2" />

                    <Link href="/logout" className="text-sm font-medium text-slate-500 hover:text-slate-700">
                        Sign out
                    </Link>
                </div>
            </div>
        </header>
    );
}
