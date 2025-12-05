import React, { useState } from 'react';
import { X, DollarSign, Send, CheckCircle, AlertCircle, FileText, Calendar, Package, User } from 'lucide-react';
import axios from '../../api';
import { getImageUrl } from '../../config';

const SellerRequestDetailModal = ({ request, isOpen, onClose, onUpdate }) => {
    const [quoteAmount, setQuoteAmount] = useState('');
    const [quoteMessage, setQuoteMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen || !request) return null;

    const handleSubmitQuote = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const { data } = await axios.put(`/customizations/${request._id}`, {
                sellerQuote: Number(quoteAmount),
                sellerResponse: quoteMessage,
                status: 'QUOTED'
            });

            onUpdate(data);
            onClose();
        } catch (err) {
            console.error('Error submitting quote:', err);
            setError(err.response?.data?.message || 'Failed to submit quote');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            setLoading(true);
            const { data } = await axios.put(`/customizations/${request._id}`, {
                status: newStatus
            });
            onUpdate(data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
                        <p className="text-sm text-gray-500">ID: {request._id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Request Info */}
                        <div className="space-y-6">
                            {/* Product Info */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <img
                                    src={getImageUrl(request.product.images[0])}
                                    alt={request.product.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                                <div>
                                    <h3 className="font-medium text-gray-900">{request.product.name}</h3>
                                    <p className="text-sm text-gray-500">Category: {request.product.category}</p>
                                </div>
                            </div>

                            {/* Buyer Info */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <User size={16} className="text-accent" /> Buyer Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-gray-500">Name:</span> {request.buyer.name}</p>
                                    <p><span className="text-gray-500">Email:</span> {request.buyer.email}</p>
                                </div>
                            </div>

                            {/* Specifications */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 border-b pb-2">Specifications</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Design Type</p>
                                        <p className="font-medium">{request.designType}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Quantity</p>
                                        <p className="font-medium">{request.quantity} units</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Budget Range</p>
                                        <p className="font-medium">${request.budget.min} - ${request.budget.max}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Deadline</p>
                                        <p className="font-medium">{new Date(request.deadline).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Quality Level</p>
                                        <p className="font-medium">{request.quality}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Colors</p>
                                    <div className="flex flex-wrap gap-2">
                                        {request.colors.map((c, i) => (
                                            <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs">{c.name}</span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm mb-1">Sizes</p>
                                    <div className="flex flex-wrap gap-2">
                                        {request.sizes.map((s, i) => (
                                            <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    {request.description}
                                </p>
                            </div>

                            {/* Reference Images */}
                            {request.referenceImages && request.referenceImages.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Reference Images</h4>
                                    <div className="grid grid-cols-4 gap-2">
                                        {request.referenceImages.map((img, i) => (
                                            <a key={i} href={getImageUrl(img)} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={getImageUrl(img)}
                                                    alt={`Ref ${i}`}
                                                    className="w-full h-20 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Actions */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Action Required</h3>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            {request.status === 'PENDING' && (
                                <form onSubmit={handleSubmitQuote} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Quote Amount ($)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <input
                                                type="number"
                                                required
                                                value={quoteAmount}
                                                onChange={(e) => setQuoteAmount(e.target.value)}
                                                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Message to Buyer</label>
                                        <textarea
                                            value={quoteMessage}
                                            onChange={(e) => setQuoteMessage(e.target.value)}
                                            rows={4}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                            placeholder="Provide details about your quote..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 bg-accent text-white rounded-lg font-bold hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
                                    >
                                        {loading ? 'Sending...' : 'Send Quote'} <Send size={18} />
                                    </button>
                                </form>
                            )}

                            {request.status === 'QUOTED' && (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle className="text-purple-600" size={24} />
                                    </div>
                                    <h4 className="font-bold text-gray-900">Quote Sent</h4>
                                    <p className="text-2xl font-bold text-accent my-2">${request.sellerQuote}</p>
                                    <p className="text-gray-500 text-sm">Waiting for buyer response</p>
                                </div>
                            )}

                            {request.status === 'ACCEPTED' && (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle className="text-green-600" size={24} />
                                    </div>
                                    <h4 className="font-bold text-green-700">Order Accepted!</h4>
                                    <p className="text-gray-600 text-sm mt-2">The buyer has accepted your quote. You can now proceed with production.</p>
                                </div>
                            )}
                            {/* Designer View / Admin Override Actions */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Quick Actions</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleStatusUpdate('ACCEPTED')}
                                        className="flex-1 py-2 border border-green-200 text-green-600 rounded-lg text-sm hover:bg-green-50"
                                    >
                                        Accept Request
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate('REJECTED')}
                                        className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50"
                                    >
                                        Reject Request
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerRequestDetailModal;
