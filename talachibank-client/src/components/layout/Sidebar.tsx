'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HomeIcon,
    PlusCircleIcon,
    BanknotesIcon,
    ShieldCheckIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'New Transaction', href: '/sign-transaction', icon: PlusCircleIcon },
    { name: 'Transaction History', href: '/transactions', icon: BanknotesIcon },
    { name: 'Recharge Balance', href: '/account/recharge', icon: BanknotesIcon },
    { name: 'Verify Transaction', href: '/verify-transaction', icon: ShieldCheckIcon },
    { name: 'Security Settings', href: '/settings/security', icon: Cog6ToothIcon },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <div className="flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen fixed left-0 top-0 pt-16">
            <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                ${isActive
                                    ? 'bg-primary-700 text-white'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
              `}
                        >
                            <item.icon
                                className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
                                aria-hidden="true"
                            />
                            <span className="flex-1">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            {user && (
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                            {user.username.substring(0, 2)}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user.username}</p>
                            <p className="text-[10px] text-slate-400 truncate uppercase tracking-tighter">
                                {user.roles?.[0]?.replace('ROLE_', '')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
