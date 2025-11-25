import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <ShieldAlert className="h-20 w-20 text-red-500 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
                You do not have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>
            <Link
                to="/"
                className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800"
            >
                Return to Home
            </Link>
        </div>
    );
};

export default Unauthorized;
