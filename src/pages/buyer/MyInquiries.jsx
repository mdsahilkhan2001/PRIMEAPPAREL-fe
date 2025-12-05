import { Mail, Phone, Package, Calendar, MapPin, MessageSquare, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useGetMyLeadsQuery } from '../../redux/slices/apiSlice';

const MyInquiries = () => {
    const { data, isLoading, isError, error } = useGetMyLeadsQuery();

    const inquiries = data?.data || [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'NEW': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'QUALIFIED': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'SCOPE_LOCKED': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'PI_SENT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'ORDER_CONFIRMED': return 'bg-green-100 text-green-800 border-green-200';
            case 'LOST': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'NEW': return <Clock className="w-4 h-4" />;
            case 'QUALIFIED': return <CheckCircle className="w-4 h-4" />;
            case 'SCOPE_LOCKED': return <CheckCircle className="w-4 h-4" />;
            case 'PI_SENT': return <MessageSquare className="w-4 h-4" />;
            case 'ORDER_CONFIRMED': return <CheckCircle className="w-4 h-4" />;
            case 'LOST': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusMessage = (status) => {
        switch (status) {
            case 'NEW': return 'Your inquiry has been received and is pending review';
            case 'QUALIFIED': return 'Seller has qualified your inquiry and is preparing a quote';
            case 'SCOPE_LOCKED': return 'Requirements confirmed - Quote preparation in progress';
            case 'PI_SENT': return 'Proforma Invoice has been sent to you';
            case 'ORDER_CONFIRMED': return 'Your order has been confirmed! Check My Orders for details';
            case 'LOST': return 'This inquiry was not processed (Out of stock or unavailable)';
            default: return 'Status update pending';
        }
    };

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
                    <p className="text-red-600 font-semibold">Error loading inquiries</p>
                    <p className="text-gray-500 text-sm mt-2">{error?.data?.message || 'Please try again later'}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Inquiries</h1>
                <p className="text-sm text-gray-500 mt-1">Track your product inquiries and seller responses</p>
            </div>

            {inquiries.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Inquiries Yet</h3>
                    <p className="text-gray-500">
                        Start browsing products and send inquiries to sellers!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {inquiries.map((inquiry) => (
                        <div
                            key={inquiry._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                        >
                            {/* Inquiry Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-gray-900">{inquiry.productType}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(inquiry.status)}`}>
                                                {getStatusIcon(inquiry.status)}
                                                {inquiry.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>Submitted on {new Date(inquiry.createdAt).toLocaleDateString()} at {new Date(inquiry.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                    </div>

                                    {inquiry.quantity && (
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Quantity Requested</p>
                                            <p className="text-2xl font-bold text-gray-900">{inquiry.quantity} pcs</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status Message */}
                            <div className={`px-6 py-3 ${inquiry.status === 'ORDER_CONFIRMED' ? 'bg-green-50' :
                                inquiry.status === 'LOST' ? 'bg-red-50' :
                                    inquiry.status === 'NEW' ? 'bg-blue-50' :
                                        'bg-yellow-50'
                                }`}>
                                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    {inquiry.status === 'ORDER_CONFIRMED' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                    {inquiry.status === 'LOST' && <XCircle className="w-4 h-4 text-red-600" />}
                                    {getStatusMessage(inquiry.status)}
                                </p>
                            </div>

                            {/* Inquiry Details */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Contact Info */}
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Your Contact Info</p>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <span className="text-gray-700">{inquiry.email}</span>
                                            </div>
                                            {inquiry.phone && (
                                                <div className="flex items-start gap-2 text-sm">
                                                    <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                                                    <span className="text-gray-700">{inquiry.countryCode} {inquiry.phone}</span>
                                                </div>
                                            )}
                                            <div className="flex items-start gap-2 text-sm">
                                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                                <span className="text-gray-700">{inquiry.country}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Product Details</p>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Package className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium text-gray-900 text-sm">{inquiry.productType}</span>
                                            </div>
                                            {inquiry.quantity && (
                                                <p className="text-xs text-gray-600">Quantity: {inquiry.quantity} pcs</p>
                                            )}
                                            {inquiry.budget && (
                                                <p className="text-xs text-gray-600 mt-1">Budget: {inquiry.budget}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Timeline</p>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-700">Inquiry Submitted</p>
                                                    <p className="text-xs text-gray-500">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            {inquiry.updatedAt !== inquiry.createdAt && (
                                                <div className="flex items-start gap-2">
                                                    <div className={`w-2 h-2 rounded-full mt-1.5 ${inquiry.status === 'ORDER_CONFIRMED' ? 'bg-green-500' :
                                                        inquiry.status === 'LOST' ? 'bg-red-500' :
                                                            'bg-yellow-500'
                                                        }`}></div>
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-700">Last Updated</p>
                                                        <p className="text-xs text-gray-500">{new Date(inquiry.updatedAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Message */}
                                {inquiry.message && (
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Your Message</p>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Reference Images */}
                                {inquiry.referenceImages && inquiry.referenceImages.length > 0 && (
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Reference Images</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {inquiry.referenceImages.map((img, idx) => (
                                                <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                    <img
                                                        src={img}
                                                        alt={`Reference ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Button */}
                                {inquiry.status === 'ORDER_CONFIRMED' && (
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <a
                                            href="/buyer/orders"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            View Order Details
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyInquiries;
