import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush, Briefcase, Settings, User } from "lucide-react";
import {
  AppearanceSettings,
  AdvancedSettings,
  BusinessProfileSettings,
  UserProfileSettings,
} from "@/components/settings/contents-components";
import BackButton from "@/components/back-button";
const page = () => {
  const data = {
    nav: [
      // { name: "Notifications", icon: Bell, component: NotificationsSettings },
      // { name: "Navigation", icon: Menu, component: NavigationSettings },
      // { name: "Home", icon: Home, component: HomeSettings },
      {
        name: "Business profile",
        icon: Briefcase,
        component: BusinessProfileSettings,
      },
      { name: "User profile", icon: User, component: UserProfileSettings },
      { name: "Appearance", icon: Paintbrush, component: AppearanceSettings },
      // { name: "Language & region", icon: Globe, component: LanguageSettings },
      // { name: "Accessibility", icon: Keyboard, component: AccessibilitySettings },
      // { name: "Privacy & visibility", icon: Lock, component: PrivacySettings },
      { name: "Advanced", icon: Settings, component: AdvancedSettings },
    ],
  };
  return (
    <div className="p-2 md:p-4 sm:px-6 sm:py-0">
      <div className="">
        <div className="flex gap-2">
          <BackButton />
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Preferences
          </h1>
        </div>
        <Tabs defaultValue="Notifications" className="flex h-full w-full">
          <TabsList className="flex h-full w-64 items-stretch justify-stretch flex-col border-r bg-muted/40">
            <div className="flex flex-col gap-2 p-4">
              {data.nav.map((item) => (
                <TabsTrigger
                  key={item.name}
                  value={item.name}
                  className="flex items-center justify-start w-full gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent/50 data-[state=active]:bg-accent"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </TabsTrigger>
              ))}
            </div>
          </TabsList>

          <div className="flex-1 overflow-auto">
            {data.nav.map((item) => (
              <TabsContent
                key={item.name}
                value={item.name}
                className="h-full p-6 max-h-[80vh] focus-visible:outline-hidden focus-visible:ring-0"
              >
                <div className="mx-auto pb-6 max-w-2xl space-y-6">
                  <item.component />
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default page;
