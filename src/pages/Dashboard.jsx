import { ArrowUpRight, DollarSign, ShoppingBag, Users } from 'lucide-react';

const Dashboard = () => {
    const stats = [
        { title: 'Total Leads', value: '124', icon: Users, change: '+12%', color: 'bg-blue-500' },
        { title: 'Active Orders', value: '8', icon: ShoppingBag, change: '+2', color: 'bg-purple-500' },
        { title: 'Revenue (M)', value: '$45.2k', icon: DollarSign, change: '+8%', color: 'bg-green-500' },
        { title: 'Pending Tasks', value: '12', icon: ArrowUpRight, change: '-4', color: 'bg-orange-500' },
    ];

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
                            <span className="text-green-500 font-medium">{stat.change}</span>
                            <span className="text-gray-400 ml-2">from last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold mr-4">
                                    JD
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">New Lead: John Doe</p>
                                    <p className="text-sm text-gray-500">Inquired about Kaftans (500 pcs)</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">2 hours ago</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
