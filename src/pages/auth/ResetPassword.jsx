import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ShoppingBag, Loader2 } from 'lucide-react';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { password, confirmPassword } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            await axios.put(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
            alert('Password reset successful! You can now login with your new password.');
            navigate('/login');
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
                        Reset Password
                    </h2>
                    <p className="mt-4 text-sm text-gray-600">
                        Enter your new password below.
                    </p>
                </div>

                <form className="mt-10 space-y-6" onSubmit={onSubmit}>
                    <div className="space-y-4">
                        <div>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent sm:text-sm transition-all"
                                placeholder="New Password"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={onChange}
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent sm:text-sm transition-all"
                                placeholder="Confirm New Password"
                            />
                        </div>
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
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Reset Password'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link to="/login" className="font-medium text-accent hover:text-accent-dark">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
