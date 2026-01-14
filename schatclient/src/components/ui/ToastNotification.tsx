'use client';

import { Toaster, toast } from 'react-hot-toast';
import {
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/solid';

const ToastNotification = () => {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#363636',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '16px',
                },
                success: {
                    iconTheme: {
                        primary: '#10b981', // green-500
                        secondary: '#fff',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444', // red-500
                        secondary: '#fff',
                    },
                },
            }}
        />
    );
};

export const showSuccess = (message: string) => toast.success(message, {
    icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }, // Green-50 theme
});

export const showError = (message: string) => toast.error(message, {
    icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
    style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }, // Red-50 theme
});

export const showInfo = (message: string) => toast(message, {
    icon: <InformationCircleIcon className="h-5 w-5 text-blue-500" />,
    style: { background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }, // Blue-50 theme
});

export const showWarning = (message: string) => toast(message, {
    icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
    style: { background: '#fefce8', color: '#854d0e', border: '1px solid #fde047' }, // Yellow-50 theme
});

export default ToastNotification;
