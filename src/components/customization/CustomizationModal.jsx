import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Check, ChevronRight, ChevronLeft, Calendar, DollarSign, Info } from 'lucide-react';
import axios from '../../api';
import { getImageUrl } from '../../config';

const CustomizationModal = ({ product, isOpen, onClose }) => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        designType: 'Custom Print',
        description: '',
        quantity: product?.moq || 1,
        colors: [],
        sizes: [],
        quality: 'Standard',
        budgetMin: '',
        budgetMax: '',
        deadline: '',
        additionalNotes: ''
    });

    const [referenceImages, setReferenceImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [customDesignType, setCustomDesignType] = useState('');

    if (!isOpen || !product) return null;

    const designTypes = [
        'Custom Print',
        'Embroidery',
        'Pattern Change',
        'Color Customization',
        'Size Adjustment',
        'Material Change',
        'Complete Custom Design',
        'Sample Before Bulk',
        'Other'
    ];

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + referenceImages.length > 5) {
            alert('Maximum 5 images allowed');
            return;
        }

        setReferenceImages([...referenceImages, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = [...referenceImages];
        newImages.splice(index, 1);
        setReferenceImages(newImages);

        const newPreviews = [...imagePreviews];
        URL.revokeObjectURL(newPreviews[index]); // Cleanup
        newPreviews.splice(index, 1);
        setImagePreviews(newPreviews);
    };

    const handleColorAdd = (e) => {
        if (e.key === 'Enter' && e.target.value) {
            e.preventDefault();
            if (!formData.colors.some(c => c.name === e.target.value)) {
                setFormData({
                    ...formData,
                    colors: [...formData.colors, { name: e.target.value, hex: '#000000' }] // Default hex
                });
            }
            e.target.value = '';
        }
    };

    const removeColor = (index) => {
        const newColors = [...formData.colors];
        newColors.splice(index, 1);
        setFormData({ ...formData, colors: newColors });
    };

    const handleSizeToggle = (size) => {
        const newSizes = formData.sizes.includes(size)
            ? formData.sizes.filter(s => s !== size)
            : [...formData.sizes, size];
        setFormData({ ...formData, sizes: newSizes });
    };

    const handleSubmit = async () => {
        if (!user) {
            alert('Please login to submit a customization request');
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const submitData = new FormData();
            // ... (rest of append logic)
            submitData.append('productId', product._id);
            submitData.append('designType', formData.designType === 'Other' ? customDesignType : formData.designType);
            submitData.append('description', formData.description);
            submitData.append('quantity', formData.quantity);
            submitData.append('colors', JSON.stringify(formData.colors));
            submitData.append('sizes', JSON.stringify(formData.sizes));
            submitData.append('quality', formData.quality);
            submitData.append('budget', JSON.stringify({ min: formData.budgetMin, max: formData.budgetMax }));
            submitData.append('deadline', formData.deadline);
            submitData.append('additionalNotes', formData.additionalNotes);

            referenceImages.forEach(file => {
                submitData.append('referenceImages', file);
            });

            // Let axios set the Content-Type automatically for FormData
            await axios.post('/customizations', submitData);

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setStep(1);
                setFormData({
                    designType: 'Custom Print',
                    description: '',
                    quantity: product?.moq || 1,
                    colors: [],
                    sizes: [],
                    quality: 'Standard',
                    budgetMin: '',
                    budgetMax: '',
                    deadline: '',
                    additionalNotes: ''
                });
                setReferenceImages([]);
                setImagePreviews([]);
            }, 2000);

        } catch (err) {
            console.error('Customization request error:', err);
            setError(err.response?.data?.message || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Customization</label>
                <select
                    value={formData.designType}
                    onChange={(e) => setFormData({ ...formData, designType: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                    {designTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                {formData.designType === 'Other' && (
                    <input
                        type="text"
                        placeholder="Specify customization type"
                        value={customDesignType}
                        onChange={(e) => setCustomDesignType(e.target.value)}
                        className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
                    />
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Describe your requirements in detail..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference Images (Max 5)</label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                            <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    {imagePreviews.length < 5 && (
                        <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-gray-50 transition-colors">
                            <Upload className="text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500">Upload</span>
                            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                        </label>
                    )}
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Required</label>
                <input
                    type="number"
                    min={product.moq || 1}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum Order Quantity: {product.moq || 1}</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Colors</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {formData.colors.map((color, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                            {color.name}
                            <button onClick={() => removeColor(index)} className="ml-2 text-gray-500 hover:text-red-500">
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Type color name and press Enter"
                    onKeyDown={handleColorAdd}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sizes Needed</label>
                <div className="flex flex-wrap gap-3">
                    {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Custom'].map(size => (
                        <label key={size} className={`cursor-pointer px-4 py-2 rounded-lg border ${formData.sizes.includes(size) ? 'bg-accent text-white border-accent' : 'bg-white text-gray-700 border-gray-300 hover:border-accent'}`}>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={formData.sizes.includes(size)}
                                onChange={() => handleSizeToggle(size)}
                            />
                            {size}
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality Level</label>
                <div className="grid grid-cols-3 gap-4">
                    {['Standard', 'Premium', 'Luxury'].map(level => (
                        <label key={level} className={`cursor-pointer p-4 rounded-lg border text-center ${formData.quality === level ? 'bg-accent/10 border-accent text-accent' : 'bg-white border-gray-300 hover:border-accent'}`}>
                            <input
                                type="radio"
                                name="quality"
                                className="hidden"
                                value={level}
                                checked={formData.quality === level}
                                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                            />
                            <span className="font-medium">{level}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Budget (Per Unit)</label>
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="number"
                            placeholder="Min"
                            value={formData.budgetMin}
                            onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>
                    <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="number"
                            placeholder="Max"
                            value={formData.budgetMax}
                            onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery Date</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Any other specific requirements..."
                />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex gap-3">
                <Info className="text-blue-500 flex-shrink-0" size={20} />
                <p className="text-sm text-blue-700">
                    Submitting this request does not commit you to a purchase. The seller will review your requirements and provide a quote.
                </p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Customize Product</h2>
                        <p className="text-sm text-gray-500 mt-1">Step {step} of 3: {step === 1 ? 'Design' : step === 2 ? 'Specs' : 'Budget'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-100 w-full">
                    <div
                        className="h-full bg-accent transition-all duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {success ? (
                        <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <Check className="text-green-600" size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
                            <p className="text-gray-500">The seller has been notified and will respond shortly.</p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Product Summary */}
                            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <img
                                    src={getImageUrl(product.images[0])}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                                <div>
                                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                                    <p className="text-sm text-gray-500">MOQ: {product.moq} units</p>
                                </div>
                            </div>

                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && renderStep3()}
                        </>
                    )}
                </div>

                {/* Footer */}
                {!success && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                                <ChevronLeft size={18} /> Back
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-lg shadow-accent/20"
                            >
                                Next Step <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomizationModal;
