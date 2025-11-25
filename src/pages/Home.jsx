import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe } from 'lucide-react';
import { HERO_IMAGES } from '../constants/heroImages';

/**
 * Home page – premium B2B wholesale apparel landing page.
 */
const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Cycle through hero images every 5 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  /** Hero section – extracted for readability */
  const Hero = () => (
    <section
      aria-label="Hero"
      className="relative bg-primary text-white min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image slider */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              currentSlide === idx ? 'opacity-40' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}
        {/* Gradient overlays for visual depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-80" />
      </div>

      {/* Hero content */}
      <div className="container-custom relative z-10 w-full pt-20 pb-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
         

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-tight">
            Premium Apparel <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">
              Manufacturing
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl leading-relaxed">
            From Kaftans to Resort Wear – We manufacture high‑quality garments with MOQs starting
            from just 100 pieces.
          </p>

          {/* Primary actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/inquiry"
              className="btn btn-accent rounded-full text-lg px-10 py-4 shadow-xl hover:-translate-y-1 transition"
            >
              Request Quote
            </Link>
            <Link
              to="/products"
              className="btn btn-outline bg-white/10 text-white border-white/30 rounded-full text-lg px-10 py-4 hover:bg-white hover:text-primary transition"
            >
              Browse Collections
            </Link>
          </div>

          {/* Highlights – badges (reduced gap) */}
          <div className="mt-10 sm:mt-14 mb-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 px-4">
            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition shadow-lg">
              <CheckCircle size={20} className="text-accent" />
              <span className="text-sm font-semibold">Verified Manufacturer</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition shadow-lg">
              <Globe size={20} className="text-accent" />
              <span className="text-sm font-semibold">Global Shipping</span>
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
            className={`h-2 rounded-full transition-all ${
              currentSlide === idx ? 'bg-accent w-12' : 'bg-white/40 w-3 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );

  /** Collections section – extracted for readability */
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
          Curated Collections
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Explore our signature styles, crafted with precision and designed for the modern global
          market.
        </p>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {[
            {
              title: 'Resort Wear',
              image: 'https://images.unsplash.com/photo-1545959788-9632836df27f?q=80&w=800',
            },
            {
              title: 'Modest Fashion',
              image: 'https://images.unsplash.com/photo-1585423963628-94726584a954?q=80&w=800',
            },
            {
              title: 'Luxury Kaftans',
              image: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80&w=800',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group relative h-[320px] md:h-[380px] lg:h-[420px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${item.image}')` }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-3xl text-white font-heading font-bold mb-4">{item.title}</h3>
                <div className="flex items-center text-accent opacity-0 group-hover:opacity-100 transition">
                  <span className="mr-2 font-bold">View Collection</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen font-sans text-slate-900 overflow-x-hidden">
      <Hero />
      <Collections />
    </div>
  );
};

export default Home;
