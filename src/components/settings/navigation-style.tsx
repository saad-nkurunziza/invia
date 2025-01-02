"use client";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Cookies from "js-cookie";
import { Brush, Eraser, Scissors, SwatchBook } from "lucide-react";
import type { LucideIcon } from "lucide-react";
// LucideIcon (an alias for React.ComponentType<SVGProps<SVGSVGElement>>
export type NavigationSettings = {
  state: "true" | "false";
  side: "left" | "right";
  variant: "sidebar" | "floating" | "inset";
  collapsible: "offcanvas" | "icon" | "none";
};

const defaultSettings: NavigationSettings = {
  state: "true",
  side: "left",
  variant: "sidebar",
  collapsible: "offcanvas",
};

const COOKIE_PREFIX = "sidebar:";

type OptionGroup = {
  title: string;
  description: string;
  options: {
    id: keyof NavigationSettings;
    value: string;
    label: string;
    Icon: LucideIcon;
  }[];
};

const navigationGroups: OptionGroup[] = [
  {
    title: "Layout",
    description: "Choose the sidebar layout style",
    options: [
      { id: "state", value: "open", label: "Open", Icon: Brush },
      { id: "state", value: "closed", label: "Closed", Icon: Eraser },
    ],
  },
  {
    title: "Position",
    description: "Select sidebar position",
    options: [
      { id: "side", value: "left", label: "Left", Icon: Scissors },
      { id: "side", value: "right", label: "Right", Icon: SwatchBook },
    ],
  },
  {
    title: "Display",
    description: "Choose how the sidebar appears",
    options: [
      { id: "variant", value: "default", label: "Default", Icon: Brush },
      { id: "variant", value: "compact", label: "Compact", Icon: Eraser },
    ],
  },
  {
    title: "Behavior",
    description: "Set sidebar interaction mode",
    options: [
      {
        id: "collapsible",
        value: "true",
        label: "Collapsible",
        Icon: Scissors,
      },
      {
        id: "collapsible",
        value: "false",
        label: "Non-Collapsible",
        Icon: SwatchBook,
      },
    ],
  },
];

const NavigationStyle = () => {
  const [settings, setSettings] = useState<NavigationSettings>(() => ({
    state:
      (Cookies.get(`${COOKIE_PREFIX}state`) as NavigationSettings["state"]) ||
      defaultSettings.state,
    side:
      (Cookies.get(`${COOKIE_PREFIX}side`) as NavigationSettings["side"]) ||
      defaultSettings.side,
    variant:
      (Cookies.get(
        `${COOKIE_PREFIX}variant`
      ) as NavigationSettings["variant"]) || defaultSettings.variant,
    collapsible:
      (Cookies.get(
        `${COOKIE_PREFIX}collapsible`
      ) as NavigationSettings["collapsible"]) || defaultSettings.collapsible,
  }));

  useEffect(() => {
    Object.entries(settings).forEach(([key, value]) => {
      Cookies.set(`${COOKIE_PREFIX}${key}`, value, { expires: 365 });
    });
  }, [settings]);

  const handleChange = (id: keyof NavigationSettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {navigationGroups.map((group) => (
        <div key={group.title} className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">{group.title}</h3>
            <p className="text-sm text-muted-foreground">{group.description}</p>
          </div>
          <RadioGroup className="grid grid-cols-2 gap-4">
            {group.options.map((item) => (
              <div
                key={`${item.id}-${item.value}`}
                className="relative flex flex-col gap-4 rounded-lg border p-2"
              >
                <RadioGroupItem
                  className="flex items-center gap-2"
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

export default NavigationStyle;
