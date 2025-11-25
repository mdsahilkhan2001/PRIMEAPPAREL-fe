import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-primary text-slate-300 pt-20 pb-10 border-t-4 border-accent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <h3 className="text-white text-2xl font-heading font-bold tracking-wide">
                                PRIME<span className="text-accent">APPAREL</span>
                            </h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Premium wholesale garment manufacturer specializing in fashion export. Delivering quality craftsmanship and trend-setting designs since 2003.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4 pt-2">
                            {[Facebook, Instagram, Linkedin].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-primary-light border border-slate-700 hover:bg-accent hover:border-accent text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-heading font-semibold mb-6 text-lg relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
                        </h4>
                        <ul className="space-y-3">
                            {['Home', 'About', 'Products', 'Services', 'Contact'].map(item => (
                                <li key={item}>
                                    <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-slate-400 hover:text-accent transition-colors text-sm flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="text-white font-heading font-semibold mb-6 text-lg relative inline-block">
                            Our Collections
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
                        </h4>
                        <ul className="space-y-3">
                            {['Kaftans', 'Abaya', 'Resort Wear', 'Kimonos', 'Coord Sets'].map(item => (
                                <li key={item}>
                                    <Link to="/products" className="text-slate-400 hover:text-accent transition-colors text-sm flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-heading font-semibold mb-6 text-lg relative inline-block">
                            Contact Us
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
                        </h4>
                        <div className="space-y-5">
                            <div className="flex items-start space-x-4 group">
                                <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors">
                                    <MapPin size={20} className="text-accent" />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium mb-1">Head Office</p>
                                    <span className="text-slate-400 text-sm leading-relaxed block">
                                        Industrial Area, Textile Zone,<br />Ahmedabad, Gujarat, India
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 group">
                                <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors">
                                    <Phone size={20} className="text-accent" />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium mb-1">Phone</p>
                                    <span className="text-slate-400 text-sm">+91 98765 43210</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 group">
                                <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors">
                                    <Mail size={20} className="text-accent" />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium mb-1">Email</p>
                                    <span className="text-slate-400 text-sm">hello@primeapparel.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} Prime Apparel. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link to="/privacy" className="text-slate-500 hover:text-accent text-sm transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-slate-500 hover:text-accent text-sm transition-colors">Terms of Service</Link>
                        <Link to="/sitemap" className="text-slate-500 hover:text-accent text-sm transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
