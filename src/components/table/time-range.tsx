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

export function TableTimeRange({ path }: { path: string }) {
  const [timeRange, setTimeRange] = useState(" ");
  const router = useRouter();

  useEffect(() => {
    if (timeRange !== " ") {
      router.push(`/${path}/?t=${timeRange}`);
    } else {
      router.push(`/${path}`);
    }
  }, [timeRange, path, router]);

  const handleValueChange = (value: string) => {
    if (value === " ") {
      setTimeRange(value);
    } else {
      const numericValue = Number(value);
      if (!isNaN(numericValue)) {
        setTimeRange(value);
      }
    }
  };

  return (
    <Select value={timeRange} onValueChange={handleValueChange}>
      <SelectTrigger
        className="w-fit h-7 rounded-lg"
        aria-label="Select a value"
      >
        <SelectValue placeholder=" " />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        <SelectItem value=" " className="rounded-lg">
          Default
        </SelectItem>
        <SelectItem value="0" className="rounded-lg">
          This month
        </SelectItem>
        <SelectItem value="1" className="rounded-lg">
          Last month
        </SelectItem>
        <SelectItem value="2" className="rounded-lg">
          2 months
        </SelectItem>
        <SelectItem value="3" className="rounded-lg">
          3 months
        </SelectItem>
        <SelectItem value="6" className="rounded-lg">
          6 months
        </SelectItem>
        <SelectItem value="12" className="rounded-lg">
          1 year
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
