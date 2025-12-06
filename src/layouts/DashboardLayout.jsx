import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../redux/slices/authSlice';
import {
    LayoutDashboard, Users, Calculator, FileText, ShoppingCart,
    Settings, LogOut, Package, ClipboardCheck, Palette, File, Plus, CheckCircle, Inbox, PenTool, MessageSquare, Menu
} from 'lucide-react';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    // Close sidebar on route change (mobile)
    useState(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // Define menu items based on role
    let menuItems = [];

    if (user?.role === 'BUYER') {
        menuItems = [
            { name: 'Dashboard', path: '/buyer', icon: LayoutDashboard },
            { name: 'My Inquiries', path: '/buyer/inquiries', icon: MessageSquare },
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
            { name: 'Sample Requests', path: '/seller/sample-requests', icon: Package },
            { name: 'ODM Leads', path: '/seller/odm-leads', icon: Inbox },
            { name: 'OEM Leads', path: '/seller/customizations', icon: PenTool },
            { name: 'Products', path: '/seller/products', icon: Package },
            { name: 'Costing', path: '/seller/costing', icon: Calculator },
            { name: 'Orders', path: '/seller/orders', icon: ShoppingCart },
            { name: 'Documents', path: '/seller/documents', icon: FileText },
            { name: 'Production', path: '/seller/production', icon: ClipboardCheck },
        ];
    } else if (user?.role === 'DESIGNER') {
        menuItems = [
            { name: 'Dashboard', path: '/designer', icon: LayoutDashboard },
            { name: 'Products', path: '/designer/products', icon: Package },
            { name: 'Upload Design', path: '/designer/upload', icon: Plus },
            { name: 'Customizations', path: '/designer/customizations', icon: Palette },
            { name: 'Tech Packs', path: '/designer/techpacks', icon: File },
            { name: 'Approvals', path: '/designer/approvals', icon: ClipboardCheck },
            { name: 'ODM Links', path: '/designer/odm', icon: Palette },
        ];
    } else if (user?.role === 'ADMIN') {
        menuItems = [
            { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
            { name: 'User Mgmt', path: '/admin/users', icon: Users },
            { name: 'Products', path: '/admin/products', icon: Package },
            { name: 'Design Approvals', path: '/admin/design-approvals', icon: CheckCircle },
            { name: 'Documents', path: '/admin/documents', icon: FileText },
            { name: 'Ledger', path: '/admin/ledger', icon: Calculator },
            { name: 'Analytics', path: '/admin/analytics', icon: LayoutDashboard },
            { name: 'Settings', path: '/admin/settings', icon: Settings },
        ];
    }

    return (
        <div className="h-screen w-full overflow-hidden bg-slate-50 flex flex-col">
            <Navbar />

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex flex-1 pt-20 h-full overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`
                        fixed md:static inset-y-0 left-0 z-40
                        w-64 bg-white shadow-xl md:shadow-none border-r border-slate-200
                        transform transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                        flex flex-col h-full mt-20 md:mt-0
                    `}
                >
                    <div className="p-6 border-b border-slate-100 bg-white">
                        <div className="flex items-center justify-between md:hidden mb-4">
                            <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Menu</span>
                            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <LogOut className="rotate-180" size={20} />
                            </button>
                        </div>
                        <h1 className="text-xl font-bold text-slate-800 font-heading">Prime CRM</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{user?.role} Portal</p>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path ||
                                (item.path !== '/' && location.pathname.startsWith(item.path) &&
                                    !['/buyer', '/seller', '/designer', '/admin'].includes(item.path));

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`
                                        flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                                        ${isActive
                                            ? 'bg-primary/5 text-primary shadow-sm ring-1 ring-primary/10'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }
                                    `}
                                >
                                    <item.icon
                                        size={20}
                                        className={`mr-3 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`}
                                    />
                                    <span className="font-medium text-sm">{item.name}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                        <button
                            onClick={onLogout}
                            className="flex items-center text-red-600 hover:bg-red-50 hover:text-red-700 px-4 py-3 rounded-xl w-full transition-all duration-200 group border border-transparent hover:border-red-100"
                        >
                            <LogOut size={20} className="mr-3 transition-transform group-hover:-translate-x-1" />
                            <span className="font-medium text-sm">Sign Out</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50 h-full relative">
                    {/* Mobile Header */}
                    <div className="md:hidden sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <Menu size={24} />
                            </button>
                            <span className="font-semibold text-slate-800">
                                {menuItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
                            </span>
                        </div>
                    </div>

                    <div className="p-4 md:p-8 max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
