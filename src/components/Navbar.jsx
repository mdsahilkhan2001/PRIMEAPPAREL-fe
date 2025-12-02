import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, ShoppingBag, User, LogOut, LogIn, ChevronDown, ChevronRight } from 'lucide-react';
import { CATEGORY_HIERARCHY } from '../constants/categories';
import { logout, reset } from '../redux/slices/authSlice';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    // Handle scroll effect
    useState(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    const getDashboardPath = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'ADMIN': return '/admin';
            case 'SELLER': return '/seller';
            case 'DESIGNER': return '/designer';
            default: return '/buyer';
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        // Products link replaced by Category Dropdown
        { name: 'Services', path: '/services' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-white py-4'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center group">
                        <div className="bg-primary/5 p-2 rounded-lg mr-3 group-hover:bg-primary/10 transition-colors">
                            <ShoppingBag className="h-6 w-6 text-accent" />
                        </div>
                        <span className="text-2xl font-heading font-bold text-primary tracking-tight">
                            PRIME<span className="text-accent">APPAREL</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <Link to="/" className={`text-sm font-medium transition-colors duration-200 ${isActive('/') ? 'text-accent font-semibold' : 'text-slate-600 hover:text-primary'}`}>Home</Link>
                        <Link to="/about" className={`text-sm font-medium transition-colors duration-200 ${isActive('/about') ? 'text-accent font-semibold' : 'text-slate-600 hover:text-primary'}`}>About Us</Link>

                        {/* Category Dropdown */}
                        <div className="relative group">
                            <button
                                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${isActive('/products') ? 'text-accent font-semibold' : 'text-slate-600 hover:text-primary'}`}
                            >
                                Category <ChevronDown size={14} />
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-slate-100">
                                {Object.keys(CATEGORY_HIERARCHY).map((category) => (
                                    <div key={category} className="relative group/sub">
                                        <Link
                                            to={`/products?cat=${category}`}
                                            className="flex items-center justify-between px-4 py-2 text-sm text-slate-600 hover:text-accent hover:bg-slate-50"
                                        >
                                            {category}
                                            <ChevronRight size={14} className="text-slate-400" />
                                        </Link>

                                        {/* Sub Menu */}
                                        <div className="absolute left-full top-0 w-48 bg-white shadow-xl rounded-lg py-2 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300 transform translate-x-2 group-hover/sub:translate-x-0 border border-slate-100">
                                            {CATEGORY_HIERARCHY[category].map((sub) => (
                                                <Link
                                                    key={sub}
                                                    to={`/products?cat=${category}&subCategory=${sub}`}
                                                    className="block px-4 py-2 text-sm text-slate-600 hover:text-accent hover:bg-slate-50"
                                                >
                                                    {sub}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link to="/services" className={`text-sm font-medium transition-colors duration-200 ${isActive('/services') ? 'text-accent font-semibold' : 'text-slate-600 hover:text-primary'}`}>Services</Link>
                        <Link to="/contact" className={`text-sm font-medium transition-colors duration-200 ${isActive('/contact') ? 'text-accent font-semibold' : 'text-slate-600 hover:text-primary'}`}>Contact</Link>

                        <div className="h-6 w-px bg-slate-200 mx-2"></div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to={getDashboardPath()}
                                    className="flex items-center gap-2 text-slate-700 font-medium hover:text-primary group"
                                    title="Go to Dashboard"
                                >
                                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 group-hover:border-accent/30 transition-colors">
                                        <User className="w-5 h-5 text-slate-600 group-hover:text-accent transition-colors" />
                                    </div>
                                    <span className="hidden lg:block text-sm">{user.name}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="text-slate-600 hover:text-primary font-medium text-sm flex items-center gap-1 px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn btn-accent text-sm py-2 px-5 rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/30 transform hover:-translate-y-0.5 transition-all"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-md transition-colors focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-600 hover:text-primary hover:bg-slate-50">Home</Link>
                        <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-600 hover:text-primary hover:bg-slate-50">About Us</Link>

                        {/* Mobile Category Menu */}
                        <div className="px-3 py-2">
                            <div className="font-medium text-slate-900 mb-2">Categories</div>
                            <div className="pl-2 space-y-1 border-l-2 border-slate-100">
                                {Object.keys(CATEGORY_HIERARCHY).map((category) => (
                                    <div key={category}>
                                        <button
                                            onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                                            className="flex items-center justify-between w-full py-2 text-sm text-slate-600"
                                        >
                                            {category}
                                            <ChevronDown size={14} className={`transform transition-transform ${activeCategory === category ? 'rotate-180' : ''}`} />
                                        </button>
                                        {activeCategory === category && (
                                            <div className="pl-4 pb-2 space-y-2 bg-slate-50 rounded-md mt-1">
                                                <Link
                                                    to={`/products?cat=${category}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="block text-xs font-bold text-accent py-1"
                                                >
                                                    View All {category}
                                                </Link>
                                                {CATEGORY_HIERARCHY[category].map((sub) => (
                                                    <Link
                                                        key={sub}
                                                        to={`/products?cat=${category}&subCategory=${sub}`}
                                                        onClick={() => setIsOpen(false)}
                                                        className="block text-xs text-slate-500 hover:text-accent py-1"
                                                    >
                                                        {sub}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link to="/services" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-600 hover:text-primary hover:bg-slate-50">Services</Link>
                        <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-600 hover:text-primary hover:bg-slate-50">Contact</Link>

                        <div className="border-t border-slate-100 my-4 pt-4">
                            {user ? (
                                <>
                                    <Link
                                        to={getDashboardPath()}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center px-3 mb-3 hover:bg-slate-50 py-2 rounded-lg"
                                    >
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mr-3">
                                            <User className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <span className="font-medium text-slate-900">{user.name}</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="flex w-full items-center px-3 py-2 text-base font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <LogOut className="w-5 h-5 mr-3" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-3 px-3">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full text-center border border-slate-200 text-slate-700 px-5 py-3 rounded-lg text-base font-medium hover:bg-slate-50 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full text-center bg-accent text-white px-5 py-3 rounded-lg text-base font-medium hover:bg-accent-hover shadow-md transition-colors"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
