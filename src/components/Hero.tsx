import { ArrowRight, Shield, Star, Clock, CheckCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <div className="flex -space-x-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white/90 text-sm font-medium">Rated 4.9/5 by 200+ homeowners</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Your Roof,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Protected
              </span>
              <br />
              By Experts
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
              Professional roofing services with free estimates. From emergency repairs to complete replacements — we've got you covered, 24/7.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="#estimate"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                Get Free Estimate
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                <Clock className="w-5 h-5" />
                24/7 Emergency
              </a>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Shield, text: 'Licensed & Insured' },
                { icon: Star, text: '25+ Years Exp.' },
                { icon: CheckCircle, text: 'Free Estimates' },
                { icon: Clock, text: 'Same-Day Service' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/80">
                  <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Stats Card */}
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 space-y-6">
              <h3 className="text-white text-xl font-bold">Why Homeowners Choose Us</h3>
              
              <div className="space-y-4">
                {[
                  { stat: '5,000+', label: 'Roofs Completed' },
                  { stat: '25+', label: 'Years of Experience' },
                  { stat: '100%', label: 'Satisfaction Guarantee' },
                  { stat: '24/7', label: 'Emergency Response' },
                ].map(({ stat, label }) => (
                  <div key={label} className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                    <span className="text-2xl font-bold text-blue-400">{stat}</span>
                    <span className="text-white/80">{label}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-white/60 text-sm italic">
                  "They responded within an hour and had our emergency leak fixed the same day. Incredible service!"
                </p>
                <p className="text-white/80 text-sm mt-2 font-medium">— Jennifer M., Plano TX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
