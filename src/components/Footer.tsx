import { Phone, Mail, MapPin, Shield, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Protect Your Home?
          </h2>
          <p className="text-blue-100 mb-6 text-lg">
            Get your free roof inspection and estimate today. No obligation, no pressure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/#estimate"
              className="bg-white text-blue-700 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Get Free Estimate
            </Link>
            <a
              href="tel:+15551234567"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              Call (555) 123-4567
            </a>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">ApexRoof</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Professional roofing services you can trust. Licensed, insured, and committed to quality.
            </p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-400 ml-2">4.9/5 (200+ reviews)</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Roof Repair</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Roof Replacement</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Storm Damage</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Roof Inspection</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Gutter Services</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Emergency Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <a href="tel:+15551234567" className="hover:text-blue-400">(555) 123-4567</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:info@apexroof.com" className="hover:text-blue-400">info@apexroof.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Serving the DFW Metroplex</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>24/7 Emergency Service</span>
              </li>
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h3 className="text-white font-semibold mb-4">Why Choose Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Licensed & Insured</span>
              </li>
              <li className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>25+ Years Experience</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Same-Day Emergency Service</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Lifetime Workmanship Warranty</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ApexRoof Professional Roofing. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-blue-400">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400">Terms of Service</a>
            <Link to="/login" className="hover:text-blue-400">Owner Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
