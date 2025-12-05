import { useState } from 'react';
import { Eye, Package, Calendar, User } from 'lucide-react';
import { useGetSellerCustomizationsQuery } from '../redux/slices/apiSlice';
import SellerRequestDetailModal from '../components/customization/SellerRequestDetailModal';

const OemLeads = () => {
    const { data, isLoading, isError, refetch } = useGetSellerCustomizationsQuery();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [filter, setFilter] = useState('ALL');

    const requests = data || [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'REVIEWING': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'QUOTED': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
            case 'IN_PRODUCTION': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredRequests = filter === 'ALL'
        ? requests
        : requests.filter(req => req.status === filter);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-600 font-semibold">Error loading OEM leads</p>
                    <p className="text-gray-500 text-sm mt-2">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">OEM Leads</h1>
                <p className="text-sm text-gray-500 mt-1">Custom design requests (buyers providing their own designs)</p>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['ALL', 'PENDING', 'REVIEWING', 'QUOTED', 'APPROVED', 'IN_PRODUCTION', 'REJECTED'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filter === status
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {status.replace('_', ' ')}
                        {status === 'ALL' && ` (${requests.length})`}
                    </button>
                ))}
            </div>

            {/* Requests Grid */}
            {filteredRequests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No OEM Leads Found</h3>
                    <p className="text-gray-500">
                        Custom design requests from "Customize Now" will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRequests.map((request) => (
                        <div
                            key={request._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                            onClick={() => setSelectedRequest(request)}
                        >
                            {/* Product Image */}
                            <div className="relative h-48 bg-gray-100 overflow-hidden">
                                {request.productId?.images?.[0] ? (
                                    <img
                                        src={request.productId.images[0].startsWith('http')
                                            ? request.productId.images[0]
                                            : `http://localhost:5000/uploads/${request.productId.images[0]}`}
                                        alt={request.productId.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder.svg';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package size={64} className="text-gray-300" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(request.status)}`}>
                                        {request.status}
                                    </span>
                                </div>
                            </div>

                            {/* Request Details */}
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                                    {request.productId?.name || 'Custom Design'}
                                </h3>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-gray-400 flex-shrink-0" />
                                        <span className="truncate">{request.userId?.name || request.userId?.email}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Package size={14} className="text-gray-400 flex-shrink-0" />
                                        <span>Quantity: {request.quantity || 'Not specified'}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                                        <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Customizations Summary */}
                                {request.customizations && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex flex-wrap gap-2">
                                            {request.customizations.colors?.length > 0 && (
                                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                                    {request.customizations.colors.length} Colors
                                                </span>
                                            )}
                                            {request.customizations.sizes?.length > 0 && (
                                                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                                                    {request.customizations.sizes.length} Sizes
                                                </span>
                                            )}
                                            {request.customizations.fabric && (
                                                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                                    Custom Fabric
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* View Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedRequest(request);
                                    }}
                                    className="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 text-sm font-medium"
                                >
                                    <Eye size={16} />
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {selectedRequest && (
                <SellerRequestDetailModal
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onUpdate={refetch}
                />
            )}
        </div>
    );
};

export default OemLeads;
