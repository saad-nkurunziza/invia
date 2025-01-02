import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { WhyChooseUs } from "@/components/landing/why-choose-us";
import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#0A0A0A] text-[#D3D3D3] font-sans ">
      <div className="max-w-4xl mx-auto scrollbar-hide">
        <Hero />
        <Features />
        <HowItWorks />
        <WhyChooseUs />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
