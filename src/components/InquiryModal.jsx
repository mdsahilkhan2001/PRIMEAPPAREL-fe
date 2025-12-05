import React, { useState, useRef } from 'react';
import { X, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { useCreateLeadMutation } from '../redux/slices/apiSlice';
import { getImageUrl } from '../config';

const InquiryModal = ({ product, onClose, user }) => {
    const [createLead, { isLoading: loading }] = useCreateLeadMutation();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        countryCode: '+1',
        country: '',
        productType: product?.name || 'Kaftans',
        quantity: product?.moq || '',
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
                leadType: 'ODM' // Product inquiry from catalog
            }).unwrap();
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError('Failed to send inquiry. Please try again.');
        }
    };

    if (!product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in fade-in zoom-in flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Send Inquiry</h3>
                        <p className="text-xs text-gray-500 mt-1">Connect directly with the seller</p>
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
                            <h4 className="text-2xl font-bold text-gray-900 mb-2">Inquiry Sent!</h4>
                            <p className="text-gray-500 max-w-xs mx-auto">We have received your inquiry and will get back to you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Product Summary */}
                            <div className="flex items-start gap-4 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
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
                                        <span className="text-xs font-medium px-2 py-0.5 bg-white text-orange-600 rounded border border-orange-200">
                                            MOQ: {product.moq}
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
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm"
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
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm"
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
                                        className="w-32 px-2 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm font-medium"
                                    >
                                        {/* Popular Countries First */}
                                        <option value="+91">🇮🇳 India +91</option>
                                        <option value="+971">🇦🇪 UAE +971</option>
                                        <option value="+44">🇬🇧 UK +44</option>
                                        <option value="+1">🇺🇸 USA +1</option>
                                        <option value="+61">🇦🇺 Australia +61</option>
                                        <option value="+7">🇷🇺 Russia +7</option>

                                        {/* Middle East */}
                                        <option value="+966">🇸🇦 Saudi Arabia +966</option>
                                        <option value="+974">🇶🇦 Qatar +974</option>
                                        <option value="+968">🇴🇲 Oman +968</option>
                                        <option value="+965">🇰🇼 Kuwait +965</option>
                                        <option value="+973">🇧🇭 Bahrain +973</option>
                                        <option value="+962">🇯🇴 Jordan +962</option>
                                        <option value="+961">🇱🇧 Lebanon +961</option>
                                        <option value="+90">🇹🇷 Turkey +90</option>

                                        {/* Europe */}
                                        <option value="+33">🇫🇷 France +33</option>
                                        <option value="+49">🇩🇪 Germany +49</option>
                                        <option value="+39">🇮🇹 Italy +39</option>
                                        <option value="+34">🇪🇸 Spain +34</option>
                                        <option value="+31">🇳🇱 Netherlands +31</option>
                                        <option value="+41">🇨🇭 Switzerland +41</option>
                                        <option value="+43">🇦🇹 Austria +43</option>
                                        <option value="+32">🇧🇪 Belgium +32</option>

                                        {/* Asia Pacific */}
                                        <option value="+86">🇨🇳 China +86</option>
                                        <option value="+81">🇯🇵 Japan +81</option>
                                        <option value="+82">🇰🇷 South Korea +82</option>
                                        <option value="+65">🇸🇬 Singapore +65</option>
                                        <option value="+60">🇲🇾 Malaysia +60</option>
                                        <option value="+66">🇹🇭 Thailand +66</option>
                                        <option value="+84">🇻🇳 Vietnam +84</option>
                                        <option value="+63">🇵🇭 Philippines +63</option>
                                        <option value="+62">🇮🇩 Indonesia +62</option>

                                        {/* South Asia */}
                                        <option value="+92">🇵🇰 Pakistan +92</option>
                                        <option value="+880">🇧🇩 Bangladesh +880</option>
                                        <option value="+94">🇱🇰 Sri Lanka +94</option>
                                        <option value="+977">🇳🇵 Nepal +977</option>

                                        {/* Africa */}
                                        <option value="+27">🇿🇦 South Africa +27</option>
                                        <option value="+20">🇪🇬 Egypt +20</option>
                                        <option value="+234">🇳🇬 Nigeria +234</option>
                                        <option value="+254">🇰🇪 Kenya +254</option>

                                        {/* Americas */}
                                        <option value="+1">🇨🇦 Canada +1</option>
                                        <option value="+52">🇲🇽 Mexico +52</option>
                                        <option value="+55">🇧🇷 Brazil +55</option>
                                        <option value="+54">🇦🇷 Argentina +54</option>
                                    </select>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="1234567890"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm"
                                        pattern="[0-9]{6,15}"
                                        title="Please enter a valid phone number (6-15 digits)"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Select your country code and enter phone number</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Country *</label>
                                    <input
                                        type="text"
                                        name="country"
                                        placeholder="USA, UK, etc."
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Product Interest</label>
                                    <input
                                        type="text"
                                        name="productType"
                                        value={formData.productType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed text-sm"
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Quantity (Optional)</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    placeholder="e.g. 100"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm"
                                />
                            </div>

                            {/* Reference Images */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Reference Images (Optional)</label>
                                <div
                                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                                </div>

                                {/* Image Previews */}
                                {formData.referenceImages.length > 0 && (
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        {formData.referenceImages.map((img, index) => (
                                            <div key={index} className="relative w-20 h-20 border border-gray-200 rounded-lg overflow-hidden group shadow-sm">
                                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-white/90 text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Additional Details</label>
                                <textarea
                                    name="message"
                                    rows="4"
                                    placeholder="Tell us more about your brand and requirements..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm resize-none"
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
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3.5 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Inquiry'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InquiryModal;
