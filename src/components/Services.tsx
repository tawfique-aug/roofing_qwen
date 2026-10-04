import { Shield, Wrench, Home, AlertTriangle, Search, Droplets, Clock, CheckCircle } from 'lucide-react';

const services = [
  {
    icon: Wrench,
    title: 'Roof Repair',
    description: 'Fix leaks, replace damaged shingles, repair flashing, and address any roof issues before they become major problems.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Home,
    title: 'Roof Replacement',
    description: 'Complete tear-off and replacement with premium materials. We handle permits, disposal, and full cleanup.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: AlertTriangle,
    title: 'Storm Damage',
    description: 'Fast response for hail, wind, and fallen tree damage. We work directly with your insurance company.',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Search,
    title: 'Roof Inspection',
    description: 'Comprehensive inspection with detailed report. Perfect for home buyers or annual maintenance checks.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Droplets,
    title: 'Gutter Services',
    description: 'Gutter installation, repair, cleaning, and guard installation to protect your home from water damage.',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: Clock,
    title: 'Emergency Service',
    description: '24/7 emergency tarping and repairs for active leaks and dangerous situations. We respond within hours.',
    color: 'from-orange-500 to-orange-600',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Our Services
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Complete Roofing Solutions
          </h2>
          <p className="text-lg text-gray-600">
            From minor repairs to full replacements, we provide comprehensive roofing services backed by our quality guarantee.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* Trust Bar */}
        <div className="mt-16 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '5,000+', label: 'Roofs Completed' },
              { value: '25+', label: 'Years Experience' },
              { value: '4.9★', label: 'Average Rating' },
              { value: '100%', label: 'Satisfaction' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl md:text-3xl font-bold text-blue-600">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
