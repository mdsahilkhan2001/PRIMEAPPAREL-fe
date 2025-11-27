// import { Award, Clock, Globe, ShieldCheck } from 'lucide-react';

// const About = () => {
//   return (
//     <div className="pb-20 bg-white text-slate-900">
//       {/* Hero Section - Updated with Kaftan/Islamic Dress Background */}
//       <section
//         className="relative bg-gray-900 text-white py-20 md:py-32 bg-cover bg-center"
//         style={{
//           // Image: Elegant woman in modest kaftan/abaya style dress
//           backgroundImage: "url('https://images.unsplash.com/photo-1585423963628-94726584a954?q=80&w=2074')",
//           backgroundPosition: "center 30%" // Adjusts focus to the garment
//         }}
//       >
//         {/* Dark overlay for text readability */}
//         <div className="absolute inset-0 bg-black/60" />

//         <div className="relative container-custom text-center px-4">
//           <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
//             Our Legacy
//           </h1>
//           <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-medium">
//             Over two decades of excellence in garment manufacturing and exports.
//             We turn your fashion concepts into global realities.
//           </p>
//         </div>
//       </section>

//       {/* Story Section - Updated with Fabric Texture Background */}
//       <section
//         className="relative py-20 md:py-24 bg-cover bg-center"
//         style={{
//           // Image: White/Light fabric texture
//           backgroundImage: "url('https://images.unsplash.com/photo-1594068725766-9352d569653f?q=80&w=2074')"
//         }}
//       >
//         {/* Light overlay to ensure text is readable on texture */}
//         <div className="absolute inset-0 bg-white/90" />

//         <div className="relative container-custom px-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
//             <div>
//               <div className="rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
//                 {/* Image: Garment Factory / Sewing */}
//                 <img
//                   src="https://images.unsplash.com/photo-1611510338559-2f4633350922?q=80&w=2070&auto=format&fit=crop"
//                   alt="Garment Factory Production"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </div>
//             <div>
//               <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
//                 20+ Years of Craftsmanship
//               </h2>
//               <p className="text-gray-700 mb-5 leading-relaxed font-medium">
//                 Founded in 2005, Prime Apparel Exports started as a small boutique unit and has
//                 grown into a full-scale export house. We specialize in high-fashion ladies'
//                 garments including <strong>Kaftans, Abayas, and Resort Wear</strong>.
//               </p>
//               <p className="text-gray-600 mb-8 leading-relaxed">
//                 Our state-of-the-art facility in New Delhi is equipped with modern machinery for
//                 cutting, stitching, and finishing, ensuring that every piece meets international
//                 quality standards.
//               </p>
//               <div className="grid grid-cols-2 gap-6">
//                 <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
//                   <h4 className="font-bold text-3xl text-accent mb-1">500+</h4>
//                   <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Global Clients</p>
//                 </div>
//                 <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
//                   <h4 className="font-bold text-3xl text-accent mb-1">1M+</h4>
//                   <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Pieces Exported</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Values Section */}
//       <section className="bg-slate-50 py-20 md:py-24 border-t border-slate-200">
//         <div className="container-custom px-4">
//           <div className="text-center mb-14">
//             <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
//               Why Work With Us
//             </span>
//             <h2 className="text-3xl md:text-4xl font-bold text-primary">
//               Our Core Values
//             </h2>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             {[
//               {
//                 icon: ShieldCheck,
//                 title: 'Quality First',
//                 desc: 'Zero tolerance for defects. 100% QC check.',
//               },
//               {
//                 icon: Clock,
//                 title: 'On-Time Delivery',
//                 desc: 'We respect your timelines and launch dates.',
//               },
//               {
//                 icon: Globe,
//                 title: 'Sustainable',
//                 desc: 'Eco-friendly fabrics and ethical labor practices.',
//               },
//               {
//                 icon: Award,
//                 title: 'Innovation',
//                 desc: 'Constantly updating with new trends and techniques.',
//               },
//             ].map((item, idx) => (
//               <div
//                 key={idx}
//                 className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100"
//               >
//                 <div className="text-accent flex justify-center mb-6">
//                   <div className="p-4 bg-accent/10 rounded-full">
//                     <item.icon size={32} />
//                   </div>
//                 </div>
//                 <h3 className="font-bold text-lg mb-3 text-primary">{item.title}</h3>
//                 <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default About;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Clock, 
  Globe, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight,
  Factory,
  Users,
  TrendingUp
} from 'lucide-react';

/**
 * About page – Premium B2B wholesale apparel about page
 */
const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero images for about page - garment manufacturing focused
  const ABOUT_HERO_IMAGES = [
    'https://images.unsplash.com/photo-1585095590-ced3d6af7098?q=80&w=2070', // Garment factory
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070', // Textile production
    'https://images.unsplash.com/photo-1611510338559-2f463335092c?q=80&w=2070'  // Quality control
  ];

  // Cycle through hero images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ABOUT_HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  /** Hero section */
  const Hero = () => (
    <section
      aria-label="About Hero"
      className="relative bg-primary text-white min-h-[70vh] flex items-center overflow-hidden"
    >
      {/* Background image slider */}
      <div className="absolute inset-0 z-0">
        {ABOUT_HERO_IMAGES.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              currentSlide === idx ? 'opacity-40' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-80" />
      </div>

      {/* Hero content */}
      <div className="container-custom relative z-10 w-full pt-20 pb-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6 leading-tight">
            Our Legacy
          </h1>

          <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl leading-relaxed">
            Over two decades of excellence in garment manufacturing and exports. 
            We turn your fashion concepts into global realities.
          </p>

          {/* Primary actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/inquiry"
              className="btn btn-accent rounded-full text-lg px-10 py-4 shadow-xl hover:-translate-y-1 transition"
            >
              Partner With Us
            </Link>
            <Link
              to="/products"
              className="btn btn-outline bg-white/10 text-white border-white/30 rounded-full text-lg px-10 py-4 hover:bg-white hover:text-primary transition"
            >
              Our Collections
            </Link>
          </div>

          {/* Highlights – badges */}
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
        {ABOUT_HERO_IMAGES.map((_, idx) => (
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

  /** Story Section */
  const Story = () => (
    <section aria-labelledby="story-heading" className="py-28 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
              Our Journey
            </span>
            <h2
              id="story-heading"
              className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary"
            >
              20+ Years of Craftsmanship
            </h2>
            <p className="text-slate-600 mb-6 text-lg leading-relaxed">
              Founded in 2005, Prime Apparel Exports started as a small boutique unit and has
              grown into a full-scale export house. We specialize in high-fashion ladies'
              garments including <strong>Kaftans, Abayas, and Resort Wear</strong>.
            </p>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed">
              Our state-of-the-art facility in New Delhi is equipped with modern machinery for
              cutting, stitching, and finishing, ensuring that every piece meets international
              quality standards.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl shadow-lg border border-slate-100">
                <div className="text-3xl font-bold text-accent mb-2">500+</div>
                <div className="text-slate-600 font-semibold">Global Clients</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl shadow-lg border border-slate-100">
                <div className="text-3xl font-bold text-accent mb-2">1M+</div>
                <div className="text-slate-600 font-semibold">Pieces Exported</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="group relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://www.ezrshelving.com/user/blog/perfect-retail-stockroom.jpg "
              alt="Garment Factory Production"
              className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  );

  /** Values Section */
  const Values = () => (
    <section aria-labelledby="values-heading" className="py-28 bg-slate-50">
      <div className="container-custom text-center mb-16">
        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
          Why Work With Us
        </span>
        <h2
          id="values-heading"
          className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary"
        >
          Our Core Values
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Built on a foundation of quality, reliability, and innovation
        </p>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: ShieldCheck,
              title: 'Quality First',
              desc: 'Zero tolerance for defects. 100% QC check on every garment.',
            },
            {
              icon: Clock,
              title: 'On-Time Delivery',
              desc: 'We respect your timelines and launch dates with precision scheduling.',
            },
            {
              icon: Globe,
              title: 'Sustainable',
              desc: 'Eco-friendly fabrics and ethical labor practices.',
            },
            {
              icon: Award,
              title: 'Innovation',
              desc: 'Constantly updating with new trends and techniques.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-accent flex justify-center mb-6">
                <div className="p-4 bg-accent/10 rounded-full">
                  <item.icon size={32} />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  /** Collections Section - Matching Home Page Style */
  const Process = () => (
    <section aria-labelledby="process-heading" className="py-28 bg-white">
      <div className="container-custom text-center mb-16">
        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
          Our Expertise
        </span>
        <h2
          id="process-heading"
          className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary"
        >
          Manufacturing Process
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          From concept to creation - our comprehensive manufacturing workflow
        </p>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {[
            {
              title: 'Design & Development',
              image: 'https://images.unsplash.com/photo-1586366775917-4d660e18f68d?q=80&w=2070', // Fashion design
            },
            {
              title: 'Precision Manufacturing',
              image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070', // Textile production
            },
            {
              title: 'Quality Assurance',
              image: 'https://images.unsplash.com/photo-1585095590-ced3d6af7098?q=80&w=2070', // Quality control
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
                  <span className="mr-2 font-bold">Learn More</span>
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          ))}
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
          Start Your Project <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">
            With Us Today
          </span>
        </h2>
        <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
          Let's create something extraordinary together. Share your designs and we'll bring them to life with precision and quality.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/inquiry"
            className="btn bg-accent hover:bg-accent/90 text-white rounded-full text-lg px-10 py-4 shadow-xl hover:-translate-y-1 transition flex items-center gap-2"
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
            <CheckCircle size={20} className="text-accent" />
            <span className="text-sm font-semibold text-white">MOQ from 100 Pieces</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
            <Globe size={20} className="text-accent" />
            <span className="text-sm font-semibold text-white">Worldwide Shipping</span>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen font-sans text-slate-900 overflow-x-hidden">
      <Hero />
      <Story />
      <Values />
      <Process />
      <CTA />
    </div>
  );
};

export default About;