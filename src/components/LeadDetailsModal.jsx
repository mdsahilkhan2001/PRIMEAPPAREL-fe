import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Calendar, Package, DollarSign, Image as ImageIcon, CheckCircle, XCircle, Clock } from 'lucide-react';

const LeadDetailsModal = ({ lead, onClose, onStatusChange }) => {
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success'); // success, error, warning

    if (!lead) return null;

    const showToastMessage = (message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleStatusUpdate = async (newStatus, statusLabel) => {
        setLoading(true);
        try {
            await onStatusChange(lead._id, newStatus);
            showToastMessage(`Lead marked as ${statusLabel}!`, 'success');

            if (newStatus === 'ORDER_CONFIRMED') {
                setTimeout(() => {
                    showToastMessage('Order created successfully! Buyer can now see it in My Orders.', 'success');
                }, 1500);
            }
        } catch (error) {
            showToastMessage('Failed to update status. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'NEW': return 'bg-blue-100 text-blue-800';
            case 'QUALIFIED': return 'bg-purple-100 text-purple-800';
            case 'SCOPE_LOCKED': return 'bg-indigo-100 text-indigo-800';
            case 'PI_SENT': return 'bg-yellow-100 text-yellow-800';
            case 'ORDER_CONFIRMED': return 'bg-green-100 text-green-800';
            case 'LOST': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in fade-in zoom-in flex flex-col max-h-[90vh]">

                {/* Toast Notification */}
                {showToast && (
                    <div className={`fixed top-4 right-4 z-[60] px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-top ${toastType === 'success' ? 'bg-green-500 text-white' :
                        toastType === 'error' ? 'bg-red-500 text-white' :
                            'bg-yellow-500 text-white'
                        }`}>
                        {toastType === 'success' && <CheckCircle className="w-5 h-5" />}
                        {toastType === 'error' && <XCircle className="w-5 h-5" />}
                        {toastType === 'warning' && <Clock className="w-5 h-5" />}
                        <span className="font-medium">{toastMessage}</span>
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Inquiry Details</h3>
                        <p className="text-xs text-gray-500 mt-1">ID: {lead._id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

                    {/* Status Section */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-3">Current Status</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(lead.status)}`}>
                            {lead.status}
                        </span>
                    </div>

                    {/* Buyer Info */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full"></span>
                            Buyer Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Full Name & Email</p>
                                    <p className="font-medium text-gray-900">{lead.name}</p>
                                    <p className="text-sm text-gray-600">{lead.email}</p>
                                </div>
                            </div>
                            {lead.phone && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Phone Number</p>
                                        <p className="font-medium text-gray-900">{lead.countryCode || '+1'} {lead.phone}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Location</p>
                                    <p className="font-medium text-gray-900">{lead.country}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Inquiry Date</p>
                                    <p className="font-medium text-gray-900">{new Date(lead.createdAt).toLocaleDateString()}</p>
                                    <p className="text-xs text-gray-500">{new Date(lead.createdAt).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Interest */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
                            Product Interest
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-2 text-gray-500">
                                    <Package className="w-4 h-4" />
                                    <span className="text-xs font-medium uppercase">Product Type</span>
                                </div>
                                <p className="font-bold text-gray-900">{lead.productType}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-2 text-gray-500">
                                    <Package className="w-4 h-4" />
                                    <span className="text-xs font-medium uppercase">Quantity</span>
                                </div>
                                <p className="font-bold text-gray-900">{lead.quantity} pcs</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 mb-2 text-gray-500">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="text-xs font-medium uppercase">Target Budget</span>
                                </div>
                                <p className="font-bold text-gray-900">{lead.budget || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Message / Requirements</h4>
                        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {lead.message || "No additional details provided."}
                        </div>
                    </div>

                    {/* Reference Images */}
                    {lead.referenceImages && lead.referenceImages.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Reference Images
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {lead.referenceImages.map((img, index) => (
                                    <div key={index} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 cursor-zoom-in">
                                        <img
                                            src={img}
                                            alt={`Reference ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer with Action Buttons */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                    {/* Action Buttons - Moved to Bottom */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button
                            onClick={() => handleStatusUpdate('ORDER_CONFIRMED', 'Order Confirmed')}
                            disabled={loading || lead.status === 'ORDER_CONFIRMED'}
                            className="px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Confirm Order
                        </button>

                        <button
                            onClick={() => handleStatusUpdate('LOST', 'Out of Stock')}
                            disabled={loading}
                            className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            <XCircle className="w-4 h-4" />
                            Out of Stock
                        </button>

                        <button
                            onClick={() => handleStatusUpdate('NEW', 'Pending')}
                            disabled={loading}
                            className="px-4 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            <Clock className="w-4 h-4" />
                            Mark Pending
                        </button>

                        <button
                            onClick={() => handleStatusUpdate('QUALIFIED', 'Qualified')}
                            disabled={loading}
                            className="px-4 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Qualify Lead
                        </button>
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 shadow-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetailsModal;
