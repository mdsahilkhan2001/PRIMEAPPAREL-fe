import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Loader2, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResetToken('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setResetToken(response.data.resetToken);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-10">
                <div className="text-center">
                    <div className="flex justify-center">
                        <ShoppingBag className="h-12 w-12 text-accent" />
                    </div>
                    <h2 className="mt-8 text-3xl md:text-4xl font-extrabold text-gray-900">
                        Forgot Password
                    </h2>
                    <p className="mt-4 text-sm text-gray-600">
                        Enter your email address and we'll generate a reset token for you.
                    </p>
                </div>

                {!resetToken ? (
                    <form className="mt-10 space-y-6" onSubmit={onSubmit}>
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent sm:text-sm transition-all"
                                placeholder="Email address"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-lg text-primary bg-accent hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 transition-all shadow-lg"
                            >
                                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Get Reset Token'}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link to="/login" className="font-medium text-accent hover:text-accent-dark flex items-center justify-center gap-2">
                                <ArrowLeft size={16} />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="mt-10 space-y-6">
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                            <p className="font-bold mb-2">Reset Token Generated!</p>
                            <p className="text-sm mb-4">Copy this token to reset your password:</p>
                            <div className="bg-white p-3 rounded border border-green-300">
                                <code className="text-sm break-all">{resetToken}</code>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link
                                to={`/reset-password/${resetToken}`}
                                className="block w-full text-center py-3 px-4 border border-transparent text-base font-bold rounded-lg text-primary bg-accent hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all shadow-lg"
                            >
                                Continue to Reset Password
                            </Link>

                            <Link
                                to="/login"
                                className="block w-full text-center py-3 px-4 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
