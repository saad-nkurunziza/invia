"use client";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Cookies from "js-cookie";
import { Type } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type AccessibilitySettings = {
  fontSize: "sm" | "md" | "lg" | "xl" | "2xl";
  contrast: "default" | "high";
  reduceMotion: "true" | "false";
};

const defaultSettings: AccessibilitySettings = {
  fontSize: "md",
  contrast: "default",
  reduceMotion: "false",
};

const COOKIE_PREFIX = "accessibility:";

type OptionGroup = {
  title: string;
  description: string;
  options: {
    id: keyof AccessibilitySettings;
    value: string;
    label: string;
    Icon: LucideIcon;
  }[];
};

const accessibilityGroups: OptionGroup[] = [
  {
    title: "Font Size",
    description: "Adjust the size of text throughout the application",
    options: [
      { id: "fontSize", value: "sm", label: "Small", Icon: Type },
      { id: "fontSize", value: "md", label: "Medium", Icon: Type },
      { id: "fontSize", value: "lg", label: "Large", Icon: Type },
      { id: "fontSize", value: "xl", label: "Extra Large", Icon: Type },
      { id: "fontSize", value: "2xl", label: "2X Large", Icon: Type },
    ],
  },
];

const AccessibilitySettings = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => ({
    fontSize:
      (Cookies.get(
        `${COOKIE_PREFIX}fontSize`
      ) as AccessibilitySettings["fontSize"]) || defaultSettings.fontSize,
    contrast:
      (Cookies.get(
        `${COOKIE_PREFIX}contrast`
      ) as AccessibilitySettings["contrast"]) || defaultSettings.contrast,
    reduceMotion:
      (Cookies.get(
        `${COOKIE_PREFIX}reduceMotion`
      ) as AccessibilitySettings["reduceMotion"]) ||
      defaultSettings.reduceMotion,
  }));

  useEffect(() => {
    Object.entries(settings).forEach(([key, value]) => {
      Cookies.set(`${COOKIE_PREFIX}${key}`, value, { expires: 365 });
    });
  }, [settings]);

  const handleChange = (id: keyof AccessibilitySettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {accessibilityGroups.map((group) => (
        <div key={group.title} className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">{group.title}</h3>
            <p className="text-sm text-muted-foreground">{group.description}</p>
          </div>
          <RadioGroup className="grid grid-cols-2 gap-4">
            {group.options.map((item) => (
              <div
                key={`${item.id}-${item.value}`}
                className="relative flex flex-col gap-4 rounded-lg border p-4"
              >
                <RadioGroupItem
                  value={item.value}
                  checked={settings[item.id] === item.value}
                  onChange={() => handleChange(item.id, item.value)}
                />
                <span className="font-medium">{item.label}</span>
                <item.Icon className="h-5 w-5" />
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
};

export default AccessibilitySettings;
