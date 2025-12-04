import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle, User, DollarSign } from 'lucide-react';
import axios from '../../api';
import { getImageUrl } from '../../config';

const BuyerRequestDetailModal = ({ request, isOpen, onClose, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen || !request) return null;

    const handleStatusUpdate = async (newStatus) => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.put(`/customizations/${request._id}`, {
                status: newStatus
            });
            onUpdate(data);
            onClose();
        } catch (err) {
            console.error('Error updating status:', err);
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

                            {/* Seller Info */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <User size={16} className="text-accent" /> Seller Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-gray-500">Name:</span> {request.seller.name}</p>
                                    <p><span className="text-gray-500">Company:</span> {request.seller.company}</p>
                                    <p><span className="text-gray-500">Email:</span> {request.seller.email}</p>
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
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    {request.description}
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Actions & Quote */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Status & Quote</h3>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            {request.status === 'PENDING' && (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <DollarSign className="text-yellow-600" size={24} />
                                    </div>
                                    <h4 className="font-bold text-gray-900">Waiting for Quote</h4>
                                    <p className="text-gray-500 text-sm mt-2">The seller hasn't sent a quote yet. You'll be notified when they do.</p>
                                </div>
                            )}

                            {request.status === 'QUOTED' && (
                                <div className="space-y-6">
                                    <div className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
                                        <p className="text-sm text-gray-500 mb-1">Seller's Quote</p>
                                        <p className="text-3xl font-bold text-accent">${request.sellerQuote}</p>
                                        {request.sellerResponse && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-sm text-gray-600 italic">"{request.sellerResponse}"</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleStatusUpdate('ACCEPTED')}
                                            disabled={loading}
                                            className="py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={18} /> Accept Quote
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate('REJECTED')}
                                            disabled={loading}
                                            className="py-3 bg-white border border-red-200 text-red-600 rounded-lg font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={18} /> Reject
                                        </button>
                                    </div>
                                </div>
                            )}

                            {request.status === 'ACCEPTED' && (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle className="text-green-600" size={24} />
                                    </div>
                                    <h4 className="font-bold text-green-700">Request Accepted</h4>
                                    <p className="text-gray-600 text-sm mt-2">
                                        The request has been accepted. Production will proceed shortly.
                                    </p>
                                    {request.sellerQuote && (
                                        <div className="mt-4 p-3 bg-white rounded border border-green-100">
                                            <p className="text-sm font-medium">Final Price: <span className="text-accent">${request.sellerQuote}</span></p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {request.status === 'REJECTED' && (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <XCircle className="text-red-600" size={24} />
                                    </div>
                                    <h4 className="font-bold text-red-700">Quote Rejected</h4>
                                    <p className="text-gray-600 text-sm mt-2">You have rejected this quote.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerRequestDetailModal;
