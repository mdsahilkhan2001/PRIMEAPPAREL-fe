import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Check,
    PenTool,
    Scissors,
    Truck,
    ArrowRight,
    Package,
    Zap,
    Shield,
    Globe,
    CheckCircle,
    Users,
    TrendingUp
} from 'lucide-react';

/**
 * Services page – Premium B2B wholesale apparel services page
 */
const Services = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Hero images for services page - using local images
    const SERVICES_HERO_IMAGES = [
        '/service-img/ser1.jpg',
        '/service-img/ser2.jpg',
        '/service-img/ser3.jpg'
    ];

    // Cycle through hero images every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SERVICES_HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    /** Hero section */
    const Hero = () => (
        <section
            aria-label="Services Hero"
            className="relative bg-primary text-white min-h-[70vh] flex items-center overflow-hidden"
        >
            {/* Background image slider */}
            <div className="absolute inset-0 z-0">
                {SERVICES_HERO_IMAGES.map((img, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${currentSlide === idx ? 'opacity-60 scale-105' : 'opacity-0 scale-100'
                            }`}
                        style={{ backgroundImage: `url('${img}')` }}
                    />
                ))}
                {/* Simple overlay for text contrast */}
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Hero content */}
            <div className="container-custom relative z-10 w-full pt-20 pb-20">
                <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-tight font-heading font-bold text-white text-center">
                        Our Services
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl leading-relaxed">
                        Comprehensive manufacturing solutions tailored for global fashion brands.
                        From design to delivery, we handle it all.
                    </p>

                    {/* Primary actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/inquiry"
                            className="btn btn-accent rounded-full text-lg px-10 py-4 shadow-xl hover:-translate-y-1 transition"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/products"
                            className="btn btn-outline bg-white/10 text-white border-white/30 rounded-full text-lg px-10 py-4 hover:bg-white hover:text-primary transition"
                        >
                            View Products
                        </Link>
                    </div>

                    {/* Highlights */}
                    <div className="mt-10 sm:mt-14 mb-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 px-4">
                        <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition shadow-lg">
                            <Package size={20} className="text-accent" />
                            <span className="text-sm font-semibold">MOQ from 100 Pieces</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition shadow-lg">
                            <Zap size={20} className="text-accent" />
                            <span className="text-sm font-semibold">Fast Turnaround</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {SERVICES_HERO_IMAGES.map((_, idx) => (
                    <button
                        key={idx}
                        aria-label={`Slide ${idx + 1}`}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'bg-accent w-12' : 'bg-white/40 w-3 hover:bg-white/60'
                            }`}
                    />
                ))}
            </div>
        </section>
    );

    /** Main Services Section */
    const MainServices = () => (
        <section aria-labelledby="services-heading" className="py-28 bg-white">
            <div className="container-custom text-center mb-16">
                <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
                    What We Offer
                </span>
                <h2
                    id="services-heading"
                    className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary"
                >
                    Our Core Services
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                    End-to-end manufacturing solutions designed for your success
                </p>
            </div>

            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {[
                        {
                            title: 'OEM Manufacturing',
                            desc: 'We manufacture your designs with your specifications. Full customization from fabric selection to packaging. Your vision, our expertise.',
                            icon: Scissors,
                            features: ['Custom Designs', 'Fabric Selection', 'Brand Packaging', 'Quality Control']
                        },
                        {
                            title: 'ODM / Private Label',
                            desc: 'Choose from our ready catalogue and add your brand labels. Perfect for quick launches and testing new markets.',
                            icon: PenTool,
                            features: ['Ready Designs', 'Quick Launch', 'Your Branding', 'Flexible MOQ']
                        },
                        {
                            title: 'Small MOQ Production',
                            desc: 'Start small with just 100 pieces per style. Scale up as your brand grows. Ideal for startups and boutiques.',
                            icon: Package,
                            features: ['Low MOQ', 'Scalable', 'Cost-Effective', 'Risk-Free']
                        }
                    ].map((service, idx) => (
                        <div
                            key={idx}
                            className="group bg-slate-50 p-10 rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="bg-gradient-to-br from-accent to-yellow-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <service.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-heading font-bold text-primary mb-4">{service.title}</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">{service.desc}</p>

                            {/* Features list */}
                            <ul className="space-y-2">
                                {service.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-2 text-sm text-slate-700">
                                        <CheckCircle size={16} className="text-accent flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    /** Process Flow Section */
    const ProcessFlow = () => (
        <section aria-labelledby="process-heading" className="py-28 bg-slate-50">
            <div className="container-custom text-center mb-16">
                <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
                    Our Workflow
                </span>
                <h2
                    id="process-heading"
                    className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary"
                >
                    How We Work
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                    A streamlined 4-step process from concept to delivery
                </p>
            </div>

            <div className="container-custom">
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-accent via-yellow-400 to-accent -translate-y-1/2 z-0 opacity-30"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {[
                            {
                                step: '01',
                                title: 'Consultation',
                                desc: 'Share your designs or choose from our catalogue. We discuss specs, fabrics, and timelines.',
                                icon: Users
                            },
                            {
                                step: '02',
                                title: 'Sampling',
                                desc: 'We create a PP sample for your approval. Make revisions until it\'s perfect.',
                                icon: PenTool
                            },
                            {
                                step: '03',
                                title: 'Production',
                                desc: 'Cutting, stitching, finishing with 100% quality control at every stage.',
                                icon: Scissors
                            },
                            {
                                step: '04',
                                title: 'Delivery',
                                desc: 'Global shipping to your doorstep with full tracking and insurance.',
                                icon: Truck
                            },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-2xl hover:-translate-y-2 transition-all group">
                                <div className="bg-gradient-to-br from-accent to-yellow-500 text-primary font-bold text-2xl w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    {item.step}
                                </div>
                                <div className="text-accent flex justify-center mb-4">
                                    <item.icon size={32} />
                                </div>
                                <h4 className="font-heading font-bold text-xl mb-3 text-primary">{item.title}</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );

    /** Additional Services Section */
    const AdditionalServices = () => (
        <section aria-label="Additional Services" className="py-28 bg-white">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image */}
                    <div className="group relative rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1">
                        <img
                            src="/service-img/ser4.jpg"
                            alt="Quality Control"
                            className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    {/* Content */}
                    <div className="order-1 lg:order-2">
                        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
                            Value-Added Services
                        </span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
                            Beyond Manufacturing
                        </h2>
                        <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                            We don't just manufacture – we partner with you for long-term success. Our comprehensive services ensure your products stand out in the global market.
                        </p>

                        <div className="space-y-4">
                            {[
                                { title: 'Quality Assurance', desc: '100% inspection before shipping' },
                                { title: 'Custom Packaging', desc: 'Brand-ready boxes and poly bags' },
                                { title: 'Global Logistics', desc: 'Door-to-door shipping worldwide' },
                                { title: 'Trend Consultation', desc: 'Stay ahead with market insights' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                                    <Shield size={24} className="text-accent flex-shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-lg text-primary mb-1">{item.title}</h4>
                                        <p className="text-slate-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    /** CTA Section */
    const CTA = () => (
        <section aria-label="Call to Action" className="py-28 bg-primary relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-yellow-200" />
            </div>

            <div className="container-custom relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
                    Ready to Start <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">
                        Production?
                    </span>
                </h2>
                <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
                    Join hundreds of brands worldwide who trust us with their manufacturing. Let's create something amazing together.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/inquiry"
                        className="btn bg-accent hover:bg-accent/90 text-white rounded-full text-lg px-10 py-4 shadow-xl hover:-translate-y-1 transition flex items-center gap-2 justify-center"
                    >
                        Request Quote <ArrowRight size={20} />
                    </Link>
                    <Link
                        to="/contact"
                        className="btn bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-full text-lg px-10 py-4 transition"
                    >
                        Contact Us
                    </Link>
                </div>

                {/* Trust badges */}
                <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6">
                    <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
                        <TrendingUp size={20} className="text-accent" />
                        <span className="text-sm font-semibold text-white">500+ Happy Clients</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
                        <Globe size={20} className="text-accent" />
                        <span className="text-sm font-semibold text-white">Worldwide Delivery</span>
                    </div>
                </div>
            </div>
        </section>
    );

    return (
        <div className="min-h-screen font-sans text-slate-900 overflow-x-hidden">
            <Hero />
            <MainServices />
            <ProcessFlow />
            <AdditionalServices />
            <CTA />
        </div>
    );
};

export default Services;
