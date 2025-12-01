import React from 'react';
import { Calendar, Package, DollarSign, Clock, ChevronRight } from 'lucide-react';

const CustomizationRequestCard = ({ request, onClick }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'REVIEWING': return 'bg-blue-100 text-blue-800';
            case 'QUOTED': return 'bg-purple-100 text-purple-800';
            case 'ACCEPTED': return 'bg-green-100 text-green-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            case 'CANCELLED': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    <img
                        src={`http://localhost:5000${request.product.images[0]}`}
                        alt={request.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-accent transition-colors">
                            {request.product.name}
                        </h3>
                        <p className="text-sm text-gray-500">{request.designType}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                    {request.status}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package size={16} className="text-gray-400" />
                    <span>{request.quantity} units</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign size={16} className="text-gray-400" />
                    <span>${request.budget.min} - ${request.budget.max}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} className="text-gray-400" />
                    <span>{new Date(request.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span>Submitted {new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {request.sellerQuote && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-gray-500">Seller Quote</p>
                        <p className="font-bold text-accent text-lg">${request.sellerQuote}</p>
                    </div>
                    <button className="text-sm font-medium text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Details <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomizationRequestCard;
