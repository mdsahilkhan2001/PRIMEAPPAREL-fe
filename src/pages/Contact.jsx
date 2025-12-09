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
    AlertCircle
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
        countryCode: '+91',
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

    // Form submission state
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

    // API URL - direct axios usage since we don't have a contact slice
    // Use relative path to leverage Vite proxy in development (avoids CORS/Network errors)
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
                                <div>
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
                                            {/* Popular Countries First */}
                                            <option value="+91">🇮🇳 India +91</option>
                                            <option value="+971">🇦🇪 UAE +971</option>
                                            <option value="+44">🇬🇧 UK +44</option>
                                            <option value="+1">🇺🇸 USA +1</option>
                                            <option value="+61">🇦🇺 Australia +61</option>
                                            <option value="+7">🇷🇺 Russia +7</option>

                                            {/* Middle East */}
                                            <option value="+966">🇸🇦 Saudi Arabia +966</option>
                                            <option value="+974">🇶🇦 Qatar +974</option>
                                            <option value="+968">🇴🇲 Oman +968</option>
                                            <option value="+965">🇰🇼 Kuwait +965</option>
                                            <option value="+973">🇧🇭 Bahrain +973</option>
                                            <option value="+962">🇯🇴 Jordan +962</option>
                                            <option value="+961">🇱🇧 Lebanon +961</option>
                                            <option value="+90">🇹🇷 Turkey +90</option>

                                            {/* Europe */}
                                            <option value="+33">🇫🇷 France +33</option>
                                            <option value="+49">🇩🇪 Germany +49</option>
                                            <option value="+39">🇮🇹 Italy +39</option>
                                            <option value="+34">🇪🇸 Spain +34</option>
                                            <option value="+31">🇳🇱 Netherlands +31</option>
                                            <option value="+41">🇨🇭 Switzerland +41</option>
                                            <option value="+43">🇦🇹 Austria +43</option>
                                            <option value="+32">🇧🇪 Belgium +32</option>

                                            {/* Asia Pacific */}
                                            <option value="+86">🇨🇳 China +86</option>
                                            <option value="+81">🇯🇵 Japan +81</option>
                                            <option value="+82">🇰🇷 South Korea +82</option>
                                            <option value="+65">🇸🇬 Singapore +65</option>
                                            <option value="+60">🇲🇾 Malaysia +60</option>
                                            <option value="+66">🇹🇭 Thailand +66</option>
                                            <option value="+84">🇻🇳 Vietnam +84</option>
                                            <option value="+63">🇵🇭 Philippines +63</option>
                                            <option value="+62">🇮🇩 Indonesia +62</option>

                                            {/* South Asia */}
                                            <option value="+92">🇵🇰 Pakistan +92</option>
                                            <option value="+880">🇧🇩 Bangladesh +880</option>
                                            <option value="+94">🇱🇰 Sri Lanka +94</option>
                                            <option value="+977">🇳🇵 Nepal +977</option>

                                            {/* Africa */}
                                            <option value="+27">🇿🇦 South Africa +27</option>
                                            <option value="+20">🇪🇬 Egypt +20</option>
                                            <option value="+234">🇳🇬 Nigeria +234</option>
                                            <option value="+254">🇰🇪 Kenya +254</option>

                                            {/* Americas */}
                                            <option value="+1">🇨🇦 Canada +1</option>
                                            <option value="+52">🇲🇽 Mexico +52</option>
                                            <option value="+55">🇧🇷 Brazil +55</option>
                                            <option value="+54">🇦🇷 Argentina +54</option>
                                        </select>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className={`flex-1 px-4 py-3 rounded-xl border-2 outline-none transition-all ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20'
                                                }`}
                                            placeholder="1234567890"
                                            pattern="[0-9]{6,15}"
                                            title="Please enter a valid phone number (6-15 digits)"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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
                                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${errors.subject ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20'
                                            }`}
                                        placeholder="Bulk Order Inquiry"
                                    />
                                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
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
                                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all resize-none ${errors.message ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20'
                                            }`}
                                        placeholder="Tell us about your requirements..."
                                    ></textarea>
                                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
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
