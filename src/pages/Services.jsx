import { Check, PenTool, Scissors, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
    return (
        <div className="pb-20">
            {/* Hero */}
            <section className="bg-gray-900 text-white py-24 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-8">Our Services</h1>
                    <p className="text-xl text-gray-300">
                        Comprehensive manufacturing solutions tailored for global fashion brands.
                    </p>
                </div>
            </section>

            {/* Service List */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'OEM Manufacturing',
                            desc: 'We manufacture your designs with your specifications. Full customization from fabric to packaging.',
                            icon: Scissors
                        },
                        {
                            title: 'ODM / Private Label',
                            desc: 'Choose from our ready catalogue and add your brand labels. Perfect for quick launches.',
                            icon: PenTool
                        },
                        {
                            title: 'Small MOQ Production',
                            desc: 'Start small with just 100 pieces per style. Scale up as your brand grows.',
                            icon: Check
                        }
                    ].map((service, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-xl shadow-lg border border-gray-100 hover:border-accent transition-all">
                            <div className="bg-accent text-primary w-14 h-14 rounded-full flex items-center justify-center mb-6">
                                <service.icon size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-5">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-base">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Process Flow */}
            <section className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">How We Work</h2>
                    </div>
                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                            {[
                                { step: '01', title: 'Consultation', desc: 'Share your designs or choose ours.' },
                                { step: '02', title: 'Sampling', desc: 'We create a PP sample for approval.' },
                                { step: '03', title: 'Production', desc: 'Cutting, stitching, and finishing.' },
                                { step: '04', title: 'Delivery', desc: 'Global shipping to your doorstep.' },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-xl shadow-md text-center">
                                    <div className="bg-accent text-primary font-bold text-xl w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                        {item.step}
                                    </div>
                                    <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">Ready to start production?</h2>
                <Link
                    to="/inquiry"
                    className="bg-accent text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 inline-block transition-all shadow-lg"
                >
                    Get Started
                </Link>
            </section>
        </div>
    );
};

export default Services;
