import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Basic features for single business',
    features: ['Single business management', 'Basic inventory tracking', 'Limited analytics'],
  },
  {
    name: 'Pro',
    price: '$19.99/month',
    description: 'Advanced features for growing businesses',
    features: ['Multi-business management', 'Advanced inventory tracking', 'Full analytics suite', 'AI-powered insights'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored solutions for large enterprises',
    features: ['Custom integrations', 'Dedicated support', 'Advanced security features', 'Customizable analytics'],
  },
]

export function Pricing() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Pricing Plans</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`flex flex-col p-6 bg-white rounded-lg shadow-lg ${plan.popular ? 'ring-2 ring-blue-600' : ''}`}>
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-500 mb-4">{plan.description}</p>
              <p className="text-4xl font-bold mb-6">{plan.price}</p>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className={`mt-auto ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}>
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

