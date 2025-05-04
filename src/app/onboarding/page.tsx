import OnboardingTab from "@/components/onboarding/onboarding-tab";
import OnboardingCreateForm from "@/components/onboarding/onboarding-create";
import OnboardingJoinForm from "@/components/onboarding/onboarding-join";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const OnboardingPage = async (props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user.businessId) {
    redirect("/dashboard");
  }
  const tab = searchParams.onboard as string;
  return (
    <div className="flex items-center justify-center bg-background/50">
      {tab === "create" ? (
        <OnboardingCreateForm />
      ) : tab === "join" ? (
        <OnboardingJoinForm />
      ) : (
        <OnboardingTab />
      )}
    </div>
  );
};

export default OnboardingPage;
