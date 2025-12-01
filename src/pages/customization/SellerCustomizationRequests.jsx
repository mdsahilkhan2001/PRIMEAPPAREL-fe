import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../../api';
import CustomizationRequestCard from '../../components/customization/CustomizationRequestCard';
import { Package, Filter, DollarSign } from 'lucide-react';

import SellerRequestDetailModal from '../../components/customization/SellerRequestDetailModal';

const SellerCustomizationRequests = () => {
    const { user } = useSelector((state) => state.auth); // Get user from Redux
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('ALL');

    // Modal state
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log('Current User Role:', user?.role); // Debug log

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get('/customizations/seller-requests');
                setRequests(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching requests:', err);
                console.error('Error response:', err.response?.data); // Detailed log
                setError(err.response?.data?.message || 'Failed to load customization requests');
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const filteredRequests = filter === 'ALL'
        ? requests
        : requests.filter(req => req.status === filter);

    const handleCardClick = (requestId) => {
        const request = requests.find(r => r._id === requestId);
        if (request) {
            setSelectedRequest(request);
            setIsModalOpen(true);
        }
    };

    const handleRequestUpdate = (updatedRequest) => {
        setRequests(prev => prev.map(req =>
            req._id === updatedRequest._id ? updatedRequest : req
        ));
        setSelectedRequest(updatedRequest);
    };

    if (loading) return (
        <div className="min-h-screen pt-24 pb-12 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Incoming Customization Requests</h1>
                        <p className="text-gray-500 mt-1">Review requests and send quotes to buyers</p>
                    </div>

                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                        <Filter size={16} className="text-gray-400 ml-2" />
                        {['ALL', 'PENDING', 'QUOTED', 'ACCEPTED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === status
                                    ? 'bg-accent text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {status.charAt(0) + status.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                {filteredRequests.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
                        <p className="text-gray-500 mt-2">You don't have any incoming customization requests.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRequests.map(request => (
                            <CustomizationRequestCard
                                key={request._id}
                                request={request}
                                onClick={() => handleCardClick(request._id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Request Detail Modal */}
            <SellerRequestDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                request={selectedRequest}
                onUpdate={handleRequestUpdate}
            />
        </div>
    );
};

export default SellerCustomizationRequests;
