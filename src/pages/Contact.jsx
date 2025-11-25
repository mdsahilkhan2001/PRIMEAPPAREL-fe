import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
    return (
        <div className="pb-20 pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Contact Info */}
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8">Get in Touch</h1>
                    <p className="text-gray-600 mb-10 text-lg">
                        Have questions about our manufacturing services? Reach out to us directly.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start">
                            <div className="bg-accent/10 p-3 rounded-lg mr-4 text-accent">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary mb-2">Visit Factory</h3>
                                <p className="text-gray-600">123 Fashion Export Zone, Industrial Area,<br />New Delhi, India - 110020</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-accent/10 p-3 rounded-lg mr-4 text-accent">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary mb-2">Call Us</h3>
                                <p className="text-gray-600">+91 98765 43210</p>
                                <p className="text-gray-500 text-sm">Mon-Sat, 9am - 6pm IST</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-accent/10 p-3 rounded-lg mr-4 text-accent">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary mb-2">Email Us</h3>
                                <p className="text-gray-600">exports@primeapparel.com</p>
                                <p className="text-gray-600">sales@primeapparel.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simple Contact Form */}
                <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">Send a Message</h2>
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all" placeholder="How can we help you?"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-accent text-primary font-bold py-4 rounded-lg hover:bg-yellow-500 transition-all shadow-lg">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
