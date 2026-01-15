import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon as CheckCircleOutline } from '@heroicons/react/24/outline';

interface ValidationIconProps {
    isValid: boolean | null; // null means not yet validated/empty
    size?: number;
}

export default function ValidationIcon({ isValid, size = 5 }: ValidationIconProps) {
    const iconClass = `h-${size} w-${size} transition-all duration-300`;

    if (isValid === true) {
        return <CheckCircleIcon className={`${iconClass} text-green-500 scale-100 ease-out`} />;
    }

    if (isValid === false) {
        return <XCircleIcon className={`${iconClass} text-red-500 animate-pulse`} />;
    }

    // Not strictly valid or invalid yet (e.g. empty)
    return <CheckCircleOutline className={`${iconClass} text-gray-300`} />;
}
