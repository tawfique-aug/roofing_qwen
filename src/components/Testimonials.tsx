import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Jennifer Martinez',
    location: 'Plano, TX',
    rating: 5,
    text: "After the storm, I was panicking about the damage to our roof. ApexRoof responded within an hour and had it tarped the same day. They handled our insurance claim seamlessly. Couldn't be happier!",
    service: 'Storm Damage',
  },
  {
    name: 'Robert Chen',
    location: 'Frisco, TX',
    rating: 5,
    text: "We needed a complete roof replacement and got quotes from 5 companies. ApexRoof was the most thorough in their inspection, fair in pricing, and the crew was incredibly professional. Finished in just 2 days!",
    service: 'Roof Replacement',
  },
  {
    name: 'Sarah Thompson',
    location: 'McKinney, TX',
    rating: 5,
    text: "The online estimate process was so easy! I filled out the form, uploaded some photos, and they called me back within 30 minutes. The repair was done the next week. Great communication throughout.",
    service: 'Roof Repair',
  },
  {
    name: 'David Williams',
    location: 'Allen, TX',
    rating: 5,
    text: "Had them do a roof inspection before we bought our home. They found issues the previous owner's inspector missed. Saved us thousands in potential repairs. Highly recommend their inspection service!",
    service: 'Roof Inspection',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it. Here's what homeowners in your area have to say.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map(({ name, location, rating, text, service }) => (
            <div
              key={name}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <div className="relative mb-4">
                <Quote className="absolute -top-1 -left-1 w-6 h-6 text-blue-100" />
                <p className="text-gray-700 text-sm leading-relaxed pl-4">{text}</p>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{name}</p>
                  <p className="text-gray-500 text-xs">{location}</p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                  {service}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Overall rating */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-sm border border-gray-100">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-700 font-medium">4.9 out of 5</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 text-sm">Based on 200+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
