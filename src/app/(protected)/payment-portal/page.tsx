import PaymentPortal from "@/components/payment-portal/card";

export default function page() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <PaymentPortal />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-lg pointer-events-none select-none rounded-lg" />
    </div>
  );
}
