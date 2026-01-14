'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import {
    UserCircleIcon,
    KeyIcon,
    BellIcon,
    Cog6ToothIcon,
    ShieldExclamationIcon,
    ArchiveBoxArrowDownIcon,
    PlusCircleIcon,
    TrashIcon,
    LockClosedIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'security', name: 'Security', icon: ShieldExclamationIcon },
    { id: 'sdith', name: 'SDitH Keys', icon: KeyIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'preferences', name: 'Preferences', icon: Cog6ToothIcon },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('sdith'); // Default to critical tab for demo
    const [showKeyGen, setShowKeyGen] = useState(false);

    // Mock Key Data
    const [keys, setKeys] = useState([
        { id: 1, created: '2026-01-10', level: 'Level 3 (192-bit)', status: 'Active', usage: 47, fingerprint: 'A4:F2:B8:C9:D3:E7...' }
    ]);

    const handleGenerateKey = () => {
        setShowKeyGen(true);
    };

    const onKeyGenComplete = () => {
        setShowKeyGen(false);
        // Add new key mock
        setKeys([...keys, {
            id: keys.length + 1,
            created: new Date().toISOString().split('T')[0],
            level: 'Level 5 (256-bit)',
            status: 'Active',
            usage: 0,
            fingerprint: 'NEW:KEY:GEN:...'
        }]);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <Sidebar />

            <main className="pl-64 pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h1>

                    <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden min-h-[600px] flex flex-col md:flex-row">

                        {/* Tabs Sidebar */}
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

                        {/* Content Area */}
                        <div className="flex-1 p-8">

                            {activeTab === 'sdith' && (
                                <div className="space-y-8 animate-fade-in">
                                    <div>
                                        <h2 className="text-lg font-medium text-slate-900">SDitH Key Management</h2>
                                        <p className="mt-1 text-sm text-slate-500">Manage your post-quantum cryptographic keys used for signing transactions.</p>
                                    </div>

                                    {/* Key List */}
                                    <div className="space-y-4">
                                        {keys.map((key) => (
                                            <div key={key.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:border-primary-300 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <h3 className="text-base font-medium text-slate-900">Key Pair #{key.id}</h3>
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                {key.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-500 mt-1">Security: <span className="font-medium text-slate-700">{key.level}</span></p>
                                                        <p className="text-sm text-slate-500">Created: {key.created}</p>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors" title="Export Public Key">
                                                            <ArchiveBoxArrowDownIcon className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Revoke Key">
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-4 bg-slate-50 p-3 rounded font-mono text-xs text-slate-600 break-all">
                                                    {key.fingerprint}
                                                </div>

                                                <div className="mt-4 flex items-center text-xs text-slate-500">
                                                    <LockClosedIcon className="w-3 h-3 mr-1" />
                                                    Used in {key.usage} transactions
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Generator Actions */}
                                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 border-dashed">
                                        <h3 className="text-sm font-medium text-slate-900 mb-4">Generate New Key Pair</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Security Level</label>
                                                <select className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2">
                                                    <option>Level 1 (128-bit) - Standard</option>
                                                    <option>Level 3 (192-bit) - Enhanced</option>
                                                    <option>Level 5 (256-bit) - Maximum</option>
                                                </select>
                                            </div>
                                            <div className="flex items-end">
                                                <button
                                                    onClick={handleGenerateKey}
                                                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                                >
                                                    <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                                                    Generate Key Pair
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                                        <div>
                                            <h3 className="text-sm font-medium text-slate-900">Key Rotation Policy</h3>
                                            <p className="text-xs text-slate-500">Automatically rotate keys every 90 days</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="bg-slate-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                                            role="switch"
                                            aria-checked="false"
                                        >
                                            <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'profile' && (
                                <div className="text-center py-20 text-slate-500">
                                    <UserCircleIcon className="mx-auto h-12 w-12 text-slate-400" />
                                    <h3 className="mt-2 text-sm font-medium text-slate-900">Profile Settings</h3>
                                    <p className="mt-1 text-sm text-slate-500">Manage your personal information.</p>
                                </div>
                            )}

                            {/* Other tabs placeholders */}
                            {!['sdith', 'profile'].includes(activeTab) && (
                                <div className="text-center py-20 text-slate-500">
                                    <Cog6ToothIcon className="mx-auto h-12 w-12 text-slate-400" />
                                    <h3 className="mt-2 text-sm font-medium text-slate-900">Work in Progress</h3>
                                    <p className="mt-1 text-sm text-slate-500">This section is being updated.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
