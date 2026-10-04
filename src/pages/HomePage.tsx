import Hero from '../components/Hero';
import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import StepForm from '../components/StepForm';
import Testimonials from '../components/Testimonials';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <HowItWorks />
      
      {/* Estimate Form Section */}
      <section id="estimate" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Your Free Estimate
            </h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and we'll get back to you within 1 business hour.
              No obligation, no pressure — just honest roofing advice.
            </p>
          </div>
          <StepForm />
        </div>
      </section>

      <Testimonials />
    </main>
  );
}
