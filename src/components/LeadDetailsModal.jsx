import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, Package, DollarSign, Image as ImageIcon } from 'lucide-react';

const LeadDetailsModal = ({ lead, onClose, onStatusChange }) => {
    if (!lead) return null;

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
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Current Status</p>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(lead.status)}`}>
                                {lead.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">Update Status:</label>
                            <select
                                value={lead.status}
                                onChange={(e) => onStatusChange(lead._id, e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                            >
                                <option value="NEW">NEW</option>
                                <option value="QUALIFIED">QUALIFIED</option>
                                <option value="SCOPE_LOCKED">SCOPE LOCKED</option>
                                <option value="PI_SENT">PI SENT</option>
                                <option value="ORDER_CONFIRMED">ORDER CONFIRMED</option>
                                <option value="LOST">LOST</option>
                            </select>
                        </div>
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

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={() => window.location.href = `/seller/costing?leadId=${lead._id}`}
                        className="px-6 py-2.5 bg-accent text-primary font-medium rounded-xl hover:bg-yellow-500 shadow-sm flex items-center gap-2"
                    >
                        <DollarSign className="w-4 h-4" />
                        Create Costing
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 shadow-sm"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeadDetailsModal;
