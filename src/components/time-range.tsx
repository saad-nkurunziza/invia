"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function TimeRange() {
  const [timeRange, setTimeRange] = useState("1");
  const router = useRouter();

  useEffect(() => {
    router.push(`/analytics/?t=${timeRange}`);
  }, [timeRange, router]);

  return (
    <Select value={timeRange} onValueChange={setTimeRange}>
      <SelectTrigger
        className="w-[160px] rounded-lg sm:ml-auto"
        aria-label="Select a value"
      >
        <SelectValue placeholder="Last 3 months" />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        <SelectItem value="1" className="rounded-lg">
          Last month
        </SelectItem>
        <SelectItem value="2" className="rounded-lg">
          2 months
        </SelectItem>
        <SelectItem value="3" className="rounded-lg">
          3 months
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
