import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../redux/slices/authSlice';
import {
    LayoutDashboard, Users, Calculator, FileText, ShoppingCart,
    Settings, LogOut, Package, ClipboardCheck, Palette, File, Plus, CheckCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    // Define menu items based on role
    let menuItems = [];

    if (user?.role === 'BUYER') {
        menuItems = [
            { name: 'Dashboard', path: '/buyer', icon: LayoutDashboard },
            { name: 'Customizations', path: '/buyer/customizations', icon: Palette },
            { name: 'My Orders', path: '/buyer/orders', icon: ShoppingCart },
            { name: 'Track Order', path: '/buyer/track', icon: Package },
            { name: 'Wishlist', path: '/buyer/wishlist', icon: ClipboardCheck },
            { name: 'Documents', path: '/buyer/documents', icon: FileText },
            { name: 'Support', path: '/buyer/support', icon: Users },
        ];
    } else if (user?.role === 'SELLER') {
        menuItems = [
            { name: 'Dashboard', path: '/seller', icon: LayoutDashboard },
            { name: 'Customizations', path: '/seller/customizations', icon: Palette },
            { name: 'Leads', path: '/seller/leads', icon: Users },
            { name: 'Products', path: '/seller/products', icon: Package },
            { name: 'Costing', path: '/seller/costing', icon: Calculator },
            { name: 'Orders', path: '/seller/orders', icon: ShoppingCart },
            { name: 'PI Generation', path: '/seller/pi', icon: FileText },
            { name: 'Production', path: '/seller/production', icon: ClipboardCheck },
        ];
    } else if (user?.role === 'DESIGNER') {
        menuItems = [
            { name: 'Dashboard', path: '/designer', icon: LayoutDashboard },
            { name: 'Products', path: '/designer/products', icon: Package },
            { name: 'Upload Design', path: '/designer/upload', icon: Plus },
            { name: 'Customizations', path: '/designer/customizations', icon: Palette },
            { name: 'Approvals', path: '/designer/approvals', icon: ClipboardCheck },
            { name: 'Tech Packs', path: '/designer/techpacks', icon: File },
            { name: 'ODM Links', path: '/designer/odm', icon: Palette },
        ];
    } else if (user?.role === 'ADMIN') {
        menuItems = [
            { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
            { name: 'User Mgmt', path: '/admin/users', icon: Users },
            { name: 'Products', path: '/admin/products', icon: Package },
            { name: 'Design Approvals', path: '/admin/design-approvals', icon: CheckCircle },
            { name: 'Ledger', path: '/admin/ledger', icon: Calculator },
            { name: 'Analytics', path: '/admin/analytics', icon: LayoutDashboard },
            { name: 'Settings', path: '/admin/settings', icon: Settings },
        ];
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex h-screen pt-20">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-md flex flex-col h-full">
                    <div className="p-6 border-b">
                        <h1 className="text-2xl font-bold text-gray-900">Prime CRM</h1>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{user?.role}</p>
                    </div>
                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg ${location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path) && item.path !== '/buyer' && item.path !== '/seller' && item.path !== '/designer' && item.path !== '/admin')
                                    ? 'bg-accent text-primary'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon size={20} className="mr-3" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                    <div className="p-4 border-t">
                        <button
                            onClick={onLogout}
                            className="flex items-center text-red-500 hover:bg-red-50 px-4 py-3 rounded-lg w-full"
                        >
                            <LogOut size={20} className="mr-3" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8 h-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
