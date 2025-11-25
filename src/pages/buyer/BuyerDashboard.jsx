import { ShoppingBag, Package, FileText, ClipboardCheck, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchMyLeads } from '../../api';

const BuyerDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLeads = async () => {
            try {
                const { data } = await fetchMyLeads();
                setLeads(data.data);
            } catch (error) {
                console.error("Failed to fetch leads", error);
            } finally {
                setLoading(false);
            }
        };
        getLeads();
    }, []);

    const stats = [
        { title: 'Active Inquiries', value: leads.length || '0', icon: ShoppingBag, color: 'bg-blue-500', link: '/buyer/orders' },
        { title: 'In Production', value: '0', icon: Package, color: 'bg-orange-500', link: '/buyer/track' },
        { title: 'Documents', value: '0', icon: FileText, color: 'bg-purple-500', link: '/buyer/documents' },
        { title: 'Wishlist', value: '0', icon: ClipboardCheck, color: 'bg-pink-500', link: '/buyer/wishlist' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name || 'Buyer'}!</h1>
                <p className="text-gray-500">Here is an overview of your inquiries and production status.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <Link key={index} to={stat.link} className="block group">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all group-hover:shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                                    <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                                    <stat.icon size={24} />
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-primary font-medium group-hover:underline">
                                View Details &rarr;
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Inquiries */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">My Inquiries</h2>
                        <Link to="/buyer/orders" className="text-sm text-primary hover:underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                            </div>
                        ) : leads.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No inquiries found. Start by exploring products!
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                        <th className="pb-3 font-medium">Product</th>
                                        <th className="pb-3 font-medium">Qty</th>
                                        <th className="pb-3 font-medium">Budget</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {leads.map((lead) => (
                                        <tr key={lead._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                            <td className="py-4 font-medium text-gray-900">{lead.productType}</td>
                                            <td className="py-4 text-gray-600">{lead.quantity}</td>
                                            <td className="py-4 text-gray-600">{lead.budget}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${lead.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                                                        lead.status === 'QUALIFIED' ? 'bg-green-100 text-green-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Notifications</h2>
                    <div className="space-y-4">
                        <div className="flex items-start p-3 bg-blue-50 rounded-lg">
                            <div className="flex-shrink-0 mt-0.5">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-blue-800">Welcome!</p>
                                <p className="text-xs text-blue-600 mt-1">Your dashboard is ready. Start by sending an inquiry.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-800 mb-3">Quick Actions</h3>
                        <Link to="/products" className="block w-full text-center bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 text-sm shadow-md shadow-orange-500/20">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboard;
