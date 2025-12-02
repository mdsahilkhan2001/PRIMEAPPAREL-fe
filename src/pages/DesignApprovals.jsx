import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Edit, Eye, Filter, Search } from 'lucide-react';
import API from '../api';
import AddProductModal from '../components/AddProductModal';

const DesignApprovals = () => {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchDesigns();
    }, [filter]);

    const fetchDesigns = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/products/pending-designs?status=${filter}`);
            setDesigns(response.data);
        } catch (error) {
            console.error('Error fetching designs:', error);
            alert('Failed to fetch designs');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (productId) => {
        if (!window.confirm('Are you sure you want to approve this design?')) {
            return;
        }

        try {
            await API.put(`/products/${productId}/approval`, {
                approvalStatus: 'APPROVED',
                status: 'ACTIVE'
            });
            alert('Design approved successfully');
            fetchDesigns();
        } catch (error) {
            console.error('Error approving design:', error);
            alert('Failed to approve design');
        }
    };

    const handleReject = async (productId) => {
        const reason = window.prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            await API.put(`/products/${productId}/approval`, {
                approvalStatus: 'REJECTED',
                status: 'INACTIVE',
                rejectionReason: reason
            });
            alert('Design rejected');
            fetchDesigns();
        } catch (error) {
            console.error('Error rejecting design:', error);
            alert('Failed to reject design');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowEditModal(true);
    };

    const handleModalClose = () => {
        setShowEditModal(false);
        setEditingProduct(null);
        fetchDesigns();
    };

    const filteredDesigns = designs.filter(design =>
        design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status) => {
        const colors = {
            APPROVED: 'bg-green-100 text-green-800',
            PENDING: 'bg-orange-100 text-orange-800',
            REJECTED: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Design Approvals</h1>
                <p className="text-sm text-gray-500 mt-1">Review and approve designs submitted by designers</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex gap-4 flex-wrap items-center">
                    <div className="flex-1 min-w-[250px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search designs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-gray-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="ALL">All</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Designs Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading designs...</p>
                </div>
            ) : filteredDesigns.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <p className="text-gray-500 text-lg">No designs found</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredDesigns.map((design) => (
                                    <tr key={design._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img
                                                        className="h-10 w-10 rounded-lg object-cover bg-gray-100"
                                                        src={design.images && design.images[0] ? `http://localhost:5000${encodeURI(design.images[0])}` : '/placeholder.jpg'}
                                                        alt={design.name}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/40?text=No+Image';
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{design.name}</div>
                                                    <div className="text-xs text-gray-500">{design.sku || `ID-${design._id.slice(-6)}`}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{design.createdBy?.name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{design.createdBy?.email || ''}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{design.category}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(design.approvalStatus || 'PENDING')}`}>
                                                {design.approvalStatus || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{new Date(design.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                {design.approvalStatus === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(design._id)}
                                                            className="text-green-600 hover:text-green-800"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(design._id)}
                                                            className="text-red-500 hover:text-red-700"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleEdit(design)}
                                                    className="text-primary hover:text-primary/80"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <AddProductModal
                    isOpen={showEditModal}
                    onClose={handleModalClose}
                    product={editingProduct}
                />
            )}
        </div>
    );
};

export default DesignApprovals;
