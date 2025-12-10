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
    ArrowRight,
    AlertCircle,
    Building2,
    Briefcase
} from 'lucide-react';

/**
 * Contact page – Premium B2B wholesale apparel contact page with enterprise fields
 */
const Contact = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [formData, setFormData] = useState({
        // Basic Info
        name: '',
        email: '',
        phone: '',
        countryCode: '+91',

        // Enterprise Info
        companyName: '',
        companyWebsite: '',
        industry: '',
        companySize: '',

        // Inquiry Details
        inquiryType: 'General Inquiry',
        orderVolume: '',
        preferredContactMethod: [],
        timeline: '',
        referralSource: '',

        // Message
        subject: '',
        message: ''
    });

    // Form validation state
    const [errors, setErrors] = useState({});

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

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone Number is required';
        } else if (!/^[0-9]{6,15}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number (6-15 digits)';
        }

        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        if (!formData.message.trim()) newErrors.message = 'Message is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Restrict phone input to numbers only
        if (name === 'phone') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setFormData({
                ...formData,
                [name]: numericValue
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            preferredContactMethod: checked
                ? [...prev.preferredContactMethod, value]
                : prev.preferredContactMethod.filter(method => method !== value)
        }));
    };

    // Form submission state
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

    // API URL
    const API_URL = '/api';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setSubmitStatus({ success: false, message: 'Please fix the errors in the form' });
            return;
        }

        setSubmitting(true);
        setSubmitStatus({ success: false, message: '' });

        try {
            const response = await fetch(`${API_URL}/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus({ success: true, message: 'Message sent successfully! We will get back to you shortly.' });
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    countryCode: '+91',
                    companyName: '',
                    companyWebsite: '',
                    industry: '',
                    companySize: '',
                    inquiryType: 'General Inquiry',
                    orderVolume: '',
                    preferredContactMethod: [],
                    timeline: '',
                    referralSource: '',
                    subject: '',
                    message: ''
                });
                setErrors({});
            } else {
                setSubmitStatus({ success: false, message: data.error || 'Something went wrong. Please try again.' });
            }
        } catch (error) {
            setSubmitStatus({ success: false, message: 'Network error. Please try again later.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen font-sans text-slate-900 overflow-x-hidden">
            <section className="py-16 md:py-28 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-10 md:mb-16">
                        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
                            Get In Touch
                        </span>
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 md:mb-6 text-primary">
                            Contact Information
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg">
                            Reach out through any channel that works best for you
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {/* Email */}
                        <div className="group bg-slate-50 p-6 md:p-10 rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-accent to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Mail size={24} className="text-white md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-heading font-bold text-primary mb-3 md:mb-4">Email Us</h3>
                            <p className="text-slate-600 mb-4 text-sm md:text-base">Quick response within 24 hours</p>
                            <a href="mailto:exports@primeapparel.com" className="text-accent hover:text-accent/80 font-semibold block mb-2 break-all md:break-words">
                                info@primeapparelexports.com
                            </a>
                        </div>

                        {/* Phone */}
                        <div className="group bg-slate-50 p-6 md:p-10 rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-accent to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Phone size={24} className="text-white md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-heading font-bold text-primary mb-3 md:mb-4">Call Us</h3>
                            <p className="text-slate-600 mb-4 text-sm md:text-base">Mon-Sat, 9am - 6pm IST</p>
                            <a href="tel:+919876543210" className="text-accent hover:text-accent/80 font-semibold block text-lg md:text-xl">
                                +91 90000 12345
                            </a>
                            <p className="text-slate-500 text-sm mt-2">We speak English, Hindi, and more</p>
                        </div>

                        {/* Location */}
                        <div className="group bg-slate-50 p-6 md:p-10 rounded-3xl shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-accent to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <MapPin size={24} className="text-white md:w-8 md:h-8" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-heading font-bold text-primary mb-3 md:mb-4">Visit Factory</h3>
                            <p className="text-slate-600 mb-4 text-sm md:text-base">Factory tours by appointment</p>
                            <p className="text-accent hover:text-accent/80 font-semibold block mb-2 break-all md:break-words">
                                Minara Masjid, Mohammad Ali Road,<br /> Mumbai – 400003
                                <br />Factory: Sion, Mumbai
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-28 bg-slate-50">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
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
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        <Briefcase size={20} className="text-accent" />
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20'
                                                    }`}
                                                placeholder="John Doe"
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
                                                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20'
                                                    }`}
                                                placeholder="john@example.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>
                                    </div>

                                    {/* Phone Number with Country Code */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                name="countryCode"
                                                value={formData.countryCode}
                                                onChange={handleInputChange}
                                                className="w-32 px-2 py-3 rounded-xl border-2 border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all text-sm font-medium"
                                            >
                                                <option value="+91">🇮🇳 +91</option>
                                                <option value="+971">🇦🇪 +971</option>
                                                <option value="+44">🇬🇧 +44</option>
                                                <option value="+1">🇺🇸 +1</option>
                                                <option value="+61">🇦🇺 +61</option>
                                                <option value="+86">🇨🇳 +86</option>
                                                <option value="+81">🇯🇵 +81</option>
                                                <option value="+82">🇰🇷 +82</option>
                                                <option value="+65">🇸🇬 +65</option>
                                            </select>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`flex-1 px-4 py-3 rounded-xl border-2 outline-none transition-all ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20'
                                                    }`}
                                                placeholder="1234567890"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                </div>

                                {/* Company Information */}
                                <div className="pt-4 border-t border-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        <Building2 size={20} className="text-accent" />
                                        Company Information (Optional)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                                placeholder="Your Company Ltd."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Company Website
                                            </label>
                                            <input
                                                type="url"
                                                name="companyWebsite"
                                                value={formData.companyWebsite}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                                placeholder="www.example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Industry
                                            </label>
                                            <select
                                                name="industry"
                                                value={formData.industry}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                            >
                                                <option value="">Select Industry</option>
                                                <option value="Retail">Retail</option>
                                                <option value="Wholesale">Wholesale</option>
                                                <option value="E-commerce">E-commerce</option>
                                                <option value="Fashion Brand">Fashion Brand</option>
                                                <option value="Manufacturing">Manufacturing</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Company Size
                                            </label>
                                            <select
                                                name="companySize"
                                                value={formData.companySize}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                            >
                                                <option value="">Select Size</option>
                                                <option value="1-10">1-10 employees</option>
                                                <option value="11-50">11-50 employees</option>
                                                <option value="51-200">51-200 employees</option>
                                                <option value="201-500">201-500 employees</option>
                                                <option value="500+">500+ employees</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Inquiry Details */}
                                <div className="pt-4 border-t border-slate-200">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Inquiry Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Inquiry Type
                                            </label>
                                            <select
                                                name="inquiryType"
                                                value={formData.inquiryType}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                            >
                                                <option value="General Inquiry">General Inquiry</option>
                                                <option value="Bulk Order Request">Bulk Order Request</option>
                                                <option value="Partnership Opportunity">Partnership Opportunity</option>
                                                <option value="Sample Request">Sample Request</option>
                                                <option value="Custom Manufacturing (OEM/ODM)">Custom Manufacturing (OEM/ODM)</option>
                                                <option value="Pricing Information">Pricing Information</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Timeline
                                            </label>
                                            <select
                                                name="timeline"
                                                value={formData.timeline}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                            >
                                                <option value="">Select Timeline</option>
                                                <option value="Urgent">Urgent</option>
                                                <option value="Within 1 week">Within 1 week</option>
                                                <option value="Within 1 month">Within 1 month</option>
                                                <option value="Just exploring">Just exploring</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Expected Order Volume (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="orderVolume"
                                            value={formData.orderVolume}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                            placeholder="e.g., 500 units per month"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Preferred Contact Method
                                        </label>
                                        <div className="flex flex-wrap gap-4">
                                            {['email', 'phone', 'whatsapp'].map((method) => (
                                                <label key={method} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        value={method}
                                                        checked={formData.preferredContactMethod.includes(method)}
                                                        onChange={handleCheckboxChange}
                                                        className="w-4 h-4 text-accent border-slate-300 rounded focus:ring-accent"
                                                    />
                                                    <span className="text-sm text-slate-700 capitalize">{method}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            How did you hear about us?
                                        </label>
                                        <select
                                            name="referralSource"
                                            value={formData.referralSource}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                                        >
                                            <option value="">Select Source</option>
                                            <option value="Google Search">Google Search</option>
                                            <option value="Social Media">Social Media</option>
                                            <option value="Referral">Referral</option>
                                            <option value="Trade Show">Trade Show</option>
                                            <option value="Advertisement">Advertisement</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="pt-4 border-t border-slate-200">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${errors.subject ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20'
                                                }`}
                                            placeholder="Bulk Order Inquiry"
                                        />
                                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows="5"
                                            className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none ${errors.message ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20'
                                                }`}
                                            placeholder="Tell us about your requirements..."
                                        ></textarea>
                                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`w-full bg-gradient-to-r from-accent to-yellow-500 text-white font-bold py-4 rounded-xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {submitting ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Send Message
                                        </>
                                    )}
                                </button>

                                {submitStatus.message && (
                                    <div className={`p-4 rounded-xl ${submitStatus.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                        <p className="flex items-center gap-2">
                                            {submitStatus.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                            {submitStatus.message}
                                        </p>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

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
        </div>
    );
};

export default Contact;
