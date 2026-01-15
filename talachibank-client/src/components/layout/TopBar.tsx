import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';

export default function TopBar() {
    const { isAuthenticated, logout, user } = useAuth();

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
                            placeholder="Search transactions..."
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    {isAuthenticated() && (
                        <>
                            <div className="flex flex-col items-end mr-2">
                                <span className="text-xs font-bold text-slate-900">{user?.username}</span>
                                <span className="text-[10px] text-slate-400 font-medium">{user?.roles?.[0]?.replace('ROLE_', '')}</span>
                            </div>
                            <div className="border-l border-slate-200 h-6" />
                            <button
                                onClick={logout}
                                className="text-sm font-bold text-danger-600 hover:text-danger-700 transition-colors"
                            >
                                Sign out
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
