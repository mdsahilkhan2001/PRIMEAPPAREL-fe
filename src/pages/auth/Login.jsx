import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login, reset } from '../../redux/slices/authSlice';
import { ShoppingBag, Loader2, AlertCircle, CheckCircle2, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { email, password } = formData;

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            console.error(message);
        }

        if (isSuccess || user) {
            setShowSuccess(true);
            setTimeout(() => {
                const fromLocation = location.state?.from;
                const targetPath = fromLocation?.pathname || fromLocation;

                const isPathAllowed = (path, role) => {
                    if (!path) return false;
                    if (typeof path !== 'string') return false;
                    if (path.startsWith('/buyer') && role !== 'BUYER') return false;
                    if (path.startsWith('/seller') && role !== 'SELLER') return false;
                    if (path.startsWith('/designer') && role !== 'DESIGNER') return false;
                    if (path.startsWith('/admin') && role !== 'ADMIN') return false;
                    return true;
                };

                if (targetPath && isPathAllowed(targetPath, user.role)) {
                    navigate(targetPath);
                } else {
                    if (user.role === 'ADMIN') navigate('/admin');
                    else if (user.role === 'SELLER') navigate('/seller');
                    else if (user.role === 'DESIGNER') navigate('/designer');
                    else navigate('/buyer');
                }
            }, 1000);
        }
    }, [user, isSuccess, navigate, location.state]);

    // Clear state on unmount
    useEffect(() => {
        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const userData = {
            email,
            password,
        };
        dispatch(login(userData));
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image Section */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/service-img/ser1.jpg"
                        alt="Login Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/50 mix-blend-multiply" />
                </div>

                <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">
                    <div>
                        <Link to="/" className="flex items-center gap-2 text-white hover:text-accent transition-colors w-fit">
                            <ShoppingBag className="h-8 w-8" />
                            <span className="font-heading font-bold text-2xl">Prime Apparel</span>
                        </Link>
                    </div>

                    <div className="mb-12">
                        <h1 className="text-5xl font-heading font-bold mb-6 leading-tight">
                            Welcome Back to <br />
                            <span className="text-accent">Global Fashion</span>
                        </h1>
                        <p className="text-xl text-slate-200 max-w-md leading-relaxed">
                            Access your dashboard, manage orders, and connect with top-tier manufacturers worldwide.
                        </p>
                    </div>

                    <div className="flex gap-4 text-sm text-slate-300">
                        <span>© 2025 Prime Apparel</span>
                        <span>•</span>
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <span>•</span>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-2 sm:p-12 lg:p-16 bg-slate-50">
                <div className="max-w-md w-full space-y-8 bg-white p-4 sm:p-8 rounded-3xl shadow-xl border border-slate-100">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <ShoppingBag className="h-10 w-10 text-accent" />
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-primary">Sign In</h2>
                        <p className="mt-2 text-slate-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-accent hover:text-accent-dark transition-colors">
                                Create account
                            </Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                        <div className="space-y-5">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    required
                                    className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all ${isError && message === 'User not found' ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                                    placeholder="Email address"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                    className={`block w-full pl-11 pr-12 py-3.5 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all ${isError && message === 'Password is wrong' ? 'border-red-500 focus:border-red-500' : 'border-slate-200'}`}
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-accent transition-colors focus:outline-none cursor-pointer"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-accent hover:text-accent-dark transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {/* Error Message */}
                        {isError && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-lg shadow-sm animate-shake flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Login Failed</p>
                                    <p className="text-sm mt-1">{message || 'Invalid email or password.'}</p>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {showSuccess && (
                            <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded-lg shadow-sm flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Success!</p>
                                    <p className="text-sm mt-1">Redirecting...</p>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || showSuccess}
                            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-primary bg-accent hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    Signing in...
                                </>
                            ) : showSuccess ? (
                                <>
                                    <CheckCircle2 className="-ml-1 mr-2 h-5 w-5" />
                                    Success!
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">
                                    Protected by enterprise security
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
