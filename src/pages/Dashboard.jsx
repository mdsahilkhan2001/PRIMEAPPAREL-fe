import { ArrowUpRight, DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import { useGetLeadsQuery } from '../redux/slices/apiSlice';

const Dashboard = () => {
    const { data: leadsData, isLoading } = useGetLeadsQuery();

    const leads = leadsData?.data || [];

    // Calculate Stats
    const totalLeads = leads.filter(l => l.leadType === 'ODM' || l.leadType === 'OEM' || !l.leadType).length;
    const sampleRequests = leads.filter(l => l.leadType === 'SAMPLE_REQUEST').length;
    const activeOrders = leads.filter(l => l.status === 'ORDER_CONFIRMED' || l.status === 'PI_SENT').length;

    // Recent Activity (Mocked for now, but using real lead names if available)
    const recentActivity = leads.slice(0, 5).map(lead => ({
        id: lead._id,
        name: lead.name,
        action: lead.leadType === 'SAMPLE_REQUEST' ? 'Requested a Sample' : `Inquired about ${lead.productType}`,
        time: new Date(lead.createdAt).toLocaleDateString()
    }));

    const stats = [
        { title: 'Total Inquiries', value: totalLeads.toString(), icon: Users, change: 'ODM/OEM', color: 'bg-blue-500' },
        { title: 'Sample Requests', value: sampleRequests.toString(), icon: Package, change: 'active', color: 'bg-teal-500' },
        { title: 'Active Orders', value: activeOrders.toString(), icon: ShoppingBag, change: 'processing', color: 'bg-purple-500' },
        { title: 'Revenue (Est.)', value: '$45.2k', icon: DollarSign, change: '+8%', color: 'bg-green-500' },
    ];

    if (isLoading) return <div className="p-8">Loading Dashboard...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg text-white`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-gray-400 font-medium">{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {recentActivity.length > 0 ? recentActivity.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold mr-4">
                                    {item.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.action}</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">{item.time}</span>
                        </div>
                    )) : (
                        <div className="text-gray-500">No recent activity</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
