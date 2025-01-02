import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <section className="w-full py-12 md:py-24 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Join the Future of Inventory Management</h2>
        <p className="text-sm md:text-base text-gray-400 mb-8 max-w-2xl mx-auto">
          Start today and experience the power of simplicity in stock management.
        </p>
        <Button className="bg-teal-500 hover:bg-teal-600 text-black rounded-full text-sm">
          Get Started Now
        </Button>
      </div>
    </section>
  )
}

