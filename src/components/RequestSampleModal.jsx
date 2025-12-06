import React, { useState, useRef } from 'react';
import { X, Loader2, Upload } from 'lucide-react';
import { useCreateLeadMutation } from '../redux/slices/apiSlice';
import { getImageUrl } from '../config';

const RequestSampleModal = ({ product, onClose, user }) => {
    const [createLead, { isLoading: loading }] = useCreateLeadMutation();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        countryCode: '+1',
        country: '',
        productType: product?.name || '',
        quantity: '1', // Default to 1 for sample
        message: '',
        referenceImages: []
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Process files to Base64
            const filePromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            });

            Promise.all(filePromises)
                .then(base64Images => {
                    setFormData(prev => ({
                        ...prev,
                        referenceImages: [...prev.referenceImages, ...base64Images]
                    }));
                })
                .catch(err => console.error("Error reading files:", err));
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            referenceImages: prev.referenceImages.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await createLead({
                ...formData,
                leadType: 'SAMPLE_REQUEST' // Specific type for Sample Requests
            }).unwrap();
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError('Failed to submit sample request. Please try again.');
        }
    };

    if (!product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in fade-in zoom-in flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Request Sample</h3>
                        <p className="text-xs text-gray-500 mt-1">Get a sample before bulk order</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {success ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h4>
                            <p className="text-gray-500 max-w-xs mx-auto">We have received your sample request and will get back to you shortly regarding shipping details.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Product Summary */}
                            <div className="flex items-start gap-4 bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                                <img
                                    src={getImageUrl(product.images[0])}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder.svg';
                                    }}
                                />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</h4>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        {product.sku && (
                                            <span className="text-xs font-bold px-2 py-0.5 bg-black text-white rounded">
                                                Item Code: {product.sku}
                                            </span>
                                        )}
                                        <span className="text-xs font-medium px-2 py-0.5 bg-white text-teal-600 rounded border border-teal-200">
                                            Sample Qty: 1
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="you@company.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* Phone Number with Country Code */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Phone Number *</label>
                                <div className="flex gap-2">
                                    <select
                                        name="countryCode"
                                        value={formData.countryCode}
                                        onChange={handleChange}
                                        className="w-32 px-2 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all text-sm font-medium"
                                    >
                                        <option value="+91">🇮🇳 India +91</option>
                                        <option value="+971">🇦🇪 UAE +971</option>
                                        <option value="+44">🇬🇧 UK +44</option>
                                        <option value="+1">🇺🇸 USA +1</option>
                                        <option value="+61">🇦🇺 Australia +61</option>
                                        {/* Add more as needed, keeping it brief for sample */}
                                    </select>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="1234567890"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all text-sm"
                                        pattern="[0-9]{6,15}"
                                        title="Please enter a valid phone number (6-15 digits)"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Shipping Country *</label>
                                    <input
                                        type="text"
                                        name="country"
                                        placeholder="Shipping Destination"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">No. of Samples</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        min="1"
                                        max="5"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Shipping Address & Notes</label>
                                <textarea
                                    name="message"
                                    rows="4"
                                    placeholder="Please provide full shipping address or specific requirements for the sample..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all text-sm resize-none"
                                ></textarea>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold py-3.5 rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Request'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestSampleModal;
