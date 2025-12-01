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
  Users,
  Package,
  TrendingUp,
  Star,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  MessageSquare,
  Settings,
  Factory
} from 'lucide-react';
import axios from 'axios';
import { HERO_IMAGES } from '../constants/heroImages';
import { TESTIMONIALS, FEATURED_CATEGORIES } from '../constants/testimonials';

/**
 * Home page – premium B2B wholesale apparel landing page.
 */
const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [counters, setCounters] = useState({ years: 0, products: 0, countries: 0, clients: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [categoryImages, setCategoryImages] = useState([]);
  const statsRef = useRef(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        // API now returns {products: [], pagination: {}} instead of plain array
        const productsArray = data.products || data;
        setProducts(productsArray.slice(0, 3));
        // Use 6 products for category backgrounds (or reuse if less)
        const categoryBgs = productsArray.slice(0, 6).map(p =>
          p.images && p.images[0] ? `http://localhost:5000${encodeURI(p.images[0])}` : null
        );
        // Fill remaining slots if we have less than 6 products
        while (categoryBgs.length < 6 && categoryBgs.length > 0) {
          categoryBgs.push(categoryBgs[categoryBgs.length % productsArray.length]);
        }
        setCategoryImages(categoryBgs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Cycle through hero images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Animated counter for statistics
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const targets = { years: 15, products: 5000, countries: 45, clients: 1200 };
          const duration = 2000; // 2 seconds
          const steps = 60;
          const stepDuration = duration / steps;

          let currentStep = 0;
          const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setCounters({
              years: Math.floor(targets.years * progress),
              products: Math.floor(targets.products * progress),
              countries: Math.floor(targets.countries * progress),
              clients: Math.floor(targets.clients * progress)
            });

            if (currentStep >= steps) {
              setCounters(targets);
              clearInterval(timer);
            }
          }, stepDuration);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  /** Hero section */
  const Hero = () => (
    <section
      aria-label="Hero"
      className="relative bg-gradient-to-br from-white via-orange-50/30 to-amber-50/40 text-slate-900 min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image slider */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${currentSlide === idx ? 'opacity-30' : 'opacity-0'
              }`}
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}
      </div>

      {/* Hero content */}
      <div className="container-custom relative z-10 w-full pt-20 pb-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-tight">
            Premium Apparel <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-600">
              Manufacturing
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl leading-relaxed">
            From Kaftans to Resort Wear – We manufacture high‑quality garments with MOQs starting
            from just 100 pieces.
          </p>

          {/* Primary actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/inquiry"
              className="btn btn-accent rounded-full text-lg px-10 py-4 hover:-translate-y-1 transition shadow-lg shadow-accent/20"
            >
              Request Quote
            </Link>
            <Link
              to="/products"
              className="btn btn-outline bg-primary/5 text-primary border-primary/20 rounded-full text-lg px-10 py-4 hover:bg-primary hover:text-white transition"
            >
              Browse Collections
            </Link>
          </div>

          {/* Highlights – badges */}
          <div className="mt-10 sm:mt-14 mb-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 px-4">
            <div className="flex items-center gap-3 bg-white/80 px-6 py-3 rounded-full backdrop-blur-md border border-primary/10 hover:bg-white transition">
              <CheckCircle size={20} className="text-accent" />
              <span className="text-sm font-semibold text-slate-700">Verified Manufacturer</span>
            </div>
            <div className="flex items-center gap-3 bg-white/80 px-6 py-3 rounded-full backdrop-blur-md border border-primary/10 hover:bg-white transition">
              <Globe size={20} className="text-accent" />
              <span className="text-sm font-semibold text-slate-700">Global Shipping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Slide ${idx + 1}`}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'bg-accent w-12' : 'bg-slate-400 w-3 hover:bg-slate-500'
              }`}
          />
        ))}
      </div>
    </section>
  );

  /** Statistics section */
  const Statistics = () => (
    <section ref={statsRef} className="py-20 bg-gradient-to-br from-primary via-primary-dark to-primary text-white">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold mb-2 text-accent">{counters.years}+</div>
            <div className="text-sm md:text-base text-slate-300">Years in Business</div>
          </div>
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold mb-2 text-accent">{counters.products.toLocaleString()}+</div>
            <div className="text-sm md:text-base text-slate-300">Products Manufactured</div>
          </div>
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold mb-2 text-accent">{counters.countries}+</div>
            <div className="text-sm md:text-base text-slate-300">Countries Served</div>
          </div>
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold mb-2 text-accent">{counters.clients.toLocaleString()}+</div>
            <div className="text-sm md:text-base text-slate-300">Happy Clients</div>
          </div>
        </div>
      </div>
    </section>
  );

  /** Why Choose Us section */
  const WhyChooseUs = () => {
    const benefits = [
      {
        icon: Package,
        title: "Low MOQ",
        description: "Start with just 100 pieces – perfect for small and growing businesses"
      },
      {
        icon: Zap,
        title: "Fast Production",
        description: "Quick turnaround times without compromising on quality"
      },
      {
        icon: Shield,
        title: "Quality Assurance",
        description: "Rigorous quality control at every stage of production"
      },
      {
        icon: Truck,
        title: "Global Shipping",
        description: "Reliable worldwide delivery to 45+ countries"
      },
      {
        icon: Palette,
        title: "Full Customization",
        description: "Bring your designs to life with our expert team"
      },
      {
        icon: Leaf,
        title: "Eco-Friendly",
        description: "Sustainable practices and eco-conscious materials"
      }
    ];

    return (
      <section className="py-28 bg-gradient-to-br from-slate-50 to-white">
        <div className="container-custom text-center mb-16">
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
            Why Partner With Us
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
            Your Trusted Manufacturing Partner
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            We combine quality craftsmanship with flexible solutions to help your business thrive
          </p>
        </div>

        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-card transition-all duration-300 border border-slate-100 group hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  /** Featured Categories section */
  const FeaturedCategories = () => (
    <section className="py-28 bg-white">
      <div className="container-custom text-center mb-16">
        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
          Product Categories
        </span>
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
          Explore Our Collections
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Discover premium apparel designed for the global market
        </p>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_CATEGORIES.map((category, idx) => (
            <Link
              key={category.id}
              to={category.link}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Background Image */}
              {categoryImages[idx] ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${categoryImages[idx]}')` }}
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`} />
              )}

              {/* Gradient Overlay for text readability */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-75 group-hover:opacity-70 transition-opacity`} />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 relative z-10">
                <h3 className="text-2xl font-heading font-bold mb-2 group-hover:scale-110 transition-transform drop-shadow-lg">
                  {category.name}
                </h3>
                <p className="text-white/95 mb-4 drop-shadow-md">{category.description}</p>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-semibold">Explore</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

  /** How It Works section */
  const HowItWorks = () => {
    const steps = [
      {
        number: "01",
        icon: FileSearch,
        title: "Browse & Discover",
        description: "Explore our extensive catalog of premium apparel designs and styles"
      },
      {
        number: "02",
        icon: MessageSquare,
        title: "Send Inquiry",
        description: "Contact us with your requirements, quantities, and customization needs"
      },
      {
        number: "03",
        icon: Settings,
        title: "Customize & Approve",
        description: "Work with our team to finalize designs, materials, and specifications"
      },
      {
        number: "04",
        icon: Factory,
        title: "Production & Delivery",
        description: "We manufacture your order with precision and ship worldwide"
      }
    ];

    return (
      <section className="py-28 bg-gradient-to-br from-slate-50 to-orange-50/30">
        <div className="container-custom text-center mb-16">
          <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
            How It Works
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            From concept to delivery in four straightforward steps
          </p>
        </div>

        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection line for desktop */}
            <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-accent/20 via-accent to-accent/20" />

            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-card transition-all duration-300 border-2 border-slate-100 hover:border-accent/20 group">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-accent to-yellow-500 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform relative z-10">
                      <step.icon size={32} className="text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 text-7xl font-bold text-accent/10 group-hover:text-accent/20 transition-colors">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3 text-center">{step.title}</h3>
                  <p className="text-slate-600 text-center leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  /** Collections section */
  const Collections = () => (
    <section aria-labelledby="collections-heading" className="py-28 bg-white">
      <div className="container-custom text-center mb-16">
        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
          Our Expertise
        </span>
        <h2
          id="collections-heading"
          className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary"
        >
          Latest Collections
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Explore our signature styles, crafted with precision and designed for the modern global market
        </p>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {loading ? (
            <div className="col-span-3 text-center py-10">Loading collections...</div>
          ) : (
            products.map((product) => (
              <Link
                to={`/products/${product._id}`}
                key={product._id}
                className="group relative h-[320px] md:h-[380px] lg:h-[420px] rounded-3xl overflow-hidden transition-all block bg-gradient-to-br from-slate-100 to-slate-200 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Image container with object-fit contain to prevent cropping */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={
                      product.images && product.images[0]
                        ? `http://localhost:5000${encodeURI(product.images[0])}`
                        : 'https://via.placeholder.com/800x600?text=No+Image'
                    }
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-3xl text-white font-heading font-bold mb-4">
                    {product.name}
                  </h3>
                  <div className="flex items-center text-accent opacity-0 group-hover:opacity-100 transition">
                    <span className="mr-2 font-bold">View Details</span>
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 btn btn-outline border-primary/20 text-primary hover:bg-primary hover:text-white rounded-full px-8 py-3 font-semibold transition-all hover:-translate-y-1"
          >
            View All Products
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );

  /** Testimonials section */
  const Testimonials = () => (
    <section className="py-28 bg-gradient-to-br from-primary via-primary-dark to-primary text-white overflow-hidden">
      <div className="container-custom text-center mb-16">
        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
          Client Success Stories
        </span>
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
          What Our Clients Say
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg">
          Trusted by businesses worldwide for quality and reliability
        </p>
      </div>

      <div className="container-custom max-w-4xl relative">
        {/* Testimonial Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 min-h-[300px] flex flex-col justify-between">
          <div>
            <div className="flex gap-1 mb-6 justify-center">
              {[...Array(TESTIMONIALS[testimonialIndex].rating)].map((_, i) => (
                <Star key={i} size={24} className="fill-accent text-accent" />
              ))}
            </div>

            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed italic text-center">
              "{TESTIMONIALS[testimonialIndex].message}"
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
              {TESTIMONIALS[testimonialIndex].image}
            </div>
            <div className="text-left">
              <div className="font-bold text-lg text-white">{TESTIMONIALS[testimonialIndex].name}</div>
              <div className="text-sm text-slate-300">{TESTIMONIALS[testimonialIndex].company}</div>
              <div className="text-xs text-slate-400">{TESTIMONIALS[testimonialIndex].location}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition border border-white/20"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="flex gap-2">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTestimonialIndex(idx)}
                className={`h-2 rounded-full transition-all ${idx === testimonialIndex ? 'bg-accent w-8' : 'bg-white/30 w-2 hover:bg-white/50'
                  }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length)}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition border border-white/20"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );

  /** Trust Badges section */
  const TrustBadges = () => (
    <section className="py-20 bg-white border-y border-slate-200">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-primary mb-2">Trusted & Certified</h3>
          <p className="text-slate-600">Industry-leading standards and partnerships</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
          <div className="flex items-center gap-2">
            <Shield size={32} className="text-primary" />
            <span className="font-semibold text-slate-700">ISO Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={32} className="text-primary" />
            <span className="font-semibold text-slate-700">Quality Assured</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf size={32} className="text-green-600" />
            <span className="font-semibold text-slate-700">Eco-Friendly</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={32} className="text-primary" />
            <span className="font-semibold text-slate-700">Global Partner</span>
          </div>
        </div>
      </div>
    </section>
  );

  /** Final CTA section */
  const FinalCTA = () => (
    <section className="py-28 bg-gradient-to-br from-accent via-orange-500 to-yellow-500 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container-custom text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
          Ready to Start Your Order?
        </h2>
        <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto">
          Join 1,200+ satisfied clients worldwide. Let's bring your apparel vision to life.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/inquiry"
            className="inline-flex items-center gap-2 bg-white text-accent px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all hover:-translate-y-1 shadow-2xl"
          >
            Request a Quote
            <ArrowRight size={24} />
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-accent transition-all hover:-translate-y-1"
          >
            Browse Products
          </Link>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/90">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} />
            <span>Low MOQ (100 pcs)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={20} />
            <span>Fast Turnaround</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={20} />
            <span>Global Shipping</span>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen font-sans text-slate-900 overflow-x-hidden">
      <Hero />
      <Statistics />
      <WhyChooseUs />
      <FeaturedCategories />
      <HowItWorks />
      <Collections />
      <Testimonials />
      <TrustBadges />
      <FinalCTA />
    </div>
  );
};

export default Home;
