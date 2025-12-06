import { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { useGetLeadsQuery, useUpdateLeadMutation } from '../redux/slices/apiSlice';
import LeadDetailsModal from '../components/LeadDetailsModal';

const SampleRequests = () => {
    const { data, isLoading, isError, error } = useGetLeadsQuery();
    const [updateLead] = useUpdateLeadMutation();

    const [selectedLead, setSelectedLead] = useState(null);

    // Filter for Sample Requests
    const leads = data?.data?.filter(lead => lead.leadType === 'SAMPLE_REQUEST') || [];

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateLead({ id, status: newStatus }).unwrap();

            // Update selected lead if it's open
            if (selectedLead && selectedLead._id === id) {
                setSelectedLead(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'NEW': return 'bg-blue-100 text-blue-800';
            case 'QUALIFIED': return 'bg-purple-100 text-purple-800';
            case 'SCOPE_LOCKED': return 'bg-indigo-100 text-indigo-800'; // Processing
            case 'PI_SENT': return 'bg-orange-100 text-orange-800'; // Shipped
            case 'ORDER_CONFIRMED': return 'bg-green-100 text-green-800'; // Delivered
            case 'LOST': return 'bg-red-100 text-red-800'; // Rejected
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    if (isError) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <p className="text-red-600 font-semibold">Error loading requests</p>
                <p className="text-gray-500 text-sm mt-2">{error?.data?.message || 'Please try again later'}</p>
            </div>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Sample Requests</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage product sample requests from buyers</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {leads.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No sample requests found.
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Name</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Product</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Phone</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Dest.</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Status</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Date</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {leads.map((lead) => (
                                <tr key={lead._id} className="hover:bg-gray-50 group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{lead.name}</div>
                                        <div className="text-xs text-gray-500 flex items-center mt-1">
                                            <Mail size={12} className="mr-1" /> {lead.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="font-medium">{lead.productType}</div>
                                        {lead.quantity && <div className="text-xs text-gray-400">Qty: {lead.quantity}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {lead.phone ? (
                                            <div className="flex items-center">
                                                <Phone size={12} className="mr-1" />
                                                {lead.countryCode || '+1'} {lead.phone}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{lead.country}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={lead.status}
                                            onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold border-none outline-none cursor-pointer appearance-none text-center min-w-[100px] ${getStatusColor(lead.status)}`}
                                        >
                                            <option value="NEW">New Request</option>
                                            <option value="QUALIFIED">Acknowledged</option>
                                            <option value="SCOPE_LOCKED">Processing</option>
                                            <option value="PI_SENT">Shipped</option>
                                            <option value="ORDER_CONFIRMED">Delivered</option>
                                            <option value="LOST">Rejected</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="font-medium">{new Date(lead.createdAt).toLocaleDateString()}</div>
                                        <div className="text-xs text-gray-500">{new Date(lead.createdAt).toLocaleTimeString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setSelectedLead(lead)}
                                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-sm font-medium"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <LeadDetailsModal
                lead={selectedLead}
                onClose={() => setSelectedLead(null)}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
};

export default SampleRequests;
