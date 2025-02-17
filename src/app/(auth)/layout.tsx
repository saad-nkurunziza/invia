import type { Metadata } from "next";
import SignInOutText from "@/components/auth/sign-in-out-text";
import ContinueWithGithub from "@/components/auth/continue-with-github";
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
      <div className="flex w-full lg:w-1/2 flex-col px-8 sm:px-16 py-8 overflow-y-auto">
        <div className="mt-6 mb-2 flex items-center gap-2 text-lg font-semibold">
          <div className="h-6 w-7 rounded-3xl bg-violet-700 dark:bg-violet-900" />
          <div className="inline-flex">
            <span className="text-purple-700">Inv</span>ia
          </div>
        </div>
        <div className="my-3" />
        <SignInOutText />
        <div className="my-3" />
        {children}
        <div className="mt-4 mb-5">
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <div className="my-3" />
          <ContinueWithGithub />
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-muted to-muted/75 items-center justify-center">
        <div className="text-left max-w-md px-6">
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
