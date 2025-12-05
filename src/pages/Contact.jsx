import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Mail,
    MapPin,
    Phone,
    Clock,
    Send,
    CheckCircle,
    Globe,
    MessageSquare,
    ArrowRight
} from 'lucide-react';

/**
 * Contact page – Premium B2B wholesale apparel contact page
 */
const Contact = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    // Hero images for contact page
    const CONTACT_HERO_IMAGES = [
        'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069'
    ];

    // Cycle through hero images
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % CONTACT_HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    /** Hero section */
    // const Hero = () => (
    //     <section
    //         aria-label="Contact Hero"
    //         className="relative bg-primary text-white min-h-[70vh] flex items-center overflow-hidden"
    //     >
    //         {/* Background image slider */}
    //         <div className="absolute inset-0 z-0">
    //             {CONTACT_HERO_IMAGES.map((img, idx) => (
    //                 <div
    //                     key={idx}
    //                     className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${currentSlide === idx ? 'opacity-60 scale-105' : 'opacity-0 scale-100'
    //                         }`}
    //                     style={{ backgroundImage: `url('${img}')` }}
    //                 />
    //             ))}
    //             {/* Simple overlay for text contrast */}
    //             <div className="absolute inset-0 bg-black/30" />
    //         </div>

    //         {/* Hero content */}
    //         <div className="container-custom relative z-10 w-full pt-20 pb-20">
    //             <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
    //                 <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-tight">
    //                     Let's Connect
    //                 </h1>

    //                 <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl leading-relaxed">
    //                     Have questions about manufacturing, pricing, or partnerships?
    //                     We're here to help turn your vision into reality.
    //                 </p>

    //                 {/* Quick contact highlights */}
    //                 <div className="mt-10 sm:mt-14 mb-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 px-4">
    //                     <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition shadow-lg">
    //                         <Clock size={20} className="text-accent" />
    //                         <span className="text-sm font-semibold">24/7 Support</span>
    //                     </div>
    //                     <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition shadow-lg">
    //                         <Globe size={20} className="text-accent" />
    //                         <span className="text-sm font-semibold">Global Reach</span>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>

    //         {/* Slide indicators */}
    //         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
    //             {CONTACT_HERO_IMAGES.map((_, idx) => (
    //                 <button
    //                     key={idx}
    //                     aria-label={`Slide ${idx + 1}`}
    //                     onClick={() => setCurrentSlide(idx)}
    //                     className={`h-2 rounded-full transition-all ${currentSlide === idx ? 'bg-accent w-12' : 'bg-white/40 w-3 hover:bg-white/60'
    //                         }`}
    //                 />
    //             ))}
    //         </div>
    //     </section>
    // );

    /** Contact Methods Section */
    const ContactMethods = () => (
        <section className="py-28 bg-white">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
                        Get In Touch
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
                        Contact Information
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Reach out through any channel that works best for you
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Email */}
                    <div className="group bg-slate-50 p-10 rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-accent to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <Mail size={32} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-primary mb-4">Email Us</h3>
                        <p className="text-slate-600 mb-4">Quick response within 24 hours</p>
                        <a href="mailto:exports@primeapparel.com" className="text-accent hover:text-accent/80 font-semibold block mb-2">
                            info@primeapparelexports.com
                        </a>
                        <a href="mailto:sales@primeapparel.com" className="text-accent hover:text-accent/80 font-semibold block">
                            sales@primeapparel.com
                        </a>
                    </div>

                    {/* Phone */}
                    <div className="group bg-slate-50 p-10 rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-accent to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <Phone size={32} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-primary mb-4">Call Us</h3>
                        <p className="text-slate-600 mb-4">Mon-Sat, 9am - 6pm IST</p>
                        <a href="tel:+919876543210" className="text-accent hover:text-accent/80 font-semibold block text-xl">
                            +91 90000 12345
                        </a>
                        <p className="text-slate-500 text-sm mt-2">We speak English, Hindi, and more</p>
                    </div>

                    {/* Location */}
                    <div className="group bg-slate-50 p-10 rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-accent to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <MapPin size={32} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-primary mb-4">Visit Factory</h3>
                        <p className="text-slate-600 mb-4">Factory tours by appointment</p>
                        <p className="text-slate-700 font-medium">
                            Minara Masjid, Mohammad Ali Road,<br /> Mumbai – 400003
                            <br />Factory: Sion, Mumbai


                        </p>
                    </div>
                </div>
            </div>
        </section>
    );

    /** Contact Form Section */
    const ContactForm = () => (
        <section className="py-28 bg-slate-50">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Form Content */}
                    <div>
                        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
                            Send a Message
                        </span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
                            Get a Free Quote
                        </h2>
                        <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                            Share your requirements and we'll get back to you with a detailed proposal.
                            Whether it's a small order or bulk production, we're ready to help.
                        </p>

                        <div className="space-y-4">
                            {[
                                { icon: CheckCircle, text: 'Free consultation and quotes' },
                                { icon: CheckCircle, text: 'No obligation estimates' },
                                { icon: CheckCircle, text: 'Quick response time' },
                                { icon: CheckCircle, text: 'Customized solutions' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <item.icon size={14} className="text-accent" />
                                    </div>
                                    <span className="text-slate-700 text-lg">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                    placeholder="Bulk Order Inquiry"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows="5"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                                    placeholder="Tell us about your requirements..."
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-accent to-yellow-500 text-white font-bold py-4 rounded-xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                            >
                                <Send size={20} />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );

    /** CTA Section */
    const CTA = () => (
        <section className="py-28 bg-primary relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-yellow-200" />
            </div>

            <div className="container-custom relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
                    Ready to Start <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">
                        Your Project?
                    </span>
                </h2>
                <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
                    From initial consultation to final delivery, we're with you every step of the way.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/inquiry"
                        className="btn bg-accent hover:bg-accent/90 text-white rounded-full text-lg px-10 py-4 shadow-xl hover:-translate-y-1 transition flex items-center gap-2 justify-center"
                    >
                        Request Quote <ArrowRight size={20} />
                    </Link>
                    <Link
                        to="/products"
                        className="btn bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-full text-lg px-10 py-4 transition"
                    >
                        View Products
                    </Link>
                </div>

                {/* Trust badges */}
                <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6">
                    <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
                        <MessageSquare size={20} className="text-accent" />
                        <span className="text-sm font-semibold text-white">Quick Response</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
                        <Globe size={20} className="text-accent" />
                        <span className="text-sm font-semibold text-white">Worldwide Service</span>
                    </div>
                </div>
            </div>
        </section>
    );

    return (
        <div className="min-h-screen font-sans text-slate-900 overflow-x-hidden">
            {/* <Hero /> */}
            <ContactMethods />
            <ContactForm />
            <CTA />
        </div>
    );
};

export default Contact;
