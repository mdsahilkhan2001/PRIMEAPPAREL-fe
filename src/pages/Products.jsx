import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, ArrowRight, Star, ShoppingBag, ChevronLeft, ChevronRight, ChevronDown, Loader2, X } from 'lucide-react';
import { CATEGORY_HIERARCHY } from '../constants/categories';
import { getImageUrl } from '../config';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = searchParams.get('cat') || 'all';
    const [category, setCategory] = useState(initialCategory === 'all' ? '' : initialCategory);
    const [subCategory, setSubCategory] = useState(searchParams.get('subCategory') || '');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 0, page: 1, limit: 12 });
    const itemsPerPage = 12;

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch products from backend
    const fetchProducts = useCallback(async () => {
        try {
            setSearching(true);
            const { data } = await axios.get('/api/products', {
                params: {
                    search: debouncedSearch,
                    category: category || 'all',
                    subCategory,
                    sort: sortBy,
                    page: currentPage,
                    limit: itemsPerPage
                }
            });
            setProducts(data.products);
            setPagination(data.pagination);
            setLoading(false);
            setSearching(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
            setSearching(false);
        }
    }, [debouncedSearch, category, subCategory, sortBy, currentPage]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Reset page when filters change
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [category, subCategory, debouncedSearch, sortBy]);

    // Categories are now imported from constants

    const sortOptions = [
        { value: 'newest', label: 'Newest Arrivals' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'name-asc', label: 'Name: A-Z' },
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-secondary">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-secondary">
            {/* Hero Section */}
            <div className="relative bg-primary text-white py-24 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070"
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="container-custom relative z-10 text-center max-w-4xl mx-auto px-4">
                    <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">
                        Wholesale Catalog
                    </span>
                    <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-white">
                        Curated Excellence
                    </h1>
                    <p className="text-slate-200 text-base md:text-lg max-w-2xl mx-auto mb-10">
                        Discover our latest designs available for wholesale manufacturing.
                        Premium quality, flexible MOQs, and global shipping.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-12 py-4 rounded-full text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-accent shadow-2xl transition-all text-base"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        {searching && (
                            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-accent animate-spin" size={20} />
                        )}
                    </div>
                    <p className="text-slate-300 text-sm mt-3">
                        {pagination.total} products found
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Controls Bar */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10 sticky top-20 z-30 bg-secondary/95 backdrop-blur-sm py-4 -mx-4 px-4 border-b border-slate-200/50">
                    {/* Filters */}
                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Category Select */}
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    setSubCategory('');
                                }}
                                className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer hover:border-accent transition-colors text-sm font-medium min-w-[150px]"
                            >
                                <option value="">All Categories</option>
                                {Object.keys(CATEGORY_HIERARCHY).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Sub Category Select */}
                        {category && (
                            <div className="relative animate-in fade-in slide-in-from-left-4 duration-300">
                                <select
                                    value={subCategory}
                                    onChange={(e) => {
                                        setSubCategory(e.target.value);
                                    }}
                                    className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer hover:border-accent transition-colors text-sm font-medium min-w-[150px]"
                                >
                                    <option value="">All Sub Categories</option>
                                    {CATEGORY_HIERARCHY[category] && CATEGORY_HIERARCHY[category].map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        )}

                        {(category || subCategory) && (
                            <button
                                onClick={() => {
                                    setCategory('');
                                    setSubCategory('');
                                }}
                                className="text-slate-400 hover:text-red-500 transition-colors p-2"
                                title="Clear Filters"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative group min-w-[200px]">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter size={16} className="text-slate-400" />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none w-full bg-white border border-slate-200 text-slate-700 py-2.5 pl-10 pr-8 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer hover:border-accent transition-colors text-sm font-medium"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown size={16} className="text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Loading Overlay */}
                {searching && !loading && (
                    <div className="text-center py-8">
                        <Loader2 className="animate-spin h-8 w-8 text-accent mx-auto" />
                        <p className="text-slate-500 mt-2">Searching...</p>
                    </div>
                )}

                {/* Grid */}
                {!searching && products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <div key={product._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1">
                                    {/* Clickable Image Area */}
                                    <Link to={`/products/${product._id}`} className="block relative h-[400px] overflow-hidden bg-gray-100 cursor-pointer">
                                        <img
                                            src={getImageUrl(product.images && product.images[0])}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder.svg';
                                            }}
                                        />
                                        {/* MOQ Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                                                MOQ: {product.moq}
                                            </span>
                                        </div>
                                        {/* Item Code Banner */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm py-3 px-4">
                                            <p className="text-white text-center text-base font-bold tracking-wide">
                                                Item Code - {product.sku || `ID-${product._id.slice(-6).toUpperCase()}`}
                                            </p>
                                        </div>
                                    </Link>

                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-xs text-accent font-semibold uppercase tracking-wider">{product.subCategory}</div>
                                            {/* Color Swatches Preview */}
                                            {product.colors && product.colors.length > 0 && (
                                                <div className="flex -space-x-1">
                                                    {product.colors.slice(0, 3).map((color, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="w-4 h-4 rounded-full border border-white shadow-sm"
                                                            style={{ backgroundColor: color.hex }}
                                                            title={color.name}
                                                        />
                                                    ))}
                                                    {product.colors.length > 3 && (
                                                        <div className="w-4 h-4 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[8px] text-slate-500 font-bold">
                                                            +
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <Link to={`/products/${product._id}`} className="block group-hover:text-accent transition-colors">
                                            <h3 className="text-xl font-heading font-bold text-primary mb-2 truncate">{product.name}</h3>
                                        </Link>

                                        {/* Price Tier Preview */}
                                        <div className="mb-4">
                                            {product.priceTiers && product.priceTiers.length > 0 ? (
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-sm text-slate-500">From</span>
                                                    <span className="text-lg font-bold text-primary">${product.priceTiers[product.priceTiers.length - 1].price.toFixed(2)}</span>
                                                    <span className="text-sm text-slate-400">/ pc</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-500 italic">Price on Request</span>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                                            <span className="text-slate-500 text-sm font-medium flex items-center gap-1">
                                                <Star size={14} className="text-yellow-400 fill-current" />
                                                4.8
                                            </span>
                                            <Link
                                                to={`/products/${product._id}`}
                                                className="text-primary font-bold hover:text-accent transition-colors flex items-center gap-2 group/link"
                                            >
                                                View Details
                                                <ArrowRight size={18} className="transform group-hover/link:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {pagination.pages > 1 && (
                            <div className="flex justify-center items-center mt-16 gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-full border border-slate-200 text-slate-600 hover:border-accent hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {[...Array(pagination.pages)].map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentPage(idx + 1)}
                                        className={`w-10 h-10 rounded-full font-medium transition-all ${currentPage === idx + 1
                                            ? 'bg-primary text-white shadow-lg transform -translate-y-1'
                                            : 'bg-white text-slate-600 border border-slate-200 hover:border-accent hover:text-accent'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                                    disabled={currentPage === pagination.pages}
                                    className="p-2 rounded-full border border-slate-200 text-slate-600 hover:border-accent hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                ) : !searching ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">No products found</h3>
                        <p className="text-slate-500 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
                        <button
                            onClick={() => { setCategory(''); setSubCategory(''); setSearchTerm(''); setSortBy('newest'); }}
                            className="btn btn-outline border-slate-200 text-slate-600 hover:border-accent hover:text-accent px-8 py-3 rounded-full"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Products;
