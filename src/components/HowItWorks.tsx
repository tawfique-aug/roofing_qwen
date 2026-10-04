import { ClipboardList, Camera, Phone, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Tell Us About Your Roof',
    description: 'Fill out our quick form or chat with our AI assistant. Describe your issue, upload photos, and let us know your timeline.',
    color: 'bg-blue-500',
  },
  {
    number: '02',
    icon: Camera,
    title: 'We Assess & Score',
    description: 'Our system reviews your request and photos. High-priority issues get fast-tracked for immediate attention.',
    color: 'bg-indigo-500',
  },
  {
    number: '03',
    icon: Phone,
    title: 'We Contact You',
    description: 'A roofing expert calls you within 1 business hour to discuss your needs and schedule a free on-site inspection.',
    color: 'bg-purple-500',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Get Your Free Estimate',
    description: 'We inspect your roof, provide a detailed estimate, and answer all your questions. No pressure, no obligation.',
    color: 'bg-green-500',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Getting your free roof estimate is simple. Here's what to expect from start to finish.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ number, icon: Icon, title, description, color }, index) => (
            <div key={title} className="relative">
              {/* Connector line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-gray-200" />
              )}
              
              <div className="relative bg-white">
                {/* Number + Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-4xl font-black text-gray-100">{number}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
