import {
  // Bell,
  // Globe,
  // Home,
  // Keyboard,
  // Lock,
  // Menu,
  Paintbrush,
  Briefcase,
  Settings,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  // HomeSettings,
  // NavigationSettings,
  // NotificationsSettings,
  AppearanceSettings,
  // LanguageSettings,
  // AccessibilitySettings,
  // PrivacySettings,
  AdvancedSettings,
  BusinessProfileSettings,
  UserProfileSettings,
} from "@/components/settings/contents-components";
import { ReactNode } from "react";

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

export function SettingsDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-full max-h-[85vh] w-full max-w-[900px] flex-col overflow-y-auto p-0">
        <div className="flex flex-1">
          <Tabs defaultValue="Notifications" className="flex h-full w-full">
            <TabsList className="flex h-full w-64 items-stretch justify-stretch flex-col border-r bg-muted/40">
              <DialogTitle className="p-4 text-sm font-medium">
                Settings
              </DialogTitle>
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
                  className="h-full p-6 max-h-[80vh] focus-visible:outline-none focus-visible:ring-0"
                >
                  <div className="mx-auto pb-6 max-w-2xl space-y-6">
                    <item.component />
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
