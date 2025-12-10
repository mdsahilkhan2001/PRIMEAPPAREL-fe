import { useState } from 'react';
import { X, Mail, MessageCircle, Phone, Users, FileText } from 'lucide-react';

const ReplyModal = ({ isOpen, onClose, onSubmit, contactName }) => {
    const [replyData, setReplyData] = useState({
        replyMethod: 'EMAIL',
        notes: '',
        followUpRequired: false,
        followUpDate: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(replyData);
        // Reset form
        setReplyData({
            replyMethod: 'EMAIL',
            notes: '',
            followUpRequired: false,
            followUpDate: ''
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setReplyData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (!isOpen) return null;

    const replyMethods = [
        { value: 'EMAIL', label: 'Email', icon: Mail, color: 'text-blue-600' },
        { value: 'WHATSAPP', label: 'WhatsApp', icon: MessageCircle, color: 'text-green-600' },
        { value: 'PHONE', label: 'Phone Call', icon: Phone, color: 'text-purple-600' },
        { value: 'IN_PERSON', label: 'In Person', icon: Users, color: 'text-orange-600' },
        { value: 'OTHER', label: 'Other', icon: FileText, color: 'text-gray-600' }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-accent/10 to-yellow-50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Track Reply</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Responding to <span className="font-semibold">{contactName}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Reply Method Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            How did you reply? *
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {replyMethods.map((method) => (
                                <label
                                    key={method.value}
                                    className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${replyData.replyMethod === method.value
                                            ? 'border-accent bg-accent/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="replyMethod"
                                        value={method.value}
                                        checked={replyData.replyMethod === method.value}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <method.icon className={`w-5 h-5 ${method.color}`} />
                                    <span className="text-sm font-medium text-gray-700">
                                        {method.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Reply Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Reply Notes (Optional)
                        </label>
                        <textarea
                            name="notes"
                            value={replyData.notes}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none text-sm"
                            placeholder="Add any notes about this conversation, agreements made, next steps, etc..."
                        />
                    </div>

                    {/* Follow-up Required */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="followUpRequired"
                                checked={replyData.followUpRequired}
                                onChange={handleChange}
                                className="mt-1 w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                            />
                            <div className="flex-1">
                                <span className="text-sm font-semibold text-gray-900">
                                    Requires Follow-up
                                </span>
                                <p className="text-xs text-gray-600 mt-1">
                                    Check this if you need to follow up with this contact later
                                </p>
                            </div>
                        </label>

                        {/* Follow-up Date */}
                        {replyData.followUpRequired && (
                            <div className="mt-3 animate-in slide-in-from-top">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Follow-up Date *
                                </label>
                                <input
                                    type="date"
                                    name="followUpDate"
                                    value={replyData.followUpDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required={replyData.followUpRequired}
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm"
                                />
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-accent to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg transition"
                        >
                            Mark as Replied
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReplyModal;
