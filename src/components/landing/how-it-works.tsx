const steps = [
  {
    title: 'Set Up',
    description: 'Set up your business profile in minutes.',
  },
  {
    title: 'Track',
    description: 'Add and track inventory with real-time updates.',
  },
  {
    title: 'Analyze',
    description: 'Access analytics to make data-driven decisions.',
  },
]

export function HowItWorks() {
  return (
    <section className="w-full py-12 md:py-24 px-4">
      <div className="container mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-8 text-center">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0 md:space-x-4">
          {steps.map((step, index) => (
            <div key={step.title} className="flex-1 text-center">
              <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-500 flex items-center justify-center text-lg font-bold mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="text-base font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

