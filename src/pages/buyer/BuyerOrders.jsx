import { Package, Calendar, Truck, CheckCircle, Clock, FileText } from 'lucide-react';
import { useGetMyOrdersQuery } from '../../redux/slices/apiSlice';

const BuyerOrders = () => {
    const { data, isLoading, isError, error } = useGetMyOrdersQuery();

    const orders = data?.data || [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'PI_GENERATED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'ADVANCE_RECEIVED': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'PRODUCTION': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'QC_PASSED': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'SHIPPED': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PI_GENERATED': return <FileText className="w-4 h-4" />;
            case 'ADVANCE_RECEIVED': return <CheckCircle className="w-4 h-4" />;
            case 'PRODUCTION': return <Package className="w-4 h-4" />;
            case 'QC_PASSED': return <CheckCircle className="w-4 h-4" />;
            case 'SHIPPED': return <Truck className="w-4 h-4" />;
            case 'DELIVERED': return <CheckCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
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
                    <p className="text-red-600 font-semibold">Error loading orders</p>
                    <p className="text-gray-500 text-sm mt-2">{error?.data?.message || 'Please try again later'}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
                <p className="text-sm text-gray-500 mt-1">Track and manage your confirmed orders</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Orders Yet</h3>
                    <p className="text-gray-500">
                        Your confirmed orders will appear here. Start by browsing products and sending inquiries!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                        >
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-gray-900">Order #{order.piNumber}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {order.totalAmount > 0 && (
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Total Amount</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                ${order.totalAmount.toFixed(2)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Products */}
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Products</p>
                                        {order.products && order.products.length > 0 ? (
                                            <div className="space-y-2">
                                                {order.products.map((product, idx) => (
                                                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                                        <p className="font-medium text-gray-900 text-sm">{product.styleName}</p>
                                                        <p className="text-xs text-gray-500 mt-1">Qty: {product.quantity} pcs</p>
                                                        {product.unitPrice > 0 && (
                                                            <p className="text-xs text-gray-600 mt-1">Unit Price: ${product.unitPrice.toFixed(2)}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No products listed</p>
                                        )}
                                    </div>

                                    {/* Delivery Address */}
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Delivery To</p>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="font-medium text-gray-900 text-sm">{order.buyerDetails?.name || 'N/A'}</p>
                                            <p className="text-xs text-gray-600 mt-1">{order.buyerDetails?.address || 'Address not specified'}</p>
                                            {order.buyerDetails?.email && (
                                                <p className="text-xs text-gray-500 mt-1">{order.buyerDetails.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Timeline</p>
                                        <div className="space-y-2">
                                            {order.timeline?.piDate && (
                                                <div className="flex items-start gap-2">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-700">PI Generated</p>
                                                        <p className="text-xs text-gray-500">{new Date(order.timeline.piDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {order.timeline?.advanceDate && (
                                                <div className="flex items-start gap-2">
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-700">Advance Received</p>
                                                        <p className="text-xs text-gray-500">{new Date(order.timeline.advanceDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {order.timeline?.productionStartDate && (
                                                <div className="flex items-start gap-2">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5"></div>
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-700">Production Started</p>
                                                        <p className="text-xs text-gray-500">{new Date(order.timeline.productionStartDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {order.timeline?.shipmentDate && (
                                                <div className="flex items-start gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-700">Shipped</p>
                                                        <p className="text-xs text-gray-500">{new Date(order.timeline.shipmentDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Payment Terms */}
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Payment & Terms</p>
                                        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                                            <div>
                                                <p className="text-xs text-gray-500">Payment Terms</p>
                                                <p className="text-sm font-medium text-gray-900">{order.paymentTerms || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Commercial Term</p>
                                                <p className="text-sm font-medium text-gray-900">{order.commercialTerm || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Documents */}
                                {(order.documents?.piUrl || order.documents?.invoiceUrl || order.documents?.awbUrl) && (
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Documents</p>
                                        <div className="flex flex-wrap gap-3">
                                            {order.documents.piUrl && (
                                                <a
                                                    href={order.documents.piUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium flex items-center gap-2"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    Proforma Invoice
                                                </a>
                                            )}
                                            {order.documents.invoiceUrl && (
                                                <a
                                                    href={order.documents.invoiceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm font-medium flex items-center gap-2"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    Commercial Invoice
                                                </a>
                                            )}
                                            {order.documents.awbUrl && (
                                                <a
                                                    href={order.documents.awbUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 text-sm font-medium flex items-center gap-2"
                                                >
                                                    <Truck className="w-4 h-4" />
                                                    Shipping Documents
                                                </a>
                                            )}
                                        </div>
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

export default BuyerOrders;
