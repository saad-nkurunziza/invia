// "use client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import AccessibilitySettingsBox from "./accessibility-settings";
import { AdvancedSettingsBox } from "./advanced-settings";
import LanguageSelector from "./language-selector";
import NavigationStyle from "./navigation-style";
import ThemeToggler from "./theme-toggler";
import NotificationsSettingsBox from "@/components/settings/notifications-settings";
import UserProfileBox from "@/components/settings/user-profile";
import BusinessProfileBox from "@/components/settings/business-profile";

export function NotificationsSettings() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Notification Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage how and when you receive notifications
        </p>
      </div>
      <NotificationsSettingsBox />
    </div>
  );
}

export function NavigationSettings() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Navigation Settings</h2>
        <p className="text-sm text-muted-foreground">
          Customize the layout and behavior of your navigation menu
        </p>
      </div>
      <NavigationStyle />
    </div>
  );
}

export function HomeSettings() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Home Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure the appearance of your home screen
        </p>
      </div>
      <Label>
        <span className="block mt-4">Background image:</span>
        <Input type="file" className="mt-2" />
      </Label>

      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Default landing section:" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dashboard">Dashboard</SelectItem>
          <SelectItem value="profile">Profile</SelectItem>
          <SelectItem value="notifications">Notifications</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function AppearanceSettings() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Appearance Settings</h2>
        <p className="text-sm text-muted-foreground">
          Change the theme and appearance of your application
        </p>
      </div>
      <ThemeToggler />
    </div>
  );
}

export function LanguageSettings() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Language & Region</h2>
        <p className="text-sm text-muted-foreground">
          Set your preferred language and region
        </p>
      </div>
      <LanguageSelector />
    </div>
  );
}

export function AccessibilitySettings() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Accessibility Settings</h2>
        <p className="text-sm text-muted-foreground">
          Enhance usability for accessibility needs
        </p>
      </div>
      <AccessibilitySettingsBox />
    </div>
  );
}

export function UserProfileSettings() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">User profile Settings</h2>
        <p className="text-sm text-muted-foreground">
          Adjust privacy options for your profile
        </p>
      </div>
      <UserProfileBox />
    </div>
  );
}
export function BusinessProfileSettings() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Business profile Settings</h2>
        <p className="text-sm text-muted-foreground">
          Adjust privacy options for your business
        </p>
      </div>
      <BusinessProfileBox />
    </div>
  );
}

export function PrivacySettings() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Privacy Settings</h2>
        <p className="text-sm text-muted-foreground">
          Adjust privacy options for your profile
        </p>
      </div>
      <Label>
        <Input type="checkbox" className="mr-2" />
        Hide profile from search
      </Label>
    </div>
  );
}

export function AdvancedSettings() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Advanced Settings</h2>
        <p className="text-sm text-muted-foreground">For power users</p>
      </div>
      <AdvancedSettingsBox />
    </div>
  );
}
