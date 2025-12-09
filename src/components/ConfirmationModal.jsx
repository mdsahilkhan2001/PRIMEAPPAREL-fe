import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    isDestructive = true
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="relative p-6 text-center border-b border-slate-100">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                        <AlertTriangle size={32} />
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {title}
                    </h3>

                    <p className="text-slate-500 text-sm leading-relaxed px-4">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="p-6 bg-slate-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-white border border-slate-200 cursor-pointer text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all focus:ring-2 focus:ring-slate-200"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2.5 text-white cursor-pointer font-medium rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 ${isDestructive
                            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20 focus:ring-red-500'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 focus:ring-blue-600'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
