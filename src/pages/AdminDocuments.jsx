import { useState } from 'react';
import { useGetAllDocumentsQuery, useDownloadDocumentQuery, useUpdateDocumentStatusMutation } from '../redux/slices/apiSlice';
import { FileText, Download, Search, Filter, Loader, Calendar, Package, Eye, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

const AdminDocuments = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');

    // In a real app we'd paginate and filter server-side
    const { data: response, isLoading, error } = useGetAllDocumentsQuery();
    const [updateStatus] = useUpdateDocumentStatusMutation();

    const downloadDocument = async (docId, fileName) => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const downloadUrl = `${import.meta.env.VITE_API_URL}/documents/${docId}/download`;
            const res = await fetch(downloadUrl, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) throw new Error('Download failed');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Download error:", err);
            alert("Failed to download document");
        }
    };

    const documents = response?.data || [];

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch =
            doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.orderId?.piNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.orderId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.orderId?.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'ALL' || doc.documentType === filterType;
        const matchesStatus = filterStatus === 'ALL' || doc.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const getTypeColor = (type) => {
        switch (type) {
            case 'PI': return 'bg-blue-100 text-blue-800';
            case 'CI': return 'bg-green-100 text-green-800';
            case 'PACKING_LIST': return 'bg-purple-100 text-purple-800';
            case 'AWB': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-800';
            case 'SENT': return 'bg-blue-100 text-blue-800';
            case 'DRAFT': return 'bg-gray-100 text-gray-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        if (window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
            try {
                await updateStatus({ id, status: newStatus }).unwrap();
                // Toast logic would go here
            } catch (err) {
                console.error("Failed to update status", err);
                alert("Failed to update status");
            }
        }
    }

    if (isLoading) return <div className="flex justify-center items-center h-full p-12"><Loader className="w-8 h-8 animate-spin text-primary" /></div>;
    if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg m-8">Error loading documents</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Document Management</h1>
                    <p className="text-gray-500 mt-2">Oversee all system generated trade documents</p>
                </div>
                <div className="text-sm text-gray-500">
                    Total Documents: <span className="font-bold text-primary">{filteredDocuments.length}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-4 md:space-y-0 md:flex md:gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search docs, orders, or buyers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                    />
                </div>

                <div className="flex gap-4">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                    >
                        <option value="ALL">All Types</option>
                        <option value="PI">Proforma Invoice</option>
                        <option value="CI">Commercial Invoice</option>
                        <option value="PACKING_LIST">Packing List</option>
                        <option value="AWB">AWB / Tracking</option>
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="DRAFT">Draft</option>
                        <option value="SENT">Sent</option>
                        <option value="APPROVED">Approved</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Table View */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full hidden md:table">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Document</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order / Buyer</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredDocuments.length > 0 ? (
                            filteredDocuments.map((doc) => (
                                <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg">
                                                <FileText className="h-5 w-5 text-gray-500" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900">{doc.documentNumber}</div>
                                                <div className={`text-xs font-medium inline-block mt-1 px-2 py-0.5 rounded ${getTypeColor(doc.documentType)}`}>{doc.documentType.replace('_', ' ')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{doc.orderId?.piNumber || 'No Order #'}</div>
                                        <div className="text-sm text-gray-500">{doc.orderId?.userId?.email || 'Unknown User'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(doc.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doc.status)}`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end items-center gap-3">
                                            <button
                                                onClick={() => downloadDocument(doc._id, `${doc.documentNumber}.pdf`)}
                                                className="text-primary hover:text-primary/80 transition-colors"
                                                title="Download PDF"
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>

                                            {/* Status Actions */}
                                            {doc.status === 'DRAFT' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(doc._id, 'SENT')}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Mark as Sent"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            )}

                                            {doc.status !== 'CANCELLED' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(doc._id, 'CANCELLED')}
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Cancel Document"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colspan="5" className="px-6 py-12 text-center text-gray-500">
                                    No documents found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Mobile List View (Simplified) */}
                <div className="md:hidden">
                    {filteredDocuments.map(doc => (
                        <div key={doc._id} className="p-4 border-b border-gray-100 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-gray-900">{doc.documentNumber}</div>
                                    <div className="text-xs text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${getTypeColor(doc.documentType)}`}>
                                    {doc.documentType.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <span className={`text-xs font-bold ${getStatusColor(doc.status)}`}>{doc.status}</span>
                                <button
                                    onClick={() => downloadDocument(doc._id, `${doc.documentNumber}.pdf`)}
                                    className="text-primary text-sm font-medium flex items-center gap-1"
                                >
                                    <Download className="w-4 h-4" /> Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDocuments;
