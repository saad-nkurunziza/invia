import type { Metadata } from "next";
import SignInOutText from "@/components/auth/sign-in-out-text";
import BackButton from "@/components/back-button";
export const metadata: Metadata = {
  title: "Authentication",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <div className="flex order-2 w-full lg:w-2/3 flex-col px-8 sm:px-16 py-8 overflow-y-auto">
        <div className="flex text-sm gap-2 items-center">
          <BackButton />
          Home
        </div>
        <div className="mx-auto flex-1">
          <div className="my-3" />
          <SignInOutText />
          <div className="my-3" />
          {children}
        </div>
      </div>

      <div className="hidden order-1 lg:flex lg:w-1/3 bg-linear-to-br from-muted to-muted/75 items-center justify-center">
        <div className="text-left max-w-lg px-4">
          <blockquote className="text-lg text-muted-foreground p-4 italic">
            &quot;Unlock the full potential of your business with our
            cutting-edge digital stock management tool. Streamline your
            operations, optimize inventory levels, and make data-driven
            decisions to boost profitability and stay ahead of the
            competition.&quot;
          </blockquote>
          <p className="text-xs text-muted-foreground px-4 pb-4">
            - Discover the power of digital stock management
          </p>
        </div>
      </div>
    </div>
  );
}
