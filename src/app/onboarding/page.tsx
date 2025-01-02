import OnboardingTab from "@/components/onboarding/onboarding-tab";
import OnboardingCreateForm from "@/components/onboarding/onboarding-create";
import OnboardingJoinForm from "@/components/onboarding/onboarding-join";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const OnboardingPage = async (props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const session = await auth();
  if (session?.user.businessId) {
    redirect("/dashboard");
  }
  const tab = searchParams.onboard as string;
  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50 p-4">
      <div className="w-full max-w-lg backdrop-blur-sm bg-card border rounded-lg shadow-lg">
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
