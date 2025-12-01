import { useState, useEffect } from 'react';
import { X, Upload, Plus, Minus, Check } from 'lucide-react';
import API from '../api';

const AddProductModal = ({ isOpen, onClose, product }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        subCategory: '',
        images: [],
        priceTiers: [{ minQty: 100, maxQty: 500, price: 0 }],
        colors: [{ name: '', hex: '#000000', image: '' }],
        sizes: [],
        moq: 100,
        leadTime: '',
        customization: [],
        specifications: {
            material: '',
            fabricType: '',
            technics: '',
            feature: '',
            origin: 'India'
        },
        status: 'ACTIVE'
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                category: product.category || '',
                subCategory: product.subCategory || '',
                images: product.images || [],
                video: product.video || null,
                priceTiers: product.priceTiers?.map(tier => ({
                    minQty: tier.minQty ?? 0,
                    maxQty: tier.maxQty ?? null,
                    price: tier.price ?? 0
                })) || [{ minQty: 100, maxQty: 500, price: 0 }],
                colors: product.colors?.map(color => ({
                    name: color.name || '',
                    hex: color.hex || '#000000',
                    image: color.image || ''
                })) || [{ name: '', hex: '#000000', image: '' }],
                sizes: product.sizes || [],
                moq: product.moq || 100,
                leadTime: product.leadTime || '',
                customization: product.customization || [],
                specifications: {
                    material: product.specifications?.material || '',
                    fabricType: product.specifications?.fabricType || '',
                    technics: product.specifications?.technics || '',
                    feature: product.specifications?.feature || '',
                    origin: product.specifications?.origin || 'India'
                },
                status: product.status || 'ACTIVE'
            });
            setImagePreviews(product.images?.map(img => `http://localhost:5000${encodeURI(img)}`) || []);
            setVideoPreview(product.video ? `http://localhost:5000${encodeURI(product.video)}` : null);
        }
    }, [product]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSpecChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            specifications: { ...prev.specifications, [field]: value }
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        console.log('Files selected:', files.length);

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        const validFiles = files.filter(file => {
            if (!allowedTypes.includes(file.type)) {
                alert(`File ${file.name} is not supported. Please use JPG, PNG, or WEBP.`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        setImageFiles(prev => [...prev, ...validFiles]);

        // Create previews
        validFiles.forEach((file, index) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                setImagePreviews(prev => [...prev, event.target.result]);
            };

            reader.readAsDataURL(file);
        });
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            alert('Please upload a valid video file');
            return;
        }

        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            alert('Video file size should be less than 50MB');
            return;
        }

        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
    };

    const removeImage = (index) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeVideo = () => {
        setVideoFile(null);
        setVideoPreview(null);
        setFormData(prev => ({ ...prev, video: null }));
    };

    const addPriceTier = () => {
        setFormData(prev => ({
            ...prev,
            priceTiers: [...prev.priceTiers, { minQty: 0, maxQty: null, price: 0 }]
        }));
    };

    const removePriceTier = (index) => {
        setFormData(prev => ({
            ...prev,
            priceTiers: prev.priceTiers.filter((_, i) => i !== index)
        }));
    };

    const updatePriceTier = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            priceTiers: prev.priceTiers.map((tier, i) =>
                i === index ? { ...tier, [field]: value === '' ? null : Number(value) } : tier
            )
        }));
    };

    const addColor = () => {
        setFormData(prev => ({
            ...prev,
            colors: [...prev.colors, { name: '', hex: '#000000', image: '' }]
        }));
    };

    const removeColor = (index) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index)
        }));
    };

    const updateColor = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.map((color, i) =>
                i === index ? { ...color, [field]: value } : color
            )
        }));
    };

    const toggleSize = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const addCustomization = () => {
        const option = prompt('Enter customization option:');
        if (option) {
            setFormData(prev => ({
                ...prev,
                customization: [...prev.customization, option]
            }));
        }
    };

    const removeCustomization = (index) => {
        setFormData(prev => ({
            ...prev,
            customization: prev.customization.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();

            // Add images
            imageFiles.forEach(file => {
                submitData.append('images', file);
            });

            // Add video
            if (videoFile) {
                submitData.append('video', videoFile);
            } else if (product && product.video && !videoPreview) {
                // Video was removed
                submitData.append('video', 'null');
            }

            // Add other data as JSON string for complex objects
            Object.keys(formData).forEach(key => {
                if (key !== 'images' && key !== 'video') {
                    if (typeof formData[key] === 'object') {
                        submitData.append(key, JSON.stringify(formData[key]));
                    } else {
                        submitData.append(key, formData[key]);
                    }
                }
            });

            // If editing and no new images, keep existing ones
            if (product && imageFiles.length === 0) {
                submitData.append('images', JSON.stringify(product.images));
            }

            if (product) {
                await API.put(`/products/${product._id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Product updated successfully!');
            } else {
                await API.post('/products', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('Product created successfully!');
            }

            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
            alert(error.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    if (!isOpen) return null;

    const categories = ['Kaftans', 'Co-ords', 'Resort Wear', 'Loungewear'];
    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {product ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Step {step} of 4</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4 bg-gray-50">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(s => (
                            <div
                                key={s}
                                className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-primary' : 'bg-gray-200'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category *</label>
                                    <input
                                        type="text"
                                        name="subCategory"
                                        value={formData.subCategory}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">MOQ (pcs) *</label>
                                    <input
                                        type="number"
                                        name="moq"
                                        value={formData.moq}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Lead Time *</label>
                                    <input
                                        type="text"
                                        name="leadTime"
                                        value={formData.leadTime}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 7-15 days"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="DRAFT">Draft</option>
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Pricing & Variants */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Price Tiers</h3>
                                    <button
                                        type="button"
                                        onClick={addPriceTier}
                                        className="flex items-center gap-2 text-primary hover:text-primary/80"
                                    >
                                        <Plus size={18} /> Add Tier
                                    </button>
                                </div>
                                {formData.priceTiers.map((tier, index) => (
                                    <div key={index} className="flex gap-4 mb-3">
                                        <input
                                            type="number"
                                            placeholder="Min Qty"
                                            value={tier.minQty ?? ''}
                                            onChange={(e) => updatePriceTier(index, 'minQty', e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max Qty (optional)"
                                            value={tier.maxQty ?? ''}
                                            onChange={(e) => updatePriceTier(index, 'maxQty', e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Price ($)"
                                            value={tier.price ?? ''}
                                            onChange={(e) => updatePriceTier(index, 'price', e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            required
                                        />
                                        {formData.priceTiers.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePriceTier(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Minus size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Colors</h3>
                                    <button
                                        type="button"
                                        onClick={addColor}
                                        className="flex items-center gap-2 text-primary hover:text-primary/80"
                                    >
                                        <Plus size={18} /> Add Color
                                    </button>
                                </div>
                                {formData.colors.map((color, index) => (
                                    <div key={index} className="flex gap-4 mb-3 items-center">
                                        <input
                                            type="text"
                                            placeholder="Color Name"
                                            value={color.name ?? ''}
                                            onChange={(e) => updateColor(index, 'name', e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                        <input
                                            type="color"
                                            value={color.hex ?? '#000000'}
                                            onChange={(e) => updateColor(index, 'hex', e.target.value)}
                                            className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                                        />
                                        {formData.colors.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeColor(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Minus size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Sizes</h3>
                                <div className="flex flex-wrap gap-3">
                                    {sizeOptions.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => toggleSize(size)}
                                            className={`px-4 py-2 rounded-lg border-2 transition-colors ${formData.sizes.includes(size)
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-gray-300 text-gray-700 hover:border-primary'
                                                }`}
                                        >
                                            {size}
                                            {formData.sizes.includes(size) && <Check size={16} className="inline ml-2" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Customization Options</h3>
                                    <button
                                        type="button"
                                        onClick={addCustomization}
                                        className="flex items-center gap-2 text-primary hover:text-primary/80"
                                    >
                                        <Plus size={18} /> Add Option
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.customization.map((option, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                                        >
                                            {option}
                                            <button
                                                type="button"
                                                onClick={() => removeCustomization(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Images & Video */}
                    {step === 3 && (
                        <div className="space-y-8">
                            {/* Images Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Images</h3>
                                <p className="text-sm text-gray-600 mb-4">Upload 4+ images showing different angles (front, back, side, detail views)</p>

                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                />

                                <label
                                    htmlFor="image-upload"
                                    className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                                >
                                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                                    <span className="text-primary hover:text-primary/80 font-medium text-lg">
                                        Click to upload images
                                    </span>
                                    <p className="text-sm text-gray-500 mt-2">Select multiple images at once</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each • Recommended: 4+ images</p>
                                </label>

                                {imagePreviews.length > 0 && (
                                    <div className="mt-6">
                                        <div className="flex justify-between items-center mb-3">
                                            <p className="text-sm font-medium text-gray-700">
                                                {imagePreviews.length} image{imagePreviews.length !== 1 ? 's' : ''} selected
                                            </p>
                                            <label
                                                htmlFor="image-upload"
                                                className="text-sm text-primary hover:text-primary/80 cursor-pointer font-medium"
                                            >
                                                + Add more
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg border border-gray-200 bg-gray-50"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                            title="Remove image"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Video Section */}
                            <div className="border-t border-gray-200 pt-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Video (Optional)</h3>
                                <p className="text-sm text-gray-600 mb-4">Upload a short video showcasing your product details and movement.</p>

                                {!videoPreview ? (
                                    <>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={handleVideoUpload}
                                            className="hidden"
                                            id="video-upload"
                                        />
                                        <label
                                            htmlFor="video-upload"
                                            className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                            </div>
                                            <span className="text-primary hover:text-primary/80 font-medium text-lg">
                                                Click to upload video
                                            </span>
                                            <p className="text-sm text-gray-500 mt-2">MP4, WebM up to 50MB</p>
                                        </label>
                                    </>
                                ) : (
                                    <div className="relative group max-w-md">
                                        <video
                                            src={videoPreview}
                                            controls
                                            className="w-full rounded-lg border border-gray-200 bg-black"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeVideo}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-md hover:bg-red-600 transition-colors"
                                            title="Remove video"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Specifications */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Specifications</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                                    <input
                                        type="text"
                                        value={formData.specifications.material}
                                        onChange={(e) => handleSpecChange('material', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="e.g., 100% Cotton"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fabric Type</label>
                                    <input
                                        type="text"
                                        value={formData.specifications.fabricType}
                                        onChange={(e) => handleSpecChange('fabricType', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="e.g., Woven, Knitted"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Technics</label>
                                    <input
                                        type="text"
                                        value={formData.specifications.technics}
                                        onChange={(e) => handleSpecChange('technics', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="e.g., Printed, Embroidered"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Feature</label>
                                    <input
                                        type="text"
                                        value={formData.specifications.feature}
                                        onChange={(e) => handleSpecChange('feature', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="e.g., Sustainable, Anti-wrinkle"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Origin</label>
                                    <input
                                        type="text"
                                        value={formData.specifications.origin}
                                        onChange={(e) => handleSpecChange('origin', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-between">
                    <button
                        type="button"
                        onClick={prevStep}
                        disabled={step === 1}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    {step < 4 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;

