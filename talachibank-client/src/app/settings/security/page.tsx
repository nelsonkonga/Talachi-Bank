"use client";

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { LockClosedIcon, ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import ToastNotification, { showSuccess, showError } from '@/components/ui/ToastNotification';

export default function SecuritySettingsPage() {
    const { changePassword } = useAuth();
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            showError("New passwords do not match.");
            return;
        }

        if (passwords.newPassword.length < 8) {
            showError("New password must be at least 8 characters long.");
            return;
        }

        setIsSubmitting(true);
        try {
            await changePassword(passwords.oldPassword, passwords.newPassword);
            showSuccess("Password updated successfully!");
            setPasswords({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err: any) {
            showError(err.message || "Failed to update password.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <TopBar />
            <Sidebar />
            <ToastNotification />

            <main className="pl-64 pt-16">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium mb-2">
                                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                                Back to Dashboard
                            </Link>
                            <h1 className="text-3xl font-bold text-slate-900">Security Settings</h1>
                            <p className="text-slate-500 mt-1">Manage your account protection and credentials.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                                <div className="bg-slate-900 px-8 py-6 text-white border-b border-slate-800 flex items-center">
                                    <LockClosedIcon className="w-6 h-6 mr-3 text-primary-400" />
                                    <h2 className="text-xl font-bold">Change Password</h2>
                                </div>
                                <div className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50/50 outline-none transition-all"
                                                value={passwords.oldPassword}
                                                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                                                <input
                                                    type="password"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50/50 outline-none transition-all"
                                                    value={passwords.newPassword}
                                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50/50 outline-none transition-all"
                                                    value={passwords.confirmPassword}
                                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`inline-flex items-center px-8 py-3 bg-primary-900 text-white rounded-xl font-bold hover:bg-primary-800 transition-all shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {isSubmitting ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 shadow-sm">
                                <h3 className="text-xs font-bold text-primary-700 uppercase tracking-widest mb-4">Security Overview</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <ShieldCheckIcon className="w-5 h-5 text-success-600 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">SDitH Keys Active</p>
                                            <p className="text-xs text-slate-500">Post-quantum signature keys are correctly configured for your account.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <LockClosedIcon className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Session Secure</p>
                                            <p className="text-xs text-slate-500">Your connection is encrypted with standard TLS + TB PQC layer.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
