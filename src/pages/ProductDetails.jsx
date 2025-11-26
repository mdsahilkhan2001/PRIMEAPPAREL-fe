import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ChevronRight, Star, MessageCircle, Send, ShoppingCart, Heart, Share2 } from 'lucide-react';
import InquiryModal from '../components/InquiryModal';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [showInquiryModal, setShowInquiryModal] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
                if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
                setQuantity(data.moq || 1);
                setLoading(false);
            } catch (err) {
                setError('Product not found');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
    if (!product) return null;

    // Calculate current price based on quantity
    const getCurrentPrice = (qty) => {
        if (!product.priceTiers || product.priceTiers.length === 0) return 0;
        let price = product.priceTiers[0].price;
        for (let tier of product.priceTiers) {
            if (qty >= tier.minQty) {
                price = tier.price;
            }
        }
        return price;
    };

    const currentPrice = getCurrentPrice(quantity);

    const handleAuthAction = (action) => {
        if (user) {
            action();
        } else {
            navigate('/login', { state: { from: location.pathname } });
        }
    };

    const handleChatNow = () => {
        handleAuthAction(() => {
            // Default WhatsApp number (replace with actual seller number if available)
            const phoneNumber = '919876543210';
            const message = `Hi, I am interested in ${product.name}.`;
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        });
    };

    const handleInquiry = () => {
        handleAuthAction(() => {
            setShowInquiryModal(true);
        });
    };

    return (
        <div className="bg-secondary min-h-screen pb-20 pt-20">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center text-sm text-slate-500">
                    <Link to="/" className="hover:text-accent transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
                    <Link to="/products" className="hover:text-accent transition-colors">{product.category}</Link>
                    <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
                    <span className="text-primary font-medium">{product.subCategory}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Image Gallery */}
                    <div className="lg:col-span-6 flex flex-col-reverse lg:flex-row gap-6">
                        {/* Vertical Thumbnails */}
                        <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:h-[600px] scrollbar-hide py-2 px-1">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeImage === index
                                        ? 'border-accent ring-2 ring-accent/20'
                                        : 'border-transparent hover:border-slate-200'
                                        }`}
                                >
                                    <img
                                        src={`http://localhost:5000${encodeURI(img)}`}
                                        alt={`Thumbnail ${index}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                        }}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 h-[500px] lg:h-[600px] bg-gray-50 rounded-2xl overflow-hidden relative group border border-slate-100">
                            <img
                                src={`http://localhost:5000${encodeURI(product.images[activeImage])}`}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply p-8 transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/600?text=No+Image';
                                }}
                            />
                            <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="p-3 bg-white rounded-full shadow-md hover:bg-accent hover:text-white text-slate-400 transition-all transform hover:scale-110">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button className="p-3 bg-white rounded-full shadow-md hover:bg-accent hover:text-white text-slate-400 transition-all transform hover:scale-110">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="lg:col-span-6">
                        <div className="mb-8">
                            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-primary mb-4 leading-tight">{product.name}</h1>

                            <div className="flex items-center gap-6 mb-6">
                                <div className="flex items-center text-yellow-400 bg-yellow-50 px-3 py-1 rounded-full">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-slate-700 font-medium text-sm ml-2">4.8 (24 Reviews)</span>
                                </div>
                                <div className="h-4 w-px bg-slate-200"></div>
                                <span className="text-accent font-medium text-sm bg-accent/10 px-3 py-1 rounded-full">
                                    MOQ: {product.moq} Pieces
                                </span>
                            </div>
                        </div>

                        {/* Wholesale Pricing Tiers */}
                        <div className="bg-slate-50 p-6 rounded-xl mb-8 border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Wholesale Pricing</h3>
                            <div className="grid grid-cols-3 gap-4 text-center divide-x divide-slate-200">
                                {product.priceTiers.map((tier, index) => (
                                    <div key={index} className="px-2 first:pl-0 last:pr-0">
                                        <div className="text-2xl font-bold text-primary">${tier.price.toFixed(2)}</div>
                                        <div className="text-xs text-slate-500 font-medium mt-1">
                                            {tier.minQty} {tier.maxQty ? `- ${tier.maxQty}` : '+'} Pcs
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Configuration Options */}
                        <div className="space-y-8 border-t border-slate-100 pt-8">

                            {/* Colors */}
                            <div>
                                <h3 className="text-sm font-bold text-primary mb-4">Select Color: <span className="text-slate-500 font-normal ml-2">{selectedColor?.name}</span></h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.colors.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor?.name === color.name
                                                ? 'border-accent ring-2 ring-accent/20 scale-110'
                                                : 'border-transparent hover:border-slate-200'
                                                }`}
                                            title={color.name}
                                        >
                                            <div
                                                className="w-9 h-9 rounded-full shadow-sm"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div>
                                <h3 className="text-sm font-bold text-primary mb-4">Select Size: <span className="text-slate-500 font-normal ml-2">{selectedSize}</span></h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[3rem] h-10 px-4 text-sm font-medium border rounded-lg transition-all ${selectedSize === size
                                                ? 'border-accent bg-accent text-white shadow-md'
                                                : 'border-slate-200 text-slate-600 hover:border-accent hover:text-accent bg-white'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Lead Time & Customization */}
                            <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Lead Time</span>
                                    <span className="text-primary font-medium">{product.leadTime}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Customization</span>
                                    <span className="text-primary font-medium">{product.customization.join(', ')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleChatNow}
                                className="flex-1 btn btn-outline border-2 border-accent text-accent hover:bg-accent hover:text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Chat Now
                            </button>
                            <button
                                onClick={handleInquiry}
                                className="flex-[2] btn btn-accent py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl hover:shadow-accent/30"
                            >
                                <Send className="w-5 h-5" />
                                Send Inquiry
                            </button>
                        </div>

                        <p className="text-center text-xs text-slate-400 mt-4">
                            Secure payments • Global Shipping • Quality Guarantee
                        </p>
                    </div>
                </div>

                {/* Product Details Tabs/Section */}
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description */}
                        <section>
                            <h3 className="text-2xl font-heading font-bold text-primary mb-6">Product Description</h3>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                                <p>{product.description}</p>
                            </div>
                        </section>

                        {/* Specifications */}
                        <section>
                            <h3 className="text-2xl font-heading font-bold text-primary mb-6">Specifications</h3>
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <tbody className="divide-y divide-slate-100">
                                        {Object.entries(product.specifications).map(([key, value], index) => (
                                            <tr key={key} className={index % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                                                <td className="px-6 py-4 font-semibold text-slate-600 capitalize w-1/3">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </td>
                                                <td className="px-6 py-4 text-slate-800">
                                                    {value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Related (Placeholder) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                            <h4 className="font-bold text-primary mb-4">Why Buy From Us?</h4>
                            <ul className="space-y-4">
                                {[
                                    { text: 'Direct Factory Prices', icon: Star },
                                    { text: 'Low MOQ (100 pcs)', icon: ShoppingCart },
                                    { text: 'Premium Quality Control', icon: Heart },
                                    { text: 'Fast Global Shipping', icon: Share2 },
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                            <item.icon size={14} />
                                        </div>
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {showInquiryModal && (
                <InquiryModal
                    product={product}
                    user={user}
                    onClose={() => setShowInquiryModal(false)}
                />
            )}
        </div>
    );
};

export default ProductDetails;
