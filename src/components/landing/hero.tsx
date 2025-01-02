import { Button } from "@/components/ui/button";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export async function Hero() {
  const session = await auth();
  if (session?.user.id) {
    redirect("/dashboard");
  }
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
          Manage Your Inventory with Confidence and Precision
        </h1>
        <p className="text-sm md:text-base lg:text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
          A sleek, powerful solution to streamline your stock management and
          optimize your business operations.
        </p>
        <div className="flex justify-center space-x-4 mb-12">
          <Button className="bg-teal-500 hover:bg-teal-600 text-black rounded-2xl text-sm relative">
            <Link href={"/login"} className="absolute inset-0 "></Link>
            Get Started
          </Button>
          <Button
            variant="outline"
            className="text-teal-500 border-teal-500 hover:bg-teal-500/10 rounded-2xl text-sm"
          >
            Learn More
          </Button>
        </div>
        <div className="relative w-full max-w-4xl mx-auto aspect-video">
          <Image
            src="/placeholder.svg"
            alt="App Mockup"
            layout="fill"
            objectFit="contain"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
