import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    Users,
    TrendingUp,
    Heart,
    Zap,
    Shield,
    Coffee,
    Award,
    Globe,
    CheckCircle,
    ArrowRight,
    Star,
    Target,
    Laptop,
    BookOpen
} from 'lucide-react';

/**
 * Career page – Premium B2B wholesale apparel career page
 */
const Career = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Hero images for career page - team and office focused
    const CAREER_HERO_IMAGES = [
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070', // Team collaboration
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070', // Office team
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2070'  // Team meeting
    ];

    // Cycle through hero images every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % CAREER_HERO_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    /** Hero section */
    // const Hero = () => (
    //     <section
    //         aria-label="Career Hero"
    //         className="relative bg-gradient-to-br from-primary via-primary-dark to-primary text-white min-h-[70vh] flex items-center overflow-hidden"
    //     >
    //         {/* Background image slider */}
    //         <div className="absolute inset-0 z-0">
    //             {CAREER_HERO_IMAGES.map((img, idx) => (
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
    //                     Join Our Team
    //                 </h1>

    //                 <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl leading-relaxed">
    //                     Build your career with a global leader in premium apparel manufacturing.
    //                     We're looking for passionate individuals to grow with us.
    //                 </p>

    //                 {/* Primary actions */}
    //                 <div className="flex flex-col sm:flex-row gap-4">
    //                     <a
    //                         href="#openings"
    //                         className="btn btn-accent rounded-full text-lg px-10 py-4 shadow-xl hover:-translate-y-1 transition"
    //                     >
    //                         View Open Positions
    //                     </a>
    //                     <a
    //                         href="#culture"
    //                         className="btn btn-outline bg-white/10 text-white border-white/30 rounded-full text-lg px-10 py-4 hover:bg-white hover:text-primary transition"
    //                     >
    //                         Our Culture
    //                     </a>
    //                 </div>

    //                 {/* Highlights – badges */}
    //                 <div className="mt-10 sm:mt-14 mb-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 px-4">
    //                     <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition shadow-lg">
    //                         <Users size={20} className="text-accent" />
    //                         <span className="text-sm font-semibold">500+ Team Members</span>
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
    //             {CAREER_HERO_IMAGES.map((_, idx) => (
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

    /** Why Join Us Section */
    const WhyJoinUs = () => {
        const reasons = [
            {
                icon: TrendingUp,
                title: 'Career Growth',
                description: 'Structured career paths with regular promotions and skill development opportunities'
            },
            {
                icon: Users,
                title: 'Collaborative Culture',
                description: 'Work with talented professionals in a supportive and inclusive environment'
            },
            {
                icon: Award,
                title: 'Industry Leader',
                description: 'Be part of a company serving 45+ countries with premium quality garments'
            },
            {
                icon: Zap,
                title: 'Innovation Focus',
                description: 'Work with cutting-edge technology and modern manufacturing processes'
            },
            {
                icon: Heart,
                title: 'Work-Life Balance',
                description: 'Flexible hours, wellness programs, and a healthy work environment'
            },
            {
                icon: Globe,
                title: 'Global Exposure',
                description: 'Collaborate with international clients and expand your global perspective'
            }
        ];

        return (
            <section className="py-28 bg-gradient-to-br from-slate-50 to-white">
                <div className="container-custom text-center mb-16">
                    <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
                        Why Choose Us
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
                        Why Work With Prime Apparel
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Join a team that values your growth, creativity, and well-being
                    </p>
                </div>

                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reasons.map((reason, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-card transition-all duration-300 border border-slate-100 group hover:-translate-y-2"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-accent to-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <reason.icon size={28} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-3">{reason.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{reason.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    /** Open Positions Section */
    const OpenPositions = () => {
        const jobs = [
            {
                title: 'Production Manager',
                department: 'Manufacturing',
                location: 'New Delhi, India',
                type: 'Full-time',
                experience: '5-7 years',
                description: 'Lead our production team to ensure quality and timely delivery of garments'
            },
            {
                title: 'Quality Control Specialist',
                department: 'Quality Assurance',
                location: 'New Delhi, India',
                type: 'Full-time',
                experience: '3-5 years',
                description: 'Ensure every piece meets our international quality standards'
            },
            {
                title: 'Fashion Designer',
                department: 'Design',
                location: 'New Delhi, India',
                type: 'Full-time',
                experience: '2-4 years',
                description: 'Create innovative designs for our global clientele'
            },
            {
                title: 'Export Coordinator',
                department: 'Logistics',
                location: 'New Delhi, India',
                type: 'Full-time',
                experience: '3-5 years',
                description: 'Manage international shipments and coordinate with global partners'
            },
            {
                title: 'Sales Representative',
                department: 'Sales',
                location: 'Remote',
                type: 'Full-time',
                experience: '2-3 years',
                description: 'Build relationships with B2B clients worldwide'
            },
            {
                title: 'Pattern Maker',
                department: 'Design',
                location: 'New Delhi, India',
                type: 'Full-time',
                experience: '4-6 years',
                description: 'Create precise patterns for our diverse product range'
            }
        ];

        return (
            <section id="openings" className="py-28 bg-white">
                <div className="container-custom text-center mb-16">
                    <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
                        Current Openings
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
                        Open Positions
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Find your perfect role and start your journey with us
                    </p>
                </div>

                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {jobs.map((job, idx) => (
                            <div
                                key={idx}
                                className="bg-white border-2 border-slate-100 rounded-2xl p-8 hover:border-accent/30 hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                                            {job.title}
                                        </h3>
                                        <div className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold">
                                            {job.department}
                                        </div>
                                    </div>
                                    <Briefcase className="text-accent" size={28} />
                                </div>

                                <p className="text-slate-600 mb-6 leading-relaxed">{job.description}</p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPin size={16} className="text-accent" />
                                        <span className="text-sm">{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Clock size={16} className="text-accent" />
                                        <span className="text-sm">{job.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Star size={16} className="text-accent" />
                                        <span className="text-sm">{job.experience}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <DollarSign size={16} className="text-accent" />
                                        <span className="text-sm">Competitive</span>
                                    </div>
                                </div>

                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-full font-semibold transition-all hover:-translate-y-1"
                                >
                                    Apply Now
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    /** Company Culture Section */
    const Culture = () => (
        <section id="culture" className="py-28 bg-slate-50">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image */}
                    <div className="group relative rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1">
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
                            alt="Team Culture"
                            className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    {/* Content */}
                    <div className="order-1 lg:order-2">
                        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
                            Our Culture
                        </span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
                            A Culture of Excellence
                        </h2>
                        <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                            At Prime Apparel, we believe in fostering an environment where creativity,
                            collaboration, and innovation thrive. Our team is our greatest asset.
                        </p>
                        <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                            We celebrate diversity, encourage new ideas, and support continuous learning.
                            Every team member has the opportunity to make a meaningful impact.
                        </p>

                        {/* Culture highlights */}
                        <div className="space-y-4">
                            {[
                                'Open communication and transparency',
                                'Regular training and upskilling programs',
                                'Team building activities and celebrations',
                                'Employee recognition and rewards'
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckCircle size={14} className="text-accent" />
                                    </div>
                                    <span className="text-slate-700 text-lg">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    /** Benefits Section */
    const Benefits = () => {
        const benefits = [
            {
                icon: Shield,
                title: 'Health Insurance',
                description: 'Comprehensive medical coverage for you and your family'
            },
            {
                icon: Coffee,
                title: 'Flexible Hours',
                description: 'Work-life balance with flexible working arrangements'
            },
            {
                icon: BookOpen,
                title: 'Learning Budget',
                description: 'Annual allowance for courses, conferences, and certifications'
            },
            {
                icon: Laptop,
                title: 'Modern Equipment',
                description: 'Latest tools and technology to do your best work'
            },
            {
                icon: Target,
                title: 'Performance Bonus',
                description: 'Rewarding excellence with quarterly and annual bonuses'
            },
            {
                icon: Users,
                title: 'Team Events',
                description: 'Regular team outings, celebrations, and fun activities'
            }
        ];

        return (
            <section className="py-28 bg-white">
                <div className="container-custom text-center mb-16">
                    <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
                        Perks & Benefits
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
                        What We Offer
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Competitive compensation and comprehensive benefits package
                    </p>
                </div>

                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, idx) => (
                            <div
                                key={idx}
                                className="bg-slate-50 p-8 rounded-2xl text-center hover:shadow-lg hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-accent/20"
                            >
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-md">
                                    <benefit.icon size={28} className="text-accent" />
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

    /** CTA Section */
    const CTA = () => (
        <section className="py-28 bg-gradient-to-br from-accent via-orange-500 to-yellow-500 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="container-custom text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                    Ready to Join Our Team?
                </h2>
                <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto">
                    Take the next step in your career. Apply today and become part of our success story.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="#openings"
                        className="inline-flex items-center gap-2 bg-white text-accent px-10 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-all hover:-translate-y-1 shadow-2xl"
                    >
                        Browse Openings
                        <ArrowRight size={24} />
                    </a>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-accent transition-all hover:-translate-y-1"
                    >
                        Get in Touch
                    </Link>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/90">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={20} />
                        <span>Equal Opportunity Employer</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle size={20} />
                        <span>Diverse & Inclusive</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle size={20} />
                        <span>Growth Focused</span>
                    </div>
                </div>
            </div>
        </section>
    );

    return (
        <div className="min-h-screen font-sans text-slate-900 overflow-x-hidden">
            {/* <Hero /> */}
            <WhyJoinUs />
            <OpenPositions />
            <Culture />
            <Benefits />
            <CTA />
        </div>
    );
};

export default Career;
