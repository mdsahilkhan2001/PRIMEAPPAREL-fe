import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('cat') || 'all';
    const [filter, setFilter] = useState(initialCategory);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('/api/products');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.category.toLowerCase().includes(filter.toLowerCase()) || p.subCategory.toLowerCase().includes(filter.toLowerCase()));

    const categories = [
        { id: 'all', label: 'All Collections' },
        { id: 'kaftan', label: 'Kaftans' },
        { id: 'beachwear', label: 'Beachwear' },
        { id: 'resort', label: 'Resort Wear' },
        { id: 'loungewear', label: 'Loungewear' },
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-secondary">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-secondary pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-accent font-semibold tracking-wider uppercase text-sm">Wholesale Catalog</span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mt-2 mb-4">Curated Excellence</h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        Discover our latest designs available for wholesale manufacturing. From concept to creation, we deliver quality.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${filter === cat.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 transform -translate-y-0.5'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-accent hover:text-accent'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product) => (
                            <div key={product._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-card transition-all duration-300 border border-slate-100">
                                <div className="relative h-[400px] overflow-hidden bg-gray-100">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <Link
                                            to={`/products/${product._id}`}
                                            className="bg-white text-primary px-8 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-accent hover:text-white shadow-lg"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                    {/* Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                            MOQ: {product.moq}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="text-xs text-accent font-semibold uppercase tracking-wider mb-1">{product.subCategory}</div>
                                    <Link to={`/products/${product._id}`}>
                                        <h3 className="text-xl font-heading font-bold text-primary mb-2 group-hover:text-accent transition-colors truncate">{product.name}</h3>
                                    </Link>
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                                        <span className="text-slate-500 text-sm">Wholesale Price</span>
                                        <span className="text-primary font-bold">Inquire Now</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-slate-500">No products found in this category.</p>
                        <button
                            onClick={() => setFilter('all')}
                            className="mt-4 text-accent hover:text-accent-hover font-medium underline"
                        >
                            View all products
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
