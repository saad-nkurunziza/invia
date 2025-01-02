import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function NotificationsSettingsBox() {
  return (
    <div className="space-y-4">
      {[
        {
          id: "email",
          label: "Email notifications",
          description: "Receive notifications via email",
        },
        {
          id: "push",
          label: "Push notifications",
          description: "Receive notifications on your device",
        },
        {
          id: "sms",
          label: "SMS notifications",
          description: "Receive notifications via text message",
        },
      ].map(({ id, label, description }) => (
        <div
          key={id}
          className="flex items-start space-x-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/5"
        >
          <Checkbox id={id} className="mt-1" />
          <div className="space-y-1">
            <Label htmlFor={id} className="font-medium">
              {label}
            </Label>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
