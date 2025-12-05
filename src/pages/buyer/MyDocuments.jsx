import { useState } from 'react';
import { useGetMyDocumentsQuery, useDownloadDocumentQuery } from '../../redux/slices/apiSlice';
import { FileText, Download, Search, Filter, Loader, Calendar, Package } from 'lucide-react';
import { getFileUrl } from '../../config';

const MyDocuments = () => {
    const { data: response, isLoading, error } = useGetMyDocumentsQuery();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    const downloadDocument = async (docId, fileName) => {
        try {
            // Using direct download link from the backend
            // In a real app, you might want to sign this URL or handle it via a dedicated download endpoint that streams the file
            // For now, let's assume the filePath is accessible or we verify via API
            // We can also trigger a download via window.open if it's a static file
            // But let's use the API endpoint we created
            const token = JSON.parse(localStorage.getItem('user'))?.token;

            const downloadUrl = `${import.meta.env.VITE_API_URL}/documents/${docId}/download`;

            const res = await fetch(downloadUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Download failed');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName; // backend response might suggest filename, but we can use doc number
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
        const matchesSearch = doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.orderId?.piNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'ALL' || doc.documentType === filterType;
        return matchesSearch && matchesType;
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

    if (isLoading) return (
        <div className="flex justify-center items-center h-full p-12">
            <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    if (error) return (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg m-8">
            <p>Error loading documents: {error.data?.error || error.message || 'Unknown error'}</p>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-gray-900">My Documents</h1>
                <p className="text-gray-500 mt-2">Access and download all your trade documents</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by Document No. or PI No..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    <Filter className="w-5 h-5 text-gray-400" />
                    {['ALL', 'PI', 'CI', 'PACKING_LIST', 'AWB'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filterType === type
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {type === 'ALL' ? 'All Docs' : type.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Documents List */}
            {filteredDocuments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search terms</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocuments.map((doc) => (
                        <div key={doc._id} className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all p-5 flex flex-col h-full group">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${getTypeColor(doc.documentType)}`}>
                                    {doc.documentType.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">
                                    v{doc.version}
                                </span>
                            </div>

                            <div className="flex-1 mb-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                                    {doc.documentNumber}
                                </h3>

                                <div className="space-y-2 text-sm text-gray-600 mt-3">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-gray-400" />
                                        <span>Order: <span className="font-medium text-gray-900">{doc.orderId?.piNumber || 'Pending'}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {doc.metadata?.trackingNumber && (
                                        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit">
                                            <Package className="w-3 h-3" />
                                            <span className="text-xs font-medium">{doc.metadata.courier}: {doc.metadata.trackingNumber}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className={`text-xs font-medium px-2 py-1 rounded ${doc.status === 'APPROVED' || doc.status === 'SENT' ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-50'
                                    }`}>
                                    {doc.status}
                                </span>
                                <button
                                    onClick={() => downloadDocument(doc._id, `${doc.documentNumber}.pdf`)}
                                    className="flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors text-sm bg-primary/5 hover:bg-primary/10 px-3 py-2 rounded-lg"
                                >
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyDocuments;
