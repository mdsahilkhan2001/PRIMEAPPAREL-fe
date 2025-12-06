import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Globe,
  Award,
  Zap,
  Shield,
  Truck,
  Palette,
  Leaf,
  Star,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';
import { useGetProductsQuery } from '../redux/slices/apiSlice';
import { HERO_IMAGES } from '../constants/heroImages';
import { TESTIMONIALS, FEATURED_CATEGORIES } from '../constants/testimonials';
import { getImageUrl } from '../config';

/**
 * Home page – Premium B2B Wholesale Apparel
 * Redesigned for a high-end, editorial aesthetic.
 */

const Hero = ({ currentSlide, setCurrentSlide, isVisible }) => (
  <section className="relative h-screen w-full overflow-hidden bg-primary">
    {/* Background Slider */}
    <div className="absolute inset-0 z-0">
      {HERO_IMAGES.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-[200ms] ease-in-out ${currentSlide === idx ? 'opacity-60 scale-105' : 'opacity-0 scale-100'
            }`}
          style={{ backgroundImage: `url('${img}')` }}
        />
      ))}
      <div className="absolute inset-0 bg-black/30" /> {/* Overlay for text contrast */}
    </div>

    {/* Content */}
    <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6">
      <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs md:text-sm font-medium tracking-[0.2em] text-white uppercase mb-6 backdrop-blur-sm">
          Est. 2010 • Global Manufacturer
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-6 leading-tight tracking-tight">
          Elegance in <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Every Stitch
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Premium wholesale apparel manufacturing for brands that demand excellence.
          From concept to creation, we bring your vision to life.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link
            to="/products"
            className="group relative px-8 py-4 bg-white text-primary font-bold text-sm uppercase tracking-widest overflow-hidden transition-all hover:bg-accent hover:text-white"
          >
            <span className="relative z-10">View Collection</span>
          </Link>
          <Link
            to="/inquiry"
            className="group flex items-center gap-3 px-8 py-4 border border-white/40 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            <span>Get Quote</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>

    {/* Slide Indicators */}
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
      {HERO_IMAGES.map((_, idx) => (
        <button
          key={idx}
          onClick={() => setCurrentSlide(idx)}
          className={`h-[2px] transition-all duration-500 ${currentSlide === idx ? 'bg-white w-12' : 'bg-white/30 w-6 hover:bg-white/60'
            }`}
          aria-label={`Go to slide ${idx + 1}`}
        />
      ))}
    </div>
  </section>
);

// Editorial Category Grid
const CategoryGrid = ({ categoryImages }) => (
  <section className="py-24 bg-white">
    <div className="container-custom">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Curated Categories</h2>
        <div className="w-20 h-1 bg-accent mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {FEATURED_CATEGORIES.slice(0, 3).map((cat, idx) => (
          <Link
            to={cat.link}
            key={cat.id}
            className={`group relative overflow-hidden h-[400px] md:h-[500px] ${idx === 1 ? 'md:-mt-12' : '' // Staggered effect
              }`}
          >
            <div className="absolute inset-0 bg-gray-200">
              {/* Category Image */}
              {categoryImages[idx] ? (
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${categoryImages[idx]}')` }}
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${cat.color} opacity-80`} />
              )}
            </div>

            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
              <h3 className="text-3xl font-heading font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {cat.name}
              </h3>
              <p className="text-white/80 text-sm mb-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                {cat.description}
              </p>
              <div className="flex items-center gap-2 text-white text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <span>Explore</span>
                <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

// Minimalist Product Showcase
const NewArrivals = ({ loading, products }) => (
  <section className="py-24 bg-secondary/30">
    <div className="container-custom">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <span className="text-accent font-bold tracking-widest uppercase text-xs mb-2 block">New Season</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">Latest Arrivals</h2>
        </div>
        <Link to="/products" className="group flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors">
          View All Products
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-[400px] w-full mb-4" />
              <div className="h-4 bg-gray-200 w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 w-1/2" />
            </div>
          ))
        ) : (
          products.slice(0, 4).map((product) => (
            <Link to={`/products/${product._id}`} key={product._id} className="group block">
              <div className="relative h-[450px] overflow-hidden bg-white mb-4">
                <img
                  src={getImageUrl(product.images?.[0])}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                {/* Quick Action */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full bg-white text-primary py-3 font-medium text-sm uppercase tracking-wide hover:bg-primary hover:text-white transition-colors shadow-lg">
                    View Details
                  </button>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-heading font-medium text-primary mb-1 group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-500">
                  MOQ: {product.moq} pcs
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  </section>
);

// Features / Why Choose Us
const Features = () => (
  <section className="py-24 bg-primary text-white">
    <div className="container-custom">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
        <div className="px-4 py-4">
          <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 text-accent">
            <Globe size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Global Shipping</h3>
          <p className="text-slate-400 leading-relaxed">
            Reliable logistics partners ensuring your products reach over 45 countries safely and on time.
          </p>
        </div>
        <div className="px-4 py-4">
          <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 text-accent">
            <Award size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
          <p className="text-slate-400 leading-relaxed">
            Rigorous 3-step quality control process. We don't just manufacture; we craft perfection.
          </p>
        </div>
        <div className="px-4 py-4">
          <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 text-accent">
            <Zap size={32} />
          </div>
          <h3 className="text-xl font-bold mb-3">Fast Production</h3>
          <p className="text-slate-400 leading-relaxed">
            Industry-leading turnaround times. From sample to bulk production in as little as 2 weeks.
          </p>
        </div>
      </div>
    </div>
  </section>
);

// Video / Brand Story Section
const BrandStory = () => (
  <section className="relative py-32 bg-gray-100 overflow-hidden">
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070"
        alt="Workshop"
        className="w-full h-full object-cover grayscale opacity-20"
      />
    </div>
    <div className="container-custom relative z-10 text-center">
      <span className="text-accent font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Our Story</span>
      <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-8 max-w-3xl mx-auto">
        Crafting Fashion Since 2010
      </h2>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
        We started with a single sewing machine and a dream. Today, we are the preferred manufacturing partner for global fashion brands, blending traditional craftsmanship with modern technology.
      </p>
      <button className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-full hover:bg-accent transition-colors shadow-xl">
        <Play size={20} className="fill-current" />
        <span className="font-bold tracking-wide uppercase text-sm">Watch Our Process</span>
      </button>
    </div>
  </section>
);

// Newsletter / CTA
const Newsletter = () => (
  <section className="py-24 bg-accent text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
    <div className="container-custom relative z-10 text-center">
      <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Ready to Create?</h2>
      <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
        Join our network of successful brands. Get the latest trends and manufacturing insights delivered to your inbox.
      </p>

      <div className="max-w-md mx-auto flex gap-2 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
        <input
          type="email"
          placeholder="Enter your email address"
          className="flex-1 bg-transparent border-none text-white placeholder-white/60 focus:ring-0 outline-none px-4 py-2"
        />
        <button className="bg-white text-accent px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider hover:bg-slate-100 transition-colors cursor-pointer">
          Subscribe
        </button>
      </div>
    </div>
  </section>
);

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const { data: response, isLoading: loading } = useGetProductsQuery({ page: 1, limit: 12 });
  // RTK Query returns { data: { products: [...], ... } } based on our API response
  const products = response?.products || response?.data || [];

  const [categoryImages, setCategoryImages] = useState([]);

  // Extract category images once products are loaded
  useEffect(() => {
    if (products.length > 0) {
      const catImages = FEATURED_CATEGORIES.map(cat => {
        // Find a product that matches the category (loosely)
        const match = products.find(p =>
          p.category?.toLowerCase().includes(cat.name.split(' ')[0].toLowerCase()) ||
          p.name?.toLowerCase().includes(cat.name.split(' ')[0].toLowerCase())
        );
        return match && match.images && match.images[0] ? getImageUrl(match.images[0]) : null;
      });
      setCategoryImages(catImages);
    }
  }, [products]);

  // Initial animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Hero Slider Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-900">
      <Hero currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} isVisible={isVisible} />
      <CategoryGrid categoryImages={categoryImages} />
      <NewArrivals loading={loading} products={products} />
      <BrandStory />
      <Features />
      <section className="py-24 bg-white">
        <div className="container-custom max-w-4xl text-center">
          <div className="mb-12">
            <Star size={32} className="text-accent fill-current mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-primary">Client Stories</h2>
          </div>

          <div className="relative min-h-[300px]">
            <div className="transition-opacity duration-500">
              <p className="text-2xl md:text-3xl font-heading font-light text-slate-800 mb-8 leading-snug">
                "{TESTIMONIALS[testimonialIndex].message}"
              </p>
              <div>
                <h4 className="text-lg font-bold text-primary">{TESTIMONIALS[testimonialIndex].name}</h4>
                <p className="text-sm text-slate-500 uppercase tracking-wider mt-1">
                  {TESTIMONIALS[testimonialIndex].company} • {TESTIMONIALS[testimonialIndex].location}
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-12">
              <button
                onClick={() => setTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="p-3 rounded-full border border-slate-200 hover:border-accent hover:text-accent transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length)}
                className="p-3 rounded-full border border-slate-200 hover:border-accent hover:text-accent transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>
      <Newsletter />
    </div>
  );
};

export default Home;
