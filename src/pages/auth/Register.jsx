import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../../redux/slices/authSlice';
import { ShoppingBag, Loader2, User, Mail, Lock, Phone, Building, ArrowRight, AlertCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        company: '',
    });

    const { name, email, password, phone, company } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isError) {
            console.error(message);
        }

        if (isSuccess || user) {
            navigate('/buyer');
        }

        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const userData = {
            name,
            email,
            password,
            phone,
            company,
            role: 'BUYER'
        };
        dispatch(register(userData));
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image Section */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/service-img/ser2.jpg"
                        alt="Register Background"
                        className="w-full h-full object-cover opacity-60"
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
                            Join Our Global <br />
                            <span className="text-accent">Trading Network</span>
                        </h1>
                        <p className="text-xl text-slate-200 max-w-md leading-relaxed">
                            Create your buyer account today to access wholesale pricing, track orders, and connect with verified manufacturers.
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-6">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                <h3 className="font-bold text-accent text-lg">500+</h3>
                                <p className="text-sm text-slate-300">Verified Suppliers</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                <h3 className="font-bold text-accent text-lg">Global</h3>
                                <p className="text-sm text-slate-300">Shipping Network</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 text-sm text-slate-300">
                        <span>© 2025 Prime Apparel</span>
                        <span>•</span>
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-slate-50 overflow-y-auto">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <ShoppingBag className="h-10 w-10 text-accent" />
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-primary">Create Account</h2>
                        <p className="mt-2 text-slate-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-accent hover:text-accent-dark transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-5" onSubmit={onSubmit}>
                        <div className="space-y-5">
                            {/* Name */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                    placeholder="Full Name"
                                />
                            </div>

                            {/* Email */}
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
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                    placeholder="Email address"
                                />
                            </div>

                            {/* Company */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Building className="h-5 w-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="company"
                                    value={company}
                                    onChange={onChange}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                    placeholder="Company Name (Optional)"
                                />
                            </div>

                            {/* Phone */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={phone}
                                    onChange={onChange}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                    placeholder="Phone Number (Optional)"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        {isError && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-lg shadow-sm animate-shake flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm">Registration Failed</p>
                                    <p className="text-sm mt-1">{message}</p>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-primary bg-accent hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>

                        <p className="text-xs text-center text-slate-500 mt-4">
                            By registering, you agree to our{' '}
                            <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link>
                            {' '}and{' '}
                            <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
