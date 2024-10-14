import OnboardingTab from "@/components/onboarding/onboarding-tab";
import OnboardingCreateForm from "@/components/onboarding/onboarding-create";
import OnboardingJoinForm from "@/components/onboarding/onboarding-join";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const OnboardingPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const session = await auth();
  if (session?.user.businessId) {
    redirect("/dashboard");
  }
  const tab = searchParams.onboard as string;
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {tab === "create" ? (
          <OnboardingCreateForm />
        ) : tab === "join" ? (
          <OnboardingJoinForm />
        ) : (
          <OnboardingTab />
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
