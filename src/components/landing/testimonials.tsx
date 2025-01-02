import Image from 'next/image'

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'CEO, TechStart',
    content: 'This app has revolutionized our inventory management. It\'s intuitive and powerful.',
    avatar: '/placeholder.svg',
  },
  {
    name: 'Sarah Johnson',
    role: 'Operations Manager, RetailGiant',
    content: 'The real-time tracking feature has saved us countless hours and improved our efficiency.',
    avatar: '/placeholder.svg',
  },
]

export function Testimonials() {
  return (
    <section className="w-full py-12 md:py-24 px-4">
      <div className="container mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-8 text-center">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="p-6 rounded-2xl border border-gray-800 hover:border-teal-500/50 transition-colors">
              <div className="flex items-center mb-4">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full mr-4"
                />
                <div>
                  <h3 className="text-sm font-semibold">{testimonial.name}</h3>
                  <p className="text-xs text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">&ldquo;{testimonial.content}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

