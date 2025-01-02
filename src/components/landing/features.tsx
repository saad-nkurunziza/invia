import { BarChart3, Layers, Zap, Cpu } from "lucide-react";

const features = [
  {
    name: "AI-Powered Insights",
    description:
      "Analyze trends and optimize inventory with intelligent recommendations.",
    icon: Cpu,
  },
  {
    name: "Real-Time Tracking",
    description: "Monitor stock levels and movements as they happen.",
    icon: BarChart3,
  },
  {
    name: "Multi-Business Support",
    description:
      "Manage multiple operations from a single, intuitive dashboard.",
    icon: Layers,
  },
  {
    name: "Seamless Integrations",
    description: "Connect effortlessly with your existing tools and platforms.",
    icon: Zap,
  },
];

export function Features() {
  return (
    <section className="w-full py-12 md:py-24 px-4">
      <div className="container mx-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-8 text-center">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="p-6 rounded-2xl border hover:border-teal-500/75 transition-colors"
            >
              <feature.icon className="w-8 h-8 text-teal-500 mb-4" />
              <h3 className="text-base font-semibold mb-2">{feature.name}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
