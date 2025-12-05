import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        warning: <AlertCircle className="w-5 h-5" />,
    };

    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
    };

    return (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${colors[type]}`}>
            {icons[type]}
            <span className="font-medium">{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default Toast;
