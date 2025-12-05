import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetProductByIdQuery } from '../redux/slices/apiSlice';
import { ChevronRight, ChevronLeft, Star, MessageCircle, Send, ShoppingCart, Heart, Share2, PenTool, ZoomIn } from 'lucide-react';
import InquiryModal from '../components/InquiryModal';
import CustomizationModal from '../components/customization/CustomizationModal';
import { getImageUrl, getFileUrl } from '../config';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const [showCustomizationModal, setShowCustomizationModal] = useState(false);
    const [mediaTab, setMediaTab] = useState('photos');
    const [imageZoom, setImageZoom] = useState(false);

    // Use RTK Query to fetch product
    const { data: product, isLoading: loading, error: queryError } = useGetProductByIdQuery(id);
    const error = queryError ? 'Product not found' : null;

    // Initialize state when product loads
    useEffect(() => {
        if (product) {
            if (product.colors && product.colors.length > 0) setSelectedColor(product.colors[0]);
            if (product.sizes && product.sizes.length > 0) setSelectedSize(product.sizes[0]);
            setQuantity(product.moq || 1);
            setActiveImage(0);
            setMediaTab(product.video ? 'video' : 'photos');
        }
    }, [product]);

    // Handle keyboard navigation for images
    useEffect(() => {
        if (!product) return;

        const handleKeyPress = (e) => {
            if (mediaTab === 'photos') {
                if (e.key === 'ArrowLeft') {
                    handlePreviousImage();
                } else if (e.key === 'ArrowRight') {
                    handleNextImage();
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [activeImage, product, mediaTab]);

    const handlePreviousImage = () => {
        if (product && activeImage > 0) {
            setActiveImage(prev => prev - 1);
            setMediaTab('photos');
        }
    };

    const handleNextImage = () => {
        if (product && activeImage < product.images.length - 1) {
            setActiveImage(prev => prev + 1);
            setMediaTab('photos');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
    if (!product) return null;

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

    const handleCustomization = () => {
        handleAuthAction(() => {
            setShowCustomizationModal(true);
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
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column: Image Gallery */}
                    <div className="lg:col-span-6 flex flex-col-reverse lg:flex-row gap-4 lg:gap-6">

                        {/* Vertical Thumbnails */}
                        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:h-[600px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 py-2 px-1">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setActiveImage(index);
                                        setMediaTab('photos');
                                    }}
                                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeImage === index && mediaTab === 'photos'
                                        ? 'border-accent ring-2 ring-accent/20 scale-105'
                                        : 'border-slate-200 hover:border-accent/50'
                                        }`}
                                >
                                    <img
                                        src={getImageUrl(img)}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder.svg';
                                        }}
                                    />
                                </button>
                            ))}
                            {/* Video Thumbnail */}
                            {product.video && (
                                <button
                                    onClick={() => setMediaTab('video')}
                                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 relative flex items-center justify-center bg-black ${mediaTab === 'video'
                                        ? 'border-accent ring-2 ring-accent/20 scale-105'
                                        : 'border-slate-200 hover:border-accent/50'
                                        }`}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center backdrop-blur-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-accent ml-0.5">
                                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                            </svg>
                                        </div>
                                    </div>
                                    <video
                                        src={getFileUrl(product.video)}
                                        className="w-full h-full object-cover opacity-60"
                                    />
                                </button>
                            )}
                        </div>

                        {/* Main Image/Video Display */}
                        <div className="flex-1 flex flex-col gap-4">
                            {/* Media Tabs */}
                            <div className="flex gap-2 border-b border-slate-200 pb-2">
                                <button
                                    onClick={() => setMediaTab('photos')}
                                    className={`px-6 py-2 text-sm font-semibold rounded-t-lg transition-all ${mediaTab === 'photos'
                                        ? 'text-accent border-b-2 border-accent'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    Photos
                                </button>
                                {product.video && (
                                    <button
                                        onClick={() => setMediaTab('video')}
                                        className={`px-6 py-2 text-sm font-semibold rounded-t-lg transition-all ${mediaTab === 'video'
                                            ? 'text-accent border-b-2 border-accent'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        Video
                                    </button>
                                )}
                            </div>

                            {/* Media Display Area with Navigation Arrows INSIDE */}
                            <div
                                className={`flex-1 min-h-[400px] h-[500px] lg:h-[550px] bg-slate-50 rounded-2xl overflow-hidden relative group border border-slate-200 flex items-center justify-center ${imageZoom ? 'cursor-zoom-out' : 'cursor-zoom-in'
                                    }`}
                                onClick={() => mediaTab === 'photos' && setImageZoom(!imageZoom)}
                            >
                                {/* Image Navigation Arrows - NOW INSIDE */}
                                {mediaTab === 'photos' && activeImage > 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePreviousImage();
                                        }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200 flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 opacity-0 group-hover:opacity-100"
                                        title="Previous Image"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                )}

                                {mediaTab === 'photos' && activeImage < product.images.length - 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNextImage();
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200 flex items-center justify-center hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 opacity-0 group-hover:opacity-100"
                                        title="Next Image"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                )}

                                {mediaTab === 'video' && product.video ? (
                                    <video
                                        src={getFileUrl(product.video)}
                                        controls
                                        autoPlay
                                        className="w-full h-full object-contain bg-black"
                                    />
                                ) : (
                                    <>
                                        <img
                                            src={getImageUrl(product.images[activeImage] || product.images[0])}
                                            alt={product.name}
                                            className={`w-full h-full object-contain p-4 transition-all duration-500 ${imageZoom ? 'scale-150' : 'group-hover:scale-105'
                                                }`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder.svg';
                                            }}
                                        />

                                        {/* Hover Actions */}
                                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setImageZoom(!imageZoom);
                                                }}
                                                className="p-2.5 bg-white rounded-full shadow-lg hover:bg-accent hover:text-white text-slate-600 transition-all transform hover:scale-110"
                                                title="Zoom"
                                            >
                                                <ZoomIn className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 bg-white rounded-full shadow-lg hover:bg-accent hover:text-white text-slate-600 transition-all transform hover:scale-110">
                                                <Heart className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 bg-white rounded-full shadow-lg hover:bg-accent hover:text-white text-slate-600 transition-all transform hover:scale-110">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Image Counter */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium">
                                            {activeImage + 1} / {product.images.length}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="lg:col-span-6">
                        <div className="mb-6">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-primary mb-2 leading-tight">{product.name}</h1>
                            {product.sku && (
                                <div className="inline-block bg-black/90 text-white px-4 py-2 rounded-lg mb-4">
                                    <p className="text-sm font-bold tracking-wide">
                                        Item Code - {product.sku}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="flex items-center text-yellow-400 bg-yellow-50 px-3 py-1.5 rounded-full">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-slate-700 font-medium text-sm ml-2">4.8 (24 Reviews)</span>
                                </div>
                                <div className="h-4 w-px bg-slate-200"></div>
                                <span className="text-accent font-medium text-sm bg-accent/10 px-3 py-1.5 rounded-full">
                                    MOQ: {product.moq} Pieces
                                </span>
                            </div>
                        </div>

                        {/* Wholesale Pricing Tiers */}
                        <div className="bg-gradient-to-br from-slate-50 to-orange-50/30 p-6 rounded-xl mb-6 border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <div className="w-1 h-4 bg-accent rounded-full"></div>
                                Wholesale Pricing
                            </h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                {product.priceTiers.map((tier, index) => (
                                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-slate-100">
                                        <div className="text-2xl font-bold text-primary">${tier.price.toFixed(2)}</div>
                                        <div className="text-xs text-slate-500 font-medium mt-1">
                                            {tier.minQty} {tier.maxQty ? `- ${tier.maxQty}` : '+'} Pcs
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Configuration Options */}
                        <div className="space-y-6 border-t border-slate-100 pt-6">

                            {/* Colors */}
                            <div>
                                <h3 className="text-sm font-bold text-primary mb-3">Color: <span className="text-slate-600 font-normal ml-2">{selectedColor?.name}</span></h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {product.colors.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all ${selectedColor?.name === color.name
                                                ? 'border-accent ring-2 ring-accent/20 scale-110'
                                                : 'border-slate-200 hover:border-accent/50 hover:scale-105'
                                                }`}
                                            title={color.name}
                                        >
                                            <div
                                                className="w-8 h-8 rounded-full shadow-sm"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div>
                                <h3 className="text-sm font-bold text-primary mb-3">Size: <span className="text-slate-600 font-normal ml-2">{selectedSize}</span></h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {product.sizes.map((size, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[3rem] h-10 px-4 text-sm font-medium border-2 rounded-lg transition-all ${selectedSize === size
                                                ? 'border-accent bg-accent text-white shadow-md scale-105'
                                                : 'border-slate-200 text-slate-600 hover:border-accent/50 hover:text-accent bg-white'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Lead Time & Customization */}
                            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Lead Time</span>
                                    <span className="text-primary font-semibold">{product.leadTime}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Customization</span>
                                    <span className="text-primary font-semibold text-sm">{product.customization.join(', ')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col gap-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleChatNow}
                                    className="flex-1 btn btn-outline border-2 border-accent text-accent hover:bg-accent hover:text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Chat Now
                                </button>
                                <button
                                    onClick={handleInquiry}
                                    className="flex-[2] btn btn-accent py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-accent/30 transition-all"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Inquiry
                                </button>
                            </div>

                            {/* Customization Button */}
                            <button
                                onClick={handleCustomization}
                                className="w-full btn bg-gray-900 text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all"
                            >
                                <PenTool className="w-5 h-5" />
                                Customize Now
                            </button>
                        </div>

                        <p className="text-center text-xs text-slate-400 mt-4">
                            🔒 Secure payments • 🌍 Global Shipping • ✓ Quality Guarantee
                        </p>
                    </div>
                </div>

                {/* Product Details Tabs/Section */}
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description */}
                        <section>
                            <h3 className="text-2xl font-heading font-bold text-primary mb-6 flex items-center gap-3">
                                <div className="w-1 h-6 bg-accent rounded-full"></div>
                                Product Description
                            </h3>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed bg-white rounded-xl p-6 border border-slate-100">
                                <p>{product.description}</p>
                            </div>
                        </section>

                        {/* Specifications */}
                        <section>
                            <h3 className="text-2xl font-heading font-bold text-primary mb-6 flex items-center gap-3">
                                <div className="w-1 h-6 bg-accent rounded-full"></div>
                                Specifications
                            </h3>
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                <table className="w-full text-sm text-left">
                                    <tbody className="divide-y divide-slate-100">
                                        {Object.entries(product.specifications).map(([key, value], index) => (
                                            <tr key={key} className={index % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                                                <td className="px-6 py-4 font-semibold text-slate-700 capitalize w-1/3">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </td>
                                                <td className="px-6 py-4 text-slate-800 font-medium">
                                                    {value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-white to-orange-50/20 p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                            <h4 className="font-bold text-primary mb-5 text-lg">Why Buy From Us?</h4>
                            <ul className="space-y-4">
                                {[
                                    { text: 'Direct Factory Prices', icon: Star },
                                    { text: 'Low MOQ (100 pcs)', icon: ShoppingCart },
                                    { text: 'Premium Quality Control', icon: Heart },
                                    { text: 'Fast Global Shipping', icon: Share2 },
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                                            <item.icon size={16} />
                                        </div>
                                        <span className="font-medium">{item.text}</span>
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

            {showCustomizationModal && (
                <CustomizationModal
                    product={product}
                    isOpen={showCustomizationModal}
                    onClose={() => setShowCustomizationModal(false)}
                />
            )}
        </div>
    );
};

export default ProductDetails;
