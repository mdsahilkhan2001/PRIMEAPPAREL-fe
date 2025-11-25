import { Award, Clock, Globe, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="pb-20 bg-white text-slate-900">
      {/* Hero Section - Updated with Kaftan/Islamic Dress Background */}
      <section
        className="relative bg-gray-900 text-white py-20 md:py-32 bg-cover bg-center"
        style={{
          // Image: Elegant woman in modest kaftan/abaya style dress
          backgroundImage: "url('https://images.unsplash.com/photo-1585423963628-94726584a954?q=80&w=2074')",
          backgroundPosition: "center 30%" // Adjusts focus to the garment
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative container-custom text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Our Legacy
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-medium">
            Over two decades of excellence in garment manufacturing and exports.
            We turn your fashion concepts into global realities.
          </p>
        </div>
      </section>

      {/* Story Section - Updated with Fabric Texture Background */}
      <section
        className="relative py-20 md:py-24 bg-cover bg-center"
        style={{
          // Image: White/Light fabric texture
          backgroundImage: "url('https://images.unsplash.com/photo-1594068725766-9352d569653f?q=80&w=2074')"
        }}
      >
        {/* Light overlay to ensure text is readable on texture */}
        <div className="absolute inset-0 bg-white/90" />
        
        <div className="relative container-custom px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                {/* Image: Garment Factory / Sewing */}
                <img
                  src="https://images.unsplash.com/photo-1611510338559-2f4633350922?q=80&w=2070&auto=format&fit=crop"
                  alt="Garment Factory Production"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                20+ Years of Craftsmanship
              </h2>
              <p className="text-gray-700 mb-5 leading-relaxed font-medium">
                Founded in 2005, Prime Apparel Exports started as a small boutique unit and has
                grown into a full-scale export house. We specialize in high-fashion ladies'
                garments including <strong>Kaftans, Abayas, and Resort Wear</strong>.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our state-of-the-art facility in New Delhi is equipped with modern machinery for
                cutting, stitching, and finishing, ensuring that every piece meets international
                quality standards.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <h4 className="font-bold text-3xl text-accent mb-1">500+</h4>
                  <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Global Clients</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                  <h4 className="font-bold text-3xl text-accent mb-1">1M+</h4>
                  <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">Pieces Exported</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-slate-50 py-20 md:py-24 border-t border-slate-200">
        <div className="container-custom px-4">
          <div className="text-center mb-14">
            <span className="text-accent font-bold tracking-widest uppercase text-sm mb-3 block">
              Why Work With Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Quality First',
                desc: 'Zero tolerance for defects. 100% QC check.',
              },
              {
                icon: Clock,
                title: 'On-Time Delivery',
                desc: 'We respect your timelines and launch dates.',
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
                className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100"
              >
                <div className="text-accent flex justify-center mb-6">
                  <div className="p-4 bg-accent/10 rounded-full">
                    <item.icon size={32} />
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-3 text-primary">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
