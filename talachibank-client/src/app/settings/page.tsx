'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import {
    UserCircleIcon,
    KeyIcon,
    ShieldExclamationIcon,
    ArchiveBoxArrowDownIcon,
    LockClosedIcon,
    ArrowPathIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import ToastNotification, { showError, showSuccess } from '@/components/ui/ToastNotification';

const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'security', name: 'Security', icon: ShieldExclamationIcon },
    { id: 'sdith', name: 'SDitH Keys', icon: KeyIcon },
];

export default function SettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('sdith');
    const [keys, setKeys] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'sdith') {
            fetchKeys();
        }
    }, [activeTab]);

    const fetchKeys = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.getClient().get('/api/user/keys');
            setKeys(response.data);
        } catch (err) {
            showError("Failed to fetch security keys.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <Sidebar />
            <ToastNotification />

            <main className="pl-64 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h1>

                    <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden min-h-[600px] flex flex-col md:flex-row">

                        <aside className="w-full md:w-64 border-r border-slate-200 bg-slate-50">
                            <nav className="space-y-1 p-4">
                                {tabs.map((tab) => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`
                        w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors
                        ${isActive
                                                    ? 'bg-white text-primary-700 shadow-sm ring-1 ring-black/5'
                                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                      `}
                                        >
                                            <tab.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-500' : 'text-slate-400'}`} />
                                            {tab.name}
                                        </button>
                                    );
                                })}
                            </nav>
                        </aside>

                        <div className="flex-1 p-8">
                            {activeTab === 'sdith' && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-lg font-medium text-slate-900">SDitH Key Management</h2>
                                            <p className="mt-1 text-sm text-slate-500">Manage your post-quantum cryptographic keys generated during registration.</p>
                                        </div>
                                        <button
                                            onClick={fetchKeys}
                                            className="p-2 text-slate-400 hover:text-primary-600 transition-all rounded-full hover:bg-slate-100"
                                            title="Refresh Keys"
                                        >
                                            <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {keys.length === 0 ? (
                                            <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                                <KeyIcon className="mx-auto h-12 w-12 text-slate-300" />
                                                <p className="mt-2 text-sm text-slate-500">No security keys found for this account.</p>
                                            </div>
                                        ) : (
                                            keys.map((key) => (
                                                <div key={key.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:border-primary-300 transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <h3 className="text-base font-medium text-slate-900">Key Pair #{key.id}</h3>
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${key.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                                                    {key.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-slate-500 mt-1">Security: <span className="font-medium text-slate-700">Level {key.securityLevel === 128 ? '1' : key.securityLevel === 192 ? '3' : '5'} ({key.securityLevel}-bit)</span></p>
                                                            <p className="text-sm text-slate-500">Created: {new Date(key.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors" title="View Details">
                                                                <ArchiveBoxArrowDownIcon className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 bg-slate-50 p-3 rounded font-mono text-xs text-slate-600 break-all border border-slate-100">
                                                        <span className="text-slate-400 mr-2">Fingerprint:</span>
                                                        {key.publicKey?.substring(0, 64)}...
                                                    </div>

                                                    <div className="mt-4 flex items-center text-xs text-slate-500">
                                                        <CheckCircleIcon className="w-3 h-3 mr-1 text-success-600" />
                                                        Post-Quantum Secure (SDitH v1.1)
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                                        <div className="flex">
                                            <ShieldExclamationIcon className="h-6 w-6 text-amber-600 mr-3" />
                                            <div>
                                                <h3 className="text-sm font-bold text-amber-900">Key Generation Note</h3>
                                                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                                                    New SDitH key pairs are currenty auto-generated during registration. Manual key rotation will be available in the next system update.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'profile' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h2 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-4">Personal Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Username</p>
                                            <p className="text-slate-900 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">@{user?.username}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                                            <p className="text-slate-900 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">{user?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Account Number</p>
                                            <p className="text-slate-900 font-mono font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">{user?.accountNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Role</p>
                                            <p className="text-success-700 font-bold bg-success-50 p-3 rounded-lg border border-success-100 text-sm uppercase tracking-tight">
                                                {user?.roles?.[0]?.replace('ROLE_', '')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h2 className="text-lg font-medium text-slate-900 border-b border-slate-100 pb-4">Access Control</h2>
                                    <p className="text-sm text-slate-600">You can manage your password in the specialized security section.</p>
                                    <a
                                        href="/settings/security"
                                        className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md"
                                    >
                                        <LockClosedIcon className="w-5 h-5 mr-3 text-primary-400" />
                                        Access Security Terminal
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
