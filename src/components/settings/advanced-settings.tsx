import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function AdvancedSettingsBox() {
  return (
    <div className="space-y-2">
      <Label>Data management</Label>
      <div className="flex space-x-2">
        <Button variant="outline">Export Data</Button>
        <Button variant="outline">Clear Cache</Button>
      </div>
    </div>
  );
}
