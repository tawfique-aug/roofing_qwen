import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Shield } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isLogin = location.pathname === '/login';

  if (isDashboard || isLogin) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Apex</span>
              <span className="text-xl font-bold text-blue-600">Roof</span>
              <p className="text-[10px] text-gray-500 -mt-1 tracking-wider uppercase">Professional Roofing</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Services</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">How It Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Reviews</a>
            <a href="#estimate" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Free Estimate</a>
            <a
              href="tel:+15551234567"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <Phone className="w-4 h-4" />
              (555) 123-4567
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3 animate-in slide-in-from-top">
            <a href="#services" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-600 hover:text-blue-600 font-medium">Services</a>
            <a href="#how-it-works" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-600 hover:text-blue-600 font-medium">How It Works</a>
            <a href="#testimonials" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-600 hover:text-blue-600 font-medium">Reviews</a>
            <a href="#estimate" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-gray-600 hover:text-blue-600 font-medium">Free Estimate</a>
            <a
              href="tel:+15551234567"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold mx-4"
            >
              <Phone className="w-4 h-4" />
              Call Now: (555) 123-4567
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
