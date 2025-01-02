import { Shield, Zap, BarChart } from 'lucide-react'

const reasons = [
  {
    title: 'Secure & Reliable',
    description: 'Bank-level security for your data.',
    icon: Shield,
  },
  {
    title: 'Lightning Fast',
    description: 'Optimized for speed and efficiency.',
    icon: Zap,
  },
  {
    title: 'Scalable Solution',
    description: 'Grows with your business needs.',
    icon: BarChart,
  },
]

export function WhyChooseUs() {
  return (
    <section className="w-full py-12 md:py-24 px-4">
      <div className="container mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-8 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason) => (
            <div key={reason.title} className="p-6 rounded-2xl border border-gray-800 hover:border-teal-500/50 transition-colors text-center">
              <reason.icon className="w-8 h-8 text-teal-500 mx-auto mb-4" />
              <h3 className="text-base font-semibold mb-2">{reason.title}</h3>
              <p className="text-sm text-gray-400">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

