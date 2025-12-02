import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, Minus, FileText, Image as ImageIcon, Video, DollarSign, Package, Ruler, CheckCircle, AlertCircle, Save } from 'lucide-react';
import API from '../api';
import { CATEGORY_HIERARCHY } from '../constants/categories';

const UploadDesign = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('basic');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        sku: '', // Style Code
        category: '',
        subCategory: '',
        shortDescription: '',
        description: '',
        specifications: {
            fabricType: '',
            gsm: '',
            technics: '', // Print/Embroidery
            trims: '',
            origin: 'India'
        },
        measurements: [], // Array of { point: '', values: { size: val } }
        colors: [{ name: '', hex: '#000000' }],
        sizes: [],
        costing: {
            fabricCost: '',
            cmCost: '',
            trimCost: '',
            overheadCost: '',
            hsCode: '',
            packagingSpecs: '',
            toleranceRule: '',
            complianceNeeded: false
        },
        moq: '',
        leadTime: '',
        sampleTime: '',
        incoterm: 'FOB'
    });

    // File State
    const [files, setFiles] = useState({
        images: [],
        video: null,
        techpack: null,
        complianceDocs: null
    });

    // Previews
    const [previews, setPreviews] = useState({
        images: [],
        video: null
    });

    const sections = [
        { id: 'basic', label: 'Basic Info', icon: FileText },
        { id: 'media', label: 'Media', icon: ImageIcon },
        { id: 'specs', label: 'Specifications', icon: Package },
        { id: 'variants', label: 'Variants', icon: Ruler },
        { id: 'costing', label: 'Costing & Compliance', icon: DollarSign },
        { id: 'logistics', label: 'Logistics', icon: CheckCircle }
    ];

    const handleInputChange = (e, section = null) => {
        const { name, value, type, checked } = e.target;

        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [name]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = (e, type) => {
        const fileList = e.target.files;
        if (!fileList.length) return;

        if (type === 'images') {
            const newFiles = Array.from(fileList);
            setFiles(prev => ({ ...prev, images: [...prev.images, ...newFiles] }));

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => ({ ...prev, images: [...prev.images, ...newPreviews] }));
        } else {
            const file = fileList[0];
            setFiles(prev => ({ ...prev, [type]: file }));

            if (type === 'video') {
                setPreviews(prev => ({ ...prev, video: URL.createObjectURL(file) }));
            }
        }
    };

    const removeImage = (index) => {
        setFiles(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
        setPreviews(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    };

    const handleColorChange = (index, field, value) => {
        const newColors = [...formData.colors];
        newColors[index][field] = value;
        setFormData(prev => ({ ...prev, colors: newColors }));
    };

    const addColor = () => {
        setFormData(prev => ({ ...prev, colors: [...prev.colors, { name: '', hex: '#000000' }] }));
    };

    const removeColor = (index) => {
        setFormData(prev => ({ ...prev, colors: prev.colors.filter((_, i) => i !== index) }));
    };

    const handleSizeToggle = (size) => {
        setFormData(prev => {
            const newSizes = prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size];
            return { ...prev, sizes: newSizes };
        });
    };

    const addMeasurementRow = () => {
        setFormData(prev => ({
            ...prev,
            measurements: [...prev.measurements, { point: '', values: {} }]
        }));
    };

    const updateMeasurement = (index, field, value, size = null) => {
        const newMeasurements = [...formData.measurements];
        if (size) {
            newMeasurements[index].values[size] = value;
        } else {
            newMeasurements[index][field] = value;
        }
        setFormData(prev => ({ ...prev, measurements: newMeasurements }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();

            // Append basic fields
            Object.keys(formData).forEach(key => {
                if (key === 'measurements') {
                    // Convert measurements array to Map object string
                    const measurementsMap = {};
                    formData.measurements.forEach(m => {
                        if (m.point) {
                            const valuesStr = Object.entries(m.values)
                                .map(([size, val]) => `${size}: ${val}`)
                                .join(', ');
                            measurementsMap[m.point] = valuesStr;
                        }
                    });
                    data.append('measurements', JSON.stringify(measurementsMap));
                } else if (typeof formData[key] === 'object' && formData[key] !== null) {
                    data.append(key, JSON.stringify(formData[key]));
                } else {
                    data.append(key, formData[key]);
                }
            });

            // Append files
            files.images.forEach(file => data.append('images', file));
            if (files.video) data.append('video', files.video);
            if (files.techpack) data.append('techpack', files.techpack);
            if (files.complianceDocs) data.append('complianceDocs', files.complianceDocs);

            await API.post('/products', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Design uploaded successfully! It is now pending approval.');
            navigate('/designer/products');
        } catch (error) {
            console.error('Upload failed:', error);
            alert(error.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-heading font-bold text-primary">Upload Design</h2>
                    <p className="text-xs text-slate-500 mt-1">Fill in all details for approval</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === section.id
                                    ? 'bg-accent/10 text-accent shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <section.icon size={18} />
                            {section.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? 'Uploading...' : (
                            <>
                                <Save size={18} />
                                Submit Design
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto space-y-8 pb-20">

                    {/* Basic Info */}
                    <div id="basic" className={`bg-white rounded-2xl p-8 shadow-sm border border-slate-100 ${activeSection === 'basic' ? 'block' : 'hidden'}`}>
                        <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                            <FileText className="text-accent" size={24} /> Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Design Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20"
                                    placeholder="e.g. Summer Floral Maxi Dress"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Style Code (SKU)</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20"
                                    placeholder="e.g. SF-2024-001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20"
                                >
                                    <option value="">Select Category</option>
                                    {Object.keys(CATEGORY_HIERARCHY).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            {formData.category && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Sub Category</label>
                                    <select
                                        name="subCategory"
                                        value={formData.subCategory}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20"
                                    >
                                        <option value="">Select Sub Category</option>
                                        {CATEGORY_HIERARCHY[formData.category].map(sub => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Short Description</label>
                                <input
                                    type="text"
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20"
                                    placeholder="Brief summary for listing cards"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/20"
                                    placeholder="Detailed product description..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div id="media" className={`bg-white rounded-2xl p-8 shadow-sm border border-slate-100 ${activeSection === 'media' ? 'block' : 'hidden'}`}>
                        <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                            <ImageIcon className="text-accent" size={24} /> Media Uploads
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Product Images</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {previews.images.map((src, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                            <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Minus size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
                                        <Upload className="text-slate-400 mb-2" />
                                        <span className="text-xs text-slate-500 font-medium">Add Images</span>
                                        <input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, 'images')} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Product Video (Optional)</label>
                                {previews.video ? (
                                    <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden bg-black">
                                        <video src={previews.video} controls className="w-full h-full" />
                                        <button
                                            onClick={() => {
                                                setFiles(prev => ({ ...prev, video: null }));
                                                setPreviews(prev => ({ ...prev, video: null }));
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                        >
                                            <Minus size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="w-full max-w-md aspect-video rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
                                        <Video className="text-slate-400 mb-2" />
                                        <span className="text-xs text-slate-500 font-medium">Upload Video</span>
                                        <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} className="hidden" />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div id="specs" className={`bg-white rounded-2xl p-8 shadow-sm border border-slate-100 ${activeSection === 'specs' ? 'block' : 'hidden'}`}>
                        <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                            <Package className="text-accent" size={24} /> Technical Specifications
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Fabric Type</label>
                                <input
                                    type="text"
                                    name="fabricType"
                                    value={formData.specifications.fabricType}
                                    onChange={(e) => handleInputChange(e, 'specifications')}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                    placeholder="e.g. 100% Cotton Single Jersey"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">GSM</label>
                                <input
                                    type="text"
                                    name="gsm"
                                    value={formData.specifications.gsm}
                                    onChange={(e) => handleInputChange(e, 'specifications')}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                    placeholder="e.g. 180 GSM"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Print/Embroidery Type</label>
                                <input
                                    type="text"
                                    name="technics"
                                    value={formData.specifications.technics}
                                    onChange={(e) => handleInputChange(e, 'specifications')}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                    placeholder="e.g. Screen Print, AOP"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Trims</label>
                                <input
                                    type="text"
                                    name="trims"
                                    value={formData.specifications.trims}
                                    onChange={(e) => handleInputChange(e, 'specifications')}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                    placeholder="e.g. YKK Zippers, Wooden Buttons"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Techpack (PDF)</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 px-4 py-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 flex items-center gap-2">
                                        <Upload size={18} className="text-slate-400" />
                                        <span className="text-slate-600 truncate">
                                            {files.techpack ? files.techpack.name : 'Upload Techpack PDF'}
                                        </span>
                                        <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, 'techpack')} className="hidden" />
                                    </label>
                                    {files.techpack && (
                                        <button onClick={() => setFiles(prev => ({ ...prev, techpack: null }))} className="text-red-500 p-2 hover:bg-red-50 rounded-full">
                                            <Minus size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Variants */}
                    <div id="variants" className={`bg-white rounded-2xl p-8 shadow-sm border border-slate-100 ${activeSection === 'variants' ? 'block' : 'hidden'}`}>
                        <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                            <Ruler className="text-accent" size={24} /> Variants & Measurements
                        </h3>

                        {/* Colors */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-slate-700 mb-3">Color Options</label>
                            <div className="space-y-3">
                                {formData.colors.map((color, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            placeholder="Color Name"
                                            value={color.name}
                                            onChange={(e) => handleColorChange(idx, 'name', e.target.value)}
                                            className="flex-1 px-4 py-2 rounded-lg border border-slate-200"
                                        />
                                        <input
                                            type="color"
                                            value={color.hex}
                                            onChange={(e) => handleColorChange(idx, 'hex', e.target.value)}
                                            className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer p-1"
                                        />
                                        <button onClick={() => removeColor(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded-full">
                                            <Minus size={18} />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={addColor} className="text-accent text-sm font-bold flex items-center gap-1 hover:underline">
                                    <Plus size={16} /> Add Color
                                </button>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-slate-700 mb-3">Available Sizes</label>
                            <div className="flex flex-wrap gap-2">
                                {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => handleSizeToggle(size)}
                                        className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all ${formData.sizes.includes(size)
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-primary'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Measurement Table */}
                        {formData.sizes.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">Measurements Table (in cm)</label>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-3 rounded-l-lg">Point of Measure</th>
                                                {formData.sizes.map(size => (
                                                    <th key={size} className="px-4 py-3">{size}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {formData.measurements.map((row, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-2">
                                                        <input
                                                            type="text"
                                                            value={row.point}
                                                            onChange={(e) => updateMeasurement(idx, 'point', e.target.value)}
                                                            className="w-full bg-transparent focus:outline-none font-medium"
                                                            placeholder="e.g. Chest Width"
                                                        />
                                                    </td>
                                                    {formData.sizes.map(size => (
                                                        <td key={size} className="px-4 py-2">
                                                            <input
                                                                type="text"
                                                                value={row.values[size] || ''}
                                                                onChange={(e) => updateMeasurement(idx, null, e.target.value, size)}
                                                                className="w-full bg-transparent focus:outline-none"
                                                                placeholder="-"
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <button onClick={addMeasurementRow} className="mt-3 text-accent text-sm font-bold flex items-center gap-1 hover:underline">
                                    <Plus size={16} /> Add Row
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Costing */}
                    <div id="costing" className={`bg-white rounded-2xl p-8 shadow-sm border border-slate-100 ${activeSection === 'costing' ? 'block' : 'hidden'}`}>
                        <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                            <DollarSign className="text-accent" size={24} /> Costing & Compliance
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Fabric Cost</label>
                                <input
                                    type="number"
                                    name="fabricCost"
                                    value={formData.costing.fabricCost}
                                    onChange={(e) => handleInputChange(e, 'costing')}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">CM Cost (Cut & Make)</label>
                                <input
                                    type="number"
                                    name="cmCost"
                                    value={formData.costing.cmCost}
                                    onChange={(e) => handleInputChange(e, 'costing')}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Trim Cost</label>
                                <input
                                    type="number"
                                    name="trimCost"
                                    value={formData.costing.trimCost}
                                    onChange={(e) => handleInputChange(e, 'costing')}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Overhead Cost</label>
                                <input
                                    type="number"
                                    name="overheadCost"
                                    value={formData.costing.overheadCost}
                                    onChange={(e) => handleInputChange(e, 'costing')}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">HS Code</label>
                                <input
                                    type="text"
                                    name="hsCode"
                                    value={formData.costing.hsCode}
                                    onChange={(e) => handleInputChange(e, 'costing')}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tolerance Rule</label>
                                <input
                                    type="text"
                                    name="toleranceRule"
                                    value={formData.costing.toleranceRule}
                                    onChange={(e) => handleInputChange(e, 'costing')}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                    placeholder="e.g. +/- 5%"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Packaging Specs</label>
                                <textarea
                                    name="packagingSpecs"
                                    value={formData.costing.packagingSpecs}
                                    onChange={(e) => handleInputChange(e, 'costing')}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                    placeholder="e.g. Individual polybag, 50 pcs per carton"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Compliance Documents (PDF)</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 px-4 py-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 flex items-center gap-2">
                                        <Upload size={18} className="text-slate-400" />
                                        <span className="text-slate-600 truncate">
                                            {files.complianceDocs ? files.complianceDocs.name : 'Upload Compliance PDF'}
                                        </span>
                                        <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, 'complianceDocs')} className="hidden" />
                                    </label>
                                    {files.complianceDocs && (
                                        <button onClick={() => setFiles(prev => ({ ...prev, complianceDocs: null }))} className="text-red-500 p-2 hover:bg-red-50 rounded-full">
                                            <Minus size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logistics */}
                    <div id="logistics" className={`bg-white rounded-2xl p-8 shadow-sm border border-slate-100 ${activeSection === 'logistics' ? 'block' : 'hidden'}`}>
                        <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                            <CheckCircle className="text-accent" size={24} /> Logistics & Terms
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">MOQ (Minimum Order Qty)</label>
                                <input
                                    type="number"
                                    name="moq"
                                    value={formData.moq}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                    placeholder="e.g. 100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Incoterm</label>
                                <select
                                    name="incoterm"
                                    value={formData.incoterm}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                >
                                    <option value="FOB">FOB</option>
                                    <option value="CIF">CIF</option>
                                    <option value="EXW">EXW</option>
                                    <option value="DDP">DDP</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Sample Lead Time</label>
                                <input
                                    type="text"
                                    name="sampleTime"
                                    value={formData.sampleTime}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                    placeholder="e.g. 7-10 days"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Production Lead Time</label>
                                <input
                                    type="text"
                                    name="leadTime"
                                    value={formData.leadTime}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200"
                                    placeholder="e.g. 30-45 days"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UploadDesign;
